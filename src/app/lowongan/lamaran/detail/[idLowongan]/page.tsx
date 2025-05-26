"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { fetchLamaranUser, fetchLowongan } from "@/app/lowongan/controller"

interface Lamaran {
  id: string
  sks: number
  ipk: number
  status: string
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

export default function LamaranDetailPage() {
  const { idLowongan } = useParams()
  const router = useRouter()
  const [lamaran, setLamaran] = useState<Lamaran | null>(null)
  const [lowongan, setLowongan] = useState<Lowongan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getDetail = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch lamaran data
        const lamaranData = await fetchLamaranUser()
        const foundLamaran = lamaranData.find((l: Lamaran) => l.idLowongan === idLowongan)

        if (!foundLamaran) {
          setError("Lamaran tidak ditemukan untuk lowongan ini.")
          return
        }

        setLamaran(foundLamaran)

        // Fetch lowongan data
        const lowonganData = await fetchLowongan()
        const foundLowongan = lowonganData.find((l: Lowongan) => l.id === idLowongan)
        setLowongan(foundLowongan || null)
      } catch (err) {
        console.error("Gagal fetch lamaran:", err)
        setError("Gagal memuat data lamaran. Silakan coba lagi.")
      } finally {
        setLoading(false)
      }
    }

    if (idLowongan) {
      getDetail()
    }
  }, [idLowongan])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DITERIMA":
        return (
          <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-green-800 bg-opacity-80 text-green-200 border-2 border-green-600">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            DITERIMA
          </div>
        )
      case "DITOLAK":
        return (
          <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-red-800 bg-opacity-80 text-red-200 border-2 border-red-600">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            DITOLAK
          </div>
        )
      case "MENUNGGU":
        return (
          <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-yellow-800 bg-opacity-80 text-yellow-200 border-2 border-yellow-600">
            <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            MENUNGGU VERIFIKASI
          </div>
        )
      default:
        return (
          <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-slate-700 text-slate-300 border-2 border-slate-600">
            {status}
          </div>
        )
    }
  }

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "DITERIMA":
        return {
          title: "Selamat! Lamaran Anda Diterima",
          description:
            "Anda telah diterima sebagai asisten dosen untuk mata kuliah ini. Silakan hubungi dosen pengampu untuk informasi lebih lanjut.",
          bgColor: "from-green-800 to-emerald-700",
          textColor: "text-green-100",
        }
      case "DITOLAK":
        return {
          title: "Lamaran Tidak Diterima",
          description:
            "Maaf, lamaran Anda untuk mata kuliah ini tidak dapat diterima. Jangan berkecil hati, masih ada kesempatan lain.",
          bgColor: "from-red-800 to-rose-700",
          textColor: "text-red-100",
        }
      case "MENUNGGU":
        return {
          title: "Lamaran Sedang Diproses",
          description:
            "Lamaran Anda sedang dalam tahap verifikasi oleh dosen pengampu. Mohon tunggu pengumuman selanjutnya.",
          bgColor: "from-yellow-800 to-amber-700",
          textColor: "text-yellow-100",
        }
      default:
        return {
          title: "Status Tidak Diketahui",
          description: "Status lamaran Anda tidak dapat ditentukan. Silakan hubungi administrator.",
          bgColor: "from-slate-800 to-slate-700",
          textColor: "text-slate-100",
        }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-400 border-t-transparent mx-auto"></div>
            <p className="mt-6 text-lg text-teal-100 font-medium">Loading application details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !lamaran) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <h3 className="text-lg font-semibold text-red-200">Error</h3>
                <p className="text-red-300 mt-1">{error || "Lamaran tidak ditemukan"}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push("/lowongan/list")}
              className="inline-flex items-center px-8 py-4 border-2 border-slate-500 rounded-xl shadow-2xl text-sm font-semibold text-slate-300 bg-slate-700 bg-opacity-80 hover:bg-slate-600 hover:text-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-all duration-300"
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Daftar Lowongan
            </button>
          </div>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusDescription(lamaran.status)
  const progressPercentage = lowongan ? (lowongan.totalAsdosAccepted / lowongan.totalAsdosNeeded) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-teal-600 rounded-2xl p-8 mb-8 text-white shadow-2xl border border-blue-600 border-opacity-30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white">Detail Lamaran</h1>
              <p className="text-blue-100 text-lg opacity-90">Informasi lengkap tentang status lamaran Anda</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                <svg className="h-16 w-16 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div
          className={`bg-gradient-to-r ${statusInfo.bgColor} rounded-2xl p-8 mb-8 text-white shadow-2xl border border-opacity-30`}
        >
          <div className="text-center">
            <div className="mb-4">{getStatusBadge(lamaran.status)}</div>
            <h2 className="text-2xl font-bold mb-2">{statusInfo.title}</h2>
            <p className={`text-lg ${statusInfo.textColor} opacity-90`}>{statusInfo.description}</p>
          </div>
        </div>

        {/* Application Details */}
        <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600 border-opacity-50 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-teal-600 bg-opacity-80 rounded-lg p-3 mr-4">
              <svg className="h-6 w-6 text-teal-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Detail Lamaran Anda</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-slate-700 bg-opacity-60 rounded-xl p-6 border border-slate-600">
                <h3 className="text-sm font-semibold text-teal-200 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Jumlah SKS
                </h3>
                <p className="text-3xl font-bold text-white">{lamaran.sks}</p>
                <p className="text-sm text-slate-300 mt-1">SKS yang telah diselesaikan</p>
              </div>

              <div className="bg-slate-700 bg-opacity-60 rounded-xl p-6 border border-slate-600">
                <h3 className="text-sm font-semibold text-teal-200 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Indeks Prestasi Kumulatif
                </h3>
                <p className="text-3xl font-bold text-white">{lamaran.ipk.toFixed(2)}</p>
                <p className="text-sm text-slate-300 mt-1">dari skala 4.00</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-700 bg-opacity-60 rounded-xl p-6 border border-slate-600">
                <h3 className="text-sm font-semibold text-teal-200 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Status Lamaran
                </h3>
                <div className="mt-2">{getStatusBadge(lamaran.status)}</div>
              </div>

              
            </div>
          </div>
        </div>

        {/* Lowongan Information */}
        {lowongan && (
          <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600 border-opacity-50 p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-blue-600 bg-opacity-80 rounded-lg p-3 mr-4">
                <svg className="h-6 w-6 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Informasi Lowongan</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-slate-700 bg-opacity-60 rounded-xl p-4 border border-slate-600">
                  <h3 className="text-sm font-semibold text-blue-200 mb-2">Mata Kuliah</h3>
                  <p className="text-xl font-bold text-white">{lowongan.matkul}</p>
                </div>
                <div className="bg-slate-700 bg-opacity-60 rounded-xl p-4 border border-slate-600">
                  <h3 className="text-sm font-semibold text-blue-200 mb-2">Periode</h3>
                  <p className="text-lg font-medium text-white">
                    {lowongan.term} {lowongan.tahun}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-700 bg-opacity-60 rounded-xl p-4 border border-slate-600">
                  <h3 className="text-sm font-semibold text-blue-200 mb-2">Status Kuota</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">
                      {lowongan.totalAsdosAccepted} / {lowongan.totalAsdosNeeded}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        lowongan.totalAsdosAccepted >= lowongan.totalAsdosNeeded
                          ? "bg-red-800 bg-opacity-80 text-red-200"
                          : "bg-green-800 bg-opacity-80 text-green-200"
                      }`}
                    >
                      {lowongan.totalAsdosAccepted >= lowongan.totalAsdosNeeded ? "Penuh" : "Tersedia"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-slate-700 bg-opacity-60 rounded-xl p-4 border border-slate-600">
                  <h3 className="text-sm font-semibold text-blue-200 mb-2">Total Pendaftar</h3>
                  <p className="text-lg font-medium text-white">{lowongan.totalAsdosRegistered} orang</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push("/lowongan/list")}
            className="flex-1 inline-flex items-center justify-center px-8 py-4 border-2 border-teal-400 rounded-xl shadow-2xl text-sm font-semibold text-teal-300 bg-slate-800 bg-opacity-80 hover:bg-teal-600 hover:text-white hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 transition-all duration-300"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Daftar Lowongan
          </button>

          <button
            onClick={() => router.push("/dashboard/student")}
            className="flex-1 inline-flex items-center justify-center px-8 py-4 border-2 border-blue-400 rounded-xl shadow-2xl text-sm font-semibold text-blue-300 bg-slate-800 bg-opacity-80 hover:bg-blue-600 hover:text-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all duration-300"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0"
              />
            </svg>
            Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
