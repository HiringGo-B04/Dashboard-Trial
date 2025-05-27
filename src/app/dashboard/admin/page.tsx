"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "./components/card";
import { User } from "../../../interface";
import Cookies from "js-cookie"
import { adminGetAllUsers } from "@/app/dashboard/admin/controller";
import { logout } from "@/app/auth/controller"

export default function DashboardAdmin() {
    const [allUser, setAllUser] = useState<User[]>()
    const [totalOfLecture, setTotalOfLecture] = useState(0)
    const [totalOfStudent, setTotalOfStudent] = useState(0)
    const [totalOfCourse, setTotalOfCourse] = useState(0)
    const [totalOfVacan, setTotalOfVacan] = useState(0)
    const [loading, setLoading] = useState(true)

    const router = useRouter()

    async function getAllUser() {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/auth/login")
            return
        }

        try {
            setLoading(true)
            const response = await adminGetAllUsers(token);

            if (response.status && response.status == "accept") {
                setAllUser(response.users)
                setTotalOfCourse(response.numberOfCourses)
                setTotalOfLecture(response.numberOfLectures)
                setTotalOfVacan(response.numberOfVacancies)
                setTotalOfStudent(response.numberOfStudents)
            }
            else {
                if (response.message)
                    alert(response.message)
                if (response.messages)
                    alert(response.messages)
            }
        } catch (error) {
            console.error("Error fetching users:", error)
            alert("Terjadi kesalahan saat memuat data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllUser()
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
                            <h1 className="text-4xl font-bold mb-2 text-white">Dashboard Admin</h1>
                            <p className="text-blue-100 text-lg opacity-90">
                                Kelola pengguna dan sistem asisten dosen
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                                <svg className="h-16 w-16 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation & Actions */}
                <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600 border-opacity-50 p-6 mb-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                        Aksi Cepat
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button 
                            onClick={e => logout(router)}
                            className="flex items-center justify-center px-4 py-3 bg-red-600 bg-opacity-80 text-red-100 rounded-xl hover:bg-red-500 transition-all duration-200 border border-red-500"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                        <a 
                            href="/dashboard/admin/register-admin"
                            className="flex items-center justify-center px-4 py-3 bg-blue-600 bg-opacity-80 text-blue-100 rounded-xl hover:bg-blue-500 transition-all duration-200 border border-blue-500"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Buat Admin
                        </a>
                        <a 
                            href="/dashboard/admin/register-lecturer"
                            className="flex items-center justify-center px-4 py-3 bg-green-600 bg-opacity-80 text-green-100 rounded-xl hover:bg-green-500 transition-all duration-200 border border-green-500"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Buat Dosen
                        </a>
                        <a 
                            href="/matakuliah"
                            className="flex items-center justify-center px-4 py-3 bg-purple-600 bg-opacity-80 text-purple-100 rounded-xl hover:bg-purple-500 transition-all duration-200 border border-purple-500"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Kelola Mata Kuliah
                        </a>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg border border-blue-500 border-opacity-30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Total Mahasiswa</p>
                                <p className="text-3xl font-bold">{totalOfStudent}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                <svg className="h-8 w-8 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg border border-green-500 border-opacity-30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Total Dosen</p>
                                <p className="text-3xl font-bold">{totalOfLecture}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                <svg className="h-8 w-8 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-lg border border-purple-500 border-opacity-30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Total Mata Kuliah</p>
                                <p className="text-3xl font-bold">{totalOfCourse}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                <svg className="h-8 w-8 text-purple-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 text-white shadow-lg border border-teal-500 border-opacity-30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-teal-100 text-sm font-medium">Total Lowongan</p>
                                <p className="text-3xl font-bold">{totalOfVacan}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                <svg className="h-8 w-8 text-teal-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Management */}
                <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600 border-opacity-50 p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <svg className="w-7 h-7 mr-3 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        Manajemen Pengguna
                    </h2>
                    
                    {allUser && allUser.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allUser.map(item => (
                                <Card
                                    key={item.userId}
                                    userId={item.userId}
                                    fullName={item.fullName ?? ""}
                                    username={item.username}
                                    role={item.role}
                                    nim={item.nim ?? ""}
                                    nip={item.nip ?? ""}
                                    trigger={getAllUser}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="bg-slate-700 bg-opacity-60 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                <svg className="h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Tidak Ada Pengguna</h3>
                            <p className="text-slate-300">Belum ada pengguna yang terdaftar dalam sistem.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
