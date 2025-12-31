-- Check specifically for Wichita-Hutchinson DMA and its linked territories

-- 1. Find the Wichita-Hutchinson DMA
SELECT id, name, state, is_dma, dma_id, status
FROM territories
WHERE name ILIKE '%wichita%' 
  AND is_dma = true;

-- 2. Check how many territories are linked to Wichita-Hutchinson DMA
WITH wichita_dma AS (
  SELECT id as dma_id, name as dma_name
  FROM territories
  WHERE name ILIKE '%wichita%hutchinson%'
    AND is_dma = true
  LIMIT 1
)
SELECT 
  d.dma_id,
  d.dma_name,
  COUNT(t.id) as linked_territory_count,
  COUNT(CASE WHEN t.status = 'taken' THEN 1 END) as taken_count,
  COUNT(CASE WHEN t.status = 'available' THEN 1 END) as available_count
FROM wichita_dma d
LEFT JOIN territories t ON t.dma_id = d.dma_id AND (t.is_dma != true OR t.is_dma IS NULL)
GROUP BY d.dma_id, d.dma_name;

-- 3. List all territories that should be linked to Wichita-Hutchinson DMA
WITH wichita_dma AS (
  SELECT id as dma_id, name as dma_name
  FROM territories
  WHERE name ILIKE '%wichita%hutchinson%'
    AND is_dma = true
  LIMIT 1
)
SELECT 
  t.id, 
  t.name, 
  t.state,
  t.metro_area,
  t.is_dma,
  t.dma_id,
  t.status
FROM territories t
CROSS JOIN wichita_dma d
WHERE t.dma_id = d.dma_id
ORDER BY t.name;

-- 4. Check if there are territories in Kansas/Wichita area that might need to be linked
SELECT 
  id,
  name,
  state,
  metro_area,
  is_dma,
  dma_id,
  status
FROM territories
WHERE (state = 'KS' AND (name ILIKE '%wichita%' OR metro_area ILIKE '%wichita%'))
  AND (is_dma != true OR is_dma IS NULL)
ORDER BY name
LIMIT 30;

