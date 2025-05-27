"use client"
import { useState, use } from "react"
import type React from "react"

import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"

export default function EditLowongan() {
  const router = useRouter()
  const params = useParams()

  const [formData, setFormData] = useState({
    mataKuliah: "Pemrograman Paralel",
    kodeMataKuliah: "CSCE604229",
    tahunAjaran: "2024/2025",
    semester: "Ganjil",
    jumlahDibutuhkan: "2",
    deadline: "2025-01-31",
    deskripsi: "Asisten dosen untuk mata kuliah Pemrograman Paralel",
    persyaratan: "IPK minimal 3.0, telah lulus mata kuliah prasyarat",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Validation
    if (
        !formData.mataKuliah ||
        !formData.kodeMataKuliah ||
        !formData.tahunAjaran ||
        !formData.semester ||
        !formData.jumlahDibutuhkan ||
        !formData.deadline
    ) {
      setError("Semua field wajib diisi")
      setIsSubmitting(false)
      return
    }

    if (Number.parseInt(formData.jumlahDibutuhkan) < 1) {
      setError("Jumlah asisten yang dibutuhkan minimal 1")
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      console.log("Lowongan diperbarui:", formData, "ID:", params.id)
      setIsSubmitting(false)
      router.push("/lowongan/manajemen")
    }, 1500)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
      <div className="max-w-4xl mx-auto p-6 sm:p-10">
        <Link
            href="/lowongan/manajemen"
            className="inline-flex items-center text-primary hover:text-secondary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Manajemen Lowongan
        </Link>

        <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 mb-8 text-white shadow-lg">
          <h1 className="text-2xl font-bold">Edit Lowongan</h1>
          <p className="text-primary-foreground mt-2">Perbarui informasi lowongan asisten dosen</p>
        </div>

        {error && (
            <div className="bg-red-100 border border-red-200 text-red-800 rounded-md p-4 mb-6 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
        )}

        <div className="bg-white dark:bg-muted rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nama Mata Kuliah *</label>
                <input
                    type="text"
                    value={formData.mataKuliah}
                    onChange={(e) => handleInputChange("mataKuliah", e.target.value)}
                    placeholder="Contoh: Pemrograman Paralel"
                    className="w-full px-4 py-2 rounded-md border border-input focus:border-primary focus:ring-2 focus:ring-accent"
                    required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Kode Mata Kuliah *</label>
                <input
                    type="text"
                    value={formData.kodeMataKuliah}
                    onChange={(e) => handleInputChange("kodeMataKuliah", e.target.value)}
                    placeholder="Contoh: CSCE604229"
                    className="w-full px-4 py-2 rounded-md border border-input focus:border-primary focus:ring-2 focus:ring-accent"
                    required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tahun Ajaran *</label>
                <select
                    value={formData.tahunAjaran}
                    onChange={(e) => handleInputChange("tahunAjaran", e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-input focus:border-primary focus:ring-2 focus:ring-accent"
                    required
                >
                  <option value="">Pilih tahun ajaran</option>
                  <option value="2024/2025">2024/2025</option>
                  <option value="2025/2026">2025/2026</option>
                  <option value="2026/2027">2026/2027</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Semester *</label>
                <select
                    value={formData.semester}
                    onChange={(e) => handleInputChange("semester", e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-input focus:border-primary focus:ring-2 focus:ring-accent"
                    required
                >
                  <option value="">Pilih semester</option>
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Jumlah Asisten Dibutuhkan *</label>
                <input
                    type="number"
                    min="1"
                    value={formData.jumlahDibutuhkan}
                    onChange={(e) => handleInputChange("jumlahDibutuhkan", e.target.value)}
                    placeholder="Contoh: 2"
                    className="w-full px-4 py-2 rounded-md border border-input focus:border-primary focus:ring-2 focus:ring-accent"
                    required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Deadline Pendaftaran *</label>
                <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange("deadline", e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-input focus:border-primary focus:ring-2 focus:ring-accent"
                    required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Deskripsi Lowongan</label>
              <textarea
                  rows={4}
                  value={formData.deskripsi}
                  onChange={(e) => handleInputChange("deskripsi", e.target.value)}
                  placeholder="Jelaskan tugas dan tanggung jawab asisten..."
                  className="w-full px-4 py-2 rounded-md border border-input focus:border-primary focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Persyaratan Khusus</label>
              <textarea
                  rows={3}
                  value={formData.persyaratan}
                  onChange={(e) => handleInputChange("persyaratan", e.target.value)}
                  placeholder="Sebutkan persyaratan khusus jika ada..."
                  className="w-full px-4 py-2 rounded-md border border-input focus:border-primary focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-primary text-white rounded-md hover:bg-secondary transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
              <Link href="/lowongan/manajemen">
                <button
                    type="button"
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
  )
}