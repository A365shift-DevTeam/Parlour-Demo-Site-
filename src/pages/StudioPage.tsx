import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Copy,
  Heart,
  Layers3,
  Palette,
  RotateCcw,
  Save,
  Scissors,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  WandSparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { categories, services, specialists } from "../data/mockData";
import { cn, formatDuration, formatPrice, getTotals } from "../lib/utils";
import {
  askBeautyAgent,
  type BeautyAgentAppearance,
  type BeautyAgentResult,
} from "../lib/beautyAgent";
import type { SalonService, ServiceCategory } from "../types";
import type { AvatarAppearance } from "../types/avatarAppearance";
import { useStudioStore } from "../store/useStudioStore";
import {
  avatarOptionSets,
  avatarSkinPositions,
  avatarStyleSheets,
  CommonAvatar,
} from "../components/common/CommonAvatar";
import { Button, Dialog, EmptyState, Pill } from "../components/common/UI";

const categoryIcons = {
  Hair: Scissors,
  "Hair Colour": Palette,
  Makeup: WandSparkles,
  Skincare: Sparkles,
  Grooming: UserRound,
  Bridal: Heart,
  "Fashion & Accessories": Layers3,
  "Complete Look": Sparkles,
} satisfies Record<ServiceCategory, typeof Scissors>;

