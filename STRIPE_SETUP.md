# Stripe Setup Guide

## 1. Create Products and Prices

### In Stripe Dashboard:

1. Go to **Products** → **Add product**

2. **Base Territory Subscription**
   - Name: `Territory Subscription - Base`
   - Description: `Exclusive territory access for pest control operators`
   - Pricing:
     - Price: `$250.00`
     - Billing period: `Monthly`
     - Price ID: Copy this (starts with `price_`)

3. **Adjacent Territory Subscription**
   - Name: `Territory Subscription - Adjacent`
   - Description: `Adjacent territory discount for existing operators`
   - Pricing:
     - Price: `$150.00`
     - Billing period: `Monthly`
     - Price ID: Copy this (starts with `price_`)

4. Add Price IDs to your `.env.local`:
   ```
   STRIPE_PRICE_BASE_250=price_xxx
   STRIPE_PRICE_ADJACENT_150=price_xxx
   # Or keep old variable name for backwards compatibility:
   # STRIPE_PRICE_ADJACENT_220=price_xxx
   ```

## 2. Configure Webhooks

### For Local Development:

1. Install Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Windows (scoop)
   scoop install stripe
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to localhost:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. Copy the webhook signing secret (starts with `whsec_`) to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

### For Production:

1. Go to **Developers** → **Webhooks** → **Add endpoint**

2. Configure:
   - Endpoint URL: `https://your-domain.com/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`

3. Copy the signing secret to your production environment variables

## 3. Test Checkout Flow

1. Use Stripe test card: `4242 4242 4242 4242`
2. Any future expiry date
3. Any CVC
4. Any ZIP code

## 4. Webhook Events Handled

### `checkout.session.completed`
- Creates `territory_ownership` record
- Updates territory status to `taken`
- Deletes the temporary hold

### `customer.subscription.updated`
- Updates ownership status if subscription becomes active

### `customer.subscription.deleted`
- Marks ownership as `canceled`
- Sets `ended_at` timestamp
- Updates territory status to `available`
- Re-evaluates adjacent discount eligibility for remaining subscriptions

## 5. Adjacent Discount Logic

The adjacent discount is determined at checkout time:

1. System checks if operator has any active territories
2. If yes, checks if target territory is in the `adjacent_ids` of any owned territory
3. If adjacent, uses `STRIPE_PRICE_ADJACENT_220`
4. If not adjacent (or no owned territories), uses `STRIPE_PRICE_BASE_250`

### Discount Revocation

When a subscription is canceled:

1. System finds all remaining subscriptions with `price_type = 'adjacent'`
2. For each, verifies the territory is still adjacent to another owned territory
3. If not, updates Stripe subscription to base price
4. Price change takes effect at next billing cycle (no proration)

## 6. Metadata Structure

### Checkout Session Metadata
```json
{
  "company_id": "uuid",
  "territory_id": "uuid"
}
```

### Subscription Metadata
```json
{
  "company_id": "uuid",
  "territory_id": "uuid"
}
```

## 7. Customer Management

- New customers are created automatically during checkout
- Returning customers reuse their existing Stripe customer ID
- Customer ID is stored in `territory_ownership.stripe_customer_id`

## 8. Testing Checklist

- [ ] New customer can complete checkout
- [ ] Returning customer reuses customer ID
- [ ] Adjacent discount applies correctly
- [ ] Webhook creates ownership record
- [ ] Cancellation releases territory
- [ ] Adjacent discount revoked on cancellation if no longer eligible

