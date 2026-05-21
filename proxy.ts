import { withAuth } from 'next-auth/middleware';
import { getAuthSecret } from '@/lib/env';

export default withAuth({
  pages: {
    signIn: '/login'
  },
  secret: getAuthSecret()
});

export const config = {
  matcher: ['/account/:path*', '/admin/:path*', '/review/:path*', '/submit/new']
};
