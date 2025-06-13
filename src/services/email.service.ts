interface EmailResponse {
  status: string;
  messageId: string;
}

export async function sendEmail(recipient: string, title: string, body: string): Promise<EmailResponse> {
  try {
    const response = await fetch('https://hook.eu2.make.com/kirutl3artxkhkjaf5o9y3j8kecg8opx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipient,
        title,
        body
      })
    });

    if (!response.ok) {
      throw new Error(`Email service error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}