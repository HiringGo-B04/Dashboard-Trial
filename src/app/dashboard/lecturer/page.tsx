"use client"

import { logout } from "@/app/auth/controller";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardDosen() {
    const router = useRouter()

    const [totalOfCourse, setTotalOfCourse] = useState(0);
    const [totalOfAssitant, setTotalOfAssistant] = useState(0);
    const [totalOfEnrolVacancy, setTotalOfVacancy] = useState(0);

    useEffect(() => {
        

    }, [router])

    return (
        <div>
            <div className="flex flex-col gap-10 p-10">
                <div className="flex flex-row gap-10">
                    <button onClick={e => logout(router)}>Logout</button>
                    <a href="/dashboard/admin/register-admin">Create Admin</a>
                    <a href="/dashboard/admin/register-lecturer">Create Lecturer</a>
                </div>
                <div className="flex flex-row gap-10">
                    <div>Total of Course: {totalOfCourse}</div>
                    <div>Number of Teaching Assitant: {totalOfAssitant}</div>
                    <div>Number of Remaining Vacancy: {totalOfEnrolVacancy}</div>
                </div>
            </div>
        </div>
    )
}