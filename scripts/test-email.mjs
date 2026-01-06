/**
 * Test script to verify SendGrid email functionality
 * Run with: node scripts/test-email.mjs
 */

import { sendWelcomeEmail } from '../server/services/emailService.ts';

async function testEmail() {
  console.log('Testing SendGrid email functionality...\n');

  const testEmail = 'info.infinitycreators@gmail.com'; // Replace with your email
  const testName = 'Test User';

  console.log(`Sending welcome email to: ${testEmail}`);
  
  const success = await sendWelcomeEmail(testEmail, testName);

  if (success) {
    console.log('\n✅ Email sent successfully!');
    console.log('Check your inbox for the welcome email.');
  } else {
    console.log('\n❌ Email failed to send.');
    console.log('Check your SendGrid API key and sender verification.');
  }
}

testEmail().catch(console.error);
