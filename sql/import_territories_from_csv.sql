-- SQL Script to Import/Update Territories from CSV
-- This script handles both DMAs and individual territories with their relationships
-- 
-- IMPORTANT: Before running this script:
-- 1. Create the temp table (this script will do it)
-- 2. Import your CSV into the temp_territories_import table using Supabase Table Editor
-- 3. Run this script to process and update the territories table

-- Step 1: Create the temporary table to import the CSV
-- Drop it first if it exists (in case you need to re-run)
DROP TABLE IF EXISTS temp_territories_import;

CREATE TABLE temp_territories_import (
  id UUID,
  name TEXT,
  state TEXT,
  metro_area TEXT,
  status TEXT,
  type TEXT,
  population_est NUMERIC,
  zip_codes TEXT,  -- This is a string that may contain comma-separated values
  is_dma TEXT,     -- 'True' or 'False' as text
  dma_id UUID,
  zip_list TEXT,  -- Appears to be empty in CSV
  actual_pop NUMERIC,
  zip_count_child INTEGER
);

-- IMPORTANT: At this point, you need to import your CSV data into temp_territories_import
-- Go to Supabase Table Editor → temp_territories_import → Insert → Import data from CSV
-- After importing the CSV, continue with the rest of this script below

-- Step 2: Verify CSV data was imported (optional check)
-- Uncomment the line below to see how many rows were imported
-- SELECT COUNT(*) as imported_rows FROM temp_territories_import;

-- Step 3: Process and import the territories
-- First, ensure the territories table has the necessary columns
-- (These should already exist from previous migrations, but checking won't hurt)
DO $$ 
BEGIN
  -- Add is_dma column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'territories' AND column_name = 'is_dma'
  ) THEN
    ALTER TABLE territories ADD COLUMN is_dma BOOLEAN DEFAULT FALSE;
  END IF;

  -- Add dma_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'territories' AND column_name = 'dma_id'
  ) THEN
    ALTER TABLE territories ADD COLUMN dma_id UUID REFERENCES territories(id);
  END IF;
END $$;

-- Function to parse zip codes from string to array
-- Handles single zip codes, comma-separated zip codes, and empty strings
CREATE OR REPLACE FUNCTION parse_zip_codes(zip_string TEXT)
RETURNS TEXT[] AS $$
BEGIN
  -- Return empty array if null or empty
  IF zip_string IS NULL OR TRIM(zip_string) = '' THEN
    RETURN ARRAY[]::TEXT[];
  END IF;
  
  -- Split by comma and trim whitespace, filter out empty strings
  RETURN ARRAY(
    SELECT TRIM(unnest(string_to_array(zip_string, ',')))
    WHERE TRIM(unnest(string_to_array(zip_string, ','))) != ''
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update or insert territories
-- This uses INSERT ... ON CONFLICT to handle both new and existing territories
INSERT INTO territories (
  id,
  name,
  state,
  metro_area,
  status,
  type,
  population_est,
  zip_codes,
  is_dma,
  dma_id,
  created_at
)
SELECT 
  t.id,
  t.name,
  t.state,
  NULLIF(TRIM(t.metro_area), ''),
  CASE 
    WHEN t.status IN ('available', 'taken', 'held') THEN t.status::territory_status
    ELSE 'available'::territory_status
  END,
  CASE 
    WHEN t.type IN ('metro', 'rural') THEN t.type::territory_type
    ELSE 'metro'::territory_type
  END,
  COALESCE(t.actual_pop::INTEGER, t.population_est::INTEGER, 0),
  parse_zip_codes(t.zip_codes),
  CASE 
    WHEN UPPER(TRIM(t.is_dma)) = 'TRUE' THEN TRUE
    ELSE FALSE
  END,
  NULLIF(t.dma_id, NULL),
  COALESCE(
    (SELECT created_at FROM territories WHERE id = t.id),
    NOW()
  )
FROM temp_territories_import t
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  state = EXCLUDED.state,
  metro_area = EXCLUDED.metro_area,
  -- Only update status if it's not currently 'taken' (preserve active subscriptions)
  status = CASE 
    WHEN territories.status = 'taken' THEN territories.status
    ELSE EXCLUDED.status
  END,
  type = EXCLUDED.type,
  population_est = EXCLUDED.population_est,
  zip_codes = EXCLUDED.zip_codes,
  is_dma = EXCLUDED.is_dma,
  dma_id = EXCLUDED.dma_id;

-- Verify DMA relationships
-- Check that all dma_id references point to actual DMA territories
DO $$
DECLARE
  invalid_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO invalid_count
  FROM territories t
  WHERE t.dma_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM territories d
      WHERE d.id = t.dma_id AND d.is_dma = TRUE
    );
  
  IF invalid_count > 0 THEN
    RAISE WARNING 'Found % individual territories with invalid dma_id references', invalid_count;
  END IF;
END $$;

-- Summary query to verify the import
SELECT 
  'Total Territories' as metric,
  COUNT(*)::TEXT as value
FROM territories
UNION ALL
SELECT 
  'DMAs' as metric,
  COUNT(*)::TEXT as value
FROM territories
WHERE is_dma = TRUE
UNION ALL
SELECT 
  'Individual Territories' as metric,
  COUNT(*)::TEXT as value
FROM territories
WHERE is_dma = FALSE OR is_dma IS NULL
UNION ALL
SELECT 
  'Territories with DMA Link' as metric,
  COUNT(*)::TEXT as value
FROM territories
WHERE dma_id IS NOT NULL
UNION ALL
SELECT 
  'Territories with Zip Codes' as metric,
  COUNT(*)::TEXT as value
FROM territories
WHERE array_length(zip_codes, 1) > 0
UNION ALL
SELECT 
  'Territories without Zip Codes' as metric,
  COUNT(*)::TEXT as value
FROM territories
WHERE zip_codes IS NULL OR array_length(zip_codes, 1) IS NULL OR array_length(zip_codes, 1) = 0;

-- Clean up temporary function (optional)
-- DROP FUNCTION IF EXISTS parse_zip_codes(TEXT);

