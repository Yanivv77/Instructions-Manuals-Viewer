import { NextResponse } from 'next/server';
import { importersAPI } from '@/firebase/collections/importers';

export async function GET() {
  try {
    const importers = await importersAPI.getAll();
    return NextResponse.json(importers);
  } catch (error) {
    console.error('Failed to fetch importers:', error);
    return NextResponse.json({ error: 'Failed to load importers' }, { status: 500 });
  }
}