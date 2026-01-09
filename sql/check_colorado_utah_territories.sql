-- Check Colorado territories
SELECT 
  COUNT(*) as colorado_count,
  COUNT(CASE WHEN status = 'available' THEN 1 END) as colorado_available,
  COUNT(CASE WHEN status = 'taken' THEN 1 END) as colorado_taken
FROM territories
WHERE state = 'CO';

-- Check Utah territories
SELECT 
  COUNT(*) as utah_count,
  COUNT(CASE WHEN status = 'available' THEN 1 END) as utah_available,
  COUNT(CASE WHEN status = 'taken' THEN 1 END) as utah_taken
FROM territories
WHERE state = 'UT';

-- List first 20 Colorado territories
SELECT id, name, state, status, metro_area, is_dma
FROM territories
WHERE state = 'CO'
ORDER BY name
LIMIT 20;

-- List first 20 Utah territories
SELECT id, name, state, status, metro_area, is_dma
FROM territories
WHERE state = 'UT'
ORDER BY name
LIMIT 20;

-- Check total territory count
SELECT 
  COUNT(*) as total_territories,
  COUNT(DISTINCT state) as total_states
FROM territories;

