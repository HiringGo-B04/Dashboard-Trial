"use client"
import { backend_link } from "@/utils";
import { ifError } from "assert";
import Cookies from "js-cookie"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "./card";
import mitt from "next/dist/shared/lib/mitt";

export interface User {
    userId: string;
    username: string;
    password: string | null;
    role: "STUDENT" | "LECTURER" | "ADMIN" | string;
    nip: string | null;
    nim: string | null;
    fullName: string | null;
}


export default function DashboardAdmin() {
    const [allUser, setAllUser] = useState<User[]>()
    const [totalOfLecture, setTotalOfLecture] = useState(0)
    const [totalOfStudent, setTotalOfStudent] = useState(0)
    const [totalOfCourse, setTotalOfCourse] = useState(0)
    const [totalOfVacan, setTotalOfVacan] = useState(0)

    const router = useRouter()
    async function logout() {
        const token = Cookies.get("token")
        const response = await fetch(`${backend_link}/api/auth/user/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ token: token })
        }).then(response => response.json());

        if (response.status == "accept") {
            Cookies.remove('token');
            alert("Success to logout")
            router.push("/auth/login")
        }
    }

    async function getAllUser() {
        const token = Cookies.get("token");
        const response = await fetch(`${backend_link}/api/account/admin/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }).then(response => response.json());

        if (response.status && response.status == "accept") {
            setAllUser(response.users)
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
                <button onClick={e => logout()}>Logout</button>
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