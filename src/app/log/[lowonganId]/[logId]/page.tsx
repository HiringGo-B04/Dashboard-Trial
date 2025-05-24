"use client"

import { useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { getLogById, updateLog, kategoriOptions, LogDTO } from "../../controller"

export default function EditLog({ 
    params 
}: { 
    params: { lowonganId: string; logId: string } 
}) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isEditable, setIsEditable] = useState(false)
    
    // Form state
    const [judul, setJudul] = useState("")
    const [keterangan, setKeterangan] = useState("")
    const [kategori, setKategori] = useState("")
    const [tanggalLog, setTanggalLog] = useState("")
    const [waktuMulai, setWaktuMulai] = useState("")
    const [waktuSelesai, setWaktuSelesai] = useState("")
    const [pesanUntukDosen, setPesanUntukDosen] = useState("")
    const [status, setStatus] = useState("")

    useEffect(() => {
        fetchLog()
    }, [params.logId])

    const fetchLog = async () => {
        try {
            setLoading(true)
            const log = await getLogById(params.logId)
            
            // Populate form with existing data
            setJudul(log.judul)
            setKeterangan(log.keterangan)
            setKategori(log.kategori)
            setTanggalLog(log.tanggalLog)
            setWaktuMulai(log.waktuMulai.substring(0, 5)) // Remove seconds
            setWaktuSelesai(log.waktuSelesai.substring(0, 5)) // Remove seconds
            setPesanUntukDosen(log.pesanUntukDosen || "")
            setStatus(log.status)
            
            // Only editable if status is MENUNGGU
            setIsEditable(log.status === "MENUNGGU")
        } catch (err) {
            alert(err instanceof Error ? err.message : "Gagal memuat log")
            router.back()
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        
        if (!isEditable) {
            alert("Log ini tidak dapat diubah karena sudah diverifikasi")
            return
        }

        if (!judul || !keterangan || !tanggalLog || !waktuMulai || !waktuSelesai) {
            alert("Mohon lengkapi semua field yang wajib diisi")
            return
        }

        // Validate waktu
        if (waktuSelesai <= waktuMulai) {
            alert("Waktu selesai harus setelah waktu mulai")
            return
        }

        // Validate tanggal tidak di masa depan
        if (new Date(tanggalLog) > new Date()) {
            alert("Tanggal log tidak boleh di masa depan")
            return
        }
        
        const lowonganId = await params.lowonganId
        const logData: LogDTO = {
            judul,
            keterangan,
            kategori,
            tanggalLog,
            waktuMulai: `${waktuMulai}:00`, // Add seconds
            waktuSelesai: `${waktuSelesai}:00`, // Add seconds
            pesanUntukDosen: pesanUntukDosen || undefined,
            idLowongan: params.lowonganId
        }

        try {
            setSaving(true)
            await updateLog(params.logId, logData)
            alert("Log berhasil diperbarui")
            router.push(`/log/${params.lowonganId}`)
        } catch (err) {
            alert(err instanceof Error ? err.message : "Gagal memperbarui log")
        } finally {
            setSaving(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "DITERIMA":
                return <span className="px-3 py-1 bg-green-100 text-green-800 rounded">Diterima</span>
            case "DITOLAK":
                return <span className="px-3 py-1 bg-red-100 text-red-800 rounded">Ditolak</span>
            case "MENUNGGU":
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded">Menunggu Verifikasi</span>
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded">{status}</span>
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    {isEditable ? "Ubah Log" : "Detail Log"}
                </h1>
                <div>
                    Status: {getStatusBadge(status)}
                </div>
            </div>
            
            {!isEditable && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
                    Log ini tidak dapat diubah karena sudah diverifikasi oleh dosen.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="judul" className="block font-medium mb-1">
                        Judul <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="judul"
                        value={judul}
                        onChange={(e) => setJudul(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        placeholder="Masukkan judul log"
                        disabled={!isEditable}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="kategori" className="block font-medium mb-1">
                        Kategori log: <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="kategori"
                        value={kategori}
                        onChange={(e) => setKategori(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        disabled={!isEditable}
                        required
                    >
                        {kategoriOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="keterangan" className="block font-medium mb-1">
                        Deskripsi: <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="keterangan"
                        value={keterangan}
                        onChange={(e) => setKeterangan(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        rows={4}
                        placeholder="Masukkan deskripsi kegiatan"
                        disabled={!isEditable}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="tanggal" className="block font-medium mb-1">
                        Tanggal: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="tanggal"
                        value={tanggalLog}
                        onChange={(e) => setTanggalLog(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        disabled={!isEditable}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="waktuMulai" className="block font-medium mb-1">
                            Waktu mulai: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="time"
                            id="waktuMulai"
                            value={waktuMulai}
                            onChange={(e) => setWaktuMulai(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            disabled={!isEditable}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="waktuSelesai" className="block font-medium mb-1">
                            Waktu selesai: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="time"
                            id="waktuSelesai"
                            value={waktuSelesai}
                            onChange={(e) => setWaktuSelesai(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            disabled={!isEditable}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="pesan" className="block font-medium mb-1">
                        Pesan untuk dosen (opsional):
                    </label>
                    <textarea
                        id="pesan"
                        value={pesanUntukDosen}
                        onChange={(e) => setPesanUntukDosen(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        rows={3}
                        placeholder="Pesan tambahan untuk dosen (opsional)"
                        disabled={!isEditable}
                    />
                </div>

                <div className="flex gap-4">
                    {isEditable && (
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {saving ? "Menyimpan..." : "Simpan"}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                    >
                        Kembali
                    </button>
                </div>
            </form>
        </div>
    )
}