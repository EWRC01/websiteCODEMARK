import AppWebView from "@/features/app-web/AppWebView"
import en from "@/features/i18n/locales/En.json"
import es from "@/features/i18n/locales/Es.json"

export const metadata = {
  title: `${es.appWeb.meta.title} / ${en.appWeb.meta.title} | CodeMark`,
  description: `${es.appWeb.meta.description} ${en.appWeb.meta.description}`,
}

export default function Page() {
  return <AppWebView />
}
