import { useEffect } from "react";
import { BACKEND_URL } from "../config";

function TrackSessionTime() {
  useEffect(() => {
    const connectionType = navigator.connection?.effectiveType || "unknown";
    const pageURL = window.location.href;
    const startTime = Date.now();

    const handleUnload = async () => {
      const endTime = Date.now();
      const sessionDuration = Math.floor((endTime - startTime) / 1000);
      const visitorId = localStorage.getItem("visitorId");

      await fetch(`${BACKEND_URL}/visitor/session-time`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Visitor-ID": visitorId,
        },
        body: JSON.stringify({ sessionDuration, connectionType, pageURL }),
      });
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);
  return null;
}

export default TrackSessionTime;
