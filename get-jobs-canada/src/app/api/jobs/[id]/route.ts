import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Job } from "@/lib/models/Job";
import { Employer } from "@/lib/models/Employer";
import { getAuth } from "@/lib/auth/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();

    const job = await Job.findById(id)
      .populate("employerId", "orgName email")
      .lean();

    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    // Check if job is expired
    if (job.expiresAt && new Date(job.expiresAt) < new Date()) {
      job.status = "expired";
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error("Fetch job detail error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}

// PUT - Update job (for employers to edit their posts)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();

    // Auth check
    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    const userId = session.user.id;
    const body = await request.json();

    // Find the job first
    const existingJob = await Job.findById(id);

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    // Check if employer owns this job
    const employer = await Employer.findOne({ authUserId: userId });
    if (
      !employer ||
      existingJob.employerId.toString() !== employer._id.toString()
    ) {
      return NextResponse.json(
        { error: "You don't have permission to update this job." },
        { status: 403 },
      );
    }

    const {
      title,
      company,
      city,
      province,
      employmentType,
      salary,
      salaryType,
      category,
      nocCode,
      runDays,
      experience,
      startDate,
      descriptionHtml,
      requirementsHtml,
      indigenousOwned,
      remote,
      contactEmail,
      website,
      applyMethods,
      postDate,
      status,
      contactName,
      vacancies,
    } = body;

    // Validation - Required fields
    if (title !== undefined && !title?.trim()) {
      return NextResponse.json(
        { error: "Job title is required." },
        { status: 400 },
      );
    }
    if (company !== undefined && !company?.trim()) {
      return NextResponse.json(
        { error: "Company name is required." },
        { status: 400 },
      );
    }
    if (city !== undefined && !city?.trim()) {
      return NextResponse.json({ error: "City is required." }, { status: 400 });
    }
    if (province !== undefined && !province?.trim()) {
      return NextResponse.json(
        { error: "Province is required." },
        { status: 400 },
      );
    }
    if (employmentType !== undefined && !employmentType?.trim()) {
      return NextResponse.json(
        { error: "Employment type is required." },
        { status: 400 },
      );
    }
    if (category !== undefined && !category?.trim()) {
      return NextResponse.json(
        { error: "Category is required." },
        { status: 400 },
      );
    }
    if (nocCode !== undefined && !nocCode?.trim()) {
      return NextResponse.json(
        { error: "NOC code is required." },
        { status: 400 },
      );
    }
    if (descriptionHtml !== undefined && !descriptionHtml?.trim()) {
      return NextResponse.json(
        { error: "Job description is required." },
        { status: 400 },
      );
    }
    if (requirementsHtml !== undefined && !requirementsHtml?.trim()) {
      return NextResponse.json(
        { error: "Qualifications & Requirements are required." },
        { status: 400 },
      );
    }

    // Contact name validation
    if (contactName !== undefined) {
      if (!contactName?.trim()) {
        return NextResponse.json(
          { error: "Employer contact name is required." },
          { status: 400 },
        );
      }
      if (!/^[A-Za-z\s\-'.]+$/.test(contactName.trim())) {
        return NextResponse.json(
          {
            error:
              "Contact name should only contain letters, spaces, hyphens, and apostrophes.",
          },
          { status: 400 },
        );
      }
    }
    // Validate applyMethods if provided
    if (applyMethods !== undefined) {
      if (!Array.isArray(applyMethods) || applyMethods.length === 0) {
        return NextResponse.json(
          { error: "At least one application method is required." },
          { status: 400 },
        );
      }

      for (const method of applyMethods) {
        if (!method.method) {
          return NextResponse.json(
            { error: "Application method type is required." },
            { status: 400 },
          );
        }

        switch (method.method) {
          case "email":
            if (!method.email || !/^\S+@\S+\.\S+$/.test(method.email)) {
              return NextResponse.json(
                {
                  error:
                    "Valid email is required for email application method.",
                },
                { status: 400 },
              );
            }
            break;
          case "phone":
            if (!method.phone) {
              return NextResponse.json(
                {
                  error:
                    "Phone number is required for phone application method.",
                },
                { status: 400 },
              );
            }
            break;
          case "mail":
            if (!method.mailAddress) {
              return NextResponse.json(
                {
                  error:
                    "Mail address is required for mail application method.",
                },
                { status: 400 },
              );
            }
            break;
          case "inPerson":
            if (!method.inPersonAddress) {
              return NextResponse.json(
                {
                  error:
                    "In-person address is required for in-person application method.",
                },
                { status: 400 },
              );
            }
            if (!method.inPersonTiming) {
              return NextResponse.json(
                {
                  error:
                    "Time schedule is required for in-person application method.",
                },
                { status: 400 },
              );
            }
            break;
          default:
            return NextResponse.json(
              { error: `Invalid application method: ${method.method}` },
              { status: 400 },
            );
        }
      }
    }

    // Employment type mapping
    const typeMap: Record<string, string> = {
      "Full-time": "Full-time",
      "Part-time": "Part-time",
      Contract: "Contract",
      "Casual / Seasonal": "Casual",
      Volunteer: "Volunteer",
    };

    // Prepare update data
    const updateData: any = {};

    if (title !== undefined) updateData.title = title.trim();
    if (company !== undefined) updateData.company = company.trim();
    if (city !== undefined) updateData.city = city.trim();
    if (province !== undefined) updateData.province = province.trim();
    if (city !== undefined || province !== undefined) {
      updateData.location = [
        city?.trim() || existingJob.city,
        province?.trim() || existingJob.province,
      ].join(", ");
    }
    if (contactName !== undefined) updateData.contactName = contactName.trim();
    if (salary !== undefined) updateData.salary = salary?.trim() || "";
    if (salaryType !== undefined) updateData.salaryType = salaryType || "hour";
    if (vacancies !== undefined) {
      updateData.vacancies = Number(vacancies) || 1;
    }
    if (employmentType !== undefined) {
      updateData.employmentType = typeMap[employmentType] || "Full-time";
    }
    if (category !== undefined) updateData.category = category.trim();
    if (nocCode !== undefined) updateData.nocCode = nocCode.trim();
    if (runDays !== undefined) {
      updateData.runDays = runDays || "30";
      // Recalculate expiry date if runDays changes
      const daysToAdd = parseInt(runDays) || 30;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + daysToAdd);
      updateData.expiresAt = expiresAt;
    }
    if (experience !== undefined)
      updateData.experience = experience?.trim() || "";
    if (startDate !== undefined) updateData.startDate = startDate || "";
    if (descriptionHtml !== undefined)
      updateData.descriptionHtml = descriptionHtml.trim();
    if (requirementsHtml !== undefined)
      updateData.requirementsHtml = requirementsHtml?.trim() || "";
    if (contactEmail !== undefined)
      updateData.contactEmail = contactEmail?.trim().toLowerCase() || "";
    if (website !== undefined) updateData.website = website?.trim() || "";
    if (indigenousOwned !== undefined)
      updateData.indigenousOwned = indigenousOwned;
    if (remote !== undefined) updateData.remote = remote;
    if (
      status !== undefined &&
      ["active", "closed", "expired"].includes(status)
    ) {
      updateData.status = status;
    }

    // Update applyMethods if provided
    if (applyMethods !== undefined) {
      updateData.applyMethods = applyMethods.map((method: any) => {
        const formatted: any = { method: method.method };
        if (method.email) formatted.email = method.email.toLowerCase().trim();
        if (method.phone) formatted.phone = method.phone.trim();
        if (method.mailAddress)
          formatted.mailAddress = method.mailAddress.trim();
        if (method.inPersonAddress)
          formatted.inPersonAddress = method.inPersonAddress.trim();
        if (method.inPersonTiming)
          formatted.inPersonTiming = method.inPersonTiming.trim();
        return formatted;
      });
    }

    // Update custom postDate if provided
    if (postDate !== undefined) {
      updateData.postDate = new Date(postDate);
    }

    const updatedJob = await Job.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    return NextResponse.json(
      {
        success: true,
        data: updatedJob,
        message: "Job updated successfully!",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update job error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}

// DELETE - Delete job (for employers to remove their posts)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();

    // Auth check
    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    // Find the job first
    const existingJob = await Job.findById(id);

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    // Check if employer owns this job
    const employer = await Employer.findOne({ authUserId: userId });
    if (
      !employer ||
      existingJob.employerId.toString() !== employer._id.toString()
    ) {
      return NextResponse.json(
        { error: "You don't have permission to delete this job." },
        { status: 403 },
      );
    }

    // Instead of deleting, mark as closed (soft delete)
    // await Job.findByIdAndUpdate(id, { status: "closed" });

    //hard delete
    await Job.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Job closed successfully!",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete job error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
