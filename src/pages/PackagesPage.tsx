import { ArrowRight, CalendarCheck, Check, Clock3, Gem, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { packages, services, specialists } from "../data/mockData";
import { previewAppearance } from "../lib/avatar";
import { formatDuration, formatPrice } from "../lib/utils";
import { useStudioStore } from "../store/useStudioStore";
import { CommonAvatar } from "../components/common/CommonAvatar";
import { Button, Eyebrow, Pill, SectionHeading } from "../components/common/UI";

export default function PackagesPage() {
  const navigate = useNavigate();
  const addService = useStudioStore((state) => state.addService);
  const startBooking = useStudioStore((state) => state.startBooking);

  const bookPackage = (serviceIds: string[]) => {
    serviceIds.forEach((id) => addService(id));
    startBooking(serviceIds);
    navigate("/booking");
  };

  return (
    <div className="bg-canvas">
      <section className="relative overflow-hidden bg-[#251f22] py-20 text-white sm:py-28">
        <div className="editorial-grid absolute inset-0 opacity-20" />
        <div className="section-shell relative grid items-end gap-10 lg:grid-cols-[1fr_.7fr]">
          <div>
            <Eyebrow className="text-champagne-300">Packages & memberships</Eyebrow>
            <h1 className="max-w-4xl font-display text-6xl font-semibold leading-[0.88] sm:text-8xl">
              Beautifully coordinated, from start to finish.
            </h1>
          </div>
          <p className="max-w-xl text-base leading-7 text-white/60">
            Curated combinations with clear inclusions, estimated timing and preferred specialists.
            Every package can be previewed on the common configurable avatar before booking.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="section-shell grid gap-6 lg:grid-cols-2">
          {packages.map((salonPackage, index) => {
            const included = services.filter((service) =>
              salonPackage.serviceIds.includes(service.id),
            );
            const artists = specialists.filter((specialist) =>
              salonPackage.specialistIds.includes(specialist.id),
            );
            const saving = salonPackage.regularPrice - salonPackage.price;
            return (
              <article
                key={salonPackage.id}
                className="grid overflow-hidden rounded-4xl border border-charcoal/8 bg-white shadow-hairline sm:grid-cols-[.85fr_1.15fr]"
              >
                <div className="relative min-h-80 overflow-hidden">
                  <CommonAvatar
                    appearance={previewAppearance(salonPackage.previewIndex)}
                    className="absolute inset-0 h-full"
                    label={`${salonPackage.name} curated package preview`}
                  />
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {salonPackage.featured && (
                      <Pill className="bg-charcoal/80 text-white backdrop-blur">
                        <Gem size={13} className="mr-1" />
                        Featured
                      </Pill>
                    )}
                    <Pill className="bg-white/85 text-rose-700 backdrop-blur">
                      Save {formatPrice(saving)}
                    </Pill>
                  </div>
                </div>
                <div className="flex flex-col p-6 sm:p-7">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-rose-600">
                    Package {String(index + 1).padStart(2, "0")}
                  </div>
                  <h2 className="mt-2 font-display text-4xl font-semibold leading-none">
                    {salonPackage.name}
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-ink/65">{salonPackage.description}</p>
                  <ul className="mt-5 space-y-2">
                    {included.map((service) => (
                      <li key={service.id} className="flex items-center gap-2 text-xs font-semibold text-charcoal">
                        <Check size={15} className="text-rose-600" />
                        {service.name}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-center gap-4 text-xs text-ink/55">
                    <span className="flex items-center gap-1.5">
                      <Clock3 size={15} />
                      {formatDuration(salonPackage.duration)}
                    </span>
                    <span>{artists.map((artist) => artist.name).join(", ")}</span>
                  </div>
                  <div className="mt-auto flex items-end justify-between gap-4 border-t border-charcoal/8 pt-5">
                    <div>
                      <div className="text-xs text-ink/40 line-through">
                        {formatPrice(salonPackage.regularPrice)}
                      </div>
                      <div className="font-display text-3xl font-semibold">
                        {formatPrice(salonPackage.price)}
                      </div>
                    </div>
                    <Button onClick={() => bookPackage(salonPackage.serviceIds)} className="px-4">
                      Book
                      <ArrowRight size={17} />
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-rose-50 py-20 sm:py-24">
        <div className="section-shell grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Monthly care"
            title="A gentle rhythm for regular beauty."
            description="Memberships make routine services easier to plan without locking you into a fixed style."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                name: "GV Studio Essential",
                price: 3999,
                features: ["1 hair or grooming service", "1 express skin ritual", "Priority weekday booking"],
              },
              {
                name: "GV Studio Signature",
                price: 6999,
                features: ["2 core beauty services", "1 premium skin ritual", "10% product benefit"],
              },
            ].map((membership) => (
              <article key={membership.name} className="rounded-4xl bg-white p-7 shadow-soft">
                <Sparkles className="text-rose-600" size={22} />
                <h3 className="mt-5 font-display text-3xl font-semibold">{membership.name}</h3>
                <div className="mt-3 font-display text-4xl font-semibold">
                  {formatPrice(membership.price)}
                  <span className="font-sans text-xs font-medium text-ink/45"> / month</span>
                </div>
                <ul className="mt-5 space-y-3">
                  {membership.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm text-ink/65">
                      <Check size={16} className="mt-0.5 shrink-0 text-rose-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="secondary" className="mt-6 w-full" onClick={() => navigate("/contact")}>
                  Enquire
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto max-w-[1500px] rounded-4xl bg-champagne-500 px-6 py-16 text-center text-white sm:py-20">
          <CalendarCheck className="mx-auto" size={28} />
          <h2 className="mt-5 font-display text-5xl font-semibold sm:text-6xl">Need help choosing?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/80">
            Build a look in the studio first. We’ll show individual services, compatible combinations,
            package savings and total chair time.
          </p>
          <Button variant="secondary" className="mt-7 border-white/25 bg-white text-champagne-700" onClick={() => navigate("/studio")}>
            Open Virtual Studio
            <Sparkles size={17} />
          </Button>
        </div>
      </section>
    </div>
  );
}
