"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
    getLecturerLogs,
    updateLogStatus,
    formatDate, 
    formatTime, 
    calculateDuration,
    Log
} from "@/app/log/controller"

interface LogWithMahasiswa extends Log {
    namaMahasiswa?: string;
    nimMahasiswa?: string;
    namaMataKuliah?: string;
}

export default function LecturerLogList() {
    const [logs, setLogs] = useState<LogWithMahasiswa[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [processingId, setProcessingId] = useState<string | null>(null)
    const router = useRouter()
    const groupedLogs = logs.reduce((acc, log) => {
        const key = log.idLowongan
        if (!acc[key]) {
            acc[key] = {
                lowonganId: key,
                namaMataKuliah: log.namaMataKuliah || 'Mata Kuliah',
                mataKuliahColor: log.namaMataKuliah ? 'text-blue-600' : 'text-gray-500',
                logs: []
            }
        }
        acc[key].logs.push(log)
        return acc
    }, {} as Record<string, { lowonganId: string; namaMataKuliah: string; mataKuliahColor?: string; logs: LogWithMahasiswa[] }>)

    useEffect(() => {
        fetchLogs()
    }, [])

    const fetchLogs = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getLecturerLogs()
            setLogs(data)
        } catch (err) {
            console.error("Error fetching logs:", err)
            setError(err instanceof Error ? err.message : "Terjadi kesalahan")
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (logId: string, status: 'DITERIMA' | 'DITOLAK') => {
        const confirmMessage = status === 'DITERIMA' 
            ? "Apakah Anda yakin ingin menerima log ini?" 
            : "Apakah Anda yakin ingin menolak log ini?"
        
        if (!confirm(confirmMessage)) {
            return
        }

        try {
            setProcessingId(logId)
            const result = await updateLogStatus(logId, status)
            alert(result.message)
            
            setLogs(prevLogs => 
                prevLogs.map(log => 
                    log.id === logId ? { ...log, status } : log
                )
            )
        } catch (err) {
            alert(err instanceof Error ? err.message : "Gagal mengupdate status")
        } finally {
            setProcessingId(null)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "DITERIMA":
                return <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Diterima</span>
            case "DITOLAK":
                return <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">Ditolak</span>
            case "MENUNGGU":
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">Menunggu</span>
            default:
                return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">{status}</span>
        }
    }

    const getKategoriLabel = (kategori: string) => {
        switch (kategori) {
            case "ASISTENSI": return "Asistensi"
            case "MENGOREKSI": return "Mengoreksi"
            case "MENGAWAS": return "Mengawas"
            case "LAIN_LAIN": return "Lain-lain"
            default: return kategori
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Periksa Log Mahasiswa</h1>
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                    <p className="font-semibold">Error:</p>
                    <p>{error}</p>
                    <button 
                        onClick={() => fetchLogs()} 
                        className="mt-2 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Periksa Log Mahasiswa</h1>
                <p className="text-gray-600 mt-1">
                    Verifikasi log kerja asisten dosen untuk semua mata kuliah yang Anda ampu
                </p>
            </div>

            {logs.length === 0 ? (
                <div className="text-center py-10 bg-white border border-gray-200 rounded-lg">
                    <p className="text-gray-500">Belum ada log yang perlu diperiksa</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.values(groupedLogs).map(group => (
                        <div key={group.lowonganId} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className={`text-lg font-semibold ${group.mataKuliahColor}`}>
                                    {group.namaMataKuliah}
                                </h2>
                                <Link
                                    href={`/dashboard/lecturer/log/${group.lowonganId}`}
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    Lihat Detail →
                                </Link>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mahasiswa</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Deskripsi</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Durasi</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {group.logs.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 text-sm text-gray-500">{formatDate(log.tanggalLog)}</td>
                                                <td className="px-4 py-2 text-sm text-gray-500">
                                                    {log.namaMahasiswa || 'Mahasiswa'}<br/>
                                                    <span className="text-xs text-gray-500">{log.nimMahasiswa || 'NIM'}</span>
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-500">{getKategoriLabel(log.kategori)}</td>
                                                <td className="px-4 py-2 text-sm text-gray-500">
                                                    <div className="max-w-xs truncate text-gray-500" title={log.keterangan}>
                                                        {log.keterangan}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-500">
                                                    {calculateDuration(log.waktuMulai, log.waktuSelesai)}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    {getStatusBadge(log.status)}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    {log.status === "MENUNGGU" && (
                                                        <div className="flex justify-center gap-2">
                                                            <button
                                                                onClick={() => handleStatusUpdate(log.id, 'DITERIMA')}
                                                                disabled={processingId === log.id}
                                                                className="text-green-600 hover:text-green-800 disabled:opacity-50"
                                                                title="Terima"
                                                            >
                                                                ✓
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(log.id, 'DITOLAK')}
                                                                disabled={processingId === log.id}
                                                                className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                                                title="Tolak"
                                                            >
                                                                ✗
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6 text-center">
                <Link href="/dashboard/lecturer" className="text-blue-600 hover:underline">
                    ← Kembali ke Dashboard
                </Link>
            </div>
        </div>
    )
}