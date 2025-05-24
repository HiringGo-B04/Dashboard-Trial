import { NextRequest, NextResponse } from "next/server";

import { checkJWT, decodeJWT } from "./utils";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const url = req.nextUrl;

    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    try {
        if (url.pathname.startsWith("/dashboard/admin")) {
            const decoded = decodeJWT(token);
            const status = checkJWT();

            if (!status) {
                return NextResponse.redirect(new URL('/auth/login', req.url));
            }

            if (url.pathname.startsWith("/dashboard/admin") && decoded.payload.role != "ADMIN") {
                return NextResponse.redirect(new URL('/unauthorized', req.url));
            }
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Faild to do", error);
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }
}

/**
 * Kalau mau tambah route yang mau di protect harus disini juga ya
 * 
 */
export const config = {
    matcher: ["/dashboard/admin/:path*", "/dashboard/admin/"],
};
