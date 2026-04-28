 'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const [loggedInRole, setLoggedInRole] = useState(null);

  useEffect(() => {
    const syncAuthState = () => {
      const teacher = localStorage.getItem('teacher');
      const student = localStorage.getItem('student');

      if (teacher) {
        setLoggedInRole('teacher');
        return; 
      }

      if (student) {
        setLoggedInRole('student');
        return;
      }

      setLoggedInRole(null);
    };

    syncAuthState();
    window.addEventListener('storage', syncAuthState);
    window.addEventListener('auth-change', syncAuthState);

    return () => {
      window.removeEventListener('storage', syncAuthState);
      window.removeEventListener('auth-change', syncAuthState);
    };
  }, []);

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">
            <Link href="/">Class Scheduler</Link>
          </div>
          <ul className="flex gap-6">
            <li>
              <Link href="/" className="hover:text-gray-300 transition-colors">
                Home
              </Link>
            </li>
            {loggedInRole !== 'student' && (
              <li>
                <Link href="/teacher" className="hover:text-gray-300 transition-colors">
                  Teacher
                </Link>
              </li>
            )}
            {loggedInRole !== 'teacher' && (
              <li>
                <Link href="/student" className="hover:text-gray-300 transition-colors">
                  Student
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
