import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import HomePageClient from './home-client'

export default async function HomePage() {
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect('/login')
  }

  return <HomePageClient />
}






