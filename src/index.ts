export default {
  async fetch(request, env) {
    const ERROR_RESPONSE = new Response("Something went wrong! 🥲");

    const url = new URL(request.url);

    if (!url.search) return ERROR_RESPONSE;
    const params = new URLSearchParams(url.search);

    if (!params.has('prompt')) return ERROR_RESPONSE;
    const input = {
      prompt: params.get('prompt'),
    };
    
    const response = await env.AI.run(
      '@cf/black-forest-labs/flux-1-schnell',
      input,
    );

    // Convert from base64 string
    const binaryString = atob(response.image);
    // Create byte representation
    const img = Uint8Array.from(binaryString, (m) => m.codePointAt(0));
    
    return new Response(img, {
      headers: {
        'Content-Type': 'image/jpeg',
      },
    });
  },
} satisfies ExportedHandler<Env>;
