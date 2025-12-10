import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import FeedingHistoryClient from './feeding-history-client'

export default async function FeedingHistoryPage() {
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect('/login')
  }

  return <FeedingHistoryClient />
}






