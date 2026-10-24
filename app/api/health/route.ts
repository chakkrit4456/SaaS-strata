import { sql } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';

export const dynamic = 'force-dynamic';

// Used by deploy/healthcheck.sh and update.sh. Never include error details or config here.
export async function GET() {
  let database: 'ok' | 'error' = 'ok';
  try {
    await db.execute(sql`select 1`);
  } catch {
    database = 'error';
  }

  const healthy = database === 'ok';
  return Response.json(
    {
      status: healthy ? 'ok' : 'degraded',
      database,
      uptimeSeconds: Math.round(process.uptime()),
      time: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503, headers: { 'Cache-Control': 'no-store' } }
  );
}
