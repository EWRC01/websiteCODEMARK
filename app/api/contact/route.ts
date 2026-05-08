import { NextResponse } from "next/server"
import { buildContactConfirmationEmail, buildContactEmail, type ContactEmailPayload } from "@/features/contact/emailTemplates"

const MAILJET_SEND_ENDPOINT = "https://api.mailjet.com/v3.1/send"
const RECAPTCHA_VERIFY_ENDPOINT = "https://www.google.com/recaptcha/api/siteverify"
const RECAPTCHA_ACTION = "contact_submit"
const LOCAL_RECAPTCHA_BYPASS_TOKEN = "local-dev-recaptcha-bypass"
const validServices = new Set(["web", "security", "ai", "optimization", "marketing", "consulting", "electronic-invoicing"])

type ContactApiErrorCode =
  | "CONTACT_NOT_CONFIGURED"
  | "CONTACT_INVALID_PAYLOAD"
  | "RECAPTCHA_FAILED"
  | "MAILJET_ACCOUNT_BLOCKED"
  | "MAILJET_AUTH_ERROR"
  | "MAILJET_SEND_FAILED"
  | "MAILJET_NETWORK_ERROR"

type RecaptchaVerification = {
  success?: boolean
  score?: number
  action?: string
  challenge_ts?: string
  hostname?: string
  "error-codes"?: string[]
}

type ContactRequestPayload = ContactEmailPayload & {
  recaptchaToken: string
}

type MailjetErrorPayload = {
  ErrorIdentifier?: string
  ErrorCode?: string
  StatusCode?: number
  ErrorMessage?: string
}

type MailjetRecipient = {
  Email: string
  Name: string
}

type MailjetMessage = {
  From: MailjetRecipient
  To: MailjetRecipient[]
  ReplyTo: MailjetRecipient
  Subject: string
  TextPart: string
  HTMLPart: string
  CustomID: string
}

type MailjetSendResult =
  | { ok: true }
  | { ok: false; code: ContactApiErrorCode; status: number; message: string; details?: MailjetErrorPayload & { raw: string } }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function isValidEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value)
}

function parseEmailList(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[;,]/)
        .map((email) => email.trim())
        .filter(isValidEmail),
    ),
  )
}

function getEnv() {
  const apiKey = process.env.MAILJET_API_KEY
  const secretKey = process.env.MAILJET_SECRET_KEY
  const fromEmail = process.env.CONTACT_FROM_EMAIL
  const toEmails = parseEmailList(process.env.CONTACT_TO_EMAIL || process.env.CONTACT_ADMIN_EMAIL || "")
  const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY
  const allowLocalRecaptchaBypass = process.env.RECAPTCHA_ALLOW_LOCALHOST_BYPASS !== "false"

  if (!apiKey || !secretKey || !fromEmail || toEmails.length === 0 || (!recaptchaSecretKey && !allowLocalRecaptchaBypass)) {
    return null
  }

  return {
    apiKey,
    secretKey,
    fromEmail,
    toEmails,
    fromName: process.env.CONTACT_FROM_NAME || "CodeMark Website",
    adminName: process.env.CONTACT_TO_NAME || "CodeMark",
    recaptchaSecretKey,
    allowLocalRecaptchaBypass,
    recaptchaMinScore: Number(process.env.RECAPTCHA_MIN_SCORE || "0.5"),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || "https://codemarksv.com/",
  }
}

function apiError(code: ContactApiErrorCode, status: number, message: string) {
  return NextResponse.json({ code, message }, { status })
}

function validatePayload(body: unknown): ContactRequestPayload | null {
  if (!isRecord(body)) return null

  const payload: ContactRequestPayload = {
    name: asString(body.name),
    email: asString(body.email),
    company: asString(body.company),
    countryCode: asString(body.countryCode),
    countryIso2: asString(body.countryIso2),
    phone: asString(body.phone),
    service: asString(body.service),
    message: asString(body.message),
    language: body.language === "en" ? "en" : "es",
    serviceLabel: asString(body.serviceLabel),
    recaptchaToken: asString(body.recaptchaToken),
  }

  const digitsOnly = payload.phone.replace(/\D/g, "")
  const hasValidPhoneCharacters = /^\+?[0-9\s().-]+$/.test(payload.phone)
  const hasValidCountryCode = /^\+[0-9]{1,5}$/.test(payload.countryCode)

  if (!payload.name || !isValidEmail(payload.email) || !payload.company || !payload.message || payload.message.length < 10 || !payload.recaptchaToken) {
    return null
  }

  if (!payload.countryCode || !hasValidCountryCode || !payload.phone || !hasValidPhoneCharacters || digitsOnly.length < 8 || digitsOnly.length > 16) {
    return null
  }

  if (!validServices.has(payload.service)) {
    return null
  }

  return payload
}

function getRemoteIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim()
  }

  return request.headers.get("x-real-ip") ?? undefined
}

function isLocalRequest(request: Request) {
  const host = request.headers.get("host")?.split(":")[0]
  return host === "localhost" || host === "127.0.0.1" || host === "::1"
}

function canBypassRecaptchaForLocalhost(request: Request, token: string, allowLocalRecaptchaBypass: boolean) {
  return allowLocalRecaptchaBypass && token === LOCAL_RECAPTCHA_BYPASS_TOKEN && isLocalRequest(request)
}

function isPassingRecaptcha(verification: RecaptchaVerification, minimumScore: number) {
  return (
    verification.success === true &&
    verification.action === RECAPTCHA_ACTION &&
    typeof verification.score === "number" &&
    verification.score >= minimumScore
  )
}

