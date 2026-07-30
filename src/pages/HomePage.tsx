import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  ChevronRight,
  Clock3,
  Heart,
  Layers3,
  Quote,
  Save,
  Sparkles,
  Star,
  WandSparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  categories,
  occasions,
  packages,
  services,
  specialists,
  testimonials,
} from "../data/mockData";
import { previewAppearance } from "../lib/avatar";
import { cn, formatDuration, formatPrice } from "../lib/utils";
import { useStudioStore } from "../store/useStudioStore";
import { BeforeAfterSlider } from "../components/common/BeforeAfterSlider";
import { CommonAvatar } from "../components/common/CommonAvatar";
import { Eyebrow, SectionHeading, buttonStyles } from "../components/common/UI";
import { CategoryCard, ServiceCard, SpecialistCard } from "../components/services/Cards";

const journey = [
  {
    number: "01",
    title: "Shape the Avatar",
    description: "Choose fixed skin tone, face shape, hair and beauty options on one common avatar.",
    icon: Layers3,
  },
  {
    number: "02",
    title: "Explore Services",
    description: "Understand the finish, duration, price, benefits and maintenance before booking.",
    icon: WandSparkles,
  },
  {
    number: "03",
    title: "Build Your Look",
    description: "Combine compatible services and compare curated references side by side.",
    icon: Heart,
  },
  {
    number: "04",
    title: "Book the Appointment",
    description: "Send the exact saved look and service list to your chosen Aurelia team.",
    icon: CalendarCheck,
  },
];

