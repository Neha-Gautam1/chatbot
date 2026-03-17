import { connectDB } from "@/lib/db"
import User from "@/models/User"
import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { AuthOptions } from "next-auth"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials: any) {
        const { email, password } = credentials
        try {
          await connectDB()
          const user = await User.findOne({ email })
          if (!user) {
            return null
          }
          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
          )
          if (!isPasswordCorrect) {
            return null
          }
          return user
        } catch (error: any) {
          throw new Error(error)
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
