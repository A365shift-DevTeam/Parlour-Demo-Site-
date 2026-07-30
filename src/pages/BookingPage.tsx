import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  Heart,
  IndianRupee,
  MapPin,
  MessageCircle,
  Plus,
  Scissors,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { addDays, format, parseISO } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { branches, services, specialists } from "../data/mockData";
import { previewAppearance } from "../lib/avatar";
import { cn, formatDuration, formatPrice, getTotals } from "../lib/utils";
import { customerSchema, type CustomerFormValues } from "../schemas/booking";
import type { Booking } from "../types";
import { useStudioStore } from "../store/useStudioStore";
import { CommonAvatar } from "../components/common/CommonAvatar";
import { SpritePortrait } from "../components/common/SpritePortrait";
import { Button, EmptyState, Pill, buttonStyles } from "../components/common/UI";

const steps = [
  "Review look",
  "Branch",
  "Specialist",
  "Date & time",
  "Your details",
  "Review",
  "Confirmed",
];

const times = ["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM", "7:00 PM"];

function StepShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="font-display text-4xl font-semibold leading-none text-charcoal sm:text-5xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">{description}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function BookingPage() {
  const {
    selectedServiceIds,
    appearance,
    bookingDraft,
    bookingConfirmation,
    startBooking,
    updateBookingDraft,
    confirmBooking,
  } = useStudioStore();
  const [step, setStep] = useState(bookingConfirmation ? 7 : 1);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (!bookingDraft.serviceIds.length && selectedServiceIds.length) startBooking(selectedServiceIds);
  }, [bookingDraft.serviceIds.length, selectedServiceIds, startBooking]);

  const selectedIds = bookingDraft.serviceIds.length
    ? bookingDraft.serviceIds
    : selectedServiceIds;
  const selectedServices = services.filter((service) => selectedIds.includes(service.id));
  const totals = getTotals(selectedServices);
  const tax = Math.round(totals.final * 0.18);
  const grandTotal = totals.final + tax;
  const selectedBranch = branches.find((branch) => branch.id === bookingDraft.branchId);
  const selectedSpecialist =
    bookingDraft.specialistId === "any"
      ? undefined
      : specialists.find((specialist) => specialist.id === bookingDraft.specialistId);

  const relevantSpecialists = useMemo(() => {
    const serviceSpecialistIds = new Set(selectedServices.flatMap((service) => service.specialistIds));
    return specialists.filter((specialist) => serviceSpecialistIds.has(specialist.id));
  }, [selectedServices]);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: bookingDraft.customer,
    mode: "onBlur",
  });

  const next = () => setStep((value) => Math.min(7, value + 1));
  const previous = () => setStep((value) => Math.max(1, value - 1));

  const createBooking = () => {
    if (!selectedBranch || !bookingDraft.date || !bookingDraft.time) return;
    const booking: Booking = {
      id: `booking-${Date.now()}`,
      bookingNumber: `AUR-${format(new Date(), "yyMMdd")}-${String(Date.now()).slice(-4)}`,
      serviceIds: selectedIds,
      lookId: bookingDraft.lookId,
      branchId: selectedBranch.id,
      specialistId: bookingDraft.specialistId,
      date: bookingDraft.date,
      time: bookingDraft.time,
      customer: bookingDraft.customer,
      subtotal: totals.subtotal,
      discount: totals.discount,
      tax,
      total: grandTotal,
      duration: totals.duration,
      status: "Confirmed",
    };
    confirmBooking(booking);
    setCancelled(false);
    setStep(7);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmation = bookingConfirmation;

  return (
    <div className="min-h-[calc(100dvh-76px)] bg-ivory py-8 sm:py-12">
      <div className="section-shell">
        <div className="mb-8 overflow-x-auto">
          <ol className="flex min-w-[760px] items-center" aria-label="Booking progress">
            {steps.map((label, index) => {
              const number = index + 1;
              const complete = number < step;
              const active = number === step;
              return (
                <li key={label} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-2">
                    <span
                      className={cn(
                        "grid size-9 place-items-center rounded-full border text-xs font-bold",
                        complete && "border-rose-600 bg-rose-600 text-white",
                        active && "border-charcoal bg-charcoal text-white",
                        !complete && !active && "border-charcoal/15 bg-white text-ink/45",
                      )}
                      aria-current={active ? "step" : undefined}
                    >
                      {complete ? <Check size={15} strokeWidth={3} /> : number}
                    </span>
                    <span className={cn("text-[10px] font-semibold", active ? "text-charcoal" : "text-ink/45")}>
                      {label}
                    </span>
                  </div>
                  {number < steps.length && (
                    <span className={cn("mx-2 mb-5 h-px flex-1", complete ? "bg-rose-500" : "bg-charcoal/12")} />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="rounded-4xl bg-canvas p-5 shadow-soft sm:p-8 lg:p-10">
            {step === 1 && (
              <StepShell
                title="Review your look"
                description="Confirm the services carried over from the studio or choose a service before continuing."
              >
                {selectedServices.length ? (
                  <div className="space-y-3">
                    {selectedServices.map((service) => (
                      <article key={service.id} className="grid grid-cols-[84px_1fr] gap-4 rounded-3xl border border-charcoal/8 bg-white p-3">
                        <CommonAvatar
                          appearance={previewAppearance(service.previewIndex, appearance.skinTone)}
                          compact
                          className="h-24 rounded-2xl"
                          label={`${service.name} booking reference`}
                        />
                        <div className="flex min-w-0 items-center justify-between gap-4 pr-2">
                          <div className="min-w-0">
                            <Pill>{service.category}</Pill>
                            <h3 className="mt-2 truncate font-display text-2xl font-semibold">{service.name}</h3>
                            <p className="mt-1 text-xs text-ink/55">
                              {formatDuration(service.duration)} · {formatPrice(service.price)}
                            </p>
                          </div>
                          <CheckCircle2 className="shrink-0 text-rose-600" size={22} />
                        </div>
                      </article>
                    ))}
                    <div className="flex flex-col justify-between gap-3 pt-4 sm:flex-row sm:items-center">
                      <Link to="/studio" className={buttonStyles.secondary}>
                        <Plus size={17} />
                        Modify in Studio
                      </Link>
                      <Button onClick={next}>
                        Choose Branch
                        <ArrowRight size={17} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    icon={<Scissors size={21} />}
                    title="Your booking is waiting for a service"
                    description="Explore services or build a complete look in the Virtual Studio first."
                    action={
                      <div className="flex flex-wrap justify-center gap-2">
                        <Link to="/services" className={buttonStyles.secondary}>
                          Explore Services
                        </Link>
                        <Link to="/studio" className={buttonStyles.primary}>
                          Open Studio
                        </Link>
                      </div>
                    }
                  />
                )}
              </StepShell>
            )}

            {step === 2 && (
              <StepShell
                title="Choose your salon"
                description="Select the GV Studio branch that works best for your day."
              >
                <div className="grid gap-3">
                  {branches.map((branch) => (
                    <button
                      key={branch.id}
                      type="button"
                      onClick={() => updateBookingDraft({ branchId: branch.id })}
                      className={cn(
                        "flex min-h-28 items-start gap-4 rounded-3xl border p-5 text-left transition",
                        bookingDraft.branchId === branch.id
                          ? "border-rose-500 bg-rose-50"
                          : "border-charcoal/10 bg-white hover:border-rose-300",
                      )}
                      aria-pressed={bookingDraft.branchId === branch.id}
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-rose-600 shadow-hairline">
                        <MapPin size={19} />
                      </span>
                      <span className="flex-1">
                        <span className="font-display text-2xl font-semibold">{branch.name}</span>
                        <span className="mt-1 block text-xs leading-5 text-ink/55">{branch.address}</span>
                        <span className="mt-2 block text-xs font-semibold text-charcoal">{branch.hours}</span>
                      </span>
                      {bookingDraft.branchId === branch.id && <CheckCircle2 className="text-rose-600" size={21} />}
                    </button>
                  ))}
                </div>
                <div className="mt-7 flex justify-between gap-3">
                  <Button variant="secondary" onClick={previous}>
                    <ArrowLeft size={17} />
                    Back
                  </Button>
                  <Button onClick={next} disabled={!bookingDraft.branchId}>
                    Choose Specialist
                    <ArrowRight size={17} />
                  </Button>
                </div>
              </StepShell>
            )}

            {step === 3 && (
              <StepShell
                title="Choose a specialist"
                description="Select a preferred specialist, or choose any available artist for the widest appointment choice."
              >
                <button
                  type="button"
                  onClick={() => updateBookingDraft({ specialistId: "any" })}
                  className={cn(
                    "flex w-full min-h-24 items-center gap-4 rounded-3xl border p-5 text-left",
                    bookingDraft.specialistId === "any"
                      ? "border-rose-500 bg-rose-50"
                      : "border-charcoal/10 bg-white",
                  )}
                >
                  <span className="grid size-12 place-items-center rounded-full bg-charcoal text-white">
                    <Sparkles size={20} />
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-2xl font-semibold">Any Available Specialist</span>
                    <span className="mt-1 block text-xs text-ink/55">Recommended for more appointment times</span>
                  </span>
                  {bookingDraft.specialistId === "any" && <CheckCircle2 className="text-rose-600" size={21} />}
                </button>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {relevantSpecialists.map((specialist) => (
                    <button
                      key={specialist.id}
                      type="button"
                      onClick={() => updateBookingDraft({ specialistId: specialist.id })}
                      className={cn(
                        "overflow-hidden rounded-3xl border bg-white text-left",
                        bookingDraft.specialistId === specialist.id
                          ? "border-rose-500 shadow-soft"
                          : "border-charcoal/10",
                      )}
                    >
                      <SpritePortrait
                        index={specialist.spriteIndex}
                        alt={`Portrait of ${specialist.name}`}
                        className="aspect-[16/9]"
                      />
                      <span className="block p-4">
                        <span className="font-display text-2xl font-semibold">{specialist.name}</span>
                        <span className="block text-xs font-semibold text-rose-700">{specialist.specialization}</span>
                        <span className="mt-2 block text-xs text-ink/50">★ {specialist.rating} · {specialist.nextAvailable}</span>
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-7 flex justify-between gap-3">
                  <Button variant="secondary" onClick={previous}>
                    <ArrowLeft size={17} />
                    Back
                  </Button>
                  <Button onClick={next}>
                    Choose Date
                    <ArrowRight size={17} />
                  </Button>
                </div>
              </StepShell>
            )}

            {step === 4 && (
              <StepShell
                title="Choose date and time"
                description="Mock availability is shown for the next seven days. Your confirmation reserves the selected slot in this demo."
              >
                <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
                  {Array.from({ length: 7 }).map((_, index) => {
                    const date = addDays(new Date(), index + 1);
                    const iso = format(date, "yyyy-MM-dd");
                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => updateBookingDraft({ date: iso, time: "" })}
                        className={cn(
                          "min-h-24 w-24 shrink-0 rounded-3xl border p-3 text-center",
                          bookingDraft.date === iso
                            ? "border-rose-500 bg-rose-600 text-white"
                            : "border-charcoal/10 bg-white",
                        )}
                      >
                        <span className="block text-[10px] font-bold uppercase tracking-wider opacity-65">
                          {format(date, "EEE")}
                        </span>
                        <span className="mt-1 block font-display text-3xl font-semibold">{format(date, "d")}</span>
                        <span className="block text-[10px] font-semibold opacity-65">{format(date, "MMM")}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6">
                  <div className="mb-3 text-xs font-bold uppercase tracking-wider text-ink/55">Available times</div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {times.map((time, index) => {
                      const unavailable = index % 4 === 2;
                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={unavailable || !bookingDraft.date}
                          onClick={() => updateBookingDraft({ time })}
                          className={cn(
                            "min-h-12 rounded-2xl border text-sm font-semibold",
                            bookingDraft.time === time
                              ? "border-rose-500 bg-rose-50 text-rose-700"
                              : "border-charcoal/10 bg-white",
                            unavailable && "cursor-not-allowed opacity-35 line-through",
                          )}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-7 flex justify-between gap-3">
                  <Button variant="secondary" onClick={previous}>
                    <ArrowLeft size={17} />
                    Back
                  </Button>
                  <Button onClick={next} disabled={!bookingDraft.date || !bookingDraft.time}>
                    Your Details
                    <ArrowRight size={17} />
                  </Button>
                </div>
              </StepShell>
            )}

            {step === 5 && (
              <StepShell
                title="Your details"
                description="No account is required. We only use these details for this appointment."
              >
                <form
                  onSubmit={form.handleSubmit((values) => {
                    updateBookingDraft({ customer: values });
                    next();
                  })}
                  noValidate
                  className="grid gap-5 sm:grid-cols-2"
                >
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/55">
                    Full name <span className="text-rose-600">*</span>
                    <input
                      autoComplete="name"
                      {...form.register("fullName")}
                      className="mt-2 min-h-12 w-full rounded-2xl border border-charcoal/12 bg-white px-4 text-base font-normal normal-case tracking-normal text-charcoal"
                      aria-invalid={Boolean(form.formState.errors.fullName)}
                    />
                    {form.formState.errors.fullName && (
                      <span role="alert" className="mt-1 block text-xs font-medium normal-case tracking-normal text-rose-700">
                        {form.formState.errors.fullName.message}
                      </span>
                    )}
                  </label>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/55">
                    Mobile number <span className="text-rose-600">*</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="9876543210"
                      {...form.register("mobile")}
                      className="mt-2 min-h-12 w-full rounded-2xl border border-charcoal/12 bg-white px-4 text-base font-normal normal-case tracking-normal text-charcoal"
                      aria-invalid={Boolean(form.formState.errors.mobile)}
                    />
                    {form.formState.errors.mobile && (
                      <span role="alert" className="mt-1 block text-xs font-medium normal-case tracking-normal text-rose-700">
                        {form.formState.errors.mobile.message}
                      </span>
                    )}
                  </label>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/55 sm:col-span-2">
                    Email <span className="text-rose-600">*</span>
                    <input
                      type="email"
                      autoComplete="email"
                      {...form.register("email")}
                      className="mt-2 min-h-12 w-full rounded-2xl border border-charcoal/12 bg-white px-4 text-base font-normal normal-case tracking-normal text-charcoal"
                      aria-invalid={Boolean(form.formState.errors.email)}
                    />
                    {form.formState.errors.email && (
                      <span role="alert" className="mt-1 block text-xs font-medium normal-case tracking-normal text-rose-700">
                        {form.formState.errors.email.message}
                      </span>
                    )}
                  </label>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/55 sm:col-span-2">
                    Optional notes
                    <textarea
                      rows={4}
                      placeholder="Anything your specialist should know before the appointment?"
                      {...form.register("notes")}
                      className="mt-2 w-full rounded-2xl border border-charcoal/12 bg-white p-4 text-base font-normal normal-case tracking-normal text-charcoal"
                    />
                    <span className="mt-1 block text-[10px] font-medium normal-case tracking-normal text-ink/45">
                      Please do not include medical records or sensitive personal information.
                    </span>
                  </label>
                  <div className="flex justify-between gap-3 pt-2 sm:col-span-2">
                    <Button variant="secondary" onClick={previous}>
                      <ArrowLeft size={17} />
                      Back
                    </Button>
                    <Button type="submit">
                      Review Booking
                      <ArrowRight size={17} />
                    </Button>
                  </div>
                </form>
              </StepShell>
            )}

            {step === 6 && (
              <StepShell
                title="Review your booking"
                description="Check the service brief, appointment details and estimated total before confirming."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    [MapPin, "Branch", selectedBranch?.name ?? "Not selected"],
                    [UserRound, "Specialist", selectedSpecialist?.name ?? "Any Available Specialist"],
                    [
                      CalendarDays,
                      "Date & time",
                      bookingDraft.date
                        ? `${format(parseISO(bookingDraft.date), "EEEE, d MMMM")} · ${bookingDraft.time}`
                        : "Not selected",
                    ],
                    [Clock3, "Estimated duration", formatDuration(totals.duration)],
                  ].map(([Icon, label, value]) => {
                    const ItemIcon = Icon as typeof MapPin;
                    return (
                      <div key={String(label)} className="rounded-3xl border border-charcoal/8 bg-white p-5">
                        <ItemIcon size={18} className="text-rose-600" />
                        <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-ink/50">{String(label)}</div>
                        <div className="mt-1 text-sm font-semibold text-charcoal">{String(value)}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 rounded-3xl border border-charcoal/8 bg-white p-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-ink/50">Selected services & stylist brief</div>
                  <ul className="mt-4 space-y-3">
                    {selectedServices.map((service) => (
                      <li key={service.id} className="flex justify-between gap-4 text-sm">
                        <span>{service.name}</span>
                        <span className="font-semibold">{formatPrice(service.price)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-5 rounded-3xl bg-charcoal p-5 text-white">
                  <div className="space-y-2 text-sm text-white/65">
                    <div className="flex justify-between">
                      <span>Service estimate</span>
                      <span>{formatPrice(totals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-champagne-300">
                      <span>Package/look discount</span>
                      <span>− {formatPrice(totals.discount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between border-t border-white/10 pt-4 font-display text-3xl font-semibold">
                    <span>Estimated total</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                </div>
                <div className="mt-5 flex gap-3 rounded-2xl bg-champagne-50 p-4 text-xs leading-5 text-champagne-700">
                  <ShieldCheck className="shrink-0" size={18} />
                  The selected avatar look and service list will be included in the stylist brief. Final
                  price is confirmed after professional assessment.
                </div>
                <div className="mt-7 flex justify-between gap-3">
                  <Button variant="secondary" onClick={previous}>
                    <ArrowLeft size={17} />
                    Back
                  </Button>
                  <Button onClick={createBooking}>
                    Confirm Appointment
                    <Check size={17} />
                  </Button>
                </div>
              </StepShell>
            )}

            {step === 7 && confirmation && (
              <div className="text-center">
                <span className="mx-auto grid size-20 place-items-center rounded-full bg-rose-50 text-rose-600">
                  <CheckCircle2 size={36} />
                </span>
                <Pill className="mt-6 bg-charcoal text-white">Booking {confirmation.bookingNumber}</Pill>
                <h1 className="mx-auto mt-5 max-w-2xl font-display text-5xl font-semibold leading-[0.92] sm:text-7xl">
                  {cancelled ? "Appointment cancelled." : "Your transformation is booked."}
                </h1>
                <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-ink/65">
                  {cancelled
                    ? "This demo booking is marked as cancelled. You can return to the studio to create another look."
                    : `We’ve prepared the service brief for ${confirmation.customer.fullName}. Your stylist will see the selected look and services.`}
                </p>
                {!cancelled && (
                  <>
                    <div className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-2">
                      <div className="rounded-3xl bg-ivory p-5">
                        <CalendarDays className="text-rose-600" size={18} />
                        <div className="mt-3 text-xs font-bold uppercase tracking-wider text-ink/50">Appointment</div>
                        <div className="mt-1 text-sm font-semibold">
                          {format(parseISO(confirmation.date), "EEEE, d MMMM yyyy")}
                          <br />
                          {confirmation.time}
                        </div>
                      </div>
                      <div className="rounded-3xl bg-ivory p-5">
                        <MapPin className="text-rose-600" size={18} />
                        <div className="mt-3 text-xs font-bold uppercase tracking-wider text-ink/50">Salon</div>
                        <div className="mt-1 text-sm font-semibold">{selectedBranch?.name}</div>
                        <div className="mt-1 text-xs text-ink/50">{selectedBranch?.address}</div>
                      </div>
                    </div>
                    <div className="mx-auto mt-6 grid max-w-2xl gap-2 sm:grid-cols-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          const start = `${confirmation.date.replace(/-/g, "")}T${confirmation.time.includes("PM") ? "110000" : "050000"}`;
                          downloadFile(
                            `${confirmation.bookingNumber}.ics`,
                            `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${start}\nSUMMARY:GV Studio Beauty Appointment\nLOCATION:${selectedBranch?.address ?? ""}\nDESCRIPTION:${selectedServices.map((service) => service.name).join(", ")}\nEND:VEVENT\nEND:VCALENDAR`,
                            "text/calendar",
                          );
                        }}
                      >
                        <CalendarDays size={17} />
                        Add to Calendar
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() =>
                          downloadFile(
                            `${confirmation.bookingNumber}.txt`,
                            `GV Studio Booking ${confirmation.bookingNumber}\n${selectedServices.map((service) => service.name).join("\n")}\n${confirmation.date} ${confirmation.time}\n${selectedBranch?.name}\nEstimated total: ${formatPrice(confirmation.total)}`,
                            "text/plain",
                          )
                        }
                      >
                        <Download size={17} />
                        Download Summary
                      </Button>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`GV Studio booking ${confirmation.bookingNumber} confirmed for ${confirmation.date} at ${confirmation.time}.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className={buttonStyles.secondary}
                      >
                        <MessageCircle size={17} />
                        WhatsApp Confirmation
                      </a>
                      <Link to="/studio" className={buttonStyles.secondary}>
                        <Heart size={17} />
                        View Saved Look
                      </Link>
                    </div>
                    <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2 border-t border-charcoal/8 pt-6">
                      <Button variant="ghost" onClick={() => setStep(4)}>
                        Reschedule
                      </Button>
                      <Button variant="ghost" className="text-rose-700" onClick={() => setCancelled(true)}>
                        Cancel Appointment
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </section>

          <aside className="h-fit rounded-4xl bg-charcoal p-5 text-white shadow-soft lg:sticky lg:top-28">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-champagne-300">
                Booking summary
              </div>
              <Pill className="bg-white/10 text-white">No account</Pill>
            </div>
            {selectedServices.length > 0 && (
              <CommonAvatar
                appearance={appearance}
                compact
                className="mt-5 h-64 rounded-3xl"
                label="Selected look included with booking"
              />
            )}
            <div className="mt-5 space-y-3">
              {selectedServices.slice(0, 4).map((service) => (
                <div key={service.id} className="flex justify-between gap-3 text-xs text-white/70">
                  <span>{service.name}</span>
                  <span className="shrink-0">{formatPrice(service.price)}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/10 pt-5">
              <div>
                <Clock3 size={16} className="text-champagne-300" />
                <div className="mt-2 text-[10px] uppercase tracking-wider text-white/40">Duration</div>
                <div className="mt-1 text-sm font-semibold">{formatDuration(totals.duration)}</div>
              </div>
              <div>
                <IndianRupee size={16} className="text-champagne-300" />
                <div className="mt-2 text-[10px] uppercase tracking-wider text-white/40">Estimated</div>
                <div className="mt-1 text-sm font-semibold">{formatPrice(grandTotal)}</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
