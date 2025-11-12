// app/page.tsx (or pages/index.tsx)

import Clients, { demoLogos, demoTestimonials } from "@/components/vistaworld/Clients";
import Hero from "@/components/vistaworld/hero";
import OurExperience from "@/components/vistaworld/OurExperience";
import OurTopProperties, { demoProperties } from "@/components/vistaworld/OurTopProperties";


export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
    <OurTopProperties
        properties={demoProperties}
        detailsBasePath="/properties"
      />
      <OurExperience/>
       <Clients logos={demoLogos} testimonials={demoTestimonials} />
    </main>
  );
}
