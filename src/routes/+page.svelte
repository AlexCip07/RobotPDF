<script>
    // Import the onMount lifecycle function from Svelte to handle component initialization
    import { onMount } from 'svelte';
    // Import the pages
    import Page1 from './pages/Page1.svelte';
    import Page2 from './pages/Page2.svelte';   
    import Page3 from './pages/Page3.svelte';
    import Page4 from './pages/Page4.svelte';
    import Page5 from './pages/Page5.svelte';
    import Page6 from './pages/Page6.svelte';
    import Page7 from './pages/Page7.svelte';
    import Page8 from './pages/Page8.svelte';
    import Page9 from './pages/Page9.svelte';
    import Page10 from './pages/Page10.svelte';
    import Page11 from './pages/Page11.svelte';
    import Page12 from './pages/Page12.svelte';
    import Page13 from './pages/Page13.svelte';
    // Reference variable to store the first page element for PDF generation
    let pdfElement;
    
    // Create an array of 8 elements to represent identical pages
    let pages = Array(8);

    // Add current page state
    let currentPage = 1;
    const totalPages = 13;

    // Function to navigate to next page
    function nextPage() {
        if (currentPage < totalPages) {
            currentPage++;
        }
    }

    // Function to navigate to previous page
    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
        }
    }

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

    /* Title screen styling */
    .title-screen {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-family: Arial, sans-serif;
        margin-bottom: 40px;
    }

    .title-screen h1 {
        font-size: 72px;
        font-weight: bold;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        margin: 0;
        animation: fadeIn 1.5s ease-in-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
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

    /* Add navigation button styles */
    .nav-btn {
        position: fixed;
        top: 50%;
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

    .nav-btn:hover {
        background-color: #45a049;
    }

    .prev-btn {
        left: 20px;
    }

    .next-btn {
        right: 20px;
    }

    .page-indicator {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 16px;
        z-index: 1000;
    }
</style>

<!-- Main template structure -->
<div class="pages-container">
    <Page1 documentInfo={documentInfo} />
    <Page2 documentInfo={documentInfo} />
    <Page3 documentInfo={documentInfo} />
    <Page4 documentInfo={documentInfo} />
    <Page5 documentInfo={documentInfo} />
    <Page6 documentInfo={documentInfo}, axesLimits={axesLimits} />
    <Page7 documentInfo={documentInfo}, interlocks={interlocks} />
    <Page8 documentInfo={documentInfo}, interlocks={interlocks} />
    <Page9 documentInfo={documentInfo}, identificationPoints={identificationPoints} />
    <Page10 documentInfo={documentInfo} />
    <Page11 documentInfo={documentInfo} />
    <Page12 documentInfo={documentInfo} />
    <Page13 documentInfo={documentInfo} />
    </div>


<!-- Download PDF button -->
<button class="download-btn" on:click={downloadPDF}>
    Download PDF
</button>





