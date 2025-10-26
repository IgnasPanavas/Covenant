import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { HowItWorks } from '@/components/HowItWorks'
import { CreateCommitment } from '@/components/CreateCommitment'
import { MyCommitments } from '@/components/MyCommitments'
import { CommitmentTester } from '@/components/CommitmentTester'
import { DebugConfig } from '@/components/DebugConfig'


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-earth-green-50 to-earth-brown-50">
      <Header />
      <Hero />
      <HowItWorks />
      <CreateCommitment />
      <CommitmentTester />
      <MyCommitments />
      <DebugConfig />
    </main>
  )
}
