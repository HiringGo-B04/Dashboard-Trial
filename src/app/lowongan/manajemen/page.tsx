"use client"
import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Users, Eye } from "lucide-react"
import { lowonganController, type Lowongan } from "./controller"
import { useRouter } from "next/navigation"

export default function ManajemenLowongan() {
  const [lowongan, setLowongan] = useState<Lowongan[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter();


  // Fetch data from API using controller
  useEffect(() => {
    const fetchLowongan = async () => {
      setLoading(true)
      const result = await lowonganController.getAllLowongan()

      if (result.error) {
        setError(result.error)
      } else if (result.data) {
        setLowongan(result.data)
        setError(null)
      }

      setLoading(false)
    }

    fetchLowongan()
  }, [])

  const filteredLowongan = lowongan.filter(
    (item) =>
      item.matkul.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus lowongan ini?")) {
      const result = await lowonganController.deleteLowongan(id)

      if (result.error) {
        alert(`Gagal menghapus lowongan: ${result.error}`)
      } else {
        setLowongan((prev) => prev.filter((item) => item.id !== id))
        alert(result.data || 'Lowongan berhasil dihapus')
      }
    }
  }

  const handleUpdate = async (lowongan: Lowongan) => {
    const result = await lowonganController.updateLowongan(lowongan)

    if (result.error) {
      alert(`Gagal mengupdate lowongan: ${result.error}`)
      return false
    } else {
      // Refresh data after successful update
      const refreshResult = await lowonganController.getAllLowongan()
      if (refreshResult.data) {
        setLowongan(refreshResult.data)
      }
      alert('Lowongan berhasil diupdate')
      return true
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data lowongan...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-center">
            <p className="text-red-600 font-medium">Error memuat data</p>
            <p className="text-red-500 text-sm mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    )
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
            placeholder="Cari kode mata kuliah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <button
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
          onClick={() => router.push('/lowongan/manajemen/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Buat Lowongan Baru
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kode Mata Kuliah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tahun
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dibutuhkan
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Terdaftar
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diterima
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
                    <div className="font-medium text-gray-900 dark:text-white">{item.matkul}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.tahun}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.term}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                    {item.totalAsdosNeeded}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                    {item.totalAsdosRegistered}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                    {item.totalAsdosAccepted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                        <Users className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-yellow-600 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
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

        {filteredLowongan.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm ? 'Tidak ada lowongan yang sesuai dengan pencarian' : 'Tidak ada lowongan yang ditemukan'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}