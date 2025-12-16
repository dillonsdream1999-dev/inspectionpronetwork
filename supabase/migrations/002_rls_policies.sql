-- Row Level Security Policies for Inspection Pro Network

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE territory_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE territory_ownership ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get user's company ID
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id FROM companies
    WHERE owner_user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid() OR is_admin());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- Companies policies
CREATE POLICY "Users can view own company"
  ON companies FOR SELECT
  USING (owner_user_id = auth.uid() OR is_admin());

CREATE POLICY "Users can insert own company"
  ON companies FOR INSERT
  WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY "Users can update own company"
  ON companies FOR UPDATE
  USING (owner_user_id = auth.uid());

CREATE POLICY "Admins can manage all companies"
  ON companies FOR ALL
  USING (is_admin());

-- Territories policies
CREATE POLICY "Anyone can view territory availability metadata"
  ON territories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage territories"
  ON territories FOR ALL
  USING (is_admin());

-- Territory holds policies
CREATE POLICY "Users can view own company holds"
  ON territory_holds FOR SELECT
  USING (company_id = get_user_company_id() OR is_admin());

CREATE POLICY "Users can create holds for own company"
  ON territory_holds FOR INSERT
  WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Admins can manage all holds"
  ON territory_holds FOR ALL
  USING (is_admin());

-- Territory ownership policies
CREATE POLICY "Users can view own company ownership"
  ON territory_ownership FOR SELECT
  USING (company_id = get_user_company_id() OR is_admin());

CREATE POLICY "Admins can manage all ownership"
  ON territory_ownership FOR ALL
  USING (is_admin());

-- Leads policies
CREATE POLICY "Users can view own company leads"
  ON leads FOR SELECT
  USING (company_id = get_user_company_id() OR is_admin());

CREATE POLICY "Users can update own company leads"
  ON leads FOR UPDATE
  USING (company_id = get_user_company_id());

CREATE POLICY "Admins can manage all leads"
  ON leads FOR ALL
  USING (is_admin());

CREATE POLICY "Service role can insert leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'operator');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

