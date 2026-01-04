-- Check Kansas City DMA and its linked territories

-- 1. Find the Kansas City DMA
SELECT id, name, state, is_dma, status
FROM territories
WHERE name ILIKE '%kansas city%'
  AND is_dma = true;

-- 2. Check how many territories are currently linked to Kansas City DMA
WITH kc_dma AS (
  SELECT id as dma_id, name as dma_name
  FROM territories
  WHERE name ILIKE '%kansas city%'
    AND is_dma = true
  LIMIT 1
)
SELECT 
  d.dma_id,
  d.dma_name,
  COUNT(t.id) as linked_territory_count
FROM kc_dma d
LEFT JOIN territories t ON t.dma_id = d.dma_id AND (t.is_dma != true OR t.is_dma IS NULL)
GROUP BY d.dma_id, d.dma_name;

-- 3. List all territories in Kansas City metro area that might need to be linked
SELECT 
  id,
  name,
  state,
  metro_area,
  is_dma,
  dma_id,
  status
FROM territories
WHERE (state = 'KS' OR state = 'MO')
  AND (metro_area ILIKE '%kansas city%' OR name ILIKE '%kansas city%' OR name ILIKE '%wyandotte%')
  AND (is_dma != true OR is_dma IS NULL)
ORDER BY state, name
LIMIT 50;

-- 4. Check specifically for Wyandotte County territories
SELECT 
  id,
  name,
  state,
  metro_area,
  is_dma,
  dma_id,
  status
FROM territories
WHERE name ILIKE '%wyandotte%'
  AND (is_dma != true OR is_dma IS NULL);




