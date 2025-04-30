
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const supabaseUrl = "https://lczzaisvzahlqricnilo.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";

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
    // Initialize clients
    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendApiKey);
    
    // Get pending email notifications
    const { data: notifications, error: fetchError } = await supabase
      .from("email_notifications")
      .select("*")
      .eq("is_sent", false)
      .limit(10);
    
    if (fetchError) {
      throw fetchError;
    }

    if (!notifications || notifications.length === 0) {
      return new Response(
        JSON.stringify({ message: "No pending notifications found" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    const results = [];

    // Process each notification
    for (const notification of notifications) {
      try {
        // Get the application details to check if feedback is already submitted
        const { data: feedbacks } = await supabase
          .from("internship_feedback")
          .select("*")
          .eq("application_id", notification.application_id);
        
        // Skip if feedback already submitted
        if (feedbacks && feedbacks.length > 0) {
          // Update notification to mark it as sent anyway to avoid repeated processing
          await supabase
            .from("email_notifications")
            .update({ is_sent: true, sent_at: new Date() })
            .eq("id", notification.id);
          
          results.push({ id: notification.id, status: "skipped", message: "Feedback already submitted" });
          continue;
        }

        // Send email
        const emailResult = await resend.emails.send({
          from: "Internship Portal <noreply@resend.dev>",
          to: [notification.email],
          subject: "Reminder: Submit Your Internship Feedback",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
              <h2>Internship Feedback Reminder</h2>
              <p>Hello ${notification.student_name},</p>
              <p>Your internship at <strong>${notification.company_name}</strong> has been completed.</p>
              <p>Please take a moment to submit your feedback about your internship experience. Your feedback is valuable to future interns.</p>
              <p>To submit your feedback, please log in to the Internship Portal and navigate to your internship applications.</p>
              <p>Thank you for your participation!</p>
              <p>Regards,<br>Internship Portal Team</p>
            </div>
          `,
        });

        // Update notification status in database
        await supabase
          .from("email_notifications")
          .update({ is_sent: true, sent_at: new Date() })
          .eq("id", notification.id);

        results.push({ id: notification.id, status: "sent", message: "Email sent successfully" });
      } catch (error) {
        console.error(`Error processing notification ${notification.id}:`, error);
        results.push({ id: notification.id, status: "error", message: error.message });
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error in send-feedback-reminder function:", error);
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
