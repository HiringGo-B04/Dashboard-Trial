"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { dosenGetAllData, lowonganGetAll } from "../controller"
import { LowonganInterface } from "../interface"
import { it } from "node:test"
import { decodeJWT } from "@/utils"
import { idText } from "typescript"


export default function Lowongan() {

    const router = useRouter()
    const [lowongan, setLowongan] = useState<LowonganInterface[]>([]);
    const [userId, setUserId] = useState("")

    async function getAllLowongan() {
        const token = await Cookies.get("token");
        if (!token) {
            router.push("/auth/login")
            return;
        }

        const response = await lowonganGetAll(token)
        setLowongan(response)

        const id = decodeJWT(token)
        setUserId(id.payload.userId)
    }

    useEffect(() => {
        getAllLowongan()
    }, [router])

    return (
        <div className="flex flex-col justify-center w-full p-5 gap-10">
            <p className="w-full flex justify-center text-lg">Daftar Lowongan</p>
            <div className="flex flex-wrap gap-4">
                {
                    lowongan.length == 0 ? "Belum ada lowongan"
                        :
                        lowongan.map(item => (
                            <div key={item.id} className="p-4 border border-1 rounded-md flex flex-col gap-2 w-fit">
                                <p>Kode Matkul: {item.matkul}</p>
                                <p>Tahun: {item.tahun}</p>
                                <p>Semester: {item.term}</p>
                                <p>Total dibutuhkan asdos: {item.totalAsdosNeeded}</p>
                                <p>Asdos yang terpilih: {item.totalAsdosAccepted}</p>
                                <p>Total pelamar: {item.totalAsdosRegistered}</p>
                                {
                                    userId == item.idDosen ?
                                        <button className="w-full bg-white p-2 rounded-xl text-black">Detail</button>
                                        : ""
                                }
                            </div>
                        ))

                }
            </div>
        </div>
    )
}