import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/context/LanguageContext";
import { UpdateModal } from "@/components/UpdateModal";
import { SplashScreen } from "@/components/SplashScreen";
import { useUpdateCheck } from "@/hooks/useUpdateCheck";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { updateInfo, downloadAndInstall } = useUpdateCheck();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (updateInfo?.hasUpdate) {
      setShowUpdateModal(true);
    }
  }, [updateInfo]);

  return (
    <>
      <SplashScreen onComplete={() => setShowSplash(false)} />
      {!showSplash && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      )}
      <UpdateModal
        updateInfo={updateInfo}
        onDownload={downloadAndInstall}
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
      />
    </>
  );
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
