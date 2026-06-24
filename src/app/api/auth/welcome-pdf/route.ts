import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    const doc = new jsPDF();
    
    // Add content to PDF
    doc.setFontSize(24);
    doc.setTextColor(217, 119, 6); // Gold color
    doc.text('Welcome to Wolf Trading', 20, 30);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Dear ${name || 'Trader'},`, 20, 50);
    
    doc.setFontSize(12);
    doc.text('Thank you for joining our exclusive trading community.', 20, 70);
    doc.text('Your account is currently pending approval from our admin team.', 20, 85);
    doc.text('You will receive an email notification once your account is approved.', 20, 100);
    
    doc.setFontSize(14);
    doc.setTextColor(217, 119, 6);
    doc.text('What to Expect:', 20, 125);
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('• Expert market analysis and trading strategies', 25, 140);
    doc.text('• Real-time trading alerts and opportunities', 25, 155);
    doc.text('• Educational resources and webinars', 25, 170);
    doc.text('• Access to our exclusive community of traders', 25, 185);
    doc.text('• Risk management guidance', 25, 200);
    
    doc.setFontSize(14);
    doc.setTextColor(217, 119, 6);
    doc.text('Team Guidelines:', 20, 225);
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('• Maintain professional conduct at all times', 25, 240);
    doc.text('• Respect other members and their opinions', 25, 255);
    doc.text('• Do not share proprietary information externally', 25, 270);
    doc.text('• Follow risk management principles', 25, 285);
    doc.text('• Report any suspicious activity immediately', 25, 300);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('For questions or support, contact us at: support@wolftrading.com', 20, 330);
    
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('© 2024 Wolf Trading. All rights reserved.', 20, 350);
    
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="wolf-trading-welcome-package.pdf"',
      },
    });
    
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
