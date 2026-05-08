import type { ContactFormData } from "./types"

export type ContactEmailLanguage = "es" | "en"

export type ContactEmailPayload = ContactFormData & {
  language: ContactEmailLanguage
  serviceLabel: string
}

const brand = {
  name: "CodeMark",
  primary: "#06B6D4",
  dark: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  background: "#F8FAFC",
  surface: "#FFFFFF",
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function brandLogoMarkup() {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;min-width:260px;">
      <tr>
        <td width="68" height="68" align="center" valign="middle" style="width:68px;height:68px;border-radius:20px;background:${brand.primary};font-family:Arial,Helvetica,sans-serif;color:#FFFFFF;font-size:26px;line-height:68px;font-weight:900;mso-line-height-rule:exactly;">&lt;/&gt;</td>
        <td style="padding-left:16px;font-family:Arial,Helvetica,sans-serif;vertical-align:middle;">
          <div style="font-size:34px;line-height:1;font-weight:900;letter-spacing:-0.04em;color:${brand.dark};">Code<span style="color:${brand.primary};">Mark</span></div>
          <div style="padding-top:7px;font-size:11px;line-height:1.2;font-weight:800;letter-spacing:0.22em;color:${brand.muted};text-transform:uppercase;">Digital Solutions</div>
        </td>
      </tr>
    </table>`
}

function getCopy(language: ContactEmailLanguage) {
  if (language === "en") {
    return {
      subject: "New contact form request | CodeMark",
      preview: "A visitor submitted the CodeMark contact form.",
      title: "New project request",
      subtitle: "A visitor submitted the contact form from the website.",
      fields: {
        name: "Name",
        email: "Email",
        company: "Company",
        phone: "Phone",
        service: "Requested service",
        message: "Project message",
        language: "Selected language",
      },
      reply: "Reply directly to this email to contact the lead.",
      footer: "This message was sent automatically from the CodeMark website.",
    }
  }

  return {
    subject: "Nueva solicitud de contacto | CodeMark",
    preview: "Un visitante envió el formulario de contacto de CodeMark.",
    title: "Nueva solicitud de proyecto",
    subtitle: "Un visitante envió el formulario de contacto desde el sitio web.",
    fields: {
      name: "Nombre",
      email: "Correo",
      company: "Empresa",
      phone: "Teléfono",
      service: "Servicio solicitado",
      message: "Mensaje del proyecto",
      language: "Idioma seleccionado",
    },
    reply: "Responde directamente a este correo para contactar al lead.",
    footer: "Este mensaje fue enviado automáticamente desde el sitio web de CodeMark.",
  }
}

function detailRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:14px 18px;border-bottom:1px solid ${brand.border};font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:${brand.muted};vertical-align:top;width:38%;">${escapeHtml(label)}</td>
      <td style="padding:14px 18px;border-bottom:1px solid ${brand.border};font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:600;color:${brand.dark};vertical-align:top;">${escapeHtml(value)}</td>
    </tr>`
}

export function buildContactEmail(payload: ContactEmailPayload, _siteUrl?: string) {
  const copy = getCopy(payload.language)
  const safeMessage = escapeHtml(payload.message.trim()).replace(/\n/g, "<br />")

  const html = `<!doctype html>
<html lang="${payload.language}">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${escapeHtml(copy.subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:${brand.background};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(copy.preview)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:${brand.background};margin:0;padding:0;">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:680px;background:${brand.surface};border:1px solid ${brand.border};border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(15,23,42,0.10);">
            <tr>
              <td style="padding:28px 28px 18px 28px;background:${brand.surface};border-bottom:1px solid ${brand.border};">
                ${brandLogoMarkup()}
              </td>
            </tr>
            <tr>
              <td style="padding:30px 28px 18px 28px;font-family:Arial,Helvetica,sans-serif;">
                <div style="display:inline-block;padding:7px 12px;border-radius:999px;background:#ECFEFF;color:#0891B2;font-size:12px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;">CodeMark</div>
                <h1 style="margin:18px 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:30px;line-height:1.18;color:${brand.dark};font-weight:800;">${escapeHtml(copy.title)}</h1>
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${brand.muted};">${escapeHtml(copy.subtitle)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 28px 8px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border:1px solid ${brand.border};border-radius:18px;overflow:hidden;background:#FFFFFF;">
                  ${detailRow(copy.fields.name, payload.name.trim())}
                  ${detailRow(copy.fields.email, payload.email.trim())}
                  ${detailRow(copy.fields.company, payload.company.trim())}
                  ${detailRow(copy.fields.phone, payload.phone.trim())}
                  ${detailRow(copy.fields.service, payload.serviceLabel || payload.service)}
                  ${detailRow(copy.fields.language, payload.language.toUpperCase())}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 8px 28px;font-family:Arial,Helvetica,sans-serif;">
                <div style="border:1px solid ${brand.border};border-radius:18px;background:#F8FAFC;padding:20px;">
                  <p style="margin:0 0 10px 0;font-size:13px;font-weight:800;color:${brand.muted};text-transform:uppercase;letter-spacing:0.08em;">${escapeHtml(copy.fields.message)}</p>
                  <p style="margin:0;font-size:16px;line-height:1.7;color:${brand.dark};">${safeMessage}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 30px 28px;font-family:Arial,Helvetica,sans-serif;">
                <p style="margin:0;padding:14px 16px;border-left:4px solid ${brand.primary};background:#ECFEFF;border-radius:12px;font-size:14px;line-height:1.6;color:#155E75;">${escapeHtml(copy.reply)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px;background:#0F172A;font-family:Arial,Helvetica,sans-serif;text-align:center;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#CBD5E1;">${escapeHtml(copy.footer)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  const text = [
    copy.title,
    copy.subtitle,
    "",
    `${copy.fields.name}: ${payload.name.trim()}`,
    `${copy.fields.email}: ${payload.email.trim()}`,
    `${copy.fields.company}: ${payload.company.trim()}`,
    `${copy.fields.phone}: ${payload.phone.trim()}`,
    `${copy.fields.service}: ${payload.serviceLabel || payload.service}`,
    `${copy.fields.language}: ${payload.language.toUpperCase()}`,
    "",
    `${copy.fields.message}:`,
    payload.message.trim(),
    "",
    copy.reply,
  ].join("\n")

  return { subject: copy.subject, html, text }
}

function getConfirmationCopy(language: ContactEmailLanguage) {
  if (language === "en") {
    return {
      subject: "We received your request | CodeMark",
      preview: "Thank you for contacting CodeMark. We received your project request.",
      title: "We received your request",
      greeting: "Hi",
      intro: "Thank you for contacting CodeMark. Our team received your information and will review it shortly.",
      next: "We will get back to you as soon as possible using the contact details you provided.",
      summary: "Request summary",
      service: "Requested service",
      company: "Company",
      message: "Your message",
      footer: "This confirmation was sent automatically from the CodeMark website.",
    }
  }

  return {
    subject: "Recibimos tu solicitud | CodeMark",
    preview: "Gracias por contactar a CodeMark. Recibimos tu solicitud de proyecto.",
    title: "Recibimos tu solicitud",
    greeting: "Hola",
    intro: "Gracias por contactar a CodeMark. Nuestro equipo recibió tu información y la revisará pronto.",
    next: "Te responderemos lo antes posible usando los datos de contacto que nos compartiste.",
    summary: "Resumen de tu solicitud",
    service: "Servicio solicitado",
    company: "Empresa",
    message: "Tu mensaje",
    footer: "Esta confirmación fue enviada automáticamente desde el sitio web de CodeMark.",
  }
}

export function buildContactConfirmationEmail(payload: ContactEmailPayload, _siteUrl?: string) {
  const copy = getConfirmationCopy(payload.language)
  const safeMessage = escapeHtml(payload.message.trim()).replace(/\n/g, "<br />")
  const firstName = payload.name.trim().split(/\s+/)[0] || payload.name.trim()

  const html = `<!doctype html>
<html lang="${payload.language}">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${escapeHtml(copy.subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:${brand.background};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(copy.preview)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:${brand.background};margin:0;padding:0;">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;background:${brand.surface};border:1px solid ${brand.border};border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(15,23,42,0.10);">
            <tr>
              <td style="padding:28px;background:${brand.surface};border-bottom:1px solid ${brand.border};">
                ${brandLogoMarkup()}
              </td>
            </tr>
            <tr>
              <td style="padding:30px 28px 12px 28px;font-family:Arial,Helvetica,sans-serif;">
                <h1 style="margin:0 0 12px 0;font-size:30px;line-height:1.18;color:${brand.dark};font-weight:800;">${escapeHtml(copy.title)}</h1>
                <p style="margin:0 0 14px 0;font-size:16px;line-height:1.7;color:${brand.dark};"><strong>${escapeHtml(copy.greeting)} ${escapeHtml(firstName)},</strong></p>
                <p style="margin:0;font-size:16px;line-height:1.7;color:${brand.muted};">${escapeHtml(copy.intro)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 28px;font-family:Arial,Helvetica,sans-serif;">
                <div style="border:1px solid ${brand.border};border-radius:18px;background:#F8FAFC;padding:20px;">
                  <p style="margin:0 0 14px 0;font-size:13px;font-weight:800;color:${brand.muted};text-transform:uppercase;letter-spacing:0.08em;">${escapeHtml(copy.summary)}</p>
                  <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:${brand.dark};"><strong>${escapeHtml(copy.service)}:</strong> ${escapeHtml(payload.serviceLabel || payload.service)}</p>
                  <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:${brand.dark};"><strong>${escapeHtml(copy.company)}:</strong> ${escapeHtml(payload.company.trim())}</p>
                  <p style="margin:16px 0 8px 0;font-size:13px;font-weight:800;color:${brand.muted};text-transform:uppercase;letter-spacing:0.08em;">${escapeHtml(copy.message)}</p>
                  <p style="margin:0;font-size:15px;line-height:1.7;color:${brand.dark};">${safeMessage}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 30px 28px;font-family:Arial,Helvetica,sans-serif;">
                <p style="margin:0;padding:14px 16px;border-left:4px solid ${brand.primary};background:#ECFEFF;border-radius:12px;font-size:14px;line-height:1.6;color:#155E75;">${escapeHtml(copy.next)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px;background:#0F172A;font-family:Arial,Helvetica,sans-serif;text-align:center;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#CBD5E1;">${escapeHtml(copy.footer)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  const text = [
    copy.title,
    `${copy.greeting} ${firstName},`,
    copy.intro,
    copy.next,
    "",
    `${copy.service}: ${payload.serviceLabel || payload.service}`,
    `${copy.company}: ${payload.company.trim()}`,
    "",
    `${copy.message}:`,
    payload.message.trim(),
  ].join("\n")

  return { subject: copy.subject, html, text }
}
