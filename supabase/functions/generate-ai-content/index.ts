import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  prompt: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { prompt, model, temperature = 0.7, maxTokens = 1000 }: RequestBody = await req.json();

    if (!prompt || !model) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: prompt and model" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let response;
    let generatedText = "";
    let tokensUsed = 0;

    if (model.startsWith('gpt-')) {
      const openaiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openaiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          temperature: temperature,
          max_tokens: maxTokens,
        }),
      });

      const data = await openaiResponse.json();
      generatedText = data.choices[0]?.message?.content || '';
      tokensUsed = data.usage?.total_tokens || 0;
    } else if (model.startsWith('claude-')) {
      const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
      if (!anthropicKey) {
        throw new Error('Anthropic API key not configured');
      }

      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          temperature: temperature,
          max_tokens: maxTokens,
        }),
      });

      const data = await anthropicResponse.json();
      generatedText = data.content[0]?.text || '';
      tokensUsed = data.usage?.input_tokens + data.usage?.output_tokens || 0;
    } else if (model.startsWith('deepseek-')) {
      const deepseekKey = Deno.env.get('DEEPSEEK_API_KEY');
      if (!deepseekKey) {
        throw new Error('DeepSeek API key not configured');
      }

      const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${deepseekKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          temperature: temperature,
          max_tokens: maxTokens,
        }),
      });

      const data = await deepseekResponse.json();
      generatedText = data.choices[0]?.message?.content || '';
      tokensUsed = data.usage?.total_tokens || 0;
    } else if (model.startsWith('gemini-')) {
      const googleKey = Deno.env.get('GOOGLE_API_KEY');
      if (!googleKey) {
        throw new Error('Google API key not configured');
      }

      const googleResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${googleKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: temperature,
              maxOutputTokens: maxTokens,
            },
          }),
        }
      );

      const data = await googleResponse.json();
      generatedText = data.candidates[0]?.content?.parts[0]?.text || '';
      tokensUsed = data.usageMetadata?.totalTokenCount || 0;
    } else {
      return new Response(
        JSON.stringify({ error: `Unsupported model: ${model}` }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        content: generatedText,
        tokensUsed: tokensUsed,
        model: model,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error('Error generating content:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to generate content',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
