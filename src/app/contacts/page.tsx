import React from 'react'
import { AppShell } from '../../components/layout/app-shell'
import { ContactsList } from '../../components/contacts-list'

export default function ContactsPage() {
  return (
    <AppShell>
      <ContactsList />
    </AppShell>
  )
} 