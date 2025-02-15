import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { FcFolder } from "react-icons/fc";
import { SlOptionsVertical } from "react-icons/sl";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import NotificationToast from "../components/NotificationToast";
import styles from "../css/FolderView.module.css";

function FolderView({
  childFolders,
  renameFolder,
  deleteChildFolder,
  viewMode,
}) {
  const [menuVisible, setMenuVisible] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const menuRef = useRef();
  const [isFetching, setIsFetching] = useState(false);
  const [toastData, setToastData] = useState(null);

  // toast messgae
  const showToast = (message, variant) => {
    setToastData({ message, variant });
  };

  // toggle menu bar
  const toggleMenu = (folderId) => {
    setMenuVisible((prev) => (prev === folderId ? null : folderId));
  };

  // when toogle-rename button will be click
  const handleRenameClick = (folder) => {
    setCurrentFolder(folder);
    setNewFolderName(folder.folderName);
    setMenuVisible(null);
    setShowRenameModal(true);
  };

  // when toggle-delete button will be click
  const handleDeleteClick = (folder) => {
    setCurrentFolder(folder);
    setMenuVisible(null);
    setShowDeleteModal(true);
  };

  // when rename button button be click
  const handleRenameSubmit = async () => {
    if (!newFolderName.trim()) {
      return alert("Folder name can not be empty");
    }
    if (newFolderName.trim() === currentFolder.folderName) {
      return alert("Folder name is unchanged");
    }
    try {
      setIsFetching(true);
      const res = await fetch(`/api/folders/rename/${currentFolder._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newFolderName: newFolderName.trim() }),
      });
      setIsFetching(false);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Rename folder requset failed",
          "danger"
        );
      }
      const folder = data.folder;
      renameFolder({ ...folder });
      showToast(data.message, "success");
    } catch (error) {
      showToast(error.message, "danger");
      console.error("Fetch error: \n", error);
    } finally {
      setIsFetching(false);
      setShowRenameModal(false);
    }
  };

  // when delete button will be click
  const handleDeleteSubmit = async () => {
    try {
      setIsFetching(true);
      const res = await fetch(`/api/folders/delete/${currentFolder._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setIsFetching(false);
      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Delete folder request failed",
          "danger"
        );
      }
      deleteChildFolder(currentFolder._id);
      showToast(data.message, "success");
    } catch (error) {
      showToast(error.message, "danger");
      console.error("Fetch Error: \n", error);
    } finally {
      setIsFetching(false);
      setShowDeleteModal(false);
    }
  };

  // closing menu when clicking outside
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

  if (!childFolders || childFolders.length == 0) {
    return null;
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
      <div className="d-flex flex-wrap p-2">
        {childFolders.map((folder) => (
          <div
            key={folder._id}
            className={`m-2 position-relative rounded-3 ${
              styles.folderContainer
            } ${viewMode === "list" ? styles.listViewDiv : styles.gridViewDiv}`}
          >
            <Link
              to={`/home/folders/${folder._id}`}
              className={`d-flex justify-content-center align-items-center text-decoration-none text-truncate w-200 ${
                viewMode === "grid" ? "flex-column" : "ps-3"
              }`}
              aria-label={`Open folder ${folder.folderName}`}
            >
              {viewMode === "list" ? (
                <>
                  <FcFolder size={50} />
                  <span
                    className={`fw-bold text-dark ps-1 w-100 ${styles.listViewFileName}`}
                    title={folder.folderName}
                  >
                    {folder.folderName}
                  </span>
                </>
              ) : (
                <>
                  <span
                    className={`fw-bold text-dark ${styles.gridViewFileName}`}
                    title={folder.folderName}
                  >
                    {folder.folderName}
                  </span>
                  <FcFolder size={100} />
                </>
              )}
            </Link>

            {/* Three-dot button */}
            <button
              className={`btn btn-light position-absolute bg-transparent border-0 ${
                styles.customRight4px
              } ${viewMode === "list" ? styles.customTop6px : ""}`}
              onClick={() => toggleMenu(folder._id)}
              aria-label="Option Menu"
            >
              <SlOptionsVertical />
            </button>

            {/* 3-dot menu open/close logic */}
            {menuVisible === folder._id && (
              <div
                ref={menuRef}
                className={`position-absolute bg-white rounded-2 ${styles.menuContainer}`}
              >
                <button
                  className="btn btn-light w-100"
                  onClick={() => handleRenameClick(folder)}
                >
                  <MdDriveFileRenameOutline /> Rename
                </button>
                <button
                  className="btn btn-light text-danger w-100"
                  onClick={() => handleDeleteClick(folder)}
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
            <Modal.Title>Rename Folder</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>New Folder Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter New Folder Name"
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
              {!isFetching ? "Rename" : "Renaming..."}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure want to delete the folder{" "}
            <strong>{currentFolder?.folderName}</strong>?
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

export default FolderView;
