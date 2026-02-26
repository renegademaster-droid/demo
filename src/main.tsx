import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, useTheme } from "next-themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GDSProvider } from "@gdesignsystem/react";
import { Theme } from "@chakra-ui/react";
import { StudyProvider } from "./context/StudyContext";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { LumonPage } from "./pages/LumonPage";
import { Lumon2Page } from "./pages/Lumon2Page";
import { ThemePage } from "./pages/ThemePage";
import { StudyPage } from "./pages/StudyPage";
import { SummaryPage } from "./pages/SummaryPage";
import { SaunaPage } from "./pages/SaunaPage";
import { AxeAuditRunner } from "./components/AxeAuditRunner";

function ThemeClassSync() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    const mode = resolvedTheme === "dark" ? "dark" : "light";
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(mode);
  }, [resolvedTheme]);
  return null;
}

function App() {
  const { resolvedTheme } = useTheme();
  const appearance = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <>
      <ThemeClassSync />
      <AxeAuditRunner />
      <Theme appearance={appearance} minH="100vh" bg="bg.default" color="fg">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="lumon">
              <Route index element={<LumonPage />} />
              <Route path="2" element={<Lumon2Page />} />
            </Route>
            <Route path="theme" element={<ThemePage />} />
            <Route path="study" element={<StudyPage />} />
            <Route path="summary" element={<SummaryPage />} />
            <Route path="sauna" element={<SaunaPage />} />
          </Route>
        </Routes>
      </Theme>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <GDSProvider>
        <StudyProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <App />
          </BrowserRouter>
        </StudyProvider>
      </GDSProvider>
    </ThemeProvider>
  </React.StrictMode>
);
