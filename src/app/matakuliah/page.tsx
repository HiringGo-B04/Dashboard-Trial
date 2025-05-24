"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getAllMataKuliah, deleteMataKuliah } from "./controller";
import { logout } from "../auth/controller";

export default function MataKuliahManagement() {
    const [mataKuliah, setMataKuliah] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const router = useRouter();

    async function fetchMataKuliah() {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        try {
            const response = await getAllMataKuliah(token);
            if (response && Array.isArray(response)) {
                setMataKuliah(response);
            } else if (response && response.status === "error") {
                alert(response.message || "Gagal memuat data mata kuliah");
            } else {
                alert("Gagal memuat data mata kuliah");
            }
        } catch (error) {
            alert("Error: " + error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(kode: string) {
        const confirmed = confirm(`Apakah Anda yakin ingin menghapus mata kuliah ${kode}?`);
        if (!confirmed) return;

        const token = Cookies.get("token");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        try {
            const response = await deleteMataKuliah(token, kode);
            if (response && response.status === "error") {
                alert(response.message || "Gagal menghapus mata kuliah");
            } else {
                alert("Mata kuliah berhasil dihapus");
                fetchMataKuliah();
            }
        } catch (error) {
            alert("Gagal menghapus mata kuliah: " + error);
        }
    }

    useEffect(() => {
        fetchMataKuliah();
    }, [router]);

    const filteredMataKuliah = mataKuliah.filter(mk =>
        mk.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mk.kode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="p-10">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex flex-row gap-10 mb-6">
                <button onClick={e => logout(router)}>Logout</button>
                <a href="/dashboard/admin">Back to Dashboard</a>
            </div>

            <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 mb-8 text-white shadow-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Manajemen Mata Kuliah</h1>
                        <p className="text-primary-foreground mt-2">Kelola data mata kuliah dan dosen pengampu</p>
                    </div>
                    <a href="/mata-kuliah/create">
                        <button className="bg-white text-primary px-4 py-2 rounded-lg hover:bg-opacity-90">
                            Tambah Mata Kuliah
                        </button>
                    </a>
                </div>
            </div>

            <div className="bg-white dark:bg-muted rounded-lg shadow-md p-6 mb-8">
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Cari mata kuliah (nama atau kode)..."
                        className="w-full px-4 py-2 rounded-md border border-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                Kode
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                Nama Mata Kuliah
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                SKS
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                Dosen Pengampu
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                Aksi
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-background divide-y divide-border">
                        {filteredMataKuliah.length > 0 ? (
                            filteredMataKuliah.map((mk) => (
                                <tr key={mk.kode} className="hover:bg-accent hover:bg-opacity-10">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                        {mk.kode}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        {mk.nama}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        {mk.sks}
                                    </td>
                                    <td className="px-4 py-4 text-sm">
                                        {mk.dosenPengampu && mk.dosenPengampu.length > 0
                                            ? `${mk.dosenPengampu.length} dosen`
                                            : "Belum ada dosen"
                                        }
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        <div className="flex gap-2">
                                            <a href={`/mata-kuliah/detail/${mk.kode}`}>
                                                <button className="px-3 py-1 bg-blue-500 text-white rounded text-xs">
                                                    Detail
                                                </button>
                                            </a>
                                            <a href={`/mata-kuliah/edit/${mk.kode}`}>
                                                <button className="px-3 py-1 bg-green-500 text-white rounded text-xs">
                                                    Edit
                                                </button>
                                            </a>
                                            <button
                                                onClick={() => handleDelete(mk.kode)}
                                                className="px-3 py-1 bg-red-500 text-white rounded text-xs"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                    {searchTerm ? "Tidak ada mata kuliah yang sesuai pencarian" : "Belum ada mata kuliah"}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 text-sm text-muted-foreground">
                    Total: {filteredMataKuliah.length} mata kuliah
                </div>
            </div>
        </div>
    );
}