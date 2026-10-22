import { notFound } from 'next/navigation'
import giftData from '@/lib/giftData'
import GiftClient from '@/components/GiftClient'

export function generateMetadata({ params }: { params: { id: string } }) {
  const data = giftData[params.id.toLowerCase()]
  if (!data) return { title: 'Gift Not Found' }
  
  return {
    title: `Happy Birthday ${data.receiverName}! 🎂`,
    description: `A special birthday message for ${data.receiverName}`,
  }
}

export default function GiftPage({ params }: { params: { id: string } }) {
  const data = giftData[params.id.toLowerCase()]
  if (!data) return notFound()
  
  return <GiftClient data={data} />
}
