import { settingsStore } from '@/lib/admin-store';

export async function GET() {
  return Response.json({ settings: settingsStore });
}

export async function PUT(req) {
  const body = await req.json();
  Object.assign(settingsStore, body);
  return Response.json({ settings: settingsStore, success: true });
}
