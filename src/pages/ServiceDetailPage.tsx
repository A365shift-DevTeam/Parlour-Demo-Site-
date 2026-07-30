import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  Clock3,
  IndianRupee,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { faqs, packages, services, specialists } from "../data/mockData";
import { previewAppearance } from "../lib/avatar";
import { cn, formatDuration, formatPrice } from "../lib/utils";
import { useStudioStore } from "../store/useStudioStore";
import { CommonAvatar } from "../components/common/CommonAvatar";
import { SpritePortrait } from "../components/common/SpritePortrait";
import { Button, Eyebrow, Pill, SectionHeading, buttonStyles } from "../components/common/UI";
import { ServiceCard } from "../components/services/Cards";

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const service = services.find((item) => item.slug === slug);
  const addService = useStudioStore((state) => state.addService);
  const startBooking = useStudioStore((state) => state.startBooking);
  if (!service) return <Navigate to="/services" replace />;

  const availableSpecialists = specialists.filter((specialist) =>
    service.specialistIds.includes(specialist.id),
  );
  const related = services
    .filter((item) => item.category === service.category && item.id !== service.id)
    .slice(0, 3);
  const compatiblePackages = packages
    .filter((salonPackage) => salonPackage.serviceIds.includes(service.id))
    .slice(0, 2);
  const book = () => {
    addService(service.id);
    startBooking([service.id]);
    navigate("/booking");
  };

  return (
    <div className="bg-canvas">
      <section className="bg-ivory py-6">
        <div className="section-shell">
          <Link to="/services" className={cn(buttonStyles.ghost, "-ml-4")}>
            <ArrowLeft size={17} />
            Back to services
          </Link>
        </div>
      </section>

      <section className="bg-ivory pb-16 sm:pb-20">
        <div className="section-shell grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
            <CommonAvatar
              appearance={previewAppearance(service.previewIndex)}
              className="h-[560px] rounded-4xl shadow-soft"
              label={`${service.name} curated style reference`}
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
              <CommonAvatar
                appearance={previewAppearance(service.previewIndex, "Deep")}
                compact
                className="h-full min-h-52 rounded-3xl"
                label={`${service.name} on deep skin tone avatar preset`}
              />
              <CommonAvatar
                appearance={previewAppearance(service.previewIndex, "Light")}
                compact
                className="h-full min-h-52 rounded-3xl"
                label={`${service.name} on light skin tone avatar preset`}
              />
            </div>
          </div>
          <div className="lg:pl-8">
            <Pill>{service.category}</Pill>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.9] text-charcoal sm:text-7xl">
              {service.name}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink/60">
              <span className="flex items-center gap-1.5">
                <Star size={16} className="fill-champagne-500 text-champagne-500" />
                {service.rating} ({service.reviewCount} reviews)
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 size={16} />
                {formatDuration(service.duration)}
              </span>
              <span className="flex items-center gap-1.5">
                <IndianRupee size={16} />
                Starts {formatPrice(service.price)}
              </span>
            </div>
            <p className="mt-6 max-w-xl text-base leading-7 text-ink/75">{service.description}</p>
            <div className="mt-6 rounded-3xl border border-champagne-300/50 bg-champagne-50 p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-champagne-700">
                <Sparkles size={16} />
                Benefit
              </div>
              <p className="mt-2 text-sm font-semibold leading-6 text-charcoal">{service.benefit}</p>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="secondary"
                onClick={() => {
                  addService(service.id);
                  navigate("/studio");
                }}
              >
                Preview on Common Avatar
              </Button>
              <Button onClick={book}>
                <CalendarCheck size={17} />
                Book This Service
              </Button>
            </div>
            <p className="mt-4 text-xs leading-5 text-ink/50">
              Prices and timing are estimates until your in-salon consultation confirms technique,
              product use and complexity.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="section-shell grid gap-12 lg:grid-cols-[1fr_.78fr]">
          <div>
            <SectionHeading eyebrow="What to expect" title="A thoughtful salon process." />
            <div className="mt-10 space-y-0">
              {[
                ["Consultation", "Discuss the desired finish, reference, routine, history and realistic maintenance."],
                ["Preparation", service.preparation],
                ["Service", "Your specialist adapts the selected reference using professional technique and products."],
                ["Finish & home care", service.aftercare],
              ].map(([title, description], index) => (
                <div key={title} className="grid grid-cols-[44px_1fr] gap-4 border-b border-charcoal/8 py-6 first:pt-0">
                  <span className="grid size-10 place-items-center rounded-full bg-rose-50 text-xs font-bold text-rose-700">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-ink/65">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside>
            <div className="rounded-4xl bg-charcoal p-7 text-white">
              <div className="text-xs font-bold uppercase tracking-wider text-champagne-300">Service notes</div>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-semibold">Maintenance</h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">{service.maintenance}</p>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-semibold">Products used</h3>
                  <ul className="mt-3 space-y-2">
                    {service.products.map((product) => (
                      <li key={product} className="flex gap-2 text-sm text-white/70">
                        <Check size={16} className="mt-0.5 shrink-0 text-champagne-300" />
                        {product}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-3 rounded-2xl bg-white/8 p-4 text-xs leading-5 text-white/65">
                  <ShieldCheck className="shrink-0 text-champagne-300" size={18} />
                  {service.importantNotes}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-rose-50 py-20 sm:py-24">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Available artists"
            title="Specialists for this service."
            description="Choose a preferred specialist at booking or select any available artist for more times."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {availableSpecialists.map((specialist) => (
              <article key={specialist.id} className="grid grid-cols-[120px_1fr] overflow-hidden rounded-3xl bg-white shadow-hairline">
                <SpritePortrait
                  index={specialist.spriteIndex}
                  alt={`Portrait of ${specialist.name}`}
                  className="h-full min-h-44"
                />
                <div className="p-5">
                  <h3 className="font-display text-2xl font-semibold">{specialist.name}</h3>
                  <p className="text-xs font-semibold text-rose-700">{specialist.specialization}</p>
                  <p className="mt-3 line-clamp-2 text-xs leading-5 text-ink/60">{specialist.bio}</p>
                  <p className="mt-3 text-xs font-semibold text-charcoal">Next: {specialist.nextAvailable}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {(compatiblePackages.length > 0 || faqs.length > 0) && (
        <section className="py-20 sm:py-28">
          <div className="section-shell grid gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow>Compatible packages</Eyebrow>
              <h2 className="font-display text-4xl font-semibold">More care, one booking.</h2>
              <div className="mt-7 space-y-3">
                {(compatiblePackages.length ? compatiblePackages : packages.slice(0, 2)).map(
                  (salonPackage) => (
                    <Link
                      key={salonPackage.id}
                      to="/packages"
                      className="flex items-center justify-between gap-4 rounded-3xl border border-charcoal/8 p-5 transition hover:border-rose-300 hover:shadow-soft"
                    >
                      <div>
                        <h3 className="font-display text-2xl font-semibold">{salonPackage.name}</h3>
                        <p className="mt-1 text-xs text-ink/55">{formatDuration(salonPackage.duration)}</p>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-rose-700">
                        {formatPrice(salonPackage.price)}
                        <ArrowRight size={17} />
                      </div>
                    </Link>
                  ),
                )}
              </div>
            </div>
            <div>
              <Eyebrow>Questions</Eyebrow>
              <h2 className="font-display text-4xl font-semibold">Good to know.</h2>
              <div className="mt-7 divide-y divide-charcoal/8 border-y border-charcoal/8">
                {faqs.map((faq) => (
                  <details key={faq.id} className="group py-5">
                    <summary className="cursor-pointer list-none pr-8 text-sm font-semibold text-charcoal">
                      {faq.question}
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-ink/65">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-ivory py-20 sm:py-24">
        <div className="section-shell">
          <SectionHeading eyebrow="Continue exploring" title={`More from ${service.category}.`} />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ServiceCard key={item.id} service={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
