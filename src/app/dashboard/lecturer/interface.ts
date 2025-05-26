export interface LowonganInterface {
    id: string; // UUID
    idDosen: string; // UUID of the lecturer
    matkul: string;
    tahun: number;
    term: 'Ganjil' | 'Genap'; // Restrict to known terms
    totalAsdosAccepted: number;
    totalAsdosNeeded: number;
    totalAsdosRegistered: number;
}
