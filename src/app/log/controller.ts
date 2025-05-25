"use client"

import { backend_link } from "@/utils";
import Cookies from "js-cookie"

const get_logs_by_lowongan_route = "/api/log/student/lowongan/"
const get_log_by_id_route = "/api/log/student/"
const create_log_route = "/api/log/student"
const update_log_route = "/api/log/student/"
const delete_log_route = "/api/log/student/"
const get_honor_route = "/api/log/student/honor"

export interface LogDTO {
    judul: string;
    keterangan: string;
    kategori: string;
    tanggalLog: string;
    waktuMulai: string;
    waktuSelesai: string;
    pesanUntukDosen?: string;
    idLowongan: string;
}

export interface Log {
    id: string;
    judul: string;
    keterangan: string;
    kategori: string;
    tanggalLog: string;
    waktuMulai: string;
    waktuSelesai: string;
    pesanUntukDosen?: string;
    status: string;
    idLowongan: string;
    idMahasiswa: string;
    idDosen: string;
}

export enum KategoriLog {
    ASISTENSI = "ASISTENSI",
    MENGOREKSI = "MENGOREKSI",
    MENGAWAS = "MENGAWAS",
    LAIN_LAIN = "LAIN_LAIN"
}

export const kategoriOptions = [
    { value: KategoriLog.ASISTENSI, label: "Asistensi" },
    { value: KategoriLog.MENGOREKSI, label: "Mengoreksi" },
    { value: KategoriLog.MENGAWAS, label: "Mengawas" },
    { value: KategoriLog.LAIN_LAIN, label: "Lain-lain" }
];

async function getLogsByLowongan(lowonganId: string): Promise<Log[]> {
    const token = Cookies.get("token")

    if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.")
    }

    try {
        const response = await fetch(`${backend_link}${get_logs_by_lowongan_route}${lowonganId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log("Response status:", response.status)
        console.log("Response data:", data)

        if (!response.ok) {
           
            if (data.error) {
                throw new Error(data.error);
            } else if (response.status === 500) {
                throw new Error('Terjadi kesalahan di server. Silakan coba lagi.');
            } else if (response.status === 401) {
                throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
            } else if (response.status === 403) {
                throw new Error('Anda tidak memiliki akses ke lowongan ini.');
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        }

        return data;
    } catch (error) {
        console.error("Error in getLogsByLowongan:", error)
        
        if (error instanceof Error) {
            throw error;
        }
    
        throw new Error('Gagal menghubungi server');
    }
}

async function getLogById(logId: string): Promise<Log> {
    const token = Cookies.get("token")

    const response = await fetch(`${backend_link}${get_log_by_id_route}${logId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch log');
    }

    return response.json();
}

async function createLog(logData: LogDTO): Promise<Log> {
    const token = Cookies.get("token")

    const response = await fetch(`${backend_link}${create_log_route}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(logData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create log');
    }

    return response.json();
}

async function updateLog(logId: string, logData: LogDTO): Promise<Log> {
    const token = Cookies.get("token")

    const response = await fetch(`${backend_link}${update_log_route}${logId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(logData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update log');
    }

    return response.json();
}

async function deleteLog(logId: string): Promise<void> {
    const token = Cookies.get("token")

    const response = await fetch(`${backend_link}${delete_log_route}${logId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete log');
    }
}

async function getHonor(lowonganId: string, tahun: number, bulan: number) {
    const token = Cookies.get("token")

    const params = new URLSearchParams({
        lowonganId: lowonganId,
        tahun: tahun.toString(),
        bulan: bulan.toString()
    });

    const response = await fetch(`${backend_link}${get_honor_route}?${params}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get honor');
    }

    return response.json();
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
}

function formatTime(timeString: string): string {
    return timeString.substring(0, 5); 
}

function calculateDuration(startTime: string, endTime: string): string {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    
    if (totalMinutes < 0) {
        totalMinutes += 24 * 60; 
    }
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours} jam ${minutes} menit`;
}

const get_lecturer_logs_route = "/api/log/lecturer"
const get_lecturer_logs_by_lowongan_route = "/api/log/lecturer/lowongan/"
const update_log_status_route = "/api/log/lecturer/"


async function getLecturerLogs(): Promise<Log[]> {
    const token = Cookies.get("token")

    if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.")
    }

    try {
        const response = await fetch(`${backend_link}${get_lecturer_logs_route}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.error) {
                throw new Error(data.error);
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Gagal menghubungi server');
    }
}

async function getLecturerLogsByLowongan(lowonganId: string): Promise<Log[]> {
    const token = Cookies.get("token")

    if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.")
    }

    try {
        const response = await fetch(`${backend_link}${get_lecturer_logs_by_lowongan_route}${lowonganId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.error) {
                throw new Error(data.error);
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Gagal menghubungi server');
    }
}

async function updateLogStatus(logId: string, status: 'DITERIMA' | 'DITOLAK'): Promise<{ message: string; log: Log }> {
    const token = Cookies.get("token")

    if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.")
    }

    try {
        const response = await fetch(`${backend_link}${update_log_status_route}${logId}/status?status=${status}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.error) {
                throw new Error(data.error);
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Gagal mengupdate status log');
    }
}

export {
    getLogsByLowongan,
    getLogById,
    createLog,
    updateLog,
    deleteLog,
    getHonor,
    formatDate,
    formatTime,
    calculateDuration,
    getLecturerLogs,
    getLecturerLogsByLowongan,
    updateLogStatus
}
