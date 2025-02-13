import { useState } from "react";

export default function CreateApiKeyModal({ onClose, onSubmit, loading }) {
  const [newKeyName, setNewKeyName] = useState("");
  const [keyType, setKeyType] = useState("development");
  const [monthlyLimit, setMonthlyLimit] = useState("1000");
  const [error, setError] = useState("");
  const [enableMonthlyLimit, setEnableMonthlyLimit] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!newKeyName.trim()) {
        setError("Please enter a key name");
        return;
      }

      const newKey = {
        name: newKeyName.trim(),
        value: generateApiKey(),
        type: keyType,
        monthlyLimit: enableMonthlyLimit ? Number(monthlyLimit) || null : null,
        usage: 0,
      };

      await onSubmit(newKey);
    } catch (err) {
      setError(err.message || "Failed to create API key");
    }
  };

  // Generate a random API key
  const generateApiKey = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const prefix = keyType === "development" ? "dev_" : "prod_";
    let result = prefix;
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1d26] rounded-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Create a new API key</h3>
        <p className="text-gray-400 text-sm mb-6">
          Enter a name and limit for the new API key.
        </p>

        {/* Key Name Input */}
        <div className="mb-6">
          <label className="block text-sm mb-2">
            Key Name{" "}
            <span className="text-gray-400">
              — A unique name to identify this key
            </span>
          </label>
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key Name"
            className="w-full p-3 bg-[#0f1117] border border-gray-700 rounded-lg 
                     text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Key Type Selection */}
        <div className="mb-6">
          <label className="block text-sm mb-2">
            Key Type{" "}
            <span className="text-gray-400">
              — Choose the environment for this key
            </span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setKeyType("production")}
              className={`p-3 rounded-lg border flex items-center justify-center gap-2
                ${
                  keyType === "production"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-700 hover:border-gray-600"
                }`}
            >
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Production
              <span className="text-xs text-gray-400">No rate limit</span>
            </button>
            <button
              onClick={() => setKeyType("development")}
              className={`p-3 rounded-lg border flex items-center justify-center gap-2
                ${
                  keyType === "development"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-700 hover:border-gray-600"
                }`}
            >
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              Development
              <span className="text-xs text-gray-400">
                Rate limited to 100 requests/minute
              </span>
            </button>
          </div>
        </div>

        {/* Monthly Usage Limit */}
        <div className="mb-6">
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={enableMonthlyLimit}
              onChange={(e) => setEnableMonthlyLimit(e.target.checked)}
              className="rounded border-gray-700"
            />
            <span className="text-sm">Limit monthly usage*</span>
          </label>
          <input
            type="number"
            value={monthlyLimit}
            onChange={(e) => setMonthlyLimit(e.target.value)}
            disabled={!enableMonthlyLimit}
            className="w-full p-3 bg-[#0f1117] border border-gray-700 rounded-lg 
                     text-white placeholder-gray-500 focus:outline-none focus:border-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-2">
            *If the combined usage of all your keys exceeds your plan's limit,
            all requests will be rejected.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                     disabled:bg-blue-500/50 disabled:cursor-not-allowed"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
