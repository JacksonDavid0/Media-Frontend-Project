import { useUserProfile } from "../functions/logics";
import { FaHeart } from "react-icons/fa";
import { useMyContext } from "../functions/logics";
import { useEffect } from "react";

function HomePage() {
  const { updateUsername } = useMyContext();
  const { profile, loadingProfile, profileError } = useUserProfile();

  const posts = [
    {
      id: 1,
      author: "Jane Doe",
      content: "Enjoying a beautiful day out in nature! #nature #outdoors",
      image: "https://placehold.co/600x400/ADD8E6/000000?text=Nature+View",
      // image: "",
      likes: 120,
      comments: 15,
    },
    {
      id: 2,
      author: "John Smith",
      content:
        "Just finished a new coding project. Check it out! #coding #webdev",
      image: "https://placehold.co/600x400/FFD700/000000?text=Code+Project",
      // image: "",
      likes: 85,
      comments: 8,
    },
    {
      id: 3,
      author: "Alice Johnson",
      content: "Delicious homemade pasta tonight! 🍝 #cooking #foodie",
      image: "https://placehold.co/600x400/90EE90/000000?text=Homemade+Pasta",
      // image: "",
      likes: 200,
      comments: 30,
    },
  ];

  // const IMAGE_BASE_URL = "https://media-project-production.up.railway.app";
  const IMAGE_BASE_URL = "http://localhost:3060";

  const getProfileImageUrl = (fileUrl: string | undefined) => {
    if (!fileUrl) {
      return "https://placehold.co/100x100/A0A0A0/FFFFFF?text=User";
    }
    try {
      const url = new URL(fileUrl, IMAGE_BASE_URL);
      return url.toString();
    } catch (e) {
      console.error("Invalid image URL construction:", e);
      return "https://placehold.co/100x100/FF0000/FFFFFF?text=Error";
    }
  };

  useEffect(() => {
    if (profile?.username) {
      updateUsername(profile.username);
    }
  }, [profile?.username, updateUsername]);

  return (
    <main className="home-main-content">
      <aside className="home-profile-sidebar">
        <div className="home-profile-card">
          {loadingProfile && <p>Loading profile...</p>}
          {profileError && (
            <p className="home-error-message">
              Error loading profile: {profileError}
            </p>
          )}
          {profile && (
            <>
              <img
                src={getProfileImageUrl(profile.picture?.fileUrl)}
                alt="User Avatar"
                className="home-profile-avatar"
                // onError={(e) => {
                //   e.currentTarget.src = "";
                // }}
              />
              <h2 className="home-profile-name">
                {profile.firstname} {profile.lastname}
              </h2>
              <p className="home-profile-username">@{profile.username}</p>
              <p className="home-profile-email">Email: {profile.email}</p>
              <p className="home-profile-gender">Gender: {profile.gender}</p>
            </>
          )}
          {!profile && !loadingProfile && !profileError && (
            <p className="home-no-content">
              No profile data available. Please log in.
            </p>
          )}
        </div>
      </aside>

      <section className="home-content-area">
        <div className="home-posts-feed">
          <h2 className="home-section-title">Recent Posts</h2>
          {posts.map((post) => (
            <div key={post.id} className="home-post-card">
              <div className="home-post-header">
                <div className="home-post-header-author">
                  <img
                    src="https://placehold.co/50x50/A0A0A0/FFFFFF?text=A"
                    alt="Author Avatar"
                    className="home-post-avatar"
                  />
                  <span className="home-post-author">{post.author}</span>
                </div>

                <div className="home-post-header-actions">
                  <FaHeart className="home-post-avatar" />
                  <span className="home-post-likes">{post.likes}</span>
                </div>
              </div>
              <p className="home-post-content">{post.content}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="Post Image"
                  className="home-post-image"
                  onError={(e) => {
                    e.currentTarget.src = "";
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default HomePage;
