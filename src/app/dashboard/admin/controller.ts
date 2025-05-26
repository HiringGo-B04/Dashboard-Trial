
'use client'

import { backend_link } from "@/utils";

// admin dashboard
const user_route = "/api/account/admin/user"

async function adminGetAllUsers(token: string) {
    try {
        const response = await fetch(`${backend_link}${user_route}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }).then(response => response.json());

        return response
    } catch (error) {
        return {
            success: false,
            status: 0,
            message: "Problem with server"
        };
    }
}

async function adminDeleteUser(token: string, username: string) {
    try {
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
    catch (error) {
        return {
            success: false,
            status: 0,
            message: "User is important!"
        };
    }
}

async function adminUpdateUser(token: string, requestBody: any) {
    try {
        const response = await fetch(`${backend_link}${user_route}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(requestBody)
        }).then(response => response.json());

        return response
    } catch (error) {
        return {
            success: false,
            status: 0,
            message: "Problem with server"
        };
    }
}


export {
    adminGetAllUsers,
    adminDeleteUser,
    adminUpdateUser
}