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
import axios from 'axios'
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";


const SignUpSchema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6,"Password should be atleash 6 characters")
})

type SignUpFormData = z.infer<typeof SignUpSchema>;

export default function SignUpPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const {data: session} = useSession();

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    useEffect(() => {
        if(session){
            router.push("/")
        }
    },[session,router])

    const handleSignUp = async (data: SignUpFormData) => {
        setLoading(true);
        
        try{
            await axios.post("/api/auth/signup",data);
            router.push("/signin")
        }catch(error:any){
            form.setError("email",{type: "manual", message: error.response.data.error})
            form.setError("email", { type: "manual", message: "Something went wrong. Please try again." });
        }
        setLoading(false)
    }


    return (
        <div className="flex justify-center items-center h-svh">
            <div className="w-[500px] bg-[#3B1C32] p-6 rounded-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-8">
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
                            <Button type="submit" className="bg-[#6A1E55] w-32 h-10 text-lg hover:bg-[rgb(95,25,75)]" >{loading ? <LoaderCircle className="animate-spin"/> : "SignUp"}</Button>
                        </div>
                        {/* <div className="flex justify-center">
                            <Button className="bg-[#6A1E55] w-64 h-10 text-lg hover:bg-[rgb(95,25,75)] " >SignUp With Google</Button>
                        </div> */}
                        <div className="flex justify-center">
                            <Button className="bg-[#6A1E55] w-64 h-10 text-lg hover:bg-[rgb(95,25,75)] " >Continue With GitHub</Button>
                        </div>
                        <div className="flex justify-center gap-2">
                            Already have an account ?<Link href="/signin" className="hover:underline">Sign In</Link>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}