-- Comprehensive SQL queries to check all territory and DMA relationships
-- Use these queries to verify ownership and associations in your database

-- ============================================================================
-- 1. OVERVIEW: All Territories with Their Type and DMA Association
-- ============================================================================
SELECT 
  t.id,
  t.name,
  t.state,
  t.metro_area,
  CASE 
    WHEN t.is_dma = true THEN 'DMA Territory'
    WHEN t.dma_id IS NOT NULL THEN 'Individual Territory (Linked to DMA)'
    ELSE 'Individual Territory (Standalone)'
  END AS territory_type,
  t.is_dma,
  t.dma_id,
  dma.name AS parent_dma_name,
  t.status AS territory_status
FROM territories t
LEFT JOIN territories dma ON t.dma_id = dma.id
ORDER BY t.state, t.name;

-- ============================================================================
-- 2. ALL DMAs WITH THEIR LINKED TERRITORIES COUNT
-- ============================================================================
SELECT 
  dma.id AS dma_id,
  dma.name AS dma_name,
  dma.state AS dma_state,
  dma.status AS dma_status,
  COUNT(t.id) AS linked_territory_count,
  COUNT(CASE WHEN t.status = 'taken' THEN 1 END) AS taken_count,
  COUNT(CASE WHEN t.status = 'available' THEN 1 END) AS available_count
FROM territories dma
LEFT JOIN territories t ON t.dma_id = dma.id AND (t.is_dma IS NULL OR t.is_dma = false)
WHERE dma.is_dma = true
GROUP BY dma.id, dma.name, dma.state, dma.status
ORDER BY dma.state, dma.name;

-- ============================================================================
-- 3. ALL OWNED TERRITORIES (DIRECT OWNERSHIP)
-- ============================================================================
SELECT 
  t.id,
  t.name,
  t.state,
  t.is_dma,
  t.dma_id,
  t.status AS territory_status,
  ownership.company_id,
  c.name AS company_name,
  ownership.stripe_subscription_id,
  ownership.price_type,
  ownership.status AS ownership_status,
  ownership.started_at,
  ownership.ended_at
FROM territories t
INNER JOIN territory_ownership ownership ON t.id = ownership.territory_id
INNER JOIN companies c ON ownership.company_id = c.id
WHERE ownership.status = 'active'
  AND ownership.ended_at IS NULL
ORDER BY c.name, t.state, t.name;

-- ============================================================================
-- 4. ALL OWNED DMAs WITH THEIR COMPANY
-- ============================================================================
SELECT 
  dma.id AS dma_id,
  dma.name AS dma_name,
  dma.state AS dma_state,
  dma.status AS dma_status,
  ownership.company_id,
  c.name AS company_name,
  c.phone AS company_phone,
  c.billing_email AS company_email,
  ownership.stripe_subscription_id,
  ownership.price_type,
  ownership.started_at,
  COUNT(t.id) AS linked_territory_count
FROM territories dma
INNER JOIN territory_ownership ownership ON dma.id = ownership.territory_id
INNER JOIN companies c ON ownership.company_id = c.id
LEFT JOIN territories t ON t.dma_id = dma.id AND (t.is_dma IS NULL OR t.is_dma = false)
WHERE dma.is_dma = true
  AND ownership.status = 'active'
  AND ownership.ended_at IS NULL
GROUP BY dma.id, dma.name, dma.state, dma.status, ownership.company_id, 
         c.name, c.phone, c.billing_email, ownership.stripe_subscription_id, 
         ownership.price_type, ownership.started_at
ORDER BY c.name, dma.state, dma.name;

-- ============================================================================
-- 5. INDIVIDUAL TERRITORIES OWNED VIA DMA (SHOULD BE MARKED AS TAKEN)
-- ============================================================================
SELECT 
  t.id,
  t.name,
  t.state,
  t.metro_area,
  t.status AS current_status,
  t.dma_id,
  dma.name AS parent_dma_name,
  dma.status AS dma_status,
  ownership.company_id,
  c.name AS company_name,
  CASE 
    WHEN t.status = 'taken' THEN '✓ Correctly marked as taken'
    ELSE '✗ Should be marked as taken'
  END AS status_check
FROM territories t
INNER JOIN territories dma ON t.dma_id = dma.id
INNER JOIN territory_ownership ownership ON dma.id = ownership.territory_id
INNER JOIN companies c ON ownership.company_id = c.id
WHERE (t.is_dma IS NULL OR t.is_dma = false)
  AND ownership.status = 'active'
  AND ownership.ended_at IS NULL
