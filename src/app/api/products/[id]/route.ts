import { productsAPI } from '@/firebase/collections';
import { NextResponse } from 'next/server';


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const product = await productsAPI.getById(id);
    if (product) {
      return NextResponse.json(product);
    } else {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}