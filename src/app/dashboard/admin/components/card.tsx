import { adminDeleteUser, adminUpdateUser } from "@/app/dashboard/admin/controller";
import { decodeJWT, getMessageOnInput } from "@/utils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Card({ userId, username, role, fullName, nim, nip, trigger }: { userId: string, username: string, role: string, fullName: string, nim: string, nip: string, trigger: () => void }) {
    const choiceOfRole = ["STUDENT", "LECTURER", "ADMIN"]
    const [defaultRole, setDefaultRole] = useState(role);
    const [nextRole, setNextRole] = useState(role);
    const [inputAdmin, setInputAdmin] = useState(false)

    const [name, setName] = useState("")
    const [number, setNumber] = useState("")

    const [adminUsername, setAdminUsername] = useState("")

    const router = useRouter()

    async function deleteUser() {
        const data = confirm("Are you sure to delete this user?")
        if (!data)
            return

        const token = Cookies.get("token");
        if (!token) {
            router.push("/auth/login")
            return
        }
        const response = await adminDeleteUser(token, username);

        if (response.status === "accept") {
            alert(response.message)
            trigger()
        }
        else {
            getMessageOnInput(response.message, response.messages)
        }
    }

    async function requestUpdate(currentRole: string) {
        const data = confirm("Are you sure to update this user?")
        if (!data)
            return

        const token = Cookies.get("token");

        const requestBody: any = {
            role: currentRole,
            username: username,
        };

        if (currentRole !== "ADMIN") {
            requestBody.fullName = name;
            requestBody.nip = currentRole === "LECTURER" ? number : null;
            requestBody.nim = currentRole === "STUDENT" ? number : null;
        }

        if (!token) {
            router.push("/auth/login")
            return
        }

        const response = await adminUpdateUser(token, requestBody)
        if (response.status === "accept") {
            alert(response.message)
            setInputAdmin(false)
            setDefaultRole(currentRole)
            trigger()
        }
        else {
            getMessageOnInput(response.message, response.messages)
        }
    }

    function updateRole(currentRole: string) {
        if (currentRole !== "ADMIN") {
            setInputAdmin(true)
            setNextRole(currentRole)
        }
        else {
            requestUpdate(currentRole)
        }
    }

    useEffect(() => {
        const token = Cookies.get("token")
        if (token) {
            const admin = decodeJWT(token).payload.sub
            setAdminUsername(admin);
        }
        else {
            router.push("/auth/login")
        }
    }, [router])

    return (
        <div>
            <div className={`${inputAdmin ? '' : 'hidden'} border border-1 rounded-xl p-5 flex flex-col `}>
                <label htmlFor="nim">NIP/NIM</label>
                <input type="text" id="number" className="border border-1" value={number} onChange={e => setNumber(e.target.value)} />

                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" className="border border-1" value={name} onChange={e => setName(e.target.value)} />

                <button onClick={e => setInputAdmin(false)}>Cancel</button>
                <button onClick={e => requestUpdate(nextRole)} type="submit">Submit</button>
            </div>
            <div id={userId} className={` ${inputAdmin ? 'hidden' : ''} border border-1 rounded-xl p-5 flex flex-col gap-2`}>
                <div className={`flex flex-row gap-2 ${adminUsername == username ? 'hidden' : ''}`}>
                    <div>
                        <p>Change Role</p>
                        <select
                            value={defaultRole}
                            onChange={(e) => updateRole(e.target.value)}
                            className="p-2 bg-white rounded-xl text-black text-bold text-sm">
                            {
                                choiceOfRole.map(item => (
                                    <option key={item} value={item}>{item}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div>
                        <p>Delete User</p>
                        <button className="p-2 bg-white rounded-xl text-black text-bold text-sm" onClick={e => deleteUser()}>Delete</button>
                    </div>
                </div>
                <div>
                    <h1>Username: {username}</h1>
                    <p>Role: {defaultRole}</p>
                    {
                        role == "ADMIN" ?
                            "" :
                            <p>Full Name: {fullName}</p>
                    }
                </div>
            </div>
        </div >
    )
}