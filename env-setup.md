# Environment Setup Guide

## Your Supabase Project Details

- **Project URL**: https://supabase.com/dashboard/project/emtkvlqseomvqphwxskz  
- **Project Reference ID**: emtkvlqseomvqphwxskz

## Step 1: Get Your API Keys

1. Go to: https://supabase.com/dashboard/project/emtkvlqseomvqphwxskz/settings/api
2. Copy the following values:
   - **Project URL**: `https://emtkvlqseomvqphwxskz.supabase.co`
   - **anon public key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtdGt2bHFzZW9tdnFwaHd4c2t6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzAwNjcsImV4cCI6MjA2NTg0NjA2N30.dKhkONaWDuMbL1hBlsLi6J7RDGY8u_laZ3bGjJX_4E8
   - **service_role key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtdGt2bHFzZW9tdnFwaHd4c2t6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDI3MDA2NywiZXhwIjoyMDY1ODQ2MDY3fQ.58y3aWxzEOZ1hnhqBkTd8dDb36CHmKtqcRxZ24Mkxhk

## Step 2: Create .env.local File

Create a `.env.local` file in your project root with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://emtkvlqseomvqphwxskz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=paste_your_service_role_key_here

# Google OAuth (for future implementation)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Step 3: Run Database Setup

1. **Open your project**: https://supabase.com/dashboard/project/emtkvlqseomvqphwxskz
2. **Go to SQL Editor**: Click "SQL Editor" in left sidebar
3. **Create New Query**: Click "New query"
4. **Copy & Paste**: Copy the entire contents of `supabase-setup.sql` file
5. **Run**: Click "Run" to execute the script

## What the Setup Script Creates

✅ **5 Tables**: users, contact_lists, contacts, contact_list_memberships, sync_queue  
✅ **Row Level Security**: Users can only access their own data  
✅ **Performance Indexes**: Fast queries for contacts and lists  
✅ **Helper Functions**: Common operations like adding contacts to lists  
✅ **Triggers**: Automatic timestamp updates  

## Verify Setup

After running the script, you should see a success message and all tables created in the Supabase dashboard.

---

**Next Steps**: Once this is complete, you'll be ready to connect your Next.js app to the database! 