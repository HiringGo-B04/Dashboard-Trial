"use client"

import { backend_link, decodeJWT } from "@/utils"
import { FormEvent, useState } from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const router = useRouter()

    async function login(e: FormEvent) {
        e.preventDefault()

        const response = await fetch(`${backend_link}/api/auth/public/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        }).then(response => response.json());

        if (response.status === "accept" && response.token) {
            Cookies.set('token', response.token);

            const dataToken = decodeJWT(response.token)
            alert("Success to Login")
            if (dataToken.payload.role == "ADMIN") {
                router.push("/dashboard/admin")
            }
            else if (dataToken.payload.role == "LECTURER") {
                router.push("/dashboard/lecturer")
            }
            else {
                router.push("/dashboard/student")
            }
        }
        else {
            if (response.message.startsWith("Validation failed"))
                alert("Input must not be blank")
            else {
                alert(response.message)
            }
        }
    }

    return (
        <div className="flex flex-col p-10 gap-3">
            <h1>Login</h1>
            <form onSubmit={login} className="flex flex-col gap-2">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" className="border border-1" value={username} onChange={e => setUsername(e.target.value)} />

                <label htmlFor="password">Password</label>
                <input type="password" id="password" className="border border-1" value={password} onChange={e => setPassword(e.target.value)} />

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
