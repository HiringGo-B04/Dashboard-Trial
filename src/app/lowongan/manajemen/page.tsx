"use client"
import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Edit, Trash2, Users, Eye } from "lucide-react"

interface Lowongan {
  id: string
  mataKuliah: string
  kodeMataKuliah: string
  tahunAjaran: string
  semester: "Ganjil" | "Genap"
  jumlahDibutuhkan: number
  jumlahPendaftar: number
  jumlahDiterima: number
  deadline: string
  status: "Aktif" | "Tutup" | "Draft"
}

// Sample data
const sampleLowongan: Lowongan[] = [
  {
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
  },
  {
    id: "2",
    mataKuliah: "Basis Data",
    kodeMataKuliah: "CSCE602055",
    tahunAjaran: "2024/2025",
    semester: "Ganjil",
    jumlahDibutuhkan: 3,
    jumlahPendaftar: 12,
    jumlahDiterima: 2,
    deadline: "2025-02-15",
    status: "Aktif",
  },
  {
    id: "3",
    mataKuliah: "Algoritma dan Struktur Data",
    kodeMataKuliah: "CSCE601021",
    tahunAjaran: "2024/2025",
    semester: "Genap",
    jumlahDibutuhkan: 4,
    jumlahPendaftar: 15,
    jumlahDiterima: 4,
    deadline: "2024-12-31",
    status: "Tutup",
  },
]

export default function ManajemenLowongan() {
  const [lowongan, setLowongan] = useState<Lowongan[]>(sampleLowongan)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filteredLowongan = lowongan.filter(
    (item) =>
      item.mataKuliah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodeMataKuliah.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus lowongan ini?")) {
      setLowongan((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manajemen Lowongan Asisten</h1>
        <p className="text-muted-foreground">Kelola lowongan asisten dosen untuk mata kuliah Anda</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Cari mata kuliah atau kode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <Link href="/lowongan/manajemen/buat">
          <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
            <Plus className="h-4 w-4 mr-2" />
            Buat Lowongan Baru
          </button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mata Kuliah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tahun Ajaran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dibutuhkan
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pendaftar
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diterima
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
              {filteredLowongan.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{item.mataKuliah}</div>
                      <div className="text-sm text-gray-500">{item.kodeMataKuliah}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.tahunAjaran}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{item.semester}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                    {item.jumlahDibutuhkan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                    {item.jumlahPendaftar}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                    {item.jumlahDiterima}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(item.deadline).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(item.status)}>{item.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/lowongan/manajemen/${item.id}`}>
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </Link>
                      <Link href={`/lowongan/manajemen/${item.id}/pendaftar`}>
                        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                          <Users className="h-4 w-4" />
                        </button>
                      </Link>
                      <Link href={`/lowongan/manajemen/${item.id}/edit`}>
                        <button className="p-1 text-gray-400 hover:text-yellow-600 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLowongan.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Tidak ada lowongan yang ditemukan</p>
          </div>
        )}
      </div>
    </div>
  )
}
