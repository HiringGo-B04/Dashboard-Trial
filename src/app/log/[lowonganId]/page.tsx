"use client"

import { useEffect, useState } from "react"
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

export default function LogList({ params }: { params: { lowonganId: string } }) {
    const [logs, setLogs] = useState<Log[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        fetchLogs()
    }, [params.lowonganId])

    const fetchLogs = async () => {
        try {
            setLoading(true)
            const data = await getLogsByLowongan(params.lowonganId)
            setLogs(data)
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Terjadi kesalahan")
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
            fetchLogs() // Refresh the list
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
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-600">Error: {error}</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Daftar Log</h1>
            
            <div className="mb-4">
                <Link
                    href={`/log/${params.lowonganId}/create`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Tambah Log
                </Link>
            </div>

            {logs.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">Belum ada log yang dibuat</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-blue-900 text-white">
                            <tr>
                                <th className="px-4 py-2 border text-left">No</th>
                                <th className="px-4 py-2 border text-left">Tanggal</th>
                                <th className="px-4 py-2 border text-left">Jam</th>
                                <th className="px-4 py-2 border text-left">Kategori</th>
                                <th className="px-4 py-2 border text-left">Deskripsi Tugas</th>
                                <th className="px-4 py-2 border text-center">Status</th>
                                <th className="px-4 py-2 border text-center">Operation</th>
                                <th className="px-4 py-2 border text-left">Pesan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log, index) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border">{index + 1}</td>
                                    <td className="px-4 py-2 border">{formatDate(log.tanggalLog)}</td>
                                    <td className="px-4 py-2 border">
                                        {formatTime(log.waktuMulai)} - {formatTime(log.waktuSelesai)}
                                        <br />
                                        <span className="text-sm text-gray-600">
                                            {calculateDuration(log.waktuMulai, log.waktuSelesai)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 border">{getKategoriLabel(log.kategori)}</td>
                                    <td className="px-4 py-2 border">{log.keterangan}</td>
                                    <td className="px-4 py-2 border text-center">
                                        {getStatusBadge(log.status)}
                                    </td>
                                    <td className="px-4 py-2 border text-center">
                                        {log.status === "MENUNGGU" && (
                                            <>
                                                <Link
                                                    href={`/log/${params.lowonganId}/${log.id}`}
                                                    className="text-blue-600 hover:underline mr-2"
                                                >
                                                    ✏️ Ubah
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(log.id)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    🗑️ Hapus
                                                </button>
                                            </>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {log.pesanUntukDosen || "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}