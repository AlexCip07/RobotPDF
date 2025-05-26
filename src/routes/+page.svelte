<script>
  import * as XLSX from 'xlsx';
  import { onMount } from 'svelte';
  let extractedPairs = [];
  let errorMsg = '';
  let showChart = false;
  let chartInstance;
  let chartCanvas;
  let availableSheets = [];
  let debugRawPairs = [];

  function handleFile(event) {
    extractedPairs = [];
    errorMsg = '';
    showChart = false;
    availableSheets = [];
    debugRawPairs = [];
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      availableSheets = workbook.SheetNames;
      const sheet = workbook.Sheets['Sheet1'];
      if (!sheet) {
        errorMsg = "Sheet 'Sheet1' not found! Available sheets: " + availableSheets.join(', ');
        return;
      }
      // Find the range of the sheet
      const range = XLSX.utils.decode_range(sheet['!ref']);
      for (let row = range.s.r; row <= range.e.r; row++) {
        const tickerCell = sheet[`A${row + 1}`] ? sheet[`A${row + 1}`].v : '';
        const plCell = sheet[`C${row + 1}`] ? sheet[`C${row + 1}`].v : '';
        if (tickerCell) {
          extractedPairs.push({ e: tickerCell, k: plCell });
          debugRawPairs.push({ e: tickerCell, k: plCell });
        }
      }
      if (!extractedPairs.length) {
        errorMsg = 'No data found in column A (Ticker) of Sheet1.';
      }
    };
    reader.readAsArrayBuffer(file);
  }

  async function showTickFrequencyGraph() {
    showChart = true;
    await tick(); // Wait for DOM update
    const { Chart, registerables } = await import('chart.js');
    Chart.register(...registerables);
    // Count frequency
    const freq = {};
    for (const pair of extractedPairs) {
      if (pair.e) freq[pair.e] = (freq[pair.e] || 0) + 1;
    }
    const labels = Object.keys(freq);
    const data = Object.values(freq);
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Tick Frequency',
          data,
          backgroundColor: '#3498db',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Tick Frequency' }
        },
        scales: {
          y: { beginAtZero: true, precision: 0 }
        }
      }
    });
  }

  import { tick } from 'svelte';
  onMount(() => {
    // Clean up chart on destroy
    return () => {
      if (chartInstance) chartInstance.destroy();
    };
  });
</script>

<main>
  <h1>Excel Extractor</h1>
  <input type="file" accept=".xlsx, .xls" on:change={handleFile} />

  {#if availableSheets.length}
    <div style="margin: 1em 0; color: #888;">Available sheets: {availableSheets.join(', ')}</div>
  {/if}

  {#if errorMsg}
    <div style="color: red; margin: 1em 0;">{errorMsg}</div>
  {/if}

  {#if extractedPairs.length}
    <table style="margin: 2em auto; border-collapse: collapse; background: #fff;">
      <thead>
        <tr><th>Ticker</th><th>P/L</th></tr>
      </thead>
      <tbody>
        {#each extractedPairs as pair}
          <tr>
            <td style="border: 1px solid #ccc; padding: 0.5em 1em;">{pair.e}</td>
            <td style="border: 1px solid #ccc; padding: 0.5em 1em;">{pair.k}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    <button on:click={showTickFrequencyGraph} style="margin-bottom: 2em;">Show Tick Frequency Graph</button>
  {/if}

  {#if showChart}
    <canvas bind:this={chartCanvas} width="400" height="200" style="background: #fff; margin: 2em auto; display: block;"></canvas>
  {/if}

  {#if debugRawPairs.length}
    <details style="margin: 2em auto; max-width: 600px; background: #eee; color: #333; padding: 1em; border-radius: 8px;">
      <summary>Debug: Raw Extracted Pairs</summary>
      <pre>{JSON.stringify(debugRawPairs, null, 2)}</pre>
    </details>
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 2em;
    font-weight: 100;
  }

  input[type="file"] {
    margin: 1em 0;
  }

  button {
    padding: 0.5em 1.5em;
    background: #3498db;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    margin-top: 1em;
    margin-bottom: 1em;
  }
  button:hover {
    background: #217dbb;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style> 