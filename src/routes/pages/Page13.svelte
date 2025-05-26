<script>
    export let documentInfo;
    import { onMount } from 'svelte';

</script>

<div class="a4-page">
    <!-- Header section with company name and document title -->
    <table class="excel-table" style="width: 100%; margin-bottom: 10px;">
        <tbody>
            <tr>
                <td style="width: 30%; text-align: left; font-weight: bold;">PSA PEUGEOT CITROEN</td>
                <td style="width: 40%; text-align: center; font-style: italic;">Photo du robot en position de calibration</td>
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
                                <td style="border: none; text-align: center;">13</td>
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

    <!-- Instruction -->
    <div style="margin-bottom: 20px;">
        <span style="font-weight: bold; font-style: italic;">
            But: cette photo doit montrer la position de calibration du robot
        </span>
    </div>

    <!-- Large frame with robot photo -->
    <div style="display: flex; justify-content: center; align-items: center; height: 500px;">
        <div style="width: 90%; height: 90%; border: 2px solid #000; position: relative; background: white; display: flex; justify-content: center; align-items: center;">
            <img src="/src/Robot2.jpg" alt="Robot en position de calibration" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
        </div>
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