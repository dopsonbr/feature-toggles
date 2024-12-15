import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      orderBy: { createTs: 'desc' }
    });
    return NextResponse.json(groups);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const group = await prisma.group.create({
      data: {
        name: body.name,
        description: body.description,
        owner: body.owner,
      }
    });
    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const group = await prisma.group.update({
      where: { id: body.id },
      data: {
        name: body.name,
        description: body.description,
        owner: body.owner,
      }
    });
    return NextResponse.json(group);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update group' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
    }
    await prisma.group.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete group' }, { status: 500 });
  }
}
