import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaListUl } from "react-icons/fa";
import { TbLayoutGridFilled } from "react-icons/tb";
import useFolder from "../hooks/useFolder";
import AddFolder from "../components/AddFolder";
import FolderView from "../components/FolderView";
import FolderBreadcrumbs from "../components/FolderBreadcrumbs";
import UploadFile from "../components/UploadFile";
import FileView from "../components/FileView";
import LoadingSpinner from "../components/LoadingSpinner";
import Nofile from "../components/NoFile";
import PopupMessage from "../components/PopupMessage";

function Home() {
  const { folderId } = useParams();
  const {
    folder,
    childFolders,
    childFiles,
    addChildFolder,
    addChildFile,
    renameFolder,
    renameFile,
    deleteChildFolder,
    deleteChildFile,
    isFetching,
  } = useFolder(folderId);

  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem("viewMode") || "list"
  );

  // save viewMode to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  return (
    <main className="container">
      <PopupMessage />
      <div className="d-flex align-items-center pt-2 gap-3">
        <FolderBreadcrumbs currentFolder={folder} />
        <AddFolder currentFolder={folder} addChildFolder={addChildFolder} />
        <UploadFile currentFolder={folder} addChildFile={addChildFile} />
      </div>
      <div className="d-flex justify-content-end gap-2 mt-2">
        <button
          className={`btn ${viewMode == "list" ? "btn-primary" : "btn-light"}`}
          onClick={() => setViewMode("list")}
        >
          <FaListUl size={25} />
        </button>
        <button
          className={`btn ${viewMode == "grid" ? "btn-primary" : "btn-light"}`}
          onClick={() => setViewMode("grid")}
        >
          <TbLayoutGridFilled size={25} />
        </button>
      </div>
      <div className="w-100" style={{ minHeight: "30rem" }}>
        {isFetching ? (
          <LoadingSpinner size="5rem" />
        ) : (
          <>
            <FolderView
              childFolders={childFolders || []}
              renameFolder={renameFolder}
              deleteChildFolder={deleteChildFolder}
              viewMode={viewMode}
            />
            <FileView
              childFolders={childFolders || []}
              childFiles={childFiles || []}
              renameFile={renameFile}
              deleteChildFile={deleteChildFile}
              viewMode={viewMode}
            />
          </>
        )}
        {childFiles.length === 0 && childFolders.length === 0 && <Nofile />}
      </div>
    </main>
  );
}

export default Home;
