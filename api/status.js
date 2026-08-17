// netlify/functions/status.js
// Looks up a transaction's status by id. Called by the frontend while polling.
// Usage: /.netlify/functions/status?id=<transactionId>

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.PAYLOR_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'PAYLOR_API_KEY is not configured' }) };
  }

  const id = event.queryStringParameters && event.queryStringParameters.id;
  if (!id) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing id query parameter' }) };
  }

  try {
    const response = await fetch(
      `https://api.paylorke.com/api/v1/merchants/payments/transactions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

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
