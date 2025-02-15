import Breadcrumb from "react-bootstrap/Breadcrumb";
import { ROOT_FOLDER } from "../hooks/useFolder";
import { Link } from "react-router-dom";
import { ImHome } from "react-icons/im";

function FolderBreadcrumbs({ currentFolder }) {
  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER]; // traversal will start from root, root is't in DB, we have to put in code manually
  if (currentFolder?.path) {
    path = [...path, ...currentFolder.path]; // if currentFolder have path then it will add the curr folder path
  }

  return (
    <Breadcrumb className="flex-grow-1">
      {path.map((folder, index) => (
        <Breadcrumb.Item
          key={folder.folderId || index}
          linkAs={Link}
          linkProps={{
            to: folder.folderId ? `/home/folders/${folder.folderId}` : "/home",
          }}
          className="text-truncate d-flex justify-content-center align-items-end"
        >
          {folder === ROOT_FOLDER ? (
            <ImHome size={23} color="red" />
          ) : (
            folder.folderName
          )}
        </Breadcrumb.Item>
      ))}

      {/* Shwoing the currentFolder name, default Home icon */}
      {currentFolder && (
        <Breadcrumb.Item className="text-truncate" active>
          {currentFolder === ROOT_FOLDER ? (
            <ImHome size={23} color="red" />
          ) : (
            currentFolder.folderName
          )}
        </Breadcrumb.Item>
      )}
    </Breadcrumb>
  );
}

export default FolderBreadcrumbs;