ORDER BY c.name, t.state, t.name;

-- ============================================================================
-- 6. ALL TERRITORIES WITH COMPLETE OWNERSHIP INFORMATION
-- ============================================================================
SELECT 
  t.id,
  t.name,
  t.state,
  CASE 
    WHEN t.is_dma = true THEN 'DMA'
    WHEN t.dma_id IS NOT NULL THEN 'Individual (Linked)'
    ELSE 'Individual (Standalone)'
  END AS territory_type,
  t.status AS territory_status,
  COALESCE(
    direct_ownership.company_id,
    dma_ownership.company_id
  ) AS owner_company_id,
  COALESCE(
    direct_company.name,
    dma_company.name
  ) AS owner_company_name,
  CASE 
    WHEN direct_ownership.company_id IS NOT NULL THEN 'Direct Ownership'
    WHEN dma_ownership.company_id IS NOT NULL THEN 'Owned via DMA'
    WHEN t.status = 'taken' THEN 'Marked as Taken (No Ownership Record)'
    ELSE 'Available'
  END AS ownership_type,
  COALESCE(
    direct_ownership.stripe_subscription_id,
    dma_ownership.stripe_subscription_id
  ) AS stripe_subscription_id
FROM territories t
LEFT JOIN territory_ownership direct_ownership 
  ON t.id = direct_ownership.territory_id
  AND direct_ownership.status = 'active'
  AND direct_ownership.ended_at IS NULL
LEFT JOIN companies direct_company 
  ON direct_ownership.company_id = direct_company.id
LEFT JOIN territories dma 
  ON t.dma_id = dma.id
LEFT JOIN territory_ownership dma_ownership 
  ON dma.id = dma_ownership.territory_id
  AND dma_ownership.status = 'active'
  AND dma_ownership.ended_at IS NULL
LEFT JOIN companies dma_company 
  ON dma_ownership.company_id = dma_company.id
ORDER BY t.state, t.name;

-- ============================================================================
-- 7. COMPANIES WITH ALL THEIR OWNED TERRITORIES (DIRECT + VIA DMA)
-- ============================================================================
WITH direct_owned AS (
  SELECT 
    ownership.company_id,
    t.id AS territory_id,
    t.name AS territory_name,
    t.state,
    t.is_dma,
    'direct' AS ownership_type
  FROM territory_ownership ownership
  INNER JOIN territories t ON ownership.territory_id = t.id
  WHERE ownership.status = 'active'
    AND ownership.ended_at IS NULL
),
dma_owned AS (
  SELECT 
    ownership.company_id,
    t.id AS territory_id,
    t.name AS territory_name,
    t.state,
    t.is_dma,
    'via_dma' AS ownership_type
  FROM territory_ownership ownership
  INNER JOIN territories dma ON ownership.territory_id = dma.id
  INNER JOIN territories t ON t.dma_id = dma.id
  WHERE ownership.status = 'active'
    AND ownership.ended_at IS NULL
    AND dma.is_dma = true
    AND (t.is_dma IS NULL OR t.is_dma = false)
)
SELECT 
  c.id AS company_id,
  c.name AS company_name,
  c.phone,
  c.billing_email,
  COALESCE(direct_owned.territory_id, dma_owned.territory_id) AS territory_id,
  COALESCE(direct_owned.territory_name, dma_owned.territory_name) AS territory_name,
  COALESCE(direct_owned.state, dma_owned.state) AS state,
  COALESCE(direct_owned.is_dma, dma_owned.is_dma) AS is_dma,
  COALESCE(direct_owned.ownership_type, dma_owned.ownership_type) AS ownership_type
FROM companies c
LEFT JOIN direct_owned ON c.id = direct_owned.company_id
LEFT JOIN dma_owned ON c.id = dma_owned.company_id
WHERE direct_owned.territory_id IS NOT NULL 
   OR dma_owned.territory_id IS NOT NULL
ORDER BY c.name, COALESCE(direct_owned.state, dma_owned.state), 
         COALESCE(direct_owned.territory_name, dma_owned.territory_name);

-- ============================================================================
-- 8. TERRITORIES THAT SHOULD BE MARKED AS TAKEN BUT AREN'T
-- ============================================================================
SELECT 
  t.id,
  t.name,
  t.state,
  t.status AS current_status,
  t.dma_id,
  dma.name AS parent_dma_name,
  ownership.company_id,
  c.name AS company_name,
  'Should be marked as taken (DMA is owned)' AS reason
