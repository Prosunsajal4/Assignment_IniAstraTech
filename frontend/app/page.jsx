'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Class Scheduling System</h1>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Choose Your Role</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link href="/teacher">
                <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg p-8 text-white cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <h3 className="text-2xl font-bold mb-2">Teacher</h3>
                </div>
              </Link>

              <Link href="/student">
                <div className="bg-linear-to-br from-green-500 to-green-600 rounded-lg p-8 text-white cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <h3 className="text-2xl font-bold mb-2">Student</h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
