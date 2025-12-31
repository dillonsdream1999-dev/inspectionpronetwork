-- Check DMA associations for a specific DMA
-- Replace 'YOUR_DMA_ID' with the actual DMA territory ID you want to check

-- First, find the DMA territory ID for "Wichita-Hutchinson DMA"
SELECT id, name, state, is_dma, dma_id
FROM territories
WHERE name ILIKE '%wichita%hutchinson%'
  AND is_dma = true;

-- Then check how many individual territories are linked to this DMA
-- Replace 'DMA_ID_HERE' with the ID from the query above
SELECT 
  COUNT(*) as linked_territory_count,
  COUNT(CASE WHEN is_dma = false THEN 1 END) as non_dma_count,
  COUNT(CASE WHEN is_dma IS NULL THEN 1 END) as null_is_dma_count,
  COUNT(CASE WHEN is_dma = true THEN 1 END) as dma_count
FROM territories
WHERE dma_id = 'DMA_ID_HERE';  -- Replace with actual DMA ID

-- List all territories linked to this DMA (first 20)
SELECT 
  id, 
  name, 
  state, 
  is_dma,
  dma_id,
  status
FROM territories
WHERE dma_id = 'DMA_ID_HERE'  -- Replace with actual DMA ID
ORDER BY name
LIMIT 20;

-- Check all DMAs and their linked territory counts
SELECT 
  dma.id as dma_id,
  dma.name as dma_name,
  dma.state as dma_state,
  COUNT(t.id) as linked_territory_count,
  COUNT(CASE WHEN t.status = 'taken' THEN 1 END) as taken_count,
  COUNT(CASE WHEN t.status = 'available' THEN 1 END) as available_count
FROM territories dma
LEFT JOIN territories t ON t.dma_id = dma.id AND t.is_dma != true
WHERE dma.is_dma = true
GROUP BY dma.id, dma.name, dma.state
ORDER BY linked_territory_count DESC
LIMIT 20;

-- Check for territories with dma_id that doesn't match any actual DMA
SELECT 
  t.id,
  t.name,
  t.state,
  t.dma_id,
  t.is_dma
FROM territories t
WHERE t.dma_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 
    FROM territories dma 
    WHERE dma.id = t.dma_id 
      AND dma.is_dma = true
  )
LIMIT 20;

