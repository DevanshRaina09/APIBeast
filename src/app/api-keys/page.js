"use client";

import { useState } from "react";
import { KeyIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function ApiKeysPage() {
  const [apiKey, setApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [isValid, setIsValid] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationMessage("");

    // Trim the API key to remove any whitespace
    const trimmedApiKey = apiKey.trim();

    try {
      if (!trimmedApiKey) {
        setValidationMessage("Please enter an API key");
        setIsValid(false);
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/validate-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey: trimmedApiKey }), // Send trimmed API key
      });

      const data = await response.json();
      console.log("Response:", data); // Debug log

      if (response.ok && data.isValid) {
        setValidationMessage("Valid API Key");
        setIsValid(true);
        localStorage.setItem("apiKey", trimmedApiKey);
        setTimeout(() => {
          router.push("/protected");
        }, 1500);
      } else {
        setValidationMessage("Not Valid API Key");
        setIsValid(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setValidationMessage("Error validating API key");
      setIsValid(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input change with automatic trimming
  const handleInputChange = (e) => {
    const value = e.target.value;
    // Remove any whitespace as the user types
    setApiKey(value.trim());
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-500/10 rounded-lg">
          <KeyIcon className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">API Keys</h1>
          <p className="text-gray-400 mt-1">
            Configure your API key for authentication
          </p>
        </div>
      </div>

      {/* API Key Form Section */}
      <div className="bg-[#1a1d26] rounded-lg border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Set API Key</h2>
          <p className="text-sm text-gray-400 mt-1">
            Your API key provides full access to your account. Keep it secure.
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="apiKey"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                API Key
              </label>
              <input
                id="apiKey"
                type="text"
                value={apiKey}
                onChange={handleInputChange} // Use new handler
                className="w-full px-4 py-2.5 rounded-md bg-gray-800/50 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none placeholder-gray-500"
                placeholder="Enter your API key"
                required
                spellCheck="false" // Disable spell check
                autoComplete="off" // Disable autocomplete
              />
              <p className="mt-2 text-sm text-gray-400">
                Enter your API key to access protected features
              </p>
            </div>

            {validationMessage && (
              <div
                className={`mt-2 text-sm ${
                  isValid ? "text-green-500" : "text-red-500"
                } font-medium`}
              >
                {validationMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white rounded-md ${
                isSubmitting
                  ? "bg-blue-600/50 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-colors`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Validating...
                </>
              ) : (
                "Validate API Key"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