FROM territories t
INNER JOIN territories dma ON t.dma_id = dma.id
INNER JOIN territory_ownership ownership ON dma.id = ownership.territory_id
INNER JOIN companies c ON ownership.company_id = c.id
WHERE (t.is_dma IS NULL OR t.is_dma = false)
  AND ownership.status = 'active'
  AND ownership.ended_at IS NULL
  AND t.status != 'taken'

UNION

SELECT 
  t.id,
  t.name,
  t.state,
  t.status AS current_status,
  NULL AS dma_id,
  NULL AS parent_dma_name,
  ownership.company_id,
  c.name AS company_name,
  'Should be marked as taken (Direct ownership exists)' AS reason
FROM territories t
INNER JOIN territory_ownership ownership ON t.id = ownership.territory_id
INNER JOIN companies c ON ownership.company_id = c.id
WHERE ownership.status = 'active'
  AND ownership.ended_at IS NULL
  AND t.status != 'taken'
ORDER BY company_name, state, name;

-- ============================================================================
-- 9. DMAs WITH STATUS='TAKEN' BUT NO OWNERSHIP RECORD
-- ============================================================================
SELECT 
  dma.id AS dma_id,
  dma.name AS dma_name,
  dma.state AS dma_state,
  dma.status AS dma_status,
  COUNT(t.id) AS linked_territory_count,
  'Marked as taken but no ownership record' AS note
FROM territories dma
LEFT JOIN territories t ON t.dma_id = dma.id AND (t.is_dma IS NULL OR t.is_dma = false)
LEFT JOIN territory_ownership ownership ON dma.id = ownership.territory_id 
  AND ownership.status = 'active' 
  AND ownership.ended_at IS NULL
WHERE dma.is_dma = true
  AND dma.status = 'taken'
  AND ownership.id IS NULL
GROUP BY dma.id, dma.name, dma.state, dma.status
ORDER BY dma.state, dma.name;

-- ============================================================================
-- 10. PENDING TERRITORY PURCHASES (GUEST CHECKOUT)
-- ============================================================================
SELECT 
  p.id,
  p.email,
  p.territory_id,
  t.name AS territory_name,
  t.state,
  t.is_dma,
  p.stripe_customer_id,
  p.stripe_subscription_id,
  p.price_type,
  p.created_at,
  p.completed_at,
  CASE 
    WHEN p.completed_at IS NULL THEN 'Pending'
    ELSE 'Completed'
  END AS status
FROM pending_territory_purchases p
INNER JOIN territories t ON p.territory_id = t.id
ORDER BY p.created_at DESC;

-- ============================================================================
-- 11. SUMMARY STATISTICS
-- ============================================================================
SELECT 
  'Total Territories' AS metric,
  COUNT(*)::TEXT AS value
FROM territories

UNION ALL

SELECT 
  'DMA Territories' AS metric,
  COUNT(*)::TEXT AS value
FROM territories
WHERE is_dma = true

UNION ALL

SELECT 
  'Individual Territories (Linked to DMA)' AS metric,
  COUNT(*)::TEXT AS value
FROM territories
WHERE dma_id IS NOT NULL AND (is_dma IS NULL OR is_dma = false)

UNION ALL

SELECT 
  'Individual Territories (Standalone)' AS metric,
  COUNT(*)::TEXT AS value
FROM territories
WHERE dma_id IS NULL AND (is_dma IS NULL OR is_dma = false)

UNION ALL

SELECT 
  'Active Ownership Records' AS metric,
  COUNT(*)::TEXT AS value
FROM territory_ownership
WHERE status = 'active' AND ended_at IS NULL

UNION ALL

SELECT 
  'Owned DMAs' AS metric,
  COUNT(DISTINCT ownership.territory_id)::TEXT AS value
FROM territory_ownership ownership
INNER JOIN territories t ON ownership.territory_id = t.id
WHERE ownership.status = 'active'
  AND ownership.ended_at IS NULL
  AND t.is_dma = true

UNION ALL

SELECT 
  'Territories Marked as Taken' AS metric,
  COUNT(*)::TEXT AS value
FROM territories
WHERE status = 'taken'

UNION ALL

SELECT 
  'Pending Purchases' AS metric,
  COUNT(*)::TEXT AS value
FROM pending_territory_purchases
WHERE completed_at IS NULL

UNION ALL

SELECT 
  'Total Companies' AS metric,
  COUNT(*)::TEXT AS value
FROM companies;


