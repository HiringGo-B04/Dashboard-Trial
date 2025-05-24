"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createLamaran } from "../../controller"

export default function FormDaftarLowongan() {
  const router = useRouter()
  const params = useParams()
  const idLowongan = params.id as string

  const [sks, setSks] = useState<number>(0)
  const [ipk, setIpk] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    console.log(idLowongan)

    try {
      await createLamaran({ sks, ipk, idLowongan })
      alert("Pendaftaran berhasil!")
      router.push("/lowongan/list") // Redirect ke daftar lowongan
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Daftar Lowongan</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Jumlah SKS</label>
          <input
            type="number"
            value={sks}
            onChange={(e) => setSks(Number(e.target.value))}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">IPK</label>
          <input
            type="number"
            step="0.01"
            max="4.00"
            value={ipk}
            onChange={(e) => setIpk(Number(e.target.value))}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Mengirim..." : "Daftar"}
        </button>
      </form>
    </div>
  )
}
