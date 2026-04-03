import { redirect } from 'next/navigation'

export default function QuestionnairePage() {
  redirect('/checkout?niche=web-design&tier=professional&hosting=professional')
}
