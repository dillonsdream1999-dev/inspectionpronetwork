-- Comprehensive script to fix DMA associations for ALL DMAs
-- This script links territories to DMAs based on matching name/metro and state

-- First, let's see which DMAs have 0 linked territories
SELECT 
  dma.id as dma_id,
  dma.name as dma_name,
  dma.state as dma_state,
  COUNT(t.id) as linked_territory_count
FROM territories dma
LEFT JOIN territories t ON t.dma_id = dma.id AND (t.is_dma != true OR t.is_dma IS NULL)
WHERE dma.is_dma = true
GROUP BY dma.id, dma.name, dma.state
HAVING COUNT(t.id) = 0
ORDER BY dma.name;

-- ============================================
-- FIX SCRIPT: Link territories to DMAs based on name/metro matching
-- ============================================
-- This script will attempt to link territories to DMAs by:
-- 1. Extracting the primary city/area name from the DMA name
-- 2. Finding territories in the same state with matching names/metro areas
-- 3. Linking them if they don't already have a dma_id

DO $$
DECLARE
  dma_record RECORD;
  territory_record RECORD;
  primary_name TEXT;
  linked_count INTEGER;
  total_linked INTEGER := 0;
BEGIN
  -- Loop through all DMAs
  FOR dma_record IN 
    SELECT id, name, state
    FROM territories
    WHERE is_dma = true
    ORDER BY name
  LOOP
    linked_count := 0;
    
    -- Extract primary name from DMA (remove "DMA" and extra words, handle hyphenated names)
    -- Example: "Wichita–Hutchinson DMA" -> "Wichita"
    -- Example: "Sacramento–Stockton–Modesto DMA" -> "Sacramento"
    primary_name := TRIM(REGEXP_REPLACE(dma_record.name, '\s*DMA\s*$', '', 'i'));
    primary_name := SPLIT_PART(primary_name, '–', 1);  -- Take first part before en-dash
    primary_name := SPLIT_PART(primary_name, '-', 1);  -- Take first part before hyphen
    primary_name := TRIM(primary_name);
    
    -- Skip if we couldn't extract a meaningful name
    IF LENGTH(primary_name) < 3 THEN
      CONTINUE;
    END IF;
    
    -- Link territories that match the DMA's primary name and state
    UPDATE territories
    SET dma_id = dma_record.id
    WHERE state = dma_record.state
      AND (is_dma != true OR is_dma IS NULL)
      AND (dma_id IS NULL)
      AND (
        name ILIKE '%' || primary_name || '%'
        OR metro_area ILIKE '%' || primary_name || '%'
      );
    
    GET DIAGNOSTICS linked_count = ROW_COUNT;
    
    IF linked_count > 0 THEN
      total_linked := total_linked + linked_count;
      RAISE NOTICE 'Linked % territories to % (%, state: %)', 
        linked_count, dma_record.name, primary_name, dma_record.state;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'Total territories linked across all DMAs: %', total_linked;
END $$;

-- Verification: Show DMAs and their linked territory counts after the fix
SELECT 
  dma.id as dma_id,
  dma.name as dma_name,
  dma.state as dma_state,
  COUNT(t.id) as linked_territory_count,
  COUNT(CASE WHEN t.status = 'taken' THEN 1 END) as taken_count,
  COUNT(CASE WHEN t.status = 'available' THEN 1 END) as available_count
FROM territories dma
LEFT JOIN territories t ON t.dma_id = dma.id AND (t.is_dma != true OR t.is_dma IS NULL)
WHERE dma.is_dma = true
GROUP BY dma.id, dma.name, dma.state
ORDER BY linked_territory_count DESC, dma.name
LIMIT 100;

-- Show DMAs that STILL have 0 linked territories (may need manual review)
SELECT 
  dma.id as dma_id,
  dma.name as dma_name,
  dma.state as dma_state,
  COUNT(t.id) as linked_territory_count
FROM territories dma
LEFT JOIN territories t ON t.dma_id = dma.id AND (t.is_dma != true OR t.is_dma IS NULL)
WHERE dma.is_dma = true
GROUP BY dma.id, dma.name, dma.state
HAVING COUNT(t.id) = 0
ORDER BY dma.name;

