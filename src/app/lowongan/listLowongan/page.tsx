"use client"
import Link from "next/link"
import { useState } from "react"
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"

const lowonganList = [
  {
    id: 1,
    kode: "CSCE604229 - 01.00.12.01-2020",
    nama: "Pemrograman Paralel",
    prodi: "Ilmu Komputer",
    semester: "Genap 2024/2025",
    dosen: "ari.w, heru",
    statusLowongan: "Buka",
    jumlahLowongan: "2 asisten",
    jumlahPelamar: "2 mahasiswa",
    jumlahDiterima: "1 mahasiswa",
    statusLamaran: "-",
    url: "contoh",
  },
  {
    id: 2,
    kode: "CSCE602055 - 01.00.12.01-2021",
    nama: "Sistem Operasi",
    prodi: "Ilmu Komputer",
    semester: "Genap 2024/2025",
    dosen: "fajar.j, devi.m",
    statusLowongan: "Buka",
    jumlahLowongan: "3 asisten",
    jumlahPelamar: "5 mahasiswa",
    jumlahDiterima: "2 mahasiswa",
    statusLamaran: "-",
    url: "contoh",
  },
  {
    id: 3,
    kode: "CSGE601021 - 01.00.12.01-2022",
    nama: "Dasar-Dasar Pemrograman 2",
    prodi: "Ilmu Komputer",
    semester: "Genap 2024/2025",
    dosen: "indra.b, ruli.m",
    statusLowongan: "Tutup",
    jumlahLowongan: "4 asisten",
    jumlahPelamar: "8 mahasiswa",
    jumlahDiterima: "4 mahasiswa",
    statusLamaran: "-",
    url: "contoh",
  },
]

export default function ListLowongan() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredLowongan = lowonganList.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dosen.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "open" && item.statusLowongan === "Buka") ||
      (statusFilter === "closed" && item.statusLowongan === "Tutup")

    return matchesSearch && matchesStatus
  })

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-10">
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 mb-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Daftar Lowongan Asisten</h1>
        <p className="text-primary-foreground mt-2 text-lg">Semester Genap 2024/2025</p>
      </div>

      <div className="bg-white dark:bg-muted rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Cari mata kuliah, kode, atau dosen..."
              className="pl-10 pr-4 py-2 w-full rounded-md border border-input focus:border-primary focus:ring-2 focus:ring-accent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-muted-foreground" />
            </div>
            <select
              className="pl-10 pr-4 py-2 w-full rounded-md border border-input focus:border-primary focus:ring-2 focus:ring-accent appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="open">Buka</option>
              <option value="closed">Tutup</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Mata Kuliah / Nama Lowongan
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Prodi
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Dosen Pembuka
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Lowongan
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Pelamar
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Diterima
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {filteredLowongan.length > 0 ? (
                filteredLowongan.map((item, index) => (
                  <tr key={item.id} className="hover:bg-accent hover:bg-opacity-10 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{index + 1}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{item.nama}</div>
                      <div className="text-xs text-muted-foreground">{item.kode}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{item.prodi}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{item.dosen}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.statusLowongan === "Buka"
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        }`}
                      >
                        {item.statusLowongan}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{item.jumlahLowongan}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{item.jumlahPelamar}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{item.jumlahDiterima}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.statusLowongan === "Buka" ? (
                        <Link href={`/lowongan/daftarLowongan/${item.url}`}>
                          <button className="px-3 py-1.5 bg-primary text-white rounded-md hover:bg-secondary transition-colors text-xs font-medium shadow-sm">
                            Daftar
                          </button>
                        </Link>
                      ) : (
                        <button
                          className="px-3 py-1.5 bg-muted text-muted-foreground rounded-md text-xs font-medium cursor-not-allowed"
                          disabled
                        >
                          Tutup
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                    Tidak ada lowongan yang sesuai dengan pencarian Anda
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Menampilkan {filteredLowongan.length} dari {lowonganList.length} lowongan
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-md border border-input hover:bg-accent hover:bg-opacity-10 disabled:opacity-50"
              disabled
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 rounded-md bg-primary text-white">1</span>
            <button
              className="p-2 rounded-md border border-input hover:bg-accent hover:bg-opacity-10 disabled:opacity-50"
              disabled
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
