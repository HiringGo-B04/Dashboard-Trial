"use client"
import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Edit, Trash2, Users, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
    setLowongan((prev) => prev.filter((item) => item.id !== id))
    setDeleteId(null)
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cari mata kuliah atau kode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Link href="/lowongan/manajemen/buat">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Buat Lowongan Baru
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-muted rounded-lg shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mata Kuliah</TableHead>
              <TableHead>Tahun Ajaran</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead className="text-center">Dibutuhkan</TableHead>
              <TableHead className="text-center">Pendaftar</TableHead>
              <TableHead className="text-center">Diterima</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLowongan.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.mataKuliah}</div>
                    <div className="text-sm text-muted-foreground">{item.kodeMataKuliah}</div>
                  </div>
                </TableCell>
                <TableCell>{item.tahunAjaran}</TableCell>
                <TableCell>{item.semester}</TableCell>
                <TableCell className="text-center">{item.jumlahDibutuhkan}</TableCell>
                <TableCell className="text-center">{item.jumlahPendaftar}</TableCell>
                <TableCell className="text-center">{item.jumlahDiterima}</TableCell>
                <TableCell>{new Date(item.deadline).toLocaleDateString("id-ID")}</TableCell>
                <TableCell>
                  <span className={getStatusBadge(item.status)}>{item.status}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link href={`/lowongan/manajemen/${item.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/lowongan/manajemen/${item.id}/pendaftar`}>
                      <Button variant="ghost" size="sm">
                        <Users className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/lowongan/manajemen/${item.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(item.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Lowongan</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus lowongan untuk mata kuliah "{item.mataKuliah}"? Tindakan
                            ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredLowongan.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Tidak ada lowongan yang ditemukan</p>
          </div>
        )}
      </div>
    </div>
  )
}
