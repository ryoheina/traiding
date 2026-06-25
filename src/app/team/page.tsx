import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import TeamPageClient from './TeamPageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function TeamPageServer() {
  console.log('[TEAM-SERVER] Team page accessed');
  
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session');
  
  console.log('[TEAM-SERVER] Session cookie:', sessionCookie ? 'exists' : 'not found');
  
  if (!sessionCookie) {
    console.log('[TEAM-SERVER] No session cookie, redirecting to login');
    redirect('/login');
  }

  let sessionData;
  try {
    sessionData = JSON.parse(sessionCookie.value);
    console.log('[TEAM-SERVER] Session data parsed:', { userId: sessionData.userId });
  } catch (error) {
    console.log('[TEAM-SERVER] Failed to parse session cookie, redirecting to login');
    redirect('/login');
  }

  if (!sessionData.userId) {
    console.log('[TEAM-SERVER] No userId in session, redirecting to login');
    redirect('/login');
  }

  // Fetch user from database to check approval status
  console.log('[TEAM-SERVER] Fetching user from database');
  const result = await query(
    'SELECT id, email, approval_status FROM users WHERE id = $1',
    [sessionData.userId]
  );

  if (result.rows.length === 0) {
    console.log('[TEAM-SERVER] User not found in database, redirecting to login');
    redirect('/login');
  }

  const user = result.rows[0];
  console.log('[TEAM-SERVER] User found:', { id: user.id, email: user.email, approval_status: user.approval_status });

  if (user.approval_status !== 'approved') {
    console.log('[TEAM-SERVER] User not approved, showing access restricted');
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
  console.log('[TEAM-SERVER] User approved, isAdmin:', isAdmin);

  return <TeamPageClient isAdmin={isAdmin} userEmail={user.email} />;
}

export default TeamPageServer;
