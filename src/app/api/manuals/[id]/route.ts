import { manualsAPI } from '@/firebase/collections';
import { NextResponse } from 'next/server';


export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  try {
    const manuals = await manualsAPI.getByProductId(productId);
    return NextResponse.json(manuals);
  } catch (error) {
    console.error('Error fetching manuals:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}