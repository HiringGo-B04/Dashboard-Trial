"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchLowongan, fetchLamaranUser } from "../controller"
import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTerm, setSelectedTerm] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")

  const router = useRouter()

  // Function to get userId from JWT token
  const getUserIdFromToken = (): string | null => {
    try {
      let token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("token") ||
        sessionStorage.getItem("authToken") ||
        sessionStorage.getItem("accessToken") ||
        Cookies.get("token") ||
        Cookies.get("authToken") ||
        Cookies.get("accessToken") ||
        Cookies.get("jwt")

      if (!token) {
        return null
      }

      // Remove "Bearer " prefix if exists
      if (token.startsWith("Bearer ")) {
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

    const matchingLamarans = lamarans.filter((lamaran) => {
      const lowonganMatch = lamaran.idLowongan === lowonganId
      const mahasiswaMatch = lamaran.idMahasiswa === userId
      return lowonganMatch && mahasiswaMatch
    })

    return matchingLamarans.length > 0
  }

  // Get application status for a lowongan
  const getApplicationStatus = (lowonganId: string): string | null => {
    if (!userId) return null

    const application = lamarans.find((lamaran) => lamaran.idLowongan === lowonganId && lamaran.idMahasiswa === userId)

    return application?.status || null
  }

  useEffect(() => {
    const userIdFromToken = getUserIdFromToken()
    setUserId(userIdFromToken)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
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

  // Filter lowongans based on search and filters
  const filteredLowongans = lowongans.filter((lowongan) => {
    const matchesSearch = lowongan.matkul.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTerm = selectedTerm === "all" || lowongan.term === selectedTerm
    const matchesYear = selectedYear === "all" || lowongan.tahun.toString() === selectedYear

    return matchesSearch && matchesTerm && matchesYear
  })

  // Group filtered lowongans by term & year
  const grouped: Record<string, Lowongan[]> = {}
  for (const lowongan of filteredLowongans) {
    const key = `${lowongan.term} ${lowongan.tahun}`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(lowongan)
  }

  // Get unique years and terms for filters
  const uniqueYears = [...new Set(lowongans.map((l) => l.tahun.toString()))].sort()
  const uniqueTerms = [...new Set(lowongans.map((l) => l.term))]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DITERIMA":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-800 bg-opacity-80 text-green-200 border border-green-600">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Diterima
          </span>
        )
      case "DITOLAK":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-800 bg-opacity-80 text-red-200 border border-red-600">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Ditolak
          </span>
        )
      case "MENUNGGU":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-800 bg-opacity-80 text-yellow-200 border border-yellow-600">
            <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Menunggu
          </span>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-400 border-t-transparent mx-auto"></div>
            <p className="mt-6 text-lg text-teal-100 font-medium">Loading lowongan data...</p>
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-200">Error Loading Data</h3>
                <p className="text-red-300 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTable = (title: string, data: Lowongan[]) => (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-blue-800 to-teal-700 rounded-t-xl p-4 border-b border-slate-600">
        <h2 className="text-xl font-bold text-white flex items-center">
          <svg className="w-6 h-6 mr-2 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          {title}
        </h2>
      </div>
      <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-b-xl overflow-hidden border border-slate-600 border-t-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-600">
            <thead className="bg-slate-700 bg-opacity-60">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-teal-200 uppercase tracking-wider">
                  Mata Kuliah
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-teal-200 uppercase tracking-wider">
                  Status Lowongan
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-teal-200 uppercase tracking-wider">
                  Kuota
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-teal-200 uppercase tracking-wider">
                  Pendaftar
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-teal-200 uppercase tracking-wider">
                  Diterima
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-teal-200 uppercase tracking-wider">
                  Status Aplikasi
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-teal-200 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 bg-opacity-40 divide-y divide-slate-600">
              {data.map((lowongan) => {
                const isPenuh = lowongan.totalAsdosAccepted >= lowongan.totalAsdosNeeded
                const userHasApplied = hasUserApplied(lowongan.id)
                const applicationStatus = getApplicationStatus(lowongan.id)
                const progressPercentage = (lowongan.totalAsdosAccepted / lowongan.totalAsdosNeeded) * 100

                return (
                  <tr
                    key={lowongan.id}
                    className="hover:bg-teal-800 hover:bg-opacity-20 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-white">{lowongan.matkul}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isPenuh ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-800 bg-opacity-80 text-red-200 border border-red-600">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Penuh
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-800 bg-opacity-80 text-green-200 border border-green-600">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Tersedia
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-medium text-white">{lowongan.totalAsdosNeeded}</div>
                      <div className="w-full bg-slate-600 rounded-full h-2 mt-1">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-medium text-slate-200">{lowongan.totalAsdosRegistered}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-medium text-teal-300">{lowongan.totalAsdosAccepted}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {applicationStatus ? (
                        getStatusBadge(applicationStatus)
                      ) : (
                        <span className="text-slate-400 text-xs">Belum Mendaftar</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isPenuh ? (
                        <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-slate-700 text-slate-400 cursor-not-allowed">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Kuota Penuh
                        </span>
                      ) : userHasApplied ? (
                        <a
                          href={`/lowongan/lamaran/detail/${lowongan.id}`}
                          className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-700 bg-opacity-80 text-blue-200 border border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          Lihat Detail
                        </a>
                      ) : (
                        <a
                          href={`/lowongan/daftarLowongan/${lowongan.id}`}
                          className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-teal-600 to-blue-600 text-white border border-teal-500 hover:from-teal-500 hover:to-blue-500 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
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
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-teal-600 rounded-2xl p-8 mb-8 text-white shadow-2xl border border-blue-600 border-opacity-30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white">Daftar Lowongan Asisten Dosen</h1>
              <p className="text-blue-100 text-lg opacity-90">
                Temukan dan daftar lowongan asisten dosen yang sesuai dengan minat Anda
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                <svg className="h-16 w-16 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600 border-opacity-50 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-teal-600 bg-opacity-80 rounded-lg p-3 mr-4">
              <svg className="h-6 w-6 text-teal-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Cari & Filter Lowongan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label htmlFor="search" className="block text-sm font-semibold text-teal-200 mb-3">
                Cari Mata Kuliah
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Masukkan nama mata kuliah..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border-2 border-slate-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-slate-700 text-white font-medium placeholder-slate-400"
                />
                <svg
                  className="absolute left-3 top-3.5 h-5 w-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div>
              <label htmlFor="term" className="block text-sm font-semibold text-teal-200 mb-3">
                Semester
              </label>
              <select
                id="term"
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-slate-700 text-white font-medium"
              >
                <option value="all" className="bg-slate-700">
                  Semua Semester
                </option>
                {uniqueTerms.map((term) => (
                  <option key={term} value={term} className="bg-slate-700">
                    {term}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-semibold text-teal-200 mb-3">
                Tahun
              </label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-slate-700 text-white font-medium"
              >
                <option value="all" className="bg-slate-700">
                  Semua Tahun
                </option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year} className="bg-slate-700">
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-6 p-4 bg-teal-800 bg-opacity-40 rounded-xl border border-teal-600 border-opacity-40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-teal-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span className="text-sm font-medium text-teal-100">
                  Menampilkan <span className="font-bold text-teal-200">{filteredLowongans.length}</span> dari{" "}
                  {lowongans.length} lowongan
                </span>
              </div>
              {(searchTerm || selectedTerm !== "all" || selectedYear !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedTerm("all")
                    setSelectedYear("all")
                  }}
                  className="text-sm text-teal-300 hover:text-white transition-colors duration-200"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Lowongan Tables */}
        <div className="space-y-8">
          {Object.keys(grouped).length === 0 ? (
            <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600 border-opacity-50 p-16 text-center">
              <div className="bg-slate-700 bg-opacity-60 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <svg className="h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Tidak Ada Lowongan Ditemukan</h3>
              <p className="text-slate-300 text-lg">
                Coba ubah kriteria pencarian atau filter untuk menemukan lowongan yang sesuai.
              </p>
            </div>
          ) : (
            Object.entries(grouped).map(([termYear, items]) => renderTable(termYear, items))
          )}
        </div>

        {/* Back to Dashboard Button */}
        <div className="mt-8 text-center">
          <a
            href="/dashboard/student"
            className="inline-flex items-center px-8 py-4 border-2 border-teal-400 rounded-xl shadow-2xl text-sm font-semibold text-teal-300 bg-slate-800 bg-opacity-80 hover:bg-teal-600 hover:text-white hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 transition-all duration-300 backdrop-blur-sm"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
