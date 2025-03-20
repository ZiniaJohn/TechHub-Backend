export const teacherRejectionTemplate = () => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Instructor Application Rejected - Techhub</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            text-align: center;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #f44336;
          }
          p {
            color: #555;
            line-height: 1.6;
          }
          .help-link {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
          .help-link:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>We're Sorry, Your Application Was Not Approved</h1>
          <p>We regret to inform you that your application to become an instructor at Techhub has been rejected at this time. Please ensure that all required documents are accurate and complete before reapplying.</p>
          <p>If you have any questions or need assistance, please contact our support team.</p>
          <a href="mailto:support@techhub.com" class="help-link">Contact Support</a>
          <p>Thank you for your understanding, and we hope to work with you in the future.</p>
        </div>
      </body>
      </html>
    `;
};
