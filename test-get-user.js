// Script to fetch a user by ID
const userId = 1; // The ID of the user we just created

fetch(`http://localhost:5173/user?id=${userId}`)
  .then(response => response.json())
  .then(data => {
    console.log('User details:');
    console.log('-------------');
    console.log('ID:', data.id);
    console.log('Email:', data.email);
    console.log('Username:', data.username);
    console.log('First Name:', data.firstName);
    console.log('Last Name:', data.lastName);
    console.log('Created:', new Date(data.createdAt).toLocaleString());
    console.log('Updated:', new Date(data.updatedAt).toLocaleString());
  })
  .catch(error => {
    console.error('Failed to fetch user:', error);
  }); 