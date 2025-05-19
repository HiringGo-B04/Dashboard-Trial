import { NextRequest, NextResponse } from "next/server";

import { decodeJWT } from "./utils";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value; // Get token from cookies
    const url = req.nextUrl;

    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url)); // Redirect to login if no token
    }

    try {
        if (url.pathname.startsWith("/dashboard/admin")) {
            const decoded = decodeJWT(token);
            if (url.pathname.startsWith("/dashboard/admin") && decoded.payload.role != "ADMIN")
                return NextResponse.redirect(new URL('/unauthorized', req.url));
        }

        return NextResponse.next(); // Continue to the requested page
    } catch (error) {
        console.error("Faild to do", error);
        return NextResponse.redirect(new URL("/auth/login", req.url)); // Redirect if token is invalid
    }
}

// Apply middleware to specific routes
export const config = {
    matcher: ["/dashboard/admin/:path*", "/dashboard/admin/"], // Protect these routes
};
