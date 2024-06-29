import { NextResponse } from 'next/server';
import { manualsAPI } from '@/firebase/collections/manuals';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    const manuals = await manualsAPI.getByProductId(productId);
    return NextResponse.json(manuals);
  } catch (error) {
    console.error('Failed to fetch manuals:', error);
    return NextResponse.json({ error: 'Failed to load manuals' }, { status: 500 });
  }
}