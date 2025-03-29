
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
async function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}

serve(async (req) => {
  // Handle CORS
  const corsResponse = await handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { prompt } = await req.json();
    
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch services from the database
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*');

    if (servicesError) {
      throw new Error(`Error fetching services: ${servicesError.message}`);
    }

    // Format services for the AI prompt
    const servicesContext = services && services.length > 0 
      ? services.map(service => 
        `- ${service.nom_service}: ${service.description || 'No description available'} (Prix: ${service.prix || 'N/A'}€)`
      ).join('\n')
      : 'No services available';

    // OpenAI API call
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Determine if the user is speaking French or English
    const languageCheckResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a language detector. Respond only with "fr" if the text is French or "en" if the text is English.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 10,
      }),
    });

    const languageData = await languageCheckResponse.json();
    
    // Check if we have valid data
    if (!languageData || !languageData.choices || !languageData.choices[0] || !languageData.choices[0].message) {
      throw new Error('Invalid response from language detection');
    }
    
    const detectedLanguage = languageData.choices[0].message.content.toLowerCase().includes('fr') ? 'fr' : 'en';
    
    console.log(`Detected language: ${detectedLanguage}`);

    // System prompts based on detected language
    const systemPrompt = detectedLanguage === 'fr' 
      ? `Vous êtes un assistant médical IA pour un site web de laboratoire médical. Votre tâche est d'aider les utilisateurs à trouver le service approprié en fonction de leurs préoccupations ou besoins de santé. Soyez poli, professionnel et serviable. Répondez en français.

Voici les services que nous proposons:
${servicesContext}

Si un utilisateur décrit des symptômes ou des préoccupations de santé, recommandez le service le plus approprié de notre liste. Si leurs besoins ne correspondent pas exactement à l'un de nos services, suggérez la correspondance la plus proche et expliquez pourquoi. S'ils ont besoin de soins médicaux urgents, conseillez-leur de contacter les services d'urgence.

Fournissez toujours des informations précises et soyez transparent sur les limites de vos conseils. Précisez que vos suggestions ne remplacent pas un diagnostic médical professionnel.`
      : `You are an AI medical laboratory assistant for a laboratory website. Your task is to help users find the appropriate service based on their health concerns or needs. Be polite, professional, and helpful. Respond in English.

Here are the services we offer:
${servicesContext}

If a user describes symptoms or health concerns, recommend the most appropriate service from our list. If their needs don't match any of our services exactly, suggest the closest match and explain why. If they need urgent medical attention, advise them to contact emergency services.

Always provide accurate information and be transparent about the limitations of your advice. Make clear that your suggestions are not a substitute for professional medical diagnosis.`;

    // Main OpenAI API call
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await openaiResponse.json();
    
    // Validate the response
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }

    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in chatbot-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});