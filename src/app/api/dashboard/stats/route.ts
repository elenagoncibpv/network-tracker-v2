import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET() {
  try {
    // Create Supabase client only when function is called
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, error: 'Missing Supabase configuration' },
        { status: 500 }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // For now, we'll use a demo user ID since we don't have auth yet
    // TODO: Replace with actual user ID from auth session
    const demoUserId = '00000000-0000-0000-0000-000000000001'

    // Use our helper function from the database
    const { data: stats, error } = await supabase
      .rpc('get_dashboard_stats', { user_uuid: demoUserId })

    if (error) {
      console.error('Error fetching dashboard stats:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    // The function returns an array with one object
    const statsData = stats?.[0] || {
      total_lists: 0,
      total_contacts: 0,
      favorite_lists: 0,
      recently_added: 0
    }

    // Transform to match frontend interface
    const transformedStats = {
      totalLists: statsData.total_lists,
      totalContacts: statsData.total_contacts,
      favoriteLists: statsData.favorite_lists,
      recentlyAdded: statsData.recently_added
    }

    return NextResponse.json({
      success: true,
      data: transformedStats
    })

  } catch (error) {
    console.error('Dashboard stats API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 