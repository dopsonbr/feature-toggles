/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../../lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featureId = searchParams.get('featureId');
    const groupId = searchParams.get('groupId');
    const productId = searchParams.get('productId');
    const environmentId = searchParams.get('environmentId');

    const where: any = {};
    if (featureId) where.featureId = featureId;
    if (groupId) where.groupId = groupId;
    if (productId) where.productId = productId;
    if (environmentId) where.environmentId = environmentId;

    const toggles = await prisma.activeGroupFeatureToggle.findMany({
      where,
      include: {
        feature: true,
        group: true,
        product: true,
        environment: true,
      },
      orderBy: { createTs: 'desc' }
    });
    return NextResponse.json(toggles);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch toggles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const toggle = await prisma.activeGroupFeatureToggle.create({
      data: {
        featureId: body.featureId,
        groupId: body.groupId,
        productId: body.productId,
        environmentId: body.environmentId,
      },
      include: {
        feature: true,
        group: true,
        product: true,
        environment: true,
      }
    });
    return NextResponse.json(toggle, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create toggle' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { oldData, newData } = body;

    // Delete the old toggle
    await prisma.activeGroupFeatureToggle.delete({
      where: {
        featureId_groupId_productId_environmentId: {
          featureId: oldData.featureId,
          groupId: oldData.groupId,
          productId: oldData.productId,
          environmentId: oldData.environmentId
        }
      }
    });

    // Create the new toggle
    const toggle = await prisma.activeGroupFeatureToggle.create({
      data: {
        featureId: newData.featureId,
        groupId: newData.groupId,
        productId: newData.productId,
        environmentId: newData.environmentId,
      },
      include: {
        feature: true,
        group: true,
        product: true,
        environment: true,
      }
    });

    return NextResponse.json(toggle);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update toggle' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featureId = searchParams.get('featureId');
    const groupId = searchParams.get('groupId');
    const productId = searchParams.get('productId');
    const environmentId = searchParams.get('environmentId');

    if (!featureId || !groupId || !productId || !environmentId) {
      return NextResponse.json({ error: 'All IDs are required' }, { status: 400 });
    }

    await prisma.activeGroupFeatureToggle.delete({
      where: {
        featureId_groupId_productId_environmentId: {
          featureId,
          groupId,
          productId,
          environmentId
        }
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete toggle' }, { status: 500 });
  }
}
