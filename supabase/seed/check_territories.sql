-- Run this in Supabase SQL Editor to debug

-- 1. Check if Missouri territories exist
SELECT name, id, array_length(adjacent_ids, 1) as adj_count
FROM territories 
WHERE state = 'MO'
ORDER BY name;

-- 2. Check exact territory names (copy these for the adjacency script)
SELECT name FROM territories WHERE state = 'MO' ORDER BY name;

