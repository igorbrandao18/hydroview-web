import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Autenticação MVP — Credentials provider.
 * Usuários/senhas definidos via variáveis de ambiente:
 *   AUTH_USERS = "admin:senha123,sindico:condo456"
 * Formato: "usuario:senha,usuario2:senha2"
 */
function getUsers(): Map<string, string> {
  const raw = process.env.AUTH_USERS ?? "admin:admin";
  const map = new Map<string, string>();
  for (const pair of raw.split(",")) {
    const [user, pass] = pair.trim().split(":");
    if (user && pass) map.set(user.toLowerCase(), pass);
  }
  return map;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const username = (credentials?.username as string)?.toLowerCase().trim();
        const password = credentials?.password as string;
        if (!username || !password) return null;

        const users = getUsers();
        const storedPass = users.get(username);
        if (!storedPass || storedPass !== password) return null;

        return { id: username, name: username };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth: session, request }) {
      const isLoggedIn = !!session?.user;
      const isProtected =
        request.nextUrl.pathname.startsWith("/dashboard") ||
        request.nextUrl.pathname.startsWith("/devices") ||
        request.nextUrl.pathname.startsWith("/reservoirs") ||
        request.nextUrl.pathname.startsWith("/alerts") ||
        request.nextUrl.pathname.startsWith("/assets") ||
        request.nextUrl.pathname.startsWith("/condominiums") ||
        request.nextUrl.pathname.startsWith("/partners") ||
        request.nextUrl.pathname.startsWith("/team") ||
        request.nextUrl.pathname.startsWith("/settings") ||
        request.nextUrl.pathname.startsWith("/audit") ||
        request.nextUrl.pathname.startsWith("/billing") ||
        request.nextUrl.pathname.startsWith("/reports") ||
        request.nextUrl.pathname.startsWith("/integrations");

      if (isProtected && !isLoggedIn) return false;
      return true;
    },
  },
});