function AppearanceControls({
  appearance,
  setAppearance,
}: {
  appearance: AvatarAppearance;
  setAppearance: <K extends keyof AvatarAppearance>(key: K, value: AvatarAppearance[K]) => void;
}) {
  const skinSwatches: Record<string, string> = {
    Light: "#E7B493",
    Medium: "#C98561",
    Tan: "#A96845",
    Deep: "#75452F",
  };
  const hairSwatches: Record<string, string> = {
    Espresso: "#211619",
    Chocolate: "#6e3f2f",
    "Caramel Balayage": "linear-gradient(135deg, #30201c 22%, #c8955c 52%, #68402e 78%)",
    Burgundy: "#6e1f3d",
  };
  return (
    <div className="space-y-5">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-[0.14em] text-ink/55">
            Skin tone
          </label>
          <span className="text-xs font-semibold text-charcoal">{appearance.skinTone}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {avatarOptionSets.skinTone.map((tone) => (
            <button
              key={tone}
              type="button"
              onClick={() => setAppearance("skinTone", tone as AvatarAppearance["skinTone"])}
              className={cn(
                "grid min-h-12 place-items-center rounded-2xl border bg-white transition",
                appearance.skinTone === tone
                  ? "border-rose-500 shadow-[0_0_0_2px_rgba(169,86,107,.18)]"
                  : "border-charcoal/8 hover:border-rose-300",
              )}
              aria-label={`Use ${tone.toLowerCase()} skin tone`}
              aria-pressed={appearance.skinTone === tone}
            >
              <span
                className="size-7 rounded-full border-2 border-white shadow-hairline"
                style={{ backgroundColor: skinSwatches[tone] }}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="face-shape" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-ink/55">
          Face shape
        </label>
        <div className="relative">
          <select
            id="face-shape"
            value={appearance.faceShape}
            onChange={(event) =>
              setAppearance("faceShape", event.target.value as AvatarAppearance["faceShape"])
            }
            className="min-h-12 w-full appearance-none rounded-2xl border border-charcoal/10 bg-white px-4 pr-10 text-sm font-semibold"
          >
            {avatarOptionSets.faceShape.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/50" size={17} />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="text-xs font-bold uppercase tracking-[0.14em] text-ink/55">
            Hair style
          </label>
          <span className="text-[10px] font-semibold text-rose-700">Photographic style</span>
        </div>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          {avatarOptionSets.hairStyle.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setAppearance("hairStyle", option as AvatarAppearance["hairStyle"])}
              className={cn(
                "flex min-h-16 items-center gap-3 rounded-2xl border p-2 text-left text-xs font-semibold transition",
                appearance.hairStyle === option
                  ? "border-rose-500 bg-rose-50 text-rose-700 shadow-[0_0_0_2px_rgba(169,86,107,.1)]"
                  : "border-charcoal/10 bg-white hover:border-rose-300",
              )}
              aria-pressed={appearance.hairStyle === option}
            >
              <span
                className="h-12 w-11 shrink-0 rounded-xl bg-cover bg-center shadow-hairline"
                style={{
                  backgroundImage: `url("${avatarStyleSheets[option as AvatarAppearance["hairStyle"]]}")`,
                  backgroundPosition: avatarSkinPositions[appearance.skinTone],
                  backgroundSize: "200% 200%",
                }}
                aria-hidden="true"
              />
              <span>{option}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="text-xs font-bold uppercase tracking-[0.14em] text-ink/55">
            Hair colour
          </label>
          <span className="text-[10px] font-semibold text-rose-700">Tone simulation</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {avatarOptionSets.hairColor.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setAppearance("hairColor", option as AvatarAppearance["hairColor"])}
              className={cn(
                "flex min-h-12 items-center gap-2 rounded-2xl border bg-white px-3 text-left text-[11px] font-semibold transition",
                appearance.hairColor === option
                  ? "border-rose-500 text-rose-700 shadow-[0_0_0_2px_rgba(169,86,107,.1)]"
                  : "border-charcoal/10 hover:border-rose-300",
              )}
              aria-pressed={appearance.hairColor === option}
            >
              <span
                className="size-6 shrink-0 rounded-full border-2 border-white shadow-hairline"
                style={{ background: hairSwatches[option] }}
                aria-hidden="true"
              />
              <span>{option}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="text-xs font-bold uppercase tracking-[0.14em] text-ink/55">
            Accessories
          </label>
          <span className="text-[10px] font-semibold text-rose-700">Placed detail</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {avatarOptionSets.accessory.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setAppearance("accessory", option as AvatarAppearance["accessory"])}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-2xl border bg-white px-2 text-center text-[10px] font-semibold transition",
                appearance.accessory === option
                  ? "border-rose-500 text-rose-700 shadow-[0_0_0_2px_rgba(169,86,107,.1)]"
                  : "border-charcoal/10 hover:border-rose-300",
              )}
              aria-pressed={appearance.accessory === option}
            >
              {option === "None" ? (
                <X size={17} aria-hidden="true" />
              ) : option === "Pearl Pins" ? (
                <span className="flex items-center gap-0.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full border border-champagne-500 bg-white" />
                  <span className="size-2 rounded-full border border-champagne-500 bg-white" />
                  <span className="size-1.5 rounded-full border border-champagne-500 bg-white" />
                </span>
              ) : (
                <span className="size-3 rotate-45 border border-champagne-700 bg-champagne-400 shadow-sm" aria-hidden="true" />
              )}
              <span>{option}</span>
            </button>
          ))}
        </div>
      </div>

      {(
        [
          ["makeup", "Makeup finish", avatarOptionSets.makeup],
          ["facialHair", "Facial hair", avatarOptionSets.facialHair],
        ] as const
      ).map(([key, label, options]) => (
        <div key={key}>
          <label htmlFor={`avatar-${key}`} className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-ink/55">
            {label}
          </label>
          <div className="relative">
            <select
              id={`avatar-${key}`}
              value={appearance[key]}
              onChange={(event) => setAppearance(key, event.target.value as never)}
              className="min-h-12 w-full appearance-none rounded-2xl border border-charcoal/10 bg-white px-4 pr-10 text-sm font-semibold"
            >
              {options.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/50" size={17} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ServiceInformation({
  service,
  isSelected,
  onAdd,
  onBook,
}: {
  service: SalonService;
  isSelected: boolean;
  onAdd: () => void;
  onBook: () => void;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const availableSpecialists = specialists.filter((specialist) =>
    service.specialistIds.includes(specialist.id),
  );
  return (
    <div className="flex min-h-0 flex-col">
      <div className="flex items-center justify-between gap-3">
        <Pill>{service.category}</Pill>
        <span className="text-xs font-semibold text-ink/55">{"\u2605"} {service.rating}</span>
      </div>
      <h2 className="mt-4 font-display text-4xl font-semibold leading-[0.95] text-charcoal">
        {service.name}
      </h2>
      <p className="mt-4 text-sm leading-6 text-ink/70">{service.description}</p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-ivory p-4">
          <Clock3 size={16} className="text-rose-600" />
          <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-ink/50">Duration</div>
          <div className="mt-0.5 font-display text-xl font-semibold">{formatDuration(service.duration)}</div>
        </div>
        <div className="rounded-2xl bg-ivory p-4">
          <CircleDollarSign size={16} className="text-rose-600" />
          <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-ink/50">Starts at</div>
          <div className="mt-0.5 font-display text-xl font-semibold">{formatPrice(service.price)}</div>
        </div>
      </div>
      <div className="mt-5">
        <div className="text-xs font-bold uppercase tracking-wider text-ink/50">Why clients choose it</div>
        <p className="mt-2 text-sm leading-6 text-charcoal">{service.benefit}</p>
      </div>
      <div className="mt-5">
        <div className="text-xs font-bold uppercase tracking-wider text-ink/50">Suitable for</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {service.occasions.slice(0, 3).map((occasion) => (
            <Pill key={occasion} className="bg-lavender-50 text-lavender-700">
              {occasion}
            </Pill>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setDetailsOpen((value) => !value)}
        className="mt-5 flex min-h-11 w-full items-center justify-between rounded-2xl border border-charcoal/10 px-4 text-sm font-semibold"
        aria-expanded={detailsOpen}
      >
        Preparation, products & aftercare
        <ChevronDown size={17} className={cn("transition", detailsOpen && "rotate-180")} />
      </button>
      {detailsOpen && (
        <div className="mt-3 space-y-4 rounded-2xl bg-ivory p-4 text-xs leading-5 text-ink/70">
          <div>
            <strong className="block text-charcoal">Preparation</strong>
            {service.preparation}
          </div>
          <div>
            <strong className="block text-charcoal">Products</strong>
            {service.products.join(" \u00B7 ")}
          </div>
          <div>
            <strong className="block text-charcoal">Aftercare</strong>
            {service.aftercare}
          </div>
          <div>
            <strong className="block text-charcoal">Important</strong>
            {service.importantNotes}
          </div>
        </div>
      )}
      <div className="mt-5 rounded-2xl border border-champagne-300/50 bg-champagne-50 p-4">
        <div className="text-[10px] font-bold uppercase tracking-wider text-champagne-700">
          Available specialists
        </div>
        <p className="mt-1 text-xs font-semibold text-charcoal">
          {availableSpecialists.map((item) => item.name).join(" \u00B7 ")}
        </p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-2 border-t border-charcoal/8 pt-6">
        <Button variant="secondary" onClick={onAdd} disabled={isSelected}>
          {isSelected ? (
            <>
              <Check size={17} />
              Added
            </>
          ) : (
            <>
              <Layers3 size={17} />
              Add to Look
            </>
          )}
        </Button>
        <Button onClick={onBook}>Book This</Button>
      </div>
    </div>
  );
}

function AIRecommendationPanel({
  appearance,
  onUse,
}: {
  appearance: AvatarAppearance;
  onUse: (serviceIds: string[], nextAppearance: BeautyAgentAppearance) => void;
}) {
  const [prompt, setPrompt] = useState(
    "Create a polished, salon-realistic look while keeping the same person.",
  );
  const [occasion, setOccasion] = useState("Professional");
  const [style, setStyle] = useState("Polished");
  const [budget, setBudget] = useState("5000");
  const [time, setTime] = useState("120");
  const [maintenance, setMaintenance] = useState("Low");
  const [agentResult, setAgentResult] = useState<BeautyAgentResult | null>(null);
  const [agentError, setAgentError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const localRecommendation = useMemo(() => {
    const maxBudget = Number(budget);
    const maxTime = Number(time);
    const withinLimits = services.filter(
      (service) => service.price <= maxBudget && service.duration <= maxTime,
    );
    const occasionMatches = withinLimits.filter(
      (service) =>
        service.occasions.includes(occasion) ||
        (occasion === "Everyday Beauty" && service.occasions.includes("Everyday Beauty")),
    );
    const allowsFacialHair =
      appearance.facialHair !== "None" || /\\b(beard|grooming|stubble|men's)\\b/i.test(prompt);
    const occasionKeyword = occasion.toLowerCase().split(" ")[0];
    const ranked = [...(occasionMatches.length ? occasionMatches : withinLimits)]
      .filter((service) => allowsFacialHair || !service.visualEffect.facialHair)
      .sort((left, right) => {
        const relevance = (service: (typeof services)[number]) =>
          (service.name.toLowerCase().includes(occasionKeyword) ? 100 : 0) +
          (service.category === "Complete Look" ? 40 : 0) +
          (service.isPopular ? 10 : 0) +
          service.rating;
        return relevance(right) - relevance(left) || left.price - right.price;
      });
    const selected: typeof services = [];
    let runningPrice = 0;
    let runningDuration = 0;

    for (const service of ranked) {
      if (
        selected.length < 2 &&
        runningPrice + service.price <= maxBudget &&
        runningDuration + service.duration <= maxTime
      ) {
        selected.push(service);
        runningPrice += service.price;
        runningDuration += service.duration;
      }
    }

    return selected.length
      ? selected
      : services
          .filter((service) => service.price <= maxBudget && service.duration <= maxTime)
          .sort((left, right) => left.price - right.price)
          .slice(0, 1);
  }, [appearance.facialHair, budget, occasion, prompt, time]);

  const fallbackAppearance = useMemo<BeautyAgentAppearance>(
    () => ({
      hairStyle:
        occasion === "Bridal"
          ? "Bridal Bun"
          : style === "Statement"
            ? "Soft Curls"
            : style === "Polished"
              ? "Sleek Bob"
              : "Natural Layers",
      hairColor: appearance.hairColor,
      makeup:
        occasion === "Bridal"
          ? "Bridal"
          : style === "Statement"
            ? "Soft Glam"
            : style === "Natural"
              ? "Bare"
              : "Natural Glow",
      accessory: style === "Statement" ? "Pearl Pins" : "None",
      facialHair: appearance.facialHair,
    }),
    [appearance.facialHair, appearance.hairColor, occasion, style],
  );

  const localTotals = getTotals(localRecommendation);
  const fallbackResult = useMemo<BeautyAgentResult>(
    () => ({
      summary: `A ${style.toLowerCase()} ${occasion.toLowerCase()} direction using the studio's curated matching rules.`,
      reasons: [
        `Fits within ${formatPrice(Number(budget))} and ${formatDuration(Number(time))}.`,
        `${maintenance} maintenance preference is kept in the recommendation.`,
      ],
      serviceIds: localRecommendation.map((service) => service.id),
      appearance: fallbackAppearance,
      estimatedPrice: localTotals.final,
      estimatedDuration: localTotals.duration,
      source: "curated-fallback",
    }),
    [
      budget,
      fallbackAppearance,
      localRecommendation,
      localTotals.duration,
      localTotals.final,
      maintenance,
      occasion,
      style,
      time,
    ],
  );

  useEffect(() => {
    setAgentResult(null);
    setAgentError("");
  }, [appearance, budget, maintenance, occasion, prompt, style, time]);

  const shownResult = agentResult ?? fallbackResult;
  const recommendation = shownResult.serviceIds.flatMap((serviceId) => {
    const service = services.find((item) => item.id === serviceId);
    return service ? [service] : [];
  });
  const totals = getTotals(recommendation);

  const requestRecommendation = async () => {
    setIsLoading(true);
    setAgentError("");
    try {
      const result = await askBeautyAgent({
        prompt,
        occasion: occasion as "Professional" | "Party" | "Bridal" | "Everyday Beauty",
        style: style as "Polished" | "Natural" | "Statement",
        budget: Number(budget),
        availableMinutes: Number(time),
        maintenance: maintenance as "Low" | "Moderate" | "Premium",
        currentAppearance: appearance,
      });
      setAgentResult(result);
    } catch (error) {
      setAgentResult(null);
      setAgentError(
        error instanceof Error
          ? `${error.message} The curated fallback below is still ready to use.`
          : "AI is unavailable. The curated fallback below is still ready to use.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="rounded-2xl border border-lavender-100 bg-lavender-50 p-4 text-sm leading-6 text-lavender-700">
        Hugging Face is used only for text recommendations. The base person stays locked and no
        face, skin or hair analysis is performed.
      </div>

      <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-ink/55">
        Describe the look
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={3}
          maxLength={500}
          className="mt-2 w-full resize-none rounded-2xl border border-charcoal/10 bg-white px-4 py-3 text-sm font-medium leading-6 normal-case tracking-normal text-charcoal outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          placeholder="Example: Professional natural look with soft curls, under ₹5,000."
        />
      </label>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {[
          ["Occasion", occasion, setOccasion, ["Professional", "Party", "Bridal", "Everyday Beauty"]],
          ["Preferred style", style, setStyle, ["Polished", "Natural", "Statement"]],
          ["Budget", budget, setBudget, ["3500", "5000", "8000", "15000"]],
          ["Available time", time, setTime, ["60", "120", "180", "300"]],
          ["Maintenance", maintenance, setMaintenance, ["Low", "Moderate", "Premium"]],
        ].map(([label, value, setter, options]) => (
          <label key={String(label)} className="text-xs font-bold uppercase tracking-wider text-ink/55">
            {String(label)}
            <select
              value={String(value)}
              onChange={(event) => (setter as (value: string) => void)(event.target.value)}
              className="mt-2 min-h-12 w-full rounded-2xl border border-charcoal/10 bg-white px-4 text-sm font-semibold normal-case tracking-normal text-charcoal"
            >
              {(options as string[]).map((option) => (
                <option key={option} value={option}>
                  {label === "Budget"
                    ? formatPrice(Number(option))
                    : label === "Available time"
                      ? formatDuration(Number(option))
                      : option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <Button
        variant="secondary"
        className="mt-5 w-full"
        onClick={requestRecommendation}
        disabled={isLoading || prompt.trim().length < 3}
      >
        <Bot size={17} className={isLoading ? "animate-pulse" : ""} />
        {isLoading ? "AI stylist is thinking..." : "Ask Hugging Face AI Stylist"}
      </Button>

      {agentError && (
        <p className="mt-3 rounded-2xl border border-champagne-300/60 bg-champagne-50 px-4 py-3 text-xs leading-5 text-champagne-800">
          {agentError}
        </p>
      )}

      <div className="mt-6 rounded-3xl bg-charcoal p-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-champagne-300">
            <Bot size={17} />
            {agentResult ? "Hugging Face AI recommendation" : "Curated fallback"}
          </div>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70">
            Base avatar locked
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-white/75">{shownResult.summary}</p>
        {agentResult?.model && (
          <p className="mt-2 text-[11px] font-semibold text-white/45">
            Free-tier open model: {agentResult.model}
          </p>
        )}
        <ul className="mt-4 space-y-2">
          {recommendation.map((service) => (
            <li key={service.id} className="flex items-center gap-2 text-sm font-semibold">
              <Check size={16} className="shrink-0 text-champagne-300" />
              {service.name}
            </li>
          ))}
        </ul>
        <ul className="mt-4 space-y-1 border-t border-white/10 pt-4 text-xs leading-5 text-white/60">
          {shownResult.reasons.map((reason) => (
            <li key={reason}>• {reason}</li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-sm">
          <span>{formatDuration(totals.duration)}</span>
          <span className="font-semibold">{formatPrice(totals.final)} estimated</span>
        </div>
        <Button
          className="mt-5 w-full"
          onClick={() => onUse(shownResult.serviceIds, shownResult.appearance)}
          disabled={!shownResult.serviceIds.length}
        >
          Apply Services & Avatar Layers
        </Button>
      </div>
    </div>
  );
}
export default function StudioPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    appearance,
    selectedCategory,
    selectedServiceIds,
    savedLooks,
    notice,
    setAppearance,
    selectCategory,
    addService,
    removeService,
    clearLook,
    saveCurrentLook,
    renameSavedLook,
    removeSavedLook,
    duplicateSavedLook,
    loadSavedLook,
    startBooking,
    setNotice,
  } = useStudioStore();
  const initialCategory = searchParams.get("category") as ServiceCategory | null;
  const [activeServiceId, setActiveServiceId] = useState("");
  const [savedOpen, setSavedOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [lookName, setLookName] = useState("");
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    if (initialCategory && categories.some((category) => category.name === initialCategory))
      selectCategory(initialCategory);
  }, [initialCategory, selectCategory]);

  const categoryServices = services.filter((service) => service.category === selectedCategory);
  const activeService =
    services.find((service) => service.id === activeServiceId) ?? categoryServices[0] ?? services[0];

  useEffect(() => {
    if (!categoryServices.some((service) => service.id === activeServiceId))
      setActiveServiceId(categoryServices[0]?.id ?? "");
  }, [activeServiceId, categoryServices]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 4200);
    return () => window.clearTimeout(timer);
  }, [notice, setNotice]);

  const selectedServices = services.filter((service) => selectedServiceIds.includes(service.id));
  const totals = getTotals(selectedServices);
  const isActiveSelected = selectedServiceIds.includes(activeService.id);
  const displayAppearance = appearance;


  const handleBook = (serviceIds = selectedServiceIds) => {
    const finalServices = serviceIds.length ? serviceIds : [activeService.id];
    startBooking(finalServices);
    navigate("/booking");
  };

  const handleSave = () => {
    const look = saveCurrentLook(lookName);
    if (look) {
      setSaveOpen(false);
      setLookName("");
    }
  };

  const compareLooks = savedLooks.filter((look) => compareIds.includes(look.id));

  return (
    <div className="flex min-h-[calc(100dvh-76px)] flex-col bg-[#eee7e2] lg:h-[calc(100dvh-76px)] lg:overflow-hidden">
      <div className="shrink-0 border-b border-charcoal/8 bg-canvas px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-rose-600">
              <Sparkles size={15} />
              Virtual Beauty Studio
            </div>
            <p className="mt-1 hidden text-xs text-ink/55 sm:block">
              One identity-locked model &middot; Curated salon references &middot; No customer upload
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => setAssistantOpen(true)}>
              <Bot size={17} />
              Beauty Assistant
            </Button>
            <Button variant="ghost" onClick={() => setSavedOpen(true)}>
              <Heart size={17} />
              Saved
              {savedLooks.length > 0 && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] text-rose-700">{savedLooks.length}</span>}
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full min-h-0 min-w-0 max-w-[1600px] flex-1 grid-cols-1 lg:grid-cols-[270px_minmax(320px,1fr)_350px] lg:overflow-hidden">
        <aside className="no-scrollbar order-2 w-full min-h-0 min-w-0 max-w-full border-b border-charcoal/8 bg-canvas p-4 lg:order-none lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">Shape the avatar</h2>
            <Button variant="ghost" className="size-10 px-0" onClick={clearLook} aria-label="Reset avatar and selected services">
              <RotateCcw size={16} />
            </Button>
          </div>
          <AppearanceControls appearance={appearance} setAppearance={setAppearance} />
          <div className="my-6 h-px bg-charcoal/8" />
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-ink/55">Beauty category</h2>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {categories.map((category) => {
              const Icon = categoryIcons[category.name];
              const active = selectedCategory === category.name;
              return (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => selectCategory(category.name)}
                  className={cn(
                    "flex min-h-12 items-center gap-3 rounded-2xl border px-3 text-left text-xs font-semibold transition",
                    active
                      ? "border-rose-300 bg-rose-50 text-rose-700"
                      : "border-transparent hover:bg-ivory",
                  )}
                  aria-pressed={active}
                >
                  <Icon size={17} />
                  {category.name}
                </button>
              );
            })}
          </div>
        </aside>

        <section className="relative order-1 flex min-h-[min(78dvh,720px)] w-full min-w-0 max-w-full flex-col bg-gradient-to-b from-[#e9ddda] to-[#d5c5c3] p-4 sm:p-5 lg:order-none lg:min-h-0 lg:overflow-hidden">
          <div className="absolute inset-0 editorial-grid opacity-40" />
          <div className="relative flex shrink-0 items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/50">Photographic look preview</div>
              <div className="mt-1 text-sm font-semibold text-charcoal" aria-live="polite">
                {appearance.hairStyle} · {appearance.hairColor}
                {appearance.accessory !== "None" ? ` · ${appearance.accessory}` : ""}
              </div>
            </div>
            <Pill className="bg-white/75 text-charcoal backdrop-blur">
              Identity locked
            </Pill>
          </div>

          <div className="relative mx-auto flex min-h-0 w-full flex-1 items-center justify-center py-3">
            {/* Portrait frame: height fills available space, width follows 3:4 so full head/hair stays visible */}
            <div className="relative mx-auto aspect-[3/4] h-full max-h-full w-auto max-w-full">
              <CommonAvatar
                appearance={displayAppearance}
                className="absolute inset-0 h-full w-full rounded-[2.5rem] border border-white/45 shadow-lift"
                label={`${activeService.name} on the common configurable avatar`}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center">
                <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/70 bg-white/85 p-1.5 shadow-soft backdrop-blur">
                  <Button variant="ghost" className="size-10 px-0" onClick={() => setSaveOpen(true)} aria-label="Save current look">
                    <Save size={17} />
                  </Button>
                  <Button variant="ghost" className="size-10 px-0" onClick={() => setSavedOpen(true)} aria-label="Open saved looks">
                    <Layers3 size={17} />
                  </Button>
                  <Button
                    variant="ghost"
                    className="size-10 px-0"
                    onClick={async () => {
                      await navigator.clipboard?.writeText(window.location.href);
                      setNotice("Studio link copied. Saved look details remain on this device.");
                    }}
                    aria-label="Copy studio link"
                  >
                    <Share2 size={17} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="relative shrink-0 rounded-3xl border border-white/50 bg-white/75 p-3 shadow-soft backdrop-blur">
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <div className="text-xs font-bold uppercase tracking-wider text-ink/55">
                {selectedCategory} references
              </div>
              <span className="text-[11px] text-ink/50">Choose a card to preview</span>
            </div>
            <div className="no-scrollbar flex snap-x gap-2 overflow-x-auto pb-1">
              {categoryServices.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setActiveServiceId(service.id)}
                  className={cn(
                    "min-h-[74px] w-48 shrink-0 snap-start rounded-2xl border p-3 text-left transition",
                    service.id === activeService.id
                      ? "border-rose-400 bg-rose-50"
                      : "border-charcoal/8 bg-white hover:border-rose-200",
                  )}
                  aria-pressed={service.id === activeService.id}
                >
                  <span className="block truncate text-xs font-semibold text-charcoal">{service.name}</span>
                  <span className="mt-2 flex items-center justify-between text-[10px] text-ink/50">
                    <span>{formatDuration(service.duration)}</span>
                    <span>{formatPrice(service.price)}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative mt-3 flex shrink-0 gap-2 sm:hidden">
            <Button variant="secondary" className="flex-1" onClick={() => setAssistantOpen(true)}>
              <Bot size={17} />
              Assistant
            </Button>
            <Button className="flex-1" onClick={() => addService(activeService.id)} disabled={isActiveSelected}>
              {isActiveSelected ? "Added" : "Add to Look"}
            </Button>
          </div>
        </section>

        <aside className="no-scrollbar order-3 w-full min-h-0 min-w-0 max-w-full border-t border-charcoal/8 bg-canvas p-5 pb-28 lg:order-none lg:overflow-y-auto lg:border-l lg:border-t-0 lg:pb-5">
          <ServiceInformation
            service={activeService}
            isSelected={isActiveSelected}
            onAdd={() => addService(activeService.id)}
            onBook={() => handleBook([activeService.id])}
          />
          <div className="mt-7 border-t border-charcoal/8 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-semibold">Your look</h3>
              <span className="text-xs font-semibold text-ink/50">{selectedServices.length} services</span>
            </div>
            {selectedServices.length ? (
              <>
                <div className="mt-4 space-y-2">
                  {selectedServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between gap-3 rounded-2xl bg-ivory p-3">
                      <div className="min-w-0">
                        <div className="truncate text-xs font-semibold text-charcoal">{service.name}</div>
                        <div className="mt-0.5 text-[10px] text-ink/50">
                          {formatDuration(service.duration)} {"\u00B7"} {formatPrice(service.price)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeService(service.id)}
                        className="grid size-10 shrink-0 place-items-center rounded-full text-ink/50 hover:bg-white hover:text-rose-700"
                        aria-label={`Remove ${service.name}`}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2 border-t border-charcoal/8 pt-4 text-xs">
                  <div className="flex justify-between text-ink/60">
                    <span>Services</span>
                    <span>{formatPrice(totals.subtotal)}</span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-rose-700">
                      <span>Look-builder saving</span>
                      <span>{"\u2212"} {formatPrice(totals.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-ink/60">
                    <span>Estimated time</span>
                    <span>{formatDuration(totals.duration)}</span>
                  </div>
                  <div className="flex justify-between pt-1 font-display text-xl font-semibold text-charcoal">
                    <span>Estimated total</span>
                    <span>{formatPrice(totals.final)}</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button variant="secondary" onClick={() => setSaveOpen(true)}>
                    <Save size={16} />
                    Save Look
                  </Button>
                  <Button onClick={() => handleBook()}>
                    Book Look
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </>
            ) : (
              <p className="mt-3 rounded-2xl bg-ivory p-4 text-xs leading-5 text-ink/60">
                Preview a service, then add it to calculate combined duration and estimated price.
              </p>
            )}
          </div>
          <div className="mt-6 flex gap-3 rounded-2xl border border-lavender-100 bg-lavender-50 p-4 text-xs leading-5 text-lavender-700">
            <ShieldCheck className="mt-0.5 shrink-0" size={18} />
            Avatar previews are visual style references only. Actual results may vary based on individual
            features, hair type, skin condition, selected products and professional assessment.
          </div>
        </aside>
      </div>

      {notice && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-5 left-1/2 z-[120] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-2xl bg-charcoal px-5 py-4 text-sm font-semibold text-white shadow-lift"
        >
          {notice}
        </motion.div>
      )}

      <Dialog open={saveOpen} onClose={() => setSaveOpen(false)} title="Save this look">
        <p className="text-sm leading-6 text-ink/65">
          The avatar configuration and selected services are stored only in this browser for the demo.
        </p>
        <label htmlFor="look-name" className="mt-5 block text-xs font-bold uppercase tracking-wider text-ink/55">
          Look name
        </label>
        <input
          id="look-name"
          value={lookName}
          onChange={(event) => setLookName(event.target.value)}
          placeholder={`My Aurelia Look ${savedLooks.length + 1}`}
          className="mt-2 min-h-12 w-full rounded-2xl border border-charcoal/12 bg-white px-4 text-base"
        />
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setSaveOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save on this device</Button>
        </div>
      </Dialog>

      <Dialog open={savedOpen} onClose={() => setSavedOpen(false)} title="Saved looks" className="max-w-4xl">
        {savedLooks.length ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {savedLooks.map((look) => (
                <article key={look.id} className="rounded-3xl border border-charcoal/10 bg-white p-3 shadow-hairline">
                  <div className="grid grid-cols-[120px_1fr] gap-4">
                    <CommonAvatar appearance={look.appearance} compact className="h-36 rounded-2xl" label={look.name} />
                    <div className="min-w-0 py-1">
                      <input
                        defaultValue={look.name}
                        onBlur={(event) => {
                          const nextName = event.target.value.trim();
                          if (nextName && nextName !== look.name) renameSavedLook(look.id, nextName);
                        }}
                        aria-label={`Rename ${look.name}`}
                        className="w-full border-b border-transparent bg-transparent font-display text-2xl font-semibold focus:border-rose-300 focus:outline-none"
                      />
                      <p className="mt-2 text-xs text-ink/55">{look.serviceIds.length} selected services</p>
                      <div className="mt-4 flex gap-1">
                        <Button
                          variant="ghost"
                          className="size-10 px-0"
                          onClick={() => duplicateSavedLook(look.id)}
                          aria-label={`Duplicate ${look.name}`}
                        >
                          <Copy size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          className="size-10 px-0"
                          onClick={() => removeSavedLook(look.id)}
                          aria-label={`Remove ${look.name}`}
                        >
                          <Trash2 size={16} />
                        </Button>
                        <label className="grid size-10 cursor-pointer place-items-center rounded-full hover:bg-rose-50" title="Select for comparison">
                          <input
                            type="checkbox"
                            className="size-4"
                            checked={compareIds.includes(look.id)}
                            disabled={!compareIds.includes(look.id) && compareIds.length >= 2}
                            onChange={(event) =>
                              setCompareIds((ids) =>
                                event.target.checked
                                  ? [...ids, look.id].slice(-2)
                                  : ids.filter((id) => id !== look.id),
                              )
                            }
                            aria-label={`Select ${look.name} for comparison`}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        loadSavedLook(look.id);
                        setSavedOpen(false);
                      }}
                    >
                      Modify
                    </Button>
                    <Button
                      onClick={() => {
                        startBooking(look.serviceIds, look.id);
                        navigate("/booking");
                      }}
                    >
                      Book
                    </Button>
                  </div>
                </article>
              ))}
            </div>
            <Button
              className="mt-5 w-full"
              disabled={compareIds.length !== 2}
              onClick={() => {
                setSavedOpen(false);
                setCompareOpen(true);
              }}
            >
              Compare Two Selected Looks
            </Button>
          </>
        ) : (
          <EmptyState
            icon={<Heart size={20} />}
            title="No saved looks yet"
            description="Build a look with one or more services, then save it here for comparison or booking."
          />
        )}
      </Dialog>

      <Dialog open={compareOpen} onClose={() => setCompareOpen(false)} title="Compare saved looks" className="max-w-5xl">
        <div className="grid gap-5 sm:grid-cols-2">
          {compareLooks.map((look) => {
            const lookServices = services.filter((service) => look.serviceIds.includes(service.id));
            const lookTotals = getTotals(lookServices);
            return (
              <article key={look.id} className="rounded-3xl border border-charcoal/10 bg-white p-4">
                <CommonAvatar appearance={look.appearance} compact className="h-72 rounded-2xl" label={look.name} />
                <h3 className="mt-4 font-display text-3xl font-semibold">{look.name}</h3>
                <ul className="mt-3 space-y-1 text-xs leading-5 text-ink/65">
                  {lookServices.map((service) => (
                    <li key={service.id}>{"\u2022"} {service.name}</li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between border-t border-charcoal/8 pt-4 text-sm font-semibold">
                  <span>{formatDuration(lookTotals.duration)}</span>
                  <span>{formatPrice(lookTotals.final)}</span>
                </div>
              </article>
            );
          })}
        </div>
      </Dialog>

      <Dialog open={assistantOpen} onClose={() => setAssistantOpen(false)} title="AI Beauty Assistant">
        <AIRecommendationPanel
          appearance={appearance}
          onUse={(serviceIds, nextAppearance) => {
            serviceIds.forEach((id) => addService(id));
            if (nextAppearance.hairStyle) setAppearance("hairStyle", nextAppearance.hairStyle);
            if (nextAppearance.hairColor) setAppearance("hairColor", nextAppearance.hairColor);
            if (nextAppearance.makeup) setAppearance("makeup", nextAppearance.makeup);
            if (nextAppearance.facialHair) {
              setAppearance("facialHair", nextAppearance.facialHair);
            }
            if (nextAppearance.accessory) setAppearance("accessory", nextAppearance.accessory);
            setAssistantOpen(false);
          }}
        />
      </Dialog>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-charcoal/10 bg-canvas/95 p-3 pb-[calc(.75rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => addService(activeService.id)} disabled={isActiveSelected}>
            {isActiveSelected ? "Added to Look" : "Add to Look"}
          </Button>
          <Button onClick={() => handleBook()}>Book Now</Button>
        </div>
      </div>
    </div>
  );
}
