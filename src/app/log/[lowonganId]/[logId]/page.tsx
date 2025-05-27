"use client"

import { useState, useEffect, type FormEvent } from "react"
import { useRouter, useParams } from "next/navigation"
import { getLogById, updateLog, kategoriOptions, type LogDTO } from "../../controller"

export default function EditLog() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditable, setIsEditable] = useState(false)

  const [judul, setJudul] = useState("")
  const [keterangan, setKeterangan] = useState("")
  const [kategori, setKategori] = useState("")
  const [tanggalLog, setTanggalLog] = useState("")
  const [waktuMulai, setWaktuMulai] = useState("")
  const [waktuSelesai, setWaktuSelesai] = useState("")
  const [pesanUntukDosen, setPesanUntukDosen] = useState("")
  const [status, setStatus] = useState("")

  useEffect(() => {
    fetchLog()
  }, [params.logId])

  const fetchLog = async () => {
    try {
      setLoading(true)

      const log = await getLogById(params.logId as string)

      setJudul(log.judul)
      setKeterangan(log.keterangan)
      setKategori(log.kategori)
      setTanggalLog(log.tanggalLog)
      setWaktuMulai(log.waktuMulai.substring(0, 5))
      setWaktuSelesai(log.waktuSelesai.substring(0, 5))
      setPesanUntukDosen(log.pesanUntukDosen || "")
      setStatus(log.status)
      setIsEditable(log.status === "MENUNGGU")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal memuat log")
      router.back()
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!isEditable) {
      alert("Log ini tidak dapat diubah karena sudah diverifikasi")
      return
    }

    if (!judul || !keterangan || !tanggalLog || !waktuMulai || !waktuSelesai) {
      alert("Mohon lengkapi semua field yang wajib diisi")
      return
    }

    if (waktuSelesai <= waktuMulai) {
      alert("Waktu selesai harus setelah waktu mulai")
      return
    }

    if (new Date(tanggalLog) > new Date()) {
      alert("Tanggal log tidak boleh di masa depan")
      return
    }

    const logData: LogDTO = {
      judul,
      keterangan,
      kategori,
      tanggalLog,
      waktuMulai: `${waktuMulai}:00`,
      waktuSelesai: `${waktuSelesai}:00`,
      pesanUntukDosen: pesanUntukDosen || undefined,
      idLowongan: params.lowonganId as string,
    }

    try {
      setSaving(true)
      await updateLog(params.logId as string, logData)
      alert("Log berhasil diperbarui")
      router.push(`/log/${params.lowonganId}`)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal memperbarui log")
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DITERIMA":
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded">Diterima</span>
      case "DITOLAK":
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded">Ditolak</span>
      case "MENUNGGU":
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded">Menunggu Verifikasi</span>
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded">{status}</span>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-400 border-t-transparent mx-auto"></div>
            <p className="mt-6 text-lg text-teal-100 font-medium">Loading log data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-teal-600 rounded-2xl p-8 mb-8 text-white shadow-2xl border border-blue-600 border-opacity-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-10 rounded-xl p-3 mr-4 backdrop-blur-sm border border-white border-opacity-20">
                <svg className="h-8 w-8 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">
                  {isEditable ? "Edit Log Kegiatan" : "Detail Log Kegiatan"}
                </h1>
                <p className="text-blue-100 text-lg opacity-90">
                  {isEditable ? "Perbarui informasi log kegiatan" : "Lihat detail log kegiatan"}
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              {status === "DITERIMA" && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-800 bg-opacity-80 text-green-200 border border-green-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Diterima
                </span>
              )}
              {status === "DITOLAK" && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-800 bg-opacity-80 text-red-200 border border-red-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Ditolak
                </span>
              )}
              {status === "MENUNGGU" && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-800 bg-opacity-80 text-yellow-200 border border-yellow-600">
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
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
                  Menunggu Verifikasi
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Alert for non-editable logs */}
        {!isEditable && (
          <div className="bg-yellow-900 bg-opacity-80 border-2 border-yellow-600 rounded-xl p-4 mb-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-yellow-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-yellow-200">Log Tidak Dapat Diubah</h3>
                <p className="text-yellow-300 mt-1">
                  Log ini sudah diverifikasi oleh dosen dan tidak dapat diubah lagi.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Section */}
        <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600 border-opacity-50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="judul" className="block text-sm font-semibold text-teal-200 mb-3">
                  Judul Kegiatan <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="judul"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl shadow-lg focus:outline-none transition-all duration-200 font-medium placeholder-slate-400 ${
                    isEditable
                      ? "border-slate-600 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-slate-700 text-white"
                      : "border-slate-500 bg-slate-600 text-slate-300 cursor-not-allowed"
                  }`}
                  placeholder="Masukkan judul kegiatan"
                  disabled={!isEditable}
                  required
                />
              </div>

              <div>
                <label htmlFor="kategori" className="block text-sm font-semibold text-teal-200 mb-3">
                  Kategori Kegiatan <span className="text-red-400">*</span>
                </label>
                <select
                  id="kategori"
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl shadow-lg focus:outline-none transition-all duration-200 font-medium ${
                    isEditable
                      ? "border-slate-600 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-slate-700 text-white"
                      : "border-slate-500 bg-slate-600 text-slate-300 cursor-not-allowed"
                  }`}
                  disabled={!isEditable}
                  required
                >
                  {kategoriOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slate-700">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tanggal" className="block text-sm font-semibold text-teal-200 mb-3">
                  Tanggal Kegiatan <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  id="tanggal"
                  value={tanggalLog}
                  onChange={(e) => setTanggalLog(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className={`w-full px-4 py-3 border-2 rounded-xl shadow-lg focus:outline-none transition-all duration-200 font-medium ${
                    isEditable
                      ? "border-slate-600 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-slate-700 text-white"
                      : "border-slate-500 bg-slate-600 text-slate-300 cursor-not-allowed"
                  }`}
                  disabled={!isEditable}
                  required
                />
              </div>

              <div>
                <label htmlFor="waktuMulai" className="block text-sm font-semibold text-teal-200 mb-3">
                  Waktu Mulai <span className="text-red-400">*</span>
                </label>
                <input
                  type="time"
                  id="waktuMulai"
                  value={waktuMulai}
                  onChange={(e) => setWaktuMulai(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl shadow-lg focus:outline-none transition-all duration-200 font-medium ${
                    isEditable
                      ? "border-slate-600 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-slate-700 text-white"
                      : "border-slate-500 bg-slate-600 text-slate-300 cursor-not-allowed"
                  }`}
                  disabled={!isEditable}
                  required
                />
              </div>

              <div>
                <label htmlFor="waktuSelesai" className="block text-sm font-semibold text-teal-200 mb-3">
                  Waktu Selesai <span className="text-red-400">*</span>
                </label>
                <input
                  type="time"
                  id="waktuSelesai"
                  value={waktuSelesai}
                  onChange={(e) => setWaktuSelesai(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl shadow-lg focus:outline-none transition-all duration-200 font-medium ${
                    isEditable
                      ? "border-slate-600 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-slate-700 text-white"
                      : "border-slate-500 bg-slate-600 text-slate-300 cursor-not-allowed"
                  }`}
                  disabled={!isEditable}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="keterangan" className="block text-sm font-semibold text-teal-200 mb-3">
                  Deskripsi Kegiatan <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="keterangan"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl shadow-lg focus:outline-none transition-all duration-200 font-medium placeholder-slate-400 ${
                    isEditable
                      ? "border-slate-600 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-slate-700 text-white"
                      : "border-slate-500 bg-slate-600 text-slate-300 cursor-not-allowed"
                  }`}
                  rows={4}
                  placeholder="Jelaskan detail kegiatan yang dilakukan"
                  disabled={!isEditable}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="pesan" className="block text-sm font-semibold text-teal-200 mb-3">
                  Pesan untuk Dosen (Opsional)
                </label>
                <textarea
                  id="pesan"
                  value={pesanUntukDosen}
                  onChange={(e) => setPesanUntukDosen(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl shadow-lg focus:outline-none transition-all duration-200 font-medium placeholder-slate-400 ${
                    isEditable
                      ? "border-slate-600 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-slate-700 text-white"
                      : "border-slate-500 bg-slate-600 text-slate-300 cursor-not-allowed"
                  }`}
                  rows={3}
                  placeholder="Pesan tambahan atau catatan khusus untuk dosen"
                  disabled={!isEditable}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-600">
              {isEditable && (
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center px-8 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-600 to-blue-600 text-white border border-teal-500 hover:from-teal-500 hover:to-blue-500 hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl"
                >
                  {saving ? (
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
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Simpan Perubahan
                    </>
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-slate-500 rounded-xl shadow-2xl text-sm font-semibold text-slate-300 bg-slate-700 bg-opacity-80 hover:bg-slate-600 hover:text-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-all duration-300 backdrop-blur-sm"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
