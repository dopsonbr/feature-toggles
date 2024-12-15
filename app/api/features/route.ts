import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const features = await prisma.feature.findMany({
      orderBy: { createTs: 'desc' }
    });
    return NextResponse.json(features);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch features' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const feature = await prisma.feature.create({
      data: {
        type: body.type,
        owner: body.owner,
        name: body.name,
        description: body.description,
        enabled: body.enabled ?? false,
      }
    });
    return NextResponse.json(feature, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create feature' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const feature = await prisma.feature.update({
      where: { id: body.id },
      data: {
        type: body.type,
        owner: body.owner,
        name: body.name,
        description: body.description,
        enabled: body.enabled,
      }
    });
    return NextResponse.json(feature);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update feature' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Feature ID is required' }, { status: 400 });
    }
    await prisma.feature.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete feature' }, { status: 500 });
  }
}
