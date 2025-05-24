"use client"

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getMataKuliahByKode, updateMataKuliah } from "../../controller";
import { adminGetAllUsers } from "../../../dashboard/admin/controller";
import { logout } from "../../../auth/controller";

export default function EditMataKuliah({ params }: { params: { kode: string } }) {
    const [kode, setKode] = useState("");
    const [nama, setNama] = useState("");
    const [sks, setSks] = useState(1);
    const [deskripsi, setDeskripsi] = useState("");
    const [selectedDosen, setSelectedDosen] = useState<string[]>([]);
    const [availableDosen, setAvailableDosen] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingDosen, setLoadingDosen] = useState(true);
    const [loadingData, setLoadingData] = useState(true);

    const router = useRouter();

    async function fetchMataKuliah() {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        try {
            const response = await getMataKuliahByKode(token, params.kode);
            if (response && response.kode) {
                setKode(response.kode);
                setNama(response.nama);
                setSks(response.sks || 1);
                setDeskripsi(response.deskripsi || "");
                setSelectedDosen(response.dosenPengampu || []);
            } else {
                alert("Mata kuliah tidak ditemukan");
                router.push("/mata-kuliah");
            }
        } catch (error) {
            alert("Error: " + error);
            router.push("/mata-kuliah");
        } finally {
            setLoadingData(false);
        }
    }

    async function fetchDosen() {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        try {
            const response = await adminGetAllUsers(token);
            if (response && response.status === "accept" && response.users) {
                // Filter hanya dosen (LECTURER)
                const dosenList = response.users.filter((user: any) => user.role === "LECTURER");
                setAvailableDosen(dosenList);
            } else {
                alert("Gagal memuat data dosen");
            }
        } catch (error) {
            alert("Error: " + error);
        } finally {
            setLoadingDosen(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const token = Cookies.get("token");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        // Validasi
        if (!nama.trim()) {
            alert("Nama mata kuliah harus diisi");
            setLoading(false);
            return;
        }

        if (sks < 1 || sks > 10) {
            alert("SKS harus antara 1-10");
            setLoading(false);
            return;
        }

        const data = {
            kode: kode,
            nama: nama.trim(),
            sks: sks,
            deskripsi: deskripsi.trim(),
            dosenPengampu: selectedDosen
        };

        try {
            const response = await updateMataKuliah(token, params.kode, data);
            if (response && response.status === "error") {
                alert(response.message || "Gagal mengupdate mata kuliah");
            } else {
                alert("Mata kuliah berhasil diupdate");
                router.push("/mata-kuliah");
            }
        } catch (error) {
            alert("Gagal mengupdate mata kuliah: " + error);
        } finally {
            setLoading(false);
        }
    }

    function handleDosenChange(userId: string, checked: boolean) {
        if (checked) {
            setSelectedDosen([...selectedDosen, userId]);
        } else {
            setSelectedDosen(selectedDosen.filter(id => id !== userId));
        }
    }

    useEffect(() => {
        fetchMataKuliah();
        fetchDosen();
    }, [router, params.kode]);

    if (loadingData) {
        return <div className="p-10">Loading mata kuliah...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex flex-row gap-10 mb-6">
                <button onClick={e => logout(router)}>Logout</button>
                <a href="/mata-kuliah">Back to Mata Kuliah</a>
            </div>

            <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 mb-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold">Edit Mata Kuliah</h1>
                <p className="text-primary-foreground mt-2">Update data mata kuliah dan dosen pengampu</p>
            </div>

            <div className="bg-white dark:bg-muted rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="kode" className="block text-sm font-medium mb-2">
                                Kode Mata Kuliah *
                            </label>
                            <input
                                type="text"
                                id="kode"
                                required
                                maxLength={10}
                                className="w-full px-4 py-2 rounded-md border border-input bg-gray-100"
                                value={kode}
                                disabled
                                placeholder="Kode tidak dapat diubah"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Kode mata kuliah tidak dapat diubah</p>
                        </div>

                        <div>
                            <label htmlFor="sks" className="block text-sm font-medium mb-2">
                                SKS *
                            </label>
                            <input
                                type="number"
                                id="sks"
                                required
                                min={1}
                                max={10}
                                className="w-full px-4 py-2 rounded-md border border-input"
                                value={sks || 1}
                                onChange={(e) => setSks(parseInt(e.target.value) || 1)}
                            />
                            <p className="text-xs text-muted-foreground mt-1">Antara 1-10 SKS</p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="nama" className="block text-sm font-medium mb-2">
                            Nama Mata Kuliah *
                        </label>
                        <input
                            type="text"
                            id="nama"
                            required
                            className="w-full px-4 py-2 rounded-md border border-input"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            placeholder="Contoh: Algoritma dan Struktur Data"
                        />
                    </div>

                    <div>
                        <label htmlFor="deskripsi" className="block text-sm font-medium mb-2">
                            Deskripsi
                        </label>
                        <textarea
                            id="deskripsi"
                            rows={4}
                            className="w-full px-4 py-2 rounded-md border border-input"
                            value={deskripsi}
                            onChange={(e) => setDeskripsi(e.target.value)}
                            placeholder="Deskripsi mata kuliah (opsional)"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Dosen Pengampu
                        </label>
                        {loadingDosen ? (
                            <p>Loading dosen...</p>
                        ) : availableDosen.length === 0 ? (
                            <p className="text-muted-foreground">Belum ada dosen yang tersedia</p>
                        ) : (
                            <div className="space-y-2 max-h-40 overflow-y-auto border border-input rounded-md p-4">
                                {availableDosen.map((dosen) => (
                                    <label key={dosen.userId} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedDosen.includes(dosen.userId)}
                                            onChange={(e) => handleDosenChange(dosen.userId, e.target.checked)}
                                            className="rounded"
                                        />
                                        <span className="text-sm">
                                            {dosen.fullName} ({dosen.username})
                                            {dosen.nip && <span className="text-muted-foreground"> - {dosen.nip}</span>}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            Pilih dosen yang akan mengampu mata kuliah ini
                        </p>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50"
                        >
                            {loading ? "Menyimpan..." : "Update"}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/mata-kuliah")}
                            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}