import { useEffect, useReducer, useState } from "react";

export const ROOT_FOLDER = {
  folderName: "Root",
  folderId: null,
  path: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SELECT_FOLDER":
      return {
        folderId: action.payload.folderId,
        folder: action.payload.folder,
        childFolders: [],
        childFiles: [],
      };
    case "UPDATE_FOLDER":
      return {
        ...state,
        folder: action.payload.folder,
      };
    case "SET_CHILD_FOLDERS":
      return {
        ...state,
        childFolders: action.payload.childFolders,
      };
    case "SET_CHILD_FILES":
      return {
        ...state,
        childFiles: action.payload.childFiles,
      };
    default:
      return state;
  }
}

function useFolder(folderId = null, folder = null) {
  const [state, dispatch] = useReducer(reducer, {
    folderId,
    folder, // folderObj itself
    childFolders: [],
    childFiles: [],
  });

  // state to track folder or file fetching or not
  const [isFetching, isSetFetching] = useState(false);

  // add new folder to the local state
  const addChildFolder = (newFolder) => {
    dispatch({
      type: "SET_CHILD_FOLDERS",
      payload: { childFolders: [...state.childFolders, newFolder] },
    });
  };

  // add new file to the local state
  const addChildFile = (newFile) => {
    dispatch({
      type: "SET_CHILD_FILES",
      payload: { childFiles: [...state.childFiles, newFile] },
    });
  };

  // rename particular folder of the local state
  const renameFolder = (renamedFolder) => {
    const folderIndex = state.childFolders.findIndex(
      (folder) => folder._id === renamedFolder._id
    );
    if (folderIndex !== -1) {
      const updatedFolders = [...state.childFolders];
      updatedFolders[folderIndex] = renamedFolder;
      dispatch({
        type: "SET_CHILD_FOLDERS",
        payload: { childFolders: updatedFolders },
      });
    }
  };

  // rename particular file of the local state
  const renameFile = (renamedFile) => {
    const fileIndex = state.childFiles.findIndex(
      (file) => file._id === renamedFile._id
    );
    if (fileIndex !== -1) {
      const updatedFiles = [...state.childFiles];
      updatedFiles[fileIndex] = renamedFile;
      dispatch({
        type: "SET_CHILD_FILES",
        payload: { childFiles: updatedFiles },
      });
    }
  };

  // delete particular folder from the local state
  const deleteChildFolder = (folderId) => {
    dispatch({
      type: "SET_CHILD_FOLDERS",
      payload: {
        childFolders: [
          ...state.childFolders.filter((folder) => folder._id !== folderId),
        ],
      },
    });
  };

  // delete particular file from the local state
  const deleteChildFile = (fileId) => {
    dispatch({
      type: "SET_CHILD_FILES",
      payload: {
        childFiles: [...state.childFiles.filter((file) => file._id !== fileId)],
      },
    });
  };

  // select folder
  useEffect(() => {
    dispatch({
      type: "SELECT_FOLDER",
      payload: {
        folderId,
        folder,
      },
    });
  }, [folderId, folder]);

  // update folder, for bredcumbs info
  useEffect(() => {
    if (folderId === null) {
      return dispatch({
        type: "UPDATE_FOLDER",
        payload: {
          folder: ROOT_FOLDER,
        },
      });
    }
    (async function () {
      try {
        const res = await fetch(`/api/folders/${folderId}`, {
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        dispatch({
          type: "UPDATE_FOLDER",
          payload: { folder: data.folder },
        });
      } catch (error) {
        // if folderId does't exist then dispatch root folder
        dispatch({
          type: "UPDATE_FOLDER",
          payload: { folder: ROOT_FOLDER },
        });
        console.error("Error while fetching folder by id: ", error.message);
      }
    })();
  }, [folderId]);

  // populate child folder whose parentId is same
  useEffect(() => {
    (async function fetchChildFolders() {
      try {
        isSetFetching(true);
        const res = await fetch(`/api/folders?parentId=${folderId}`);
        isSetFetching(false);
        const data = await res.json();
        dispatch({
          type: "SET_CHILD_FOLDERS",
          payload: { childFolders: data.folders },
        });
      } catch (error) {
        console.error("Error while fetching child folders: ", error);
      }
    })();
  }, [folderId]);

  // populate child file whose parentId is same
  useEffect(() => {
    (async function fetchChildFiles() {
      try {
        isSetFetching(true);
        const res = await fetch(`/api/files/${folderId}`);
        isSetFetching(false);
        const data = await res.json();
        dispatch({
          type: "SET_CHILD_FILES",
          payload: { childFiles: data.files },
        });
      } catch (error) {
        console.error("Error while fetching child files: ", error);
      }
    })();
  }, [folderId]);
  return {
    folder: state.folder,
    childFolders: state.childFolders,
    childFiles: state.childFiles,
    addChildFolder,
    addChildFile,
    renameFolder,
    renameFile,
    deleteChildFolder,
    deleteChildFile,
    isFetching,
  };
}

export default useFolder;
