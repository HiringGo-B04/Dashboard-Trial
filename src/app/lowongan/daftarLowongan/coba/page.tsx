"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { backend_link } from "@/utils"

interface Lowongan {
    id: string
    matkul: string
    tahun: number
    term: string
    totalAsdosNeeded: number
    totalAsdosRegistered: number
    totalAsdosAccepted: number
}

export default function ListLowonganPage() {
    const [lowongans, setLowongans] = useState<Lowongan[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const token = Cookies.get("token")

        if (!token) {
            setError("Kamu belum login")
            setLoading(false)
            return
        }

        const fetchLowongan = async () => {
            try {
                const res = await fetch(`${backend_link}/api/lowongan/user`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!res.ok) {
                    const errorText = await res.text()
                    console.error("Status:", res.status)
                    console.error("Response Body:", errorText)

                    throw new Error(`Gagal fetch lowongan (${res.status}): ${errorText}`)
                }

                const data = await res.json()
                setLowongans(data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchLowongan()
    }, [])

    if (loading) return <p>Loading...</p>
    if (error) return <p className="text-red-500">Error: {error}</p>

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Daftar Lowongan</h1>
            <div className="space-y-4">
                {lowongans.map((lowongan) => (
                    <div key={lowongan.id} className="border p-4 rounded shadow">
                        <h2 className="text-lg font-semibold">{lowongan.matkul}</h2>
                        <p>Semester: {lowongan.term} {lowongan.tahun}</p>
                        <p>Jumlah Dibutuhkan: {lowongan.totalAsdosNeeded}</p>
                        <p>Sudah Mendaftar: {lowongan.totalAsdosRegistered}</p>
                        <p>Diterima: {lowongan.totalAsdosAccepted}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
