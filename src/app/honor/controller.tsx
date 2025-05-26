import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie"

export interface Lamaran {
  id: string
  sks: number
  ipk: number
  status: string | null
  idMahasiswa: string
  idLowongan: string
}

export interface Lowongan {
  id: string
  matkul: string
  tahun: number
  term: string
  totalAsdosNeeded: number
  totalAsdosRegistered: number
  totalAsdosAccepted: number
}

export interface HonorData {
  formattedHonor: string
  tahun: number
  honor: number
  lowonganId: string
  bulan: number
}

export interface JWTPayload {
  sub: string
  role: string
  userId: string
  iat: number
  exp: number
}

export interface HonorTableRow {
  bulanTahun: string
  mataKuliah: string
  jumlahJam: number
  honorPerJam: number
  jumlahPembayaran: string
  rawPembayaran: number
}

const BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT || "8080"
const BASE_URL = `${BACKEND_PORT}`

/**
 * Get user ID from JWT token stored in cookies
 */
export const getUserIdFromToken = (): string | null => {
  try {
    const token = Cookies.get("token")
    if (!token) return null

    const decoded = jwtDecode<JWTPayload>(token)
    return decoded.userId
  } catch (error) {
    console.error("Error decoding token:", error)
    return null
  }
}

/**
 * Get authorization headers with JWT token
 */
const getAuthHeaders = () => {
  const token = Cookies.get("token")
  if (!token) {
    throw new Error("User not authenticated")
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

/**
 * Fetch all lamaran for the current user
 */
export const fetchUserLamaran = async (): Promise<Lamaran[]> => {
  const headers = getAuthHeaders()
  const userId = getUserIdFromToken()

  if (!userId) {
    throw new Error("Invalid token")
  }

  const response = await fetch(`${BASE_URL}/api/lamaran/user/all`, {
    method: "GET",
    headers: headers,
  })

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Access denied. Please login again.")
    }
    throw new Error(`Failed to fetch lamaran data: ${response.status}`)
  }

  const allLamaran: Lamaran[] = await response.json()

  // Filter lamaran by userId
  return allLamaran.filter((lamaran) => lamaran.idMahasiswa === userId)
}

/**
 * Fetch lowongan details by ID
 */
export const fetchLowonganById = async (lowonganId: string): Promise<Lowongan> => {
  const headers = getAuthHeaders()

  const response = await fetch(`${BASE_URL}/api/lowongan/user/lowongan/${lowonganId}`, {
    method: "GET",
    headers: headers,
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch lowongan ${lowonganId}: ${response.status}`)
  }

  return await response.json()
}

/**
 * Fetch honor data for specific lowongan, year, and month
 */
export const fetchHonorByPeriod = async (
  lowonganId: string,
  tahun: number,
  bulan: number,
): Promise<HonorData | null> => {
  const headers = getAuthHeaders()

  const response = await fetch(
    `${BASE_URL}/api/log/student/honor?lowonganId=${lowonganId}&tahun=${tahun}&bulan=${bulan}`,
    {
      method: "GET",
      headers: headers,
    },
  )

  if (response.ok) {
    return await response.json()
  }

  return null
}

/**
 * Get month name from month number
 */
export const getMonthName = (month: number): string => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return months[month - 1]
}

/**
 * Generate year options for dropdown
 */
export const generateYearOptions = (): number[] => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear - 2; i <= currentYear + 1; i++) {
    years.push(i)
  }
  return years
}

/**
 * Generate month options for dropdown
 */
export const generateMonthOptions = (): number[] => {
  return Array.from({ length: 12 }, (_, i) => i + 1)
}

/**
 * Calculate honor table data for a specific period
 */
export const calculateHonorTableData = async (
  selectedYear: number,
  selectedMonth: number,
): Promise<HonorTableRow[]> => {
  try {
    // Fetch user lamaran
    const userLamaran = await fetchUserLamaran()

    // Get unique lowongan IDs
    const uniqueLowonganIds = [...new Set(userLamaran.map((lamaran) => lamaran.idLowongan))]

    const honorTableData: HonorTableRow[] = []
    const honorPerJam = 27500 // Fixed honor per hour

    // Process each unique lowongan
    for (const lowonganId of uniqueLowonganIds) {
      try {
        // Fetch lowongan details and honor data in parallel
        const [lowongan, honor] = await Promise.all([
          fetchLowonganById(lowonganId),
          fetchHonorByPeriod(lowonganId, selectedYear, selectedMonth),
        ])

        if (honor) {
          // Calculate jumlah jam (pembagian honor dengan 27500)
          const jumlahJam = Math.round((honor.honor / honorPerJam) * 100) / 100 // Round to 2 decimal places

          // Format bulan/tahun
          const bulanTahun = `${getMonthName(honor.bulan)} ${honor.tahun}`

          honorTableData.push({
            bulanTahun,
            mataKuliah: lowongan.matkul,
            jumlahJam,
            honorPerJam,
            jumlahPembayaran: honor.formattedHonor,
            rawPembayaran: honor.honor,
          })
        }
      } catch (error) {
        console.error(`Error fetching data for lowongan ${lowonganId}:`, error)
        // Continue processing other lowongan even if one fails
      }
    }

    return honorTableData
  } catch (error) {
    console.error("Error calculating honor table data:", error)
    throw error
  }
}

/**
 * Calculate total honor from honor table data
 */
export const calculateTotalHonor = (honorData: HonorTableRow[]): number => {
  return honorData.reduce((sum, row) => sum + row.rawPembayaran, 0)
}

/**
 * Calculate total working hours from honor table data
 */
export const calculateTotalJam = (honorData: HonorTableRow[]): number => {
  return honorData.reduce((sum, row) => sum + row.jumlahJam, 0)
}
