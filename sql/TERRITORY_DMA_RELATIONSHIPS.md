# Territory and DMA Relationship Documentation

This document provides a complete overview of all database relationships for territories, DMAs, and ownership in the Supabase database.

## Database Tables Overview

### 1. `territories` Table
**Purpose**: Stores all territories, including both individual territories and DMA territories.

**Key Fields**:
- `id` (UUID, PRIMARY KEY): Unique identifier for the territory
- `name` (TEXT): Territory name (e.g., "Kansas City", "Wichita–Hutchinson DMA")
- `state` (TEXT): Two-letter state code (e.g., "KS", "MO")
- `metro_area` (TEXT, nullable): Metro area name (e.g., "Kansas City", "Wichita")
- `type` (ENUM: 'metro' | 'rural'): Territory type
- `population_est` (INTEGER): Estimated population
- `zip_codes` (TEXT[]): Array of ZIP codes covered by this territory
- `adjacent_ids` (UUID[]): Array of adjacent territory IDs
- `status` (ENUM: 'available' | 'held' | 'taken'): Current availability status
- **`is_dma` (BOOLEAN, nullable)**: `true` if this territory is a DMA, `false` or `null` if it's an individual territory
- **`dma_id` (UUID, nullable)**: If this is an individual territory, this points to the parent DMA territory ID. If this is a DMA territory, this is `null`
- `created_at` (TIMESTAMPTZ): Creation timestamp

**Important Notes**:
- **DMAs are territories** with `is_dma = true` and `dma_id = null`
- **Individual territories** have `is_dma = false` or `is_dma = null` and `dma_id` pointing to their parent DMA
- A territory can be owned directly OR through its parent DMA

### 2. `territory_ownership` Table
**Purpose**: Tracks active subscriptions linking companies to territories.

**Key Fields**:
- `id` (UUID, PRIMARY KEY): Unique identifier
- `territory_id` (UUID, UNIQUE, FK → territories.id): The territory being owned (can be a DMA or individual territory)
- `company_id` (UUID, FK → companies.id): The company that owns this territory
- `stripe_customer_id` (TEXT): Stripe customer ID
- `stripe_subscription_id` (TEXT, UNIQUE): Stripe subscription ID
- `price_type` (ENUM: 'base' | 'adjacent'): Pricing tier
- `status` (ENUM: 'active' | 'canceled'): Ownership status
- `started_at` (TIMESTAMPTZ): When ownership started
- `ended_at` (TIMESTAMPTZ, nullable): When ownership ended (if canceled)

