import UniversityPageClient from "@/app/components/Select/Profile/UniversityPageClient"
import { redirect } from "next/navigation"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function UniversityPage({ params }: PageProps) {
  const resolvedParams = await params

  if (!resolvedParams.slug) {
    redirect("/select")
  }

  return <UniversityPageClient slug={resolvedParams.slug} />
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params

  return {
    title: "University Details",
    description: "Detailed information about the university",
  }
}
