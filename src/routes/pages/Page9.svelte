<script>
    export let documentInfo;
    export let identificationPoints;
    import { onMount } from 'svelte';

</script>

<div class="a4-page">
    <!-- Header section with company name and document title -->
    <table class="excel-table" style="width: 100%; margin-bottom: 10px;">
        <tbody>
            <tr>
                <td style="width: 30%; text-align: left; font-weight: bold;">PSA PEUGEOT CITROEN</td>
                <td style="width: 40%; text-align: center; font-style: italic;">Table d'identification</td>
                <td style="width: 10%; text-align: right; font-size: 12px;">Version</td>
                <td style="width: 5%; text-align: left; font-size: 12px;">{documentInfo.version}</td>
            </tr>
            <tr>
                <td style="width: 30%; text-align: left; font-weight: bold;">Usine Ferrage</td>
                <td style="width: 40%; text-align: center; font-style: italic; font-weight: bold;">Baies R30iAet R30iB</td>
                <td colspan="2" style="width: 30%; text-align: right;">
                    <!-- Page number table -->
                    <table style="width: 100%; border: none;">
                        <tbody>
                            <tr>
                                <td style="border: none; text-align: right;">Page</td>
                                <td style="border: none; text-align: center;">9</td>
                                <td style="border: none; text-align: center;">/</td>
                                <td style="border: none; text-align: left;">13</td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Info row with robot details -->
    <table class="excel-table" style="width: 100%; margin-bottom: 40px;">
        <tbody>
            <tr>
                <td style="font-weight: bold;">Robot N°</td>
                <td>{documentInfo.robotNumber}</td>
                <td style="font-weight: bold;">Secteur</td>
                <td>{documentInfo.sector}</td>
                <td style="font-weight: bold;">Bât</td>
                <td>{documentInfo.building}</td>
            </tr>
        </tbody>
    </table>

    <!-- Identification points table showing program numbers and trajectories -->
    <div style="display: flex; justify-content: center; margin-top: 40px;">
        <table class="excel-table" style="width: 700px;">
            <thead>
                <tr>
                    <th style="width: 100px;">N°</th>
                    <th style="width: 100px;">Programme</th>
                    <th colspan="10" style="text-align: center;">Trajectoires</th>
                </tr>
            </thead>
            <tbody>
                {#each identificationPoints as point}
                    <tr>
                        <td>{point.id}</td>
                        <td>{point.program}</td>
                        {#each point.trajectories as trajectory}
                            <td>{trajectory}</td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <!-- Duplicate page button -->
    <button 
        class="copy-btn" 
        on:click={duplicatePage}
        title="Duplicate this page"
    >
        Duplicate Page
    </button>
</div>

<style>
    .a4-page {
        width: 210mm;
        min-height: 297mm;
        padding: 20mm;
        background: white;
        border: 2px solid #333;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        box-sizing: border-box;
        position: relative;
    }

    .excel-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        font-family: Arial, sans-serif;
        border: 2px solid #000;
        background-color: white;
    }

    .excel-table th,
    .excel-table td {
        border: 1px solid #000;
        padding: 10px;
        text-align: left;
        font-size: 12px;
        color: #000;
        background-color: white;
    }

    .copy-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 8px 16px;
        background-color: #2196F3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        z-index: 1000;
        transition: background-color 0.3s;
    }

    .copy-btn:hover {
        background-color: #1976D2;
    }

    @media print {
        .copy-btn {
            display: none;
        }
    }
</style> 