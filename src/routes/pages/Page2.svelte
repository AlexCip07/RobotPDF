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
                <td style="width: 40%; text-align: center; font-style: italic; color: #1a237e;">Suivi des évolutions de la documentation</td>
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
                                <td style="border: none; text-align: center;">2</td>
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

    <!-- Modifications table title -->
    <div style="text-align: center; font-weight: bold; margin: 30px 0 10px 0;">GRILLE DES MODIFICATIONS</div>

    <!-- Modifications table with document version history -->
    <table class="excel-table" style="width: 100%; margin-bottom: 30px;">
        <thead>
            <tr>
                <th>Edition</th>
                <th>Date de mise à jour</th>
                <th>Objet de la modification</th>
                <th>Fichier</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>0</td>
                <td>26-09-22</td>
                <td>ORIGINAL</td>
                <td>R9_1167625_Doc.xlsx</td>
            </tr>
            <tr>
                <td>1</td>
                <td>18-04-23</td>
                <td>AJOUT P74</td>
                <td>R9_1167625_V1_Doc.xlsx</td>
            </tr>
            <!-- Empty rows for spacing -->
            <tr><td>&nbsp;</td><td></td><td></td><td></td></tr>
            <tr><td>&nbsp;</td><td></td><td></td><td></td></tr>
            <tr><td>&nbsp;</td><td></td><td></td><td></td></tr>
            <tr><td>&nbsp;</td><td></td><td></td><td></td></tr>
            <tr><td>&nbsp;</td><td></td><td></td><td></td></tr>
            <tr><td>&nbsp;</td><td></td><td></td><td></td></tr>
        </tbody>
    </table>

    <!-- Footer with author and validator information -->
    <table class="excel-table" style="width: 100%; margin-top: 40px;">
        <tbody>
            <tr>
                <td style="width: 25%;">Rédigé le<br>par</td>
                <td style="width: 25%;">{documentInfo.author.name}<br>{documentInfo.author.date}</td>
                <td style="width: 25%;">Validé et approuvé le<br>par</td>
                <td style="width: 15%;">{documentInfo.validator.name}<br>{documentInfo.validator.date}</td>
                <td style="width: 10%;">Repérage particulier</td>
            </tr>
            <tr>
                <td style="width: 25%;"></td>
                <td style="width: 25%;">Bertrand</td>
                <td style="width: 25%;"></td>
                <td style="width: 15%;"></td>
                <td style="width: 10%;"></td>
            </tr>
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