"use client"

import { backend_link } from "@/utils"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export default function Register() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [nip, setNip] = useState("")
    const [name, setName] = useState("")

    const router = useRouter()

    async function register(e: FormEvent) {
        e.preventDefault()
        const token = Cookies.get("token")
        const response = await fetch(`${backend_link}/api/auth/admin/signup/lecturer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                username: username,
                password: password,
                nip: nip,
                fullName: name
            })
        }).then(response => response.json());

        if (response.status === "accept") {
            alert(response.messages)
        }
        else {
            if (response.message && response.message.startsWith("Validation failed"))
                alert("Input must not be blank")
            if (response.messages && response.messages.startsWith("Validation failed"))
                alert("Input must not be blank")
            else {
                if (response.messages)
                    alert(response.messages)
                if (response.message)
                    alert(response.message)

            }
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

                <label htmlFor="nim">NIP</label>
                <input type="text" id="nim" className="border border-1" value={nip} onChange={e => setNip(e.target.value)} />

                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" className="border border-1" value={name} onChange={e => setName(e.target.value)} />

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
