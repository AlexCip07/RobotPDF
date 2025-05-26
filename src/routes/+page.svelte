<!-- Main Svelte component for PDF generation and display -->
<script>
    // Import the onMount lifecycle function from Svelte to handle component initialization
    import { onMount } from 'svelte';
    
    // Reference variable to store the first page element for PDF generation
    let pdfElement;
    
    // Create an array of 8 elements to represent identical pages
    let pages = Array(8);

    // Object containing all document information like robot number, application details, etc.
    const documentInfo = {
        robotNumber: '1167625',          // Unique identifier for the robot
        application: 'SEL',              // Application name
        building: 'FER M40',             // Building location
        sector: 'CDC',                   // Sector identifier
        vehicle: 'P674',                 // Vehicle model
        totalPages: 13,                  // Total number of pages in document
        version: '1',                    // Document version
        baseSoftwareVersion: 'V7.70P/28', // Base software version
        psaSoftwareVersion: 'V4.0657 SxP', // PSA specific software version
        author: {                        // Author information
            name: 'Lamboley Jordan',     // Author name
            date: '26-03-22'             // Author date
        },
        validator: {                     // Validator information
            name: 'Bertrand',            // Validator name
            date: ''                     // Validation date
        }
    };

    // Array containing axis limits for each robot axis
    const axesLimits = [
        { axis: 1, positive: 180, negative: -180 },    // Axis 1 limits
        { axis: 2, positive: 76, negative: -60 },      // Axis 2 limits
        { axis: 3, positive: 230, negative: -132.04 }, // Axis 3 limits
        { axis: 4, positive: 360, negative: -360 },    // Axis 4 limits
        { axis: 5, positive: 125, negative: -125 },    // Axis 5 limits
        { axis: 6, positive: 360, negative: -360 },    // Axis 6 limits
        { axis: 7, positive: '120mm', negative: '-20mm' } // Axis 7 limits
    ];

    // Array containing motor offset information for each axis
    const motorOffsets = [
        { masterCount: -4155147, refCount: -4155147, refPos: 0.00 },    // Axis 1 offsets
        { masterCount: -20776185, refCount: -20776186, refPos: 0.00 },  // Axis 2 offsets
        { masterCount: 11911086, refCount: 11911086, refPos: 0.00 },    // Axis 3 offsets
        { masterCount: 176265, refCount: 176266, refPos: 0.00 },        // Axis 4 offsets
        { masterCount: 35792934, refCount: 35792937, refPos: 0.00 },    // Axis 5 offsets
        { masterCount: 825661, refCount: 825663, refPos: 0.00 }         // Axis 6 offsets
    ];

    // Array containing identification points with their program numbers and trajectories
    const identificationPoints = [
        { id: 55709, program: 2, trajectories: ['Traj10', '', 'Traj12', '', '', '', '', '', '', ''] },
        { id: 55715, program: 5, trajectories: ['Traj10', '', 'Traj12', '', '', '', '', '', '', ''] },
        { id: 55713, program: 4, trajectories: ['Traj10', '', 'Traj12', '', '', '', '', '', '', ''] },
        { id: 50555, program: 16, trajectories: ['', 'Traj11', '', '', '', '', '', '', '', ''] },
        { id: 55735, program: 6, trajectories: ['', 'Traj11', '', '', '', '', '', '', '', ''] },
        { id: 51617, program: 21, trajectories: ['', 'Traj11', '', '', '', '', 'Traj13', '', '', ''] },
        { id: 55909, program: 20, trajectories: ['', '', '', '', '', '', 'Traj13', '', '', ''] },
        { id: 56035, program: 15, trajectories: ['', '', '', '', '', '', 'Traj13', '', '', ''] },
        { id: 56035, program: 15, trajectories: ['', '', '', '', '', '', 'Traj113', '', '', ''] },
        { id: 56035, program: 15, trajectories: ['', '', '', '', '', '', 'Traj155', '', '', ''] },
        { id: 56035, program: 15, trajectories: ['', '', '', '', '', '', 'Traj199', '', '', ''] }
    ];

    // Object containing interlock information for API and robot
    const interlocks = {
        api: [  // API interlocks array
            { number: 1, type: 'API', robot: 'R8', trajectories: 'Traj10, Traj12, Traj20, Traj22' },
            { number: 2, type: 'API', robot: 'R7', trajectories: 'Traj11, Traj13, Traj21, Traj23' },
            // ... more API interlocks
        ],
        robot: [  // Robot interlocks array
            { number: 1, type: 'ROBOT', robot: 'R8', trajectories: '' },
            { number: 2, type: 'robot', robot: 'R7', trajectories: '485,5555' },
            // ... more robot interlocks
        ]
    };

    // Function to handle page references, specifically for the first page
    function handlePageRef(node, index) {
        if (index === 0) {
            pdfElement = node;  // Store reference to first page element
        }
    }

    // Main function to handle PDF generation and download
    async function downloadPDF() {
        // Dynamically import html2pdf library
        const html2pdf = (await import('html2pdf.js')).default;
        
        // Configuration options for PDF generation
        const opt = {
            margin: 0,                    // No margins
            filename: 'document.pdf',     // Output filename
            image: { 
                type: 'jpeg',            // Image format
                quality: 1               // Maximum quality
            },
            html2canvas: { 
                scale: 2,                // Higher scale for better quality
                useCORS: true,           // Enable CORS for images
                backgroundColor: '#ffffff' // White background
            },
            jsPDF: { 
                unit: 'mm',              // Use millimeters as unit
                format: 'a4',            // A4 page format
                orientation: 'portrait'   // Portrait orientation
            },
            pagebreak: { mode: 'avoid-all' } // Avoid breaking content across pages
        };

        try {
            // Get all pages from the container
            const pagesContainer = document.querySelector('.pages-container');
            const allPages = pagesContainer.querySelectorAll('.a4-page');
            
            // Create a temporary container for all pages
            const container = document.createElement('div');
            container.style.backgroundColor = 'white';
            container.style.padding = '0';
            container.style.margin = '0';
            
            // Clone each page and add to the container
            allPages.forEach(page => {
                const clone = page.cloneNode(true);
                // Remove all copy buttons from the clone
                const buttons = clone.querySelectorAll('.copy-btn');
                buttons.forEach(button => button.remove());
                
                clone.style.backgroundColor = 'white';
                clone.style.margin = '0';
                clone.style.padding = '0';
                clone.style.scale = '0.95';
                clone.style.height = '297mm';    // A4 height
                clone.style.overflow = 'hidden'; // Prevent content overflow
                container.appendChild(clone);
            });

            // Add container to document temporarily
            document.body.appendChild(container);

            // Generate and save PDF
            await html2pdf().from(container).set(opt).save();
            
            // Clean up by removing temporary container
            document.body.removeChild(container);
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Error generating PDF. Please try again.');
        }
    }

    // Function to copy a single page
    async function copyPage(pageIndex) {
        const pagesContainer = document.querySelector('.pages-container');
        const page = pagesContainer.querySelectorAll('.a4-page')[pageIndex];
        
        if (!page) return;

        // Create a temporary container for the single page
        const container = document.createElement('div');
        container.style.backgroundColor = 'white';
        container.style.padding = '0';
        container.style.margin = '0';
        
        // Clone the page
        const clone = page.cloneNode(true);
        clone.style.backgroundColor = 'white';
        clone.style.margin = '0';
        clone.style.padding = '0';
        clone.style.height = '297mm';
        clone.style.overflow = 'hidden';
        container.appendChild(clone);

        // Add container to document temporarily
        document.body.appendChild(container);

        // Configuration for single page
        const opt = {
            margin: 0,
            filename: `page-${pageIndex + 1}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            },
            jsPDF: { 
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            }
        };

        try {
            // Generate and save PDF
            const html2pdf = (await import('html2pdf.js')).default;
            await html2pdf().from(container).set(opt).save();
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Error generating PDF. Please try again.');
        } finally {
            // Clean up
            document.body.removeChild(container);
        }
    }

    // Function to duplicate a page in the HTML document
    function duplicatePage(event) {
        // Get the button that was clicked
        const button = event.currentTarget;
        // Get the page that contains this button
        const page = button.closest('.a4-page');
        
        if (!page) return;

        // Clone the page
        const clone = page.cloneNode(true);
        
        // Add click handler to the new button
        const newButton = clone.querySelector('.copy-btn');
        if (newButton) {
            newButton.addEventListener('click', duplicatePage);
        }
        
        // Insert the clone after the original page
        page.parentNode.insertBefore(clone, page.nextSibling);

        // Update all page numbers in the document
        const pagesContainer = document.querySelector('.pages-container');
        const allPages = pagesContainer.querySelectorAll('.a4-page');
        const totalPages = allPages.length;
        
        allPages.forEach((page, index) => {
            // Find the page number table in the header
            const pageNumberTable = page.querySelector('table[style*="width: 100%; border: none"]');
            if (pageNumberTable) {
                const cells = pageNumberTable.querySelectorAll('td');
                if (cells.length >= 4) {
                    // Update current page number
                    cells[1].textContent = index + 1;
                    // Update total pages number
                    cells[3].textContent = totalPages;
                }
            }
        });
    }
</script>

<style>
    /* Reset default body styles and set background color */
    body {
        margin: 0;
        padding: 20px;
        background: #f5f5f5;
    }

    /* Container for all pages with flex layout and spacing */
    .pages-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
    }

    /* Individual A4 page styling with dimensions and visual effects */
    .a4-page {
        width: 210mm;           /* A4 width */
        min-height: 297mm;      /* A4 height */
        padding: 20mm;          /* Page margins */
        background: white;
        border: 2px solid #333;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        box-sizing: border-box;
        position: relative;
    }

    /* Header text styling */
    h1 {
        color: #000;
        font-size: 24px;
        margin-bottom: 20px;
        font-weight: bold;
    }

    /* Paragraph text styling */
    p {
        color: #000;
        font-size: 14px;
        line-height: 1.5;
        margin: 20px 0;
    }

    /* Container for images with centered alignment */
    .image-container {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }

    /* Image styling with size constraints */
    .page-image {
        max-width: 100%;
        height: auto;
        max-height: 200px;
        object-fit: contain;
    }

    /* Print-specific styles to hide UI elements and adjust layout */
    @media print {
        body {
            background: white;
            padding: 0;
        }
        
        .download-btn {
            display: none;
        }

        .a4-page {
            box-shadow: none;
            border: 1px solid #000;
        }

        .copy-btn {
            display: none !important;
        }
    }

    /* Download button styling with fixed position */
    .download-btn {
        position: fixed;
        top: 50%;
        right: 80%;
        transform: translateY(-50%);
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        z-index: 1000;
    }

    /* Download button hover effect */
    .download-btn:hover {
        background-color: #45a049;
    }

    /* Excel-like table styling with borders and spacing */
    .excel-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        font-family: Arial, sans-serif;
        border: 2px solid #000;
        background-color: white;
    }

    /* Table cell styling with borders and padding */
    .excel-table th,
    .excel-table td {
        border: 1px solid #000;
        padding: 10px;
        text-align: left;
        font-size: 12px;
        color: #000;
        background-color: white;
    }

    /* Copy button styling with absolute positioning */
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

    /* Copy button hover effect */
    .copy-btn:hover {
        background-color: #1976D2;
    }

    /* Hide copy buttons when printing */
    @media print {
        .copy-btn {
            display: none;
        }
    }
</style>

<!-- Main template structure -->
<div class="pages-container">
    <!-- ==================== PAGE 1 OF 13 ==================== -->
    <!-- First page containing basic robot information -->
    <div class="a4-page" bind:this={pdfElement}>
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
                                    <td style="border: none; text-align: center;">1</td>
                                    <td style="border: none; text-align: center;">/</td>
                                    <td style="border: none; text-align: left;">13</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Main info table with robot details -->
        <table class="excel-table" style="width: 60%; margin: 60px auto 0 auto;">
            <tbody>
                <tr>
                    <td style="font-weight: bold;">N° ROBOT</td>
                    <td>{documentInfo.robotNumber}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">APPLICATION</td>
                    <td>{documentInfo.application}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">BATIMENT</td>
                    <td>{documentInfo.building}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">SECTEUR</td>
                    <td>{documentInfo.sector}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">VEHICULE</td>
                    <td>{documentInfo.vehicle}</td>
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

    <!-- ==================== PAGE 2 OF 13 ==================== -->
    <!-- Second page containing document evolution tracking -->
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

    <!-- ==================== PAGE 3 OF 13 ==================== -->
    <!-- Table of contents page -->
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

    <!-- ==================== PAGE 4 OF 13 ==================== -->
    <!-- Software versions page -->
    <div class="a4-page">
        <!-- Header section with company name and document title -->
        <table class="excel-table" style="width: 100%; margin-bottom: 10px;">
            <tbody>
                <tr>
                    <td style="width: 30%; text-align: left; font-weight: bold;">PSA PEUGEOT CITROEN</td>
                    <td style="width: 40%; text-align: center; font-style: italic;">Versions des logiciels installés</td>
                    <td style="width: 15%; text-align: right; font-size: 12px;">Version</td>
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
                                    <td style="border: none; text-align: center;">4</td>
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

        <!-- Version sections with software version information -->
        <div style="width: 80%; margin: 40px auto 0 auto;">
            <div style="text-align: center; font-weight: bold; margin-bottom: 8px;">VERSION DU LOGICIEL DE BASE</div>
            <div style="text-align: center; font-size: 1.5em; font-weight: bold; border: 1px solid #000; margin-bottom: 32px; padding: 8px 0; background: white;">{documentInfo.baseSoftwareVersion}</div>
            <div style="text-align: center; font-weight: bold; margin-bottom: 8px;">VERSION DU LOGICIEL APPLICATIF PSA</div>
            <div style="text-align: center; font-size: 1.5em; font-weight: bold; border: 1px solid #000; padding: 8px 0; background: white;">{documentInfo.psaSoftwareVersion}</div>
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

    <!-- ==================== PAGE 5 OF 13 ==================== -->
    <!-- Input/Output assignments page -->
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

    <!-- ==================== PAGE 6 OF 13 ==================== -->
    <!-- Axis limits page -->
    <div class="a4-page">
        <!-- Header section with company name and document title -->
        <table class="excel-table" style="width: 100%; margin-bottom: 10px;">
            <tbody>
                <tr>
                    <td style="width: 30%; text-align: left; font-weight: bold;">PSA PEUGEOT CITROEN</td>
                    <td style="width: 40%; text-align: center; font-style: italic;">Limites logicielles des axes</td>
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
                                    <td style="border: none; text-align: center;">6</td>
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

        <!-- Centered axes limits table showing positive and negative limits for each axis -->
        <div style="display: flex; justify-content: center; margin-top: 60px;">
            <table class="excel-table" style="width: 400px;">
                <thead>
                    <tr>
                        <th style="width: 80px;">N° axe</th>
                        <th style="width: 160px;">Sens +</th>
                        <th style="width: 160px;">Sens -</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>1</td><td>{axesLimits[0].positive}</td><td>{axesLimits[0].negative}</td></tr>
                    <tr><td>2</td><td>{axesLimits[1].positive}</td><td>{axesLimits[1].negative}</td></tr>
                    <tr><td>3</td><td>{axesLimits[2].positive}</td><td>{axesLimits[2].negative}</td></tr>
                    <tr><td>4</td><td>{axesLimits[3].positive}</td><td>{axesLimits[3].negative}</td></tr>
                    <tr><td>5</td><td>{axesLimits[4].positive}</td><td>{axesLimits[4].negative}</td></tr>
                    <tr><td>6</td><td>{axesLimits[5].positive}</td><td>{axesLimits[5].negative}</td></tr>
                    <tr><td>7</td><td>{axesLimits[6].positive}</td><td>{axesLimits[6].negative}</td></tr>
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

    <!-- ==================== PAGE 7 OF 13 ==================== -->
    <!-- Robot/API/Robot interlocks page -->
    <div class="a4-page">
        <!-- Header section with company name and document title -->
        <table class="excel-table" style="width: 100%; margin-bottom: 10px;">
            <tbody>
                <tr>
                    <td style="width: 30%; text-align: left; font-weight: bold;">PSA PEUGEOT CITROEN</td>
                    <td style="width: 40%; text-align: center; font-style: italic;">Interverrouillages robots / API / robot</td>
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
                                    <td style="border: none; text-align: center;">7</td>
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

        <!-- Main interlock table showing robot and API interlocks -->
        <div style="display: flex; justify-content: center; margin-top: 40px;">
            <table class="excel-table" style="width: 700px;">
                <thead>
                    <tr>
                        <th style="width: 50%;"></th>
                        <th colspan="4" style="text-align: center;">Robot interverrouillé</th>
                    </tr>
                    <tr>
                        <th></th>
                        <th>Type</th>
                        <th style="width: 20%;">avec le robot n°</th>
                        <th style="width: 50%;">dans la trajectoire n°</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Interverrouillage 1</td><td>API</td><td>R8</td><td>Traj10, Traj12, Traj20, Traj22</td></tr>
                    <tr><td>Interverrouillage 2</td><td>API</td><td>R7</td><td>Traj11, Traj13, Traj21, Traj23</td></tr>
                    <tr><td>Interverrouillage 3</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 4</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 5</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 6</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 7</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 8</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 9</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 10</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 11</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 12</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 13</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 14</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 15</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 16</td><td>API</td><td></td><td></td></tr>
                </tbody>
            </table>
        </div>
        <!-- Add copy button -->
        <button 
            class="copy-btn" 
            on:click={duplicatePage}
            title="Duplicate this page"
        >
            Duplicate Page
        </button>
    </div>

    <!-- ==================== PAGE 8 OF 13 ==================== -->
    <div class="a4-page">
        <!-- Header section -->
        <table class="excel-table" style="width: 100%; margin-bottom: 10px;">
            <tbody>
                <tr>
                    <td style="width: 30%; text-align: left; font-weight: bold;">PSA PEUGEOT CITROEN</td>
                    <td style="width: 40%; text-align: center; font-style: italic;">Interverrouillages robots / API / robot</td>
                    <td style="width: 10%; text-align: right; font-size: 12px;">Version</td>
                    <td style="width: 5%; text-align: left; font-size: 12px;">{documentInfo.version}</td>
                </tr>
                <tr>
                    <td style="width: 30%; text-align: left; font-weight: bold;">Usine Ferrage</td>
                    <td style="width: 40%; text-align: center; font-style: italic; font-weight: bold;">Baies R30iAet R30iB</td>
                    <td colspan="2" style="width: 30%; text-align: right;">
                        <table style="width: 100%; border: none;">
                            <tbody>
                                <tr>
                                    <td style="border: none; text-align: right;">Page</td>
                                    <td style="border: none; text-align: center;">10</td>
                                    <td style="border: none; text-align: center;">/</td>
                                    <td style="border: none; text-align: left;">13</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Info row -->
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

        <!-- Main interlock table -->
        <div style="display: flex; justify-content: center; margin-top: 40px;">
            <table class="excel-table" style="width: 700px;">
                <thead>
                    <tr>
                        <th colspan="2" style="width: 50%;"></th>
                        <th colspan="4" style="text-align: center;">Robot interverrouillé</th>
                    </tr>
                    <tr>
                        <th></th>
                        <th>Type</th>
                        <th style="width: 20%;">avec le robot n°</th>
                        <th style="width: 50%;">dans la trajectoire n°</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Interverrouillage 1</td><td>ROBOT</td><td>R8</td><td></td></tr>
                    <tr><td>Interverrouillage 2</td><td>robot</td><td>R7</td><td>485,5555</td></tr>
                    <tr><td>Interverrouillage 3</td><td>r</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 4</td><td>r</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 5</td><td>R</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 6</td><td>robot</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 7</td><td>ROBOT</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 8</td><td>ROBOT</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 9</td><td>ROBOT</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 10</td><td>ROBOT</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 11</td><td>ROBOT</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 12</td><td>ROBOT</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 13</td><td>ROBOT</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 14</td><td>ROBOT</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 15</td><td>ROBOT</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 16</td><td>ROBOT</td><td></td><td></td></tr>
                </tbody>
            </table>
        </div>
        <!-- Add copy button -->
        <button 
            class="copy-btn" 
            on:click={duplicatePage}
            title="Duplicate this page"
        >
            Duplicate Page
        </button>
    </div>

    <!-- ==================== PAGE 9 OF 13 ==================== -->
    <!-- Motor offsets page -->
    <div class="a4-page">
        <!-- Header section with company name and document title -->
        <table class="excel-table" style="width: 100%; margin-bottom: 10px;">
            <tbody>
                <tr>
                    <td style="width: 30%; text-align: left; font-weight: bold;">PSA PEUGEOT CITROEN</td>
                    <td style="width: 40%; text-align: center; font-style: italic;">Décalages moteurs</td>
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

        <!-- Motor offsets table showing offset values for each motor -->
        <div style="display: flex; justify-content: center; margin-top: 40px;">
            <table class="excel-table" style="width: 400px;">
                <thead>
                    <tr>
                        <th style="width: 80px;">N° moteur</th>
                        <th style="width: 320px;">Décalage</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>1</td><td>{motorOffsets[0]}</td></tr>
                    <tr><td>2</td><td>{motorOffsets[1]}</td></tr>
                    <tr><td>3</td><td>{motorOffsets[2]}</td></tr>
                    <tr><td>4</td><td>{motorOffsets[3]}</td></tr>
                    <tr><td>5</td><td>{motorOffsets[4]}</td></tr>
                    <tr><td>6</td><td>{motorOffsets[5]}</td></tr>
                    <tr><td>7</td><td>{motorOffsets[6]}</td></tr>
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

    <!-- ==================== PAGE 10 OF 13 ==================== -->
    <!-- Identification points page -->
    <div class="a4-page">
        <!-- Header section with company name and document title -->
        <table class="excel-table" style="width: 100%; margin-bottom: 10px;">
            <tbody>
                <tr>
                    <td style="width: 30%; text-align: left; font-weight: bold;">PSA PEUGEOT CITROEN</td>
                    <td style="width: 40%; text-align: center; font-style: italic;">Points d'identification</td>
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
                                    <td style="border: none; text-align: center;">10</td>
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

    <!-- ==================== PAGE 11 OF 13 ==================== -->
    <!-- Robot/API/Robot interlocks page (continued) -->
    <div class="a4-page">
        <!-- Header section with company name and document title -->
        <table class="excel-table" style="width: 100%; margin-bottom: 10px;">
            <tbody>
                <tr>
                    <td style="width: 30%; text-align: left; font-weight: bold;">PSA PEUGEOT CITROEN</td>
                    <td style="width: 40%; text-align: center; font-style: italic;">Interverrouillages robots / API / robot</td>
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
                                    <td style="border: none; text-align: center;">11</td>
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

        <!-- Main interlock table showing robot and API interlocks (continued) -->
        <div style="display: flex; justify-content: center; margin-top: 40px;">
            <table class="excel-table" style="width: 700px;">
                <thead>
                    <tr>
                        <th colspan="2" style="width: 50%;"></th>
                        <th colspan="4" style="text-align: center;">Robot interverrouillé</th>
                    </tr>
                    <tr>
                        <th></th>
                        <th>Type</th>
                        <th style="width: 20%;">avec le robot n°</th>
                        <th style="width: 50%;">dans la trajectoire n°</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Interlock rows -->
                    <tr><td>Interverrouillage 1</td><td>API</td><td>R8</td><td>Traj10, Traj12, Traj20, Traj22</td></tr>
                    <tr><td>Interverrouillage 2</td><td>API</td><td>R7</td><td>Traj11, Traj13, Traj21, Traj23</td></tr>
                    <tr><td>Interverrouillage 3</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 4</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 5</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 6</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 7</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 8</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 9</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 10</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 11</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 12</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 13</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 14</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 15</td><td>API</td><td></td><td></td></tr>
                    <tr><td>Interverrouillage 16</td><td>API</td><td></td><td></td></tr>
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

    <!-- ==================== PAGE 12 OF 13 ==================== -->
    <!-- Robot position page -->
    <div class="a4-page">
        <!-- Header section with company name and document title -->
        <table class="excel-table" style="width: 100%; margin-bottom: 10px;">
            <tbody>
                <tr>
                    <td style="width: 30%; text-align: left; font-weight: bold;">PSA PEUGEOT CITROEN</td>
                    <td style="width: 40%; text-align: center; font-style: italic;">Robot en position de repli</td>
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
                                    <td style="border: none; text-align: center;">11</td>
                                    <td style="border: none; text-align: center;">/</td>
                                    <td style="border: none; text-align: left;">13</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Info row -->
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

        <!-- Instruction -->
        <div style="margin-bottom: 10px;">
            <span style="font-weight: bold; font-style: italic;">
                But: cette photo doit montrer la position de repli par rapport à l'environnement et le cheminement du faisceau axe3/axe6
            </span>
        </div>

        <!-- Large frame with Robot1.jpg -->
        <div style="display: flex; justify-content: center; align-items: center; height: 500px;">
            <div style="width: 90%; height: 90%; border: 2px solid #000; position: relative; background: white; display: flex; justify-content: center; align-items: center;">
                <img src="/src/Robot1.jpg" alt="Robot en position de repli" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
            </div>
        </div>
        <!-- Add copy button -->
        <button 
            class="copy-btn" 
            on:click={duplicatePage}
            title="Duplicate this page"
        >
            Duplicate Page
        </button>
    </div>

    <!-- ==================== PAGE 13 OF 13 ==================== -->
    <div class="a4-page">
        <!-- Header section -->
        <table class="excel-table" style="width: 100%; margin-bottom: 10px;">
            <tbody>
                <tr>
                    <td style="width: 30%; text-align: left; font-weight: bold;">PSA PEUGEOT CITROEN</td>
                    <td style="width: 40%; text-align: center; font-style: italic; font-weight: bold;">Relevé des offsets moteurs</td>
                    <td style="width: 10%; text-align: right; font-size: 12px;">Version</td>
                    <td style="width: 5%; text-align: left; font-size: 12px;">{documentInfo.version}</td>
                </tr>
                <tr>
                    <td style="width: 30%; text-align: left; font-weight: bold;">Usine Ferrage</td>
                    <td style="width: 40%; text-align: center; font-style: italic; font-weight: bold;">Baies R30iAet R30iB</td>
                    <td colspan="2" style="width: 30%; text-align: right;">
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

        <!-- Info row -->
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

        <!-- Offsets Table -->
        <div style="display: flex; justify-content: center;">
            <table class="excel-table" style="width: 80%; margin-top: 20px;">
                <thead>
                    <tr>
                        <th colspan="2" style="text-align: center;">CALIBRATION</th>
                        <th colspan="2" style="text-align: center;">QUICK MASTER</th>
                        <th style="text-align: center;">$REF-POS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{motorOffsets[0].masterCount}</td><td>{motorOffsets[0].refCount}</td>
                        <td>{motorOffsets[0].refPos}</td>
                        <td>{motorOffsets[0].refPos}</td>
                        <td>0.00</td>
                    </tr>
                    <tr>
                        <td>{motorOffsets[1].masterCount}</td><td>{motorOffsets[1].refCount}</td>
                        <td>{motorOffsets[1].refPos}</td>
                        <td>{motorOffsets[1].refPos}</td>
                        <td>0.00</td>
                    </tr>
                    <tr>
                        <td>{motorOffsets[2].masterCount}</td><td>{motorOffsets[2].refCount}</td>
                        <td>{motorOffsets[2].refPos}</td>
                        <td>{motorOffsets[2].refPos}</td>
                        <td>0.00</td>
                    </tr>
                    <tr>
                        <td>{motorOffsets[3].masterCount}</td><td>{motorOffsets[3].refCount}</td>
                        <td>{motorOffsets[3].refPos}</td>
                        <td>{motorOffsets[3].refPos}</td>
                        <td>0.00</td>
                    </tr>
                    <tr>
                        <td>{motorOffsets[4].masterCount}</td><td>{motorOffsets[4].refCount}</td>
                        <td>{motorOffsets[4].refPos}</td>
                        <td>{motorOffsets[4].refPos}</td>
                        <td>0.00</td>
                    </tr>
                    <tr>
                        <td>{motorOffsets[5].masterCount}</td><td>{motorOffsets[5].refCount}</td>
                        <td>{motorOffsets[5].refPos}</td>
                        <td>{motorOffsets[5].refPos}</td>
                        <td>0.00</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Add copy button -->
        <button 
            class="copy-btn" 
            on:click={duplicatePage}
            title="Duplicate this page"
        >
            Duplicate Page
        </button>
    </div>
</div>

<!-- Download PDF button -->
<button class="download-btn" on:click={downloadPDF}>
    Download PDF
</button>





