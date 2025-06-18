import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Function to create Supabase client with environment variables
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

// GET /api/contacts - Get all contacts for user
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') // Search query
    const listId = searchParams.get('list_id') // Filter by list
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // For now, we'll use a demo user ID since we don't have auth yet
    // TODO: Replace with actual user ID from auth session
    const demoUserId = '00000000-0000-0000-0000-000000000001'

    // Simplify the query first - get contacts without complex joins
    let queryBuilder = supabase
      .from('contacts')
      .select('*')
      .eq('user_id', demoUserId)

    // Filter by list if specified
    if (listId) {
      queryBuilder = queryBuilder.filter('contact_list_memberships.list_id', 'eq', listId)
    }

    // Add search functionality
    if (query) {
      queryBuilder = queryBuilder.or(`
        first_name.ilike.%${query}%,
        last_name.ilike.%${query}%,
        company.ilike.%${query}%,
        job_title.ilike.%${query}%,
        email.ilike.%${query}%
      `)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    queryBuilder = queryBuilder
      .range(startIndex, startIndex + limit - 1)
      .order('first_name')

    const { data: contacts, error } = await queryBuilder

    if (error) {
      console.error('Error fetching contacts:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    // Transform data to match frontend interface (without list memberships for now)
    const transformedContacts = contacts?.map(contact => ({
      id: contact.id,
      firstName: contact.first_name,
      lastName: contact.last_name || '',
      company: contact.company,
      jobTitle: contact.job_title,
      email: contact.email,
      phone: contact.phone,
      linkedin: contact.linkedin_url,
      notes: contact.notes,
      tags: contact.tags || [],
      createdAt: contact.created_at,
      updatedAt: contact.updated_at,
      listIds: [] // TODO: Get list memberships separately
    })) || []

    return NextResponse.json({
      success: true,
      data: transformedContacts
    })

  } catch (error) {
    console.error('Contacts API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/contacts - Create a new contact
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const body = await request.json()
    const { 
      firstName, 
      lastName, 
      company, 
      jobTitle, 
      email, 
      phone, 
      linkedin, 
      notes, 
      tags,
      listIds = []
    } = body

    // Validation
    if (!firstName?.trim()) {
      return NextResponse.json(
        { success: false, error: 'First name is required' },
        { status: 400 }
      )
    }

    // For now, we'll use a demo user ID since we don't have auth yet
    // TODO: Replace with actual user ID from auth session
    const demoUserId = '00000000-0000-0000-0000-000000000001'

    // Create the contact
    const { data: newContact, error: contactError } = await supabase
      .from('contacts')
      .insert({
        user_id: demoUserId,
        first_name: firstName.trim(),
        last_name: lastName?.trim() || null,
        company: company?.trim() || null,
        job_title: jobTitle?.trim() || null,
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        linkedin_url: linkedin?.trim() || null,
        notes: notes?.trim() || null,
        tags: tags || [],
        relationship_strength: 1
      })
      .select()
      .single()

    if (contactError) {
      console.error('Error creating contact:', contactError)
      return NextResponse.json(
        { success: false, error: contactError.message },
        { status: 500 }
      )
    }

    // Add contact to lists if specified
    if (listIds.length > 0) {
      const memberships = listIds.map((listId: string) => ({
        contact_id: newContact.id,
        list_id: listId,
        position: 0
      }))

      const { error: membershipError } = await supabase
        .from('contact_list_memberships')
        .insert(memberships)

      if (membershipError) {
        console.error('Error adding contact to lists:', membershipError)
        // Note: Contact was created successfully, just membership failed
      }
    }

    // Transform to match frontend interface
    const transformedContact = {
      id: newContact.id,
      firstName: newContact.first_name,
      lastName: newContact.last_name || '',
      company: newContact.company,
      jobTitle: newContact.job_title,
      email: newContact.email,
      phone: newContact.phone,
      linkedin: newContact.linkedin_url,
      notes: newContact.notes,
      tags: newContact.tags || [],
      createdAt: newContact.created_at,
      updatedAt: newContact.updated_at,
      listIds: listIds
    }

    return NextResponse.json({
      success: true,
      data: transformedContact
    })

  } catch (error) {
    console.error('Create contact API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 