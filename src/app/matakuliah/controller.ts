'use client'

import { backend_link } from "@/utils";

const course_route = "/api/course/admin/matakuliah";

export async function getAllMataKuliah(token: string) {
    const response = await fetch(`${backend_link}${course_route}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    return response.json();
}

export async function getMataKuliahByKode(token: string, kode: string) {
    const response = await fetch(`${backend_link}${course_route}/${kode}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    return response.json();
}

export async function createMataKuliah(token: string, data: any) {
    try {
        const response = await fetch(`${backend_link}${course_route}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { status: "error", message: errorText };
        }

        const result = await response.json();
        return result;
    } catch (error) {
        return { status: "error", message: "Network error" };
    }
}

export async function updateMataKuliah(token: string, kode: string, data: any) {
    const response = await fetch(`${backend_link}${course_route}/${kode}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

export async function partialUpdateMataKuliah(token: string, kode: string, data: any) {
    const response = await fetch(`${backend_link}${course_route}/${kode}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

export async function deleteMataKuliah(token: string, kode: string) {
    try {
        const response = await fetch(`${backend_link}${course_route}/${kode}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            // Try to get error message from response
            let errorMessage = `HTTP Error: ${response.status}`;

            try {
                const errorText = await response.text();
                if (errorText) {
                    errorMessage = errorText;
                }
            } catch {
            }

            return {
                status: "error",
                message: errorMessage
            };
        }
        if (response.status === 204) {
            return {
                status: "success",
                message: "Mata kuliah berhasil dihapus"
            };
        }

        // Try to parse JSON response
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return {
                status: "success",
                message: "Mata kuliah berhasil dihapus"
            };
        }

    } catch (error) {
        console.error("Delete error:", error);
        return {
            status: "error",
            message: `Network error: ${error}`
        };
    }
}

export async function addLecturer(token: string, kode: string, userId: string) {
    const response = await fetch(`${backend_link}${course_route}/${kode}/dosen/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    return response.json();
}

export async function removeLecturer(token: string, kode: string, userId: string) {
    const response = await fetch(`${backend_link}${course_route}/${kode}/dosen/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    return response.json();
}