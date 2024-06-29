import { brandsAPI } from '@/firebase/collections';
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const importerId = searchParams.get('importerId');

  if (!importerId) {
    return NextResponse.json({ error: 'Importer ID is required' }, { status: 400 });
  }

  try {
    const brands = await brandsAPI.getByImporterId(importerId);
    const serializedBrands = JSON.parse(JSON.stringify(brands));
    return NextResponse.json(serializedBrands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}