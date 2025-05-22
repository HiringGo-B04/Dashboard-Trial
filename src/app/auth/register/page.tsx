"use client"

import { getMessageOnInput } from "@/utils"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { studentRegis } from "../controller"

export default function Register() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [nim, setNim] = useState("")
    const [name, setName] = useState("")

    const router = useRouter()

    async function register(e: FormEvent) {
        e.preventDefault()
        const response = await studentRegis(username, password, nim, name);

        if (response.status === "accept") {
            alert(response.messages)
            router.push("/auth/login")
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

                <label htmlFor="nim">NIM</label>
                <input type="text" id="nim" className="border border-1" value={nim} onChange={e => setNim(e.target.value)} />

                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" className="border border-1" value={name} onChange={e => setName(e.target.value)} />

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
