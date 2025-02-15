import { useEffect, useRef } from "react";
import { getCookie } from "../helper/getCookie";
import { BACKEND_URL } from "../config";

function TrackVisitor() {
  const hasRequestSend = useRef(false);

  // tracking the random user, who ever visit the website
  useEffect(() => {
    (async function createVisitorId() {
      const existingVisitorId =
        localStorage.getItem("visitorId") || getCookie("visitorId");

      if (!existingVisitorId && !hasRequestSend.current) {
        hasRequestSend.current = true;
        const visitorData = {
          userAgent: navigator.userAgent,
          orientation: screen.orientation?.type || "unknown",
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          connectionType: navigator.connection?.effectiveType || "unknown",
          browserLanguage: navigator.language || navigator.userLanguage,
          referrer: document.referrer || "Direct",
        };
        try {
          const res = await fetch(`${BACKEND_URL}/visitor/new-visitor`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(visitorData),
          });
          const data = await res.json();
          localStorage.setItem("visitorId", data.visitorId);
        } catch (error) {
          console.error("Fetch error: \n", error);
        }
      } else {
        if (getCookie("visitorId")) {
          localStorage.setItem("visitorId", getCookie("visitorId"));
        }
      }
    })();
  }, []);
}

export default TrackVisitor;
