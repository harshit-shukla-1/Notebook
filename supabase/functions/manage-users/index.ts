import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { action, username, password, role, id } = await req.json()
    console.log(`[manage-users] Action: ${action} for user: ${username || id}`);

    if (action === 'CREATE_USER') {
      const email = `${username.toLowerCase().trim()}@notebook.com`
      
      const { data: userData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { username, role }
      })

      if (authError) throw authError

      // Create profile record explicitly to ensure it exists
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert([
          { 
            id: userData.user.id, 
            username: username, 
            role: role || 'user',
            updated_at: new Date().toISOString()
          }
        ])

      if (profileError) {
        console.error("[manage-users] Profile creation error:", profileError);
        // We don't throw here because the user is already created in Auth
      }

      return new Response(JSON.stringify({ success: true, user: userData.user }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("[manage-users] Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})