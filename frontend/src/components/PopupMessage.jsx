import { useState, useEffect } from "react";
import styles from "../css/PopupMessage.module.css";

function PopupMessage() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenPopup");
    if (!hasSeenPopup) {
      setShowPopup(true);
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    localStorage.setItem("hasSeenPopup", "true");
  };

  return (
    showPopup && (
      <div className={styles.popupOverlay}>
        <div className={styles.popupContent}>
          <h2>📢 Important Notice</h2>
          <ul>
            <li>
              <strong>Missing Question Papers?</strong> Ask your seniors to
              upload them!
            </li>
            <li>
              <strong>Department Folder Missing?</strong> Go to the suggestion
              box and describe your issue (e.g., "Require X folder in Y
              department").
            </li>
            <li>
              <strong>File Naming Convention:</strong> Use{" "}
              <code>Subject_Exam</code> format (e.g., <code>English_MT1</code>).
            </li>
            <li>
              <strong>File Type:</strong> Upload **PDF files only**.
            </li>
          </ul>
          <button onClick={handleClose}>Got it!</button>
        </div>
      </div>
    )
  );
}

export default PopupMessage;
