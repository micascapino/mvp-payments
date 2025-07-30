const axios = require('axios');

async function testCreateAccount() {
  try {
    console.log('🔐 Obteniendo token de admin...');
    
    const loginResponse = await axios.post('http://localhost:3000/auth/token', {
      client_id: 'admin-client',
      client_secret: 'admin-secret-key'
    });

    const token = loginResponse.data.access_token;
    console.log('✅ Token obtenido:', token.substring(0, 20) + '...');

    console.log('\n🏦 Creando cuenta...');
    const accountData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      balance: 5000.00
    };

    const accountResponse = await axios.post('http://localhost:3000/accounts', accountData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Cuenta creada exitosamente!');
    console.log('ID:', accountResponse.data.id);
    console.log('Nombre:', accountResponse.data.name);
    console.log('Email:', accountResponse.data.email);
    console.log('Balance:', accountResponse.data.balance);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testCreateAccount(); 