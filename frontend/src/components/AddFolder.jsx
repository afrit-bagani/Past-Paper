import { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaFolderPlus } from "react-icons/fa6";
import { ROOT_FOLDER } from "../hooks/useFolder";
import NotificationToast from "./NotificationToast";

function AddFolder({ currentFolder, addChildFolder }) {
  const folderNameElement = useRef();
  const [isFetching, setIsFetching] = useState(false);

  const [show, setShow] = useState(false);
  const [toastData, setToastData] = useState(null);

  const showToast = (message, variant) => {
    setToastData({ message, variant });
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    folderNameElement.current.value = "";
  };

  // fn to create folder
  const createFolder = async (e) => {
    e.preventDefault();
    if (!currentFolder)
      return showToast("Current folder can't be null", "danger");
    const folderName = folderNameElement.current.value;
    if (folderName.trim() === "") {
      return showToast("Please enter a folder name", "warning");
    }

    const path = [...currentFolder.path];
    if (currentFolder !== ROOT_FOLDER) {
      path.push({
        folderId: currentFolder._id,
        folderName: currentFolder.folderName,
      });
    }
    try {
      setIsFetching(true);
      const res = await fetch("/api/folders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folderName,
          parentId: currentFolder._id || null,
          path,
        }),
      });
      setIsFetching(false);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Add folder request failed");
      }
      addChildFolder(data.data);
      showToast(data.message, "success");
      handleClose();
    } catch (error) {
      showToast(error.message, "danger");
      console.error("Fetch Error", error);
    }
  };

  return (
    <>
      {toastData && (
        <NotificationToast
          message={toastData.message}
          variant={toastData.variant}
          onClose={() => setToastData(null)}
        />
      )}
      <div>
        {/* This wrapper dynamically adjusts based on screen size */}
        <button
          className="btn btn-outline-primary d-none d-sm-flex justify-content-center align-items-center gap-2"
          onClick={handleShow}
        >
          <FaFolderPlus size={25} />
          <span className="fw-bold">Create</span>
        </button>
        {/* This is only shown in mobile view */}
        <FaFolderPlus
          size={40}
          className="text-primary d-flex d-sm-none"
          onClick={handleShow}
          style={{ cursor: "pointer" }}
        />
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Folder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            ref={folderNameElement}
            className="form-control"
            placeholder="Enter Folder Name"
            disabled={isFetching}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isFetching}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={createFolder}
            disabled={isFetching}
          >
            {!isFetching ? "Create" : "Creating..."}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddFolder;
