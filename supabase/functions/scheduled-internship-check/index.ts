
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://lczzaisvzahlqricnilo.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// This function will be called by a scheduled cron job to check for ended internships
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get current date
    const now = new Date().toISOString();
    
    // Find all internships that have ended but are not marked as completed
    const { data: endedInternships, error: fetchError } = await supabase
      .from("internship_applications")
      .select("*")
      .lt("end_date", now)
      .neq("status", "completed");
      
    if (fetchError) {
      throw fetchError;
    }
    
    console.log(`Found ${endedInternships?.length || 0} ended internships to process`);
    
    const results = [];
    
    // Update each ended internship to 'completed' status
    for (const internship of endedInternships || []) {
      try {
        // Update internship status to 'completed'
        const { error: updateError } = await supabase
          .from("internship_applications")
          .update({ status: "completed" })
          .eq("id", internship.id);
        
        if (updateError) {
          throw updateError;
        }
        
        results.push({
          id: internship.id,
          status: "updated",
          student_email: internship.email,
        });
      } catch (error) {
        console.error(`Error updating internship ${internship.id}:`, error);
        results.push({
          id: internship.id,
          status: "error",
          error: error.message,
        });
      }
    }
    
    // Now check which completed internships need feedback notifications
    const { data: notifications, error: notificationsError } = await supabase
      .from("email_notifications")
      .select("*")
      .eq("is_sent", false)
      .limit(50);
      
    if (notificationsError) {
      console.error('Error fetching pending notifications:', notificationsError);
    } else {
      console.log(`Found ${notifications?.length || 0} pending email notifications`);
      
      // Invoke the send-feedback-reminder function to process pending notifications
      if (notifications && notifications.length > 0) {
        try {
          const response = await fetch(
            `${supabaseUrl}/functions/v1/send-feedback-reminder`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${supabaseKey}`,
              },
            }
          );
          
          const emailResult = await response.json();
          console.log('Email reminder results:', emailResult);
        } catch (error) {
          console.error('Error invoking email reminder function:', error);
        }
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        processedInternships: results,
        timestamp: now,
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in scheduled internship check:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
