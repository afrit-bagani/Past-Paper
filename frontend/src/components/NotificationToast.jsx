import { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const NotificationToast = ({ message, variant = "success", onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (message) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);
  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast
        bg={variant}
        show={show}
        onClose={() => setShow(false)}
        delay={3000}
        autohide
      >
        <Toast.Body className="text-white fw-bold">{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default NotificationToast;
