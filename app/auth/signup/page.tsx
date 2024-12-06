"use client";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [p,setP] = useState("");

  const onSubmit = async () => {
    try{
        await axios.post("/api/auth/signup",{email,password: p});
        router.push("/auth/signin");
    }catch(error){
        console.error("unable to signup",error);
    }
  }

  return (
    <div>
      email: <input onChange={(e) => setEmail(e.target.value)}></input>
      password: <input onChange={(e) => setP(e.target.value)}></input>
      <button onClick={onSubmit}>submit</button>
      {email} {p}
    </div>
  );
}