"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, X, Eye, Download } from "lucide-react"

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
  const [showModal, setShowModal] = useState(false)

  const filteredPendaftar = pendaftar.filter(
    (item) => item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || item.npm.includes(searchTerm),
  )

  const handleStatusChange = (id: string, newStatus: "Diterima" | "Ditolak") => {
    const action = newStatus === "Diterima" ? "menerima" : "menolak"
    const pendaftarItem = pendaftar.find((p) => p.id === id)

    if (window.confirm(`Apakah Anda yakin ingin ${action} ${pendaftarItem?.nama}?`)) {
      setPendaftar((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)))
    }
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

  const openModal = (pendaftar: Pendaftar) => {
    setSelectedPendaftar(pendaftar)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedPendaftar(null)
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
          <input
            type="text"
            placeholder="Cari nama atau NPM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-input focus:border-primary focus:ring-2 focus:ring-accent"
          />
        </div>
        <button
          onClick={exportData}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="bg-white dark:bg-muted rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mahasiswa
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IPK
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Daftar
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
              {filteredPendaftar.map((pendaftar) => (
                <tr key={pendaftar.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{pendaftar.nama}</div>
                      <div className="text-sm text-gray-500">{pendaftar.npm}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center font-medium text-gray-900 dark:text-white">
                    {pendaftar.ipk}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-gray-900 dark:text-white">
                    {pendaftar.sks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(pendaftar.tanggalDaftar).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={getStatusBadge(pendaftar.status)}>{pendaftar.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openModal(pendaftar)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {pendaftar.status === "Menunggu" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(pendaftar.id, "Diterima")}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(pendaftar.id, "Ditolak")}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPendaftar.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Tidak ada pendaftar yang ditemukan</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedPendaftar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Detail Pendaftar</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nama</label>
                  <p className="font-medium">{selectedPendaftar.nama}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">NPM</label>
                  <p className="font-medium">{selectedPendaftar.npm}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">IPK</label>
                  <p className="font-medium">{selectedPendaftar.ipk}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">SKS Diambil</label>
                  <p className="font-medium">{selectedPendaftar.sks}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Motivasi</label>
                <p className="mt-1 text-sm">{selectedPendaftar.motivasi}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
