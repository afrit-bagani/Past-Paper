import { useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { ROOT_FOLDER } from "../hooks/useFolder";
import LoadingSpinner from "./LoadingSpinner";
import NotificationToast from "./NotificationToast";

function UploadFile({ currentFolder, addChildFile }) {
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [toastData, setToastData] = useState(null);
  const fileInputRef = useRef();

  // toast message
  const showToast = (message, variant) => {
    setToastData({ message, variant });
  };

  // fn to upload file
  async function handleFileUpload(e) {
    const file = e.target.files[0];
    e.target.value = null; // reset input
    if (currentFolder == null || file == null) {
      return showToast("File can't be null", "danger");
    }
    const filePath =
      currentFolder === ROOT_FOLDER
        ? `${currentFolder?.path?.join("/")}/${file.name}`
        : `${currentFolder?.path?.map((p) => p.folderName).join("/")}/${
            currentFolder.folderName
          }/${file.name}`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("folderId", currentFolder._id || null);
    formData.append("path", filePath);
    formData.append("visitorId", localStorage.getItem("visitorId"));

    try {
      setIsFileUploading(true);
      const res = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });
      setIsFileUploading(false);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "File upload request failed");
      }
      const newFile = data.file;
      addChildFile({ ...newFile }); // paint the UI locally
      showToast(data.message, "success");
    } catch (error) {
      showToast(error.message, "danger");
      console.error("fetch error: \n", error);
    } finally {
      setIsFileUploading(false);
    }
  }

  return (
    <div>
      {toastData && (
        <NotificationToast
          message={toastData.message}
          variant={toastData.variant}
          onClose={() => setToastData(null)}
        />
      )}
      {/* For Desktop and Larger Screens */}
      <label
        className={`btn btn-outline-primary d-none d-sm-flex align-items-center ${
          isFileUploading ? "disabled" : ""
        }`}
      >
        {!isFileUploading ? (
          <FiUpload size={25} />
        ) : (
          <LoadingSpinner className="text-primary" />
        )}
        <span className="fw-bold">
          {!isFileUploading ? "Upload" : "Uploading..."}
        </span>
        <input
          ref={fileInputRef}
          type="file"
          className="d-none"
          name="file"
          onChange={handleFileUpload}
          accept=".doc,.docx,.pdf,.jpg,.jpeg,.png"
          disabled={isFileUploading}
        />
      </label>

      {/* For Mobile View Only */}
      {!isFileUploading && (
        <FiUpload
          size={40}
          className="text-primary d-flex d-sm-none"
          style={{ cursor: "pointer" }}
          onClick={() => fileInputRef.current.click()}
        />
      )}
    </div>
  );
}

export default UploadFile;
