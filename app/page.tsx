"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();
  
  useEffect(() => {
    const jwt = localStorage.getItem("rust-jwt");

     if(jwt) {
      router.replace("/dashboard/main");
     } else {
      router.replace("/login");
     }
  });

  return <></>;
}
