"use client"
import { useState } from "react"
import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BuatLowongan() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    mataKuliah: "",
    kodeMataKuliah: "",
    tahunAjaran: "",
    semester: "",
    jumlahDibutuhkan: "",
    deadline: "",
    deskripsi: "",
    persyaratan: "",
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
      console.log("Lowongan baru:", formData)
      setIsSubmitting(false)
      router.push("/lowongan/manajemen")
    }, 1500)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        href="/lowongan/manajemen"
        className="inline-flex items-center text-primary hover:text-secondary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Manajemen Lowongan
      </Link>

      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 mb-8 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Buat Lowongan Baru</h1>
        <p className="text-primary-foreground mt-2">Tambahkan lowongan asisten dosen untuk mata kuliah Anda</p>
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
              <Label htmlFor="mataKuliah">Nama Mata Kuliah *</Label>
              <Input
                id="mataKuliah"
                value={formData.mataKuliah}
                onChange={(e) => handleInputChange("mataKuliah", e.target.value)}
                placeholder="Contoh: Pemrograman Paralel"
                required
              />
            </div>

            <div>
              <Label htmlFor="kodeMataKuliah">Kode Mata Kuliah *</Label>
              <Input
                id="kodeMataKuliah"
                value={formData.kodeMataKuliah}
                onChange={(e) => handleInputChange("kodeMataKuliah", e.target.value)}
                placeholder="Contoh: CSCE604229"
                required
              />
            </div>

            <div>
              <Label htmlFor="tahunAjaran">Tahun Ajaran *</Label>
              <Select onValueChange={(value) => handleInputChange("tahunAjaran", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tahun ajaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024/2025">2024/2025</SelectItem>
                  <SelectItem value="2025/2026">2025/2026</SelectItem>
                  <SelectItem value="2026/2027">2026/2027</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="semester">Semester *</Label>
              <Select onValueChange={(value) => handleInputChange("semester", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ganjil">Ganjil</SelectItem>
                  <SelectItem value="Genap">Genap</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="jumlahDibutuhkan">Jumlah Asisten Dibutuhkan *</Label>
              <Input
                id="jumlahDibutuhkan"
                type="number"
                min="1"
                value={formData.jumlahDibutuhkan}
                onChange={(e) => handleInputChange("jumlahDibutuhkan", e.target.value)}
                placeholder="Contoh: 2"
                required
              />
            </div>

            <div>
              <Label htmlFor="deadline">Deadline Pendaftaran *</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange("deadline", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="deskripsi">Deskripsi Lowongan</Label>
            <Textarea
              id="deskripsi"
              rows={4}
              value={formData.deskripsi}
              onChange={(e) => handleInputChange("deskripsi", e.target.value)}
              placeholder="Jelaskan tugas dan tanggung jawab asisten..."
            />
          </div>

          <div>
            <Label htmlFor="persyaratan">Persyaratan Khusus</Label>
            <Textarea
              id="persyaratan"
              rows={3}
              value={formData.persyaratan}
              onChange={(e) => handleInputChange("persyaratan", e.target.value)}
              placeholder="Sebutkan persyaratan khusus jika ada..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex items-center">
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Menyimpan..." : "Simpan Lowongan"}
            </Button>
            <Link href="/lowongan/manajemen">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
