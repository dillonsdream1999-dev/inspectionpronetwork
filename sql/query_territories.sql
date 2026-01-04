-- SQL Queries to View Territories Data
-- Run these in Supabase SQL Editor to view your territories

-- 1. View all territories with their basic info
SELECT 
  id,
  name,
  state,
  metro_area,
  status,
  type,
  population_est,
  zip_codes,
  is_dma,
  dma_id,
  created_at
FROM territories
ORDER BY state, name;

-- 2. View territories with ownership status (to see which are taken)
SELECT 
  t.id,
  t.name,
  t.state,
  t.metro_area,
  t.status,
  t.zip_codes,
  t.is_dma,
  CASE 
    WHEN o.id IS NOT NULL AND o.status = 'active' THEN 'Has Active Ownership'
    WHEN o.id IS NOT NULL AND o.status = 'canceled' THEN 'Has Canceled Ownership'
    ELSE 'No Ownership'
  END as ownership_status,
  c.name as company_name
FROM territories t
LEFT JOIN territory_ownership o ON t.id = o.territory_id
LEFT JOIN companies c ON o.company_id = c.id
ORDER BY t.state, t.name;

-- 3. Count territories by status
SELECT 
  status,
  COUNT(*) as count
FROM territories
GROUP BY status
ORDER BY status;

-- 4. View only DMAs
SELECT 
  id,
  name,
  state,
  metro_area,
  status,
  population_est,
  zip_codes,
  created_at
FROM territories
WHERE is_dma = true
ORDER BY state, name;

-- 5. View only individual territories (not DMAs)
SELECT 
  id,
  name,
  state,
  metro_area,
  status,
  type,
  population_est,
  zip_codes,
  dma_id,
  created_at
FROM territories
WHERE is_dma IS NULL OR is_dma = false
ORDER BY state, name;

-- 6. View territories by state
SELECT 
  state,
  COUNT(*) as total_territories,
  COUNT(*) FILTER (WHERE status = 'available') as available,
  COUNT(*) FILTER (WHERE status = 'taken') as taken,
  COUNT(*) FILTER (WHERE status = 'held') as held,
  COUNT(*) FILTER (WHERE is_dma = true) as dmas
FROM territories
GROUP BY state
ORDER BY state;

-- 7. View territories with empty or missing zip codes
SELECT 
  id,
  name,
  state,
  metro_area,
  status,
  zip_codes,
  array_length(zip_codes, 1) as zip_count
FROM territories
WHERE zip_codes IS NULL OR array_length(zip_codes, 1) = 0 OR zip_codes = '{}'
ORDER BY state, name;

-- 8. View territories with zip codes (to verify they're populated)
SELECT 
  id,
  name,
  state,
  metro_area,
  status,
  zip_codes,
  array_length(zip_codes, 1) as zip_count,
  array_to_string(zip_codes, ', ') as zip_codes_string
FROM territories
WHERE zip_codes IS NOT NULL AND array_length(zip_codes, 1) > 0
ORDER BY state, name
LIMIT 50; -- Adjust limit as needed

-- 9. View territories with their DMA relationships (if linked)
SELECT 
  t.id,
  t.name,
  t.state,
  t.status,
  t.is_dma as territory_is_dma,
  t.dma_id,
  d.name as dma_name,
  d.status as dma_status
FROM territories t
LEFT JOIN territories d ON t.dma_id = d.id
ORDER BY t.state, t.name;

-- 10. Export-friendly format (CSV-like structure)
SELECT 
  id,
  name,
  state,
  COALESCE(metro_area, '') as metro_area,
  status,
  type,
  population_est,
  array_to_string(zip_codes, ',') as zip_codes,
  COALESCE(is_dma::text, 'false') as is_dma,
  COALESCE(dma_id::text, '') as dma_id
FROM territories
ORDER BY state, name;




