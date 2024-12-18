"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from 'lucide-react';
import { signIn, useSession } from "next-auth/react";


const SignInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})

type SignInFormData = z.infer<typeof SignInSchema>;

export default function SignInPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const {data: session} = useSession();

    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    const router = useRouter();

    useEffect(() => {
        if(session){
            router.push("/");
        }
    },[session,router])

    const handleSignIn = async (data: SignInFormData) => {
        setLoading(true);
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (result?.error) {
                form.setError("email", { type: "manual", message: result.error });
            } else if (result?.ok) {
                router.push("/");
            }
        } catch (error) {
            console.error("Sign-in failed:", error);
            form.setError("email", { type: "manual", message: "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center h-svh">
            <div className="w-[500px] bg-[#3B1C32] p-6 rounded-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xl">Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="johndoe@gmail.com" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xl">Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123456" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-center">
                            <Button className="bg-[#6A1E55] w-32 h-10 text-lg hover:bg-[rgb(95,25,75)] " >{loading ? <LoaderCircle className="animate-spin"/> : "Signin"}</Button>
                        </div>
                        <div className="flex justify-center">
                            <Button className="bg-[#6A1E55] w-64 h-10 text-lg hover:bg-[rgb(95,25,75)] " >Login With Google</Button>
                        </div>
                        <div className="flex justify-center">
                            <Button className="bg-[#6A1E55] w-64 h-10 text-lg hover:bg-[rgb(95,25,75)] " >Login With GitHub</Button>
                        </div>
                        <div className="flex justify-center gap-2">
                            Don't have an account ?<Link href="/signup" className="hover:underline">Sign Up</Link>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}