import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import TeamPageClient from './TeamPageClient';

export const dynamic = 'force-dynamic';

async function TeamPageServer() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session');
  
  if (!sessionCookie) {
    redirect('/login');
  }

  let sessionData;
  try {
    sessionData = JSON.parse(sessionCookie.value);
  } catch {
    redirect('/login');
  }

  if (!sessionData.userId) {
    redirect('/login');
  }

  // Fetch user from database to check approval status
  const result = await query(
    'SELECT id, email, approval_status FROM users WHERE id = $1',
    [sessionData.userId]
  );

  if (result.rows.length === 0) {
    redirect('/login');
  }

  const user = result.rows[0];

  if (user.approval_status !== 'approved') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Restricted</h1>
          <p className="text-blue-200 mb-6">
            Your account is {user.approval_status}. Please contact admin for approval.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-100 transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  const isAdmin = user.email.toLowerCase() === 'aivideo7775@gmail.com';

  return <TeamPageClient isAdmin={isAdmin} userEmail={user.email} />;
}

export default TeamPageServer;
