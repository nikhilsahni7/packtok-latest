import { Prisma } from "@packtok/db";
import PDFDocument from "pdfkit";
import config from "../config";
import supabase from "../utils/supabaseClient";

// ===== Types =====

interface OrderItemData {
  productTitle: string;
  quantity: number;
  productPrice: Prisma.Decimal;
  totalPrice: Prisma.Decimal;
  currency: string;
}

interface OrderData {
  orderNumber: string;
  createdAt: Date;
  status: string;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  shippingPhone: string;
  currency: string;
  subtotal: Prisma.Decimal;
  tax: Prisma.Decimal;
  shippingCost: Prisma.Decimal;
  totalAmount: Prisma.Decimal;
  items: OrderItemData[];
  user?: { name: string; email: string } | null;
}

// ===== PDF Generation =====

/**
 * Generate invoice PDF buffer using PDFKit
 */
export const generateInvoicePdf = async (order: OrderData): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers: Buffer[] = [];

      doc.on("data", (chunk: Buffer) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      // Header
      doc.fontSize(28).fillColor("#FF6B35").text("PACKTOK", 50, 50);
      doc.fontSize(10).fillColor("#666").text("www.packtok.com", 50, 85);

      // Invoice Title
      doc.fontSize(20).fillColor("#333").text("INVOICE", 400, 50, { align: "right" });
      doc.fontSize(10).fillColor("#666");
      doc.text(`Invoice #: ${order.orderNumber}`, 400, 80, { align: "right" });
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 400, 95, { align: "right" });
      doc.text(`Status: ${order.status}`, 400, 110, { align: "right" });

      // Divider
      doc.moveTo(50, 140).lineTo(545, 140).stroke("#eee");

      // Billing & Shipping Info
      doc.fontSize(12).fillColor("#333");
      doc.text("BILL TO:", 50, 160);
      doc.fontSize(10).fillColor("#666");
      doc.text(order.shippingName, 50, 180);
      doc.text(order.shippingAddress, 50, 195);
      doc.text(`${order.shippingCity}, ${order.shippingState} ${order.shippingZip}`, 50, 210);
      doc.text(order.shippingCountry, 50, 225);
      doc.text(`Phone: ${order.shippingPhone}`, 50, 240);

      doc.fontSize(12).fillColor("#333");
      doc.text("SHIP TO:", 300, 160);
      doc.fontSize(10).fillColor("#666");
      doc.text(order.shippingName, 300, 180);
      doc.text(order.shippingAddress, 300, 195);
      doc.text(`${order.shippingCity}, ${order.shippingState} ${order.shippingZip}`, 300, 210);
      doc.text(order.shippingCountry, 300, 225);

      // Table Header
      const tableTop = 280;
      doc.fillColor("#f8f9fa").rect(50, tableTop, 495, 25).fill();
      doc.fontSize(10).fillColor("#333");
      doc.text("Product", 55, tableTop + 8);
      doc.text("Qty", 320, tableTop + 8, { width: 50, align: "center" });
      doc.text("Unit Price", 380, tableTop + 8, { width: 80, align: "right" });
      doc.text("Total", 465, tableTop + 8, { width: 75, align: "right" });

      // Table Rows
      let yPosition = tableTop + 30;
      doc.fillColor("#666");

      for (const item of order.items) {
        // Check for page break
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }

        doc.text(item.productTitle.slice(0, 40), 55, yPosition, { width: 250 });
        doc.text(item.quantity.toString(), 320, yPosition, { width: 50, align: "center" });
        doc.text(`${item.currency} ${item.productPrice.toString()}`, 380, yPosition, { width: 80, align: "right" });
        doc.text(`${item.currency} ${item.totalPrice.toString()}`, 465, yPosition, { width: 75, align: "right" });

        yPosition += 25;
        doc.moveTo(50, yPosition - 5).lineTo(545, yPosition - 5).stroke("#eee");
      }

      // Totals
      yPosition += 20;
      doc.fillColor("#333");

      const totalsX = 380;
      const totalsValueX = 465;
      const totalsWidth = 75;

      doc.text("Subtotal:", totalsX, yPosition);
      doc.text(`${order.currency} ${order.subtotal.toString()}`, totalsValueX, yPosition, { width: totalsWidth, align: "right" });

      yPosition += 20;
      doc.text("Tax:", totalsX, yPosition);
      doc.text(`${order.currency} ${order.tax.toString()}`, totalsValueX, yPosition, { width: totalsWidth, align: "right" });

      yPosition += 20;
      doc.text("Shipping:", totalsX, yPosition);
      doc.text(`${order.currency} ${order.shippingCost.toString()}`, totalsValueX, yPosition, { width: totalsWidth, align: "right" });

      yPosition += 25;
      doc.moveTo(totalsX, yPosition - 5).lineTo(545, yPosition - 5).stroke("#333");

      doc.fontSize(14).fillColor("#333");
      doc.text("Total:", totalsX, yPosition);
      doc.text(`${order.currency} ${order.totalAmount.toString()}`, totalsValueX, yPosition, { width: totalsWidth, align: "right" });

      // Footer
      doc.fontSize(10).fillColor("#666");
      doc.text("Thank you for your business!", 50, 750, { align: "center", width: 495 });
      doc.text("Packtok | support@packtok.com", 50, 765, { align: "center", width: 495 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Upload invoice PDF to Supabase storage
 * Uses the shared supabase client like other document uploads
 */
export const uploadInvoiceToSupabase = async (
  orderNumber: string,
  pdfBuffer: Buffer
): Promise<string> => {
  const DOC_BUCKET = config.supabase.doc_bucket;
  const fileName = `invoices/invoice-${orderNumber}.pdf`;

  const { error } = await supabase.storage
    .from(DOC_BUCKET)
    .upload(fileName, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) {
    console.error("Supabase invoice upload error:", error);
    throw new Error(`Failed to upload invoice: ${error.message}`);
  }

  // Get the URL based on bucket privacy setting
  if (config.supabase.privateBuckets) {
    const { data, error: signError } = await supabase.storage
      .from(DOC_BUCKET)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year
    if (signError) throw new Error(signError.message);
    return data.signedUrl;
  }

  const { data: publicUrl } = supabase.storage
    .from(DOC_BUCKET)
    .getPublicUrl(fileName);

  return publicUrl.publicUrl;
};
