// controllers/lowonganController.ts
import Cookies from 'js-cookie' 
import { backend_link } from "@/utils"

export interface Lowongan {
  id: string
  matkul: string
  tahun: number
  term: "Ganjil" | "Genap"
  totalAsdosNeeded: number
  totalAsdosRegistered: number
  totalAsdosAccepted: number
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}

class LowonganController {
  private baseUrl = `${backend_link}/api/lowongan`

  private getAuthHeaders() {
    const token = Cookies.get("token")
    if (!token) {
      throw new Error("Kamu belum login")
    }
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  async getAllLowongan(): Promise<ApiResponse<Lowongan[]>> {
    try {
      const res = await fetch(`${this.baseUrl}/user/lowongan`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      })
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error("Status:", res.status)
        console.error("Response Body:", errorText)
        throw new Error(`Gagal fetch lowongan (${res.status}): ${errorText}`)
      }
      
      const data = await res.json()
      return { data }
    } catch (error) {
      console.error('Error fetching lowongan:', error)
      return { 
        error: error instanceof Error ? error.message : 'Failed to fetch lowongan data' 
      }
    }
  }

  async getLowonganById(id: string): Promise<ApiResponse<Lowongan>> {
    try {
      const res = await fetch(`${this.baseUrl}/${id}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      })
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error("Status:", res.status)
        console.error("Response Body:", errorText)
        throw new Error(`Gagal fetch lowongan (${res.status}): ${errorText}`)
      }
      
      const data = await res.json()
      return { data }
    } catch (error) {
      console.error('Error fetching lowongan by id:', error)
      return { 
        error: error instanceof Error ? error.message : 'Failed to fetch lowongan data' 
      }
    }
  }

  async createLowongan(lowongan: Omit<Lowongan, 'id'>): Promise<ApiResponse<Lowongan>> {
    try {
      const res = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(lowongan),
      })
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error("Status:", res.status)
        console.error("Response Body:", errorText)
        throw new Error(`Gagal create lowongan (${res.status}): ${errorText}`)
      }
      
      const data = await res.json()
      return { data }
    } catch (error) {
      console.error('Error creating lowongan:', error)
      return { 
        error: error instanceof Error ? error.message : 'Failed to create lowongan' 
      }
    }
  }

  async updateLowongan(lowongan: Lowongan): Promise<ApiResponse<any>> {
    try {
      const res = await fetch(`${this.baseUrl}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(lowongan),
      })
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error("Status:", res.status)
        console.error("Response Body:", errorText)
        throw new Error(`Gagal update lowongan (${res.status}): ${errorText}`)
      }
      
      const data = await res.json()
      return { data }
    } catch (error) {
      console.error('Error updating lowongan:', error)
      return { 
        error: error instanceof Error ? error.message : 'Failed to update lowongan' 
      }
    }
  }

  async deleteLowongan(id: string): Promise<ApiResponse<string>> {
    try {
      const res = await fetch(`${this.baseUrl}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(id),
      })
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error("Status:", res.status)
        console.error("Response Body:", errorText)
        throw new Error(`Gagal delete lowongan (${res.status}): ${errorText}`)
      }
      
      const message = await res.text()
      return { data: message }
    } catch (error) {
      console.error('Error deleting lowongan:', error)
      return { 
        error: error instanceof Error ? error.message : 'Failed to delete lowongan' 
      }
    }
  }
}

// Export singleton instance
export const lowonganController = new LowonganController()

// Export the fetch function in the same style for compatibility
export async function fetchLowongan(): Promise<any> {
  const token = Cookies.get("token")
  if (!token) {
    throw new Error("Kamu belum login")
  }
  const res = await fetch(`${backend_link}/api/lowongan/user/lowongan`, {
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