// netlify/functions/stk-push.js
// Proxies the STK Push request to Paylor so the API key never reaches the browser.

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.PAYLOR_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'PAYLOR_API_KEY is not configured' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { phone, amount, reference } = payload;
  if (!phone || !amount || !reference) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'phone, amount, and reference are required' }),
    };
  }

  try {
    const response = await fetch('https://api.paylorke.com/api/v1/merchants/payments/stk-push', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone,
        amount,
        reference,
        channelId: payload.channelId,
        description: payload.description || 'Checkout payment',
      }),
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'Failed to reach Paylor', detail: err.message }),
    };
  }
};
