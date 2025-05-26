"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import Cookies from "js-cookie";
import { getMataKuliahByKode } from "../../controller";
import { logout } from "../../../auth/controller";

export default function DetailMataKuliah({ params }: { params: Promise<{ kode: string }> }) {
    const [mataKuliah, setMataKuliah] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const resolvedParams = use(params);

    async function fetchMataKuliah() {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        try {
            const response = await getMataKuliahByKode(token, resolvedParams.kode);
            if (response && response.kode) {
                setMataKuliah(response);
            } else {
                alert("Mata kuliah tidak ditemukan");
                router.push("/matakuliah");
            }
        } catch (error) {
            alert("Error: " + error);
            router.push("/matakuliah");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMataKuliah();
    }, [router, resolvedParams.kode]);

    if (loading) {
        return <div className="p-10">Loading...</div>;
    }

    if (!mataKuliah) {
        return <div className="p-10">Mata kuliah tidak ditemukan</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex flex-row gap-10 mb-6">
                <button onClick={e => logout(router)}>Logout</button>
                <a href="/matakuliah">Back to Mata Kuliah</a>
            </div>

            <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 mb-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold">Detail Mata Kuliah</h1>
                <p className="text-primary-foreground mt-2">{mataKuliah.kode} - {mataKuliah.nama}</p>
            </div>

            <div className="bg-white dark:bg-muted rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-border">Informasi Mata Kuliah</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Kode Mata Kuliah</h3>
                        <p className="text-base font-semibold">{mataKuliah.kode}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">SKS</h3>
                        <p className="text-base">{mataKuliah.sks} SKS</p>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Nama Mata Kuliah</h3>
                    <p className="text-base font-semibold">{mataKuliah.nama}</p>
                </div>

                {mataKuliah.deskripsi && (
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Deskripsi</h3>
                        <p className="text-base text-justify">{mataKuliah.deskripsi}</p>
                    </div>
                )}

                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Dosen Pengampu</h3>
                    {mataKuliah.dosenPengampu && mataKuliah.dosenPengampu.length > 0 ? (
                        <div className="space-y-2">
                            {mataKuliah.dosenPengampu.map((dosenId: string, index: number) => (
                                <div key={dosenId} className="flex items-center p-3 bg-accent bg-opacity-10 rounded-md">
                                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Dosen ID: {dosenId}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground bg-muted bg-opacity-30 rounded-md">
                            <p>Belum ada dosen pengampu yang ditugaskan</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-muted rounded-lg shadow-md p-6">
                <div className="flex gap-4">
                    <a href={`/matakuliah/edit/${mataKuliah.kode}`}>
                        <button className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                            Edit Mata Kuliah
                        </button>
                    </a>
                    <button
                        onClick={() => router.push("/matakuliah")}
                        className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        </div>
    );
}