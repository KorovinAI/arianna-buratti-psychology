// GitHub OAuth proxy for Sveltia CMS (and Decap CMS — same protocol).
// Adapted from sveltia-cms-auth (Cloudflare Worker) → Netlify Function.
// https://github.com/sveltia/sveltia-cms-auth
//
// Required env vars (set in Netlify dashboard → Site → Build & deploy → Environment):
//   GITHUB_CLIENT_ID      = your GitHub OAuth App Client ID
//   GITHUB_CLIENT_SECRET  = your GitHub OAuth App Client Secret
//
// GitHub OAuth App config (https://github.com/settings/developers → New OAuth App):
//   Application name:            Arianna Buratti Psychology — CMS
//   Homepage URL:                https://ab-psych.com.au
//   Authorization callback URL:  https://ab-psych.com.au/api/auth/callback

const ALLOWED_PROVIDERS = ['github'];
const SCOPE = 'repo,user';

function htmlResponse(provider, type, content) {
  // Sveltia/Decap CMS opens this URL in a popup. The popup posts a message
  // back to the opener with the auth result, then closes itself.
  return new Response(
    `<!DOCTYPE html><html><body><script>
      (function() {
        function receiveMessage(e) {
          window.opener.postMessage(
            'authorization:${provider}:${type}:${JSON.stringify(content)}',
            e.origin
          );
          window.removeEventListener('message', receiveMessage, false);
        }
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:${provider}', '*');
      })();
    </script></body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

export default async (req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response('OAuth not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET env vars in Netlify.', { status: 500 });
  }

  // Route: /api/auth — kick off OAuth flow by redirecting to GitHub
  if (pathname.endsWith('/api/auth') || pathname === '/api/auth/') {
    const provider = url.searchParams.get('provider') || 'github';
    if (!ALLOWED_PROVIDERS.includes(provider)) {
      return new Response('Unsupported provider.', { status: 400 });
    }
    const state = btoa(JSON.stringify({ provider, site_id: url.host }));
    const redirectUri = `${url.origin}/api/auth/callback`;
    const ghUrl = new URL('https://github.com/login/oauth/authorize');
    ghUrl.searchParams.set('client_id', clientId);
    ghUrl.searchParams.set('redirect_uri', redirectUri);
    ghUrl.searchParams.set('scope', SCOPE);
    ghUrl.searchParams.set('state', state);
    return Response.redirect(ghUrl.toString(), 302);
  }

  // Route: /api/auth/callback — GitHub redirects here with ?code=...
  if (pathname.endsWith('/api/auth/callback') || pathname.endsWith('/api/auth/callback/')) {
    const code = url.searchParams.get('code');
    const stateRaw = url.searchParams.get('state');
    if (!code) {
      return new Response('Missing code parameter.', { status: 400 });
    }
    let provider = 'github';
    try {
      provider = JSON.parse(atob(stateRaw)).provider || 'github';
    } catch {}

    // Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });
    const data = await tokenRes.json();
    if (data.error) {
      return htmlResponse(provider, 'error', { message: data.error_description || data.error });
    }
    return htmlResponse(provider, 'success', { token: data.access_token, provider });
  }

  return new Response('Not found.', { status: 404 });
};

// Netlify Functions v2 (Edge-compatible) config
export const config = {
  path: ['/api/auth', '/api/auth/*'],
};
