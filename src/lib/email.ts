import nodemailer from 'nodemailer';

// Check if SMTP is configured
function isSmtpConfigured(): boolean {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD
  );
}

// Create transporter only if SMTP is configured
function getTransporter() {
  if (!isSmtpConfigured()) {
    console.log('[EMAIL] SMTP not configured - email sending disabled');
    return null;
  }

  console.log('[EMAIL] Creating SMTP transporter with config:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || '587',
    user: process.env.SMTP_USER,
  });

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

export async function sendApprovalEmail(
  email: string,
  fullName: string,
  status: 'approved' | 'rejected' | 'suspended'
) {
  console.log('[EMAIL] sendApprovalEmail started:', { email, fullName, status });

  // Check if SMTP is configured
  if (!isSmtpConfigured()) {
    console.log('[EMAIL] SMTP not configured - skipping email send');
    return false;
  }

  const transporter = getTransporter();
  if (!transporter) {
    console.log('[EMAIL] No transporter available - skipping email send');
    return false;
  }

  const subject = status === 'approved' 
    ? 'Welcome to Wolf Trading - Account Approved!'
    : status === 'rejected'
    ? 'Wolf Trading - Account Application Status'
    : 'Wolf Trading - Account Suspended';

  const html = status === 'approved'
    ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #d97706 0%, #b45309 100%); padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Wolf Trading!</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Dear ${fullName},
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Congratulations! Your account has been approved and you now have full access to the Wolf Trading platform.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            You can now log in to access:
          </p>
          <ul style="color: #374151; font-size: 16px; line-height: 1.6; padding-left: 20px;">
            <li>Real-time trading strategies and analysis</li>
            <li>Exclusive educational resources</li>
            <li>Market reports and insights</li>
            <li>Community of professional traders</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/login" style="background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Log In Now
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            If you have any questions, please don't hesitate to contact us at support@wolftrading.com
          </p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
          <p>© 2024 Wolf Trading. All rights reserved.</p>
        </div>
      </div>
    `
    : status === 'rejected'
    ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #dc2626; padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Account Application Status</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Dear ${fullName},
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Thank you for your interest in joining Wolf Trading. After careful review of your application, we regret to inform you that we are unable to approve your account at this time.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            This decision is based on our current capacity and selection criteria. We encourage you to apply again in the future.
          </p>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            If you have any questions, please contact us at support@wolftrading.com
          </p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
          <p>© 2024 Wolf Trading. All rights reserved.</p>
        </div>
      </div>
    `
    : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #7c3aed; padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Account Suspended</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Dear ${fullName},
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Your Wolf Trading account has been suspended due to a violation of our terms of service or community guidelines.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            If you believe this is an error or would like to discuss this suspension, please contact our support team.
          </p>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            Contact us at support@wolftrading.com
          </p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
          <p>© 2024 Wolf Trading. All rights reserved.</p>
        </div>
      </div>
    `;

  try {
    console.log('[EMAIL] Sending email to:', email);
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@wolftrading.com',
      to: email,
      subject,
      html,
    });
    console.log('[EMAIL] Email sent successfully to:', email);
    return true;
  } catch (error: any) {
    console.error('[EMAIL] Failed to send email:', error.message);
    console.error('[EMAIL] Error details:', error);
    return false;
  }
}

export async function sendNewRegistrationNotification(
  adminEmail: string,
  userEmail: string,
  fullName: string
) {
  console.log('[EMAIL] sendNewRegistrationNotification started:', { adminEmail, userEmail, fullName });

  // Check if SMTP is configured
  if (!isSmtpConfigured()) {
    console.log('[EMAIL] SMTP not configured - skipping email send');
    return false;
  }

  const transporter = getTransporter();
  if (!transporter) {
    console.log('[EMAIL] No transporter available - skipping email send');
    return false;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%); padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">New User Registration</h1>
      </div>
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          A new user has registered on the Wolf Trading platform:
        </p>
        <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #e5e7eb;">
          <p style="color: #374151; font-size: 16px; margin: 10px 0;">
            <strong>Name:</strong> ${fullName}
          </p>
          <p style="color: #374151; font-size: 16px; margin: 10px 0;">
            <strong>Email:</strong> ${userEmail}
          </p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL}/admin/dashboard" style="background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Review Application
          </a>
        </div>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
        <p>© 2024 Wolf Trading. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    console.log('[EMAIL] Sending registration notification to:', adminEmail);
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@wolftrading.com',
      to: adminEmail,
      subject: 'New User Registration - Wolf Trading',
      html,
    });
    console.log('[EMAIL] Registration notification sent successfully to:', adminEmail);
    return true;
  } catch (error: any) {
    console.error('[EMAIL] Failed to send notification email:', error.message);
    console.error('[EMAIL] Error details:', error);
    return false;
  }
}
