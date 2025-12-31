-- SQL Script to Fix All Cross-State DMA Links
-- This script removes DMA links where the territory state doesn't match the DMA state
-- 
-- IMPORTANT: This will remove ALL cross-state DMA links. After running this,
-- you may need to manually review and re-link territories to the correct DMAs
-- based on actual DMA boundaries (which can span multiple states in some cases).

-- Step 1: View all territories with cross-state DMA links (for review)
SELECT 
  t.id,
  t.name as territory_name,
  t.state as territory_state,
  t.dma_id,
  dma.name as dma_name,
  dma.state as dma_state,
  CASE 
    WHEN t.state != dma.state THEN 'CROSS-STATE MISMATCH'
    ELSE 'OK'
  END as status
FROM territories t
JOIN territories dma ON t.dma_id = dma.id
WHERE dma.is_dma = true
  AND t.state != dma.state
ORDER BY t.state, dma.state, t.name;

-- Step 2: Count how many territories will be affected
SELECT 
  COUNT(*) as territories_to_fix,
  COUNT(DISTINCT t.state) as territory_states_affected,
  COUNT(DISTINCT dma.state) as dma_states_affected
FROM territories t
JOIN territories dma ON t.dma_id = dma.id
WHERE dma.is_dma = true
  AND t.state != dma.state;

-- Step 3: Remove all cross-state DMA links
-- This sets dma_id to NULL for all territories linked to DMAs in different states
UPDATE territories
SET dma_id = NULL
WHERE dma_id IN (
  SELECT dma.id
  FROM territories t
  JOIN territories dma ON t.dma_id = dma.id
  WHERE dma.is_dma = true
    AND t.state != dma.state
);

-- Step 4: Verify the fix - should return 0 rows
SELECT 
  COUNT(*) as remaining_cross_state_links
FROM territories t
JOIN territories dma ON t.dma_id = dma.id
WHERE dma.is_dma = true
  AND t.state != dma.state;

-- Step 5: Summary of territories now without DMA links
SELECT 
  t.state,
  COUNT(*) as territories_without_dma
FROM territories t
WHERE t.dma_id IS NULL
  AND (t.is_dma IS NULL OR t.is_dma = false)
GROUP BY t.state
ORDER BY t.state;

-- NOTE: Some DMAs legitimately span multiple states (e.g., Kansas City DMA covers both KS and MO).
-- If you have territories that SHOULD be linked to a DMA in a different state, you'll need to
-- manually re-link them after running this script. For example:
-- 
-- UPDATE territories
-- SET dma_id = 'KANSAS_CITY_DMA_ID'
-- WHERE name IN ('Johnson County', 'Wyandotte County', 'Kansas City KS')
--   AND state = 'KS';

