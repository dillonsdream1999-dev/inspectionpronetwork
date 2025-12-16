# QA Checklist

## Territory Exclusivity

### Test: Single Owner Per Territory
- [ ] Create territory in admin panel
- [ ] Operator A claims territory → Should succeed
- [ ] Operator B attempts to claim same territory → Should fail (territory shows as "Taken")
- [ ] Verify `territory_ownership.territory_id` has UNIQUE constraint in database

### Test: Status Transitions
- [ ] New territory → Status is "available"
- [ ] Operator clicks "Claim" → Status changes to "held"
- [ ] Checkout completed → Status changes to "taken"
- [ ] Subscription canceled → Status returns to "available"

---

## Hold Expiration

### Test: 10-Minute Hold
- [ ] Operator clicks "Claim Territory"
- [ ] Territory status changes to "held"
- [ ] `territory_holds` record created with `expires_at` = now + 10 minutes
- [ ] Operator abandons checkout (does not complete)

### Test: Hold Cleanup
- [ ] Wait > 10 minutes (or manually set `expires_at` to past)
- [ ] Visit `/territories` page
- [ ] Territory should show as "available" again
- [ ] `territory_holds` record should be deleted

### Test: Hold Prevents Others
- [ ] Operator A creates hold on Territory X
- [ ] Operator B attempts to claim Territory X
- [ ] Should receive error: "Territory is currently held by another operator"

---

## Adjacent Discount Applied Correctly

### Setup
- [ ] Create Territory A and Territory B
- [ ] Set Territory A's `adjacent_ids` to include Territory B's ID (and vice versa)

### Test: First Territory = Base Price
- [ ] Operator claims Territory A (first territory)
- [ ] Checkout should use base price ($250)
- [ ] `territory_ownership.price_type` = "base"

### Test: Adjacent Territory = Discounted Price
- [ ] Same operator claims Territory B (adjacent to A)
- [ ] Checkout should use adjacent price ($220)
- [ ] `territory_ownership.price_type` = "adjacent"

### Test: Non-Adjacent = Base Price
- [ ] Create Territory C (not adjacent to A or B)
- [ ] Same operator claims Territory C
- [ ] Checkout should use base price ($250)
- [ ] `territory_ownership.price_type` = "base"

### Test: Eligibility Display
- [ ] Login as operator with 1+ territories
- [ ] Visit `/territories`
- [ ] Adjacent territories should show "$220/mo" with "Adjacent discount applied"
- [ ] Non-adjacent territories should show "$250/mo"

---

## Discount Removed on Cancellation

### Scenario: Operator owns A (base) and B (adjacent)

### Test: Cancel Base Territory
- [ ] Operator cancels Territory A (the base territory)
- [ ] Webhook fires `customer.subscription.deleted`
- [ ] System checks Territory B's adjacency
- [ ] Territory B is no longer adjacent to any owned territory
- [ ] System calls Stripe to update B's subscription to base price
- [ ] `territory_ownership.price_type` for B updates to "base"

### Verify in Stripe
- [ ] Subscription for Territory B now shows $250/mo (effective next cycle)
- [ ] No immediate proration occurred

### Test: Chain of Three
- [ ] Operator owns A → B → C (A adjacent to B, B adjacent to C)
- [ ] A and C are base price, B is adjacent
- [ ] Cancel A
- [ ] B should remain adjacent (still adjacent to C)
- [ ] No price change for B

---

## RLS Protection

### Test: Operator Cannot See Other Leads
- [ ] Create leads for Operator A's territory
- [ ] Create leads for Operator B's territory
- [ ] Login as Operator A
- [ ] Query leads → Should only see own leads
- [ ] Attempt direct API access to Operator B's lead → Should fail

### Test: Operator Cannot See Other Territories (Ownership)
- [ ] Login as Operator A
- [ ] Visit `/dashboard/territories`
- [ ] Should only see territories owned by Operator A
- [ ] API query for other ownership records → Should return empty

### Test: Operator Cannot Access Admin
- [ ] Login as regular operator (role = "operator")
- [ ] Navigate to `/admin`
- [ ] Should be redirected to `/dashboard`

### Test: Unauthenticated Access Blocked
- [ ] Logout
- [ ] Visit `/dashboard` → Should redirect to `/login`
- [ ] Visit `/admin` → Should redirect to `/login`
- [ ] API calls without auth → Should return 401

---

## Stripe Webhook Handling

### Test: checkout.session.completed
- [ ] Complete a checkout flow
- [ ] Verify webhook received (check logs)
- [ ] Verify `territory_ownership` record created with correct:
  - `territory_id`
  - `company_id`
  - `stripe_customer_id`
  - `stripe_subscription_id`
  - `price_type`
  - `status` = "active"
- [ ] Verify territory status = "taken"
- [ ] Verify `territory_holds` record deleted

### Test: customer.subscription.deleted
- [ ] Cancel subscription in Stripe Dashboard
- [ ] Verify webhook received
- [ ] Verify `territory_ownership.status` = "canceled"
- [ ] Verify `territory_ownership.ended_at` set
- [ ] Verify territory status = "available"

### Test: Webhook Signature Verification
- [ ] Send fake webhook request without valid signature
- [ ] Should return 400 "Invalid signature"
- [ ] No database changes should occur

---

## End-to-End Flows

### Complete New Operator Flow
1. [ ] Visit homepage
2. [ ] Click "Check Territory Availability"
3. [ ] Browse territories
4. [ ] Click "Claim Territory" (should redirect to login)
5. [ ] Enter email, receive magic link
6. [ ] Click magic link
7. [ ] Redirect to complete company profile
8. [ ] Fill in company details, save
9. [ ] Redirect to dashboard
10. [ ] Navigate to territories, claim again
11. [ ] Complete Stripe checkout
12. [ ] Redirect to dashboard with success message
13. [ ] Territory appears in "My Territories"

### Complete Cancellation Flow
1. [ ] Login as operator with active territory
2. [ ] Go to "My Territories"
3. [ ] Click "Cancel Subscription"
4. [ ] Confirm cancellation
5. [ ] Subscription canceled in Stripe
6. [ ] Territory returns to available
7. [ ] Dashboard updates to show no active territories

---

## Admin Functions

### Test: Create Territory
- [ ] Login as admin
- [ ] Navigate to `/admin/territories/new`
- [ ] Fill in all fields
- [ ] Submit → Territory created
- [ ] Appears in territory list

### Test: Edit Territory
- [ ] Click edit on existing territory
- [ ] Modify fields
- [ ] Save → Changes persisted
- [ ] Adjacent territories can be selected

### Test: Delete Territory
- [ ] Create a test territory (available status)
- [ ] Click delete
- [ ] Confirm → Territory removed
- [ ] Territory with "taken" status cannot be deleted

### Test: Bulk Import
- [ ] Paste valid JSON in uploader
- [ ] Click Import
- [ ] Territories created with correct adjacency
- [ ] Invalid JSON shows error message

---

## Performance & Edge Cases

### Test: Concurrent Claims
- [ ] Two operators attempt to claim same territory simultaneously
- [ ] Only one should succeed
- [ ] Other should receive appropriate error

### Test: Expired Session Cleanup
- [ ] Create multiple expired holds
- [ ] Trigger cleanup (visit territories page)
- [ ] All expired holds removed
- [ ] Territories return to available

### Test: Mobile Responsiveness
- [ ] Test all pages on mobile viewport
- [ ] Navigation works correctly
- [ ] Forms are usable
- [ ] Tables scroll horizontally if needed

