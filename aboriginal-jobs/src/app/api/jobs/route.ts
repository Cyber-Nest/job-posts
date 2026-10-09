import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Employer } from "@/lib/models/Employer";
import { Job } from "@/lib/models/Job";
import { getAuth } from "@/lib/auth/auth";
import { generateJobId } from "@/lib/utils/generateJobId";
import { EmployerPackage } from "@/lib/models/EmployerPackage";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const province = searchParams.get("province");
    const employmentType = searchParams.get("employmentType");
    const remote = searchParams.get("remote");
    const search = searchParams.get("search");

    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const query: any = {
      status: "active",
      $and: [
        {
          $or: [
            { expiresAt: { $eq: null } },
            { expiresAt: { $gt: new Date() } },
          ],
        },
      ],
    };

    // Category Filter
    if (category && category !== "all") {
      query.category = category;
    }

    // Province Filter
    if (province && province !== "all") {
      query.province = province;
    }

    // Employment Type Filter
    if (employmentType && employmentType !== "all") {
      query.employmentType = employmentType;
    }

    // Remote Filter
    if (remote === "true") {
      query.remote = true;
    }

    // Search Filter
    if (search?.trim()) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { descriptionHtml: { $regex: search, $options: "i" } },
      ];
    }

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .sort({ postDate: -1, postedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Job.countDocuments(query),
    ]);

    const formattedJobs = jobs.map((job: any) => {
      let formattedExperience = "";

      if (job.experience) {
        if (!isNaN(Number(job.experience))) {
          const years = Number(job.experience);

          formattedExperience = `${years} ${years === 1 ? "year" : "years"}`;
        } else if (
          job.experience.includes("+") &&
          !job.experience.toLowerCase().includes("year")
        ) {
          formattedExperience = `${job.experience} year`;
        } else {
          formattedExperience = job.experience;
        }
      }

      return {
        _id: job._id,

        jobId: job.jobId || null,

        title: job.title,

        company: job.company,

        location:
          job.location || [job.city, job.province].filter(Boolean).join(", "),

        salary: job.salary && job.salaryType ? `${job.salary}` : "",

        employmentType: job.employmentType,

        nocCode: job.nocCode,

        experience: formattedExperience,

        startDate:
          job.startDate === "immediate"
            ? "Immediate"
            : job.startDate === "asap"
              ? "Immediate"
              : job.startDate === "1week"
                ? "Within 1 week"
                : job.startDate,

        postDate: job.postDate,

        remote: Boolean(job.remote),

        indigenousOwned: Boolean(job.indigenousOwned),

        vacancies: job.vacancies || null,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedJobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch jobs error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
      contactName,
      vacancies,
    } = body;

    // Validation - Required fields
    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Job title is required." },
        { status: 400 },
      );
    }
    if (!company?.trim()) {
      return NextResponse.json(
        { error: "Company name is required." },
        { status: 400 },
      );
    }
    if (!city?.trim()) {
      return NextResponse.json({ error: "City is required." }, { status: 400 });
    }
    if (!province?.trim()) {
      return NextResponse.json(
        { error: "Province is required." },
        { status: 400 },
      );
    }
    if (!employmentType?.trim()) {
      return NextResponse.json(
        { error: "Employment type is required." },
        { status: 400 },
      );
    }
    if (!category?.trim()) {
      return NextResponse.json(
        { error: "Category is required." },
        { status: 400 },
      );
    }
    if (!nocCode?.trim()) {
      return NextResponse.json(
        { error: "NOC code is required." },
        { status: 400 },
      );
    }
    if (!descriptionHtml?.trim()) {
      return NextResponse.json(
        { error: "Job description is required." },
        { status: 400 },
      );
    }
    if (!requirementsHtml?.trim()) {
      return NextResponse.json(
        { error: "Qualifications & Requirements are required." },
        { status: 400 },
      );
    }
    if (!contactName?.trim()) {
      return NextResponse.json(
        { error: "Employer contact name is required." },
        { status: 400 },
      );
    }

    if (
      !applyMethods ||
      !Array.isArray(applyMethods) ||
      applyMethods.length === 0
    ) {
      return NextResponse.json(
        { error: "At least one application method is required." },
        { status: 400 },
      );
    }

    // Validate each apply method
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
                error: "Valid email is required for email application method.",
              },
              { status: 400 },
            );
          }
          break;
        case "phone":
          if (!method.phone) {
            return NextResponse.json(
              {
                error: "Phone number is required for phone application method.",
              },
              { status: 400 },
            );
          }
          break;
        case "mail":
          if (!method.mailAddress) {
            return NextResponse.json(
              {
                error: "Mail address is required for mail application method.",
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

    // Find or create employer
    let employerRecord = await Employer.findOne({ authUserId: userId });

    if (!employerRecord) {
      employerRecord = await Employer.create({
        authUserId: userId,
        orgName: company.trim(),
      });
    }
    // GET ACTIVE PACKAGE
    const employerPackage = await EmployerPackage.findOne({
      employerId: employerRecord._id,
      status: "Active",
    });

    if (!employerPackage) {
      return NextResponse.json(
        {
          error: "No active package found.",
        },
        {
          status: 403,
        },
      );
    }

    // CHECK PACKAGE EXPIRY
    if (
      employerPackage.expiresAt &&
      new Date(employerPackage.expiresAt) < new Date()
    ) {
      return NextResponse.json(
        {
          error: "Your package has expired. Please upgrade your plan.",
        },
        {
          status: 403,
        },
      );
    }

    // CHECK CREDITS
    if (
      !employerPackage.unlimitedJobs &&
      employerPackage.remainingCredits <= 0
    ) {
      return NextResponse.json(
        {
          error: "Your credits are exhausted. Please upgrade your plan.",
        },
        {
          status: 403,
        },
      );
    }

    // Employment type mapping
    const typeMap: Record<string, string> = {
      "Full-time": "Full-time",
      "Part-time": "Part-time",
      Contract: "Contract",
      "Casual / Seasonal": "Casual",
      Volunteer: "Volunteer",
    };

    const mappedType = typeMap[employmentType] || "Full-time";
    const location = [city.trim(), province.trim()].join(", ");

    // Calculate expiry date
    let expiresAt = null;
    if (runDays) {
      const daysToAdd = parseInt(runDays) || 30;
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + daysToAdd);
    }

    // Prepare apply methods for database
    const formattedApplyMethods = applyMethods.map((method: any) => {
      const formatted: any = { method: method.method };
      if (method.email) formatted.email = method.email.toLowerCase().trim();
      if (method.phone) formatted.phone = method.phone.trim();
      if (method.mailAddress) formatted.mailAddress = method.mailAddress.trim();
      if (method.inPersonAddress)
        formatted.inPersonAddress = method.inPersonAddress.trim();
      if (method.inPersonTiming)
        formatted.inPersonTiming = method.inPersonTiming.trim();
      return formatted;
    });

    // Create job with all fields
    const jobData: any = {
      employerId: employerRecord._id,
      title: title.trim(),
      company: company.trim(),
      contactName: contactName.trim(),
      city: city.trim(),
      province: province.trim(),
      location,
      salary: salary?.trim() || "",
      salaryType: salaryType || "hour",
      vacancies: Number(vacancies) || 1,
      employmentType: mappedType,
      category: category.trim(),
      nocCode: nocCode.trim(),
      runDays: runDays || "30",
      experience: experience?.trim() || "",
      startDate: startDate || "",
      descriptionHtml: descriptionHtml.trim(),
      requirementsHtml: requirementsHtml?.trim() || "",
      website: website?.trim() || "",
      indigenousOwned: indigenousOwned ?? false,
      remote: remote ?? false,
      status: "active",
      indigenousPreference: indigenousOwned ?? false,
      expiresAt,
      applyMethods: formattedApplyMethods,
      packageId: employerPackage._id,
      creditConsumed: true,
    };

    // Add contactEmail only if provided
    if (contactEmail?.trim()) {
      jobData.contactEmail = contactEmail.trim().toLowerCase();
    }

    // Add custom postDate if provided
    if (postDate) {
      jobData.postDate = new Date(postDate);
    }

    const newJobId = await generateJobId();
    jobData.jobId = newJobId;

    const createdJob = await Job.create(jobData);

    // DEDUCT CREDIT
    if (!employerPackage.unlimitedJobs) {
      employerPackage.remainingCredits -= 1;

      await employerPackage.save();
    }

    return NextResponse.json(
      {
        success: true,
        jobId: createdJob._id,
        displayJobId: createdJob.jobId,
        message: "Job posted successfully!",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
