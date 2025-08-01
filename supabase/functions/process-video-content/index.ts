import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// We'll create the Supabase client with the user's token later

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with user's token for RLS
    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: authHeader
          }
        }
      }
    );

    // Get user from auth header
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { content_type, content, title } = await req.json();
    
    if (!content_type || !content) {
      return new Response(
        JSON.stringify({ error: "Content type and content are required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create video record
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .insert({
        user_id: user.id,
        title: title || 'Untitled Video',
        source_type: content_type,
        source_content: content,
        status: 'processing'
      })
      .select()
      .single();

    if (videoError) {
      throw new Error(`Failed to create video record: ${videoError.message}`);
    }

    // Process content based on type
    let extractedContent = '';
    let thumbnailUrl = '';

    if (content_type === 'youtube') {
      // Extract YouTube content
      const youtubeResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/extract-youtube-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        },
        body: JSON.stringify({ url: content })
      });

      if (youtubeResponse.ok) {
        const youtubeData = await youtubeResponse.json();
        extractedContent = `${youtubeData.title}\n\n${youtubeData.description}`;
        thumbnailUrl = youtubeData.thumbnail_url;
        
        // Update video with YouTube data
        await supabase
          .from('videos')
          .update({
            title: youtubeData.title,
            thumbnail_url: thumbnailUrl
          })
          .eq('id', video.id);
      }
    } else if (content_type === 'text') {
      extractedContent = content;
    } else if (content_type === 'image') {
      // For images, we would implement OCR here
      extractedContent = "Image content extracted"; // Placeholder
    }

    // Generate educational script
    const scriptResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-script`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
      },
      body: JSON.stringify({
        content: extractedContent,
        topic: title || 'Educational Content',
        style: 'educational'
      })
    });

    let generatedScript = '';
    if (scriptResponse.ok) {
      const scriptData = await scriptResponse.json();
      generatedScript = scriptData.script;
    }

    // Generate audio from script
    let audioUrl = '';
    if (generatedScript) {
      const ttsResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/text-to-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        },
        body: JSON.stringify({
          text: generatedScript,
          voice_id: '21m00Tcm4TlvDq8ikWAM' // Default ElevenLabs voice
        })
      });

      if (ttsResponse.ok) {
        const ttsData = await ttsResponse.json();
        // In a real implementation, you would upload the audio to storage
        // For now, we'll store the base64 data reference
        audioUrl = `data:audio/mp3;base64,${ttsData.audio_data}`;
      }
    }

    // Update video with generated content
    const { error: updateError } = await supabase
      .from('videos')
      .update({
        generated_script: generatedScript,
        audio_url: audioUrl,
        status: 'completed'
      })
      .eq('id', video.id);

    if (updateError) {
      console.error('Failed to update video:', updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        video_id: video.id,
        extracted_content: extractedContent,
        generated_script: generatedScript,
        audio_url: audioUrl,
        thumbnail_url: thumbnailUrl,
        status: 'completed'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-video-content function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});