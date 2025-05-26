"use client"

import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie"

interface Lamaran {
  id: string
  sks: number
  ipk: number
  status: string | null
  idMahasiswa: string
  idLowongan: string
}

interface Lowongan {
  id: string
  matkul: string
  tahun: number
  term: string
  totalAsdosNeeded: number
  totalAsdosRegistered: number
  totalAsdosAccepted: number
}

interface HonorData {
  formattedHonor: string
  tahun: number
  honor: number
  lowonganId: string
  bulan: number
}

interface JWTPayload {
  sub: string
  role: string
  userId: string
  iat: number
  exp: number
}

interface HonorTableRow {
  bulanTahun: string
  mataKuliah: string
  jumlahJam: number
  honorPerJam: number
  jumlahPembayaran: string
  rawPembayaran: number
}

export default function HonorTable() {
  const [honorData, setHonorData] = useState<HonorTableRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)

  useEffect(() => {
    fetchHonorData()
  }, [selectedYear, selectedMonth])

  const getUserIdFromToken = (): string | null => {
    try {
      const token = Cookies.get("token")
      if (!token) return null

      const decoded = jwtDecode<JWTPayload>(token)
      return decoded.userId
    } catch (error) {
      console.error("Error decoding token:", error)
      return null
    }
  }

  const fetchHonorData = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = Cookies.get("token")
      if (!token) {
        setError("User not authenticated")
        return
      }

      const userId = getUserIdFromToken()
      if (!userId) {
        setError("Invalid token")
        return
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }

      // Fetch all lamaran
      const lamaranResponse = await fetch("http://localhost:8080/api/lamaran/user/all", {
        method: "GET",
        headers: headers,
      })

      if (!lamaranResponse.ok) {
        if (lamaranResponse.status === 403) {
          throw new Error("Access denied. Please login again.")
        }
        throw new Error(`Failed to fetch lamaran data: ${lamaranResponse.status}`)
      }

      const allLamaran: Lamaran[] = await lamaranResponse.json()

      // Filter lamaran by userId
      const userLamaran = allLamaran.filter((lamaran) => lamaran.idMahasiswa === userId)

      // Get unique lowongan IDs
      const uniqueLowonganIds = [...new Set(userLamaran.map((lamaran) => lamaran.idLowongan))]

      const honorTableData: HonorTableRow[] = []

      // Fetch honor data for each unique lowongan
      for (const lowonganId of uniqueLowonganIds) {
        try {
          // Fetch lowongan details
          const lowonganResponse = await fetch(`http://localhost:8080/api/lowongan/user/lowongan/${lowonganId}`, {
            method: "GET",
            headers: headers,
          })

          if (!lowonganResponse.ok) {
            console.error(`Failed to fetch lowongan ${lowonganId}: ${lowonganResponse.status}`)
            continue
          }

          const lowongan: Lowongan = await lowonganResponse.json()

          // Fetch honor data
          const honorResponse = await fetch(
            `http://localhost:8080/api/log/student/honor?lowonganId=${lowonganId}&tahun=${selectedYear}&bulan=${selectedMonth}`,
            {
              method: "GET",
              headers: headers,
            },
          )

          if (honorResponse.ok) {
            const honor: HonorData = await honorResponse.json()

            // Calculate jumlah jam (pembagian honor dengan 27500)
            const honorPerJam = 27500
            const jumlahJam = Math.round((honor.honor / honorPerJam) * 100) / 100 // Round to 2 decimal places

            // Format bulan/tahun
            const bulanTahun = `${getMonthName(honor.bulan)} ${honor.tahun}`

            honorTableData.push({
              bulanTahun,
              mataKuliah: lowongan.matkul,
              jumlahJam,
              honorPerJam,
              jumlahPembayaran: honor.formattedHonor,
              rawPembayaran: honor.honor,
            })
          }
        } catch (error) {
          console.error(`Error fetching data for lowongan ${lowonganId}:`, error)
        }
      }

      setHonorData(honorTableData)
    } catch (error) {
      console.error("Error fetching honor data:", error)
      setError(error instanceof Error ? error.message : "Failed to load honor data")
    } finally {
      setLoading(false)
    }
  }

  const getMonthName = (month: number): string => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return months[month - 1]
  }

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear - 2; i <= currentYear + 1; i++) {
      years.push(i)
    }
    return years
  }

  const generateMonthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1)
  }

  const getTotalHonor = () => {
    return honorData.reduce((sum, row) => sum + row.rawPembayaran, 0)
  }

  const getTotalJam = () => {
    return honorData.reduce((sum, row) => sum + row.jumlahJam, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-400 border-t-transparent mx-auto"></div>
            <p className="mt-6 text-lg text-teal-100 font-medium">Loading honor data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-teal-600 rounded-2xl p-8 mb-8 text-white shadow-2xl border border-blue-600 border-opacity-30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white">Honor Payment Report</h1>
              <p className="text-blue-100 text-lg opacity-90">Track your monthly honor payments and working hours</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                <svg className="h-16 w-16 text-teal-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600 border-opacity-50 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-teal-600 bg-opacity-80 rounded-lg p-3 mr-4">
              <svg className="h-6 w-6 text-teal-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Filter by Period</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="year" className="block text-sm font-semibold text-teal-200 mb-3">
                Year
              </label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number.parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-slate-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-slate-700 text-white font-medium"
              >
                {generateYearOptions().map((year) => (
                  <option key={year} value={year} className="bg-slate-700">
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="month" className="block text-sm font-semibold text-teal-200 mb-3">
                Month
              </label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number.parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-slate-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-slate-700 text-white font-medium"
              >
                {generateMonthOptions().map((month) => (
                  <option key={month} value={month} className="bg-slate-700">
                    {getMonthName(month)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 p-4 bg-teal-800 bg-opacity-40 rounded-xl border border-teal-600 border-opacity-40 backdrop-blur-sm">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-teal-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium text-teal-100">
                Showing data for:{" "}
                <span className="font-bold text-teal-200">
                  {getMonthName(selectedMonth)} {selectedYear}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Honor Table */}
        <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600 border-opacity-50 overflow-hidden">
          {honorData.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-slate-700 bg-opacity-60 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <svg className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Data Found</h3>
              <p className="text-slate-300 text-lg">
                No honor payment data found for {getMonthName(selectedMonth)} {selectedYear}.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-600">
                  <thead className="bg-gradient-to-r from-blue-800 to-teal-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Bulan/Tahun
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Mata Kuliah
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                        Jumlah Jam
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                        Honor Per Jam
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                        Jumlah Pembayaran
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-800 bg-opacity-60 divide-y divide-slate-600">
                    {honorData.map((row, index) => (
                      <tr key={index} className="hover:bg-teal-800 hover:bg-opacity-30 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                          {row.bulanTahun}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-200">
                          {row.mataKuliah}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200 text-right font-medium">
                          {row.jumlahJam.toFixed(2)} jam
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200 text-right">
                          Rp {row.honorPerJam.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-teal-300 text-right">
                          {row.jumlahPembayaran}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Footer */}
              <div className="bg-gradient-to-r from-slate-700 to-blue-800 px-6 py-6 border-t border-slate-600">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                  <div className="text-sm text-slate-300">
                    <span className="font-semibold text-white">{honorData.length}</span> records found for{" "}
                    {getMonthName(selectedMonth)} {selectedYear}
                  </div>
                  <div className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0">
                    <div className="bg-slate-700 bg-opacity-80 px-4 py-2 rounded-lg shadow-lg border border-slate-600">
                      <span className="text-sm text-slate-300">Total Hours: </span>
                      <span className="font-bold text-lg text-teal-300">{getTotalJam().toFixed(2)}</span>
                    </div>
                    <div className="bg-slate-700 bg-opacity-80 px-4 py-2 rounded-lg shadow-lg border border-slate-600">
                      <span className="text-sm text-slate-300">Total Payment: </span>
                      <span className="font-bold text-lg text-teal-200">
                        Rp {getTotalHonor().toLocaleString("id-ID")}.00
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchHonorData}
            className="inline-flex items-center px-8 py-4 border-2 border-teal-400 rounded-xl shadow-2xl text-sm font-semibold text-teal-300 bg-slate-800 bg-opacity-80 hover:bg-teal-600 hover:text-white hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 transition-all duration-300 backdrop-blur-sm"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  )
}
