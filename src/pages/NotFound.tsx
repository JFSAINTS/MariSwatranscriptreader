import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SocialLinks } from "@/components/SocialLinks";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-8 text-xl text-muted-foreground">Oops! Página no encontrada</p>
        <div className="flex flex-col gap-3 items-center">
          <a href="/" className="text-primary underline hover:text-primary/90">
            Volver al inicio
          </a>
          <a href="/youtube-downloader" className="text-primary underline hover:text-primary/90">
            Descargador de Videos de YouTube
          </a>
        </div>
      </div>
      <div className="absolute bottom-6">
        <SocialLinks />
      </div>
    </div>
  );
};

export default NotFound;
