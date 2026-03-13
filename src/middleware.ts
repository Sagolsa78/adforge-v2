import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/", // Redirect to home instead of /login
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
