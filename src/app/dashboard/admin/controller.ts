
'use client'

import { backend_link } from "@/utils";
import Cookies from "js-cookie"


// admin dashboard
const user_route = "/api/account/admin/user"

async function adminGetAllUsers(token: string) {
    const response = await fetch(`${backend_link}${user_route}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => response.json());

    return response
}

async function adminDeleteUser(token: string, username: string) {
    const response = await fetch(`${backend_link}${user_route}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            email: username,
        })
    }).then(response => response.json());

    return response;
}

async function adminUpdateUser(token: string, requestBody: any) {
    const response = await fetch(`${backend_link}${user_route}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
    }).then(response => response.json());

    return response;
}


export {
    adminGetAllUsers,
    adminDeleteUser,
    adminUpdateUser
}