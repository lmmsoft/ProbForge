export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
      "Access-Control-Max-Age": "86400",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    const data = {
      timestamp: Date.now(),
      time: new Date().toISOString(),
      message: "Hello from Worker!"
    };

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
};