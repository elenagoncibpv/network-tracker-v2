import React from 'react'
import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to /lists as per app flow document
  redirect('/lists')
} 