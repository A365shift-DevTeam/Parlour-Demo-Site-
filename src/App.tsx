import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Skeleton, buttonStyles } from "./components/common/UI";

const HomePage = lazy(() => import("./pages/HomePage"));
const StudioPage = lazy(() => import("./pages/StudioPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage"));
const PackagesPage = lazy(() => import("./pages/PackagesPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const SpecialistsPage = lazy(() =>
  import("./pages/EditorialPages").then((module) => ({ default: module.SpecialistsPage })),
);
const GalleryPage = lazy(() =>
  import("./pages/EditorialPages").then((module) => ({ default: module.GalleryPage })),
);
const AboutPage = lazy(() =>
  import("./pages/EditorialPages").then((module) => ({ default: module.AboutPage })),
);
const ContactPage = lazy(() =>
  import("./pages/EditorialPages").then((module) => ({ default: module.ContactPage })),
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function LoadingPage() {
  return (
    <div className="section-shell min-h-[70dvh] py-16" aria-label="Loading page">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="mt-5 h-20 max-w-2xl" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-80" />
        ))}
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="section-shell grid min-h-[70dvh] place-items-center py-20 text-center">
      <div>
        <div className="font-display text-8xl font-semibold text-rose-200">404</div>
        <h1 className="mt-2 font-display text-5xl font-semibold">This page needs a little restyling.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-ink/60">
          The page you requested is unavailable. Return home or continue exploring the Virtual Studio.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/" className={buttonStyles.secondary}>
            Return Home
          </Link>
          <Link to="/studio" className={buttonStyles.primary}>
            Open Studio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="studio" element={<StudioPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/:slug" element={<ServiceDetailPage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="specialists" element={<SpecialistsPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="booking" element={<BookingPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
