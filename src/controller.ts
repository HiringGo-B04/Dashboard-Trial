'use client'

import { backend_link } from "@/utils";
import Cookies from "js-cookie"


// auth
const logout_route = "/api/auth/user/logout"

async function logout(router: any) {
    const token = Cookies.get("token")

    const response = await fetch(`${backend_link}${logout_route}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token: token })
    }).then(response => response.json());

    if (response.status == "accept") {
        Cookies.remove('token');
        alert("Success to logout")
        router.push("/auth/login")
    }
}

// admin dashboard

async function adminGetAllUsers(token: string) {
    const response = await fetch(`${backend_link}/api/account/admin/user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => response.json());

    return response
}


export {
    logout,
    adminGetAllUsers
}