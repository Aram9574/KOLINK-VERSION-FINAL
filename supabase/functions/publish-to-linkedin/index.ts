import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
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
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
    }
})

