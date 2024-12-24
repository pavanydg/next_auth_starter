import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { z } from "zod"
import GitHub from "next-auth/providers/github";

export const credentialsSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6,"Password must be atleast 6 characters")
})

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }
                try{
                    
                    const { email, password} = credentialsSchema.parse(credentials);
                    
                    const user = await prisma?.user.findUnique({
                        where: {email},
                    })
                    
                    if(!user){
                        console.log("User not found");
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(
                        password,
                        user.password || ""
                    )

                    if(!isPasswordValid){
                        console.log("Invalid password");
                        return null;
                    }

                    return {
                        id: user.id.toString(),
                        email: user.email
                    }
                } catch(error){
                    console.error("Error in authorization:", error);
                    return null;
                }  
            },
        }),
        GitHub
    ],
    pages: {
        signIn: "/signin"
    },
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "github") {
                const email = profile?.email as string;

                const existingUser = await prisma.user.findUnique({
                    where: { email },
                });

                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            email
                        },
                    });
                }
            }
            return true;
        },
        async session({session, token}){
            if(token.sub){
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({token, user}){
            if(user){
                token.sub = user.id;
            }
            return token;
        },
    },
});
