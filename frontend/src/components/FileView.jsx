import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEllipsisV } from "react-icons/fa";
import { MdDriveFileRenameOutline, MdPictureAsPdf } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsFileEarmarkWordFill, BsFiletypeTxt } from "react-icons/bs";
import { SiGoogledocs, SiJpeg } from "react-icons/si";
import { BiSolidFileDoc, BiSolidFilePng } from "react-icons/bi";
import NotificationToast from "./NotificationToast";
import { BACKEND_URL } from "../config";
import styles from "../css/FileView.module.css";

function FileView({ childFiles, renameFile, deleteChildFile, viewMode }) {
  const [menuVisible, setMenuVisible] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const menuRef = useRef(null);
  const [toastData, setToastData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  // toast notification
  const showToast = (message, variant) => {
    setToastData({ message, variant });
  };

  // 3 dot button
  const toggleMenu = (fileId) => {
    setMenuVisible((prev) => (prev === fileId ? null : fileId));
  };

  // handle rename-toogle button click
  const handleRenameClick = (file) => {
    setCurrentFile(file);
    setNewFileName(file.fileName);
    setMenuVisible(null); // Close the menu
    setShowRenameModal(true);
  };

  // handle delete-toggle button click
  const handleDeleteClick = (file) => {
    setCurrentFile(file);
    setMenuVisible(null); // Close the menu
    setShowDeleteModal(true);
  };

  // when rename button click
  const handleRenameSubmit = async () => {
    if (!newFileName.trim()) {
      return showToast("File name can't be empty", "danger");
    }
    if (newFileName.trim() === currentFile.fileName) {
      return showToast("Previuos and new file's name is same", "warning");
    }

    try {
      setIsFetching(true);
      const res = await fetch(
        `${BACKEND_URL}/files/rename/${currentFile._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newFileName: newFileName.trim() }),
        }
      );
      setIsFetching(false);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Rename request failed");
      }
      const file = data.file;
      renameFile({ ...file });
      showToast(data.message, "success");
    } catch (error) {
      console.error("Fetch error: \n", error);
      showToast(error.message, "danger");
    } finally {
      setIsFetching(false);
      setShowRenameModal(false);
    }
  };

  // when delete button click
  const handleDeleteSubmit = async () => {
    try {
      setIsFetching(true);
      const res = await fetch(
        `${BACKEND_URL}/files/delete/${currentFile._id}`,
        {
          method: "DELETE",
        }
      );
      setIsFetching(false);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Delete file request failed", "danger");
      }
      deleteChildFile(currentFile._id);
      showToast(data.message, "success");
    } catch (error) {
      showToast(error.message, "danger");
      console.error("Fetch Error: \n", error);
    } finally {
      setIsFetching(false);
      setShowDeleteModal(false);
    }
  };

  // close the menu open clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuVisible(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // file icon according to file type [mime type]
  const getFileIcon = (fileType) => {
    const size = viewMode === "list" ? 50 : 100;
    const icons = {
      "application/pdf": <MdPictureAsPdf size={size} className="text-danger" />,
      "application/msword": (
        <BiSolidFileDoc size={size} className="text-primary" />
      ),
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        <BsFileEarmarkWordFill size={size} style={{ color: "#4285F4" }} />,
      "image/png": <BiSolidFilePng size={size} />,
      "image/jpeg": <SiJpeg size={size} />,
      "text/palin": <BsFiletypeTxt size={size} />,
      unknown: <SiGoogledocs size={size} className="text-secondary" />,
    };
    return icons[fileType] || icons["unknown"];
  };

  if (childFiles.length === 0) {
    return null;
  }

  return (
    <div>
      {toastData && (
        <NotificationToast
          message={toastData.message}
          variant={toastData.variant}
          onClose={() => {
            setToastData(null);
          }}
        />
      )}
      <div className="d-flex flex-wrap justify-content-start mt-3 p-2">
        {viewMode === "list" && childFiles.length > 0 && (
          <div className="d-flex justify-content-between w-100 m-2">
            <p style={{ marginLeft: "20px" }}>File name</p>
            <p style={{ marginRight: "40px" }}>File size</p>
          </div>
        )}
        {childFiles.map((file) => (
          <div
            key={file._id}
            className={`m-2 position-relative rounded-3 ${
              styles.fileContainer
            } ${viewMode === "list" ? styles.listView : styles.gridView}`}
          >
            <Link
              to={file.url}
              className={`d-flex align-items-center text-decoration-none text-dark h-100 ${
                viewMode === "list"
                  ? "ps-3"
                  : "flex-column justify-content-around"
              }`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open file ${file.fileName}`}
            >
              {viewMode == "list" ? (
                <>
                  {getFileIcon(file.fileType)}
                  <span
                    className={`fw-bold text-truncate ps-1 ${styles.fileName}`}
                    title={file.fileName}
                  >
                    {file.fileName}
                  </span>
                  <small
                    className="text-muted text-center pe-3"
                    style={{ fontSize: "1rem" }}
                  >
                    {file.size
                      ? file.size / 1024 < 1024
                        ? `${(file.size / 1024).toFixed(2)} KB`
                        : `${(file.size / 1024 / 1024).toFixed(2)} MB`
                      : "Unknown Size"}
                  </small>
                </>
              ) : (
                <>
                  <span
                    className={`fw-bold ${styles.fileName} ${styles.truncateTwoLines}`}
                    title={file.fileName}
                  >
                    {file.fileName}
                  </span>
                  {getFileIcon(file.fileType)}
                  <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                    {file.size
                      ? file.size / 1024 < 1024
                        ? `${(file.size / 1024).toFixed(2)} KB`
                        : `${(file.size / 1024 / 1024).toFixed(2)} MB`
                      : "Unknown Size"}
                  </small>
                </>
              )}
            </Link>

            {/* Three-dot button */}
            <button
              className={`btn btn-light position-absolute bg-transparent border-0 ${
                viewMode === "list"
                  ? styles.listOptionsButton
                  : styles.gridOptionsButton
              }`}
              onClick={() => toggleMenu(file._id)}
              aria-label="Option Menu"
            >
              <FaEllipsisV />
            </button>

            {/* Options menu */}
            {menuVisible === file._id && (
              <div className={`${styles.menuContainer}`} ref={menuRef}>
                <button
                  className="btn btn-light w-100"
                  onClick={() => handleRenameClick(file)}
                >
                  <MdDriveFileRenameOutline /> Rename
                </button>
                <button
                  className="btn btn-light w-100 text-danger"
                  onClick={() => handleDeleteClick(file)}
                >
                  <RiDeleteBin6Line /> Delete
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Rename Modal */}
        <Modal show={showRenameModal} onHide={() => setShowRenameModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Rename File</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>New File Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="Enter New File Name"
                  disabled={isFetching}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowRenameModal(false)}
              disabled={isFetching}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleRenameSubmit}
              disabled={isFetching}
            >
              {isFetching ? "Renaming..." : "Rename"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete the file{" "}
            <strong>{currentFile?.fileName}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={isFetching}
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              onClick={handleDeleteSubmit}
              disabled={isFetching}
            >
              {!isFetching ? "Delete" : "Deleting..."}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default FileView;
