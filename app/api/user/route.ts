import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await prisma.user.create({
            data: {
                email: "demouser2",
                password: "123456",
            },
        });

        return NextResponse.json({
            message: "User created successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to create user", error: error },
            { status: 500 }
        );
    }
};