async function verifyRecaptchaToken(secretKey: string, token: string, remoteIp: string | undefined, minimumScore: number) {
  const formData = new URLSearchParams({
    secret: secretKey,
    response: token,
  })

  if (remoteIp) {
    formData.set("remoteip", remoteIp)
  }

  const response = await fetch(RECAPTCHA_VERIFY_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  }).catch((error) => {
    console.error("reCAPTCHA verification request failed", error)
    return null
  })

  if (!response?.ok) {
    console.error("reCAPTCHA verification failed without a valid response", { status: response?.status })
    return false
  }

  const verification = (await response.json().catch(() => null)) as RecaptchaVerification | null

  if (!verification || !isPassingRecaptcha(verification, minimumScore)) {
    console.warn("reCAPTCHA rejected contact form submission", {
      success: verification?.success,
      score: verification?.score,
      action: verification?.action,
      hostname: verification?.hostname,
      errorCodes: verification?.["error-codes"],
    })
    return false
  }

  return true
}

async function parseMailjetError(response: Response): Promise<MailjetErrorPayload & { raw: string }> {
  const raw = await response.text()

  try {
    const parsed = JSON.parse(raw) as MailjetErrorPayload
    return { ...parsed, raw }
  } catch {
    return { raw }
  }
}

function getMailjetErrorCode(response: Response, error: MailjetErrorPayload): ContactApiErrorCode {
  const message = error.ErrorMessage?.toLowerCase() ?? ""

  if (response.status === 401 && message.includes("temporarily blocked")) {
    return "MAILJET_ACCOUNT_BLOCKED"
  }

  if (response.status === 401 || response.status === 403) {
    return "MAILJET_AUTH_ERROR"
  }

  return "MAILJET_SEND_FAILED"
}

async function sendMailjetMessage(authToken: string, message: MailjetMessage): Promise<MailjetSendResult> {
  const response = await fetch(MAILJET_SEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Messages: [message] }),
  }).catch((error) => {
    console.error("Mailjet contact request failed", { customId: message.CustomID, error })
    return null
  })

  if (!response) {
    return { ok: false, code: "MAILJET_NETWORK_ERROR", status: 502, message: "No response from Mailjet." }
  }

  if (!response.ok) {
    const details = await parseMailjetError(response)
    const code = getMailjetErrorCode(response, details)
    const status = code === "MAILJET_ACCOUNT_BLOCKED" || code === "MAILJET_AUTH_ERROR" ? 503 : 502

    console.error("Mailjet contact send failed", {
      status: response.status,
      code,
      customId: message.CustomID,
      mailjetErrorCode: details.ErrorCode,
      mailjetErrorIdentifier: details.ErrorIdentifier,
      mailjetErrorMessage: details.ErrorMessage,
    })

    return {
      ok: false,
      code,
      status,
      message: details.ErrorMessage || "Unable to send contact email.",
      details,
    }
  }

  return { ok: true }
}

export async function POST(request: Request) {
  const env = getEnv()

  if (!env) {
    return apiError("CONTACT_NOT_CONFIGURED", 503, "Contact email service is not configured.")
  }

  const body = await request.json().catch(() => null)
  const payload = validatePayload(body)

  if (!payload) {
    return apiError("CONTACT_INVALID_PAYLOAD", 400, "Invalid contact form payload.")
  }

  const passedRecaptcha = canBypassRecaptchaForLocalhost(
    request,
    payload.recaptchaToken,
    env.allowLocalRecaptchaBypass,
  )
    ? true
    : env.recaptchaSecretKey
      ? await verifyRecaptchaToken(
          env.recaptchaSecretKey,
          payload.recaptchaToken,
          getRemoteIp(request),
          Number.isFinite(env.recaptchaMinScore) ? env.recaptchaMinScore : 0.5,
        )
      : false

  if (!passedRecaptcha) {
    return apiError("RECAPTCHA_FAILED", 403, "reCAPTCHA verification failed.")
  }

  const email = buildContactEmail(payload, env.siteUrl)
  const confirmationEmail = buildContactConfirmationEmail(payload, env.siteUrl)
  const authToken = Buffer.from(`${env.apiKey}:${env.secretKey}`).toString("base64")
  const from = {
    Email: env.fromEmail,
    Name: env.fromName,
  }
  const adminRecipients = env.toEmails.map((emailAddress) => ({
    Email: emailAddress,
    Name: env.adminName,
  }))
  const adminMessage: MailjetMessage = {
    From: from,
    To: adminRecipients,
    ReplyTo: {
      Email: payload.email,
      Name: payload.name,
    },
    Subject: email.subject,
    TextPart: email.text,
    HTMLPart: email.html,
    CustomID: `contact-admin-${payload.language}-${payload.service}`,
  }

  const adminResult = await sendMailjetMessage(authToken, adminMessage)

  if (!adminResult.ok) {
    return apiError(adminResult.code, adminResult.status, adminResult.message)
  }

  const confirmationMessage: MailjetMessage = {
    From: from,
    To: [
      {
        Email: payload.email,
        Name: payload.name,
      },
    ],
    ReplyTo: {
      Email: env.toEmails[0],
      Name: env.adminName,
    },
    Subject: confirmationEmail.subject,
    TextPart: confirmationEmail.text,
    HTMLPart: confirmationEmail.html,
    CustomID: `contact-confirmation-${payload.language}-${payload.service}`,
  }
  const confirmationResult = await sendMailjetMessage(authToken, confirmationMessage)

  if (!confirmationResult.ok) {
    return apiError(confirmationResult.code, confirmationResult.status, confirmationResult.message)
  }

  return NextResponse.json({ ok: true, adminNotificationSent: true, confirmationEmailSent: true })
}
