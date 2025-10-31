import { Suspense } from "react"
import AmbassadorsContent from "./_components/AmbassadorsContent"
import { metadata as ambassadorsMetadata } from "./_components/metadata"

export const metadata = ambassadorsMetadata

export default function AmbassadorsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AmbassadorsContent />
    </Suspense>
  )
}
