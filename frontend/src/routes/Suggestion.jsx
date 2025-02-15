import { useEffect, useRef, useState } from "react";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import NotificationToast from "../components/NotificationToast";
import LoadingSpinner from "../components/LoadingSpinner";
import styles from "../css/Suggestion.module.css";
import { BACKEND_URL } from "../config";

function Suggestion() {
  const nameRef = useRef();
  const phoneNoRef = useRef();
  const descriptionRef = useRef();
  const [suggestions, setSuggestion] = useState([]);
  const [likedSuggestions, setLikedSuggestions] = useState(new Set());
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastData, setToastdata] = useState(null);

  // taost message
  const showToast = (message, variant) => {
    setToastdata({ message, variant });
  };

  // Fetch the suggestion
  useEffect(() => {
    (async function fetchSuggestions() {
      try {
        setIsFetching(true);
        const res = await fetch(`${BACKEND_URL}/suggestions`);
        setIsFetching(false);
        const data = await res.json();
        setSuggestion(data.suggestions);

        // Track which suggestions the visitor has liked
        const visitorId = localStorage.getItem("visitorId");
        const likedSet = new Set(
          data.suggestions
            .filter((s) => s.likes.includes(visitorId))
            .map((s) => s._id)
        );
        setLikedSuggestions(likedSet);
      } catch (error) {
        console.error("Error while fetching suggestions", error);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const phoneNo = phoneNoRef.current.value;
    const description = descriptionRef.current.value;

    try {
      setIsSubmitting(true);
      const res = await fetch(`${BACKEND_URL}suggestions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phoneNo, description }),
      });
      setIsSubmitting(false);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Suggestion submit request failed");
      }
      showToast(data.message, "success");
      const suggestion = data.suggestion;
      setSuggestion((prev) => [{ ...suggestion }, ...prev]);
      nameRef.current.value = "";
      phoneNoRef.current.value = "";
      descriptionRef.current.value = "";
    } catch (error) {
      showToast(error.message, "danger");
      console.error("Fetch error: \n", error);
    }
  };

  const handleLike = async (suggestionId) => {
    try {
      const visitorId = localStorage.getItem("visitorId");
      const res = await fetch(`${BACKEND_URL}suggestions/add-like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestionId, visitorId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Like request failed");
      }
      showToast(data.message, "success");
      setLikedSuggestions((prev) => new Set([...prev, suggestionId]));

      // Update likes count in UI
      setSuggestion((prev) =>
        prev.map((s) =>
          s._id === suggestionId ? { ...s, likes: [...s.likes, visitorId] } : s
        )
      );
    } catch (error) {
      showToast(error.message, "danger");
      console.error("Fetch error: \n", error);
    }
  };

  const handleDislike = async (suggestionId) => {
    const visitorId = localStorage.getItem("visitorId");
    try {
      const res = await fetch(`${BACKEND_URL}suggestions/remove-like`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestionId, visitorId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Remove like request failed");
      }
      showToast(data.message, "success");
      // Remove the suggestion ID from likedSuggestions state
      setLikedSuggestions((prev) => {
        const updatedLikes = new Set(prev);
        updatedLikes.delete(suggestionId);
        return updatedLikes;
      });
      // Update likes count in UI
      setSuggestion((prev) =>
        prev.map((s) =>
          s._id === suggestionId
            ? { ...s, likes: s.likes.filter((id) => id !== visitorId) }
            : s
        )
      );
    } catch (error) {
      showToast(error.message, "danger");
      console.error("Fetch error: \n", error);
    }
  };

  return (
    <div>
      {toastData && (
        <NotificationToast
          message={toastData.message}
          variant={toastData.variant}
          onClose={() => setToastdata(null)}
        />
      )}
      <div className={`${styles.wrpaper} container mt-5`}>
        {isFetching ? (
          <LoadingSpinner className="text-center" size="5rem" />
        ) : (
          <div className="row justify-content-center align-items-center">
            {/* Suggestion List */}
            <div className="col-md-6">
              <div
                className={`card shadow-lg border-0 rounded-4 ${styles.suggestionList}`}
              >
                <div className="card-body">
                  <h2 className="text-center text-primary fw-bold">
                    User Suggestions
                  </h2>
                  <ul className="list-group mt-3">
                    {suggestions.length > 0 ? (
                      suggestions.map((suggestion) => (
                        <div
                          key={suggestion._id}
                          className="d-flex shadow-sm rounded-3 gap-1 p-2 my-2"
                        >
                          <li className="list-group-item w-100">
                            <div className="d-flex justify-content-between align-items-center">
                              <strong className="d-flex justify-content-center align-items-center text-dark gap-2">
                                <FaUser />
                                {suggestion.name}
                              </strong>
                              <small className="d-flex justify-content-center align-items-center text-muted gap-2">
                                <FaRegCalendarAlt />
                                {new Intl.DateTimeFormat("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "2-digit",
                                }).format(new Date(suggestion.createdAt))}
                              </small>
                            </div>
                            <p>{suggestion.description}</p>
                            <div className="d-flex justify-content-start align-items-center">
                              <button className="btn align-self-start p-0">
                                {likedSuggestions.has(suggestion._id) ? (
                                  <BiSolidLike
                                    className="text-danger"
                                    onClick={() =>
                                      handleDislike(suggestion._id)
                                    }
                                  />
                                ) : (
                                  <BiLike
                                    onClick={() => handleLike(suggestion._id)}
                                  />
                                )}
                              </button>
                              <p className="p-0 m-0">
                                {suggestion.likes.length}
                              </p>
                            </div>
                          </li>
                        </div>
                      ))
                    ) : (
                      <li className="list-group-item text-muted text-center">
                        No suggestions yet
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Suggestion Form */}
            <div className="col-md-6">
              <div
                className={`card shadow-lg border-0 rounded-4 ${styles.suggestionForm}`}
              >
                <div className="card-body">
                  <div className="text-center mb-4">
                    <h1 className="fw-bold text-primary">Suggestion Box</h1>
                    <small className="text-muted">
                      Give us some suggestion to improve the app
                    </small>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-primary">
                        Name
                      </label>
                      <input
                        ref={nameRef}
                        type="text"
                        className="form-control shadow-sm"
                        placeholder="Enter Your Name"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-primary">
                        Phone No
                      </label>
                      <input
                        ref={phoneNoRef}
                        type="number"
                        className="form-control shadow-sm"
                        placeholder="Enter Your Phone No"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-primary">
                        Description
                      </label>
                      <textarea
                        ref={descriptionRef}
                        className="form-control shadow-sm"
                        rows="5"
                        placeholder="Write your suggestion here..."
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-100 fw-bold py-2 rounded-pill shadow-sm"
                    >
                      {!isSubmitting ? "Submit" : "Submitting..."}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Suggestion;
