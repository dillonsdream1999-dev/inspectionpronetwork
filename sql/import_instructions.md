# Instructions for Importing Territories from CSV

This guide will help you import the `territories_final_unique.csv` file into Supabase.

## Step 1: Import CSV into Supabase

1. Open your Supabase project dashboard
2. Go to **Table Editor** → **New Table**
3. Create a temporary table with the following SQL:

```sql
CREATE TABLE temp_territories_import (
  id UUID,
  name TEXT,
  state TEXT,
  metro_area TEXT,
  status TEXT,
  type TEXT,
  population_est NUMERIC,
  zip_codes TEXT,
  is_dma TEXT,
  dma_id UUID,
  zip_list TEXT,
  actual_pop NUMERIC,
  zip_count_child INTEGER
);
```

4. In the Supabase dashboard, go to **Table Editor** → Select `temp_territories_import`
5. Click **Insert** → **Import data from CSV**
6. Upload your `territories_final_unique.csv` file
7. Map the columns correctly (Supabase should auto-detect them)

## Step 2: Run the Import SQL

1. Go to **SQL Editor** in Supabase
2. Open the file `sql/import_territories_from_csv.sql`
3. Copy and paste the entire SQL script into the SQL Editor
4. Click **Run** to execute the script

The script will:
- Parse zip codes from strings into arrays
- Convert `is_dma` from text ('True'/'False') to boolean
- Link individual territories to their parent DMAs via `dma_id`
- Update existing territories or insert new ones
- Preserve existing territory statuses (won't overwrite 'taken' territories)
- Provide a summary of the import

## Step 3: Verify the Import

After running the script, check the summary output. You should see:
- Total Territories
- Number of DMAs
- Number of Individual Territories
- Territories with DMA Links
- Territories with Zip Codes

## Step 4: Clean Up

After verifying the import was successful:

```sql
DROP TABLE IF EXISTS temp_territories_import;
```

## Important Notes

- **Existing Subscriptions**: The script preserves territories with status 'taken' to avoid disrupting active subscriptions
- **DMA Relationships**: Individual territories are automatically linked to their parent DMAs via the `dma_id` column
- **Zip Codes**: Zip codes are parsed from comma-separated strings into PostgreSQL arrays
- **Status Preservation**: If a territory is already marked as 'taken' (has an active subscription), its status will not be changed

## How DMA Purchases Work

When a DMA is purchased:
1. The DMA territory itself is marked as 'taken'
2. All individual territories linked to that DMA (via `dma_id`) are automatically marked as 'taken'
3. Leads for any ZIP code within those individual territories will route to the DMA owner

When a DMA subscription is canceled:
1. The DMA territory is marked as 'available'
2. All linked individual territories are marked as 'available'
3. They can then be purchased individually or as part of another DMA

## Troubleshooting

If you encounter errors:
1. Check that the `temp_territories_import` table exists and has data
2. Verify that all UUIDs in the CSV are valid
3. Check that DMA IDs in the CSV reference actual DMA territories (where `is_dma = TRUE`)
4. Review the summary output for any warnings about invalid DMA relationships

