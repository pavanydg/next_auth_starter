import { credentialsSchema } from "@/auth";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const { email, password} = await req.json();

    if(!email || !password){
        return NextResponse.json({
            error: "Email and password are required"
        })
    }

    const existingUser = await prisma?.user.findUnique({
        where: {email}
    })

    if(existingUser){
        return NextResponse.json({error: "User already exists"})
    }

    const hashedPassword = await hash(password,12);

    const user = await prisma?.user.create({
        data: {
            email,
            password: hashedPassword
        }
    });

    return NextResponse.json(user)
}