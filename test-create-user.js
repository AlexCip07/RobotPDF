// Script to create a new user via the API
import crypto from 'crypto';

// Generate random values
const randomUsername = 'esy_' + crypto.randomBytes(4).toString('hex');
const randomPassword = crypto.randomBytes(8).toString('hex') + 'Aa1!'; // Ensure it meets common password requirements
const randomLastName = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)];

const userData = {
  email: 'esy@yahoo.com',
  username: randomUsername,
  password: randomPassword,
  firstName: 'Esy',
  lastName: randomLastName
};

console.log('Creating user with data:');
console.log({
  ...userData,
  password: '***hidden***' // Don't log the actual password
});

// Make the POST request
fetch('http://localhost:5173/user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(userData)
})
.then(async response => {
  const data = await response.json();
  console.log('\nResponse Status:', response.status);
  console.log('Response Headers:', response.headers);
  console.log('Response Data:', data);
  
  if (!response.ok) {
    console.error('Error:', data.error || 'Unknown error');
    console.error('Status:', response.status);
  } else {
    console.log('\nUser created successfully!');
    console.log('User ID:', data.id);
    console.log('Username:', data.username);
    console.log('Full name:', data.firstName, data.lastName);
    console.log('Email:', data.email);
  }
  
  // Store credentials for reference
  console.log('\n--- Credentials for login ---');
  console.log('Username:', randomUsername);
  console.log('Password:', randomPassword);
  console.log('Email:', userData.email);
})
.catch(error => {
  console.error('Request failed:', error);
  console.error('Error details:', error.message);
}); 