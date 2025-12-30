import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { dbConnect } from './mongodb'
import User from '../models/User'
import { sendGreetingsEmail } from './email'

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ] : []),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await dbConnect()
          
          // Check if user exists to determine if we should send greetings email
          const existingUser = await User.findOne({ email: user.email })
          const isNewUser = !existingUser

          // Upsert the user
          const dbUser = await User.findOneAndUpdate(
            { email: user.email },
            {
              name: user.name,
              email: user.email,
              image: user.image,
              provider: 'google',
              isVerified: true, // Google accounts are pre-verified
            },
            { upsert: true, new: true }
          )

          if (dbUser) {
            (user as any).id = dbUser._id.toString()
            (user as any).imagePublicId = dbUser.imagePublicId
            (user as any).role = dbUser.role || 'user'

            // Send greetings email if it's a new user
            if (isNewUser) {
              // Note: We don't await this to avoid blocking the sign-in flow
              sendGreetingsEmail(user.email!, user.name!)
                .catch(err => console.error('Error sending greetings email:', err))
            }
          }
        } catch (error) {
          console.warn('Database unavailable during sign in', error)
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session?.user && token) {
        ;(session.user as any).id = token.id
        ;(session.user as any).image = token.picture
        ;(session.user as any).name = token.name
        ;(session.user as any).imagePublicId = token.imagePublicId
        ;(session.user as any).role = token.role || 'user'
      }
      return session
    },
    async jwt({ token, user, trigger, session: updateSession }) {
      if (user) {
        token.id = (user as any).id
        token.imagePublicId = (user as any).imagePublicId
        token.role = (user as any).role
      }
      if (trigger === "update" && updateSession) {
        if (updateSession.image !== undefined) token.picture = updateSession.image
        if (updateSession.imagePublicId !== undefined) token.imagePublicId = updateSession.imagePublicId
        if (updateSession.name) token.name = updateSession.name
        if (updateSession.role) token.role = updateSession.role
      }
      return token
    },
  },
  pages: {
    signIn: '/account',
  },
  secret: process.env.NEXTAUTH_SECRET || 'demo-secret-key',
}