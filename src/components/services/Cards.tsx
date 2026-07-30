import { Clock3, Eye, IndianRupee, Star, UserRoundCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { SalonService, ServiceCategory, Specialist } from "../../types";
import { formatDuration, formatPrice, cn } from "../../lib/utils";
import { previewAppearance } from "../../lib/avatar";
import { useStudioStore } from "../../store/useStudioStore";
import { CommonAvatar } from "../common/CommonAvatar";
import { SpritePortrait } from "../common/SpritePortrait";
import { Button, Pill, buttonStyles } from "../common/UI";
import { services } from "../../data/mockData";

export function CategoryCard({
  name,
  label,
  description,
  previewIndex,
}: {
  name: ServiceCategory;
  label: string;
  description: string;
  previewIndex: number;
}) {
  const categoryServices = services.filter((service) => service.category === name);
  const starting = Math.min(...categoryServices.map((service) => service.price));
  return (
    <article className="group overflow-hidden rounded-4xl border border-charcoal/8 bg-white shadow-hairline transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/4]">
        <CommonAvatar
          appearance={previewAppearance(previewIndex)}
          className="h-full transition duration-500 group-hover:scale-[1.025]"
          compact
          label={`${label} curated static avatar reference`}
        />
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-2">
          <Pill className="bg-white/90 text-charcoal backdrop-blur">{categoryServices.length} services</Pill>
          <Pill className="bg-charcoal/80 text-white backdrop-blur">From {formatPrice(starting)}</Pill>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-display text-3xl font-semibold text-charcoal">{label}</h3>
        <p className="mt-2 min-h-12 text-sm leading-6 text-ink/70">{description}</p>
        <Link
          to={`/studio?category=${encodeURIComponent(name)}`}
          className={cn(buttonStyles.secondary, "mt-5 w-full")}
        >
          Explore Looks
          <Eye size={17} />
        </Link>
      </div>
    </article>
  );
}

export function ServiceCard({
  service,
  compact = false,
}: {
  service: SalonService;
  compact?: boolean;
}) {
  const navigate = useNavigate();
  const addService = useStudioStore((state) => state.addService);
  const startBooking = useStudioStore((state) => state.startBooking);
  const isSelected = useStudioStore((state) => state.selectedServiceIds.includes(service.id));

  const handleBook = () => {
    addService(service.id);
    startBooking([service.id]);
    navigate("/booking");
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-charcoal/8 bg-white shadow-hairline transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className={cn("relative overflow-hidden", compact ? "aspect-[4/5]" : "aspect-[3/4]")}>
        <CommonAvatar
          appearance={previewAppearance(service.previewIndex)}
          compact
          className="h-full transition duration-500 group-hover:scale-[1.02]"
          label={`${service.name} on the common salon avatar`}
        />
        <div className="absolute left-4 top-4">
          <Pill className="bg-white/90 text-charcoal backdrop-blur">{service.category}</Pill>
        </div>
        <div className="absolute bottom-4 right-4 rounded-full bg-charcoal/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
          Style Reference
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3 text-xs text-ink/65">
          <span className="flex items-center gap-1.5">
            <Star size={14} className="fill-champagne-500 text-champagne-500" />
            {service.rating} ({service.reviewCount})
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 size={14} />
            {formatDuration(service.duration)}
          </span>
        </div>
        <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-charcoal">
          {service.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/70">{service.benefit}</p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-ink/50">
              Estimated
            </span>
            <span className="font-display text-2xl font-semibold text-charcoal">
              {formatPrice(service.price)}
            </span>
          </div>
          <Link
            to={`/services/${service.slug}`}
            className="flex min-h-11 items-center gap-1 text-sm font-semibold text-rose-700 hover:text-rose-600"
          >
            Details
            <Eye size={16} />
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            className="px-3"
            onClick={() => {
              addService(service.id);
              navigate("/studio");
            }}
          >
            {isSelected ? "In Your Look" : "Preview"}
          </Button>
          <Button className="px-3" onClick={handleBook}>
            Book
          </Button>
        </div>
      </div>
    </article>
  );
}

export function SpecialistCard({ specialist }: { specialist: Specialist }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-charcoal/8 bg-white shadow-hairline">
      <SpritePortrait
        index={specialist.spriteIndex}
        alt={`Portrait of ${specialist.name}, ${specialist.specialization}`}
        className="aspect-[5/4]"
      />
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-semibold text-charcoal">{specialist.name}</h3>
            <p className="text-sm font-medium text-rose-700">{specialist.specialization}</p>
          </div>
          <Pill>{specialist.experience} yrs</Pill>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/65">{specialist.bio}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 border-y border-charcoal/8 py-4 text-xs text-ink/70">
          <span className="flex items-center gap-1.5">
            <Star size={14} className="fill-champagne-500 text-champagne-500" />
            {specialist.rating} · {specialist.reviewCount}
          </span>
          <span className="flex items-center gap-1.5">
            <UserRoundCheck size={14} />
            {specialist.serviceIds.length} services
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-xs text-ink/60">
            Next available
            <span className="mt-0.5 block font-semibold text-charcoal">{specialist.nextAvailable}</span>
          </div>
          <Link to={`/specialists#${specialist.id}`} className={cn(buttonStyles.secondary, "min-h-11 px-4")}>
            Profile
          </Link>
        </div>
      </div>
    </article>
  );
}

export function PriceFact({
  icon,
  label,
  value,
}: {
  icon?: "price" | "time";
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-ivory p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
        {icon === "price" ? <IndianRupee size={14} /> : icon === "time" ? <Clock3 size={14} /> : null}
        {label}
      </div>
      <div className="mt-1 font-display text-2xl font-semibold text-charcoal">{value}</div>
    </div>
  );
}
