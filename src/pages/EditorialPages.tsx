import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { branches, services, specialists } from "../data/mockData";
import { previewAppearance } from "../lib/avatar";
import { brand } from "../config/brand";
import { CommonAvatar } from "../components/common/CommonAvatar";
import { SpritePortrait } from "../components/common/SpritePortrait";
import { Button, Eyebrow, Pill, SectionHeading, buttonStyles } from "../components/common/UI";
import { SpecialistCard } from "../components/services/Cards";

export function SpecialistsPage() {
  return (
    <div className="bg-canvas">
      <section className="bg-ivory py-20 sm:py-28">
        <div className="section-shell grid items-end gap-8 lg:grid-cols-[1fr_.65fr]">
          <SectionHeading
            eyebrow="The Aurelia artists"
            title="Expertise with a listening ear."
            description="Explore each specialist’s focus, experience, services and next mock availability, then choose them during booking."
          />
          <div className="rounded-3xl border border-champagne-300/50 bg-champagne-50 p-5 text-sm leading-6 text-champagne-700">
            Prefer flexibility? Select “Any Available Specialist” at booking and we’ll match your
            chosen service to an appropriately skilled artist.
          </div>
        </div>
      </section>
      <section className="section-shell py-16 sm:py-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {specialists.map((specialist) => (
            <div id={specialist.id} key={specialist.id} className="scroll-mt-28">
              <SpecialistCard specialist={specialist} />
            </div>
          ))}
        </div>
      </section>
      <section className="bg-charcoal py-20 text-white">
        <div className="section-shell grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <Eyebrow className="text-champagne-300">Thoughtful matching</Eyebrow>
            <h2 className="font-display text-5xl font-semibold sm:text-6xl">
              Choose the service first. We’ll help with the artist.
            </h2>
          </div>
          <Link to="/studio" className={buttonStyles.primary}>
            Build Your Look
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export function GalleryPage() {
  const gallery = [
    ["Signature Layers", 0],
    ["Sculpted Curls", 1],
    ["Modern Bob", 2],
    ["Caramel Dimension", 3],
    ["Bridal Signature", 4],
    ["No-Makeup Glow", 5],
    ["Party Berry Edit", 6],
    ["Executive Grooming", 7],
  ] as const;
  return (
    <div className="bg-canvas">
      <section className="bg-[#261f22] py-20 text-white sm:py-28">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Curated reference gallery"
            title="Looks to begin a conversation."
            description="Every image below is a state of the same configurable salon avatar—not a customer result or personal simulation."
            className="[&_h2]:text-white [&_p]:text-white/60"
          />
        </div>
      </section>
      <section className="section-shell py-16 sm:py-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.map(([name, index]) => (
            <article key={name} className={index === 0 || index === 5 ? "sm:col-span-2" : ""}>
              <CommonAvatar
                appearance={previewAppearance(index)}
                compact
                className="h-[420px] rounded-4xl shadow-hairline"
                label={`${name} curated reference`}
              />
              <div className="flex items-center justify-between px-2 py-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold">{name}</h2>
                  <p className="text-xs text-ink/50">Static common-avatar reference</p>
                </div>
                <Link
                  to={`/studio?category=${encodeURIComponent(services.find((service) => service.previewIndex === index)?.category ?? "Hair")}`}
                  className="grid size-11 place-items-center rounded-full border border-charcoal/10 hover:bg-rose-50"
                  aria-label={`Explore ${name} in the studio`}
                >
                  <ArrowRight size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="bg-canvas">
      <section className="relative min-h-[660px] overflow-hidden bg-ivory">
        <img
          src="/images/aurelia-hero.png"
          alt="Fictional model in Aurelia's warm ivory salon setting"
          width="1536"
          height="1024"
          className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/90 to-transparent" />
        <div className="section-shell relative flex min-h-[660px] items-center">
          <div className="max-w-2xl">
            <Eyebrow>About Aurelia</Eyebrow>
            <h1 className="font-display text-6xl font-semibold leading-[0.86] sm:text-8xl">
              Beauty planning with more clarity and less pressure.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-ink/75">
              Aurelia pairs premium salon craft with a carefully bounded digital studio. Customers
              explore fixed references, understand services and book without surrendering a personal image.
            </p>
          </div>
        </div>
      </section>
      <section className="py-20 sm:py-28">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Our principles"
            title="Luxury should still feel honest."
            description="The studio is designed around informed choices, human consultation and respectful technology."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              [ShieldCheck, "Privacy by design", "No photo upload, camera, face scanning, recognition or biometric processing."],
              [HeartHandshake, "Human assessment", "The avatar starts a conversation; a professional consultation shapes the real service."],
              [Award, "Craft first", "Every reference connects to a real salon service, clear timing and specialist skill."],
              [Users, "Inclusive exploration", "Fixed skin tones, face shapes and styles make discovery approachable without claiming exact results."],
            ].map(([Icon, title, description]) => {
              const ItemIcon = Icon as typeof ShieldCheck;
              return (
                <article key={String(title)} className="rounded-4xl border border-charcoal/8 bg-white p-7 shadow-hairline">
                  <span className="grid size-12 place-items-center rounded-full bg-rose-50 text-rose-600">
                    <ItemIcon size={21} />
                  </span>
                  <h2 className="mt-8 font-display text-3xl font-semibold">{String(title)}</h2>
                  <p className="mt-3 text-sm leading-6 text-ink/65">{String(description)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-rose-50 py-20 sm:py-24">
        <div className="section-shell grid items-center gap-10 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-3">
            {specialists.slice(0, 4).map((specialist) => (
              <SpritePortrait
                key={specialist.id}
                index={specialist.spriteIndex}
                alt={`Aurelia specialist ${specialist.name}`}
                className="aspect-square rounded-3xl"
              />
            ))}
          </div>
          <div className="lg:pl-8">
            <Eyebrow>The people behind the service</Eyebrow>
            <h2 className="font-display text-5xl font-semibold sm:text-6xl">Digital clarity, human craft.</h2>
            <p className="mt-5 text-sm leading-7 text-ink/70">
              Your selected look reaches the stylist as a service brief—not a diagnosis or exact
              outcome. The final technique is chosen together, in the salon, with your comfort and
              professional assessment at the centre.
            </p>
            <Link to="/specialists" className={`${buttonStyles.primary} mt-7`}>
              Meet Our Specialists
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="bg-canvas">
      <section className="bg-ivory py-20 sm:py-28">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Contact & branches"
            title="Let’s make the next step easy."
            description="Ask about a service, check package suitability or contact your preferred Aurelia branch."
          />
        </div>
      </section>
      <section className="section-shell grid gap-8 py-16 sm:py-24 lg:grid-cols-[.9fr_1.1fr]">
        <div className="space-y-4">
          {branches.map((branch) => (
            <article key={branch.id} className="rounded-3xl border border-charcoal/8 bg-white p-6 shadow-hairline">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Pill>{branch.distance}</Pill>
                  <h2 className="mt-3 font-display text-3xl font-semibold">{branch.name}</h2>
                </div>
                <MapPin className="text-rose-600" size={21} />
              </div>
              <p className="mt-4 text-sm leading-6 text-ink/65">{branch.address}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-charcoal">
                <span className="flex items-center gap-2">
                  <Phone size={15} />
                  {branch.phone}
                </span>
                <span className="flex items-center gap-2">
                  <Clock3 size={15} />
                  {branch.hours}
                </span>
              </div>
            </article>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <a href={`tel:${brand.phone}`} className={buttonStyles.secondary}>
              <Phone size={17} />
              Call Us
            </a>
            <a
              href={`https://wa.me/${brand.phone.replace(/\D/g, "")}`}
              className={buttonStyles.secondary}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={17} />
              WhatsApp
            </a>
          </div>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
          className="h-fit rounded-4xl bg-charcoal p-6 text-white shadow-lift sm:p-9"
        >
          {sent ? (
            <div className="grid min-h-[480px] place-items-center text-center">
              <div>
                <CheckCircle2 className="mx-auto text-champagne-300" size={42} />
                <h2 className="mt-5 font-display text-5xl font-semibold">Thank you.</h2>
                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/60">
                  Your demo enquiry has been received. A salon coordinator would normally respond using the details provided.
                </p>
                <Button variant="secondary" className="mt-7 border-white/15 bg-white text-charcoal" onClick={() => setSent(false)}>
                  Send Another Message
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-champagne-300">
                <Mail size={16} />
                Send an enquiry
              </div>
              <h2 className="mt-4 font-display text-5xl font-semibold">How can we help?</h2>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                {[
                  ["Full name", "text", "name"],
                  ["Mobile number", "tel", "tel"],
                  ["Email", "email", "email"],
                ].map(([label, type, autocomplete], index) => (
                  <label key={label} className={index === 2 ? "sm:col-span-2" : ""}>
                    <span className="text-xs font-bold uppercase tracking-wider text-white/55">{label}</span>
                    <input
                      required
                      type={type}
                      autoComplete={autocomplete}
                      className="mt-2 min-h-12 w-full rounded-2xl border border-white/15 bg-white/8 px-4 text-base text-white placeholder:text-white/30"
                    />
                  </label>
                ))}
                <label className="sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/55">What would you like to discuss?</span>
                  <select className="mt-2 min-h-12 w-full rounded-2xl border border-white/15 bg-[#32292d] px-4 text-base text-white">
                    <option>A service</option>
                    <option>A package</option>
                    <option>Bridal consultation</option>
                    <option>Existing appointment</option>
                  </select>
                </label>
                <label className="sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/55">Message</span>
                  <textarea
                    required
                    rows={5}
                    className="mt-2 w-full rounded-2xl border border-white/15 bg-white/8 p-4 text-base text-white"
                  />
                </label>
              </div>
              <Button type="submit" className="mt-6 w-full">
                Send Enquiry
                <ArrowRight size={17} />
              </Button>
            </>
          )}
        </form>
      </section>
    </div>
  );
}
