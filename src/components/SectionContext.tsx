"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

type Section = "main" | "admin" | "tails";

interface SectionContextType {
  section: Section;
  setSection: (section: Section) => void;
}

const SectionContext = createContext<SectionContextType>({ section: "main", setSection: () => {} });

export function useSection() {
  return useContext(SectionContext);
}

export function SectionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [section, setSection] = useState<Section>("main");

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      setSection("admin");
      document.documentElement.classList.add("admin");
      document.documentElement.classList.remove("tails");
    } else if (pathname.startsWith("/tails")) {
      setSection("tails");
      document.documentElement.classList.add("tails");
      document.documentElement.classList.remove("admin");
    } else {
      setSection("main");
      document.documentElement.classList.remove("admin", "tails");
    }
  }, [pathname]);

  return (
    <SectionContext.Provider value={{ section, setSection }}>
      {children}
    </SectionContext.Provider>
  );
}