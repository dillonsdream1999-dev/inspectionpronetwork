# Inspection Pro Network

**Powered by Bed Bug Inspection Pro**

A B2B SaaS platform that sells exclusive territory subscriptions to pest control operators. Consumer leads come from the Bed Bug Inspection Pro mobile app, with both systems sharing the same Supabase database.

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Inspection Pro Network                        │
│                    (Next.js Web Application)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Marketing  │  │   Operator   │  │       Admin          │   │
│  │    Pages     │  │   Dashboard  │  │       Panel          │   │
│  │  (/, /territories) │  │ (/dashboard/*) │  │   (/admin/*)  │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                        API Routes                                │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                 │
│  │   Auth     │  │   Stripe   │  │ Territories│                 │
│  │  Callback  │  │  Checkout  │  │    API     │                 │
│  │            │  │  Webhooks  │  │            │                 │
│  └────────────┘  └────────────┘  └────────────┘                 │
│                                                                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Supabase                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      PostgreSQL                           │   │
│  │  ┌──────────┐  ┌────────────┐  ┌─────────────────────┐   │   │
│  │  │ profiles │  │ territories│  │ territory_ownership │   │   │
│  │  └──────────┘  └────────────┘  └─────────────────────┘   │   │
│  │  ┌──────────┐  ┌────────────┐  ┌─────────────────────┐   │   │
│  │  │companies │  │   leads    │  │   territory_holds   │   │   │
│  │  └──────────┘  └────────────┘  └─────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          + Auth + RLS                            │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Shared with
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│               Bed Bug Inspection Pro Mobile App                  │
│                    (Consumer-facing app)                         │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Payments
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                          Stripe                                  │
│  ┌────────────────┐  ┌─────────────────┐                        │
│  │ Subscriptions  │  │    Webhooks     │                        │
│  │ $250/mo base   │  │ checkout.session│                        │
│  │ $220/mo adj.   │  │ subscription.*  │                        │
│  └────────────────┘  └─────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 File Structure

```
inspection-pro-network/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (marketing)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Homepage
│   │   │   └── territories/
│   │   │       └── page.tsx       # Territory marketplace
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Admin dashboard
│   │   │   ├── providers/
│   │   │   │   └── page.tsx
│   │   │   └── territories/
│   │   │       ├── page.tsx
│   │   │       ├── new/
│   │   │       │   └── page.tsx
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── callback/
│   │   │   │       └── route.ts
│   │   │   ├── admin/
│   │   │   │   └── territories/
│   │   │   │       └── import/
│   │   │   │           └── route.ts
│   │   │   ├── stripe/
│   │   │   │   ├── cancel/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── checkout/
│   │   │   │   │   └── route.ts
│   │   │   │   └── webhook/
│   │   │   │       └── route.ts
│   │   │   └── territories/
│   │   │       ├── route.ts
│   │   │       └── adjacent-eligible/
│   │   │           └── route.ts
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Dashboard overview
│   │   │   ├── leads/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── territories/
│   │   │       └── page.tsx
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── admin/
│   │   │   ├── TerritoryAdminTable.tsx
│   │   │   └── TerritoryUploader.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardNav.tsx
│   │   │   ├── LeadActions.tsx
│   │   │   └── TerritoryManageCard.tsx
│   │   ├── marketing/
│   │   │   ├── CostComparison.tsx
│   │   │   └── TerritoryCalculator.tsx
│   │   ├── territories/
│   │   │   ├── TerritoryCard.tsx
│   │   │   └── TerritoryFilters.tsx
│   │   └── ui/
│   │       ├── Footer.tsx
│   │       └── Header.tsx
│   ├── lib/
│   │   ├── stripe/
│   │   │   └── index.ts
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── middleware.ts
│   │       └── server.ts
│   ├── middleware.ts
│   └── types/
│       └── database.ts
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   └── 002_rls_policies.sql
│   └── seed/
│       └── territories.json
├── .env.local.example
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account

### 1. Clone and Install

```bash
cd inspection-pro-network
npm install
```

### 2. Environment Setup

Copy the example environment file and fill in your values:

```bash
cp .env.local.example .env.local
```

Required environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Price IDs (create these in Stripe Dashboard)
STRIPE_PRICE_BASE_250=price_...
STRIPE_PRICE_ADJACENT_220=price_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

Run the SQL migrations in your Supabase SQL Editor:

1. Run `supabase/migrations/001_initial_schema.sql`
2. Run `supabase/migrations/002_rls_policies.sql`

### 4. Stripe Setup

1. Create two products in Stripe Dashboard:
   - **Territory Subscription (Base)**: $250/month recurring
   - **Territory Subscription (Adjacent)**: $220/month recurring
2. Copy the price IDs to your `.env.local`
3. Set up webhook endpoint: `https://your-domain.com/api/stripe/webhook`
4. Listen for these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 5. Create Admin User

After creating your first account, run this SQL in Supabase:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-admin@email.com';
```

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 💰 Pricing Model

| Subscription Type | Price | Condition |
|-------------------|-------|-----------|
| Base Territory | $250/month | Default for any territory |
| Adjacent Territory | $220/month | When operator already owns an adjacent territory |

**Adjacent Discount Rules:**
- Discount only applies at checkout if operator has an active subscription to an adjacent territory
- If original territory is canceled, remaining adjacent territory reverts to $250/mo at next billing cycle
- Adjacency is verified via `adjacent_ids` array on territory records

## 📊 Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| `profiles` | Extends auth.users with role (operator/admin) |
| `companies` | Pest control company profiles |
| `territories` | Territory definitions with ZIP codes |
| `territory_holds` | Temporary 10-minute holds during checkout |
| `territory_ownership` | Active subscriptions linking companies to territories |
| `leads` | Consumer leads from the mobile app |

### Key Relationships

```
profiles 1:1 companies (owner_user_id)
companies 1:N territory_ownership
territories 1:1 territory_ownership (exclusive)
territories 1:N leads
companies 1:N leads
```

## 🔒 Row Level Security

| Table | Operators | Admins |
|-------|-----------|--------|
| profiles | Own only | All |
| companies | Own only | All |
| territories | Read all | Full CRUD |
| territory_holds | Own company | All |
| territory_ownership | Own company | All |
| leads | Own company | All |

## 🎯 Key Features

### For Operators
- Browse and claim exclusive territories
- Manage territory subscriptions
- View and manage leads
- Track lead status (new → contacted → booked)

### For Admins
- Create/edit/delete territories
- Bulk import territories via JSON
- Define territory adjacency
- View all providers and subscriptions
- Monitor MRR and platform metrics

## 📋 Territory Seed Data Format

```json
{
  "territories": [
    {
      "name": "Denver Metro Central",
      "state": "CO",
      "metro_area": "Denver",
      "type": "metro",
      "population_est": 95000,
      "zip_codes": ["80202", "80203", "80204"],
      "adjacent_territory_names": ["Denver Metro East"]
    }
  ]
}
```

## ✅ QA Checklist

### Territory Exclusivity
- [ ] Only one company can own a territory at a time
- [ ] `territory_ownership.territory_id` has UNIQUE constraint
- [ ] Status properly updates: available → held → taken

### Hold Expiration
- [ ] Holds expire after 10 minutes
- [ ] Expired holds are cleaned up on territory list fetch
- [ ] Territory returns to "available" when hold expires

### Adjacent Discount
- [ ] Discount correctly applied at checkout when eligible
- [ ] Eligibility checked server-side, not just client
- [ ] Price stored in `territory_ownership.price_type`

### Discount Revocation
- [ ] When subscription canceled, check if remaining subscriptions lose adjacency
- [ ] Update Stripe subscription price if adjacency lost
- [ ] Price change takes effect at next billing cycle

### RLS Protection
- [ ] Operators can only see their own leads
- [ ] Operators can only see their own territories
- [ ] Operators cannot access admin routes
- [ ] Unauthenticated users cannot access dashboard

### Stripe Webhooks
- [ ] `checkout.session.completed` creates ownership record
- [ ] `customer.subscription.deleted` releases territory
- [ ] Webhook signature verification is enforced

## 🚀 Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

Configure your Stripe webhook to point to:
```
https://your-domain.vercel.app/api/stripe/webhook
```

## 📝 Compliance Notes

### Allowed Language
- ✅ "Exclusive territory access"
- ✅ "Inspection-driven demand"
- ✅ "High-intent homeowners"
- ✅ "Cost comparison to Google Ads"

### Disallowed Language
- ❌ Guaranteed leads
- ❌ X leads per month
- ❌ Diagnosis / confirmed infestation
- ❌ AI detects bed bugs

---

Built with ❤️ for pest control professionals
