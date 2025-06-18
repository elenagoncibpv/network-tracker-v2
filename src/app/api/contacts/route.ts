import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// GET /api/contacts - Get all contacts for user
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing Supabase configuration' 
      }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    const demoUserId = '00000000-0000-0000-0000-000000000001'

    // First try to get data for the original demo user
    let { data: contacts, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', demoUserId)
      .order('first_name')

    // If no data found, get all contacts (for development/migration)
    if (!error && (!contacts || contacts.length === 0)) {
      const { data: allContacts, error: allError } = await supabase
        .from('contacts')
        .select('*')
        .order('first_name')
      
      if (!allError) {
        contacts = allContacts
      }
    }

    if (error) {
      console.error('Error fetching contacts:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    const transformedContacts = (contacts || []).map(contact => ({
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
      listIds: [] // Will be populated separately
    }))

    return NextResponse.json({ 
      success: true, 
      data: transformedContacts 
    })

  } catch (error) {
    console.error('Contacts API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// POST /api/contacts - Create a new contact
export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing Supabase configuration' 
      }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    const body = await request.json()
    const { firstName, lastName, company, jobTitle, email, phone, linkedin, notes, tags } = body

    if (!firstName?.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'First name is required' 
      }, { status: 400 })
    }

    const demoUserId = '00000000-0000-0000-0000-000000000001'

    const { data: newContact, error } = await supabase
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

    if (error) {
      console.error('Error creating contact:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

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
      listIds: []
    }

    return NextResponse.json({ 
      success: true, 
      data: transformedContact 
    })

  } catch (error) {
    console.error('Create contact API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
} 