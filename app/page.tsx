import About from "@/features/about/About"
import Benefits from "@/features/benefits/Benefits"
import ContactForm from "@/features/contact/ContactForm"
import Home from "@/features/home/Home"
import Services from "@/features/services/Services"
import TechStack from "@/features/tech-stack/TechStack"
import OurTeam from "@/features/team/OurTeam"
import Values from "@/features/values/Values"
import Clients from "@/features/clients/Clients" // Import the new Clients component
import styles from "./page.module.css"

export default function Page() {
  return (
    <div className={styles.pageContainer}>
      <Home />
      <About />
      <Values />
      <Benefits />
      <Services />
      <TechStack />
      <OurTeam />
      <Clients /> {/* Add the Clients component here */}
      <ContactForm />
    </div>
  )
}
