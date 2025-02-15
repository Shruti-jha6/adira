
// import React, { useEffect, useState, useCallback } from 'react';
// import Navbar from '../../components/Navbar/Navbar';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from "../../utils/axiosInstance";
// import "../../../src/blog.css";

// const Blog = () => {
//   const [userInfo, setUserInfo] = useState(null);
//   const navigate = useNavigate();
//   const [articles, setArticles] = useState([]);

//   const getUserInfo = useCallback(async () => {
//     try {
//       const response = await axiosInstance.get("/get-user");
//       if (response.data && response.data.user) {
//         setUserInfo(response.data.user);
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         localStorage.clear();
//         navigate("/login");
//       }
//     }
//   }, [navigate]);  // ✅ Adding 'navigate' as a dependency to avoid stale state

//   useEffect(() => {
//     getUserInfo();
//   }, [getUserInfo]);  // ✅ Now 'getUserInfo' is safely included in the dependency array

//   useEffect(() => {
//     fetch("/articles.json")
//       .then((response) => response.json())
//       .then((data) => setArticles(data));
//   }, []);

//   const truncateDescription = (desc, length = 100) => {
//     return desc.length > length ? desc.substring(0, length) + "..." : desc;
//   };

//   return (
//     <>
//       <Navbar userInfo={userInfo} />
//       <div className="blog-container">
//         <h1>Women's Health</h1>
//         <div className="articles-grid">
//           {articles.map((article, index) => (
//             <div key={index} className="article-card">
//               <img src={article.image} alt={article.title} />
//               <h2>{truncateDescription(article.title, 50)}</h2>
//               <p>{truncateDescription(article.description, 120)}</p>
//               <a href={article.link} target="_blank" rel="noopener noreferrer">
//                 Read More
//               </a>
//             </div>
//           ))}
//         </div>
//         <div className="see-all-btn-container">
//           <button 
//             className="see-all-btn"
//             onClick={() => navigate("/all-articles")}  
//           >
//             View All
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Blog;
import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../utils/axiosInstance";
import "../../../src/blog.css";

const Blog = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user info
  const getUserInfo = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data?.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  }, [navigate]);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  // Fetch articles with error handling
  useEffect(() => {
    const controller = new AbortController();
    const fetchArticles = async () => {
      try {
        const response = await fetch("/articles.json", { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching articles:", error);
          setError("Failed to load articles. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
    return () => controller.abort();
  }, []);

  // Truncate description
  const truncateDescription = (desc, length = 100) => (
    desc.length > length ? desc.substring(0, length) + "..." : desc
  );

  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="blog-container">
        <h1>Women's Health</h1>

        {loading ? (
          <p>Loading articles...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="articles-grid">
            {articles.map((article, index) => (
              <div key={index} className="article-card">
                <img src={article.image} alt={article.title} />
                <h2>{truncateDescription(article.title, 50)}</h2>
                <p>{truncateDescription(article.description, 120)}</p>
                <a href={article.link} target="_blank" rel="noopener noreferrer">
                  Read More
                </a>
              </div>
            ))}
          </div>
        )}

        <div className="see-all-btn-container">
          <button className="see-all-btn" onClick={() => navigate("/all-articles")}>
            View All
          </button>
        </div>
      </div>
    </>
  );
};

export default Blog;

