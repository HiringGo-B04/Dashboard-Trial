"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchLowongan, fetchLamaranUser } from "../controller"

interface Lowongan {
  id: string
  matkul: string
  tahun: number
  term: string
  totalAsdosNeeded: number
  totalAsdosRegistered: number
  totalAsdosAccepted: number
}

interface Lamaran {
  id: string
  idLowongan: string
  idMahasiswa: string
  sks: number
  ipk: number
  status: string
}

export default function ListLowonganPage() {
  const [lowongans, setLowongans] = useState<Lowongan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()


  const [lamarans, setLamarans] = useState<Lamaran[]>([])
  const [userLowonganIds, setUserLowonganIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLowongan()
        setLowongans(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchLamarans = async () => {
      try {
        const data = await fetchLamaranUser()
        setLamarans(data)
        setUserLowonganIds(new Set(data.map((l: Lamaran) => l.idLowongan)))
      } catch (err) {
        console.error("Gagal mengambil lamaran:", err)
      }
    }
    fetchLamarans()
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

            {lowongan.totalAsdosAccepted >= lowongan.totalAsdosNeeded ? (
              <p className="text-red-500 font-semibold mt-2">Kuota Penuh</p>
            ) : userLowonganIds.has(lowongan.id) ? (
              <a
                href={`/lamaran/detail/${lowongan.id}`}
                className="inline-block mt-2 bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600"
              >
                Lihat Detail
              </a>
            ) : (
              <a
                href={`/lowongan/daftarLowongan/${lowongan.id}`}
                className="inline-block mt-2 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
              >
                Daftar
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
