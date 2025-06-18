import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for admin operations
)

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001'

export async function seedDatabase() {
  console.log('🌱 Seeding database with demo data...')

  try {
    // 1. Create demo user
    console.log('📝 Creating demo user...')
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: DEMO_USER_ID,
        google_id: 'demo-user-123',
        email: 'demo@networktracker.com',
        name: 'Demo User',
        avatar_url: null,
        sync_enabled: false
      })

    if (userError) {
      console.error('Error creating user:', userError)
      return false
    }

    // 2. Create demo contact lists
    console.log('📁 Creating demo contact lists...')
    const demoLists = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        user_id: DEMO_USER_ID,
        name: 'Tech Summit 2024',
        description: 'Contacts from the annual tech summit',
        color: '#3B82F6',
        icon: '💻',
        is_favorite: true,
        position: 0,
        tags: ['tech', 'conference', 'networking']
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        user_id: DEMO_USER_ID,
        name: 'Startup Meetup',
        description: 'Local entrepreneur networking group',
        color: '#10B981',
        icon: '🚀',
        is_favorite: true,
        position: 1,
        tags: ['startup', 'local', 'entrepreneurs']
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        user_id: DEMO_USER_ID,
        name: 'Sales Conference',
        description: 'Annual sales and marketing conference',
        color: '#8B5CF6',
        icon: '📈',
        is_favorite: false,
        position: 2,
        tags: ['sales', 'marketing', 'conference']
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        user_id: DEMO_USER_ID,
        name: 'University Alumni',
        description: 'Fellow graduates from university',
        color: '#F59E0B',
        icon: '🎓',
        is_favorite: true,
        position: 3,
        tags: ['alumni', 'university', 'education']
      }
    ]

    const { error: listsError } = await supabase
      .from('contact_lists')
      .upsert(demoLists)

    if (listsError) {
      console.error('Error creating lists:', listsError)
      return false
    }

    // 3. Create demo contacts
    console.log('👥 Creating demo contacts...')
    const demoContacts = [
      {
        id: 'c1111111-1111-1111-1111-111111111111',
        user_id: DEMO_USER_ID,
        first_name: 'Sarah',
        last_name: 'Johnson',
        company: 'TechCorp Inc',
        job_title: 'Senior Product Manager',
        email: 'sarah.johnson@techcorp.com',
        phone: '+1 (555) 123-4567',
        linkedin_url: 'linkedin.com/in/sarahjohnson',
        notes: 'Interested in AI/ML products. Follow up about potential collaboration.',
        tags: ['AI', 'product', 'collaboration'],
        relationship_strength: 4
      },
      {
        id: 'c2222222-2222-2222-2222-222222222222',
        user_id: DEMO_USER_ID,
        first_name: 'Mike',
        last_name: 'Chen',
        company: 'StartupXYZ',
        job_title: 'Co-founder & CTO',
        email: 'mike@startupxyz.com',
        linkedin_url: 'linkedin.com/in/mikechen',
        notes: 'Building B2B SaaS platform. Very knowledgeable about scaling tech teams.',
        tags: ['founder', 'B2B', 'SaaS'],
        relationship_strength: 5
      },
      {
        id: 'c3333333-3333-3333-3333-333333333333',
        user_id: DEMO_USER_ID,
        first_name: 'Emily',
        last_name: 'Rodriguez',
        company: 'Design Studio',
        job_title: 'UX Designer',
        email: 'emily@designstudio.com',
        phone: '+1 (555) 987-6543',
        notes: 'Specializes in mobile UX. Interested in healthcare design projects.',
        tags: ['UX', 'mobile', 'healthcare'],
        relationship_strength: 3
      },
      {
        id: 'c4444444-4444-4444-4444-444444444444',
        user_id: DEMO_USER_ID,
        first_name: 'David',
        last_name: 'Wilson',
        company: 'Goldman Sachs',
        job_title: 'Investment Analyst',
        email: 'david.wilson@gs.com',
        phone: '+1 (555) 456-7890',
        linkedin_url: 'linkedin.com/in/davidwilson',
        notes: 'Focused on fintech investments. Great connection for funding opportunities.',
        tags: ['finance', 'investment', 'fintech'],
        relationship_strength: 3
      }
    ]

    const { error: contactsError } = await supabase
      .from('contacts')
      .upsert(demoContacts)

    if (contactsError) {
      console.error('Error creating contacts:', contactsError)
      return false
    }

    // 4. Create contact-list memberships
    console.log('🔗 Creating contact-list relationships...')
    const memberships = [
      // Sarah Johnson - Tech Summit & Sales Conference
      { contact_id: 'c1111111-1111-1111-1111-111111111111', list_id: '11111111-1111-1111-1111-111111111111', position: 0 },
      { contact_id: 'c1111111-1111-1111-1111-111111111111', list_id: '33333333-3333-3333-3333-333333333333', position: 0 },
      
      // Mike Chen - Startup Meetup
      { contact_id: 'c2222222-2222-2222-2222-222222222222', list_id: '22222222-2222-2222-2222-222222222222', position: 0 },
      
      // Emily Rodriguez - Tech Summit 
      { contact_id: 'c3333333-3333-3333-3333-333333333333', list_id: '11111111-1111-1111-1111-111111111111', position: 1 },
      
      // David Wilson - University Alumni
      { contact_id: 'c4444444-4444-4444-4444-444444444444', list_id: '44444444-4444-4444-4444-444444444444', position: 0 }
    ]

    const { error: membershipsError } = await supabase
      .from('contact_list_memberships')
      .upsert(memberships)

    if (membershipsError) {
      console.error('Error creating memberships:', membershipsError)
      return false
    }

    console.log('✅ Database seeded successfully!')
    console.log('📊 Created:')
    console.log('  - 1 demo user')
    console.log('  - 4 contact lists')
    console.log('  - 4 contacts')
    console.log('  - 5 list memberships')
    
    return true

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    return false
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase().then(() => process.exit(0))
} 