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
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-400 border-t-transparent mx-auto"></div>
                    <p className="mt-6 text-lg text-teal-100 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-red-900 bg-opacity-80 border-2 border-red-600 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-red-200">Error Loading Data</h3>
                                <p className="text-red-300 mt-1">{error}</p>
                                <button
                                    onClick={() => fetchDashboardData()}
                                    className="mt-2 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                                >
                                    Coba Lagi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-teal-600 rounded-2xl p-8 mb-8 text-white shadow-2xl border border-blue-600 border-opacity-30">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 text-white">Dashboard Mahasiswa</h1>
                            <p className="text-blue-100 text-lg opacity-90">
                                Kelola lamaran dan log aktivitas asisten dosen Anda
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                                <svg className="h-16 w-16 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600 border-opacity-50 p-6 mb-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Aksi Cepat
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button 
                            onClick={() => logout(router)}
                            className="flex items-center justify-center px-4 py-3 bg-red-600 bg-opacity-80 text-red-100 rounded-xl hover:bg-red-500 transition-all duration-200 border border-red-500"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                        <button
                            onClick={() => router.push("/lowongan/list")}
                            className="flex items-center justify-center px-4 py-3 bg-blue-600 bg-opacity-80 text-blue-100 rounded-xl hover:bg-blue-500 transition-all duration-200 border border-blue-500"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                            </svg>
                            Daftar Lowongan
                        </button>
                        <button
                            onClick={() => router.push("/honor")}
                            className="flex items-center justify-center px-4 py-3 bg-purple-600 bg-opacity-80 text-purple-100 rounded-xl hover:bg-purple-500 transition-all duration-200 border border-purple-500"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            Lihat Honor
                        </button>
                        {stats.daftarLowonganDiterima.length > 0 && (
                            <button
                                onClick={() => router.push(`/log/${stats.daftarLowonganDiterima[0].id}`)}
                                className="flex items-center justify-center px-4 py-3 bg-green-600 bg-opacity-80 text-green-100 rounded-xl hover:bg-green-500 transition-all duration-200 border border-green-500"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Manajemen Log
                            </button>
                        )}
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg border border-blue-500 border-opacity-30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Lowongan Terbuka</p>
                                <p className="text-3xl font-bold">{stats.jumlahLowonganTerbuka}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                <svg className="h-8 w-8 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg border border-green-500 border-opacity-30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Lamaran Diterima</p>
                                <p className="text-3xl font-bold">{stats.jumlahLamaranDiterima}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                <svg className="h-8 w-8 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl p-6 text-white shadow-lg border border-yellow-500 border-opacity-30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-100 text-sm font-medium">Lamaran Menunggu</p>
                                <p className="text-3xl font-bold">{stats.jumlahLamaranMenunggu}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                <svg className="h-8 w-8 text-yellow-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white shadow-lg border border-red-500 border-opacity-30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100 text-sm font-medium">Lamaran Ditolak</p>
                                <p className="text-3xl font-bold">{stats.jumlahLamaranDitolak}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                <svg className="h-8 w-8 text-red-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Honor & Log Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 text-white shadow-lg border border-teal-500 border-opacity-30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-teal-100 text-sm font-medium">Total Jam Log</p>
                                <p className="text-3xl font-bold">{stats.totalJamLog.toFixed(1)} jam</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                <svg className="h-8 w-8 text-teal-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-lg border border-purple-500 border-opacity-30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Total Insentif</p>
                                <p className="text-3xl font-bold">Rp {stats.totalInsentif.toLocaleString('id-ID')}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                <svg className="h-8 w-8 text-purple-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Daftar Lowongan Diterima */}
                <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600 border-opacity-50 p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <svg className="w-7 h-7 mr-3 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Daftar Seluruh Lowongan Yang Diterima
                    </h2>

                    {stats.daftarLowonganDiterima.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-slate-700 bg-opacity-60 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                <svg className="h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Belum Ada Lowongan Diterima</h3>
                            <p className="text-slate-300">Mulai dengan mendaftar lowongan asisten dosen yang tersedia.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                {/* Debug Info (can be removed in production) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 bg-slate-800 bg-opacity-60 rounded-xl p-4">
                        <h3 className="font-bold text-white">Debug Info:</h3>
                        <p className="text-slate-300">Current User ID: {currentUserId}</p>
                        <p className="text-slate-300">Total Lowongan Diterima: {stats.daftarLowonganDiterima.length}</p>
                        <details>
                            <summary className="text-slate-300 cursor-pointer">Raw Stats Data</summary>
                            <pre className="text-xs mt-2 text-slate-400">{JSON.stringify(stats, null, 2)}</pre>
                        </details>
                    </div>
                )}
            </div>
        </div>
    );
}

// Component Card untuk Lowongan
function LowonganCard({ lowonganId, matkul, tahun, term }: {
    lowonganId: string,
    matkul: string,
    tahun: number,
    term: string
}) {
    return (
        <div className="bg-slate-700 bg-opacity-60 rounded-xl p-6 border border-slate-600 hover:bg-slate-600 hover:bg-opacity-60 transition-all duration-200">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">{matkul}</h3>
                <div className="space-y-1">
                    <p className="text-slate-300 text-sm">Tahun: {tahun}</p>
                    <p className="text-slate-300 text-sm">Semester: {term}</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-800 bg-opacity-80 text-green-200 border border-green-600">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Diterima
                    </span>
                </div>
            </div>
            <div>
                <a href={`/log/${lowonganId}`}>
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-500 hover:to-blue-500 transition-all duration-200 border border-teal-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Kelola Log
                    </button>
                </a>
            </div>
        </div>
    );
}
