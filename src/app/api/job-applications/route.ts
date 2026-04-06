console.log(
  "Service Role Key létezik?",
  !!process.env.SUPABASE_SERVICE_ROLE_KEY,
);

import { NextResponse } from "next/server";

import { ConfigurationError, getAppBaseUrl } from "@/lib/config/server-env";
import { sendJobApplicationConfirmation } from "@/lib/email/job-application-confirmations";
import { sendAdminJobApplicationNotification } from "@/lib/email/job-application-notifications";
import {
  buildJobApplicationCvPath,
  jobApplicationFilesBucket,
  validateJobApplicationCvFile,
} from "@/lib/job-applications/job-application-media";
import {
  buildJobApplicationInsert,
  type JobApplicationFormData,
} from "@/lib/job-applications/job-application-payloads";
import { logServerError } from "@/lib/logging";
import {
  assertSupabaseServerConfiguration,
  getSupabaseServerClient,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

function getTextValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function validateJobApplicationBody(formData: JobApplicationFormData) {
  if (!formData.fullName) {
    throw new Error("A név megadása kötelező.");
  }

  if (!formData.email) {
    throw new Error("Az e-mail cím megadása kötelező.");
  }

  if (!formData.phone) {
    throw new Error("A telefonszám megadása kötelező.");
  }

  if (!formData.motivationText) {
    throw new Error("A motivációs szöveg megadása kötelező.");
  }
}

export async function POST(request: Request) {
  let applicationFormData: JobApplicationFormData;
  let cvFile: File;

  try {
    const formData = await request.formData();

    applicationFormData = {
      fullName: getTextValue(formData.get("fullName")),
      email: getTextValue(formData.get("email")),
      phone: getTextValue(formData.get("phone")),
      motivationText: getTextValue(formData.get("motivationText")),
      interestArea: getTextValue(formData.get("interestArea")),
      note: getTextValue(formData.get("note")),
    };

    const cvEntry = formData.get("cvFile");

    if (!(cvEntry instanceof File)) {
      return NextResponse.json(
        { error: "Az önéletrajz feltöltése kötelező." },
        { status: 400 },
      );
    }

    cvFile = cvEntry;
    validateJobApplicationBody(applicationFormData);
    validateJobApplicationCvFile(cvFile);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error && error.message
            ? error.message
            : "A jelentkezés feldolgozása nem sikerült.",
      },
      { status: 400 },
    );
  }

  const applicationId = crypto.randomUUID();
  const cvFilePath = buildJobApplicationCvPath({
    applicationId,
    fileName: cvFile.name,
  });

  try {
    assertSupabaseServerConfiguration("Munkajelentkezés mentés");

    const supabase = getSupabaseServerClient();

    const { error: uploadError } = await supabase.storage
      .from(jobApplicationFilesBucket)
      .upload(cvFilePath, cvFile, {
        upsert: false,
        contentType: cvFile.type || undefined,
      });

    if (uploadError) {
      throw uploadError;
    }

    const payload = buildJobApplicationInsert({
      applicationId,
      formData: applicationFormData,
      cvFilePath,
      cvFileName: cvFile.name,
      cvContentType: cvFile.type || "application/octet-stream",
      cvFileSizeBytes: cvFile.size,
    });

    const { data, error } = await supabase
      .from("job_applications")
      .insert([payload])
      .select("id, created_at")
      .single();

    if (error) {
      await supabase.storage
        .from(jobApplicationFilesBucket)
        .remove([cvFilePath])
        .catch(() => undefined);
      throw error;
    }

    let notificationSent = false;
    let customerConfirmationSent = false;

    try {
      await sendAdminJobApplicationNotification({
        application: payload,
        submittedAt: data.created_at,
        baseUrl: getAppBaseUrl(request.url).toString(),
      });
      notificationSent = true;
    } catch (notificationError) {
      logServerError(
        "Admin munkajelentkezési értesítő e-mail küldési hiba",
        notificationError,
        {
          applicationId: data.id,
        },
      );
    }

    try {
      await sendJobApplicationConfirmation({
        application: payload,
      });
      customerConfirmationSent = true;
    } catch (customerConfirmationError) {
      logServerError(
        "Jelentkező visszaigazoló e-mail küldési hiba",
        customerConfirmationError,
        {
          applicationId: data.id,
        },
      );
    }

    return NextResponse.json({
      applicationId: data.id,
      notificationSent,
      customerConfirmationSent,
    });
  } catch (error) {
    if (error instanceof ConfigurationError) {
      logServerError("Munkajelentkezés konfigurációs hiba", error);

      return NextResponse.json(
        { error: "A jelentkezés fogadása jelenleg nem érhető el." },
        { status: 503 },
      );
    }

    logServerError("Munkajelentkezés szerveroldali mentési hiba", error, {
      applicationId,
    });

    return NextResponse.json(
      { error: "A jelentkezés elküldése most nem sikerült." },
      { status: 500 },
    );
  }
}
