import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, context } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are Kejahub AI Property Agent for independent Kenyan landlords. You operate under strict human-in-the-loop safety policies (mass WhatsApp reminders, high-cost repairs, and rent waivers require human landlord approval). Respond concisely to the landlord inquiry based on this context:
Context: ${JSON.stringify(context || {})}
User query: ${message}`,
        });

        const text = response.text || 'Understood. I have audited your portfolio records.';
        return NextResponse.json({
          response: text,
          provider: 'GEMINI_SERVER_SIDE',
        });
      } catch (err: any) {
        // Fall back to deterministic local domain intelligence
      }
    }

    // Deterministic Domain Grounded Response
    const lower = (message || '').toLowerCase();
    let text = '';
    let suggestedAction: { label: string; screen: string } | undefined;

    if (lower.includes('unallocated') || lower.includes('mpesa') || lower.includes('m-pesa') || lower.includes('match')) {
      text = 'I identified 2 unallocated M-Pesa receipts (totaling KES 83,000) on Paybill 522522 with high correlation to Unit B2 (Fatuma Mohammed) and Villa G1 (John Ngugi). Would you like to review and approve reconciliation?';
      suggestedAction = { label: 'Reconcile Transactions', screen: 'payments' };
    } else if (lower.includes('attention') || lower.includes('summarize') || lower.includes('overview') || lower.includes('status')) {
      text = 'Portfolio Health Summary:\n• 80% Occupancy across registered units\n• KES 301,000 collected of KES 609,500 target\n• 6 tenants in grace-period or overdue arrears\n• 1 high-priority maintenance ticket awaiting approval (Water Booster Pump KES 28,500)';
      suggestedAction = { label: 'Open Overview Dashboard', screen: 'overview' };
    } else if (lower.includes('reminder') || lower.includes('arrears') || lower.includes('overdue')) {
      text = 'I have prepared polite personalized WhatsApp rent reminders for 3 tenants with overdue balances past the 5-day grace period. Human approval is required prior to message dispatch.';
      suggestedAction = { label: 'Approve WhatsApp Reminders', screen: 'agent' };
    } else if (lower.includes('maintenance') || lower.includes('pump') || lower.includes('repair')) {
      text = 'Kilimani Heights has 1 work order exceeding your KES 10,000 sign-off threshold: "Water pump booster pressure failure" (Estimate: KES 28,500 by Pwani Hydraulics).';
      suggestedAction = { label: 'Review Maintenance Ticket', screen: 'maintenance' };
    } else {
      text = 'I can help you reconcile M-Pesa statements, draft arrears follow-ups, evaluate fundi quotes, audit expiring leases, or generate tax-ready reports.';
      suggestedAction = { label: 'View Agent Workspace', screen: 'agent' };
    }

    return NextResponse.json({
      response: text,
      suggestedAction,
      provider: 'DETERMINISTIC_DOMAIN_AGENT',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to process agent request' },
      { status: 500 }
    );
  }
}
