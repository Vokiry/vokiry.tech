"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
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

  const updateSection = useCallback((newSection: Section) => {
    const root = document.documentElement;
    root.classList.remove("admin", "tails");
    if (newSection === "admin") {
      root.classList.add("admin");
    } else if (newSection === "tails") {
      root.classList.add("tails");
    }
    setSection(newSection);
  }, []);

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      updateSection("admin");
    } else if (pathname.startsWith("/tails")) {
      updateSection("tails");
    } else {
      updateSection("main");
    }
  }, [pathname, updateSection]);

  return (
    <SectionContext.Provider value={{ section, setSection: updateSection }}>
      {children}
    </SectionContext.Provider>
  );
}