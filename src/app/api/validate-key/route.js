import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return Response.json(
        { isValid: false, error: "API key is required" },
        { status: 400 }
      );
    }

    // Query Supabase using your actual table structure
    const { data, error } = await supabase
      .from("apikey") // Your table name is 'apikey'
      .select("*")
      .eq("value", apiKey) // The API key is stored in the 'value' column
      .single();

    console.log("Validation attempt:", {
      apiKey,
      found: !!data,
      error: error?.message,
    });

    if (error && error.code !== "PGRST116") {
      console.error("Supabase error:", error);
      return Response.json(
        { isValid: false, error: "Database error" },
        { status: 500 }
      );
    }

    const isValid = !!data;

    return Response.json({
      isValid,
      message: isValid ? "API key is valid" : "Invalid API key",
      data: isValid
        ? {
            name: data.name,
            usage: data.usage,
            monthly_limit: data.monthly_limit,
          }
        : null,
    });
  } catch (error) {
    console.error("Validation error:", error);
    return Response.json(
      { isValid: false, error: "Server error" },
      { status: 500 }
    );
  }
}
