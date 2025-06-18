-- Network Tracker - Supabase Database Setup
-- This script creates all tables, indexes, RLS policies, and functions for the Network Tracker app

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. CORE TABLES
-- =============================================

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  google_sheet_id VARCHAR(255),
  sync_enabled BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Lists Table
CREATE TABLE contact_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  icon VARCHAR(50) DEFAULT 'folder',
  is_favorite BOOLEAN DEFAULT false,
  sheet_tab_name VARCHAR(255),
  position INTEGER DEFAULT 0,
  tags TEXT[], -- Array of tags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts Table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  company VARCHAR(255),
  job_title VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  linkedin_url TEXT,
  website TEXT,
  notes TEXT,
  tags TEXT[], -- Array of tags
  meeting_location VARCHAR(255),
  meeting_date DATE,
  relationship_strength INTEGER DEFAULT 1, -- 1-5 scale
  sheet_row_number INTEGER,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact List Memberships Table (Many-to-Many relationship)
CREATE TABLE contact_list_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  list_id UUID REFERENCES contact_lists(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(contact_id, list_id)
);

-- Sync Queue Table for Google Sheets synchronization
CREATE TABLE sync_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  operation_type VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete'
  entity_type VARCHAR(50) NOT NULL, -- 'contact', 'list'
  entity_id UUID NOT NULL,
  payload JSONB,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  error_message TEXT,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- 2. INDEXES FOR PERFORMANCE
-- =============================================

-- Users indexes
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_email ON users(email);

-- Contact Lists indexes
CREATE INDEX idx_contact_lists_user_id ON contact_lists(user_id);
CREATE INDEX idx_contact_lists_name ON contact_lists(name);
CREATE INDEX idx_contact_lists_position ON contact_lists(user_id, position);

-- Contacts indexes
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_name ON contacts(first_name, last_name);
CREATE INDEX idx_contacts_company ON contacts(company);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_tags ON contacts USING GIN(tags);
CREATE INDEX idx_contacts_created_at ON contacts(created_at);

-- Contact List Memberships indexes
CREATE INDEX idx_memberships_contact_id ON contact_list_memberships(contact_id);
CREATE INDEX idx_memberships_list_id ON contact_list_memberships(list_id);
CREATE INDEX idx_memberships_position ON contact_list_memberships(list_id, position);

-- Sync Queue indexes
CREATE INDEX idx_sync_queue_user_status ON sync_queue(user_id, status);
CREATE INDEX idx_sync_queue_entity ON sync_queue(entity_type, entity_id);
CREATE INDEX idx_sync_queue_created_at ON sync_queue(created_at);

-- =============================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_list_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_queue ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = google_id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = google_id);

-- Contact lists policies
CREATE POLICY "Users can view own contact lists" ON contact_lists
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own contact lists" ON contact_lists
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own contact lists" ON contact_lists
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own contact lists" ON contact_lists
  FOR DELETE USING (user_id = auth.uid());

-- Contacts policies
CREATE POLICY "Users can view own contacts" ON contacts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own contacts" ON contacts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own contacts" ON contacts
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own contacts" ON contacts
  FOR DELETE USING (user_id = auth.uid());

-- Contact list memberships policies
CREATE POLICY "Users can view own list memberships" ON contact_list_memberships
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM contact_lists 
      WHERE id = list_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own list memberships" ON contact_list_memberships
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM contact_lists 
      WHERE id = list_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own list memberships" ON contact_list_memberships
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM contact_lists 
      WHERE id = list_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own list memberships" ON contact_list_memberships
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM contact_lists 
      WHERE id = list_id AND user_id = auth.uid()
    )
  );

-- Sync queue policies
CREATE POLICY "Users can view own sync queue" ON sync_queue
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sync queue items" ON sync_queue
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own sync queue items" ON sync_queue
  FOR UPDATE USING (user_id = auth.uid());

-- =============================================
-- 4. DATABASE FUNCTIONS
-- =============================================

