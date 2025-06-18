# Network Tracker - Database Setup Guide

This guide will help you set up the Supabase database for the Network Tracker application.

## Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Supabase CLI** (optional but recommended): Install the [Supabase CLI](https://supabase.com/docs/guides/cli)

## Quick Setup (Method 1: SQL Editor)

### Step 1: Create a New Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New project"
3. Choose your organization
4. Enter project name: `network-tracker`
5. Enter a strong database password
6. Select a region close to your users
7. Click "Create new project"

### Step 2: Run the Database Setup Script

1. Wait for your project to finish setting up (usually 1-2 minutes)
2. Navigate to the "SQL Editor" tab in your Supabase dashboard
3. Click "New query"
4. Copy the entire contents of `supabase-setup.sql` and paste it into the editor
5. Click "Run" to execute the script

The script will create:
- ✅ All necessary tables with proper relationships
- ✅ Row Level Security (RLS) policies
- ✅ Performance indexes
- ✅ Helper functions for common operations
- ✅ Automatic timestamp triggers

## Alternative Setup (Method 2: Using Supabase CLI)

If you prefer using the CLI:

### Step 1: Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# npm
npm install -g supabase

# Other platforms: https://supabase.com/docs/guides/cli
```

### Step 2: Initialize Local Development

```bash
# Initialize a new Supabase project
supabase init

# Link to your remote project
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Apply migrations
supabase db push
```

### Step 3: Run Setup Script

```bash
# Execute the setup script
supabase db reset
cat supabase-setup.sql | supabase db sql
```

## Environment Configuration

After setting up the database, you'll need to configure your environment variables:

### Step 1: Get Your Project Credentials

1. Go to your Supabase project dashboard
2. Navigate to "Settings" → "API"
3. Copy the following values:
   - Project URL
   - Anon public key
   - Service role key (keep this secret!)

### Step 2: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Google OAuth (for future implementation)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Database Schema Overview

The database consists of 5 main tables:

### 1. `users`
- Stores user profiles with Google OAuth integration
- Includes sync preferences and Google Sheets ID

### 2. `contact_lists`
- Stores contact lists/categories
- Supports colors, icons, favorites, and tags
- Links to Google Sheets tabs for sync

### 3. `contacts`
- Stores individual contact information
- Includes professional details, social links, and notes
- Supports tagging and relationship strength tracking

### 4. `contact_list_memberships`
- Many-to-many relationship between contacts and lists
- Supports contact ordering within lists

### 5. `sync_queue`
- Manages background synchronization with Google Sheets
- Tracks operation status and handles retry logic

## Data Model Mapping

The database schema maps to your UI data model as follows:

### Frontend Types → Database Fields

**ContactList Interface:**
```typescript
// Frontend                → Database
id: string                 → id (UUID)
name: string              → name
description?: string      → description
color: ListColor          → color
icon?: string             → icon
isFavorite: boolean       → is_favorite
contactCount: number      → (calculated via JOIN)
createdAt: Date           → created_at
updatedAt: Date           → updated_at
tags?: string[]           → tags
```

**Contact Interface:**
```typescript
// Frontend                → Database
id: string                → id (UUID)
firstName: string         → first_name
lastName: string          → last_name
company?: string          → company
jobTitle?: string         → job_title
email?: string            → email
phone?: string            → phone
linkedin?: string         → linkedin_url
notes?: string            → notes
tags?: string[]           → tags
createdAt: Date           → created_at
updatedAt: Date           → updated_at
listIds: string[]         → (via contact_list_memberships)
```

## Helper Functions Available

The setup script includes several helper functions you can use in your API routes:

### `get_contact_with_lists(contact_uuid)`
Returns a contact with all its list memberships in one query.

### `get_list_with_contact_count(list_uuid)`
Returns a list with its contact count.

### `get_dashboard_stats(user_uuid)`
Returns dashboard statistics (total lists, contacts, favorites, recently added).

### `add_contact_to_list(contact_uuid, list_uuid)`
Safely adds a contact to a list with proper authorization checks.

### `remove_contact_from_list(contact_uuid, list_uuid)`
Safely removes a contact from a list.

## Security Features

- **Row Level Security (RLS)**: All tables have RLS enabled
- **User Isolation**: Users can only access their own data
- **Authorization Checks**: Helper functions include ownership validation
- **Secure Functions**: All functions use `SECURITY DEFINER` for consistent permissions

## Next Steps

1. ✅ Database setup complete
2. 🔄 **Next**: Implement Supabase client in your Next.js app
3. 🔄 **Next**: Create API routes for CRUD operations
4. 🔄 **Next**: Implement Google OAuth authentication
5. 🔄 **Next**: Add Google Sheets synchronization

## Troubleshooting

### Common Issues

**"relation does not exist" error:**
- Make sure you ran the complete setup script
- Check that all tables were created successfully

**RLS policy errors:**
- Ensure you're using authenticated requests
- Verify the user has proper permissions

**Performance issues:**
- The setup includes optimized indexes
- Monitor query performance in Supabase dashboard

### Useful Commands

```sql
-- Check if all tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Check RLS policies
SELECT tablename, policyname FROM pg_policies;

-- Check indexes
SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public';

-- Test helper functions
SELECT * FROM get_dashboard_stats(auth.uid());
```

## Support

If you encounter any issues:

1. Check the Supabase dashboard logs
2. Verify your environment variables
3. Ensure the setup script ran completely
4. Refer to the [Supabase documentation](https://supabase.com/docs)

---

**Database Setup Complete!** 🎉

Your Network Tracker database is now ready for development. The schema supports all the features shown in your UI mockups and is optimized for performance and security. 