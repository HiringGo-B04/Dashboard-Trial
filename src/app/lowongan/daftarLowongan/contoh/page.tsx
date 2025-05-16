"use client";
import React, { useState } from "react";

export default function LowonganDetail() {
  const [ipk, setIpk] = useState("");
  const [sks, setSks] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ ipk, sks });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-10">
      <h1 className="text-2xl font-bold mb-6">Daftar Lowongan</h1>

      <div className="space-y-4 text-sm sm:text-base">
        <div>
          <strong>Mata Kuliah:</strong>{" "}
          <span>CSCE604229 - Pemrograman Paralel</span>
        </div>
        <div>
          <strong>Nama Asisten:</strong>{" "}
          <span>John Doe (john.doe)</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label className="block font-semibold mb-1">IPK:</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="4"
              required
              className="w-full px-3 py-2 border rounded"
              value={ipk}
              onChange={(e) => setIpk(e.target.value)}
              placeholder="Contoh: 3.75"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">SKS Diambil:</label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 border rounded"
              value={sks}
              onChange={(e) => setSks(e.target.value)}
              placeholder="Contoh: 120"
            />
          </div>

          <div>
            <strong>Nilai Mata Kuliah Prasyarat Pelamar:</strong>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>CSCM601213 - Kalkulus 2 - Tahun 2023 Term 2 → <strong>A</strong></li>
              <li>CSCM602055 - Sistem Operasi - Tahun 2024 Term 1 → <strong>A-</strong></li>
              <li>CSGE601021 - Dasar-Dasar Pemrograman 2 - Tahun 2023 Term 2 → <strong>A</strong></li>
            </ul>
          </div>

          <div>
            <strong>Syarat Tambahan:</strong> <span>-</span>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Daftar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
