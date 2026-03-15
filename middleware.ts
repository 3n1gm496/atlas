import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET ?? 'atlas-dev-secret-please-change-2026'
});

export const config = {
  matcher: ['/account/:path*', '/admin/:path*', '/review/:path*', '/submit/new']
};
