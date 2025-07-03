<script lang="ts">
  /** @type {import('./$types').PageData} */
  export let data;
  
  // Format date for display
  function formatDate(date: Date | string): string {
    return new Date(date).toLocaleString();
  }

  let message = '';
  let messageType = '';

  async function handleDelete(userId: number) {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    const form = new FormData();
    form.append('userId', userId.toString());

    try {
      const response = await fetch('?/deleteUser', {
        method: 'POST',
        body: form
      });
      window.location.href = '/checkInputs';
    } catch (error) {
      message = 'Failed to delete user';
      messageType = 'error';
    }
  }

  async function handleToggleAdmin(userId: number, currentAdminStatus: boolean) {
    const form = new FormData();
    form.append('userId', userId.toString());
    form.append('adminStatus', (!currentAdminStatus).toString());

    try {
      const response = await fetch('?/toggleAdmin', {
        method: 'POST',
        body: form
      });
      window.location.href = '/checkInputs';
    } catch (error) {
      message = 'Failed to update admin status';
      messageType = 'error';
    }
  }
</script>

<div class="container">
  <div class="top-nav">
    <button class="welcome-btn" on:click={() => window.location.href = '/welcome'}>
      Go to Welcome Page
    </button>
    {#if data.currentUser}
      <div class="user-info">
        <p>Mr. {data.currentUser.firstName}</p>
      </div>
    {/if}
  </div>

  <h1>Database Connection Status</h1>
  
  {#if message}
    <div class="message {messageType}">
      {message}
    </div>
  {/if}

  <!-- Connection Status -->
  <div class="status-section">
    <h2>{data.status === 'success' ? '✅ ' + data.message : '❌ Database Connection Error'}</h2>
    
    <table>
      <tbody>
        <tr>
          <td><strong>Timestamp:</strong></td>
          <td>{formatDate(data.connectionInfo.timestamp)}</td>
        </tr>
        <tr>
          <td><strong>Total Users:</strong></td>
          <td>{data.connectionInfo.userCount}</td>
        </tr>
        {#if data.status === 'error' && data.connectionInfo.errorDetails}
          <tr>
            <td><strong>Error Type:</strong></td>
            <td>{data.connectionInfo.errorDetails.name}</td>
          </tr>
          <tr>
            <td><strong>Error Message:</strong></td>
            <td>{data.connectionInfo.errorDetails.message}</td>
          </tr>
        {/if}
      </tbody>
    </table>
    
    {#if data.status === 'error' && data.connectionInfo.errorDetails?.stack}
      <details>
        <summary>Stack Trace</summary>
        <pre>{data.connectionInfo.errorDetails.stack}</pre>
      </details>
    {/if}
  </div>
  
  <!-- Users Table -->
  {#if data.status === 'success' && data.users.length > 0}
    <div class="users-section">
      <h2>Users in Database</h2>
      <table class="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Admin</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each data.users as user}
            <tr>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.admin ? '✅ Yes' : '❌ No'}</td>
              <td>{formatDate(user.createdAt)}</td>
              <td>{formatDate(user.updatedAt)}</td>
              <td class="actions">
                {#if user.id !== data.currentUser.id && !user.admin}
                  <button 
                    class="delete-btn" 
                    on:click={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                {/if}
                <button 
                  class="admin-btn {user.admin ? 'revoke' : 'grant'}"
                  on:click={() => handleToggleAdmin(user.id, user.admin)}
                  disabled={user.id === data.currentUser.id}
                >
                  {user.admin ? 'Revoke Admin' : 'Make Admin'}
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else if data.status === 'success' && data.users.length === 0}
    <p>Database is connected but no users found.</p>
  {/if}
  
  <!-- Raw Data View -->
  <details>
    <summary>View Raw Data</summary>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </details>
</div>

<style>
  * {
    box-sizing: border-box;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    background: white;
    color: black;
  }
  
  h1, h2 {
    color: black;
    font-weight: normal;
  }
  
  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .status-section {
    margin-bottom: 30px;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 10px;
  }
  
  table td {
    padding: 8px;
    border: 1px solid black;
  }
  
  .users-section {
    margin-bottom: 30px;
  }
  
  .users-table {
    width: 100%;
    border: 1px solid black;
  }
  
  .users-table th,
  .users-table td {
    padding: 8px;
    text-align: left;
    border: 1px solid black;
  }
  
  .users-table th {
    font-weight: bold;
  }
  
  details {
    margin-top: 20px;
  }
  
  summary {
    cursor: pointer;
    margin-bottom: 10px;
  }
  
  pre {
    overflow-x: auto;
    padding: 10px;
    border: 1px solid black;
    background: white;
    font-family: monospace;
  }
  
  p {
    margin: 10px 0;
  }
  
  strong {
    font-weight: bold;
  }
  
  .top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
  }

  .welcome-btn {
    background-color: #28a745;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
  }

  .welcome-btn:hover {
    background-color: #218838;
  }

  .user-info {
    position: static;
  }

  .user-info p {
    margin: 0;
  }

  .message {
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 4px;
  }

  .message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .actions {
    display: flex;
    gap: 8px;
  }

  button {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .delete-btn {
    background-color: #dc3545;
    color: white;
  }

  .delete-btn:hover:not(:disabled) {
    background-color: #c82333;
  }

  .admin-btn {
    background-color: #007bff;
    color: white;
  }

  .admin-btn:hover:not(:disabled) {
    background-color: #0056b3;
  }

  .admin-btn.revoke {
    background-color: #6c757d;
  }

  .admin-btn.revoke:hover:not(:disabled) {
    background-color: #545b62;
  }
</style> 