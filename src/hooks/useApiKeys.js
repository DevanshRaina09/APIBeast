import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch API keys from Supabase
  const fetchApiKeys = async () => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("apikey")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;
      setApiKeys(data || []);
    } catch (err) {
      setError("Failed to fetch API keys");
      console.error("Error:", err);
    }
  };

  // Create new API key
  const createApiKey = async (keyData) => {
    setLoading(true);
    setError("");

    try {
      // Validate keyData
      if (!keyData?.name || !keyData?.value) {
        throw new Error("Invalid key data");
      }

      // Create the insert object with required fields
      const insertData = {
        name: keyData.name,
        value: keyData.value,
        usage: 0,
      };

      // Only add optional fields if they exist and have values
      if (keyData.type) {
        insertData.type = keyData.type;
      }

      if (typeof keyData.monthlyLimit === "number") {
        insertData.monthly_limit = keyData.monthlyLimit;
      }

      const { data, error: supabaseError } = await supabase
        .from("apikey")
        .insert([insertData])
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      setApiKeys((prevKeys) => [data, ...prevKeys]);
      return data;
    } catch (err) {
      setError(err.message || "Failed to create API key");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete API key
  const deleteApiKey = async (id) => {
    setLoading(true);
    try {
      const { error: supabaseError } = await supabase
        .from("apikey")
        .delete()
        .eq("id", id);

      if (supabaseError) throw supabaseError;

      setApiKeys((prevKeys) => prevKeys.filter((key) => key.id !== id));
    } catch (err) {
      setError("Failed to delete API key");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    apiKeys,
    loading,
    error,
    fetchApiKeys,
    createApiKey,
    deleteApiKey,
  };
}
