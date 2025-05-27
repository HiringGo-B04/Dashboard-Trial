"use client"

import { logout } from "@/app/auth/controller";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import LogNavigation from "./components/LogNavigation";
import { dosenGetAllData } from "./controller";

export default function DashboardDosen() {
    const router = useRouter()
    const [totalOfCourse, setTotalOfCourse] = useState(0);
    const [totalOfAssitant, setTotalOfAsisstant] = useState(0);
    const [totalOfEnrolVacancy, setTotalEnrolVacancy] = useState(0);
    const [loading, setLoading] = useState(true);

    async function getValue() {
        const token = await Cookies.get("token");
        if (!token) {
            router.push("/auth/login")
            return;
        }

        try {
            setLoading(true);
            const response = await dosenGetAllData(token);

            if (response.message && response.message == "Success") {
                setTotalOfCourse(response.course)
                setTotalOfAsisstant(response.assistant)
                setTotalEnrolVacancy(response.vacan)
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Terjadi kesalahan saat memuat data");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getValue()
    }, [router])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-400 border-t-transparent mx-auto"></div>
                    <p className="mt-6 text-lg text-teal-100 font-medium">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-teal-600 rounded-2xl p-8 mb-8 text-white shadow-2xl border border-blue-600 border-opacity-30">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 text-white">Dashboard Dosen</h1>
                            <p className="text-blue-100 text-lg opacity-90">
                                Kelola mata kuliah dan asisten dosen Anda
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                                <svg className="h-16 w-16 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Log Navigation */}
                <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600 border-opacity-50 p-6 mb-8">
                    <LogNavigation />
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg border border-blue-500 border-opacity-30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Total Mata Kuliah</p>
                                <p className="text-3xl font-bold">{totalOfCourse}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                <svg className="h-8 w-8 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg border border-green-500 border-opacity-30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Asisten Dosen</p>
                                <p className="text-3xl font-bold">{totalOfAssitant}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                <svg className="h-8 w-8 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 text-white shadow-lg border border-teal-500 border-opacity-30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-teal-100 text-sm font-medium">Lowongan Tersisa</p>
                                <p className="text-3xl font-bold">{totalOfEnrolVacancy}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                <svg className="h-8 w-8 text-teal-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600 border-opacity-50 p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <svg className="w-7 h-7 mr-3 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Aksi Cepat
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <button 
                            onClick={e => logout(router)}
                            className="flex items-center justify-center px-6 py-4 bg-red-600 bg-opacity-80 text-red-100 rounded-xl hover:bg-red-500 transition-all duration-200 border border-red-500 transform hover:scale-105"
                        >
                            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>

                        <a 
                            href="/lowongan/manajemen"
                            className="flex items-center justify-center px-6 py-4 bg-blue-600 bg-opacity-80 text-blue-100 rounded-xl hover:bg-blue-500 transition-all duration-200 border border-blue-500 transform hover:scale-105"
                        >
                            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                            </svg>
                            Kelola Lowongan
                        </a>

                        <a 
                            href="/dashboard/lecturer/log"
                            className="flex items-center justify-center px-6 py-4 bg-green-600 bg-opacity-80 text-green-100 rounded-xl hover:bg-green-500 transition-all duration-200 border border-green-500 transform hover:scale-105"
                        >
                            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Periksa Log
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
