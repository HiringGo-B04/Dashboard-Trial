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

async function userLogin(username: string, password: string) {
    const response = await fetch(`${backend_link}/api/auth/public/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    }).then(response => response.json());

    return response;
}

async function studentRegis(username: string, password: string, nim: string, name: string) {
    const response = await fetch(`${backend_link}/api/auth/public/signup/student`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
            nim: nim,
            fullName: name
        })
    }).then(response => response.json());

    return response
}



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
    logout,
    userLogin,
    studentRegis,
    adminGetAllUsers,
    adminDeleteUser,
    adminUpdateUser
}