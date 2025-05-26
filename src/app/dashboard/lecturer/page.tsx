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

    async function getValue() {
        const token = await Cookies.get("token");
        if (!token) {
            router.push("/auth/login")
            return;
        }

        const response = await dosenGetAllData(token);

        if (response.message && response.message == "Success") {
            setTotalOfCourse(response.course)
            setTotalOfAsisstant(response.assistant)
            setTotalEnrolVacancy(response.vacan)
        }
    }

    useEffect(() => {
        getValue()
    }, [router])

    return (
        <div>
            <div className="container mx-auto p-6">
                <LogNavigation />
            </div>
            <div>
                <div className="flex flex-col gap-10 p-10">
                    <div className="flex flex-row gap-10">
                        <button onClick={e => logout(router)}>Logout</button>
                    </div>
                    <div className="flex flex-row gap-10">
                        <div>Total of Course: {totalOfCourse}</div>
                        <div>Number of Teaching Assitant: {totalOfAssitant}</div>
                        <div>Number of Remaining Vacancy: {totalOfEnrolVacancy}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}