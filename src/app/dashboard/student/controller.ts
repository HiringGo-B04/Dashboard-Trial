'use client'

import { backend_link } from "@/utils";
import Cookies from "js-cookie"

const lamaran_route = "/api/lamaran/user/all"
const lowongan_route = "/api/lowongan/user/lowongan" // FIX: Change from "/api/lowongan/user/get"
const honor_route = "/api/log/student/honor"

export interface LowonganData {
    id: string;
    matkul: string;
    tahun: number;
    term: string;
    totalAsdosNeeded: number;
    totalAsdosRegistered: number;
    totalAsdosAccepted: number;
    idDosen: string; // Add missing field
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

    if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.");
    }

    try {
        const response = await fetch(`${backend_link}${lowongan_route}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
            } else if (response.status === 403) {
                throw new Error('Anda tidak memiliki akses untuk melihat data lowongan.');
            } else if (response.status === 500) {
                throw new Error('Terjadi kesalahan di server. Silakan coba lagi.');
            }
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        // Handle different response formats
        if (Array.isArray(data)) {
            return data;
        } else if (data && Array.isArray(data.data)) {
            return data.data;
        } else {
            throw new Error('Format response tidak sesuai');
        }

    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Gagal menghubungi server');
    }
}

async function getAllLamaran(): Promise<LamaranData[]> {
    const token = Cookies.get("token");

    if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.");
    }

    try {
        const response = await fetch(`${backend_link}${lamaran_route}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
            } else if (response.status === 403) {
                throw new Error('Anda tidak memiliki akses untuk melihat data lamaran.');
            } else if (response.status === 500) {
                throw new Error('Terjadi kesalahan di server. Silakan coba lagi.');
            }
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        // Handle different response formats
        if (Array.isArray(data)) {
            return data;
        } else if (data && Array.isArray(data.data)) {
            return data.data;
        } else {
            throw new Error('Format response tidak sesuai');
        }

    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Gagal menghubungi server');
    }
}

async function getHonorData(lowonganId: string, tahun: number, bulan: number) {
    const token = Cookies.get("token");

    if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.");
    }

    // Validate input parameters
    if (!lowonganId || !tahun || !bulan) {
        throw new Error('Parameter tidak lengkap untuk menghitung honor');
    }

    if (bulan < 1 || bulan > 12) {
        throw new Error('Bulan harus antara 1-12');
    }

    if (tahun < 2020 || tahun > 2030) {
        throw new Error('Tahun tidak valid');
    }

    const params = new URLSearchParams({
        lowonganId: lowonganId,
        tahun: tahun.toString(),
        bulan: bulan.toString()
    });

    try {
        const response = await fetch(`${backend_link}${honor_route}?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            if (response.status === 401) {
                throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
            } else if (response.status === 403) {
                throw new Error('Anda tidak memiliki akses untuk melihat data honor.');
            } else if (response.status === 404) {
                throw new Error('Data honor tidak ditemukan untuk periode ini.');
            } else if (response.status === 500) {
                throw new Error('Terjadi kesalahan di server. Silakan coba lagi.');
            }

            throw new Error(errorData.error || `HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        // Ensure honor is a number
        if (typeof data.honor !== 'number') {
            data.honor = 0;
        }

        return data;

    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Gagal menghitung honor');
    }
}

export {
    getAllLowongan,
    getAllLamaran,
    getHonorData
}