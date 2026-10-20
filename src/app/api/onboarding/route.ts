import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { onboardingData, isCompleted = false } = body;

    // Simulate server-side validation and persistence
    if (!onboardingData) {
      return NextResponse.json({ error: 'Missing onboarding payload' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      onboardingStatus: isCompleted ? 'completed' : 'in_progress',
      savedStep: onboardingData.step || 1,
      message: isCompleted
        ? 'Landlord portfolio and workspace provisioned successfully.'
        : 'Onboarding draft saved successfully.',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save onboarding data' }, { status: 500 });
  }
}
