"use client"

import { getMessageOnInput } from "@/utils"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { adminRegisAdmin } from "@/app/auth/controller"

export default function Register() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const router = useRouter()

    async function register(e: FormEvent) {
        e.preventDefault()

        const token = Cookies.get("token");
        if (!token) {
            router.push("/auth/login")
            return;
        }

        const response = await adminRegisAdmin(token, username, password);

        if (response.status === "accept") {
            alert(response.messages)
        }
        else {
            getMessageOnInput(response.message, response.messages)
        }
    }

    return (
        <div className="flex flex-col p-10 gap-3">
            <h1>Register</h1>
            <form onSubmit={register} className="flex flex-col gap-2">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" className="border border-1" value={username} onChange={e => setUsername(e.target.value)} />

                <label htmlFor="password">Password</label>
                <input type="password" id="password" className="border border-1" value={password} onChange={e => setPassword(e.target.value)} />

                <button type="submit">Submit</button>

            </form>
            <a href="/dashboard/admin">Back</a>
        </div>
    )
}
