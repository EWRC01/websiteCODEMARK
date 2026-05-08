import en from "@/features/i18n/locales/En.json"
import es from "@/features/i18n/locales/Es.json"
import ClientesView from "./ClientesView"

export const metadata = {
  title: `${es.clients.page.title} / ${en.clients.page.title} | CodeMark`,
  description: `${es.clients.page.subtitle} ${en.clients.page.subtitle}`,
}

export default function Page() {
  return <ClientesView />
}
