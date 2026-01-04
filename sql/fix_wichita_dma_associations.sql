-- Fix Wichita-Hutchinson DMA associations
-- This script will link territories to the Wichita-Hutchinson DMA based on name/metro matching

-- Step 1: Identify the DMA ID
DO $$
DECLARE
  wichita_dma_id UUID;
  linked_count INTEGER;
BEGIN
  -- Get the Wichita-Hutchinson DMA ID
  SELECT id INTO wichita_dma_id
  FROM territories
  WHERE name ILIKE '%wichita%hutchinson%'
    AND is_dma = true
  LIMIT 1;

  IF wichita_dma_id IS NULL THEN
    RAISE EXCEPTION 'Wichita-Hutchinson DMA not found';
  END IF;

  RAISE NOTICE 'Found Wichita-Hutchinson DMA: %', wichita_dma_id;

  -- Step 2: Link territories in Kansas that match Wichita area
  -- This will update territories that:
  -- - Are in Kansas (KS)
  -- - Have "Wichita" in their name or metro_area
  -- - Are NOT already DMAs (is_dma != true)
  -- - Don't already have a dma_id set (or have it set to null)
  
  UPDATE territories
  SET dma_id = wichita_dma_id
  WHERE state = 'KS'
    AND (name ILIKE '%wichita%' OR metro_area ILIKE '%wichita%')
    AND (is_dma != true OR is_dma IS NULL)
    AND (dma_id IS NULL OR dma_id != wichita_dma_id);

  GET DIAGNOSTICS linked_count = ROW_COUNT;
  
  RAISE NOTICE 'Linked % territories to Wichita-Hutchinson DMA', linked_count;

  -- Step 3: Verify the associations
  SELECT COUNT(*) INTO linked_count
  FROM territories
  WHERE dma_id = wichita_dma_id
    AND (is_dma != true OR is_dma IS NULL);

  RAISE NOTICE 'Total territories now linked to Wichita-Hutchinson DMA: %', linked_count;

END $$;

-- Verification query: Show all territories now linked to Wichita-Hutchinson DMA
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
  t.dma_id,
  t.status
FROM territories t
CROSS JOIN wichita_dma d
WHERE t.dma_id = d.dma_id
ORDER BY t.name;




