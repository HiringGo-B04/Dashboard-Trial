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
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-400 border-t-transparent mx-auto"></div>
                        <p className="mt-6 text-lg text-teal-100 font-medium">Loading log data...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-red-900 bg-opacity-80 border-2 border-red-600 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-red-200">Error Loading Data</h3>
                                <p className="text-red-300 mt-1">{error}</p>
                                <button 
                                    onClick={() => fetchLogs()} 
                                    className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                                >
                                    Coba Lagi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-teal-600 rounded-2xl p-8 mb-8 text-white shadow-2xl border border-blue-600 border-opacity-30">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 text-white">Daftar Log Kegiatan</h1>
                            <p className="text-blue-100 text-lg opacity-90">
                                Kelola dan pantau aktivitas asisten dosen Anda
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                                <svg className="h-16 w-16 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Link
                        href={`/dashboard/student`}
                        className="inline-flex items-center px-6 py-3 border-2 border-teal-400 rounded-xl shadow-2xl text-sm font-semibold text-teal-300 bg-slate-800 bg-opacity-80 hover:bg-teal-600 hover:text-white hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 transition-all duration-300 backdrop-blur-sm"
                    >
                        <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali ke Dashboard
                    </Link>
                    <Link
                        href={`/log/${resolvedParams.lowonganId}/create`}
                        className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-600 to-blue-600 text-white border border-teal-500 hover:from-teal-500 hover:to-blue-500 hover:shadow-lg transform hover:scale-105 transition-all duration-200 shadow-2xl"
                    >
                        <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Tambah Log Baru
                    </Link>
                </div>

                {logs.length === 0 ? (
                    <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600 border-opacity-50 p-16 text-center">
                        <div className="bg-slate-700 bg-opacity-60 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                            <svg className="h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Belum Ada Log Kegiatan</h3>
                        <p className="text-slate-300 text-lg mb-6">
                            Mulai dengan membuat log kegiatan baru untuk mencatat aktivitas Anda
                        </p>
                        <Link
                            href={`/log/${resolvedParams.lowonganId}/create`}
                            className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-600 to-blue-600 text-white border border-teal-500 hover:from-teal-500 hover:to-blue-500 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Buat Log Pertama
                        </Link>
                    </div>
                ) : (
                    <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-600 border-opacity-50 shadow-2xl">
                        <div className="bg-gradient-to-r from-blue-800 to-teal-700 p-4 border-b border-slate-600">
                            <h2 className="text-xl font-bold text-white flex items-center">
                                <svg className="w-6 h-6 mr-2 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Log Kegiatan ({logs.length})
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-600">
                                <thead className="bg-slate-700 bg-opacity-60">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-teal-200 uppercase tracking-wider">No</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-teal-200 uppercase tracking-wider">Judul Kegiatan</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-teal-200 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-teal-200 uppercase tracking-wider">Waktu</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-teal-200 uppercase tracking-wider">Kategori</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-teal-200 uppercase tracking-wider">Deskripsi</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-teal-200 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-teal-200 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-slate-800 bg-opacity-40 divide-y divide-slate-600">
                                    {logs.map((log, index) => (
                                        <tr key={log.id} className="hover:bg-teal-800 hover:bg-opacity-20 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                                {log.judul}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                                {formatDate(log.tanggalLog)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                                <div className="flex flex-col">
                                                    <span>{formatTime(log.waktuMulai)} - {formatTime(log.waktuSelesai)}</span>
                                                    <span className="text-xs text-teal-300 mt-1">
                                                        ({calculateDuration(log.waktuMulai, log.waktuSelesai)})
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-800 bg-opacity-80 text-blue-200 border border-blue-600">
                                                    {getKategoriLabel(log.kategori)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-200 max-w-xs">
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
                                                            className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-700 bg-opacity-80 text-blue-200 border border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                                                            title="Edit Log"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                            </svg>
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(log.id)}
                                                            className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-red-700 bg-opacity-80 text-red-200 border border-red-600 hover:bg-red-600 hover:text-white transition-all duration-200"
                                                            title="Hapus Log"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Hapus
                                                        </button>
                                                    </div>
                                                )}
                                                {log.status !== "MENUNGGU" && (
                                                    <span className="text-slate-400 text-xs">Tidak dapat diubah</span>
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
        </div>
    )
}