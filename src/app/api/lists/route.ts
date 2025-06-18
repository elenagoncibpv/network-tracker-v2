import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// GET /api/lists - Get all contact lists for user
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, error: 'Missing Supabase configuration' },
        { status: 500 }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    const demoUserId = '00000000-0000-0000-0000-000000000001'

    // First try to get data for the original demo user
    let { data: lists, error } = await supabase
      .from('contact_lists')
      .select('*')
      .eq('user_id', demoUserId)
      .order('position')

    // If no data found, get all lists (for development/migration)
    if (!error && (!lists || lists.length === 0)) {
      const { data: allLists, error: allError } = await supabase
        .from('contact_lists')
        .select('*')
        .order('position')
      
      if (!allError) {
        lists = allLists
      }
    }

    if (error) {
      console.error('Error fetching lists:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    const transformedLists = (lists || []).map(list => ({
      id: list.id,
      name: list.name,
      description: list.description,
      color: list.color,
      icon: list.icon,
      isFavorite: list.is_favorite,
      contactCount: 0, // Will be updated with actual count later
      createdAt: list.created_at,
      updatedAt: list.updated_at,
      tags: list.tags || []
    }))

    return NextResponse.json({
      success: true,
      data: transformedLists
    })

  } catch (error) {
    console.error('Lists API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/lists - Create a new contact list
export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, error: 'Missing Supabase configuration' },
        { status: 500 }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    const body = await request.json()
    const { name, description, color, icon } = body

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'List name is required' },
        { status: 400 }
      )
    }

    const demoUserId = '00000000-0000-0000-0000-000000000001'

    const { data: newList, error } = await supabase
      .from('contact_lists')
      .insert({
        user_id: demoUserId,
        name: name.trim(),
        description: description?.trim() || null,
        color: color || '#3B82F6',
        icon: icon || '📁',
        is_favorite: false,
        position: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating list:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    const transformedList = {
      id: newList.id,
      name: newList.name,
      description: newList.description,
      color: newList.color,
      icon: newList.icon,
      isFavorite: newList.is_favorite,
      contactCount: 0,
      createdAt: newList.created_at,
      updatedAt: newList.updated_at,
      tags: newList.tags || []
    }

    return NextResponse.json({
      success: true,
      data: transformedList
    })

  } catch (error) {
    console.error('Create list API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 