export default function HomePage() {
  const [heroLook, setHeroLook] = useState(0);
  const navigate = useNavigate();
  const addService = useStudioStore((state) => state.addService);
  const startBooking = useStudioStore((state) => state.startBooking);

  useEffect(() => {
    const interval = window.setInterval(() => setHeroLook((value) => (value + 1) % 4), 2800);
    return () => window.clearInterval(interval);
  }, []);

  const featuredPackage = packages[0];
  const bookPackage = () => {
    featuredPackage.serviceIds.forEach((id) => addService(id));
    startBooking(featuredPackage.serviceIds);
    navigate("/booking");
  };

  return (
    <>
      <section className="relative isolate min-h-[calc(100dvh-76px)] overflow-hidden bg-ivory">
        <img
          src="/images/aurelia-hero.png"
          alt="Editorial view of a fictional salon model in a warm ivory beauty studio"
          width="1536"
          height="1024"
          className="absolute inset-0 h-full w-full object-cover object-[67%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f7f1ea] via-[#f7f1ea]/93 to-[#f7f1ea]/10 lg:via-[#f7f1ea]/78" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ivory to-transparent" />
        <div className="relative mx-auto flex min-h-[calc(100dvh-76px)] max-w-7xl items-center px-5 py-16 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl"
          >
            <Eyebrow>Curated beauty, clearly imagined</Eyebrow>
            <h1 className="max-w-3xl font-display text-[clamp(3.5rem,7.5vw,7.5rem)] font-semibold leading-[0.84] tracking-[-0.045em] text-charcoal">
              Explore Your Next Look{" "}
              <span className="italic text-rose-600">Before You Book.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-ink/80 sm:text-lg sm:leading-8">
              Discover hairstyles, makeup, skincare and grooming services through one configurable
              curated avatar—then book the salon experience created for you.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/studio" className={cn(buttonStyles.primary, "px-7")}>
                Enter Virtual Studio
                <Sparkles size={18} />
              </Link>
              <Link to="/services" className={cn(buttonStyles.secondary, "px-7")}>
                Explore Services
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-ink/65">
              {["No photo upload", "No face scanning", "Book without an account"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="grid size-5 place-items-center rounded-full bg-white text-rose-600 shadow-hairline">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="absolute bottom-8 right-5 hidden w-52 overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-2 shadow-lift backdrop-blur xl:block">
            <CommonAvatar
              appearance={previewAppearance(heroLook)}
              compact
              className="h-52 rounded-2xl"
              label="Animated sequence of curated static avatar states"
            />
            <div className="flex items-center justify-between px-2 pb-1 pt-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-ink/50">Curated state</div>
                <div className="text-sm font-semibold text-charcoal">
                  {["Layered Cut", "Soft Curls", "Sleek Bob", "Balayage"][heroLook]}
                </div>
              </div>
              <span className="grid size-8 place-items-center rounded-full bg-rose-50 text-rose-600">
                <Sparkles size={15} />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-canvas py-20 sm:py-28">
        <div className="section-shell">
          <SectionHeading
            eyebrow="The Aurelia studios"
            title="Every service, considered."
            description="Start with a category, view curated states on the common avatar and arrive at your appointment knowing what to discuss."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 6).map((category) => (
              <CategoryCard key={category.name} {...category} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#241e21] py-20 text-white sm:py-28">
        <div className="section-shell">
          <SectionHeading
            eyebrow="A simple four-step journey"
            title="From curiosity to a clear salon brief."
            description="Explore freely, save locally and only share the service choices you intentionally add to booking."
            className="[&_h2]:text-white [&_p]:text-white/60"
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-4xl bg-white/10 md:grid-cols-2 xl:grid-cols-4">
            {journey.map((step) => (
              <article key={step.number} className="relative bg-[#241e21] p-7 sm:p-8">
                <div className="flex items-center justify-between">
                  <step.icon className="text-champagne-300" size={24} />
                  <span className="font-display text-3xl text-white/20">{step.number}</span>
                </div>
                <h3 className="mt-10 font-display text-3xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/58">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-ivory py-20 sm:py-28">
        <div className="section-shell grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <BeforeAfterSlider
              before={previewAppearance(0, "Medium")}
              after={previewAppearance(4, "Medium")}
              beforeLabel="Base Avatar"
              afterLabel="Bridal Signature"
            />
          </div>
          <div className="lg:pl-8">
            <Eyebrow>Featured transformation</Eyebrow>
            <h2 className="font-display text-5xl font-semibold leading-[0.95] text-charcoal sm:text-6xl">
              Compare the direction, not a promised result.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-ink/75">
              Use the slider to compare one consistent avatar before and after a curated service
              state. Your specialist will adapt the idea following an in-person assessment.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white p-4 shadow-hairline">
                <Clock3 size={17} className="text-rose-600" />
                <div className="mt-3 text-xs font-bold uppercase tracking-wider text-ink/50">Duration</div>
                <div className="font-display text-2xl font-semibold">4 hours</div>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-hairline">
                <Sparkles size={17} className="text-rose-600" />
                <div className="mt-3 text-xs font-bold uppercase tracking-wider text-ink/50">Estimate</div>
                <div className="font-display text-2xl font-semibold">₹18,000</div>
              </div>
            </div>
            <Link to="/services/wedding-day-signature" className={cn(buttonStyles.primary, "mt-7")}>
              View Service
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-canvas py-20 sm:py-28">
        <div className="section-shell">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Most loved"
              title="Popular services."
              description="A considered selection of the looks customers explore most often."
            />
            <Link to="/services" className={buttonStyles.secondary}>
              View all services
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services
              .filter((service) => service.isPopular)
              .slice(0, 4)
              .map((service) => (
                <ServiceCard key={service.id} service={service} compact />
              ))}
          </div>
        </div>
      </section>

      <section className="bg-rose-50 py-20 sm:py-28">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Beauty by occasion"
            title="Start with the moment."
            description="Choose the context and we’ll surface services with suitable finish, timing and maintenance."
            align="center"
          />
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {occasions.map((occasion) => (
              <Link
                key={occasion}
                to={`/services?occasion=${encodeURIComponent(occasion)}`}
                className="group flex min-h-36 flex-col justify-between rounded-3xl border border-rose-200 bg-white p-5 transition hover:-translate-y-1 hover:border-rose-400 hover:shadow-soft"
              >
                <span className="font-display text-2xl font-semibold leading-tight text-charcoal">{occasion}</span>
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700">
                  Explore
                  <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas py-20 sm:py-28">
        <div className="section-shell">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="The artists"
              title="Specialists who listen first."
              description="Choose by expertise, availability or let us match the best artist for your selected services."
            />
            <Link to="/specialists" className={buttonStyles.secondary}>
              Meet the team
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {specialists.slice(0, 4).map((specialist) => (
              <SpecialistCard key={specialist.id} specialist={specialist} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory py-20 sm:py-28">
        <div className="section-shell grid gap-8 lg:grid-cols-[.92fr_1.08fr]">
          <div className="rounded-4xl bg-charcoal p-8 text-white sm:p-10">
            <Eyebrow className="text-champagne-300">Featured package</Eyebrow>
            <h2 className="font-display text-5xl font-semibold leading-[0.95]">{featuredPackage.name}</h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/65">{featuredPackage.description}</p>
            <ul className="mt-7 grid gap-3">
              {featuredPackage.serviceIds.map((id) => {
                const service = services.find((item) => item.id === id);
                return (
                  <li key={id} className="flex items-center gap-3 text-sm text-white/80">
                    <Check size={16} className="text-champagne-300" />
                    {service?.name}
                  </li>
                );
              })}
            </ul>
            <div className="mt-9 flex flex-wrap items-end justify-between gap-5 border-t border-white/10 pt-7">
              <div>
                <div className="text-sm text-white/40 line-through">{formatPrice(featuredPackage.regularPrice)}</div>
                <div className="font-display text-4xl font-semibold">{formatPrice(featuredPackage.price)}</div>
              </div>
              <button type="button" onClick={bookPackage} className={buttonStyles.primary}>
                Book Package
                <CalendarCheck size={17} />
              </button>
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="Packages & memberships"
              title="More care, beautifully coordinated."
              description="Curated service combinations with clear timing, transparent estimates and one connected booking."
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {packages.slice(1, 7).map((salonPackage) => (
                <Link
                  key={salonPackage.id}
                  to="/packages"
                  className="rounded-3xl border border-charcoal/8 bg-white p-5 transition hover:border-rose-300 hover:shadow-soft"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-2xl font-semibold">{salonPackage.name}</h3>
                    <span className="shrink-0 text-sm font-bold text-rose-700">{formatPrice(salonPackage.price)}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-ink/60">{salonPackage.description}</p>
                  <div className="mt-4 text-xs font-semibold text-ink/55">{formatDuration(salonPackage.duration)}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-canvas py-20 sm:py-28">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Client stories"
            title="Clarity feels beautiful."
            description="Thoughtful planning, realistic expectations and a service brief your artist can actually use."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((testimonial) => (
              <article key={testimonial.id} className="flex min-h-72 flex-col rounded-3xl border border-charcoal/8 bg-white p-6 shadow-hairline">
                <Quote size={24} className="text-rose-400" />
                <p className="mt-7 flex-1 font-display text-2xl leading-8 text-charcoal">“{testimonial.quote}”</p>
                <div className="mt-6 border-t border-charcoal/8 pt-4">
                  <div className="flex gap-0.5 text-champagne-500" aria-label={`${testimonial.rating} out of 5 stars`}>
                    {Array.from({ length: testimonial.rating }).map((_, index) => (
                      <Star key={index} size={13} fill="currentColor" />
                    ))}
                  </div>
                  <div className="mt-2 text-sm font-semibold">{testimonial.name}</div>
                  <div className="text-xs text-ink/50">{testimonial.occasion}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-4 sm:px-6 sm:pb-6">
        <div className="relative mx-auto max-w-[1500px] overflow-hidden rounded-4xl bg-rose-600 px-6 py-20 text-center text-white sm:px-10 sm:py-24">
          <div className="editorial-grid absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-3xl">
            <Save className="mx-auto text-champagne-100" size={28} />
            <h2 className="mt-6 font-display text-5xl font-semibold leading-[0.9] sm:text-7xl">
              Found the Look You Love?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/75">
              Save the exact avatar configuration and services, then carry that reference into a simple appointment booking.
            </p>
            <Link to="/studio" className={cn(buttonStyles.secondary, "mt-8 border-white/25 bg-white text-rose-700")}>
              Build Your Transformation
              <Sparkles size={17} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
