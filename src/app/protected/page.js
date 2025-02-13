"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function ProtectedPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateAccess = async () => {
      const apiKey = localStorage.getItem("apiKey");

      if (!apiKey) {
        toast.error("No API key found. Please add your API key.", {
          style: {
            background: "#EF4444",
            color: "white",
          },
          duration: 3000,
        });
        router.push("/api-keys");
        return;
      }

      try {
        const response = await fetch("/api/validate-key", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ apiKey }),
        });

        const data = await response.json();

        if (response.ok && data.isValid) {
          toast.success("API key validated successfully!", {
            style: {
              background: "#10B981",
              color: "white",
            },
            duration: 3000,
          });
          setIsLoading(false);
        } else {
          toast.error("Invalid API key. Please try again.", {
            style: {
              background: "#EF4444",
              color: "white",
            },
            duration: 3000,
          });
          router.push("/api-keys");
        }
      } catch (error) {
        console.error("Error validating API key:", error);
        toast.error("Error validating API key. Please try again.", {
          style: {
            background: "#EF4444",
            color: "white",
          },
          duration: 3000,
        });
        router.push("/api-keys");
      }
    };

    validateAccess();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1d26]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1d26] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="w-6 h-6 text-green-500" />
            <h2 className="text-lg font-medium text-green-500">
              API Key Verified
            </h2>
          </div>
          <p className="mt-2 text-gray-400">
            Your API key has been successfully verified. You now have access to
            all protected features.
          </p>
        </div>

        <div className="bg-[#1f2937] rounded-lg border border-gray-800">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-4">
              Welcome to Protected Area
            </h1>
            <p className="text-gray-400">
              You can now access all the features and functionalities available
              in this protected section. Your API key will be used for all
              authenticated requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
