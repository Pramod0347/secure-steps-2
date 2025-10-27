import { EmailContent, EmailContentType } from "./types";

export class EmailTemplates {
  // Verification OTP Template with Modern Design
  static verificationOTP(email: string, otp: string): EmailContentType {
    const template = {
      to: email,
      subject: "Email Verification OTP",
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
              .container { 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px; 
                background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              .otp-box {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                margin: 20px 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div style="text-align: center; color: white;">
                <h1>Email Verification</h1>
              </div>
              <div class="otp-box">
                <p>Your One-Time Password (OTP) is:</p>
                <h2 style="color: #ff6b6b; letter-spacing: 5px;">${otp}</h2>
                <p style="font-size: 0.9em; color: #666;">
                  This code will expire in 10 minutes. Do not share it with anyone.
                </p>
              </div>
              <p style="text-align: center; color: white;">
                If you didn't request this verification, please ignore this email.
              </p>
            </div>
          </body>
        </html>
      `
    };
    return EmailContent.parse(template);
  }

  // Welcome Email Template with Vibrant Design
  static welcomeEmail(email: string, username: string): EmailContentType {
    const template = {
      to: email,
      subject: "Welcome to Our Platform!",
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
              .container { 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 10px;
                color: white;
                text-align: center;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              .welcome-content {
                background-color: rgba(255,255,255,0.1);
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
              }
              .cta-button {
                display: inline-block;
                background-color: #48bb78;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Welcome, ${username}!</h1>
              <div class="welcome-content">
                <p>We're thrilled to have you join our community. Get ready to explore amazing features and connect with others!</p>
                <p>Your journey starts now. Click the button below to get started:</p>
                <a href="https://securestepsltd.co.uk/" class="cta-button">Start Exploring</a>
              </div>
              <p style="font-size: 0.9em;">
                If you have any questions, please don't hesitate to contact our support team.
              </p>
            </div>
          </body>
        </html>
      `
    };
    return EmailContent.parse(template);
  }

  // Password Reset Template with Clean Design
  static passwordReset(email: string, resetLink: string): EmailContentType {
    const template = {
      to: email,
      subject: "Password Reset Request",
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
              .container { 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px; 
                background-color: #f4f4f4;
                border-radius: 10px;
                text-align: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .reset-button {
                display: inline-block;
                background-color: #3182ce;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Password Reset</h1>
              <p>You have requested to reset your password. Click the button below to proceed:</p>
              <a href="${resetLink}" class="reset-button">Reset Password</a>
              <p style="font-size: 0.9em; color: #666;">
                If you didn't request a password reset, please ignore this email or contact support.
              </p>
              <p style="font-size: 0.8em; color: #999;">
                This link will expire in 1 hour for your security.
              </p>
            </div>
          </body>
        </html>
      `
    };
    return EmailContent.parse(template);
  }

  // Transaction Confirmation Template
  static transactionConfirmation(email: string, details: {
    transactionId: string, 
    amount: number, 
    date: string
  }): EmailContentType {
    const template = {
      to: email,
      subject: "Transaction Confirmation",
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
              .container { 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px; 
                background-color: #e9ecef;
                border-radius: 10px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .transaction-details {
                background-color: white;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1 style="color: #28a745;">Transaction Confirmed</h1>
              <div class="transaction-details">
                <p><strong>Transaction ID:</strong> ${details.transactionId}</p>
                <p><strong>Amount:</strong> $${details.amount.toFixed(2)}</p>
                <p><strong>Date:</strong> ${details.date}</p>
              </div>
              <p>Thank you for your transaction. If you have any questions, please contact our support team.</p>
            </div>
          </body>
        </html>
      `
    };
    return EmailContent.parse(template);
  }


  // general message
  static generalMessage(email: string, messageDetails: {
    subject: string,
    heading: string,
    message: string,
    ctaText?: string,
    ctaLink?: string
  }): EmailContentType {
    const template = {
      to: email,
      subject: messageDetails.subject,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { 
                font-family: 'Arial', sans-serif; 
                line-height: 1.6; 
                color: #333; 
                background-color: #f4f4f4;
              }
              .container { 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px; 
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 1px solid #e0e0e0;
              }
              .content {
                padding: 20px 0;
              }
              .cta-button {
                display: inline-block;
                background-color: #3182ce;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
              }
              .footer {
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
                font-size: 0.9em;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>${messageDetails.heading}</h1>
              </div>
              <div class="content">
                <p>${messageDetails.message}</p>
                ${messageDetails.ctaText && messageDetails.ctaLink ? `
                  <div style="text-align: center;">
                    <a href="${messageDetails.ctaLink}" class="cta-button">${messageDetails.ctaText}</a>
                  </div>
                ` : ''}
              </div>
              <div class="footer">
                <p>If you have any questions, please contact our support team.</p>
              </div>
            </div>
          </body>
        </html>
      `
    };
    return EmailContent.parse(template);
  }
  
}

