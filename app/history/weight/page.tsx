import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import WeightHistoryClient from './weight-history-client'

export default async function WeightHistoryPage() {
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect('/login')
  }

  return <WeightHistoryClient />
}




