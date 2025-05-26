"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createLamaran, fetchLowongan } from "../../controller"

interface Lowongan {
  id: string
  matkul: string
  tahun: number
  term: string
  totalAsdosNeeded: number
  totalAsdosRegistered: number
  totalAsdosAccepted: number
}

export default function FormDaftarLowongan() {
  const router = useRouter()
  const params = useParams()
  const idLowongan = params.id as string

  const [sks, setSks] = useState<number>(0)
  const [ipk, setIpk] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lowonganData, setLowonganData] = useState<Lowongan | null>(null)
  const [loadingLowongan, setLoadingLowongan] = useState(true)
  const [validationErrors, setValidationErrors] = useState<{
    sks?: string
    ipk?: string
  }>({})

  // Fetch lowongan details
  useEffect(() => {
    const fetchLowonganDetails = async () => {
      try {
        setLoadingLowongan(true)
        const data = await fetchLowongan()
        const lowongan = data.find((l: Lowongan) => l.id === idLowongan)
        setLowonganData(lowongan || null)
      } catch (err) {
        console.error("Failed to fetch lowongan details:", err)
      } finally {
        setLoadingLowongan(false)
      }
    }

    if (idLowongan) {
      fetchLowonganDetails()
    }
  }, [idLowongan])

  const validateForm = () => {
    const errors: { sks?: string; ipk?: string } = {}

    if (!sks || sks <= 0) {
      errors.sks = "SKS harus diisi dan lebih dari 0"
    } else if (sks > 24) {
      errors.sks = "SKS tidak boleh lebih dari 24"
    }

    if (!ipk || ipk <= 0) {
      errors.ipk = "IPK harus diisi dan lebih dari 0"
    } else if (ipk > 4.0) {
      errors.ipk = "IPK tidak boleh lebih dari 4.0"
    } else if (ipk < 2.0) {
      errors.ipk = "IPK minimal 2.0"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      await createLamaran({ sks, ipk, idLowongan })

      // Success animation/feedback
      const successMessage = document.createElement("div")
      successMessage.className =
        "fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce"
      successMessage.textContent = "Pendaftaran berhasil!"
      document.body.appendChild(successMessage)

      setTimeout(() => {
        document.body.removeChild(successMessage)
        router.push("/lowongan/list")
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loadingLowongan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-400 border-t-transparent mx-auto"></div>
            <p className="mt-6 text-lg text-teal-100 font-medium">Loading lowongan details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!lowonganData) {
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
                <h3 className="text-lg font-semibold text-red-200">Lowongan Tidak Ditemukan</h3>
                <p className="text-red-300 mt-1">Lowongan yang Anda cari tidak tersedia.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const progressPercentage = (lowonganData.totalAsdosAccepted / lowonganData.totalAsdosNeeded) * 100
  const isQuotaFull = lowonganData.totalAsdosAccepted >= lowonganData.totalAsdosNeeded

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-teal-600 rounded-2xl p-8 mb-8 text-white shadow-2xl border border-blue-600 border-opacity-30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white">Daftar Lowongan Asisten Dosen</h1>
              <p className="text-blue-100 text-lg opacity-90">
                Lengkapi formulir pendaftaran untuk mata kuliah {lowonganData.matkul}
              </p>
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

        {/* Lowongan Info Card */}
        <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600 border-opacity-50 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-teal-600 bg-opacity-80 rounded-lg p-3 mr-4">
              <svg className="h-6 w-6 text-teal-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Informasi Lowongan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-slate-700 bg-opacity-60 rounded-xl p-4 border border-slate-600">
                <h3 className="text-sm font-semibold text-teal-200 mb-2">Mata Kuliah</h3>
                <p className="text-xl font-bold text-white">{lowonganData.matkul}</p>
              </div>
              <div className="bg-slate-700 bg-opacity-60 rounded-xl p-4 border border-slate-600">
                <h3 className="text-sm font-semibold text-teal-200 mb-2">Periode</h3>
                <p className="text-lg font-medium text-white">
                  {lowonganData.term} {lowonganData.tahun}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-700 bg-opacity-60 rounded-xl p-4 border border-slate-600">
                <h3 className="text-sm font-semibold text-teal-200 mb-2">Status Kuota</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">
                    {lowonganData.totalAsdosAccepted} / {lowonganData.totalAsdosNeeded}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${isQuotaFull ? "bg-red-800 bg-opacity-80 text-red-200" : "bg-green-800 bg-opacity-80 text-green-200"}`}
                  >
                    {isQuotaFull ? "Penuh" : "Tersedia"}
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-slate-700 bg-opacity-60 rounded-xl p-4 border border-slate-600">
                <h3 className="text-sm font-semibold text-teal-200 mb-2">Total Pendaftar</h3>
                <p className="text-lg font-medium text-white">{lowonganData.totalAsdosRegistered} orang</p>
              </div>
            </div>
          </div>

          {isQuotaFull && (
            <div className="mt-6 p-4 bg-red-800 bg-opacity-40 rounded-xl border border-red-600 border-opacity-40 backdrop-blur-sm">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium text-red-100">
                  Kuota untuk lowongan ini sudah penuh. Pendaftaran tidak dapat dilanjutkan.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Application Form */}
        {!isQuotaFull && (
          <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600 border-opacity-50 p-8">
            <div className="flex items-center mb-8">
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
              <h2 className="text-2xl font-bold text-white">Formulir Pendaftaran</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="sks" className="block text-sm font-semibold text-teal-200 mb-3">
                    Jumlah SKS yang Telah Diambil *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="sks"
                      min="1"
                      max="24"
                      value={sks || ""}
                      onChange={(e) => setSks(Number(e.target.value))}
                      className={`w-full px-4 py-3 border-2 rounded-xl shadow-lg focus:outline-none focus:ring-2 transition-all duration-200 bg-slate-700 text-white font-medium placeholder-slate-400 ${
                        validationErrors.sks
                          ? "border-red-500 focus:ring-red-400 focus:border-red-400"
                          : "border-slate-600 focus:ring-teal-400 focus:border-teal-400"
                      }`}
                      placeholder="Contoh: 120"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-slate-400 text-sm">SKS</span>
                    </div>
                  </div>
                  {validationErrors.sks && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {validationErrors.sks}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-slate-400">Masukkan total SKS yang telah Anda selesaikan</p>
                </div>

                <div>
                  <label htmlFor="ipk" className="block text-sm font-semibold text-teal-200 mb-3">
                    Indeks Prestasi Kumulatif (IPK) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="ipk"
                      step="0.01"
                      min="0"
                      max="4.00"
                      value={ipk || ""}
                      onChange={(e) => setIpk(Number(e.target.value))}
                      className={`w-full px-4 py-3 border-2 rounded-xl shadow-lg focus:outline-none focus:ring-2 transition-all duration-200 bg-slate-700 text-white font-medium placeholder-slate-400 ${
                        validationErrors.ipk
                          ? "border-red-500 focus:ring-red-400 focus:border-red-400"
                          : "border-slate-600 focus:ring-teal-400 focus:border-teal-400"
                      }`}
                      placeholder="Contoh: 3.75"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-slate-400 text-sm">/4.00</span>
                    </div>
                  </div>
                  {validationErrors.ipk && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {validationErrors.ipk}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-slate-400">IPK minimal 2.0, maksimal 4.0</p>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-800 bg-opacity-40 rounded-xl border border-red-600 border-opacity-40 backdrop-blur-sm">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium text-red-100">{error}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center px-8 py-4 border-2 border-teal-400 rounded-xl shadow-2xl text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Mengirim Lamaran...
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Daftar Sekarang
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/lowongan/list")}
                  className="flex-1 inline-flex items-center justify-center px-8 py-4 border-2 border-slate-500 rounded-xl shadow-2xl text-sm font-semibold text-slate-300 bg-slate-700 bg-opacity-80 hover:bg-slate-600 hover:text-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-all duration-300"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Kembali
                </button>
              </div>
            </form>
          </div>
        )}

        {/* If quota is full, show back button */}
        {isQuotaFull && (
          <div className="text-center">
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
        )}
      </div>
    </div>
  )
}
