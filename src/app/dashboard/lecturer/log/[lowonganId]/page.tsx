"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
    getLecturerLogsByLowongan,
    updateLogStatus,
    formatDate, 
    formatTime, 
    calculateDuration,
    Log
} from "@/app/log/controller"

interface LogDetail extends Log {
    namaMahasiswa?: string;
    nimMahasiswa?: string;
}

export default function LecturerLogsByLowongan({ 
    params 
}: { 
    params: Promise<{ lowonganId: string }> 
}) {
    const resolvedParams = use(params)
    const [logs, setLogs] = useState<LogDetail[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [filterStatus, setFilterStatus] = useState<string>("ALL")
    const router = useRouter()

    useEffect(() => {
        fetchLogs()
    }, [resolvedParams.lowonganId])

    const fetchLogs = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getLecturerLogsByLowongan(resolvedParams.lowonganId)
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

    const filteredLogs = filterStatus === "ALL" 
        ? logs 
        : logs.filter(log => log.status === filterStatus)

    const stats = {
        total: logs.length,
        menunggu: logs.filter(l => l.status === "MENUNGGU").length,
        diterima: logs.filter(l => l.status === "DITERIMA").length,
        ditolak: logs.filter(l => l.status === "DITOLAK").length,
        totalJam: logs
            .filter(l => l.status === "DITERIMA")
            .reduce((total, log) => {
                const duration = calculateDuration(log.waktuMulai, log.waktuSelesai)
                const match = duration.match(/(\d+) jam (\d+) menit/)
                if (match) {
                    return total + parseInt(match[1]) + parseInt(match[2]) / 60
                }
                return total
            }, 0)
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
                <h1 className="text-2xl font-bold mb-6">Detail Log Lowongan</h1>
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
                <div className="mt-4">
                    <Link href="/dashboard/lecturer/log" className="text-blue-600 hover:underline">
                        ← Kembali
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Detail Log Lowongan</h1>
                <p className="text-gray-600 mt-1">
                    Verifikasi log kerja asisten dosen
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Total Log</p>
                    <p className="text-2xl font-bold text-gray-500">{stats.total}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-700">Menunggu</p>
                    <p className="text-2xl font-bold text-yellow-700">{stats.menunggu}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700">Diterima</p>
                    <p className="text-2xl font-bold text-green-700">{stats.diterima}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-sm text-red-700">Ditolak</p>
                    <p className="text-2xl font-bold text-red-700">{stats.ditolak}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">Total Jam</p>
                    <p className="text-2xl font-bold text-blue-700">{stats.totalJam.toFixed(1)}</p>
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="mb-4 flex gap-2">
                <button
                    onClick={() => setFilterStatus("ALL")}
                    className={`px-4 py-2 rounded ${
                        filterStatus === "ALL" 
                            ? "bg-blue-600 text-white" 
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    Semua ({stats.total})
                </button>
                <button
                    onClick={() => setFilterStatus("MENUNGGU")}
                    className={`px-4 py-2 rounded ${
                        filterStatus === "MENUNGGU" 
                            ? "bg-yellow-600 text-white" 
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    Menunggu ({stats.menunggu})
                </button>
                <button
                    onClick={() => setFilterStatus("DITERIMA")}
                    className={`px-4 py-2 rounded ${
                        filterStatus === "DITERIMA" 
                            ? "bg-green-600 text-white" 
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    Diterima ({stats.diterima})
                </button>
                <button
                    onClick={() => setFilterStatus("DITOLAK")}
                    className={`px-4 py-2 rounded ${
                        filterStatus === "DITOLAK" 
                            ? "bg-red-600 text-white" 
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    Ditolak ({stats.ditolak})
                </button>
            </div>

            {filteredLogs.length === 0 ? (
                <div className="text-center py-10 bg-white border border-gray-200 rounded-lg">
                    <p className="text-gray-500">
                        {filterStatus === "ALL" 
                            ? "Belum ada log yang perlu diperiksa" 
                            : `Tidak ada log dengan status ${filterStatus.toLowerCase()}`}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mahasiswa</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deskripsi</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pesan</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredLogs.map((log, index) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(log.tanggalLog)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        <div>
                                            <p className="font-medium">{log.namaMahasiswa || 'Mahasiswa'}</p>
                                            <p className="text-xs text-gray-500">{log.nimMahasiswa || 'NIM'}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{getKategoriLabel(log.kategori)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        <div className="max-w-xs truncate text-gray-500" title={log.judul}>
                                            {log.judul}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        <div className="max-w-xs truncate text-gray-500" title={log.keterangan}>
                                            {log.keterangan}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        <div>
                                            <p>{formatTime(log.waktuMulai)} - {formatTime(log.waktuSelesai)}</p>
                                            <p className="text-xs text-gray-500">
                                                {calculateDuration(log.waktuMulai, log.waktuSelesai)}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        <div className="max-w-xs truncate text-gray-500" title={log.pesanUntukDosen || '-'}>
                                            {log.pesanUntukDosen || '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {getStatusBadge(log.status)}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {log.status === "MENUNGGU" && (
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(log.id, 'DITERIMA')}
                                                    disabled={processingId === log.id}
                                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
                                                    title="Terima Log"
                                                >
                                                    Terima
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(log.id, 'DITOLAK')}
                                                    disabled={processingId === log.id}
                                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm"
                                                    title="Tolak Log"
                                                >
                                                    Tolak
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mt-6 flex justify-between">
                <Link href="/dashboard/lecturer/log" className="text-blue-600 hover:underline">
                    ← Kembali ke Semua Log
                </Link>
                <Link href="/dashboard/lecturer" className="text-blue-600 hover:underline">
                    Dashboard
                </Link>
            </div>
        </div>
    )
}