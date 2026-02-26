import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { runAxeAudit } from "../utils/axeAudit";

const AUDIT_DELAY_MS = 1000;

/**
 * Suorittaa WCAG 2.1 AA -auditoinnin sivun latauduttua ja reitin vaihtuessa.
 * Aktiivinen vain kehitysympäristössä.
 */
export function AxeAuditRunner() {
  const location = useLocation();

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const t = setTimeout(() => {
      runAxeAudit();
    }, AUDIT_DELAY_MS);

    return () => clearTimeout(t);
  }, [location.pathname]);

  return null;
}
