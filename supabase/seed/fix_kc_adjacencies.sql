-- Fix Kansas City MO adjacent territories
-- Run this in Supabase SQL Editor

-- First, let's see what "Kansas City MO" has
SELECT id, name, adjacent_ids 
FROM territories 
WHERE name LIKE '%Kansas City%' AND state = 'MO'
ORDER BY name;

-- Update "Kansas City MO" to be adjacent to all KC metro territories
UPDATE territories 
SET adjacent_ids = ARRAY(
  SELECT id FROM territories 
  WHERE state = 'MO' 
  AND name IN (
    'Kansas City Downtown',
    'Kansas City North', 
    'Kansas City South',
    'Independence',
    'Lees Summit',
    'Blue Springs - Grain Valley',
    'Liberty - Gladstone',
    'Raytown - Grandview'
  )
)
WHERE name = 'Kansas City MO' AND state = 'MO';

-- Also update the reverse - make sure KC MO is in others' adjacent_ids
-- Kansas City Downtown should be adjacent to KC MO
UPDATE territories 
SET adjacent_ids = array_append(
  COALESCE(adjacent_ids, ARRAY[]::uuid[]),
  (SELECT id FROM territories WHERE name = 'Kansas City MO' AND state = 'MO' LIMIT 1)
)
WHERE name = 'Kansas City Downtown' AND state = 'MO'
AND NOT (adjacent_ids @> ARRAY[(SELECT id FROM territories WHERE name = 'Kansas City MO' AND state = 'MO' LIMIT 1)]::uuid[]);

-- Kansas City North
UPDATE territories 
SET adjacent_ids = array_append(
  COALESCE(adjacent_ids, ARRAY[]::uuid[]),
  (SELECT id FROM territories WHERE name = 'Kansas City MO' AND state = 'MO' LIMIT 1)
)
WHERE name = 'Kansas City North' AND state = 'MO'
AND NOT (adjacent_ids @> ARRAY[(SELECT id FROM territories WHERE name = 'Kansas City MO' AND state = 'MO' LIMIT 1)]::uuid[]);

-- Kansas City South
UPDATE territories 
SET adjacent_ids = array_append(
  COALESCE(adjacent_ids, ARRAY[]::uuid[]),
  (SELECT id FROM territories WHERE name = 'Kansas City MO' AND state = 'MO' LIMIT 1)
)
WHERE name = 'Kansas City South' AND state = 'MO'
AND NOT (adjacent_ids @> ARRAY[(SELECT id FROM territories WHERE name = 'Kansas City MO' AND state = 'MO' LIMIT 1)]::uuid[]);

-- Independence
UPDATE territories 
SET adjacent_ids = array_append(
  COALESCE(adjacent_ids, ARRAY[]::uuid[]),
  (SELECT id FROM territories WHERE name = 'Kansas City MO' AND state = 'MO' LIMIT 1)
)
WHERE name = 'Independence' AND state = 'MO'
AND NOT (adjacent_ids @> ARRAY[(SELECT id FROM territories WHERE name = 'Kansas City MO' AND state = 'MO' LIMIT 1)]::uuid[]);

-- Lees Summit
UPDATE territories 
SET adjacent_ids = array_append(
  COALESCE(adjacent_ids, ARRAY[]::uuid[]),
  (SELECT id FROM territories WHERE name = 'Kansas City MO' AND state = 'MO' LIMIT 1)
)
WHERE name = 'Lees Summit' AND state = 'MO'
AND NOT (adjacent_ids @> ARRAY[(SELECT id FROM territories WHERE name = 'Kansas City MO' AND state = 'MO' LIMIT 1)]::uuid[]);

-- Blue Springs
UPDATE territories 
SET adjacent_ids = array_append(
  COALESCE(adjacent_ids, ARRAY[]::uuid[]),
  (SELECT id FROM territories WHERE name = 'Kansas City MO' AND state = 'MO' LIMIT 1)
)
WHERE name = 'Blue Springs - Grain Valley' AND state = 'MO'
AND NOT (adjacent_ids @> ARRAY[(SELECT id FROM territories WHERE name = 'Kansas City MO' AND state = 'MO' LIMIT 1)]::uuid[]);

-- Liberty - Gladstone
UPDATE territories 
SET adjacent_ids = array_append(
  COALESCE(adjacent_ids, ARRAY[]::uuid[]),
  (SELECT id FROM territories WHERE name = 'Kansas City MO' AND state = 'MO' LIMIT 1)
)
WHERE name = 'Liberty - Gladstone' AND state = 'MO'
AND NOT (adjacent_ids @> ARRAY[(SELECT id FROM territories WHERE name = 'Kansas City MO' AND state = 'MO' LIMIT 1)]::uuid[]);

-- Raytown - Grandview
UPDATE territories 
SET adjacent_ids = array_append(
  COALESCE(adjacent_ids, ARRAY[]::uuid[]),
  (SELECT id FROM territories WHERE name = 'Kansas City MO' AND state = 'MO' LIMIT 1)
)
WHERE name = 'Raytown - Grandview' AND state = 'MO'
AND NOT (adjacent_ids @> ARRAY[(SELECT id FROM territories WHERE name = 'Kansas City MO' AND state = 'MO' LIMIT 1)]::uuid[]);

-- Verify
SELECT 
  t1.name as owned_territory,
  array_length(t1.adjacent_ids, 1) as adjacent_count,
  array_agg(t2.name ORDER BY t2.name) as adjacent_names
FROM territories t1
LEFT JOIN territories t2 ON t2.id = ANY(t1.adjacent_ids)
WHERE t1.name = 'Kansas City MO' AND t1.state = 'MO'
GROUP BY t1.id, t1.name, t1.adjacent_ids;

