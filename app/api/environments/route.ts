import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const environments = await prisma.environment.findMany({
      orderBy: { createTs: 'desc' }
    });
    return NextResponse.json(environments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch environments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const environment = await prisma.environment.create({
      data: {
        name: body.name,
        description: body.description,
      }
    });
    return NextResponse.json(environment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create environment' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const environment = await prisma.environment.update({
      where: { id: body.id },
      data: {
        name: body.name,
        description: body.description,
      }
    });
    return NextResponse.json(environment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update environment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Environment ID is required' }, { status: 400 });
    }
    await prisma.environment.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete environment' }, { status: 500 });
  }
}
