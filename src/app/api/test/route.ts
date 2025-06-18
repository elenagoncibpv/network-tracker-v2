import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Test environment variables first
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing Supabase configuration',
        env_check: {
          url_exists: !!supabaseUrl,
          key_exists: !!supabaseKey
        }
      })
    }
    
    // Test Supabase client creation
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase client created successfully',
      timestamp: new Date().toISOString(),
      config_ok: true
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
} 