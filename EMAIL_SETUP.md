# EmailJS Setup Instructions

## Overview
The contact form is now integrated with EmailJS to send emails directly to `syedkumailraza28@gmail.com`. Follow these steps to complete the setup.

## Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service
1. After logging in, go to **Email Services** → **Add New Service**
2. Choose **Gmail** (recommended) or your preferred email service
3. Follow the connection instructions to connect your email account
4. Note your **Service ID** (it will look like `service_xxxxxxxxx`)

## Step 3: Create Email Template
1. Go to **Email Templates** → **Create New Template**
2. Use the following template settings:

### Template Name
`Contact Form Submission`

### Template Content
```
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .info { margin: 10px 0; }
        .label { font-weight: bold; color: #2c3e50; }
        .footer { margin-top: 30px; padding: 15px; background: #e9ecef; border-radius: 8px; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>New Contact Form Submission - K.K.M.A. Homestyler</h2>
        <p>You have received a new inquiry from your website contact form.</p>
    </div>

    <div class="info">
        <span class="label">Name:</span> {{from_name}}
    </div>

    <div class="info">
        <span class="label">Email:</span> {{from_email}}
    </div>

    <div class="info">
        <span class="label">Phone:</span> {{from_phone}}
    </div>

    <div class="info">
        <span class="label">Project Type:</span> {{project_type}}
    </div>

    <div class="info">
        <span class="label">Message:</span>
        <p>{{message}}</p>
    </div>

    <div class="footer">
        <p>This message was sent from the K.K.M.A. Homestyler website.</p>
        <p>Reply to: {{from_email}}</p>
    </div>
</body>
</html>
```

### Template Variables
- `{{from_name}}` - Contact person's name
- `{{from_email}}` - Contact person's email
- `{{from_phone}}` - Contact person's phone
- `{{project_type}}` - Type of project requested
- `{{message}}` - The message content
- `{{to_email}}` - Your email (syedkumailraza28@gmail.com)
- `{{reply_to}}` - Reply-to email (contact person's email)

3. Note your **Template ID** (it will look like `template_xxxxxxxxx`)

## Step 4: Get Public Key
1. Go to **Account** → **General** → **Public Key**
2. Copy your **Public Key** (it will look like `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

## Step 5: Update JavaScript
Open `script.js` and replace the placeholder values:

```javascript
// Initialize EmailJS
(function() {
    emailjs.init("YOUR_PUBLIC_KEY_HERE"); // Replace with your actual Public Key
})();

// Update these values in the contact form function:
emailjs.send('service_your_service_id', 'template_your_template_id', emailParams)
// Replace with your actual Service ID and Template ID
```

## Step 6: Update the Code
Replace the placeholder values in `script.js`:

1. **Line 19**: Replace `YOUR_PUBLIC_KEY_HERE` with your actual Public Key
2. **Line 322**: Replace `service_your_service_id` with your Service ID
3. **Line 322**: Replace `template_your_template_id` with your Template ID

## Testing
1. Save all files
2. Test the contact form by submitting a message
3. Check your email (syedkumailraza28@gmail.com) for the message
4. Verify that all form fields are correctly populated in the email

## Features
- ✅ Sends emails directly to `syedkumailraza28@gmail.com`
- ✅ Professional HTML email formatting
- ✅ Form validation and error handling
- ✅ Loading states and success/error messages
- ✅ Reply-to functionality (replies go to the contact person)
- ✅ No backend server required - works entirely client-side

## Troubleshooting
If emails are not sending:
1. Check that EmailJS is properly initialized (look for errors in browser console)
2. Verify your Service ID and Template ID are correct
3. Ensure your email service is properly connected
4. Check that all template variables are spelled correctly
5. Make sure you're not using an ad blocker that might block EmailJS

## Security Note
- EmailJS is a secure service designed for client-side email sending
- Your email credentials are never exposed to users
- All emails are sent through EmailJS's secure servers
- Consider implementing additional validation for production use