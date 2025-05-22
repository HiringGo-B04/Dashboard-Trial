"use client"
import { backend_link, decodeJWT } from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "./components/card";
import { User } from "../../../interface";
import Cookies from "js-cookie"
import { adminGetAllUsers, logout } from "../../../controller";


export default function DashboardAdmin() {
    const [allUser, setAllUser] = useState<User[]>()
    const [totalOfLecture, setTotalOfLecture] = useState(0)
    const [totalOfStudent, setTotalOfStudent] = useState(0)
    const [totalOfCourse, setTotalOfCourse] = useState(0)
    const [totalOfVacan, setTotalOfVacan] = useState(0)

    const router = useRouter()

    async function getAllUser() {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/auth/login")
            return
        }

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
    }

    useEffect(() => {
        getAllUser()
    }, [router])

    return (
        <div className="flex flex-col gap-10 p-10">
            <div className="flex flex-row gap-10">
                <button onClick={e => logout(router)}>Logout</button>
                <a href="/dashboard/admin/register-admin">Create Admin</a>
                <a href="/dashboard/admin/register-lecturer">Create Lecturer</a>
            </div>
            <div className="flex flex-row gap-10">
                <div>Number of Student: {totalOfStudent}</div>
                <div>Number of Lecture: {totalOfLecture}</div>
                <div>Number of Course: {totalOfCourse}</div>
                <div>Number of Vacancy: {totalOfVacan}</div>
            </div>
            <div className="flex flex-wrap gap-3">
                {
                    allUser?.map(item => (
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
                    ))
                }
            </div>
        </div>
    )
}