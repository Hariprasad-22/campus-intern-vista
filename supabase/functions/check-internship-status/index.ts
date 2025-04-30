
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://lczzaisvzahlqricnilo.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Find internships that have ended but aren't marked as completed
    const { data: endedInternships, error } = await supabase
      .from("internship_applications")
      .select("*")
      .lt("end_date", new Date().toISOString())
      .neq("status", "completed");
    
    if (error) {
      throw error;
    }
    
    const updates = [];
    
    // Update status to 'completed' for each ended internship
    for (const internship of (endedInternships || [])) {
      const { data, error: updateError } = await supabase
        .from("internship_applications")
        .update({ status: "completed" })
        .eq("id", internship.id)
        .select();
      
      if (updateError) {
        updates.push({ id: internship.id, success: false, error: updateError.message });
      } else {
        updates.push({ id: internship.id, success: true });
      }
    }

    return new Response(
      JSON.stringify({
        processed: endedInternships?.length || 0,
        updates
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error) {
    console.error("Error in check-internship-status function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
