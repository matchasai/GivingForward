package com.example.fundapp.service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.example.fundapp.model.Donation;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;

/**
 * Service for generating PDF donation receipts
 */
@Service
public class ReceiptService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm:ss");

    /**
     * Generate a PDF receipt for a donation
     * 
     * @param donation The donation to generate receipt for
     * @return PDF content as byte array
     * @throws Exception if PDF generation fails
     */
    public byte[] generateReceipt(Donation donation) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        // Header
        Paragraph header = new Paragraph("DONATION RECEIPT")
                .setFontSize(24)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(ColorConstants.BLUE);
        document.add(header);

        // Organization info
        Paragraph orgInfo = new Paragraph("GivingForward Fund Donation Platform")
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
        document.add(orgInfo);

        // Receipt details table
        Table table = new Table(UnitValue.createPercentArray(new float[]{1, 2}))
                .useAllAvailableWidth()
                .setMarginTop(20);

        addTableRow(table, "Receipt ID:", donation.getId());
        addTableRow(table, "Donation Date:", donation.getDonatedAt().format(DATE_FORMATTER));
        addTableRow(table, "Donor Name:", donation.getUser().getName());
        addTableRow(table, "Donor Email:", donation.getUser().getEmail());
        addTableRow(table, "Campaign:", donation.getCampaign().getTitle());
        addTableRow(table, "Amount:", String.format("₹%.2f", donation.getAmount()));
        addTableRow(table, "Payment Status:", donation.getPaymentStatus().name());

        document.add(table);

        // Footer note
        Paragraph footer = new Paragraph("\nThank you for your generous donation!")
                .setFontSize(14)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(30)
                .setFontColor(ColorConstants.GREEN);
        document.add(footer);

        Paragraph taxNote = new Paragraph(
                "This receipt is for your records. Please retain it for tax purposes if applicable.")
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(10)
                .setItalic();
        document.add(taxNote);

        // Close document
        document.close();

        return baos.toByteArray();
    }

    /**
     * Helper method to add a row to the table
     */
    private void addTableRow(Table table, String label, String value) {
        table.addCell(new Paragraph(label).setBold());
        table.addCell(new Paragraph(value));
    }
}
