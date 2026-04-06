console.log(
  "Service Role Key létezik?",
  !!process.env.SUPABASE_SERVICE_ROLE_KEY,
);

import { NextResponse } from "next/server";

import { ConfigurationError, getAppBaseUrl } from "@/lib/config/server-env";
import { sendAdminServiceRequestNotification } from "@/lib/email/admin-notifications";
import { sendCustomerServiceRequestConfirmation } from "@/lib/email/customer-confirmations";
import { logServerError } from "@/lib/logging";
import {
  buildBuildingServicesInsert,
  buildBoilerReplacementInsert,
  buildFaultReportInsert,
  buildHeatingModernizationInsert,
  buildHeatPumpInstallationInsert,
  buildLeakRequestInsert,
  buildPlumbingRequestInsert,
  type BuildingServicesInquiryData,
  type BoilerReplacementInquiryData,
  type FaultReportInquiryData,
  type HeatingModernizationInquiryData,
  type HeatPumpInstallationInquiryData,
  type LeakRequestInquiryData,
  type PlumbingRequestInquiryData,
} from "@/lib/service-requests/service-request-payloads";
import { isServiceRequestType } from "@/lib/service-requests/service-request-types";
import {
  assertSupabaseServerConfiguration,
  getSupabaseServerClient,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

type ServiceRequestSubmissionBody =
  | {
      requestId: string;
      serviceType: "kazancsere";
      formData: BoilerReplacementInquiryData;
    }
  | {
      requestId: string;
      serviceType: "futeskorszerusites";
      formData: HeatingModernizationInquiryData;
    }
  | {
      requestId: string;
      serviceType: "hibabejelentes";
      formData: FaultReportInquiryData;
    }
  | {
      requestId: string;
      serviceType: "csotores_szivargas";
      formData: LeakRequestInquiryData;
    }
  | {
      requestId: string;
      serviceType: "vizszereles";
      formData: PlumbingRequestInquiryData;
    }
  | {
      requestId: string;
      serviceType: "hoszivattyu_telepites";
      formData: HeatPumpInstallationInquiryData;
    }
  | {
      requestId: string;
      serviceType: "komplett_epuletgepeszeti_kivitelezes";
      formData: BuildingServicesInquiryData;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function buildInsertPayload(body: ServiceRequestSubmissionBody) {
  if (body.serviceType === "kazancsere") {
    return buildBoilerReplacementInsert(body.requestId, body.formData);
  }

  if (body.serviceType === "hibabejelentes") {
    return buildFaultReportInsert(body.requestId, body.formData);
  }

  if (body.serviceType === "csotores_szivargas") {
    return buildLeakRequestInsert(body.requestId, body.formData);
  }

  if (body.serviceType === "vizszereles") {
    return buildPlumbingRequestInsert(body.requestId, body.formData);
  }

  if (body.serviceType === "hoszivattyu_telepites") {
    return buildHeatPumpInstallationInsert(body.requestId, body.formData);
  }

  if (body.serviceType === "komplett_epuletgepeszeti_kivitelezes") {
    return buildBuildingServicesInsert(body.requestId, body.formData);
  }

  return buildHeatingModernizationInsert(body.requestId, body.formData);
}

export async function POST(request: Request) {
  let body: ServiceRequestSubmissionBody;

  try {
    const json = (await request.json()) as unknown;

    if (!isRecord(json)) {
      return NextResponse.json(
        { error: "Érvénytelen ajánlatkérési adatok érkeztek." },
        { status: 400 },
      );
    }

    const requestId = json.requestId;
    const serviceType = json.serviceType;
    const formData = json.formData;

    if (
      typeof requestId !== "string" ||
      !requestId ||
      !isServiceRequestType(serviceType) ||
      !isRecord(formData)
    ) {
      return NextResponse.json(
        { error: "Érvénytelen ajánlatkérési adatok érkeztek." },
        { status: 400 },
      );
    }

    body = {
      requestId,
      serviceType,
      formData,
    } as ServiceRequestSubmissionBody;
  } catch {
    return NextResponse.json(
      { error: "Az ajánlatkérés feldolgozása nem sikerült." },
      { status: 400 },
    );
  }

  let payload: ReturnType<typeof buildInsertPayload>;

  try {
    payload = buildInsertPayload(body);
  } catch (error) {
    logServerError("Érvénytelen ajánlatkérési payload érkezett", error, {
      serviceType: body.serviceType,
      requestId: body.requestId,
    });

    return NextResponse.json(
      { error: "Érvénytelen ajánlatkérési adatok érkeztek." },
      { status: 400 },
    );
  }

  try {
    assertSupabaseServerConfiguration("Ajánlatkérés mentés");

    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("service_requests")
      .insert([payload])
      .select("id, created_at")
      .single();

    if (error) {
      throw error;
    }

    let notificationSent = false;
    let customerConfirmationSent = false;

    try {
      await sendAdminServiceRequestNotification({
        payload,
        submittedAt: data.created_at,
        baseUrl: getAppBaseUrl(request.url).toString(),
      });
      notificationSent = true;
    } catch (notificationError) {
      logServerError(
        "Admin értesítő e-mail küldési hiba új ajánlatkérés után",
        notificationError,
        {
          serviceType: body.serviceType,
          requestId: body.requestId,
        },
      );
    }

    if (payload.email.trim()) {
      try {
        await sendCustomerServiceRequestConfirmation({
          payload,
        });
        customerConfirmationSent = true;
      } catch (customerNotificationError) {
        logServerError(
          "Ügyfél visszaigazoló e-mail küldési hiba új ajánlatkérés után",
          customerNotificationError,
          {
            serviceType: body.serviceType,
            requestId: body.requestId,
          },
        );
      }
    }

    return NextResponse.json({
      requestId: data.id,
      notificationSent,
      customerConfirmationSent,
    });
  } catch (error) {
    if (error instanceof ConfigurationError) {
      logServerError("Ajánlatkérés konfigurációs hiba", error, {
        serviceType: body.serviceType,
        requestId: body.requestId,
      });

      return NextResponse.json(
        { error: "A kérés fogadása jelenleg nem érhető el." },
        { status: 503 },
      );
    }

    logServerError("Ajánlatkérés szerveroldali mentési hiba", error, {
      serviceType: body.serviceType,
      requestId: body.requestId,
    });

    return NextResponse.json(
      { error: "Az ajánlatkérés rögzítése most nem sikerült." },
      { status: 500 },
    );
  }
}
