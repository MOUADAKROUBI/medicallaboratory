'use client' // Error boundaries must be Client Components
 
import { Button } from '@/app/ui/button'
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className='text-center'>
      <h2>Something went wrong!</h2>
      <Button
        variant="link"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  )
}