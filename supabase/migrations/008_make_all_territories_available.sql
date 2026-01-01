-- Make all territories without active subscriptions available
-- This sets territories to 'available' status if they don't have an active territory_ownership record

-- First, let's see what we're working with
-- (You can run this to see the current state)
-- SELECT 
--   t.id,
--   t.name,
--   t.status,
--   CASE WHEN o.id IS NOT NULL THEN 'Has Active Ownership' ELSE 'No Active Ownership' END as ownership_status
-- FROM territories t
-- LEFT JOIN territory_ownership o ON t.id = o.territory_id AND o.status = 'active'
-- ORDER BY t.status, t.name;

-- Update all territories that don't have active ownership to 'available'
UPDATE territories
SET status = 'available'
WHERE id NOT IN (
  SELECT DISTINCT territory_id 
  FROM territory_ownership 
  WHERE status = 'active'
);

-- Verify the results (run this after the update)
-- SELECT 
--   status,
--   COUNT(*) as count
-- FROM territories
-- GROUP BY status
-- ORDER BY status;


