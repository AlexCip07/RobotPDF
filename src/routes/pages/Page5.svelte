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
                <td style="width: 40%; text-align: center; font-style: italic;">Affectation des E/S logiques<br><span style="font-style: normal;">Liaisons TOR</span></td>
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
                                <td style="border: none; text-align: center;">5</td>
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
    <table class="excel-table" style="width: 100%; margin-bottom: 10px;">
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

    <!-- Unit fields for input/output configuration -->
    <table class="excel-table" style="width: 60%; margin-bottom: 10px;">
        <tbody>
            <tr>
                <td style="width: 30%;">Type d'unité</td>
                <td style="width: 70%;"></td>
            </tr>
            <tr>
                <td>Nom de l'unité</td>
                <td></td>
            </tr>
        </tbody>
    </table>

    <!-- Input signals table -->
    <table class="excel-table" style="width: 100%; margin-bottom: 10px;">
        <thead>
            <tr>
                <th colspan="5" style="text-align: left;">ENTRÉES</th>
            </tr>
            <tr>
                <th style="width: 10%;">N° de signal</th>
                <th style="width: 10%;">N° de l'E/S</th>
                <th style="width: 15%;">Type de signal</th>
                <th style="width: 15%;">Inverse (O/N)</th>
                <th style="width: 50%;"></th>
            </tr>
        </thead>
        <tbody>
            <!-- Input signal rows -->
            <tr><td>1</td><td></td><td>Di</td><td></td><td></td></tr>
            <tr><td>2</td><td></td><td>Di</td><td></td><td></td></tr>
            <tr><td>3</td><td></td><td>Di</td><td></td><td></td></tr>
            <tr><td>4</td><td></td><td>Di</td><td></td><td></td></tr>
            <tr><td>5</td><td>N</td><td>Di</td><td></td><td>Imags. arrêt/monter canal 1</td></tr>
            <tr><td>6</td><td>N</td><td>Di</td><td></td><td>Imags. arrêt/monter canal 2</td></tr>
            <tr><td>7</td><td></td><td>Di</td><td></td><td></td></tr>
            <tr><td>8</td><td></td><td>Di</td><td></td><td></td></tr>
            <tr><td>9</td><td></td><td>Di</td><td></td><td></td></tr>
            <tr><td>10</td><td></td><td>Di</td><td></td><td></td></tr>
            <tr><td>11</td><td></td><td>Di</td><td></td><td></td></tr>
            <tr><td>12</td><td></td><td>Di</td><td></td><td></td></tr>
            <tr><td>13</td><td></td><td>Di</td><td></td><td></td></tr>
            <tr><td>14</td><td></td><td>Di</td><td></td><td></td></tr>
            <tr><td>15</td><td></td><td>Di</td><td></td><td></td></tr>
            <tr><td>16</td><td></td><td>Di</td><td></td><td></td></tr>
        </tbody>
    </table>

    <!-- Output signals table -->
    <table class="excel-table" style="width: 100%; margin-bottom: 10px;">
        <thead>
            <tr>
                <th colspan="5" style="text-align: left;">SORTIES</th>
            </tr>
            <tr>
                <th style="width: 10%;">N° de signal</th>
                <th style="width: 10%;">N° de l'E/S</th>
                <th style="width: 15%;">Type de signal</th>
                <th style="width: 15%;">Inverse (O/N)</th>
                <th style="width: 50%;"></th>
            </tr>
        </thead>
        <tbody>
            <!-- Output signal rows -->
            <tr><td>1</td><td></td><td>Do</td><td></td><td></td></tr>
            <tr><td>2</td><td></td><td>Do</td><td></td><td></td></tr>
            <tr><td>3</td><td></td><td>Do</td><td></td><td></td></tr>
            <tr><td>4</td><td></td><td>Do</td><td></td><td></td></tr>
            <tr><td>5</td><td></td><td>Do</td><td></td><td>Verrine défaut</td></tr>
            <tr><td>6</td><td></td><td>Do</td><td></td><td></td></tr>
            <tr><td>7</td><td></td><td>Do</td><td></td><td>Commutateur auto</td></tr>
            <tr><td>8</td><td></td><td>Do</td><td></td><td></td></tr>
            <tr><td>9</td><td></td><td>Do</td><td></td><td></td></tr>
            <tr><td>10</td><td></td><td>Do</td><td></td><td></td></tr>
            <tr><td>11</td><td></td><td>Do</td><td></td><td></td></tr>
            <tr><td>12</td><td></td><td>Do</td><td></td><td></td></tr>
            <tr><td>13</td><td></td><td>Do</td><td></td><td></td></tr>
            <tr><td>14</td><td></td><td>Do</td><td></td><td></td></tr>
            <tr><td>15</td><td></td><td>Do</td><td></td><td></td></tr>
            <tr><td>16</td><td></td><td>Do</td><td></td><td></td></tr>
        </tbody>
    </table>
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