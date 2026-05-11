import { testimonialsStore } from '@/lib/admin-store';

export async function GET() {
  return Response.json({ testimonials: testimonialsStore });
}

export async function POST(req) {
  const body = await req.json();
  const newId = Math.max(...testimonialsStore.map(t => t.id), 0) + 1;
  const newTestimonial = { id: newId, is_published: true, is_featured: false, rating: 5, created_at: new Date().toISOString(), ...body };
  testimonialsStore.push(newTestimonial);
  return Response.json({ testimonial: newTestimonial }, { status: 201 });
}

export async function PUT(req) {
  const body = await req.json();
  const index = testimonialsStore.findIndex(t => t.id === body.id);
  if (index === -1) return Response.json({ error: 'غير موجود' }, { status: 404 });
  testimonialsStore[index] = { ...testimonialsStore[index], ...body };
  return Response.json({ testimonial: testimonialsStore[index] });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id'));
  const index = testimonialsStore.findIndex(t => t.id === id);
  if (index === -1) return Response.json({ error: 'غير موجود' }, { status: 404 });
  testimonialsStore.splice(index, 1);
  return Response.json({ success: true });
}