-- Function to get contact with list memberships
CREATE OR REPLACE FUNCTION get_contact_with_lists(contact_uuid UUID)
RETURNS TABLE (
  contact_data JSONB,
  list_memberships JSONB[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_jsonb(c.*) as contact_data,
    ARRAY_AGG(
      jsonb_build_object(
        'list_id', cl.id,
        'list_name', cl.name,
        'list_color', cl.color,
        'list_icon', cl.icon
      )
    ) as list_memberships
  FROM contacts c
  LEFT JOIN contact_list_memberships clm ON c.id = clm.contact_id
  LEFT JOIN contact_lists cl ON clm.list_id = cl.id
  WHERE c.id = contact_uuid AND c.user_id = auth.uid()
  GROUP BY c.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get list with contact count
CREATE OR REPLACE FUNCTION get_list_with_contact_count(list_uuid UUID)
RETURNS TABLE (
  list_data JSONB,
  contact_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_jsonb(cl.*) as list_data,
    COUNT(clm.contact_id)::INTEGER as contact_count
  FROM contact_lists cl
  LEFT JOIN contact_list_memberships clm ON cl.id = clm.list_id
  WHERE cl.id = list_uuid AND cl.user_id = auth.uid()
  GROUP BY cl.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats(user_uuid UUID)
RETURNS TABLE (
  total_lists INTEGER,
  total_contacts INTEGER,
  favorite_lists INTEGER,
  recently_added INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::INTEGER FROM contact_lists WHERE user_id = user_uuid) as total_lists,
    (SELECT COUNT(*)::INTEGER FROM contacts WHERE user_id = user_uuid) as total_contacts,
    (SELECT COUNT(*)::INTEGER FROM contact_lists WHERE user_id = user_uuid AND is_favorite = true) as favorite_lists,
    (SELECT COUNT(*)::INTEGER FROM contacts WHERE user_id = user_uuid AND created_at >= NOW() - INTERVAL '7 days') as recently_added;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add contact to list
CREATE OR REPLACE FUNCTION add_contact_to_list(contact_uuid UUID, list_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_owns_contact BOOLEAN;
  user_owns_list BOOLEAN;
  max_position INTEGER;
BEGIN
  -- Check if user owns both contact and list
  SELECT EXISTS(SELECT 1 FROM contacts WHERE id = contact_uuid AND user_id = auth.uid()) INTO user_owns_contact;
  SELECT EXISTS(SELECT 1 FROM contact_lists WHERE id = list_uuid AND user_id = auth.uid()) INTO user_owns_list;
  
  IF NOT user_owns_contact OR NOT user_owns_list THEN
    RETURN FALSE;
  END IF;
  
  -- Get max position in list
  SELECT COALESCE(MAX(position), -1) + 1 FROM contact_list_memberships WHERE list_id = list_uuid INTO max_position;
  
  -- Insert membership (ON CONFLICT DO NOTHING handles duplicates)
  INSERT INTO contact_list_memberships (contact_id, list_id, position)
  VALUES (contact_uuid, list_uuid, max_position)
  ON CONFLICT (contact_id, list_id) DO NOTHING;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to remove contact from list
CREATE OR REPLACE FUNCTION remove_contact_from_list(contact_uuid UUID, list_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_owns_list BOOLEAN;
BEGIN
  -- Check if user owns the list
  SELECT EXISTS(SELECT 1 FROM contact_lists WHERE id = list_uuid AND user_id = auth.uid()) INTO user_owns_list;
  
  IF NOT user_owns_list THEN
    RETURN FALSE;
  END IF;
  
  -- Delete membership
  DELETE FROM contact_list_memberships 
  WHERE contact_id = contact_uuid AND list_id = list_uuid;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 5. TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- =============================================

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_lists_updated_at 
  BEFORE UPDATE ON contact_lists 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at 
  BEFORE UPDATE ON contacts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 6. INITIAL DATA SETUP (Optional - for development)
-- =============================================

-- Note: This section would be used for seeding initial data
-- Uncomment and modify as needed for development/testing

/*
-- Example: Insert a demo user (for development only)
INSERT INTO users (google_id, email, name, avatar_url) 
VALUES ('demo-user-123', 'demo@example.com', 'Demo User', 'https://example.com/avatar.jpg')
ON CONFLICT (google_id) DO NOTHING;
*/

-- =============================================
-- SETUP COMPLETE
-- =============================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant permissions to anon users for auth endpoints
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON users TO anon;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Network Tracker database setup completed successfully!';
  RAISE NOTICE 'Tables created: users, contact_lists, contacts, contact_list_memberships, sync_queue';
  RAISE NOTICE 'RLS policies enabled for all tables';
  RAISE NOTICE 'Performance indexes created';
  RAISE NOTICE 'Helper functions created for common operations';
END $$; 