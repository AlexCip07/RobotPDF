<script>
  // Component logic goes here
  let title = "Dashboard";
</script>

<main>
  <h1>{title}</h1>
  
  <div class="dashboard-content">
    <section class="card">
      <h2>Welcome to your Dashboard</h2>
      <p>This is your new dashboard page. You can add your content here.</p>
    </section>
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 2em;
    font-weight: 100;
  }

  .dashboard-content {
    margin-top: 2em;
  }

  .card {
    background: #fff;
    border-radius: 8px;
    padding: 1.5em;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin: 1em 0;
  }

  h2 {
    color: #333;
    font-size: 1.5em;
    margin-bottom: 0.5em;
  }

  p {
    color: #666;
    line-height: 1.5;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style> 