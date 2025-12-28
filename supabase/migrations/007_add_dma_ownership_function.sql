-- Function to get the company owner for a territory
-- This checks both direct ownership and DMA ownership
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

-- Create an index on territories.dma_id for better performance
CREATE INDEX IF NOT EXISTS idx_territories_dma_id ON territories(dma_id) WHERE dma_id IS NOT NULL;

-- Trigger function to automatically set company_id when a lead is inserted
-- This ensures leads are routed correctly even if company_id is not provided
CREATE OR REPLACE FUNCTION set_lead_company_from_territory()
RETURNS TRIGGER AS $$
DECLARE
  owner_company_id UUID;
BEGIN
  -- If company_id is already set, don't override it
  IF NEW.company_id IS NOT NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get the owner company for the territory (handles DMA ownership)
  SELECT get_territory_owner(NEW.territory_id) INTO owner_company_id;
  
  -- Set the company_id if an owner was found
  IF owner_company_id IS NOT NULL THEN
    NEW.company_id := owner_company_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-set company_id on lead insert
DROP TRIGGER IF EXISTS set_lead_company_trigger ON leads;
CREATE TRIGGER set_lead_company_trigger
  BEFORE INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION set_lead_company_from_territory();

