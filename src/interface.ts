export interface User {
    userId: string;
    username: string;
    password: string | null;
    role: "STUDENT" | "LECTURER" | "ADMIN" | string;
    nip: string | null;
    nim: string | null;
    fullName: string | null;
}