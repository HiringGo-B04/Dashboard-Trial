"use client";
import React from "react";
import Link from "next/link";

const lowonganList = [
  {
    id: 1,
    kode: "CSCE604229 - 01.00.12.01-2020",
    nama: "Pemrograman Paralel",
    prodi: "Ilmu Komputer",
    semester: "Genap 2024/2025",
    dosen: "ari.w, heru",
    statusLowongan: "Buka",
    jumlahLowongan: "2 asisten",
    jumlahPelamar: "2 mahasiswa",
    jumlahDiterima: "1 mahasiswa",
    statusLamaran: "-",
    url: "contoh",
  },
  // Tambahkan item lainnya di sini
];

export default function ListLowongan() {
  return (
    <div className="p-6 sm:p-10">
      <h1 className="text-2xl font-bold mb-6">Daftar Lowongan Asisten</h1>
      <h2 className="text-1xl font-bold mb-6">Genap 2024/2025</h2>
      <div className="overflow-x-auto">
        <table className="min-w-[1200px] w-full table-auto border border-gray-300 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="border px-4 py-2">No</th>
              <th className="border px-4 py-2">Mata Kuliah / Nama Lowongan</th>
              <th className="border px-4 py-2">Prodi</th>
              <th className="border px-4 py-2">Semester</th>
              <th className="border px-4 py-2">Dosen Pembuka</th>
              <th className="border px-4 py-2">Status Lowongan</th>
              <th className="border px-4 py-2">Jumlah Lowongan</th>
              <th className="border px-4 py-2">Jumlah Pelamar</th>
              <th className="border px-4 py-2">Pelamar Diterima</th>
              <th className="border px-4 py-2">Status Lamaran</th>
              <th className="border px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {lowonganList.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">
                  <strong>{item.kode}</strong>
                  <br />
                  {item.nama}
                </td>
                <td className="border px-4 py-2">{item.prodi}</td>
                <td className="border px-4 py-2">{item.semester}</td>
                <td className="border px-4 py-2">{item.dosen}</td>
                <td className="border px-4 py-2">{item.statusLowongan}</td>
                <td className="border px-4 py-2">{item.jumlahLowongan}</td>
                <td className="border px-4 py-2">{item.jumlahPelamar}</td>
                <td className="border px-4 py-2">{item.jumlahDiterima}</td>
                <td className="border px-4 py-2">{item.statusLamaran}</td>
                <td className="border px-4 py-2">
                  <Link href={`/lowongan/daftarLowongan/${item.url}`}>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">
                      Daftar
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
