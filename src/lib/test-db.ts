import { config } from 'dotenv'
import { supabase } from './supabase'

// Load environment variables from .env.local
config({ path: '.env.local' })

export async function testDatabaseConnection() {
  try {
    // Test 1: Check if we can connect to Supabase
    const { data, error } = await supabase
      .from('contact_lists')
      .select('count', { count: 'exact' })
    
    if (error) {
      console.error('Database connection error:', error)
      return false
    }

    console.log('✅ Database connection successful!')
    console.log(`📊 Contact lists table exists and has ${data?.length || 0} rows`)

    // Test 2: Check if our helper functions exist
    const { data: statsData, error: statsError } = await supabase
      .rpc('get_dashboard_stats', { user_uuid: '00000000-0000-0000-0000-000000000000' })

    if (statsError) {
      console.error('Helper function test failed:', statsError)
      return false
    }

    console.log('✅ Database helper functions are working!')
    console.log('🎉 Database setup is complete and ready to use!')
    return true

  } catch (error) {
    console.error('Connection test failed:', error)
    return false
  }
}

// For development testing
if (typeof window === 'undefined') {
  // Only run in Node.js environment (not in browser)
  testDatabaseConnection()
} 