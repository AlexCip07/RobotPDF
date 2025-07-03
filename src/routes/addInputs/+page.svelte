<script lang="ts">
  import type { PageData } from './$types';
  
  export let data: PageData;
</script>

<div class="container">
  <h1>Add User with Constants</h1>
  
  <div class="status-section">
    <h2>{data.success ? '✅ ' + data.message : '❌ ' + data.message}</h2>
    
    {#if data.user}
      <table>
        <tbody>
          <tr>
            <td><strong>Email:</strong></td>
            <td>{data.user.email}</td>
          </tr>
          <tr>
            <td><strong>Username:</strong></td>
            <td>{data.user.username}</td>
          </tr>
          <tr>
            <td><strong>First Name:</strong></td>
            <td>{data.user.firstName}</td>
          </tr>
          <tr>
            <td><strong>Last Name:</strong></td>
            <td>{data.user.lastName}</td>
          </tr>
          {#if data.user.id}
            <tr>
              <td><strong>ID:</strong></td>
              <td>{data.user.id}</td>
            </tr>
          {/if}
          {#if data.user.createdAt}
            <tr>
              <td><strong>Created At:</strong></td>
              <td>{new Date(data.user.createdAt).toLocaleString()}</td>
            </tr>
          {/if}
        </tbody>
      </table>
    {/if}
    
    {#if data.error}
      <table>
        <tbody>
          <tr>
            <td><strong>Error:</strong></td>
            <td>{data.error}</td>
          </tr>
        </tbody>
      </table>
    {/if}
  </div>
 
</div>

<style>
  * {
    box-sizing: border-box;
  }
  
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    background: white;
    color: black;
  }
  
  h1, h2, h3 {
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
  
  h3 {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .status-section {
    margin-bottom: 30px;
  }
  
  .info-section {
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
  
  p {
    margin: 10px 0;
  }
  
  strong {
    font-weight: bold;
  }
</style> 