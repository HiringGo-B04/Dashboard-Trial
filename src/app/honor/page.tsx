'use client';

import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

interface Lamaran {
  id: string;
  sks: number;
  ipk: number;
  status: string | null;
  idMahasiswa: string;
  idLowongan: string;
}

interface Lowongan {
  id: string;
  matkul: string;
  tahun: number;
  term: string;
  totalAsdosNeeded: number;
  totalAsdosRegistered: number;
  totalAsdosAccepted: number;
}

interface HonorData {
  formattedHonor: string;
  tahun: number;
  honor: number;
  lowonganId: string;
  bulan: number;
}

interface JWTPayload {
  sub: string;
  role: string;
  userId: string;
  iat: number;
  exp: number;
}

interface HonorTableRow {
  bulanTahun: string;
  mataKuliah: string;
  jumlahJam: number;
  honorPerJam: number;
  jumlahPembayaran: string;
  rawPembayaran: number;
}

export default function HonorTable() {
  const [honorData, setHonorData] = useState<HonorTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  useEffect(() => {
    fetchHonorData();
  }, [selectedYear, selectedMonth]);

  const getUserIdFromToken = (): string | null => {
    try {
      const token = Cookies.get('token');
      if (!token) return null;
      
      const decoded = jwtDecode<JWTPayload>(token);
      return decoded.userId;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const fetchHonorData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = Cookies.get('token');
      if (!token) {
        setError('User not authenticated');
        return;
      }

      const userId = getUserIdFromToken();
      if (!userId) {
        setError('Invalid token');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch all lamaran
      const lamaranResponse = await fetch('http://localhost:8080/api/lamaran/user/all', {
        method: 'GET',
        headers: headers
      });
      
      if (!lamaranResponse.ok) {
        if (lamaranResponse.status === 403) {
          throw new Error('Access denied. Please login again.');
        }
        throw new Error(`Failed to fetch lamaran data: ${lamaranResponse.status}`);
      }
      
      const allLamaran: Lamaran[] = await lamaranResponse.json();
      
      // Filter lamaran by userId
      const userLamaran = allLamaran.filter(lamaran => lamaran.idMahasiswa === userId);
      
      // Get unique lowongan IDs
      const uniqueLowonganIds = [...new Set(userLamaran.map(lamaran => lamaran.idLowongan))];
      
      const honorTableData: HonorTableRow[] = [];

      // Fetch honor data for each unique lowongan
      for (const lowonganId of uniqueLowonganIds) {
        try {
          // Fetch lowongan details
          const lowonganResponse = await fetch(`http://localhost:8080/api/lowongan/user/lowongan/${lowonganId}`, {
            method: 'GET',
            headers: headers
          });
          
          if (!lowonganResponse.ok) {
            console.error(`Failed to fetch lowongan ${lowonganId}: ${lowonganResponse.status}`);
            continue;
          }
          
          const lowongan: Lowongan = await lowonganResponse.json();
          
          // Fetch honor data
          const honorResponse = await fetch(`http://localhost:8080/api/log/student/honor?lowonganId=${lowonganId}&tahun=${selectedYear}&bulan=${selectedMonth}`, {
            method: 'GET',
            headers: headers
          });
          
          if (honorResponse.ok) {
            const honor: HonorData = await honorResponse.json();
            
            // Calculate jumlah jam (pembagian honor dengan 27500)
            const honorPerJam = 27500;
            const jumlahJam = Math.round(honor.honor / honorPerJam * 100) / 100; // Round to 2 decimal places
            
            // Format bulan/tahun
            const bulanTahun = `${getMonthName(honor.bulan)} ${honor.tahun}`;
            
            honorTableData.push({
              bulanTahun,
              mataKuliah: lowongan.matkul,
              jumlahJam,
              honorPerJam,
              jumlahPembayaran: honor.formattedHonor,
              rawPembayaran: honor.honor
            });
          }
        } catch (error) {
          console.error(`Error fetching data for lowongan ${lowonganId}:`, error);
        }
      }

      setHonorData(honorTableData);
    } catch (error) {
      console.error('Error fetching honor data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load honor data');
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month: number): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 2; i <= currentYear + 1; i++) {
      years.push(i);
    }
    return years;
  };

  const generateMonthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  const getTotalHonor = () => {
    return honorData.reduce((sum, row) => sum + row.rawPembayaran, 0);
  };

  const getTotalJam = () => {
    return honorData.reduce((sum, row) => sum + row.jumlahJam, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading honor data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Honor Payment Report</h1>
          <p className="mt-2 text-gray-600">View your monthly honor payments and working hours</p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Period</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {generateYearOptions().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
                Month
              </label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {generateMonthOptions().map(month => (
                  <option key={month} value={month}>{getMonthName(month)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing data for: <span className="font-medium">{getMonthName(selectedMonth)} {selectedYear}</span>
          </div>
        </div>

        {/* Honor Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          {honorData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Found</h3>
              <p className="text-gray-600">No honor payment data found for {getMonthName(selectedMonth)} {selectedYear}.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bulan/Tahun
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mata Kuliah
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah Jam
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Honor Per Jam
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah Pembayaran
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {honorData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {row.bulanTahun}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row.mataKuliah}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {row.jumlahJam.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          Rp {row.honorPerJam.toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 text-right">
                          {row.jumlahPembayaran}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Summary Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{honorData.length}</span> rekaman ditemukan untuk bulan {getMonthName(selectedMonth)} {selectedYear}
                  </div>
                  <div className="flex space-x-6 text-sm">
                    <div>
                      <span className="text-gray-600">Total Hours: </span>
                      <span className="font-medium text-gray-900">{getTotalJam().toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Payment: </span>
                      <span className="font-medium text-green-600">
                        Rp {getTotalHonor().toLocaleString('id-ID')}.00
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={fetchHonorData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}