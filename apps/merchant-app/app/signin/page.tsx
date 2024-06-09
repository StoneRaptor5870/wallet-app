"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignIn() {
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const result = await signIn("google", {
      redirect: false,
      callbackUrl: "/dashboard",
    });
    // if (result) {
    //   window.location.href = "/dashboard";
    // } else {
    //   alert("An unexpected error occurred. Please try again.");
    // }
  };

  return (
    <div className="h-screen md:flex">
      <div className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 i justify-around items-center hidden">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">GoFinance</h1>
          <p className="text-white mt-1">Merchant Wallet App</p>
        </div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      </div>
      <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
      >
        Sign in with Google
      </button>
      </div>
    </div>
  );
}
