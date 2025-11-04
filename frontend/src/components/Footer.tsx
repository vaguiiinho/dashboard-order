"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full border-t border-blue-900 dashboard-background dashboard-text-secondary z-30 h-10">
      <div className="mx-auto max-w-7xl px-4 h-10 text-sm sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap">© {currentYear}</span>
          <span className="hidden sm:inline">•</span>
          <span className="whitespace-nowrap">Tubaron Tecnologias</span>
        </div>
        <div className="mt-0 sm:mt-0 flex items-center gap-2">
          <span className="whitespace-nowrap">Versão 1.0</span>
          <span className="hidden sm:inline">•</span>
          <span className="whitespace-nowrap">Desenvolvido por Tubaron Tecnologias</span>
        </div>
      </div>
    </footer>
  );
}


