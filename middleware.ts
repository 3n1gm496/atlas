import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login'
  }
});

export const config = {
  matcher: ['/account/:path*', '/admin/:path*', '/review/:path*', '/submit/new']
};
