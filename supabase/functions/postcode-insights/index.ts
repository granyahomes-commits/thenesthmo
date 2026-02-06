import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface PostcodeMetrics {
  postcode: string;
  area: string;
  activeRooms: number;
  avgRent: number;
  enquiryRate: number;
  avgTimeToLet: number;
  saturationScore: number;
  opportunityScore: number;
  demandTrend: "rising" | "stable" | "falling";
  searchVolume: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Authenticate the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      console.error('Auth error:', claimsError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user:', claimsData.claims.sub);

    const { metrics } = await req.json() as { metrics: PostcodeMetrics };
     
     if (!metrics) {
       return new Response(
         JSON.stringify({ error: 'Missing postcode metrics' }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
     if (!LOVABLE_API_KEY) {
       throw new Error('LOVABLE_API_KEY is not configured');
     }
 
     const systemPrompt = `You are an HMO market analyst providing concise, actionable insights for property investors.
 
 Rules:
 - Keep responses under 150 words
 - Focus on actionable insights, not just restating data
 - Use plain language, avoid jargon
 - Highlight opportunities and risks
 - Be direct and specific
 - This is decision-support only, not financial advice`;
 
     const userPrompt = `Analyze this UK HMO postcode data and provide a brief market insight:
 
 Postcode: ${metrics.postcode} (${metrics.area})
 - Active rooms on platform: ${metrics.activeRooms}
 - Average rent: £${metrics.avgRent}/month
 - Enquiry rate (search to enquiry): ${metrics.enquiryRate}%
 - Average time to let: ${metrics.avgTimeToLet} days
 - Saturation score: ${metrics.saturationScore}/100 (higher = more competitive)
 - Opportunity score: ${metrics.opportunityScore}/100 (higher = better potential)
 - Demand trend: ${metrics.demandTrend}
 - Monthly search volume: ${metrics.searchVolume}
 
 Provide a 2-3 sentence insight explaining what these numbers mean for an investor considering this area.`;
 
     console.log('Generating insights for postcode:', metrics.postcode);
 
     const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${LOVABLE_API_KEY}`,
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         model: 'google/gemini-3-flash-preview',
         messages: [
           { role: 'system', content: systemPrompt },
           { role: 'user', content: userPrompt }
         ],
       }),
     });
 
     if (!response.ok) {
       if (response.status === 429) {
         return new Response(
           JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
           { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
       if (response.status === 402) {
         return new Response(
           JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
           { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
       const errorText = await response.text();
       console.error('AI gateway error:', response.status, errorText);
       throw new Error(`AI gateway error: ${response.status}`);
     }
 
     const data = await response.json();
     const insight = data.choices?.[0]?.message?.content;
 
     if (!insight) {
       throw new Error('No insight generated from AI');
     }
 
     console.log('Successfully generated insight for:', metrics.postcode);
 
     return new Response(
       JSON.stringify({ insight }),
       { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   } catch (error) {
     console.error('Error generating postcode insight:', error);
     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
     return new Response(
       JSON.stringify({ error: errorMessage }),
       { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   }
 });