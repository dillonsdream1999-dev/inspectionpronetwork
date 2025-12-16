-- Inspection Pro Network Database Schema
-- This schema is designed to work alongside the Bed Bug Inspection Pro mobile app

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
  CREATE TYPE territory_status AS ENUM ('available', 'held', 'taken');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE territory_type AS ENUM ('metro', 'rural');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE price_type AS ENUM ('base', 'adjacent');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE ownership_status AS ENUM ('active', 'canceled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'booked', 'not_a_fit');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE contact_preference AS ENUM ('phone', 'email', 'text');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('operator', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'operator',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  billing_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(owner_user_id)
);

-- Territories table
CREATE TABLE IF NOT EXISTS territories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  metro_area TEXT,
  type territory_type NOT NULL,
  population_est INTEGER NOT NULL,
  zip_codes TEXT[] NOT NULL DEFAULT '{}',
  adjacent_ids UUID[] NOT NULL DEFAULT '{}',
  status territory_status NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Territory holds table (temporary holds during checkout)
CREATE TABLE IF NOT EXISTS territory_holds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  territory_id UUID NOT NULL REFERENCES territories(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  checkout_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(territory_id)
);

-- Territory ownership table
CREATE TABLE IF NOT EXISTS territory_ownership (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  territory_id UUID NOT NULL REFERENCES territories(id) ON DELETE CASCADE UNIQUE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  price_type price_type NOT NULL DEFAULT 'base',
  status ownership_status NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  zip TEXT NOT NULL,
  room_type TEXT,
  contact_pref contact_preference NOT NULL DEFAULT 'phone',
  status lead_status NOT NULL DEFAULT 'new',
  territory_id UUID NOT NULL REFERENCES territories(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  notes TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_territories_state ON territories(state);
CREATE INDEX IF NOT EXISTS idx_territories_status ON territories(status);
CREATE INDEX IF NOT EXISTS idx_territories_zip_codes ON territories USING GIN(zip_codes);
CREATE INDEX IF NOT EXISTS idx_territory_holds_expires ON territory_holds(expires_at);
CREATE INDEX IF NOT EXISTS idx_territory_ownership_company ON territory_ownership(company_id);
CREATE INDEX IF NOT EXISTS idx_territory_ownership_status ON territory_ownership(status);
CREATE INDEX IF NOT EXISTS idx_leads_company ON leads(company_id);
CREATE INDEX IF NOT EXISTS idx_leads_territory ON leads(territory_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- Function to automatically clean up expired holds
CREATE OR REPLACE FUNCTION cleanup_expired_holds()
RETURNS void AS $$
BEGIN
  -- Update territories that had holds that expired
  UPDATE territories 
  SET status = 'available'
  WHERE id IN (
    SELECT territory_id 
    FROM territory_holds 
    WHERE expires_at < NOW()
  )
  AND status = 'held';
  
  -- Delete expired holds
  DELETE FROM territory_holds WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to check adjacent territory discount eligibility
CREATE OR REPLACE FUNCTION check_adjacent_discount_eligible(
  p_company_id UUID,
  p_territory_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_adjacent_ids UUID[];
  v_owned_territory_ids UUID[];
BEGIN
  -- Get adjacent IDs for the target territory
  SELECT adjacent_ids INTO v_adjacent_ids
  FROM territories
  WHERE id = p_territory_id;
  
  -- Get all active territory IDs owned by the company
  SELECT ARRAY_AGG(territory_id) INTO v_owned_territory_ids
  FROM territory_ownership
  WHERE company_id = p_company_id
  AND status = 'active';
  
  -- Check if any owned territory is adjacent to the target
  IF v_owned_territory_ids IS NOT NULL AND v_adjacent_ids IS NOT NULL THEN
    RETURN v_adjacent_ids && v_owned_territory_ids;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

