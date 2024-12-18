import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET
    const token = await getToken({ req,secret });
    const { pathname } = req.nextUrl;

    if (token && (pathname === "/signin" || pathname === "/signup")) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/signin", "/signup"],
};
