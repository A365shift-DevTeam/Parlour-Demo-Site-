import {
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { categories, occasions, services, specialists } from "../data/mockData";
import type { GenderPresentation, ServiceCategory } from "../types";
import { Button, EmptyState, Pill, SectionHeading } from "../components/common/UI";
import { ServiceCard } from "../components/services/Cards";

export default function ServicesPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ServiceCategory | "All">("All");
  const [occasion, setOccasion] = useState(searchParams.get("occasion") ?? "All");
  const [maxPrice, setMaxPrice] = useState(20000);
  const [maxDuration, setMaxDuration] = useState(360);
  const [specialist, setSpecialist] = useState("All");
  const [rating, setRating] = useState(0);
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [gender, setGender] = useState<GenderPresentation | "All">("All");
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const filtered = useMemo(
    () =>
      services.filter((service) => {
        const searchMatch =
          !query ||
          `${service.name} ${service.category} ${service.description}`
            .toLowerCase()
            .includes(query.toLowerCase());
        return (
          searchMatch &&
          (category === "All" || service.category === category) &&
          (occasion === "All" || service.occasions.includes(occasion)) &&
          service.price <= maxPrice &&
          service.duration <= maxDuration &&
          (specialist === "All" || service.specialistIds.includes(specialist)) &&
          service.rating >= rating &&
          (!availabilityOnly || service.availableToday) &&
          (gender === "All" ||
            service.genderCategory === gender ||
            service.genderCategory === "Unisex")
        );
      }),
    [availabilityOnly, category, gender, maxDuration, maxPrice, occasion, query, rating, specialist],
  );

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
    setOccasion("All");
    setMaxPrice(20000);
    setMaxDuration(360);
    setSpecialist("All");
    setRating(0);
    setAvailabilityOnly(false);
    setGender("All");
  };

  return (
    <div className="bg-canvas">
      <section className="border-b border-charcoal/8 bg-ivory py-16 sm:py-20">
        <div className="section-shell grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end">
          <SectionHeading
            eyebrow="Salon service catalogue"
            title="Find the service behind the look."
            description="Compare technique, benefits, duration, estimated price, artist availability and maintenance before choosing an appointment."
          />
          <div className="relative">
            <label htmlFor="service-search" className="sr-only">
              Search services
            </label>
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/45" size={20} />
            <input
              id="service-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search cuts, colour, makeup…"
              className="min-h-14 w-full rounded-full border border-charcoal/10 bg-white pl-14 pr-5 text-base shadow-hairline"
            />
          </div>
        </div>
      </section>

      <section className="sticky top-[76px] z-30 border-b border-charcoal/8 bg-canvas/95 backdrop-blur">
        <div className="section-shell no-scrollbar flex gap-2 overflow-x-auto py-3">
          <button
            type="button"
            onClick={() => setCategory("All")}
            className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold ${
              category === "All" ? "bg-charcoal text-white" : "bg-ivory text-charcoal"
            }`}
          >
            All services
          </button>
          {categories.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setCategory(item.name)}
              className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold ${
                category === item.name ? "bg-charcoal text-white" : "bg-ivory text-charcoal"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </section>

      <section className="section-shell py-10 sm:py-14">
        <div className="mb-8 rounded-3xl border border-charcoal/8 bg-white p-4 shadow-hairline">
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
            <label className="text-xs font-bold uppercase tracking-wider text-ink/55">
              Occasion
              <div className="relative mt-2">
                <select
                  value={occasion}
                  onChange={(event) => setOccasion(event.target.value)}
                  className="min-h-12 w-full appearance-none rounded-2xl border border-charcoal/10 bg-white px-4 pr-10 text-sm font-semibold normal-case tracking-normal text-charcoal"
                >
                  <option>All</option>
                  {occasions.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" size={16} />
              </div>
            </label>
            <label className="text-xs font-bold uppercase tracking-wider text-ink/55">
              Max price
              <select
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                className="mt-2 min-h-12 w-full rounded-2xl border border-charcoal/10 bg-white px-4 text-sm font-semibold normal-case tracking-normal text-charcoal"
              >
                {[3000, 5000, 8000, 12000, 20000].map((value) => (
                  <option key={value} value={value}>
                    Up to ₹{value.toLocaleString("en-IN")}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-bold uppercase tracking-wider text-ink/55">
              Duration
              <select
                value={maxDuration}
                onChange={(event) => setMaxDuration(Number(event.target.value))}
                className="mt-2 min-h-12 w-full rounded-2xl border border-charcoal/10 bg-white px-4 text-sm font-semibold normal-case tracking-normal text-charcoal"
              >
                <option value={60}>Up to 1 hour</option>
                <option value={120}>Up to 2 hours</option>
                <option value={180}>Up to 3 hours</option>
                <option value={360}>Any duration</option>
              </select>
            </label>
            <label className="text-xs font-bold uppercase tracking-wider text-ink/55">
              Specialist
              <select
                value={specialist}
                onChange={(event) => setSpecialist(event.target.value)}
                className="mt-2 min-h-12 w-full rounded-2xl border border-charcoal/10 bg-white px-4 text-sm font-semibold normal-case tracking-normal text-charcoal"
              >
                <option value="All">Any specialist</option>
                {specialists.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => setAdvancedOpen((value) => !value)}
              className="mt-[22px] flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-charcoal/10 text-sm font-semibold hover:bg-ivory"
              aria-expanded={advancedOpen}
            >
              <SlidersHorizontal size={17} />
              More filters
            </button>
          </div>
          {advancedOpen && (
            <div className="mt-4 grid gap-4 border-t border-charcoal/8 pt-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-xs font-bold uppercase tracking-wider text-ink/55">
                Minimum rating
                <select
                  value={rating}
                  onChange={(event) => setRating(Number(event.target.value))}
                  className="mt-2 min-h-12 w-full rounded-2xl border border-charcoal/10 bg-white px-4 text-sm font-semibold normal-case tracking-normal text-charcoal"
                >
                  <option value={0}>Any rating</option>
                  <option value={4.7}>4.7+</option>
                  <option value={4.8}>4.8+</option>
                  <option value={4.9}>4.9+</option>
                </select>
              </label>
              <label className="text-xs font-bold uppercase tracking-wider text-ink/55">
                Gender category
                <select
                  value={gender}
                  onChange={(event) => setGender(event.target.value as GenderPresentation | "All")}
                  className="mt-2 min-h-12 w-full rounded-2xl border border-charcoal/10 bg-white px-4 text-sm font-semibold normal-case tracking-normal text-charcoal"
                >
                  <option>All</option>
                  <option>Women</option>
                  <option>Men</option>
                  <option>Unisex</option>
                </select>
              </label>
              <label className="mt-5 flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-charcoal/10 px-4 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={availabilityOnly}
                  onChange={(event) => setAvailabilityOnly(event.target.checked)}
                  className="size-4 accent-rose-600"
                />
                Available today
              </label>
              <Button variant="secondary" className="mt-5" onClick={clearFilters}>
                <X size={16} />
                Clear filters
              </Button>
            </div>
          )}
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <span className="font-display text-3xl font-semibold">{filtered.length}</span>{" "}
            <span className="text-sm text-ink/60">services found</span>
          </div>
          {(category !== "All" || occasion !== "All" || query) && (
            <div className="hidden flex-wrap gap-2 sm:flex">
              {category !== "All" && <Pill>{category}</Pill>}
              {occasion !== "All" && <Pill>{occasion}</Pill>}
              {query && <Pill>“{query}”</Pill>}
            </div>
          )}
        </div>

        {filtered.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Filter size={21} />}
            title="No services match those filters"
            description="Try a higher price or duration range, or clear the specialist and availability filters."
            action={
              <Button onClick={clearFilters}>
                <Sparkles size={17} />
                Reset catalogue
              </Button>
            }
          />
        )}
      </section>
    </div>
  );
}
