-- Fix Kansas City DMA associations
-- This will link territories in the Kansas City metro area to the Kansas City DMA

DO $$
DECLARE
  kc_dma_id UUID;
  linked_count INTEGER;
BEGIN
  -- Get the Kansas City DMA ID
  SELECT id INTO kc_dma_id
  FROM territories
  WHERE name ILIKE '%kansas city%'
    AND is_dma = true
  LIMIT 1;

  IF kc_dma_id IS NULL THEN
    RAISE EXCEPTION 'Kansas City DMA not found';
  END IF;

  RAISE NOTICE 'Found Kansas City DMA: %', kc_dma_id;

  -- Link territories in Kansas City metro area (both KS and MO states)
  -- This includes territories that:
  -- - Are in KS or MO states
  -- - Have "Kansas City" in their metro_area or name
  -- - Are NOT already DMAs
  -- - Don't already have a dma_id set
  
  UPDATE territories
  SET dma_id = kc_dma_id
  WHERE (state = 'KS' OR state = 'MO')
    AND (metro_area ILIKE '%kansas city%' OR name ILIKE '%kansas city%' OR name ILIKE '%wyandotte%')
    AND (is_dma != true OR is_dma IS NULL)
    AND (dma_id IS NULL OR dma_id != kc_dma_id);

  GET DIAGNOSTICS linked_count = ROW_COUNT;
  
  RAISE NOTICE 'Linked % territories to Kansas City DMA', linked_count;

  -- Verify the associations
  SELECT COUNT(*) INTO linked_count
  FROM territories
  WHERE dma_id = kc_dma_id
    AND (is_dma != true OR is_dma IS NULL);

  RAISE NOTICE 'Total territories now linked to Kansas City DMA: %', linked_count;

END $$;

-- Verification: Show all territories now linked to Kansas City DMA
WITH kc_dma AS (
  SELECT id as dma_id, name as dma_name
  FROM territories
  WHERE name ILIKE '%kansas city%'
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
CROSS JOIN kc_dma d
WHERE t.dma_id = d.dma_id
ORDER BY t.state, t.name;

