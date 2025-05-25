'use client'

import { backend_link } from "@/utils";
import Cookies from "js-cookie"

// Menggunakan endpoint yang sudah ada
const lamaran_route = "/api/lamaran/user/all"
const lowongan_route = "/api/lowongan/user/get"
const honor_route = "/api/log/student/honor"

export interface LowonganData {
    id: string;
    matkul: string;
    tahun: number;
    term: string;
    totalAsdosNeeded: number;
    totalAsdosRegistered: number;
    totalAsdosAccepted: number;
}

export interface LamaranData {
    id: string;
    sks: number;
    ipk: number;
    status: string; // MENUNGGU, DITERIMA, DITOLAK
    idMahasiswa: string;
    idLowongan: string;
}

async function getAllLowongan(): Promise<LowonganData[]> {
    const token = Cookies.get("token");
    const response = await fetch(`${backend_link}${lowongan_route}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch lowongan data');
    }

    return response.json();
}

async function getAllLamaran(): Promise<LamaranData[]> {
    const token = Cookies.get("token");
    const response = await fetch(`${backend_link}${lamaran_route}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch lamaran data');
    }

    return response.json();
}

async function getHonorData(lowonganId: string, tahun: number, bulan: number) {
    const token = Cookies.get("token");
    const params = new URLSearchParams({
        lowonganId: lowonganId,
        tahun: tahun.toString(),
        bulan: bulan.toString()
    });

    const response = await fetch(`${backend_link}${honor_route}?${params}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to get honor data');
    }

    return response.json();
}

export {
    getAllLowongan,
    getAllLamaran,
    getHonorData
}