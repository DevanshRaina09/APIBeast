"use client";
import { useState, useEffect } from "react";
import { useApiKeys } from "@/hooks/useApiKeys";
import CurrentPlan from "@/components/dashboard/CurrentPlan";
import CreateApiKeyModal from "@/components/dashboard/CreateApiKeyModal";
import Toast from "@/components/Toast";
import {
  ClipboardIcon,
  CheckIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const { apiKeys, loading, error, fetchApiKeys, createApiKey, deleteApiKey } =
    useApiKeys();
  const [copiedId, setCopiedId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [deleteConfirmKey, setDeleteConfirmKey] = useState(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  // Helper function to show toast
  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handle API key creation
  const handleCreateKey = async (keyData) => {
    try {
      await createApiKey(keyData);
      showToastMessage("API key created successfully");
      setShowCreateForm(false);
    } catch (err) {
      showToastMessage(err.message || "Failed to create API key", "error");
      console.error("Create key error:", err);
    }
  };

  // Handle API key deletion
  const handleDeleteKey = async (id) => {
    try {
      await deleteApiKey(id);
      showToastMessage("API key deleted successfully", "error");
      setDeleteConfirmKey(null);
    } catch (err) {
      showToastMessage("Failed to delete API key", "error");
    }
  };

  // Updated copy to clipboard function
  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToastMessage("API key copied to clipboard");

      // Hide copy icon after 2 seconds
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  // Toggle key visibility
  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }));
  };

  // Helper function to mask API key
  const maskApiKey = (key) => {
    const firstPart = key.slice(0, 8);
    const lastPart = key.slice(-4);
    return `${firstPart}${"•".repeat(24)}${lastPart}`;
  };

  return (
    <div className="min-h-screen text-white p-8">
      {/* Delete Confirmation Modal */}
      {deleteConfirmKey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1d26] rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Delete API Key</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this API key? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmKey(null)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteKey(deleteConfirmKey.id);
                  setDeleteConfirmKey(null);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && <Toast message={toastMessage} type={toastType} />}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-8">Overview</h1>

        {showCreateForm && (
          <CreateApiKeyModal
            onClose={() => setShowCreateForm(false)}
            onSubmit={handleCreateKey}
            loading={loading}
          />
        )}

        <CurrentPlan />

        {/* API Keys Section */}
        <div className="bg-[#1a1d26] rounded-xl">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">API Keys</h2>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                <span>New Key</span>
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              The key is used to authenticate your requests to the Research API.
              To learn more, see the documentation page.
            </p>
          </div>

          {/* API Keys List */}
          <div className="divide-y divide-gray-700">
            <div className="grid grid-cols-12 px-6 py-3 text-sm text-gray-400">
              <span className="col-span-3">NAME</span>
              <span className="col-span-2">TYPE</span>
              <span className="col-span-1">USAGE</span>
              <span className="col-span-5">KEY</span>
              <span className="col-span-1">OPTIONS</span>
            </div>

            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="grid grid-cols-12 px-6 py-4 items-center"
              >
                <span className="col-span-3">{key.name}</span>
                <span className="col-span-2">
                  <span className="px-2 py-1 bg-gray-700 rounded-md text-xs">
                    {key.type || "development"}
                  </span>
                </span>
                <span className="col-span-1">0</span>
                <div className="col-span-5 font-mono text-sm text-gray-400 flex items-center gap-2">
                  {visibleKeys[key.id] ? key.value : maskApiKey(key.value)}
                  <button
                    onClick={() => toggleKeyVisibility(key.id)}
                    className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {visibleKeys[key.id] ? (
                      <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                    ) : (
                      <EyeIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <div className="col-span-1 flex gap-2">
                  <button
                    onClick={() => copyToClipboard(key.value, key.id)}
                    className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedId === key.id ? (
                      <CheckIcon className="w-4 h-4 text-green-500" />
                    ) : (
                      <ClipboardIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => setDeleteConfirmKey(key)}
                    className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Delete key"
                  >
                    <TrashIcon className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
            ))}

            {apiKeys.length === 0 && (
              <div className="p-6 text-center text-gray-400">
                No API keys found. Create one to get started.
              </div>
            )}
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-8 flex justify-between items-center p-6 bg-[#1a1d26] rounded-xl">
          <p className="text-gray-300">
            Have any questions, feedback or need support? We'd love to hear from
            you!
          </p>
          <button className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors">
            Contact us
          </button>
        </div>
      </div>
    </div>
  );
}
