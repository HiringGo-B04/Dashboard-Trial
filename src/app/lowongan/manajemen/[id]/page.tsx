"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Edit, Users, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LowonganDetail {
  id: string
  mataKuliah: string
  kodeMataKuliah: string
  tahunAjaran: string
  semester: string
  jumlahDibutuhkan: number
  jumlahPendaftar: number
  jumlahDiterima: number
  deadline: string
  status: string
  deskripsi: string
  persyaratan: string
  tanggalDibuat: string
}

// Sample data
const sampleDetail: LowonganDetail = {
  id: "1",
  mataKuliah: "Pemrograman Paralel",
  kodeMataKuliah: "CSCE604229",
  tahunAjaran: "2024/2025",
  semester: "Ganjil",
  jumlahDibutuhkan: 2,
  jumlahPendaftar: 8,
  jumlahDiterima: 1,
  deadline: "2025-01-31",
  status: "Aktif",
  deskripsi:
    "Asisten dosen untuk mata kuliah Pemrograman Paralel. Bertugas membantu dosen dalam kegiatan praktikum, mengoreksi tugas, dan membimbing mahasiswa.",
  persyaratan:
    "IPK minimal 3.0, telah lulus mata kuliah prasyarat dengan nilai minimal B, memiliki kemampuan komunikasi yang baik.",
  tanggalDibuat: "2025-01-10",
}

export default function DetailLowongan({ params }: { params: { id: string } }) {
  const [lowongan] = useState<LowonganDetail>(sampleDetail)

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium"
    switch (status) {
      case "Aktif":
        return `${baseClasses} bg-green-100 text-green-800`
      case "Tutup":
        return `${baseClasses} bg-red-100 text-red-800`
      case "Draft":
        return `${baseClasses} bg-gray-100 text-gray-800`
      default:
        return baseClasses
    }
  }

  const isDeadlinePassed = new Date(lowongan.deadline) < new Date()

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
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{lowongan.mataKuliah}</h1>
            <p className="text-primary-foreground mt-2">{lowongan.kodeMataKuliah}</p>
            <div className="mt-4">
              <span className={getStatusBadge(lowongan.status)}>{lowongan.status}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/lowongan/manajemen/${lowongan.id}/edit`}>
              <Button variant="secondary" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Link href={`/lowongan/manajemen/${lowongan.id}/pendaftar`}>
              <Button variant="secondary" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Lihat Pendaftar
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-muted rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Dibutuhkan</p>
              <p className="text-2xl font-bold text-primary">{lowongan.jumlahDibutuhkan}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="bg-white dark:bg-muted rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pendaftar</p>
              <p className="text-2xl font-bold text-blue-600">{lowongan.jumlahPendaftar}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-muted rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Diterima</p>
              <p className="text-2xl font-bold text-green-600">{lowongan.jumlahDiterima}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-muted rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-border">Informasi Lowongan</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Tahun Ajaran</h3>
              <p className="text-base">{lowongan.tahunAjaran}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Semester</h3>
              <p className="text-base">{lowongan.semester}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Deadline Pendaftaran</h3>
              <div className="flex items-center gap-2">
                <p className="text-base">{new Date(lowongan.deadline).toLocaleDateString("id-ID")}</p>
                {isDeadlinePassed ? (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <Clock className="h-4 w-4 text-green-500" />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Tanggal Dibuat</h3>
              <p className="text-base">{new Date(lowongan.tanggalDibuat).toLocaleDateString("id-ID")}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-muted rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-border">Deskripsi & Persyaratan</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Deskripsi</h3>
              <p className="text-sm leading-relaxed">{lowongan.deskripsi}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Persyaratan</h3>
              <p className="text-sm leading-relaxed">{lowongan.persyaratan}</p>
            </div>
          </div>
        </div>
      </div>

      {lowongan.jumlahPendaftar > 0 && (
        <div className="mt-8 bg-accent bg-opacity-10 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-accent-foreground">
                Ada {lowongan.jumlahPendaftar} mahasiswa yang mendaftar
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Klik tombol di bawah untuk melihat dan mengelola pendaftar
              </p>
            </div>
            <Link href={`/lowongan/manajemen/${lowongan.id}/pendaftar`}>
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Kelola Pendaftar
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
