"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { logout } from "@/app/auth/controller";
import { decodeJWT } from "@/utils";
import { getAllLowongan, getAllLamaran, getHonorData, LowonganData, LamaranData } from "./controller";

interface DashboardStats {
    jumlahLowonganTerbuka: number;
    jumlahLamaranDiterima: number;
    jumlahLamaranDitolak: number;
    jumlahLamaranMenunggu: number;
    totalJamLog: number;
    totalInsentif: number;
    daftarLowonganDiterima: Array<{
        id: string;
        matkul: string;
        tahun: number;
        term: string;
    }>;
}

export default function DashboardStudent() {
    const [stats, setStats] = useState<DashboardStats>({
        jumlahLowonganTerbuka: 0,
        jumlahLamaranDiterima: 0,
        jumlahLamaranDitolak: 0,
        jumlahLamaranMenunggu: 0,
        totalJamLog: 0,
        totalInsentif: 0,
        daftarLowonganDiterima: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string>("");

    const router = useRouter();

    async function fetchDashboardData() {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Get current user ID from token
            const decoded = decodeJWT(token);
            const userId = decoded.payload.userId;
            setCurrentUserId(userId);

            // Fetch all data with proper error handling
            const [lowonganData, lamaranData] = await Promise.all([
                getAllLowongan().catch(err => {
                    console.error("Failed to fetch lowongan:", err);
                    return []; // Return empty array as fallback
                }),
                getAllLamaran().catch(err => {
                    console.error("Failed to fetch lamaran:", err);
                    return []; // Return empty array as fallback
                })
            ]);

            // Filter lamaran for current user
            const userLamaran = lamaranData.filter(lamaran => lamaran.idMahasiswa === userId);

            // Calculate stats
            const lowonganTerbuka = lowonganData.filter(lowongan =>
                lowongan.totalAsdosAccepted < lowongan.totalAsdosNeeded
            ).length;

            const lamaranDiterima = userLamaran.filter(lamaran => lamaran.status === "DITERIMA").length;
            const lamaranDitolak = userLamaran.filter(lamaran => lamaran.status === "DITOLAK").length;
            const lamaranMenunggu = userLamaran.filter(lamaran => lamaran.status === "MENUNGGU").length;

            // Get accepted lowongan details
            const acceptedLamaranIds = userLamaran
                .filter(lamaran => lamaran.status === "DITERIMA")
                .map(lamaran => lamaran.idLowongan);

            const daftarLowonganDiterima = lowonganData
                .filter(lowongan => acceptedLamaranIds.includes(lowongan.id))
                .map(lowongan => ({
                    id: lowongan.id,
                    matkul: lowongan.matkul,
                    tahun: lowongan.tahun,
                    term: lowongan.term
                }));

            // Calculate total honor for ALL accepted lowongan (FIX: not just first one)
            let totalHonor = 0;
            let totalJam = 0;

            if (daftarLowonganDiterima.length > 0) {
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth() + 1;

                // Calculate honor for ALL lowongan, not just the first one
                for (const lowongan of daftarLowonganDiterima) {
                    try {
                        const honorData = await getHonorData(
                            lowongan.id,
                            currentYear,
                            currentMonth
                        );
                        totalHonor += honorData.honor || 0;
                        totalJam += (honorData.honor || 0) / 27500;
                    } catch (honorError) {
                        console.log(`Could not fetch honor data for ${lowongan.matkul}:`, honorError);
                        // Continue to next lowongan instead of breaking
                    }
                }
            }

            setStats({
                jumlahLowonganTerbuka: lowonganTerbuka,
                jumlahLamaranDiterima: lamaranDiterima,
                jumlahLamaranDitolak: lamaranDitolak,
                jumlahLamaranMenunggu: lamaranMenunggu,
                totalJamLog: totalJam,
                totalInsentif: totalHonor,
                daftarLowonganDiterima: daftarLowonganDiterima
            });

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setError("Gagal memuat data dashboard. Silakan refresh halaman.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboardData();
    }, [router]);

    if (loading) {
        return (
            <div className="flex flex-col gap-10 p-10">
                <div className="text-center">Loading dashboard...</div>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col gap-10 p-10">
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                    <p className="font-semibold">Error:</p>
                    <p>{error}</p>
                    <button
                        onClick={() => fetchDashboardData()}
                        className="mt-2 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10 p-10">
            {/* Navigation & Actions */}
            <div className="flex flex-row gap-10">
                <button onClick={() => logout(router)}>Logout</button>
                <a href="/lowongan/list">Daftar Lowongan</a>
            </div>

            {/* Statistics - Sesuai dengan requirement PDF */}
            <div className="flex flex-wrap gap-10">
                <div>Lowongan Terbuka: {stats.jumlahLowonganTerbuka}</div>
                <div>Lamaran Diterima: {stats.jumlahLamaranDiterima}</div>
                <div>Lamaran Ditolak: {stats.jumlahLamaranDitolak}</div>
                <div>Lamaran Menunggu: {stats.jumlahLamaranMenunggu}</div>
            </div>

            <div className="flex flex-wrap gap-10">
                <div>Total Jam Log: {stats.totalJamLog.toFixed(1)} jam</div>
                <div>Total Insentif: Rp {stats.totalInsentif.toLocaleString('id-ID')}</div>
            </div>

            {/* Daftar Lowongan Diterima - Sesuai requirement PDF */}
            <div>
                <h2 className="text-xl font-bold mb-4">Daftar Seluruh Lowongan Yang Diterima:</h2>

                {stats.daftarLowonganDiterima.length === 0 ? (
                    <div className="text-gray-500">Belum ada lowongan yang diterima</div>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {stats.daftarLowonganDiterima.map(lowongan => (
                            <LowonganCard
                                key={lowongan.id}
                                lowonganId={lowongan.id}
                                matkul={lowongan.matkul}
                                tahun={lowongan.tahun}
                                term={lowongan.term}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Link untuk mengakses fitur mahasiswa lainnya - Sesuai requirement PDF */}
            <div>
                <h2 className="text-xl font-bold mb-4">Akses Fitur Mahasiswa:</h2>
                <div className="flex flex-wrap gap-4">
                    <a href="/lowongan/listLowongan" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Mendaftar Lowongan
                    </a>
                    {stats.daftarLowonganDiterima.length > 0 && (
                        <a href={`/log/${stats.daftarLowonganDiterima[0].id}`} className="bg-green-500 text-white px-4 py-2 rounded">
                            Manajemen Log
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

// Component Card untuk Lowongan - Tetap simple sesuai style existing
function LowonganCard({ lowonganId, matkul, tahun, term }: {
    lowonganId: string,
    matkul: string,
    tahun: number,
    term: string
}) {
    return (
        <div className="border border-1 rounded-xl p-5 flex flex-col gap-2">
            <div>
                <h1>Mata Kuliah: {matkul}</h1>
                <p>Tahun: {tahun}</p>
                <p>Semester: {term}</p>
                <p>Status: Diterima</p>
            </div>
            <div>
                <a href={`/log/${lowonganId}`}>
                    <button className="p-2 bg-white rounded-xl text-black text-bold text-sm border">
                        Kelola Log
                    </button>
                </a>
            </div>
        </div>
    );
}