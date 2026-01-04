-- Comprehensive diagnostic queries to understand the DMA association issue

-- 1. Check if the DMA exists
SELECT id, name, state, is_dma, dma_id, status
FROM territories
WHERE name ILIKE '%wichita%hutchinson%'
  AND is_dma = true;

-- 2. Check ALL DMAs and see how many have linked territories (most important query)
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
ORDER BY linked_territory_count DESC
LIMIT 50;

-- 3. Count total territories with dma_id set
SELECT 
  COUNT(*) as total_territories_with_dma_id,
  COUNT(DISTINCT dma_id) as unique_dma_ids_referenced
FROM territories
WHERE dma_id IS NOT NULL;

-- 4. Sample of territories that SHOULD be linked (if CSV had parent_dma column)
-- This shows territories that might need dma_id set
SELECT 
  id,
  name,
  state,
  metro_area,
  is_dma,
  dma_id,
  status
FROM territories
WHERE is_dma != true 
  AND dma_id IS NULL
  AND (name ILIKE '%wichita%' OR metro_area ILIKE '%wichita%')
LIMIT 20;

-- 5. Check for any territories that DO have dma_id set (to see the pattern)
SELECT 
  id,
  name,
  state,
  is_dma,
  dma_id,
  status
FROM territories
WHERE dma_id IS NOT NULL
LIMIT 20;




