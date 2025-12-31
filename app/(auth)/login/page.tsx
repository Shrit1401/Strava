"use client";

import Button from "@/components/ui/Button";
import { login } from "@/lib/auth/login";
import { useState } from "react";

const BUTTON_STYLES = "!bg-white !text-black !border-white hover:!bg-white/90";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await login();
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen overflow-y-hidden">
      <div className="w-full md:w-1/2 flex flex-col justify-center gap-5 items-center p-8 md:p-16 relative">
        <div className="w-full flex flex-col items-center mt-8">
          <h2 className="cormorant text-3xl md:text-4xl text-white">
            Login w Strava
          </h2>
        </div>
        <div className="w-full flex flex-col items-center mb-8">
          <Button
            text="LOGIN W GOOGLE"
            variant="primary"
            size="medium"
            className={BUTTON_STYLES}
            onClick={handleGoogleLogin}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="hidden md:flex md:w-1/2 relative">
        <img
          src="/start.png"
          alt="Background illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;
