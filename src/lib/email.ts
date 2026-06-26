import nodemailer from 'nodemailer';

interface SendEmailParams {
  name: string;
  email: string;
  requirement: string;
  trackingId: string;
  origin?: string;
}

interface SendEmailResult {
  success: boolean;
  previewUrl?: string;
  error?: string;
}

export async function sendLeadEmail({
  name,
  email,
  requirement,
  trackingId,
  origin,
}: SendEmailParams): Promise<SendEmailResult> {
  const appUrl = origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || 'Email Automation System <noreply@example.com>';

  let transporter;

  try {
    if (smtpHost && smtpUser && smtpPass) {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort || '587'),
        secure: smtpPort === '465',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    } else {
      console.log('No SMTP config found. Creating Nodemailer Ethereal test account...');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const trackOpenUrl = `${appUrl}/api/track/open?id=${trackingId}`;
    const trackClickUrl = `${appUrl}/api/track/click?id=${trackingId}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a202c;">
        <div style="border-bottom: 2px solid #edf2f7; padding-bottom: 20px; margin-bottom: 25px;">
          <h2 style="margin: 0; color: #3182ce; font-size: 24px; font-weight: 700;">Email Automation System</h2>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px;">Hi <strong>${name}</strong>,</p>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Thank you for reaching out to us. We have successfully received your inquiry!</p>
        
        <div style="background-color: #f7fafc; border-left: 4px solid #3182ce; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
          <p style="margin: 0; font-size: 14px; color: #4a5568; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Your Requirement:</p>
          <p style="margin: 5px 0 0 0; font-size: 16px; color: #2d3748; font-style: italic;">"${requirement}"</p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
          Our team is already reviewing your details and will get back to you shortly. To learn more about our automated AI and web solutions, click the link below:
        </p>
        
        <div style="text-align: center; margin-bottom: 35px;">
          <a href="${trackClickUrl}" style="display: inline-block; background-color: #3182ce; color: #ffffff; padding: 14px 28px; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px;">
            Learn More
          </a>
        </div>
        
        <div style="border-top: 1px solid #edf2f7; padding-top: 20px; font-size: 14px; color: #718096; line-height: 1.5;">
          <p style="margin: 0 0 5px 0;">Regards,</p>
          <p style="margin: 0; font-weight: 600; color: #4a5568;">Team Email Automation</p>
        </div>
        
        <img src="${trackOpenUrl}" width="1" height="1" alt="" style="display:none; width: 1px; height: 1px; border: 0;" />
      </div>
    `;

    const textContent = `
      Hi ${name},
      
      Thank you for reaching out. We received your requirement: "${requirement}"
      
      Learn more about our services here: ${trackClickUrl}
      
      Regards,
      Team Email Automation
    `;

    const mailOptions = {
      from: smtpFrom,
      to: email,
      subject: `Inquiry Received: ${requirement.slice(0, 30)}${requirement.length > 30 ? '...' : ''}`,
      text: textContent,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    const isEthereal = !smtpHost;
    const previewUrl = isEthereal ? nodemailer.getTestMessageUrl(info) || undefined : undefined;

    if (isEthereal) {
      console.log('Preview URL: %s', previewUrl);
    }

    return {
      success: true,
      previewUrl,
    };
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred while sending email.',
    };
  }
}
