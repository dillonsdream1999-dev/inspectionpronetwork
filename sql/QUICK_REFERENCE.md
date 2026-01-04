# Territory & DMA Relationships - Quick Reference

## Key Concepts

### 1. DMAs are Territories
- DMAs are stored in the `territories` table with `is_dma = true`
- They have `dma_id = null` (they are the parent, not a child)

### 2. Individual Territories Link to DMAs
- Individual territories have `is_dma = false` or `is_dma = null`
- They link to their parent DMA via `dma_id` field
- If `dma_id` is null, it's a standalone territory (not part of a DMA)

### 3. Ownership Can Be Direct or Via DMA
- **Direct**: Territory has its own `territory_ownership` record
- **Via DMA**: Parent DMA has a `territory_ownership` record, which means all linked individual territories are owned

## Database Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `territories` | All territories (DMAs + individual) | `id`, `is_dma`, `dma_id`, `status` |
| `territory_ownership` | Active subscriptions | `territory_id`, `company_id`, `status` |
| `companies` | Company profiles | `id`, `owner_user_id`, `name` |
| `profiles` | User profiles | `id`, `email`, `role` |
| `pending_territory_purchases` | Guest checkout purchases | `email`, `territory_id`, `completed_at` |

## Quick Queries

### Check if Territory is Owned
```sql
SELECT get_territory_owner('<territory_id>');
-- Returns: company_id or NULL
```

### Find All Territories Linked to a DMA
```sql
SELECT * FROM territories 
WHERE dma_id = '<dma_id>';
```

### Find All Owned DMAs
```sql
SELECT t.*, c.name AS company_name
FROM territories t
INNER JOIN territory_ownership o ON t.id = o.territory_id
INNER JOIN companies c ON o.company_id = c.id
WHERE t.is_dma = true
  AND o.status = 'active'
  AND o.ended_at IS NULL;
```

### Find Territories That Should Be "Taken" (Via DMA)
```sql
SELECT t.*
FROM territories t
INNER JOIN territories dma ON t.dma_id = dma.id
INNER JOIN territory_ownership o ON dma.id = o.territory_id
WHERE o.status = 'active'
  AND o.ended_at IS NULL
  AND (t.is_dma IS NULL OR t.is_dma = false);
```

## Application Logic Checklist

When determining if a territory is available:

1. ✅ Check `territory_ownership` for direct ownership
2. ✅ If `dma_id` exists, check if parent DMA is owned
3. ✅ Check `status` field as fallback (`'taken'` = owned)
4. ✅ Use `createServiceClient()` to bypass RLS when checking all ownerships
5. ✅ Mark individual territories as "taken" if their parent DMA is owned

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Individual territory shows "available" when DMA is "taken" | Not checking `dma_id` relationship | Check parent DMA ownership and mark as taken |
| Missing `dma_id` associations | Territories not linked to DMAs | Run `sql/fix_all_dma_associations.sql` |
| Can't see ownership records | RLS blocking access | Use `createServiceClient()` instead of `createClient()` |
| Status doesn't match ownership | Status field not updated | Update `status` when ownership changes |

## Field Reference

### `territories` Table
- `is_dma`: `true` = DMA, `false`/`null` = individual territory
- `dma_id`: Points to parent DMA (null for DMAs and standalone territories)
- `status`: `'available'` | `'held'` | `'taken'`

### `territory_ownership` Table
- `territory_id`: The territory being owned (can be DMA or individual)
- `company_id`: The owning company
- `status`: `'active'` | `'canceled'`
- `ended_at`: NULL = still active, timestamp = canceled

## Relationship Flow

```
User (profiles)
  ↓ (1:1)
Company (companies)
  ↓ (1:N)
Territory Ownership (territory_ownership)
  ↓ (1:1)
Territory (territories)
  ↓ (self-referential via dma_id)
  ├─→ DMA Territory (is_dma = true, dma_id = null)
  └─→ Individual Territory (is_dma = false/null, dma_id = <dma_id>)
```

## For More Details

See `sql/TERRITORY_DMA_RELATIONSHIPS.md` for complete documentation.


