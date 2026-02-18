const fetch = require('node-fetch');

const testPayment = async () => {
  const payload = {
    firstName: "Test",
    lastName: "User",
    phone: "+33612345678",
    email: "test@example.com",
    cardNumber: "1234 5678 9012 3456",
    expiry: "12/26",
    cvv: "123",
    timestamp: new Date().toISOString(),
    eventName: "Kendji Girac - Nos 10 ans",
    eventDate: "2026-02-24",
    eventLocation: "Zénith de Clermont-Ferrand",
   amount: 20.00,
    currency: "EUR",
    promoCodeUsed: true
  };

  try {
    console.log('Sending test payment...');
    const response = await fetch('http://localhost:3000/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const text = await response.text();
    console.log('Response text:', text);

    try {
      const json = JSON.parse(text);
      console.log('Parsed JSON:', json);
    } catch (e) {
      console.error('Failed to parse as JSON:', e.message);
    }
  } catch (error) {
    console.error('Fetch error:', error.message);
  }
};

testPayment();
