"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, X, Eye, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

interface Pendaftar {
  id: string
  nama: string
  npm: string
  ipk: number
  sks: number
  motivasi: string
  tanggalDaftar: string
  status: "Menunggu" | "Diterima" | "Ditolak"
}

// Sample data
const samplePendaftar: Pendaftar[] = [
  {
    id: "1",
    nama: "Ahmad Rizki",
    npm: "2106123456",
    ipk: 3.85,
    sks: 120,
    motivasi: "Saya tertarik dengan pemrograman paralel dan ingin mengembangkan kemampuan mengajar saya...",
    tanggalDaftar: "2025-01-15",
    status: "Diterima",
  },
  {
    id: "2",
    nama: "Sari Dewi",
    npm: "2106234567",
    ipk: 3.92,
    sks: 115,
    motivasi: "Mata kuliah ini sangat menarik dan saya ingin berbagi pengetahuan dengan adik tingkat...",
    tanggalDaftar: "2025-01-16",
    status: "Menunggu",
  },
  {
    id: "3",
    nama: "Budi Santoso",
    npm: "2106345678",
    ipk: 3.45,
    sks: 110,
    motivasi: "Saya memiliki pengalaman dalam parallel computing dan ingin membantu mahasiswa lain...",
    tanggalDaftar: "2025-01-17",
    status: "Menunggu",
  },
  {
    id: "4",
    nama: "Maya Putri",
    npm: "2106456789",
    ipk: 3.78,
    sks: 125,
    motivasi: "Saya ingin mengasah kemampuan komunikasi dan berbagi ilmu yang telah saya pelajari...",
    tanggalDaftar: "2025-01-18",
    status: "Ditolak",
  },
]

export default function DaftarPendaftar() {
  const [pendaftar, setPendaftar] = useState<Pendaftar[]>(samplePendaftar)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPendaftar, setSelectedPendaftar] = useState<Pendaftar | null>(null)

  const filteredPendaftar = pendaftar.filter(
    (item) => item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || item.npm.includes(searchTerm),
  )

  const handleStatusChange = (id: string, newStatus: "Diterima" | "Ditolak") => {
    setPendaftar((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)))
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case "Diterima":
        return `${baseClasses} bg-green-100 text-green-800`
      case "Ditolak":
        return `${baseClasses} bg-red-100 text-red-800`
      case "Menunggu":
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      default:
        return baseClasses
    }
  }

  const exportData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Nama,NPM,IPK,SKS,Status,Tanggal Daftar\n" +
      filteredPendaftar.map((p) => `${p.nama},${p.npm},${p.ipk},${p.sks},${p.status},${p.tanggalDaftar}`).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "daftar_pendaftar.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Link
        href="/lowongan/manajemen"
        className="inline-flex items-center text-primary hover:text-secondary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Manajemen Lowongan
      </Link>

      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 mb-8 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Daftar Pendaftar</h1>
        <p className="text-primary-foreground mt-2">CSCE604229 - Pemrograman Paralel</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            Dibutuhkan: <span className="font-semibold">2 asisten</span>
          </div>
          <div>
            Total Pendaftar: <span className="font-semibold">{pendaftar.length} mahasiswa</span>
          </div>
          <div>
            Diterima:{" "}
            <span className="font-semibold">{pendaftar.filter((p) => p.status === "Diterima").length} mahasiswa</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Input
            placeholder="Cari nama atau NPM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={exportData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="bg-white dark:bg-muted rounded-lg shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mahasiswa</TableHead>
              <TableHead className="text-center">IPK</TableHead>
              <TableHead className="text-center">SKS</TableHead>
              <TableHead>Tanggal Daftar</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPendaftar.map((pendaftar) => (
              <TableRow key={pendaftar.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{pendaftar.nama}</div>
                    <div className="text-sm text-muted-foreground">{pendaftar.npm}</div>
                  </div>
                </TableCell>
                <TableCell className="text-center font-medium">{pendaftar.ipk}</TableCell>
                <TableCell className="text-center">{pendaftar.sks}</TableCell>
                <TableCell>{new Date(pendaftar.tanggalDaftar).toLocaleDateString("id-ID")}</TableCell>
                <TableCell className="text-center">
                  <span className={getStatusBadge(pendaftar.status)}>{pendaftar.status}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedPendaftar(pendaftar)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detail Pendaftar</DialogTitle>
                          <DialogDescription>Informasi lengkap pendaftar asisten dosen</DialogDescription>
                        </DialogHeader>
                        {selectedPendaftar && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Nama</label>
                                <p className="font-medium">{selectedPendaftar.nama}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">NPM</label>
                                <p className="font-medium">{selectedPendaftar.npm}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">IPK</label>
                                <p className="font-medium">{selectedPendaftar.ipk}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">SKS Diambil</label>
                                <p className="font-medium">{selectedPendaftar.sks}</p>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Motivasi</label>
                              <p className="mt-1 text-sm">{selectedPendaftar.motivasi}</p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {pendaftar.status === "Menunggu" && (
                      <>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Terima Pendaftar</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menerima {pendaftar.nama} sebagai asisten dosen?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleStatusChange(pendaftar.id, "Diterima")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Terima
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Tolak Pendaftar</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menolak {pendaftar.nama}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleStatusChange(pendaftar.id, "Ditolak")}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Tolak
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredPendaftar.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Tidak ada pendaftar yang ditemukan</p>
          </div>
        )}
      </div>
    </div>
  )
}
