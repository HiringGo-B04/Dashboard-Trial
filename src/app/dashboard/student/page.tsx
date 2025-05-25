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

            // Get current user ID from token
            const decoded = decodeJWT(token);
            const userId = decoded.payload.userId;
            setCurrentUserId(userId);

            // Fetch all data
            const [lowonganData, lamaranData] = await Promise.all([
                getAllLowongan(),
                getAllLamaran()
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

            // Calculate total honor for current month
            let totalHonor = 0;
            let totalJam = 0;

            if (daftarLowonganDiterima.length > 0) {
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth() + 1;

                try {
                    const honorData = await getHonorData(
                        daftarLowonganDiterima[0].id,
                        currentYear,
                        currentMonth
                    );
                    totalHonor = honorData.honor || 0;
                    totalJam = totalHonor / 27500;
                } catch (honorError) {
                    console.log("Could not fetch honor data:", honorError);
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
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboardData();
    }, [router]);

    if (loading) {
        return <div className="flex flex-col gap-10 p-10">Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-10 p-10">
            {/* Navigation & Actions - Same as Admin */}
            <div className="flex flex-row gap-10">
                <button onClick={() => logout(router)}>Logout</button>
                <a href="/lowongan/listLowongan">Daftar Lowongan</a>
            </div>

            {/* Statistics - Same style as Admin */}
            <div className="flex flex-row gap-10">
                <div>Lowongan Terbuka: {stats.jumlahLowonganTerbuka}</div>
                <div>Lamaran Diterima: {stats.jumlahLamaranDiterima}</div>
                <div>Lamaran Ditolak: {stats.jumlahLamaranDitolak}</div>
                <div>Lamaran Menunggu: {stats.jumlahLamaranMenunggu}</div>
            </div>

            <div className="flex flex-row gap-10">
                <div>Total Jam Log: {stats.totalJamLog.toFixed(1)}</div>
                <div>Total Insentif: Rp {stats.totalInsentif.toLocaleString('id-ID')}</div>
            </div>

            {/* Accepted Lowongan Cards - Same style as Admin user cards */}
            <div className="flex flex-wrap gap-3">
                {
                    stats.daftarLowonganDiterima.map(lowongan => (
                        <LowonganCard
                            key={lowongan.id}
                            lowonganId={lowongan.id}
                            matkul={lowongan.matkul}
                            tahun={lowongan.tahun}
                            term={lowongan.term}
                        />
                    ))
                }
            </div>

            {stats.daftarLowonganDiterima.length === 0 && (
                <div>Belum ada lowongan yang diterima</div>
            )}
        </div>
    );
}

// Component Card untuk Lowongan - Style seperti Card Admin
function LowonganCard({ lowonganId, matkul, tahun, term }: { lowonganId: string, matkul: string, tahun: number, term: string }) {
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
                    <button className="p-2 bg-white rounded-xl text-black text-bold text-sm">
                        Kelola Log
                    </button>
                </a>
            </div>
        </div>
    );
}