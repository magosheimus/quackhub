import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2'

const BUCKET = 'task-attachments'
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

async function removeUserFiles(admin: SupabaseClient, userId: string) {
  const bucket = admin.storage.from(BUCKET)
  const { data: folders, error } = await bucket.list(userId, { limit: 1000 })
  if (error) {
    console.error(`list ${userId}: ${error.message}`)
    return
  }
  for (const folder of folders) {
    const prefix = `${userId}/${folder.name}`
    const { data: files, error: listError } = await bucket.list(prefix, {
      limit: 1000,
    })
    if (listError) {
      console.error(`list ${prefix}: ${listError.message}`)
      continue
    }
    if (files.length === 0) {
      continue
    }
    const { error: removeError } = await bucket.remove(
      files.map((file) => `${prefix}/${file.name}`),
    )
    if (removeError) {
      console.error(`remove ${prefix}: ${removeError.message}`)
    }
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: 'server misconfigured' }, 500)
  }
  const admin = createClient(supabaseUrl, serviceRoleKey)

  const token = req.headers.get('Authorization')?.replace('Bearer ', '') ?? ''
  const { data, error: userError } = await admin.auth.getUser(token)
  if (userError || !data.user) {
    return json({ error: 'unauthorized' }, 401)
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(data.user.id)
  if (deleteError) {
    return json({ error: deleteError.message }, 500)
  }

  await removeUserFiles(admin, data.user.id)
  return json({ ok: true }, 200)
})
