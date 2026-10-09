export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Job } from "@/lib/models/Job";
import { getAuth } from "@/lib/auth/auth";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";

// ==================== HELPERS ====================

function formatSalary(salary: string, salaryType: string): string {
  if (!salary) return "Not specified";

  const typeMap: Record<string, string> = {
    hour: "/hour",
    week: "/week",
    month: "/month",
    year: "/year",
  };

  return `$${salary} CAD${typeMap[salaryType] || ""}`;
}

function formatDate(date: string | Date): string {
  if (!date) return "Not specified";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getStartDateLabel(startDate: string): string {
  const dateMap: Record<string, string> = {
    asap: "As Soon As Possible",
    immediate: "Immediate Joining",
    "1week": "Within 1 Week",
    "2weeks": "Within 2 Weeks",
    "1month": "Within 1 Month",
  };

  return dateMap[startDate] || startDate || "N/A";
}

function decodeHtml(html: string): string {
  return html
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractBulletPoints(html: string): string[] {
  if (!html) return [];

  const matches = [...html.matchAll(/<li>(.*?)<\/li>/g)];

  return matches.map((m) => decodeHtml(m[1].replace(/<[^>]*>/g, "").trim()));
}

function extractParagraphText(html: string): string {
  if (!html) return "";

  return decodeHtml(
    html
      .replace(/<ul>[\s\S]*?<\/ul>/g, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

// ==================== API ====================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await connectDB();

    // ==================== AUTH ====================

    const auth = await getAuth();

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        { status: 401 },
      );
    }

    // ==================== FETCH JOB ====================

    const job = await Job.findById(id).lean();

    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    // ==================== PERMISSION ====================

    const employerCollection = mongoose.connection.collection("employers");

    const employer = await employerCollection.findOne({
      authUserId: session.user.id,
    });

    const isOwner =
      employer && job.employerId.toString() === employer._id.toString();

    if (!isOwner && job.status !== "active") {
      return NextResponse.json(
        {
          error: "You don't have permission.",
        },
        { status: 403 },
      );
    }

    // ==================== PDF ====================

    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
    });

    const buffers: Buffer[] = [];

    doc.on("data", buffers.push.bind(buffers));

    const pageWidth = doc.page.width;

    const margin = 40;

    let y = 40;

    // ==================== HEADER ====================

    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .text("ABORIGINAL JOBS CANADA", margin, y, {
        align: "center",
      });

    y = doc.y + 4;

    doc
      .font("Helvetica")
      .fontSize(8)
      .text(
        "Connecting Indigenous Talent with Inclusive Employers",
        margin,
        y,
        {
          align: "center",
        },
      );

    y = doc.y + 12;

    doc
      .moveTo(margin, y)
      .lineTo(pageWidth - margin, y)
      .stroke();

    y += 10;

    // ==================== REFERENCE ====================

    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(`Reference: ${job.jobId || job._id}`, margin, y, {
        align: "right",
      });

    y = doc.y + 16;

    // ==================== JOB TITLE ====================

    doc.font("Helvetica").fontSize(10).fillColor("#000000");

    doc.text("Job Title: ", margin, y, {
      continued: true,
    });

    doc.font("Helvetica-Bold").text(job.title || "N/A");

    y = doc.y + 8;

    // ==================== COMPANY ====================

    doc.font("Helvetica").text("Company: ", margin, y, {
      continued: true,
    });

    doc.font("Helvetica-Bold").text(job.company || "N/A");

    y = doc.y + 8;

    // ==================== WEBSITE ====================

    if (job.website) {
      doc.font("Helvetica").text("Website: ", margin, y, {
        continued: true,
      });

      doc.font("Helvetica-Bold").fillColor("#1a73e8").text(job.website, {
        link: job.website,
        underline: true,
      });

      doc.fillColor("#000000");

      y = doc.y + 10;
    }

    // ==================== META ====================

    const postedDate = formatDate(job.postDate || job.postedAt);

    const expiryDate = job.expiresAt
      ? formatDate(job.expiresAt)
      : "Not specified";

    doc.font("Helvetica").fontSize(9).fillColor("#444444");

    doc.text("Location: ", margin, y, {
      continued: true,
    });

    doc.font("Helvetica-Bold").text(`${job.city}, ${job.province}`);

    doc.font("Helvetica").text("Posted: ", margin + 210, y, {
      continued: true,
    });

    doc.font("Helvetica-Bold").text(postedDate);

    doc.font("Helvetica").text("Closes: ", margin + 400, y, {
      continued: true,
    });

    doc.font("Helvetica-Bold").text(expiryDate);

    y = doc.y + 12;

    doc
      .moveTo(margin, y)
      .lineTo(pageWidth - margin, y)
      .stroke();

    y += 12;

    // ==================== CONTACT ====================

    if (job.contactName) {
      doc.font("Helvetica").fontSize(10).fillColor("#000000");

      doc.text("Contact Person: ", margin, y, {
        continued: true,
      });

      doc.font("Helvetica-Bold").text(job.contactName);

      y = doc.y + 14;
    }

    // ==================== SECTION TITLE ====================

    const drawSectionTitle = (title: string) => {
      doc.font("Helvetica-Bold").fontSize(11).fillColor("#000000");

      doc.text(title, margin, y);

      y = doc.y + 4;

      doc
        .moveTo(margin, y)
        .lineTo(pageWidth - margin, y)
        .stroke();

      y += 10;
    };

    // ==================== JOB DETAILS ====================

    drawSectionTitle("JOB DETAILS");

    doc.fontSize(10);

    const details = [
      {
        label: "Employment Type:",
        value: job.employmentType || "N/A",
      },
      {
        label: "Salary:",
        value: formatSalary(job.salary, job.salaryType),
      },
      {
        label: "NOC Code:",
        value: job.nocCode || "Not specified",
      },
      {
        label: "Category:",
        value: job.category || "N/A",
      },
      {
        label: "Remote:",
        value: job.remote ? "Yes" : "No",
      },
      {
        label: "Indigenous Employer:",
        value: job.indigenousOwned ? "Yes" : "No",
      },
    ];

    const col1X = margin;
    const col2X = margin + 300;

    details.forEach((detail, idx) => {
      const x = idx < 3 ? col1X : col2X;

      const yPos = y + (idx % 3) * 24;

      doc.font("Helvetica").text(`${detail.label} `, x, yPos, {
        continued: true,
      });

      doc.font("Helvetica-Bold").text(detail.value);
    });

    y += 88;

    // ==================== ADDITIONAL ====================

    if (job.experience || job.startDate || job.runDays) {
      drawSectionTitle("ADDITIONAL INFORMATION");

      if (job.experience) {
        doc.font("Helvetica").text("Experience Required: ", margin, y, {
          continued: true,
        });

        doc
          .font("Helvetica-Bold")
          .text(
            `${job.experience} ${
              parseInt(job.experience) > 1 ? "years" : "year"
            }`,
          );

        y += 20;
      }

      if (job.startDate) {
        doc.font("Helvetica").text("Expected Start Date: ", margin, y, {
          continued: true,
        });

        doc.font("Helvetica-Bold").text(getStartDateLabel(job.startDate));

        y += 20;
      }

      if (job.runDays) {
        doc.font("Helvetica").text("Posting Duration: ", margin, y, {
          continued: true,
        });

        doc.font("Helvetica-Bold").text(`${job.runDays} days`);

        y += 24;
      }
    }

    // ==================== ABOUT ====================

    drawSectionTitle("ABOUT THE ROLE");

    const aboutText = extractParagraphText(job.descriptionHtml);

    if (aboutText) {
      doc
        .font("Helvetica")
        .fontSize(10)
        .text(aboutText, margin, y, {
          width: pageWidth - margin * 2,
          lineGap: 2,
        });

      y = doc.y + 8;
    }

    const aboutBullets = extractBulletPoints(job.descriptionHtml);

    aboutBullets.forEach((point) => {
      doc.text(`• ${point}`, margin + 10, y, {
        width: pageWidth - margin * 2 - 10,
        lineGap: 2,
      });

      y = doc.y + 4;
    });

    y += 8;

    // ==================== REQUIREMENTS ====================

    drawSectionTitle("QUALIFICATIONS & REQUIREMENTS");

    const reqText = extractParagraphText(job.requirementsHtml);

    if (reqText) {
      doc
        .font("Helvetica")
        .fontSize(10)
        .text(reqText, margin, y, {
          width: pageWidth - margin * 2,
          lineGap: 2,
        });

      y = doc.y + 8;
    }

    const reqBullets = extractBulletPoints(job.requirementsHtml);

    reqBullets.forEach((point) => {
      doc.text(`• ${point}`, margin + 10, y, {
        width: pageWidth - margin * 2 - 10,
        lineGap: 2,
      });

      y = doc.y + 4;
    });

    y += 10;

    // ==================== APPLY ====================

    drawSectionTitle("HOW TO APPLY");

    const applyMethods = (job.applyMethods || [])
      .map((method: any) => {
        switch (method.method) {
          case "email":
            return {
              label: "Email:",
              value: method.email || "Not provided",
            };

          case "phone":
            return {
              label: "Phone:",
              value: method.phone || "Not provided",
            };

          case "mail":
            return {
              label: "Mail:",
              value: method.mailAddress || "Not provided",
            };

          case "inPerson":
            return {
              label: "In Person:",
              value: method.inPersonAddress || "Not provided",
              hours: method.inPersonTiming || "",
            };

          default:
            return null;
        }
      })
      .filter(Boolean);

    applyMethods.forEach((item: any) => {
      doc.font("Helvetica").fontSize(10).fillColor("#000000");

      doc.text(`• ${item.label} `, margin + 10, y, {
        continued: true,
      });

      doc.font("Helvetica-Bold").text(item.value);

      y = doc.y + 8;

      // In Person Hours
      if (item.hours) {
        doc.font("Helvetica").text("  Hours: ", margin + 20, y, {
          continued: true,
        });

        doc.font("Helvetica-Bold").text(item.hours);

        y = doc.y + 8;
      }
    });

    // ==================== FOOTER ====================

    const footerY = doc.page.height - 62;

    doc.font("Helvetica").fontSize(7).fillColor("#666666");

    doc.text(
      "This is an official job posting from Aboriginal Jobs Canada.",
      margin,
      footerY,
      {
        align: "center",
        width: pageWidth - margin * 2,
      },
    );

    doc.text(
      `www.aboriginaljobs.ca | Job ID: ${
        job.jobId || job._id
      } | Generated on: ${new Date().toLocaleString()}`,
      margin,
      footerY + 10,
      {
        align: "center",
        width: pageWidth - margin * 2,
      },
    );

    // ==================== FINALIZE ====================

    doc.end();

    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on("end", () => {
        resolve(Buffer.concat(buffers));
      });
    });

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${
          job.jobId || job._id
        }-${job.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Download job PDF error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate PDF",
      },
      { status: 500 },
    );
  }
}
