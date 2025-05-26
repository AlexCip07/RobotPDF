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
                <td style="width: 40%; text-align: center; font-style: italic;">Sommaire de la documentation robot</td>
                <td style="width: 30%; text-align: right;"></td>
            </tr>
            <tr>
                <td style="width: 30%; text-align: left; font-weight: bold;">Usine Ferrage</td>
                <td style="width: 40%; text-align: center; font-style: italic; font-weight: bold;">Baies R30iAet R30iB</td>
                <td style="width: 30%; text-align: right;">
                    <!-- Page number table -->
                    <table style="width: 100%; border: none;">
                        <tbody>
                            <tr>
                                <td style="border: none; text-align: right;">Page</td>
                                <td style="border: none; text-align: center;">3</td>
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
    <table class="excel-table" style="width: 100%; margin-bottom: 20px;">
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

    <!-- Table of contents title -->
    <div style="text-align: center; font-weight: bold; margin: 30px 0 10px 0;">SOMMAIRE</div>

    <!-- Summary table with page numbers and section titles -->
    <table class="excel-table" style="width: 90%; margin: 0 auto;">
        <tbody>
            <tr><td>s</td><td>Versions des logiciels installés</td></tr>
            <tr><td>2</td><td>Affectation des entrées / sorties Tout Ou Rien</td></tr>
            <tr><td>3</td><td>Affectation des entrées / sorties Manutention</td></tr>
            <tr><td>4</td><td>Limites logicielles des axes</td></tr>
            <tr><td>5</td><td>Interverrouillages avec les autres robots (Robot/API/Robot)</td></tr>
            <tr><td>6</td><td>Interverrouillages entre robots</td></tr>
            <tr><td>7</td><td>Table d'identification</td></tr>
            <tr><td>8</td><td>Table d'identification</td></tr>
            <tr><td>9</td><td>Définition des séquences de commande des mains de préhension</td></tr>
            <tr><td>10</td><td>Photo des référentiels outils liés aux mains de préhension</td></tr>
            <tr><td>11</td><td>Photo du robot en position de repli</td></tr>
            <tr><td>12</td><td>Photo du robot en position de calibration</td></tr>
            <tr><td>13</td><td>Offsets moteurs</td></tr>
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