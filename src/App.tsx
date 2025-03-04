
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";

// Lazy load components
const Player = lazy(() => import("./pages/Player"));
const MultiPlayer = lazy(() => import("./pages/MultiPlayer"));
const SportsPage = lazy(() => import("./pages/SportsPage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const EntertainmentPage = lazy(() => import("./pages/EntertainmentPage"));
const MoviesPage = lazy(() => import("./pages/MoviesPage"));
const TechPage = lazy(() => import("./pages/TechPage"));

// Create loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" expand={true} closeButton={true} />
      <BrowserRouter>
        <Navbar />
        <PageTransition>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/player/:streamId" element={<Player />} />
              <Route path="/multi-player" element={<MultiPlayer />} />
              <Route path="/sports" element={<SportsPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/entertainment" element={<EntertainmentPage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/tech" element={<TechPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
