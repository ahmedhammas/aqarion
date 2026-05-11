import { messagesStore } from '@/lib/admin-store';

export async function GET() {
  const sorted = [...messagesStore].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const stats = {
    total: messagesStore.length,
    new: messagesStore.filter(m => m.status === 'new').length,
    read: messagesStore.filter(m => m.status === 'read').length,
    replied: messagesStore.filter(m => m.status === 'replied').length,
    archived: messagesStore.filter(m => m.status === 'archived').length,
  };
  return Response.json({ messages: sorted, stats });
}
