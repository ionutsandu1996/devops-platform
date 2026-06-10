// email.js — Email notification service using Resend
// Called after a contact form submission is saved to the database

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendContactNotification({ name, email, subject, message }) {
    try {
        await resend.emails.send({
            from:    process.env.RESEND_FROM,
            to:      process.env.ADMIN_EMAIL,
            replyTo: email,
            // replyTo: when you click Reply in Gmail
            // it replies directly to the visitor, not to Resend
            subject: `📬 New message from ${name}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #38bdf8;">New Contact Form Message</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; font-weight: bold; color: #666;">Name</td>
                            <td style="padding: 8px;">${name}</td>
                        </tr>
                        <tr style="background: #f9f9f9;">
                            <td style="padding: 8px; font-weight: bold; color: #666;">Email</td>
                            <td style="padding: 8px;">${email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold; color: #666;">Subject</td>
                            <td style="padding: 8px;">${subject || 'No subject'}</td>
                        </tr>
                        <tr style="background: #f9f9f9;">
                            <td style="padding: 8px; font-weight: bold; color: #666; vertical-align: top;">Message</td>
                            <td style="padding: 8px;">${message}</td>
                        </tr>
                    </table>
                    <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
                    <p style="color: #999; font-size: 12px;">
                        Reply directly to this email to respond to ${name}.
                    </p>
                </div>
            `,
        });

        console.log(`✓ Email notification sent for message from ${name}`);
    } catch (err) {
        // We log the error but don't throw it
        // A failed email should NOT fail the contact form submission
        // The message is already saved in the DB — that's what matters
        console.error('✗ Failed to send email notification:', err.message);
    }
}

module.exports = { sendContactNotification };