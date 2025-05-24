"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { getLecturerLogs } from "@/app/log/controller"

export default function LogNavigation() {
    const [pendingCount, setPendingCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPendingCount()
    }, [])

    const fetchPendingCount = async () => {
        try {
            const logs = await getLecturerLogs()
            const count = logs.filter(log => log.status === "MENUNGGU").length
            setPendingCount(count)
        } catch (error) {
            console.error("Error fetching pending logs:", error)
            // Fail silently
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 ">Manajemen Log Asisten</h2>
            
            <div className="space-y-3">
                <Link 
                    href="/dashboard/lecturer/log"
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-gray-900">Periksa Log</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Verifikasi log kerja asisten dosen
                            </p>
                        </div>
                        {loading ? (
                            <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                                ...
                            </div>
                        ) : pendingCount > 0 ? (
                            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                {pendingCount} Menunggu
                            </div>
                        ) : null}
                    </div>
                </Link>

                <div className="text-sm text-gray-500 mt-2">
                    <p>Tips verifikasi log:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Periksa kesesuaian deskripsi dengan kategori</li>
                        <li>Pastikan durasi waktu masuk akal</li>
                        <li>Perhatikan tanggal log tidak di masa depan</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}