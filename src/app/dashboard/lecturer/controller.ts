
'use client'

import { backend_link } from "@/utils";

// admin dashboard
const dosen_get_data = "/api/lowongan/lecturer/dashboard"
const lowongan = "/api/lowongan/user/lowongan"

async function dosenGetAllData(token: string) {
    const response = await fetch(`${backend_link}${dosen_get_data}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => response.json());

    return response
}

async function lowonganGetAll(token: string) {
    const response = await fetch(`${backend_link}${lowongan}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => response.json());

    return response
}

export {
    dosenGetAllData,
    lowonganGetAll
}