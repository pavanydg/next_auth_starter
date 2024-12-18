"use client"
import { signOut, useSession } from "next-auth/react"
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const { data: session } = useSession();
    const router = useRouter();

    return (
        <div className="text-5xl mt-10 ml-5">
            Hi there 👋
            <br/>
            {session && <div>
                Welcome, {session?.user?.email}
            </div>}
            {session ? (
                <Button className="bg-red-500 hover:bg-red-600 h-10 w-32 text-xl" onClick={() => {
                    signOut()
                }}>SignOut</Button>
            ) : (
                <Button className="bg-green-500 hover:bg-green-600 h-10 w-32 text-xl" onClick={() => {
                    router.push("/signin")
                }}>SignIn</Button>
            ) }
        </div>
    )
}