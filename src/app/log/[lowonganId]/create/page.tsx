"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, FormEvent } from "react"
import { createLog, kategoriOptions, LogDTO } from "../../controller"

export default function CreateLog() {
    const router = useRouter()
    const params = useParams()

    const lowonganId = params.lowonganId
    if (!lowonganId || Array.isArray(lowonganId)) {
        throw new Error("lowonganId tidak valid.")
    }

    const [judul, setJudul] = useState("")
    const [keterangan, setKeterangan] = useState("")
    const [kategori, setKategori] = useState("ASISTENSI")
    const [tanggalLog, setTanggalLog] = useState(new Date().toISOString().split('T')[0])
    const [waktuMulai, setWaktuMulai] = useState("")
    const [waktuSelesai, setWaktuSelesai] = useState("")
    const [pesanUntukDosen, setPesanUntukDosen] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        // Validasi
        if (!judul || !keterangan || !tanggalLog || !waktuMulai || !waktuSelesai) {
            alert("Mohon lengkapi semua field yang wajib diisi")
            return
        }

        if (waktuSelesai <= waktuMulai) {
            alert("Waktu selesai harus setelah waktu mulai")
            return
        }

        if (new Date(tanggalLog) > new Date()) {
            alert("Tanggal log tidak boleh di masa depan")
            return
        }

        const logData: LogDTO = {
            judul,
            keterangan,
            kategori,
            tanggalLog,
            waktuMulai: `${waktuMulai}:00`,
            waktuSelesai: `${waktuSelesai}:00`,
            pesanUntukDosen: pesanUntukDosen || undefined,
            idLowongan: lowonganId,
        }

        try {
            setLoading(true)
            await createLog(logData)
            alert("Log berhasil dibuat")
            router.push(`/log/${params.lowonganId}`)
        } catch (err) {
            alert(err instanceof Error ? err.message : "Gagal membuat log")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Tambah Log</h1>
            
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
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-blue-100 text-blue-800 hover:bg-blue-200"
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
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? "Menyimpan..." : "Simpan"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                    >
                        Batal
                    </button>
                </div>
            </form>
        </div>
    )
}