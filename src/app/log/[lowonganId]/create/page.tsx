"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { createLog, kategoriOptions, type LogDTO } from "../../controller"

export default function CreateLog() {
  const router = useRouter()
  const params = useParams()

  const lowonganId = params.lowonganId
  if (!lowonganId || Array.isArray(lowonganId)) {
    throw new Error("lowonganId tidak valid.")
  }

  const [judul, setJudul] = useState("")
  const [keterangan, setKeterangan] = useState("")
  const [kategori, setKategori] = useState("ASISTENSI")
  const [tanggalLog, setTanggalLog] = useState(new Date().toISOString().split("T")[0])
  const [waktuMulai, setWaktuMulai] = useState("")
  const [waktuSelesai, setWaktuSelesai] = useState("")
  const [pesanUntukDosen, setPesanUntukDosen] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validasi
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
      idLowongan: lowonganId,
    }

    try {
      setLoading(true)
      await createLog(logData)
      alert("Log berhasil dibuat")
      router.push(`/log/${params.lowonganId}`)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal membuat log")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-teal-600 rounded-2xl p-8 mb-8 text-white shadow-2xl border border-blue-600 border-opacity-30">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-10 rounded-xl p-3 mr-4 backdrop-blur-sm border border-white border-opacity-20">
              <svg className="h-8 w-8 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Tambah Log Kegiatan</h1>
              <p className="text-blue-100 text-lg opacity-90">Catat aktivitas asisten dosen Anda dengan detail</p>
            </div>
          </div>
        </div>

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
                  className="w-full px-4 py-3 border-2 border-slate-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-slate-700 text-white font-medium placeholder-slate-400"
                  placeholder="Masukkan judul kegiatan"
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
                  className="w-full px-4 py-3 border-2 border-slate-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-slate-700 text-white font-medium"
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
                  className="w-full px-4 py-3 border-2 border-slate-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-slate-700 text-white font-medium"
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
                  className="w-full px-4 py-3 border-2 border-slate-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-slate-700 text-white font-medium"
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
                  className="w-full px-4 py-3 border-2 border-slate-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-slate-700 text-white font-medium"
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
                  className="w-full px-4 py-3 border-2 border-slate-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-slate-700 text-white font-medium placeholder-slate-400"
                  rows={4}
                  placeholder="Jelaskan detail kegiatan yang dilakukan"
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
                  className="w-full px-4 py-3 border-2 border-slate-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-slate-700 text-white font-medium placeholder-slate-400"
                  rows={3}
                  placeholder="Pesan tambahan atau catatan khusus untuk dosen"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-600">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-600 to-blue-600 text-white border border-teal-500 hover:from-teal-500 hover:to-blue-500 hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl"
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
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Simpan Log
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-slate-500 rounded-xl shadow-2xl text-sm font-semibold text-slate-300 bg-slate-700 bg-opacity-80 hover:bg-slate-600 hover:text-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-all duration-300 backdrop-blur-sm"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
