<script lang="ts">
    import type { Robot } from '$lib/types/typesRobot';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    // Import the pages
    import CoverPage from './doc/CoverPage.svelte';
    import ChangeLog from './doc/ChangeLog.svelte';   
    import TableOfContent from './doc/TableOfContent.svelte';
    import ApplicationVersion from './doc/ApplicationVersion.svelte';
    import ListOfINOUT from './doc/ListOfINOUT.svelte';
    import LimitsOfAxes from './doc/LimitsOfAxes.svelte';
    import APILog from './doc/APILog.svelte';
    import InterlockedSystem from './doc/InterlockedSystem.svelte'; 
    import IndetifierList from './doc/IndetifierList.svelte';
    import OffSetMotours from './doc/OffSetMotours.svelte';
    import RobotCalibrated from './doc/RobotCalibrated.svelte';
    import RobotRectracted from './doc/RobotRectracted.svelte';
    import type { version } from 'vite';
  
  
    export let robot: Robot;
    
    $: robotData = robot;
    let currentPage = 1;
    let totalPages = 1
    let frozenCount : number;
    
    // Image upload related variables
    let fileInput: HTMLInputElement;
    let imageExists = false;
    let uploading = false;
    let timestamp = Date.now();
    let uploadError: string | null = null;
    let scrollPosition = 0;
  
    // Robot documentation related variables
    let pdfElement: HTMLElement | null = null;
   
     function IncrementPage() {
      currentPage++;
      totalPages = currentPage;
  
    }
    function freeze() {
      frozenCount = currentPage; // take a snapshot
    }
    
    //
  
    // Update timestamp when robot changes to prevent caching
    $: {
      if (robot) {
        timestamp = Date.now();
        currentPage = 0;
        totalPages = 0;
  
      }
  
    }
    
    // Add timestamp to prevent caching
    $: imagePath = `/api/robot-images/${robot.name}.jpg?t=${timestamp}`;
  
    
  
    // Object containing all document information like robot number, application details, etc.
    $: headerInfo = {
      robotNumber: robotData.name,    // Use robot name or default
      application: robotData.application,        // Use robot application or default
      //building: 'FER M40',                            // Default building (not in Robot type)
      sector: robotData.cell,                                  // Default sector (not in Robot type)                                // Document version             // Default PSA software version (not in Robot type)
      building: "Giga Factory",// Building name
      companyName: "PSA Peugeot Citroën"   // Company name
    };
  
    $: changeLogInfo = {
      author: "Prime Robotics",
      validator: "Prime Robotics",
    };
    $: psaApplicationVersionInfo = {
      version: "V4.0657 SxP",
      baseSoftwareVersion: "Prime Robotics",
    };
  
  
      // Object containing all document information like robot number, application details, etc.
      $: currentRobotInfo = {
      robotNumber: robotData.name,    // Use robot name or default
      application: robotData.application,        // Use robot application or default
      //building: 'FER M40',                            // Default building (not in Robot type)
      sector: robotData.cell,                                  // Default sector (not in Robot type)
      totalPages: 13,                                 // Total number of pages in document
      version: '1',                                   // Document version
      baseSoftwareVersion: 'V7.70P/28',               // Default base software version (not in Robot type)
      psaSoftwareVersion: 'V4.0657 SxP',              // Default PSA software version (not in Robot type)
      building: "Giga Factory",// Building name
      companyName: "PSA Peugeot Citroën"   // Company name
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
      { id: 51617, program: 21, trajectories: ['', 'Traj11', '', '', '', '', 'Traj1', '', '', ''] },
      { id: 55909, program: 20, trajectories: ['', '', '', '', '', '', 'Traj1', '', '', ''] },
      { id: 56035, program: 15, trajectories: ['', '', '', '', '', '', 'Traj1', '', '', ''] },
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
    
    // Check if image exists whenever the path changes
    $: {
      if (browser) {
        const img = new Image();
        img.onload = () => { 
          imageExists = true;
          uploadError = null;
          
          // Restore scroll position if it was saved during upload
          if (scrollPosition > 0) {
            window.scrollTo(0, scrollPosition);
            scrollPosition = 0;
          }
        };
        img.onerror = () => { 
          imageExists = false;
          uploadError = 'Image not found';
        };
        img.src = imagePath;
      }
    }
    
    // Add saveScrollPosition function before onMount
    function saveScrollPosition() {
      scrollPosition = window.scrollY;
    }
  
    // Use afterUpdate to maintain scroll position
    onMount(() => {
  
      IncrementPage();
  
      // Fix for iOS Safari scrolling issues
      if (browser) {
        document.addEventListener('scroll', saveScrollPosition, { passive: true });
      }
      
      return () => {
        if (browser) {
          document.removeEventListener('scroll', saveScrollPosition);
        }
      };
    });
  
  
    // Function to handle page references, specifically for the first page
    function handlePageRef(node: HTMLElement, index: number) {
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
        filename: `robot-${robot.name}-documentation.pdf`,     // Output filename with robot name
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
          orientation: 'portrait' as const   // Portrait orientation with const assertion
        },
        pagebreak: { mode: 'avoid-all' } // Avoid breaking content across pages
      };
  
      try {
        // Get all pages from the container
        const pagesContainer = document.querySelector('.pages-container');
        if (!pagesContainer) {
          throw new Error('Pages container not found');
        }
        const allPages = pagesContainer.querySelectorAll('.a4-page');
        
        // Create a temporary container for all pages
        const container = document.createElement('div');
        container.style.backgroundColor = 'white';
        container.style.padding = '0';
        container.style.margin = '0';
        
        // Clone each page and add to the container
        allPages.forEach(page => {
          const clone = page.cloneNode(true) as HTMLElement;
          
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
    async function copyPage(pageIndex: number) {
      const pagesContainer = document.querySelector('.pages-container');
      if (!pagesContainer) {
        console.error('Pages container not found');
        return;
      }
      const page = pagesContainer.querySelectorAll('.a4-page')[pageIndex];
      
      if (!page) return;
  
      // Create a temporary container for the single page
      const container = document.createElement('div');
      container.style.backgroundColor = 'white';
      container.style.padding = '0';
      container.style.margin = '0';
      
      // Clone the page
      const clone = page.cloneNode(true) as HTMLElement;
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
        filename: `robot-${robot.name}-page-${pageIndex + 1}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait' as const
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
    
    async function handleFileChange(event: Event) {
      const input = event.target as HTMLInputElement;
      if (!input.files?.length) return;
      
      const file = input.files[0];
      
      // Save current scroll position
      scrollPosition = window.scrollY;
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        uploadError = 'Please select an image file (JPG, PNG, etc.)';
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        uploadError = 'Image size must be less than 5MB';
        return;
      }
      
      uploading = true;
      uploadError = null;
      
      const formData = new FormData();
      formData.append('robotImage', file);
      formData.append('robotName', robot.name);
      
      try {
        const response = await fetch(`/api/robot-images/${robot.name}`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to upload image');
        }
        
        imageExists = true;
        // Update timestamp to force a cache refresh
        timestamp = Date.now();
        
      } catch (error) {
        console.error('Error uploading robot image:', error);
        uploadError = error instanceof Error ? error.message : 'Error uploading image';
        imageExists = false;
        
        // Reset scroll position on error
        if (scrollPosition > 0) {
          window.scrollTo(0, scrollPosition);
        }
      } finally {
        uploading = false;
      }
    }
    
    function triggerFileInput() {
      fileInput.click();
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
      
      .download-btn, .upload-btn {
        display: none;
      }
  
      .a4-page {
        box-shadow: none;
        border: 1px solid #000;
      }
    }
  
    /* Button styling with fixed position */
    .download-btn, .upload-btn {
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      z-index: 1000;
    }
  
    .download-btn {
      margin-left: 10px;
    }
  
    .upload-btn {
      margin-right: 10px;
    }
  
    /* Button hover effect */
    .download-btn:hover, .upload-btn:hover {
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
  
  <div class="min-h-screen bg-gray-100 py-8 px-4">
    <!-- Action Buttons -->
    <div class="max-w-4xl mx-auto mb-6 flex justify-end pr-12">
      <div class="flex items-center gap-2">
        <button 
          type="button" 
          on:click={triggerFileInput}
          class="upload-btn text-sm bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={uploading}
        >
          {#if uploading}
            <span class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          {:else}
            {imageExists ? 'Update Image' : 'Upload Image'}
          {/if}
        </button>
        <button class="download-btn" on:click={downloadPDF}>
          Download PDF
        </button>
      </div>
    </div>
  
    <!-- Hidden file input -->
    <input 
      bind:this={fileInput}
      type="file" 
      accept="image/*"
      on:change={handleFileChange}
      class="hidden"
    />
  
    <!-- Robot Documentation -->
    <div class="max-w-4xl mx-auto">
      <!-- Main template structure -->
      <div class="pages-container">
  
        <CoverPage {headerInfo} {totalPages} {currentPage} />
        
   
        <ChangeLog {headerInfo} {changeLogInfo} {totalPages} />
  
        <TableOfContent {headerInfo} {totalPages} />
  
  
        <ApplicationVersion {headerInfo} {psaApplicationVersionInfo} {totalPages} />
  
  
        <ListOfINOUT {headerInfo} {totalPages} />
   
      
  
        <LimitsOfAxes {headerInfo} {axesLimits} />
   
        <APILog {currentRobotInfo} {interlocks} />
        <InterlockedSystem {currentRobotInfo} {interlocks} />
             
        <IndetifierList {currentRobotInfo} {identificationPoints} />
        <IndetifierList {currentRobotInfo} {identificationPoints} />
        
        <RobotRectracted {currentRobotInfo} />
        <RobotCalibrated {currentRobotInfo} />
  
        <OffSetMotours {currentRobotInfo} />
      
      </div>
    </div>
  </div>