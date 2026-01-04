-- Table to store territory purchases made before account creation (guest checkout)
CREATE TABLE IF NOT EXISTS pending_territory_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  territory_id UUID NOT NULL REFERENCES territories(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_checkout_session_id TEXT NOT NULL,
  price_type price_type NOT NULL DEFAULT 'base',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ, -- When account was created and purchase was linked
  UNIQUE(stripe_subscription_id),
  UNIQUE(stripe_checkout_session_id)
);

-- Index for looking up pending purchases by email
CREATE INDEX IF NOT EXISTS idx_pending_purchases_email ON pending_territory_purchases(email);
CREATE INDEX IF NOT EXISTS idx_pending_purchases_territory ON pending_territory_purchases(territory_id);
CREATE INDEX IF NOT EXISTS idx_pending_purchases_completed ON pending_territory_purchases(completed_at) WHERE completed_at IS NULL;

-- RLS policies for pending purchases
ALTER TABLE pending_territory_purchases ENABLE ROW LEVEL SECURITY;

-- Service role can manage all pending purchases
CREATE POLICY "Service role can manage all pending purchases"
  ON pending_territory_purchases FOR ALL
  USING (true);





