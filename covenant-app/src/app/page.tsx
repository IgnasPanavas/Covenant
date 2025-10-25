import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { HowItWorks } from '@/components/HowItWorks'
import { CreateCommitment } from '@/components/CreateCommitment'
import { MyCommitments } from '@/components/MyCommitments'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <Hero />
      <HowItWorks />
      <CreateCommitment />
      <MyCommitments />
    </main>
  )
}
