-- SQL to identify and fix Wichita Falls, TX incorrectly linked to Wichita, KS DMA
-- 
-- Step 1: Find Wichita Falls and see what DMA it's linked to
SELECT 
  t.id,
  t.name,
  t.state,
  t.metro_area,
  t.dma_id,
  dma.name as dma_name,
  dma.state as dma_state
FROM territories t
LEFT JOIN territories dma ON t.dma_id = dma.id
WHERE t.name ILIKE '%wichita falls%'
   OR (t.name ILIKE '%wichita%' AND t.state = 'TX');

-- Step 2: Find the Wichita, Kansas DMA ID
SELECT 
  id,
  name,
  state,
  is_dma
FROM territories
WHERE name ILIKE '%wichita%hutchinson%'
  AND is_dma = true
  AND state = 'KS';

-- Step 3: Fix Wichita Falls, TX - remove incorrect DMA link
-- First, let's see all territories incorrectly linked to the Wichita, KS DMA that are in TX
SELECT 
  t.id,
  t.name,
  t.state,
  t.dma_id,
  dma.name as dma_name,
  dma.state as dma_state
FROM territories t
JOIN territories dma ON t.dma_id = dma.id
WHERE dma.name ILIKE '%wichita%hutchinson%'
  AND dma.is_dma = true
  AND dma.state = 'KS'
  AND t.state = 'TX';  -- Territories in TX linked to KS DMA

-- Step 4: Find the CORRECT DMA for Wichita Falls, TX
-- Wichita Falls, TX should be in the Wichita Falls-Lawton DMA (Texas/Oklahoma)
-- Let's find all DMAs that might be correct for Wichita Falls, TX
SELECT 
  id,
  name,
  state,
  metro_area,
  is_dma
FROM territories
WHERE is_dma = true
  AND (
    name ILIKE '%wichita falls%'
    OR name ILIKE '%lawton%'
    OR (name ILIKE '%wichita%' AND state = 'TX')
  )
ORDER BY name;

-- Step 5: Remove the incorrect DMA link for Wichita Falls, TX
UPDATE territories
SET dma_id = NULL
WHERE name ILIKE '%wichita falls%'
  AND state = 'TX'
  AND dma_id IN (
    SELECT id FROM territories 
    WHERE name ILIKE '%wichita%hutchinson%' 
      AND is_dma = true 
      AND state = 'KS'
  );

-- Step 6: Link Wichita Falls, TX to the CORRECT DMA
-- Replace 'CORRECT_DMA_ID' with the ID from Step 4 (the Wichita Falls-Lawton DMA)
-- If no DMA exists, you may need to create one or leave it unlinked
UPDATE territories
SET dma_id = (
  SELECT id FROM territories 
  WHERE is_dma = true 
    AND (
      name ILIKE '%wichita falls%lawton%'
      OR (name ILIKE '%wichita falls%' AND state IN ('TX', 'OK'))
      OR (name ILIKE '%lawton%' AND state IN ('TX', 'OK'))
    )
  LIMIT 1
)
WHERE name ILIKE '%wichita falls%'
  AND state = 'TX'
  AND dma_id IS NULL;

-- Step 7: Verify the fix
SELECT 
  t.id,
  t.name,
  t.state,
  t.dma_id,
  dma.name as dma_name,
  dma.state as dma_state,
  CASE 
    WHEN t.dma_id IS NULL THEN 'No DMA link'
    WHEN dma.state = t.state OR dma.state IN ('TX', 'OK') THEN 'Correctly linked'
    ELSE 'Incorrectly linked'
  END as status
FROM territories t
LEFT JOIN territories dma ON t.dma_id = dma.id
WHERE t.name ILIKE '%wichita falls%'
  AND t.state = 'TX';

