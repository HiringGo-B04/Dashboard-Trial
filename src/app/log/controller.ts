"use client"

import { backend_link } from "@/utils";
import Cookies from "js-cookie"

// Log routes
const get_logs_by_lowongan_route = "api/log/student/lowongan/"
const get_log_by_id_route = "api/log/student/"
const create_log_route = "api/log/student"
const update_log_route = "api/log/student/"
const delete_log_route = "api/log/student/"
const get_honor_route = "api/log/student/honor"

// Types
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

// Get all logs for a specific lowongan
async function getLogsByLowongan(lowonganId: string): Promise<Log[]> {
    const token = Cookies.get("token")

    const response = await fetch(`${backend_link}${get_logs_by_lowongan_route}${lowonganId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch logs');
    }

    return response.json();
}

// Get specific log by ID
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

// Create new log
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

// Update existing log
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

// Delete log
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

// Get honor calculation
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

// Helper functions
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
    // timeString format: "HH:mm:ss"
    return timeString.substring(0, 5); // Return "HH:mm"
}

function calculateDuration(startTime: string, endTime: string): string {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    
    if (totalMinutes < 0) {
        totalMinutes += 24 * 60; // Handle day crossing
    }
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours} jam ${minutes} menit`;
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
    calculateDuration
}