**Important Notes**:
- **One territory can only have ONE active ownership record** (UNIQUE constraint on `territory_id`)
- When a DMA is owned, the ownership record points to the DMA territory itself (`territory_id` = DMA's `id`)
- When an individual territory is owned, the ownership record points to that individual territory
- To check if an individual territory is owned via DMA, you must:
  1. Check if the territory has a `dma_id`
  2. If yes, check if there's an active ownership record for that DMA

### 3. `companies` Table
**Purpose**: Stores company profiles.

**Key Fields**:
- `id` (UUID, PRIMARY KEY): Unique identifier
- `owner_user_id` (UUID, UNIQUE, FK → profiles.id): The user who owns this company
- `name` (TEXT): Company name
- `phone` (TEXT, nullable): Phone number
- `website` (TEXT, nullable): Website URL
- `billing_email` (TEXT, nullable): Billing email
- `created_at` (TIMESTAMPTZ): Creation timestamp

### 4. `profiles` Table
**Purpose**: Extends Supabase auth.users with role information.

**Key Fields**:
- `id` (UUID, PRIMARY KEY, FK → auth.users.id): User ID
- `email` (TEXT): User email
- `role` (ENUM: 'operator' | 'admin'): User role
- `created_at` (TIMESTAMPTZ): Creation timestamp

### 5. `pending_territory_purchases` Table
**Purpose**: Stores territory purchases made by unauthenticated users (guest checkout).

**Key Fields**:
- `id` (UUID, PRIMARY KEY): Unique identifier
- `email` (TEXT): Customer email (used to link purchase after account creation)
- `territory_id` (UUID, FK → territories.id): The territory that was purchased
- `stripe_customer_id` (TEXT): Stripe customer ID
- `stripe_subscription_id` (TEXT, UNIQUE): Stripe subscription ID
- `stripe_checkout_session_id` (TEXT, UNIQUE): Stripe checkout session ID
- `price_type` (ENUM: 'base' | 'adjacent'): Pricing tier
- `created_at` (TIMESTAMPTZ): When purchase was made
- `completed_at` (TIMESTAMPTZ, nullable): When purchase was linked to an account (null = still pending)

### 6. `territory_holds` Table
**Purpose**: Temporary holds during checkout (10-minute expiration).

**Key Fields**:
- `id` (UUID, PRIMARY KEY): Unique identifier
- `territory_id` (UUID, UNIQUE, FK → territories.id): The territory on hold
- `company_id` (UUID, FK → companies.id): The company holding the territory
- `expires_at` (TIMESTAMPTZ): When the hold expires
- `checkout_session_id` (TEXT, nullable): Stripe checkout session ID
- `created_at` (TIMESTAMPTZ): When the hold was created

## Key Relationships

### Relationship Diagram

```
profiles (1) ──< (1) companies (1) ──< (N) territory_ownership (N) ──> (1) territories
                                                                              │
                                                                              │ (dma_id)
                                                                              ▼
                                                                        territories (DMA)
                                                                              │
                                                                              │ (dma_id)
                                                                              ▼
                                                                        territories (individual)
```

### Detailed Relationships

#### 1. User → Company (1:1)
- One user (`profiles`) can own one company (`companies`)
- Relationship: `companies.owner_user_id` → `profiles.id`
- Constraint: `UNIQUE(owner_user_id)`

#### 2. Company → Territory Ownership (1:N)
- One company can own multiple territories
- Relationship: `territory_ownership.company_id` → `companies.id`

#### 3. Territory → Territory Ownership (1:1)
- One territory can have only ONE active ownership record
- Relationship: `territory_ownership.territory_id` → `territories.id`
- Constraint: `UNIQUE(territory_id)` on `territory_ownership`

#### 4. DMA → Individual Territories (1:N)
- One DMA territory can have many individual territories linked to it
- Relationship: `territories.dma_id` → `territories.id` (self-referential)
- **Important**: This is a self-referential relationship within the `territories` table
- Individual territories have `dma_id` pointing to their parent DMA
- DMA territories have `dma_id = null` and `is_dma = true`

## Ownership Logic

### How to Determine if a Territory is Owned

#### For Individual Territories:

1. **Direct Ownership Check**:
   ```sql
   SELECT company_id 
   FROM territory_ownership 
   WHERE territory_id = '<individual_territory_id>'
     AND status = 'active'
     AND ended_at IS NULL;
   ```

2. **DMA Ownership Check** (if `dma_id` is not null):
   ```sql
   SELECT company_id 
   FROM territory_ownership 
   WHERE territory_id = (
     SELECT dma_id 
     FROM territories 
     WHERE id = '<individual_territory_id>'
   )
     AND status = 'active'
     AND ended_at IS NULL;
   ```

3. **Status Check** (fallback):
   ```sql
   SELECT status 
   FROM territories 
   WHERE id = '<territory_id>';
   -- If status = 'taken', the territory is owned (even if no ownership record exists)
   ```

#### For DMA Territories:

1. **Direct Ownership Check**:
   ```sql
   SELECT company_id 
   FROM territory_ownership 
   WHERE territory_id = '<dma_id>'
     AND status = 'active'
     AND ended_at IS NULL;
   ```

2. **Status Check** (fallback):
   ```sql
   SELECT status 
   FROM territories 
   WHERE id = '<dma_id>' 
     AND is_dma = true;
   -- If status = 'taken', the DMA is owned
   ```

### Database Function: `get_territory_owner()`

The database includes a helper function that handles this logic:

```sql
CREATE OR REPLACE FUNCTION get_territory_owner(territory_uuid UUID)
RETURNS UUID AS $$
DECLARE
  owner_company_id UUID;
  territory_dma_id UUID;
BEGIN
  -- First, check for direct ownership
  SELECT company_id INTO owner_company_id
  FROM territory_ownership
  WHERE territory_id = territory_uuid
    AND status = 'active'
    AND ended_at IS NULL;
  
  -- If direct ownership found, return it
  IF owner_company_id IS NOT NULL THEN
    RETURN owner_company_id;
  END IF;
  
  -- If no direct ownership, check if territory is linked to a DMA
  SELECT dma_id INTO territory_dma_id
  FROM territories
  WHERE id = territory_uuid
    AND dma_id IS NOT NULL;
  
  -- If territory has a dma_id, check if the DMA is owned
  IF territory_dma_id IS NOT NULL THEN
    SELECT company_id INTO owner_company_id
    FROM territory_ownership
    WHERE territory_id = territory_dma_id
      AND status = 'active'
      AND ended_at IS NULL;
  END IF;
  
  RETURN owner_company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Usage**:
```sql
SELECT get_territory_owner('<territory_id>');
-- Returns: company_id (UUID) or NULL if not owned
```

## SQL Queries for Common Operations

### 1. Find All Territories Linked to a DMA

```sql
SELECT 
  t.id,
  t.name,
  t.state,
  t.status,
  t.dma_id,
  dma.name AS dma_name
FROM territories t
LEFT JOIN territories dma ON t.dma_id = dma.id
WHERE t.dma_id = '<dma_id>'
  AND (t.is_dma IS NULL OR t.is_dma = false);
```

### 2. Find All Owned DMAs

```sql
SELECT DISTINCT
  dma.id AS dma_id,
  dma.name AS dma_name,
  dma.state AS dma_state,
  dma.status AS dma_status,
  ownership.company_id,
  c.name AS company_name
FROM territories dma
INNER JOIN territory_ownership ownership ON dma.id = ownership.territory_id
INNER JOIN companies c ON ownership.company_id = c.id
WHERE dma.is_dma = true
  AND ownership.status = 'active'
  AND ownership.ended_at IS NULL;
```

### 3. Find All Territories Owned by a Company (Including via DMA)

```sql
-- Direct ownerships
SELECT 
  t.id,
  t.name,
  t.state,
  t.is_dma,
  t.dma_id,
  'direct' AS ownership_type
FROM territories t
INNER JOIN territory_ownership ownership ON t.id = ownership.territory_id
WHERE ownership.company_id = '<company_id>'
  AND ownership.status = 'active'
  AND ownership.ended_at IS NULL

UNION

-- Territories owned via DMA
SELECT 
  t.id,
  t.name,
  t.state,
  t.is_dma,
  t.dma_id,
  'via_dma' AS ownership_type
FROM territories t
INNER JOIN territories dma ON t.dma_id = dma.id
INNER JOIN territory_ownership ownership ON dma.id = ownership.territory_id
WHERE ownership.company_id = '<company_id>'
  AND ownership.status = 'active'
  AND ownership.ended_at IS NULL
  AND (t.is_dma IS NULL OR t.is_dma = false);
```

### 4. Check if a Territory is Available

```sql
WITH territory_owner AS (
  SELECT get_territory_owner('<territory_id>') AS company_id
)
SELECT 
  t.id,
  t.name,
  t.status,
  CASE 
    WHEN t.status = 'taken' THEN false
    WHEN EXISTS (
      SELECT 1 FROM territory_owner WHERE company_id IS NOT NULL
    ) THEN false
    WHEN t.dma_id IS NOT NULL AND EXISTS (
      SELECT 1 
      FROM territories dma
      INNER JOIN territory_ownership ownership ON dma.id = ownership.territory_id
      WHERE dma.id = t.dma_id
        AND ownership.status = 'active'
        AND ownership.ended_at IS NULL
    ) THEN false
    ELSE true
  END AS is_available
FROM territories t
WHERE t.id = '<territory_id>';
```

### 5. Get All Territories with Their Ownership Status

```sql
SELECT 
  t.id,
  t.name,
  t.state,
  t.is_dma,
  t.dma_id,
  t.status AS territory_status,
  CASE 
    WHEN t.is_dma = true THEN 'DMA Territory'
    WHEN t.dma_id IS NOT NULL THEN 'Individual Territory (Linked to DMA)'
    ELSE 'Individual Territory (Standalone)'
  END AS territory_type,
  COALESCE(
    direct_ownership.company_id,
    dma_ownership.company_id
  ) AS owner_company_id,
  c.name AS owner_company_name,
  CASE 
    WHEN direct_ownership.company_id IS NOT NULL THEN 'Direct Ownership'
    WHEN dma_ownership.company_id IS NOT NULL THEN 'Owned via DMA'
    ELSE 'Not Owned'
  END AS ownership_type
FROM territories t
LEFT JOIN territory_ownership direct_ownership 
  ON t.id = direct_ownership.territory_id
  AND direct_ownership.status = 'active'
  AND direct_ownership.ended_at IS NULL
LEFT JOIN territories dma 
  ON t.dma_id = dma.id
LEFT JOIN territory_ownership dma_ownership 
  ON dma.id = dma_ownership.territory_id
  AND dma_ownership.status = 'active'
  AND dma_ownership.ended_at IS NULL
LEFT JOIN companies c 
  ON COALESCE(direct_ownership.company_id, dma_ownership.company_id) = c.id
ORDER BY t.state, t.name;
```

### 6. Find All Individual Territories That Should Be Marked as "Taken" (Due to DMA Ownership)

```sql
SELECT 
  t.id,
  t.name,
  t.state,
  t.dma_id,
  dma.name AS dma_name,
  dma.status AS dma_status,
  ownership.company_id,
  c.name AS company_name
FROM territories t
INNER JOIN territories dma ON t.dma_id = dma.id
INNER JOIN territory_ownership ownership ON dma.id = ownership.territory_id
INNER JOIN companies c ON ownership.company_id = c.id
WHERE (t.is_dma IS NULL OR t.is_dma = false)
  AND ownership.status = 'active'
  AND ownership.ended_at IS NULL
  AND t.status != 'taken';
```

## Application-Side Logic

### How the App Determines Ownership

The application uses the following logic (in `src/app/api/territories/route.ts`):

1. **Fetch all territories** with `is_dma` and `dma_id` fields
2. **Get all active ownerships** using service client (bypasses RLS)
3. **Identify owned DMAs**:
   - Territories with `is_dma = true` that have active ownership records
   - Territories with `is_dma = true` and `status = 'taken'` (fallback)
4. **Mark individual territories as taken** if their `dma_id` matches an owned DMA
5. **Apply status filtering** after marking DMA-linked territories

### Key Points for App Development

1. **Always check both ownership records AND status field**:
   - A territory can be marked `status = 'taken'` without an ownership record (e.g., admin-assigned)
   - A DMA can be owned via `territory_ownership` OR just marked `status = 'taken'`

2. **Use service client for ownership checks**:
   - RLS policies may prevent seeing all ownerships
   - Use `createServiceClient()` when checking ownership across all companies

3. **DMA ownership cascades to individual territories**:
   - If a DMA is owned, ALL territories with `dma_id` pointing to that DMA should show as "taken"
   - This must be done in application logic, not just database queries

4. **Check `is_dma` field carefully**:
   - `is_dma = true` → DMA territory
   - `is_dma = false` or `is_dma = null` → Individual territory
   - Use `is_dma === true` (strict equality) in TypeScript/JavaScript

## Common Issues and Solutions

### Issue 1: Individual territories showing as "available" when DMA is "taken"

**Cause**: The `dma_id` relationship is not being checked, or the ownership check is not finding the DMA ownership.

**Solution**: 
1. Ensure `dma_id` is properly set on individual territories
2. Check for DMA ownership using service client (bypasses RLS)
3. Mark individual territories as "taken" in application logic if their parent DMA is owned

### Issue 2: Missing `dma_id` associations

**Cause**: Territories were created before DMA linking was implemented, or the linking script didn't run.

**Solution**: Run the association fix script:
```sql
-- See: sql/fix_all_dma_associations.sql
```

### Issue 3: Ownership not showing due to RLS

**Cause**: Row Level Security policies prevent seeing ownership records for other companies.

**Solution**: Use `createServiceClient()` instead of `createClient()` when checking ownership across all companies.

## Indexes for Performance

The following indexes exist to optimize queries:

- `idx_territories_state` on `territories(state)`
- `idx_territories_status` on `territories(status)`
- `idx_territories_zip_codes` on `territories(zip_codes)` (GIN index)
- `idx_territories_dma_id` on `territories(dma_id)` WHERE `dma_id IS NOT NULL`
- `idx_territory_ownership_company` on `territory_ownership(company_id)`
- `idx_territory_ownership_status` on `territory_ownership(status)`
- `idx_pending_purchases_email` on `pending_territory_purchases(email)`
- `idx_pending_purchases_territory` on `pending_territory_purchases(territory_id)`

## Summary

- **DMAs are territories** with `is_dma = true`
- **Individual territories** link to DMAs via `dma_id`
- **Ownership** is tracked in `territory_ownership` table
- **Ownership can be direct** (territory has ownership record) or **via DMA** (parent DMA has ownership record)
- **Status field** (`'available' | 'held' | 'taken'`) is a fallback indicator
- **Always check both ownership records AND status** when determining availability
- **Use service client** when checking ownership across all companies (bypasses RLS)


