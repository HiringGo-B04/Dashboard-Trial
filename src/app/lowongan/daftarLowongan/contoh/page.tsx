"use client"
import { useState } from "react"
import type React from "react"

import Link from "next/link"
import { ArrowLeft, CheckCircle, AlertCircle, Info } from "lucide-react"

export default function LowonganDetail() {
  const [ipk, setIpk] = useState("")
  const [sks, setSks] = useState("")
  const [motivasi, setMotivasi] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Validate inputs
    if (Number.parseFloat(ipk) < 2.5) {
      setError("IPK minimum untuk mendaftar adalah 2.5")
      setIsSubmitting(false)
      return
    }

    if (Number.parseInt(sks) < 80) {
      setError("SKS minimum untuk mendaftar adalah 80")
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      console.log({ ipk, sks, motivasi })
      setIsSubmitting(false)
      setSubmitted(true)
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10">
      <Link
        href="/lowongan/listLowongan"
        className="inline-flex items-center text-primary hover:text-secondary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Daftar Lowongan
      </Link>

      {submitted ? (
        <div className="bg-white dark:bg-muted rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Pendaftaran Berhasil!</h2>
          <p className="text-muted-foreground mb-6">
            Lamaran Anda untuk posisi asisten mata kuliah Pemrograman Paralel telah berhasil dikirim. Tim kami akan
            meninjau lamaran Anda dan menghubungi Anda jika diperlukan.
          </p>
          <Link href="/lowongan/listLowongan">
            <button className="px-5 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors">
              Kembali ke Daftar Lowongan
            </button>
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 mb-8 text-white shadow-lg">
            <h1 className="text-2xl font-bold">Daftar Lowongan Asisten</h1>
            <p className="text-primary-foreground mt-2">CSCE604229 - Pemrograman Paralel</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-800 rounded-md p-4 mb-6 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div className="bg-white dark:bg-muted rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-border">Informasi Lowongan</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Mata Kuliah</h3>
                <p className="text-base">CSCE604229 - Pemrograman Paralel</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Nama Asisten</h3>
                <p className="text-base">John Doe (john.doe)</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Jumlah Lowongan</h3>
                <p className="text-base">2 asisten</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Deadline Pendaftaran</h3>
                <p className="text-base">31 Mei 2025, 23:59 WIB</p>
              </div>
            </div>

            <div className="bg-accent bg-opacity-10 rounded-md p-4 mb-6">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-accent-foreground mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-accent-foreground mb-1">Nilai Mata Kuliah Prasyarat Pelamar</h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      CSCM601213 - Kalkulus 2 - Tahun 2023 Term 2 → <span className="font-semibold">A</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      CSCM602055 - Sistem Operasi - Tahun 2024 Term 1 → <span className="font-semibold">A-</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      CSGE601021 - Dasar-Dasar Pemrograman 2 - Tahun 2023 Term 2 →{" "}
                      <span className="font-semibold">A</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-muted rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-border">Formulir Pendaftaran</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">IPK</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    required
                    className="w-full px-4 py-2 rounded-md border border-input focus:border-primary focus:ring-2 focus:ring-accent"
                    value={ipk}
                    onChange={(e) => setIpk(e.target.value)}
                    placeholder="Contoh: 3.75"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Minimal IPK 2.5</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">SKS Diambil</label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2 rounded-md border border-input focus:border-primary focus:ring-2 focus:ring-accent"
                    value={sks}
                    onChange={(e) => setSks(e.target.value)}
                    placeholder="Contoh: 120"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Minimal SKS 80</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Motivasi Mendaftar</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 rounded-md border border-input focus:border-primary focus:ring-2 focus:ring-accent"
                  value={motivasi}
                  onChange={(e) => setMotivasi(e.target.value)}
                  placeholder="Jelaskan motivasi Anda mendaftar sebagai asisten mata kuliah ini..."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-white rounded-md hover:bg-secondary transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Pendaftaran"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
