-- Check Kansas City DMA status and ownership

-- 1. Check the DMA's status in the territories table
SELECT id, name, state, is_dma, status
FROM territories
WHERE name ILIKE '%kansas city%'
  AND is_dma = true;

-- 2. Check if the DMA has an active ownership record
WITH kc_dma AS (
  SELECT id as dma_id
  FROM territories
  WHERE name ILIKE '%kansas city%'
    AND is_dma = true
  LIMIT 1
)
SELECT 
  ownership.id,
  ownership.territory_id,
  ownership.company_id,
  ownership.status as ownership_status,
  ownership.started_at,
  t.name as territory_name,
  t.status as territory_status
FROM territory_ownership ownership
CROSS JOIN kc_dma d
JOIN territories t ON t.id = ownership.territory_id
WHERE ownership.territory_id = d.dma_id
  AND ownership.status = 'active';

