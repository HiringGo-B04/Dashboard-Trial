"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { logout } from "@/app/auth/controller";
import { decodeJWT } from "@/utils";
import { getAllLowongan, getAllLamaran, getHonorData, LowonganData, LamaranData, HonorData } from "./controller";

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

            console.log("Fetching data for user:", userId);

            // Fetch all data with proper error handling
            const [lowonganData, lamaranData] = await Promise.allSettled([
                getAllLowongan(),
                getAllLamaran()
            ]);

            // Process lowongan data
            let lowongans: LowonganData[] = [];
            if (lowonganData.status === 'fulfilled') {
                lowongans = lowonganData.value;
                console.log("Lowongan data fetched:", lowongans.length, "items");
            } else {
                console.error("Failed to fetch lowongan:", lowonganData.reason);
                // Continue with empty array
            }

            // Process lamaran data
            let lamarans: LamaranData[] = [];
            if (lamaranData.status === 'fulfilled') {
                lamarans = lamaranData.value;
                console.log("Lamaran data fetched:", lamarans.length, "items");
            } else {
                console.error("Failed to fetch lamaran:", lamaranData.reason);
                // Continue with empty array
            }

            // Filter lamaran for current user
            const userLamaran = lamarans.filter(lamaran =>
                lamaran.idMahasiswa === userId
            );

            console.log("User lamaran:", userLamaran.length, "items");

            // Calculate basic stats
            const lowonganTerbuka = lowongans.filter(lowongan =>
                lowongan.totalAsdosAccepted < lowongan.totalAsdosNeeded
            ).length;

            const lamaranDiterima = userLamaran.filter(lamaran =>
                lamaran.status === "DITERIMA"
            ).length;

            const lamaranDitolak = userLamaran.filter(lamaran =>
                lamaran.status === "DITOLAK"
            ).length;

            const lamaranMenunggu = userLamaran.filter(lamaran =>
                lamaran.status === "MENUNGGU"
            ).length;

            // Get accepted lowongan details
            const acceptedLamaranIds = userLamaran
                .filter(lamaran => lamaran.status === "DITERIMA")
                .map(lamaran => lamaran.idLowongan);

            const daftarLowonganDiterima = lowongans
                .filter(lowongan => acceptedLamaranIds.includes(lowongan.id))
                .map(lowongan => ({
                    id: lowongan.id,
                    matkul: lowongan.matkul,
                    tahun: lowongan.tahun,
                    term: lowongan.term
                }));

            console.log("Accepted lowongan:", daftarLowonganDiterima.length, "items");

            // Calculate total honor for ALL accepted lowongan
            let totalHonor = 0;
            let totalJam = 0;

            if (daftarLowonganDiterima.length > 0) {
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth() + 1;

                console.log("Calculating honor for", currentMonth, "/", currentYear);

                // Calculate honor for ALL lowongan, not just the first one
                const honorPromises = daftarLowonganDiterima.map(async (lowongan) => {
                    try {
                        console.log("Fetching honor for", lowongan.matkul, lowongan.id);
                        const honorData = await getHonorData(
                            lowongan.id,
                            currentYear,
                            currentMonth
                        );
                        console.log("Honor data for", lowongan.matkul, ":", honorData.honor);
                        return honorData;
                    } catch (honorError) {
                        console.log(`Could not fetch honor data for ${lowongan.matkul}:`, honorError);
                        // Return zero honor instead of throwing
                        return {
                            bulan: currentMonth,
                            tahun: currentYear,
                            lowonganId: lowongan.id,
                            honor: 0,
                            formattedHonor: "Rp 0"
                        } as HonorData;
                    }
                });

                const honorResults = await Promise.all(honorPromises);

                // Sum up all honor
                totalHonor = honorResults.reduce((sum, honorData) => sum + honorData.honor, 0);
                totalJam = Math.round((totalHonor / 27500) * 100) / 100; // Round to 2 decimal places

                console.log("Total honor calculated:", totalHonor);
                console.log("Total jam calculated:", totalJam);
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
            setError(error instanceof Error ? error.message : "Gagal memuat data dashboard. Silakan refresh halaman.");
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
                <button
                    onClick={() => router.push("/lowongan/list")}
                    className="text-blue-500 hover:text-blue-700 underline"
                >
                    Daftar Lowongan
                </button>
                <button
                    onClick={() => router.push("/honor")}
                    className="text-purple-500 hover:text-purple-700 underline"
                >
                    Lihat Honor
                </button>
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
                    <button
                        onClick={() => router.push("/lowongan/list")}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Mendaftar Lowongan
                    </button>
                    {stats.daftarLowonganDiterima.length > 0 && (
                        <button
                            onClick={() => router.push(`/log/${stats.daftarLowonganDiterima[0].id}`)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Manajemen Log
                        </button>
                    )}
                    <button
                        onClick={() => router.push("/honor")}
                        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                    >
                        Dashboard Honor
                    </button>
                </div>
            </div>

            {/* Debug Info (can be removed in production) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-8 p-4 bg-gray-100 rounded">
                    <h3 className="font-bold">Debug Info:</h3>
                    <p>Current User ID: {currentUserId}</p>
                    <p>Total Lowongan Diterima: {stats.daftarLowonganDiterima.length}</p>
                    <details>
                        <summary>Raw Stats Data</summary>
                        <pre className="text-xs mt-2">{JSON.stringify(stats, null, 2)}</pre>
                    </details>
                </div>
            )}
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