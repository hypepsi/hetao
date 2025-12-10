import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import ExcretionHistoryClient from './excretion-history-client'

export default async function ExcretionHistoryPage() {
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect('/login')
  }

  return <ExcretionHistoryClient />
}






