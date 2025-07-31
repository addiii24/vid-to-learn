import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, topic, style = 'educational' } = await req.json();
    
    if (!content && !topic) {
      return new Response(
        JSON.stringify({ error: "Content or topic is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    const prompt = `
Create an educational video script based on the following:

Topic: ${topic}
Content: ${content}
Style: ${style}

Please create a structured script with:
1. Introduction (30 seconds) - Hook the viewer and introduce the topic
2. Main content with 3-5 key points - Each point should be clear and educational
3. Examples and explanations - Make concepts easy to understand
4. Summary and conclusion (30 seconds) - Recap key takeaways

Guidelines:
- Keep each section engaging and conversational
- Use simple language that's easy to follow
- Include natural pauses for visual elements
- Make it suitable for a 3-5 minute animated video
- Structure it so it flows well with voice-over narration

Format the response as a clear script with timestamps and sections.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are an expert educational content creator who specializes in creating engaging video scripts for animated educational videos. Focus on clarity, engagement, and educational value.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate script');
    }

    const data = await response.json();
    const script = data.choices[0].message.content;
    
    // Calculate estimated metrics
    const wordCount = script.split(' ').length;
    const estimatedDuration = Math.ceil(wordCount / 150); // Average speaking pace

    return new Response(
      JSON.stringify({
        success: true,
        script,
        word_count: wordCount,
        estimated_duration: `${estimatedDuration} minutes`,
        sections: extractSections(script)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-script function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function extractSections(script: string) {
  const sections = [];
  const lines = script.split('\n');
  
  for (const line of lines) {
    if (line.match(/^(Introduction|Main Content|Conclusion|Summary)/i)) {
      sections.push(line.trim());
    }
  }
  
  return sections;
}