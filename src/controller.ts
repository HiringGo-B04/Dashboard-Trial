'use client'

import { backend_link } from "@/utils";
import Cookies from "js-cookie"

// auth
const logout_route = "/api/auth/user/logout"
const login_route = "/api/auth/public/signin"
const student_regis_route = "/api/auth/public/signup/student"
const admin_regis_route = "/api/auth/admin/signup"
const lecturer_regis_route = "/api/auth/admin/signup/lecturer"

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
    const response = await fetch(`${backend_link}${login_route}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    }).then(response => response.json());

    return response;
}

async function studentRegis(username: string, password: string, nim: string, name: string) {
    const response = await fetch(`${backend_link}${student_regis_route}`, {
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

async function adminRegisAdmin(token: string, username: string, password: string) {
    const response = await fetch(`${backend_link}${admin_regis_route}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            username: username,
            password: password,
        })
    }).then(response => response.json());

    return response;
}

async function adminRegisLecturer(token: string, username: string, password: string, nip: string, name: string) {
    const response = await fetch(`${backend_link}${lecturer_regis_route}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            username: username,
            password: password,
            nip: nip,
            fullName: name
        })
    }).then(response => response.json());

    return response;
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
    adminRegisAdmin,
    adminRegisLecturer,
    adminDeleteUser,
    adminUpdateUser
}