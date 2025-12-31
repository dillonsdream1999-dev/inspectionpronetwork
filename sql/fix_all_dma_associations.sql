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
  primary_name TEXT;
  linked_count INTEGER;
  total_linked INTEGER := 0;
  second_city TEXT;
  third_city TEXT;
  full_name TEXT;
BEGIN
  -- Loop through all DMAs
  FOR dma_record IN 
    SELECT id, name, state
    FROM territories
    WHERE is_dma = true
    ORDER BY name
  LOOP
    linked_count := 0;
    
    -- Extract primary name from DMA (remove "DMA" and extra words, handle various formats)
    -- Example: "Wichita–Hutchinson DMA" -> "Wichita"
    -- Example: "Sacramento–Stockton–Modesto DMA" -> "Sacramento"
    -- Example: "Alexandria, LA DMA" -> "Alexandria"
    -- Example: "Portland, OR DMA" -> "Portland"
    primary_name := TRIM(REGEXP_REPLACE(dma_record.name, '\s*DMA\s*$', '', 'i'));
    
    -- Handle comma-separated format (e.g., "Alexandria, LA DMA")
    IF primary_name LIKE '%,%' THEN
      primary_name := TRIM(SPLIT_PART(primary_name, ',', 1));
    ELSE
      -- Handle dash/hyphen-separated format (e.g., "Flint–Saginaw–Bay City DMA")
      primary_name := SPLIT_PART(primary_name, '–', 1);  -- Take first part before en-dash
      primary_name := SPLIT_PART(primary_name, '-', 1);  -- Take first part before hyphen
      primary_name := TRIM(primary_name);
    END IF;
    
    -- Skip if we couldn't extract a meaningful name
    IF LENGTH(primary_name) < 3 THEN
      CONTINUE;
    END IF;
    
    -- Link territories that match the DMA's primary name and state
    -- Try matching on the primary name first
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
    
    -- For complex multi-city names, try matching on additional city names if primary didn't match
    -- Example: "Flint–Saginaw–Bay City DMA" - try "Saginaw" and "Bay City" if "Flint" didn't match
    IF linked_count = 0 AND dma_record.name LIKE '%–%' THEN
      full_name := TRIM(REGEXP_REPLACE(dma_record.name, '\s*DMA\s*$', '', 'i'));
      
      -- Try second city (e.g., "Saginaw" from "Flint–Saginaw–Bay City")
      IF full_name LIKE '%–%' THEN
        second_city := TRIM(SPLIT_PART(SPLIT_PART(full_name, '–', 2), '–', 1));
        IF LENGTH(second_city) >= 3 THEN
          UPDATE territories
          SET dma_id = dma_record.id
          WHERE state = dma_record.state
            AND (is_dma != true OR is_dma IS NULL)
            AND (dma_id IS NULL)
            AND (
              name ILIKE '%' || second_city || '%'
              OR metro_area ILIKE '%' || second_city || '%'
            );
          GET DIAGNOSTICS linked_count = ROW_COUNT;
        END IF;
      END IF;
      
      -- Try third city if second didn't work (e.g., "Bay City" from "Flint–Saginaw–Bay City")
      IF linked_count = 0 AND full_name LIKE '%–%–%' THEN
        third_city := TRIM(SPLIT_PART(full_name, '–', 3));
        IF LENGTH(third_city) >= 3 THEN
          UPDATE territories
          SET dma_id = dma_record.id
          WHERE state = dma_record.state
            AND (is_dma != true OR is_dma IS NULL)
            AND (dma_id IS NULL)
            AND (
              name ILIKE '%' || third_city || '%'
              OR metro_area ILIKE '%' || third_city || '%'
            );
          GET DIAGNOSTICS linked_count = ROW_COUNT;
        END IF;
      END IF;
    END IF;
    
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

