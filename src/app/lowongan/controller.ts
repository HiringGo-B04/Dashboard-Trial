import Cookies from "js-cookie"
import { backend_link } from "@/utils"
import { jwtDecode } from "jwt-decode"


interface JwtPayload {
    userId: string;
    exp?: number;
    iat?: number;
}

export interface LamaranDTO {
    sks: number
    ipk: number
    idLowongan: string
    idMahasiswa: string
}

export async function createLamaran(lamaranInput: Omit<LamaranDTO, "idMahasiswa">) {
    const token = Cookies.get("token")
    if (!token) throw new Error("Token tidak ditemukan. Kamu harus login.")

    const decoded = jwtDecode<JwtPayload>(token);
    const userId = decoded.userId

    const lamaranDTO: LamaranDTO = {
        ...lamaranInput,
        idMahasiswa: userId,
    }

    const res = await fetch(`${backend_link}api/lamaran/student/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(lamaranDTO),
    })

    if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Gagal mendaftar (${res.status}): ${errorText}`)
    }

    return res.json()
}

export async function fetchLowongan(): Promise<any> {
    const token = Cookies.get("token")

    if (!token) {
        throw new Error("Kamu belum login")
    }

    const res = await fetch(`${backend_link}api/lowongan/user/get`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!res.ok) {
        const errorText = await res.text()
        console.error("Status:", res.status)
        console.error("Response Body:", errorText)
        throw new Error(`Gagal fetch lowongan (${res.status}): ${errorText}`)
    }

    return res.json()
}

export async function fetchLamaranUser() {
  const token = Cookies.get("token")
  const res = await fetch(`${backend_link}api/lamaran/user/all`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) {
    throw new Error("Gagal fetch lamaran user")
  }

  return res.json()
}