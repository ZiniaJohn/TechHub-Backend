export const teacherApprovalTemplate = (frontendUrl) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Instructor Application Approved - Techhub</title>
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
            color: #4caf50;
          }
          p {
            color: #555;
            line-height: 1.6;
          }
          .action-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
          .action-button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Congratulations, You're Now an Instructor!</h1>
          <p>We are pleased to inform you that your application to become an instructor at Techhub has been approved. You can now start uploading courses and sharing your knowledge with learners around the world.</p>
          <p>Click the button below to log in and access your instructor dashboard:</p>
          <p>Thank you for choosing Techhub! We're excited to have you on board.</p>
        </div>
      </body>
      </html>
    `;
};
