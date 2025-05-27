"use client"

import { decodeJWT, getMessageOnInput } from "@/utils"
import { FormEvent, useState } from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { userLogin } from "../controller"

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    async function login(e: FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await userLogin(username, password);

            if (response.status === "accept" && response.token) {
                Cookies.set('token', response.token);
                const dataToken = decodeJWT(response.token)

                alert("Success to Login")
                router.push(`/dashboard/${dataToken.payload.role.toLowerCase()}`)
            }
            else {
                getMessageOnInput(response.message, response.messages)
            }
        } catch (error) {
            console.error("Login error:", error)
            alert("Terjadi kesalahan saat login")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-2xl">
                        <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2">Selamat Datang</h2>
                    <p className="text-teal-200 text-lg">Masuk ke akun Anda untuk melanjutkan</p>
                </div>

                {/* Login Form */}
                <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600 border-opacity-50 p-8">
                    <form onSubmit={login} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-teal-200 mb-3">
                                Username
                            </label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    id="username" 
                                    value={username} 
                                    onChange={e => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 pl-10 border-2 border-slate-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-slate-700 text-white font-medium placeholder-slate-400"
                                    placeholder="Masukkan username Anda"
                                    required
                                />
                                <svg className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-teal-200 mb-3">
                                Password
                            </label>
                            <div className="relative">
                                <input 
                                    type="password" 
                                    id="password" 
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 pl-10 border-2 border-slate-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-slate-700 text-white font-medium placeholder-slate-400"
                                    placeholder="Masukkan password Anda"
                                    required
                                />
                                <svg className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Masuk...
                                </>
                            ) : (
                                <>
                                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Masuk
                                </>
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-slate-300">
                            Belum punya akun?{' '}
                            <a href="/auth/register" className="font-medium text-teal-400 hover:text-teal-300 transition-colors duration-200">
                                Daftar sekarang
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
