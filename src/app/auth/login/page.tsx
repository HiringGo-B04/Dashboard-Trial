"use client"

import { backend_link, decodeJWT, getMessageOnInput } from "@/utils"
import { FormEvent, useState } from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { userLogin } from "@/controller"

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const router = useRouter()

    async function login(e: FormEvent) {
        e.preventDefault()

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
