import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from '@supabase/supabase-js'
import { getCorsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
    const headers = getCorsHeaders(req);

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers })
    }

    try {
        const { content, providerToken, visibility = 'PUBLIC' } = await req.json()

        if (!content) throw new Error('Content is required')
        if (!providerToken) throw new Error('LinkedIn Access Token (providerToken) is required')

        // 1. Fetch LinkedIn User URN (ID) via OIDC UserInfo endpoint
        const profileResp = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${providerToken}`,
            }
        })

        if (!profileResp.ok) {
            const errorText = await profileResp.text()
            throw new Error(`Failed to fetch LinkedIn profile (userinfo): ${profileResp.status} ${errorText}`)
        }

        const profileData = await profileResp.json()
        // The 'sub' field contains the member ID in OIDC
        const personUrn = `urn:li:person:${profileData.sub}`

        // 2. Prepare Post Body (UGC API)
        const postBody = {
            author: personUrn,
            lifecycleState: "PUBLISHED",
            specificContent: {
                "com.linkedin.ugc.ShareContent": {
                    "shareCommentary": {
                        "text": content
                    },
                    "shareMediaCategory": "NONE"
                }
            },
            visibility: {
                "com.linkedin.ugc.MemberNetworkVisibility": visibility
            }
        }

        // 3. Publish Post
        const publishResp = await fetch('https://api.linkedin.com/v2/ugcPosts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${providerToken}`,
                'X-Restli-Protocol-Version': '2.0.0',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postBody)
        })

        if (!publishResp.ok) {
            const errorText = await publishResp.text()
            throw new Error(`Failed to publish to LinkedIn: ${publishResp.status} ${errorText}`)
        }

        const publishData = await publishResp.json()

        return new Response(
            JSON.stringify({ success: true, data: publishData }),
            { headers: { ...headers, 'Content-Type': 'application/json' } }
        )

  } catch (err: unknown) {
    const error = err as Error;
    return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { headers: { ...headers, 'Content-Type': 'application/json' }, status: 200 }
    )
  }
})

