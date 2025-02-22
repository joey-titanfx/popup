"use client";
import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { LockKeyhole, DollarSign, ShieldCheck } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

const BankContent: React.FC = () => {
  const [otpCode, setOtpCode] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callback_url");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 4));
  };

  const handleVerification = () => {
    if (otpCode === "1234") {
      if (callbackUrl) {
        const redirectUrl = `${callbackUrl}?message=OTP+verified+successfully`;
        window.location.replace(redirectUrl);
      } else {
        console.error("No callback URL provided");
      }
      return;
    }
    alert("Invalid OTP. Hint: Use 1234");
  };

  const handleCancel = () => {
    if (callbackUrl) {
      const cancelUrl = callbackUrl.replace(
        "success-callback",
        "cancelled-callback"
      );
      window.location.replace(cancelUrl);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#007DBC]">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-center mb-8 relative h-8">
          <Image
            src="/anz.png"
            alt="ANZ Bank"
            fill
            className="object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E";
              target.style.width = "120px";
              target.style.height = "32px";
              target.style.background = "#007DBC";
            }}
          />
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-50 p-3 rounded-full">
            <ShieldCheck className="w-8 h-8 text-[#007DBC]" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Security Verification
        </h1>

        <div className="text-center mb-8">
          <p className="text-gray-600">
            Please enter the verification code sent to your registered mobile
            number
          </p>
        </div>

        {/* Transaction Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Amount</p>
              <p className="text-xl font-semibold text-gray-900">$1,000.00</p>
            </div>
            <DollarSign className="w-6 h-6 text-[#007DBC]" />
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <LockKeyhole className="w-4 h-4" />
            <span>Secure verification required</span>
          </div>
        </div>

        {/* OTP Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter 4-digit verification code
          </label>
          <input
            type="text"
            value={otpCode}
            onChange={handleInputChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleVerification();
            }}
            placeholder="Enter code"
            maxLength={4}
            className="w-full p-4 text-center text-2xl tracking-[1em] border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007DBC] focus:border-transparent outline-none"
            autoFocus
          />
          <p className="mt-2 text-sm text-gray-500">Hint: Use 1234</p>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            onClick={handleVerification}
            variant="primary"
            className="w-full py-3 bg-[#007DBC] hover:bg-[#005d8c]"
          >
            Verify
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            variant="ghost"
            className="w-full py-3"
          >
            Cancel
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-8">
          This verification helps protect your account from unauthorized access
        </p>
      </div>
    </main>
  );
};

const ThirdPartyBankPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-[#007DBC]">
          <Spinner size="lg" className="fill-white text-[#005d8c]" />
        </div>
      }
    >
      <BankContent />
    </Suspense>
  );
};

export default ThirdPartyBankPage;
