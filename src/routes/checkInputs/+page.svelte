<script lang="ts">
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  // Format date for display
  function formatDate(date: Date | string): string {
    return new Date(date).toLocaleString();
  }
</script>

<div class="container">
  <h1>Database Connection Status</h1>
  
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
</style> 