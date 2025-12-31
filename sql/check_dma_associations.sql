-- Check DMA associations for a specific DMA

-- First, find the DMA territory ID for "Wichita-Hutchinson DMA"
-- Run this query first to get the DMA ID, then use it in the queries below
SELECT id, name, state, is_dma, dma_id
FROM territories
WHERE name ILIKE '%wichita%hutchinson%'
  AND is_dma = true;

-- ============================================
-- After getting the DMA ID from above, use one of these queries:
-- ============================================

-- Option 1: Use a CTE to check a specific DMA by name
WITH dma_info AS (
  SELECT id as dma_id, name as dma_name
  FROM territories
  WHERE name ILIKE '%wichita%hutchinson%'
    AND is_dma = true
  LIMIT 1
)
SELECT 
  COUNT(*) as linked_territory_count,
  COUNT(CASE WHEN is_dma = false THEN 1 END) as non_dma_count,
  COUNT(CASE WHEN is_dma IS NULL THEN 1 END) as null_is_dma_count,
  COUNT(CASE WHEN is_dma = true THEN 1 END) as dma_count
FROM territories t
CROSS JOIN dma_info d
WHERE t.dma_id = d.dma_id;

-- Option 2: List all territories linked to "Wichita-Hutchinson DMA" (first 20)
WITH dma_info AS (
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
  t.is_dma,
  t.dma_id,
  t.status,
  d.dma_name
FROM territories t
CROSS JOIN dma_info d
WHERE t.dma_id = d.dma_id
ORDER BY t.name
LIMIT 20;

-- Check all DMAs and their linked territory counts
-- This shows which DMAs have the most/fewest linked territories
SELECT 
  dma.id as dma_id,
  dma.name as dma_name,
  dma.state as dma_state,
  COUNT(t.id) as linked_territory_count,
  COUNT(CASE WHEN t.status = 'taken' THEN 1 END) as taken_count,
  COUNT(CASE WHEN t.status = 'available' THEN 1 END) as available_count,
  COUNT(CASE WHEN t.status = 'held' THEN 1 END) as held_count
FROM territories dma
LEFT JOIN territories t ON t.dma_id = dma.id AND (t.is_dma != true OR t.is_dma IS NULL)
WHERE dma.is_dma = true
GROUP BY dma.id, dma.name, dma.state
ORDER BY linked_territory_count DESC
LIMIT 50;

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

