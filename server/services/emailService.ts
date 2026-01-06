import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key from environment
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'info.infinitycreators@gmail.com';
const FROM_NAME = 'Infinity Creators';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn('[EmailService] SENDGRID_API_KEY not configured. Emails will not be sent.');
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using SendGrid
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.warn('[EmailService] Email not sent (no API key):', options.subject);
    return false;
  }

  try {
    await sgMail.send({
      to: options.to,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    });

    console.log('[EmailService] Email sent successfully to:', options.to);
    return true;
  } catch (error) {
    console.error('[EmailService] Failed to send email:', error);
    return false;
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(userEmail: string, userName: string | null): Promise<boolean> {
  const displayName = userName || 'Creator';
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%); color: #D4AF37; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; padding: 12px 30px; background: #D4AF37; color: #1A1A1A; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .credits-box { background: #fff; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✨ Welcome to Infinity Creators!</h1>
    </div>
    <div class="content">
      <p>Hi ${displayName},</p>
      
      <p>Welcome to <strong>Infinity Creators</strong> – your AI-powered viral shorts script generator! 🚀</p>
      
      <div class="credits-box">
        <h3 style="margin-top: 0; color: #D4AF37;">🎁 Your Free Trial</h3>
        <p>We've added <strong>3 free credits</strong> to your account to get you started. Each credit generates one complete viral shorts script with automatic affiliate links!</p>
      </div>
      
      <p><strong>What you can do with Infinity Creators:</strong></p>
      <ul>
        <li>Generate engaging scripts in 30 seconds</li>
        <li>Automatic affiliate links to monetize your content</li>
        <li>Choose from multiple tones (Professional, Casual, Humorous)</li>
        <li>Perfect for YouTube Shorts, TikTok, and Instagram Reels</li>
      </ul>
      
      <center>
        <a href="https://infinity-creators.com/generator" class="button">Start Generating Scripts</a>
      </center>
      
      <p>Need more credits? Check out our <a href="https://infinity-creators.com/pricing" style="color: #D4AF37;">pricing plans</a> for one-time purchases or monthly subscriptions.</p>
      
      <p>If you have any questions, feel free to reply to this email. We're here to help!</p>
      
      <p>Happy creating! 🎬<br>
      <strong>The Infinity Creators Team</strong></p>
    </div>
    
    <div class="footer">
      <p>Infinity Creators | info.infinitycreators@gmail.com<br>
      <a href="https://infinity-creators.com/privacy-policy.html" style="color: #666;">Privacy Policy</a> | 
      <a href="https://infinity-creators.com/terms-of-service.html" style="color: #666;">Terms of Service</a></p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: userEmail,
    subject: '✨ Welcome to Infinity Creators - 3 Free Credits Inside!',
    html,
  });
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmationEmail(
  userEmail: string,
  userName: string | null,
  creditsAdded: number,
  amountPaid: number
): Promise<boolean> {
  const displayName = userName || 'Creator';
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%); color: #D4AF37; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .receipt { background: #fff; border: 2px solid #D4AF37; padding: 20px; margin: 20px 0; border-radius: 5px; }
    .receipt-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .receipt-row:last-child { border-bottom: none; font-weight: bold; }
    .button { display: inline-block; padding: 12px 30px; background: #D4AF37; color: #1A1A1A; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Payment Confirmed!</h1>
    </div>
    <div class="content">
      <p>Hi ${displayName},</p>
      
      <p>Thank you for your purchase! Your payment has been successfully processed, and your credits have been added to your account. 🎉</p>
      
      <div class="receipt">
        <h3 style="margin-top: 0; color: #D4AF37;">Receipt</h3>
        <div class="receipt-row">
          <span>Credits Purchased:</span>
          <span><strong>${creditsAdded} credits</strong></span>
        </div>
        <div class="receipt-row">
          <span>Amount Paid:</span>
          <span><strong>$${(amountPaid / 100).toFixed(2)}</strong></span>
        </div>
        <div class="receipt-row">
          <span>Payment Method:</span>
          <span>Credit Card (via Stripe)</span>
        </div>
      </div>
      
      <p>Your credits are now available and ready to use. Start generating viral shorts scripts right away!</p>
      
      <center>
        <a href="https://infinity-creators.com/generator" class="button">Start Generating</a>
      </center>
      
      <p>You can view your credit balance and transaction history anytime in your <a href="https://infinity-creators.com/dashboard" style="color: #D4AF37;">dashboard</a>.</p>
      
      <p>Questions about your purchase? Reply to this email and we'll help you out!</p>
      
      <p>Happy creating! 🎬<br>
      <strong>The Infinity Creators Team</strong></p>
    </div>
    
    <div class="footer">
      <p>Infinity Creators | info.infinitycreators@gmail.com<br>
      <a href="https://infinity-creators.com/privacy-policy.html" style="color: #666;">Privacy Policy</a> | 
      <a href="https://infinity-creators.com/terms-of-service.html" style="color: #666;">Terms of Service</a></p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: userEmail,
    subject: `✅ Payment Confirmed - ${creditsAdded} Credits Added`,
    html,
  });
}

/**
 * Send subscription confirmation email
 */
export async function sendSubscriptionConfirmationEmail(
  userEmail: string,
  userName: string | null,
  plan: 'pro' | 'agency',
  creditsPerMonth: number
): Promise<boolean> {
  const displayName = userName || 'Creator';
  const planName = plan === 'pro' ? 'Pro' : 'Agency';
  const planPrice = plan === 'pro' ? '$29' : '$99';
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%); color: #D4AF37; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .plan-box { background: #fff; border: 2px solid #D4AF37; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center; }
    .button { display: inline-block; padding: 12px 30px; background: #D4AF37; color: #1A1A1A; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Subscription Activated!</h1>
    </div>
    <div class="content">
      <p>Hi ${displayName},</p>
      
      <p>Welcome to the <strong>${planName} Plan</strong>! Your subscription is now active and your monthly credits have been added. 🎉</p>
      
      <div class="plan-box">
        <h2 style="color: #D4AF37; margin-top: 0;">${planName} Plan</h2>
        <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${planPrice}/month</p>
        <p style="font-size: 18px; color: #666;">${creditsPerMonth} credits per month</p>
      </div>
      
      <p><strong>What's included:</strong></p>
      <ul>
        <li>${creditsPerMonth} credits automatically renewed each month</li>
        <li>Unlimited script generations (while credits last)</li>
        <li>Automatic affiliate link insertion</li>
        <li>Priority support</li>
        <li>Cancel anytime</li>
      </ul>
      
      <center>
        <a href="https://infinity-creators.com/generator" class="button">Start Generating</a>
      </center>
      
      <p>Your subscription will automatically renew on the same day each month. You can manage or cancel your subscription anytime from your <a href="https://infinity-creators.com/dashboard" style="color: #D4AF37;">dashboard</a>.</p>
      
      <p>Questions? Reply to this email and we'll be happy to help!</p>
      
      <p>Happy creating! 🎬<br>
      <strong>The Infinity Creators Team</strong></p>
    </div>
    
    <div class="footer">
      <p>Infinity Creators | info.infinitycreators@gmail.com<br>
      <a href="https://infinity-creators.com/privacy-policy.html" style="color: #666;">Privacy Policy</a> | 
      <a href="https://infinity-creators.com/terms-of-service.html" style="color: #666;">Terms of Service</a></p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: userEmail,
    subject: `🚀 ${planName} Subscription Activated - ${creditsPerMonth} Credits Added`,
    html,
  });
}
