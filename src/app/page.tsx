import Image from "next/image";

export default function Home() {
  return (
    <div className="p-10 flex flex-row gap-10">
      <a href="/auth/login">Login</a>
      <a href="/auth/register">Register</a>
    </div>
  )
}