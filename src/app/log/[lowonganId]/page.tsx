"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
    getLogsByLowongan, 
    deleteLog, 
    formatDate, 
    formatTime, 
    calculateDuration,
    Log
} from "../controller"

export default function LogList({ 
    params 
}: { 
    params: Promise<{ lowonganId: string }> 
}) {
    const resolvedParams = use(params)
    const [logs, setLogs] = useState<Log[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        fetchLogs()
    }, [resolvedParams.lowonganId])

    const fetchLogs = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getLogsByLowongan(resolvedParams.lowonganId)
            setLogs(data)
        } catch (err) {
            console.error("Error fetching logs:", err)
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Terjadi kesalahan saat mengambil data log")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (logId: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus log ini?")) {
            return
        }

        try {
            await deleteLog(logId)
            alert("Log berhasil dihapus")
            fetchLogs() 
        } catch (err) {
            alert(err instanceof Error ? err.message : "Gagal menghapus log")
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "DITERIMA":
                return <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">diterima</span>
            case "DITOLAK":
                return <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">ditolak</span>
            case "MENUNGGU":
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">diproses</span>
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
                <h1 className="text-2xl font-bold mb-6">Daftar Log</h1>
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
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Daftar Log</h1>
            <Link
                href={`/dashboard/student`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
                Kembali ke Dashboard Student
            </Link>
            <Link
                href={`/log/${resolvedParams.lowonganId}/create`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Tambah Log
            </Link>
        </div>

        {logs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <div className="mb-4 text-gray-400">
                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <p className="text-gray-500 mb-2">Belum ada log kegiatan yang tercatat</p>
                <p className="text-sm text-gray-400">Mulai dengan membuat log kegiatan baru</p>
            </div>
        ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-blue-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Judul Kegiatan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Waktu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Kategori</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Deskripsi</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-blue-800 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-blue-800 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {logs.map((log, index) => (
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {log.judul}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(log.tanggalLog)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex flex-col">
                                            <span>{formatTime(log.waktuMulai)} - {formatTime(log.waktuSelesai)}</span>
                                            <span className="text-xs text-gray-400 mt-1">
                                                ({calculateDuration(log.waktuMulai, log.waktuSelesai)})
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {getKategoriLabel(log.kategori)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                                        <div className="line-clamp-2">{log.keterangan}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {getStatusBadge(log.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        {log.status === "MENUNGGU" && (
                                            <div className="flex items-center justify-center space-x-3">
                                                <Link
                                                    href={`/log/${resolvedParams.lowonganId}/${log.id}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(log.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
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
        )}
    </div>
    )
}