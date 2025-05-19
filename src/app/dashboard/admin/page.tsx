"use client"
import { backend_link } from "@/utils";
import Cookies from "js-cookie"
import { useRouter } from "next/navigation";

export default function DashboardAdmin() {
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

    return (
        <div>
            <button onClick={e => logout()}>Logout</button>
        </div>
    )
}