import React from 'react'
import Header from '@/app/ui/header'
import { InboxStackIcon } from '@heroicons/react/24/outline'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "gestion du stock"
}

export default function Page() {
  return (
    <main>
      <Header titleSection="gestion de stock" />
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="flex-1">
            <main className="p-6">
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <InboxStackIcon className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">gestion de stock</h2>
                    </div>
                  </div>
                  {/* <div className="relative">
                    <MagnifyingGlassCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by patient name or test type..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div> */}
                </div>
                <h2 className='text-center p-3'>comming soon...</h2>
              </div>
            </main>
          </div>
        </div>
      </div>
    </main>
  )
}
