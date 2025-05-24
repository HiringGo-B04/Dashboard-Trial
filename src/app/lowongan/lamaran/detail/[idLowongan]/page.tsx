"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { fetchLamaranUser } from "@/app/lowongan/controller"

export default function LamaranDetailPage() {
  const { idLowongan } = useParams()
  const [lamaran, setLamaran] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getDetail = async () => {
      try {
        const data = await fetchLamaranUser()
        const found = data.find((l: any) => l.idLowongan === idLowongan)
        setLamaran(found || null)
      } catch (err) {
        console.error("Gagal fetch lamaran")
      } finally {
        setLoading(false)
      }
    }
    getDetail()
  }, [idLowongan])

  if (loading) return <p>Loading...</p>
  if (!lamaran) return <p>Lamaran tidak ditemukan untuk lowongan ini.</p>

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Detail Lamaran</h1>
      <p><strong>SKS:</strong> {lamaran.sks}</p>
      <p><strong>IPK:</strong> {lamaran.ipk}</p>
      <p><strong>Status:</strong> {lamaran.status}</p>
    </div>
  )
}