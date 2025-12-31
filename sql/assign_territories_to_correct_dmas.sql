-- SQL Script to Assign Territories to Correct DMAs
-- This script requires you to provide the correct DMA mappings
-- 
-- OPTION 1: If you have a CSV or table with correct mappings, import it first
-- Then use this script to update the territories

-- Step 1: Create a temporary table for correct DMA mappings
-- You'll need to populate this with the correct territory-to-DMA relationships
DROP TABLE IF EXISTS temp_correct_dma_mappings;

CREATE TABLE temp_correct_dma_mappings (
  territory_id UUID,
  territory_name TEXT,
  territory_state TEXT,
  correct_dma_id UUID,
  correct_dma_name TEXT,
  correct_dma_state TEXT
);

-- IMPORTANT: Import your correct DMA mapping data into temp_correct_dma_mappings
-- This could be from a CSV, manual entry, or another data source
-- 
-- Example structure:
-- territory_id | territory_name | territory_state | correct_dma_id | correct_dma_name | correct_dma_state
-- ---------------------------------------------------------------------------------------------------------
-- uuid-123     | Johnson County | KS              | uuid-456       | Kansas City DMA  | MO
-- uuid-789     | Wyandotte Cty  | KS              | uuid-456       | Kansas City DMA  | MO

-- Step 2: Verify the mapping data before applying
SELECT 
  m.territory_name,
  m.territory_state,
  m.correct_dma_name,
  m.correct_dma_state,
  CASE 
    WHEN t.id IS NULL THEN 'Territory not found'
    WHEN dma.id IS NULL THEN 'DMA not found'
    WHEN t.dma_id = m.correct_dma_id THEN 'Already correct'
    ELSE 'Needs update'
  END as status
FROM temp_correct_dma_mappings m
LEFT JOIN territories t ON m.territory_id = t.id
LEFT JOIN territories dma ON m.correct_dma_id = dma.id
ORDER BY m.territory_state, m.territory_name;

-- Step 3: Update territories with correct DMA assignments
UPDATE territories t
SET dma_id = m.correct_dma_id
FROM temp_correct_dma_mappings m
WHERE t.id = m.territory_id
  AND m.correct_dma_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM territories dma 
    WHERE dma.id = m.correct_dma_id 
      AND dma.is_dma = true
  );

-- Step 4: Verify the updates
SELECT 
  t.name as territory_name,
  t.state as territory_state,
  dma.name as dma_name,
  dma.state as dma_state,
  CASE 
    WHEN t.dma_id IS NULL THEN 'No DMA assigned'
    WHEN t.state = dma.state THEN 'Same state - OK'
    WHEN t.state != dma.state THEN 'Cross-state - verify if correct'
    ELSE 'Unknown'
  END as status
FROM territories t
LEFT JOIN territories dma ON t.dma_id = dma.id
WHERE t.dma_id IS NOT NULL
  AND (t.is_dma IS NULL OR t.is_dma = false)
ORDER BY t.state, t.name;

-- OPTION 2: If you want to assign based on DMA name matching (less accurate)
-- This tries to match territories to DMAs by name similarity and state
-- WARNING: This is a heuristic approach and may not be 100% accurate

-- Example: Assign territories to DMAs with matching metro area names
UPDATE territories t
SET dma_id = (
  SELECT dma.id
  FROM territories dma
  WHERE dma.is_dma = true
    AND (
      -- Match by metro area name
      (t.metro_area IS NOT NULL AND dma.metro_area IS NOT NULL 
       AND LOWER(t.metro_area) = LOWER(dma.metro_area))
      OR
      -- Match by state and similar name
      (t.state = dma.state 
       AND LOWER(t.metro_area) LIKE '%' || LOWER(SPLIT_PART(dma.name, ' DMA', 1)) || '%')
    )
  LIMIT 1
)
WHERE t.dma_id IS NULL
  AND (t.is_dma IS NULL OR t.is_dma = false)
  AND t.metro_area IS NOT NULL;

-- OPTION 3: Manual assignment for specific cases
-- Example: Assign Kansas territories to Kansas City DMA (which is in MO but covers KS too)
-- 
-- UPDATE territories
-- SET dma_id = (
--   SELECT id FROM territories 
--   WHERE name = 'Kansas City DMA' 
--     AND is_dma = true
-- )
-- WHERE state = 'KS'
--   AND metro_area ILIKE '%kansas city%'
--   AND dma_id IS NULL;

-- Clean up temporary table when done
-- DROP TABLE IF EXISTS temp_correct_dma_mappings;

