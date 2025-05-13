'use client'

// React Imports
import { useRef } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Third-party Imports
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Component Imports
import PreviewActions from './PreviewActions'
import PreviewCard from './PreviewCard'

const Preview = ({ orderData }) => {
  // Ref to target PreviewCard for PDF generation
  const cardRef = useRef(null)

  // Handle Print Button Click
  const handleButtonClick = () => {
    console.log('Print button clicked')
    window.print()
  }

  // Handle PDF Download
  const handleDownloadPDF = async () => {
    if (cardRef.current) {
      try {
        // Capture PreviewCard as canvas
        const canvas = await html2canvas(cardRef.current, {
          scale: 2, // Increase resolution
          useCORS: true // Handle cross-origin images (e.g., logo)
        })

        // Create PDF
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        })

        // Calculate dimensions
        const imgData = canvas.toDataURL('image/png')
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        const imgWidth = canvas.width
        const imgHeight = canvas.height
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
        const imgScaledWidth = imgWidth * ratio
        const imgScaledHeight = imgHeight * ratio

        // Add image to PDF
        pdf.addImage(imgData, 'PNG', 0, 0, imgScaledWidth, imgScaledHeight)

        // Download PDF
        pdf.save(`invoice-${orderData.order}.pdf`)
      } catch (error) {
        console.error('PDF generation failed:', error)
      }
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 9 }}>
        <div ref={cardRef}>
          <PreviewCard orderData={orderData} />
        </div>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <PreviewActions handleButtonClick={handleButtonClick} onDownloadClick={handleDownloadPDF} />
      </Grid>
    </Grid>
  )
}

export default Preview
