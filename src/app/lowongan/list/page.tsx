"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchLowongan, fetchLamaranUser } from "../controller"
import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie" // Import js-cookie

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

interface JWTPayload {
  sub: string
  role: string
  userId: string
  iat: number
  exp: number
}

export default function ListLowonganPage() {
  const [lowongans, setLowongans] = useState<Lowongan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lamarans, setLamarans] = useState<Lamaran[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  // Function to get userId from JWT token
  const getUserIdFromToken = (): string | null => {
    try {
      
      // Coba berbagai cara penyimpanan token
      let token = localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  localStorage.getItem('accessToken') ||
                  sessionStorage.getItem('token') || 
                  sessionStorage.getItem('authToken') ||
                  sessionStorage.getItem('accessToken') ||
                  Cookies.get('token') ||
                  Cookies.get('authToken') ||
                  Cookies.get('accessToken') ||
                  Cookies.get('jwt')
      
      
      if (!token) {
        
        return null
      }
      
      // Hapus prefix "Bearer " jika ada
      if (token.startsWith('Bearer ')) {
        token = token.substring(7)
      }
      
      const decoded = jwtDecode<JWTPayload>(token)
      
      return decoded.userId || null
    } catch (error) {
      console.error("Error decoding JWT:", error)
      return null
    }
  }

  // Function to check if user has applied for a specific lowongan
  const hasUserApplied = (lowonganId: string): boolean => {
    
    if (!userId) {
      return false
    }
    
    const matchingLamarans = lamarans.filter(lamaran => {
      
      const lowonganMatch = lamaran.idLowongan === lowonganId
      const mahasiswaMatch = lamaran.idMahasiswa === userId
      
      return lowonganMatch && mahasiswaMatch
    })
    
    
    return matchingLamarans.length > 0
  }

  useEffect(() => {
    // Get userId from JWT token
    const userIdFromToken = getUserIdFromToken()
    setUserId(userIdFromToken)
  }, [])

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
      } catch (err) {
        console.error("Gagal mengambil lamaran:", err)
      }
    }
    fetchLamarans()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">Error: {error}</p>

  // Kelompokkan lowongan berdasarkan term & tahun
  const grouped: Record<string, Lowongan[]> = {}
  for (const lowongan of lowongans) {
    const key = `${lowongan.term} ${lowongan.tahun}`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(lowongan)
  }

  const renderTable = (title: string, data: Lowongan[]) => (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-black text-left">
              <th className="border px-4 py-2 w-[50%]">Mata Kuliah</th>
              <th className="border px-4 py-2 w-[20%]">Status Lowongan</th>
              <th className="border px-4 py-2 w-[5%]">Dibutuhkan</th>
              <th className="border px-4 py-2 w-[5%]">Terdaftar</th>
              <th className="border px-4 py-2 w-[5%]">Diterima</th>
              <th className="border px-4 py-2 w-[15%]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((lowongan) => {
              const isPenuh = lowongan.totalAsdosAccepted >= lowongan.totalAsdosNeeded
              const statusLabel = isPenuh ? "Penuh" : "Tersedia"
              const statusColor = isPenuh ? "text-red-500" : "text-green-600"
              const userHasApplied = hasUserApplied(lowongan.id)

              return (
                <tr key={lowongan.id}>
                  <td className="border px-4 py-2">{lowongan.matkul}</td>
                  <td className={`border px-4 py-2 font-semibold ${statusColor}`}>{statusLabel}</td>
                  <td className="border px-4 py-2">{lowongan.totalAsdosNeeded}</td>
                  <td className="border px-4 py-2">{lowongan.totalAsdosRegistered}</td>
                  <td className="border px-4 py-2">{lowongan.totalAsdosAccepted}</td>
                  <td className="border px-4 py-2">
                    {isPenuh ? (
                      <span className="text-red-500 font-semibold">Kuota Penuh</span>
                    ) : userHasApplied ? (
                      <a
                        href={`/lowongan/lamaran/detail/${lowongan.id}`}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      >
                        Lihat Detail
                      </a>
                    ) : (
                      <a
                        href={`/lowongan/daftarLowongan/${lowongan.id}`}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Daftar
                      </a>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Daftar Lowongan</h1>
      {Object.entries(grouped).map(([termYear, items]) => renderTable(termYear, items))}
    </div>
  )
}