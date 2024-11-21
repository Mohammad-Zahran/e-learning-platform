import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; 

const StreamPage = () => {
  const { courseId } = useParams(); 
  const [streamContent, setStreamContent] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStreamContent = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authorization token is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost/e-learning/server/getStreamContent.php?course_id=${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStreamContent(response.data.data);
      } catch (err) {
        setError("Failed to fetch stream content.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchStreamContent();
    }
  }, [courseId]);

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authorization token is missing");
      return;
    }

    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/e-learning/server/postAnnouncement.php",
        {
          course_id: courseId,
          title: title,
          content: content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        alert("Announcement posted successfully.");
        setTitle("");
        setContent("");
        setStreamContent((prevState) => [
          ...prevState,
          {
            type: "announcement",
            title: title,
            content: content,
            created_at: new Date().toLocaleString(),
          },
        ]);
      }
    } catch (err) {
      alert("Failed to post the announcement.");
    }
  };

  return (
    <div className="stream-page">
      <h1>Stream for Course {courseId}</h1>

      <div className="post-announcement">
        <h3>Post a new announcement</h3>
        <form onSubmit={handlePostAnnouncement}>
          <div>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit">Post Announcement</button>
        </form>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="stream-content">
          {streamContent.map((item, index) => (
            <div key={index} className={`stream-item ${item.type}`}>
              <h4>{item.title}</h4>
              <p>{item.content}</p>
              <small>{new Date(item.created_at).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StreamPage;
