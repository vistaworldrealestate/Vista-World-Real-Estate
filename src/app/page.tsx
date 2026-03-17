// app/page.tsx
import { BusinessVerticals, type Vertical } from "@/components/home/business-verticals";
import FounderMessage from "@/components/home/founder-message";
import HeroSlider from "@/components/home/hero-slider";
import VideoHero from "@/components/home/video-hero";
import Clients, {
  demoLogos,
  demoTestimonials,
} from "@/components/vistaworld/Clients";
import OurExperience from "@/components/vistaworld/OurExperience";

import OurTopProperties, {
  demoProperties,
} from "@/components/vistaworld/OurTopProperties";


import VistaValues, { VistaValueItem } from "@/components/home/vista-values";
import VideoTestimonials, { VideoTestimonial } from "@/components/home/video-testimonials";

export default function Home() {
  const businessVerticals: Vertical[] = [ 
    {
      id: "res",
      title: "Vista World REAL ESTATE",
      subtitle: "RESIDENCES",
      description:
        "Premium residential developments crafted for modern and luxury living.",
      href: "/residences",
      image:
        "https://images.unsplash.com/photo-1469022563428-aa04fef9f5a2?q=80&w=873&Vistato=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "com",
      title: "Vista World REAL ESTATE",
      subtitle: "COMMERCIAL",
      description:
        "Smart commercial spaces designed for ambitious businesses.",
      href: "/commercial",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&Vistato=format&fit=crop",
    },
    {
      id: "adv",
      title: "Vista World REAL ESTATE",
      subtitle: "ADVISORY",
      description:
        "Strategic investment and asset advisory backed by market insight.",
      href: "/advisory",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&Vistato=format&fit=crop",
    },
    {
      id: "jv",
      title: "Vista World REAL ESTATE",
      subtitle: "JOINT VENTURES",
      description:
        "Collaborative partnerships that unlock scale and long-term value.",
      href: "/joint-ventures",
      image:
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&Vistato=format&fit=crop",
    },
    {
      id: "srv",
      title: "Vista World REAL ESTATE",
      subtitle: "SERVICES",
      description:
        "End-to-end services from planning to execution and management.",
      href: "/services",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&Vistato=format&fit=crop",
    },
  ];

  const values: VistaValueItem[] = [
    {
      id: "commitment",
      title: "Commitment",
      description:
        "We stay dedicated to outcomes—timelines, quality, and long-term value for every client.",
      image:
        "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1600&Vistato=format&fit=crop",
    },
    {
      id: "customer",
      title: "Customer Centricity",
      description:
        "We listen first. Every recommendation is shaped by your goals, budget, and comfort.",
      image:
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "transparency",
      title: "Transparency",
      description:
        "Clear communication, honest advice, and no surprises—at every step of the journey.",
      image:
        "https://images.unsplash.com/photo-1450101215322-bf5cd27642fc?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "integrity",
      title: "Integrity",
      description:
        "We do what’s right—even when it’s hard—because trust is everything in real estate.",
      image:
        "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "dependability",
      title: "Dependability",
      description:
        "Consistent delivery, accountable timelines, and proactive support you can rely on.",
      image:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "problem",
      title: "Problem Solving",
      description:
        "We anticipate roadblocks early and provide practical, investor-friendly solutions.",
      image:
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "professionalism",
      title: "Professionalism",
      description:
        "High standards in communication, process, documentation, and client experience.",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop",
    },
  ];

  const demoTestimonials: VideoTestimonial[] = [
  {
    id: "t1",
    name: "Mr. & Mrs. Maheshwari",
    role: "Home Buyers",
    quote:
      "Green and open spaces, low-density housing, and the freedom for open housing have given us the best of both worlds. We relish the natural surroundings, the tranquillity of low-density living, and the creative freedom to design our dream home.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "t2",
    name: "Ananya Sharma",
    role: "Investor Client",
    quote:
      "The team was transparent from day one. Shortlisted options matched my budget, location, and growth expectations. Smooth documentation and quick responses made the process stress-free.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "t3",
    name: "Rahul Verma",
    role: "Commercial Buyer",
    quote:
      "Professionalism and timelines were top-notch. From site visits to final paperwork, everything was handled with clarity. I felt confident at every step.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop",
  },
];

  return (
    <main className="min-h-screen">
      {/* HERO SLIDER */}
      <HeroSlider
        slides={[
          {
            id: "1",
            image:
              "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop",
            eyebrow: "Luxury Villa",
            title: "Experience the Ultimate in Luxury Living",
            subtitle:
              "Discover your dream home with breathtaking views and exquisite design.",
            location: "Rohini, Delhi, India",
            ctaPrimary: { label: "View Listings", href: "/properties" },
            ctaSecondary: { label: "Contact Us", href: "/contact" },
            badges: ["New Listing", "Open House"],
          },
          {
            id: "2",
            image:
              "https://images.unsplash.com/photo-1558335542-d9aa07fd44d7?q=80&w=1600&auto=format&fit=crop",
            eyebrow: "Modern Apartment",
            title: "Urban Living Redefined",
            subtitle:
              "Explore contemporary apartments in the heart of the city.",
            location: "Sector 74, Noida, India",
            ctaPrimary: { label: "Browse Apartments", href: "/properties" },
            ctaSecondary: { label: "Get in Touch", href: "/contact" },
            badges: ["Downtown", "Pet Friendly"],
          },
          {
            id: "3",
            image:
              "https://images.unsplash.com/photo-1680896444797-07917f403a49?q=80&w=1600&auto=format&fit=crop",
            eyebrow: "Cozy Cottage",
            title: "Find Your Perfect Gateway",
            subtitle:
              "Charming cottages nestled in serene locations for your ideal retreat.",
            location: "Dwarka Sec 14, India",
            ctaPrimary: { label: "See Cottages", href: "/properties" },
            ctaSecondary: { label: "Schedule a Visit", href: "/contact" },
            badges: ["Quiet Area", "Great Views"],
          },
        ]}
        autoPlay
        intervalMs={8000}
      />

      {/* TOP PROPERTIES
      <OurTopProperties
        properties={demoProperties}
        detailsBasePath="/properties"
      /> */}

      {/* BUSINESS VERTICALS */}
      <section className="py-14 sm:py-20">
        <BusinessVerticals items={businessVerticals} />
      </section>

      {/* VIDEO HERO */}

      <VideoHero
        title="Corporate AV"
        thumbnail="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        videoUrl="https://youtu.be/KjDNlqXNq2k?si=shAmjwZrcf8-3Xzw"
        className="py-10"
      />
      {/* FOUNDER'S MESSAGE */}

      <FounderMessage
        title="Founder's Message"
        accentText="Vista World  REAL ESTATE GROUP"
        message={[
          "At Vista World  Real Estate Group, our journey is defined by a commitment to excellence. We believe in more than just transactions. We believe in personal connections and in delivering service that transforms properties into generational assets.",
          "Our investor-friendly approach is rooted in putting your interests first, and we're dedicated to your growth.",
          "Together, let's build a legacy of trust, value, and customer-centricity in the world of real estate.",
        ]}
        name="Shaurya Sarin"
        designation="Founder & Managing Director"
        image="https://images.unsplash.com/photo-1573878585435-b304412f4ebe?q=80&w=1170&Vistato=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />

      {/* Vista'S VALUES */}

      <VistaValues heading="Vista's Values" items={values} defaultOpenId="commitment" />

      {/* TESTIMONIALS */}

        <VideoTestimonials heading="Testimonials" items={demoTestimonials} />

      {/* EXPERIENCE */}
      {/* <OurExperience /> */}

     
      {/* <Clients logos={demoLogos} testimonials={demoTestimonials} /> */}

    </main>
  );
}
