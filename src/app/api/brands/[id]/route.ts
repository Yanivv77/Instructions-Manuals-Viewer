import { brandsAPI } from '@/firebase/collections';
import { NextResponse } from 'next/server';


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const brand = await brandsAPI.getById(id);
    if (brand) {
      return NextResponse.json(brand);
    } else {
      return NextResponse.json({ message: 'Brand not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching brand:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}