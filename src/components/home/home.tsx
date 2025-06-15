import { useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { useUserProfile, usePosts } from "../functions/logics";
import { useMyContext } from "../functions/logics";

function HomePage() {
  const { updateUsername } = useMyContext();
  const { profile, loadingProfile, profileError } = useUserProfile();
  const { posts, loadingPosts, postsError } = usePosts();

  const IMAGE_BASE_URL = "http://localhost:3060";

  const getImageUrl = (fileUrl: string | undefined) => {
    if (!fileUrl) {
      return "https://placehold.co/100x100/A0A0A0/FFFFFF?text=No+Image";
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
          {profile ? (
            <>
              <img
                src={getImageUrl(profile.picture?.fileUrl)}
                alt="User Avatar"
                className="home-profile-avatar"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/100x100/A0A0A0/FFFFFF?text=User";
                }}
              />
              <h2 className="home-profile-name">
                {profile.firstname} {profile.lastname}
              </h2>
              <p className="home-profile-username">@{profile.username}</p>
              <p className="home-profile-email">Email: {profile.email}</p>
              <p className="home-profile-gender">Gender: {profile.gender}</p>
            </>
          ) : (
            !loadingProfile &&
            !profileError && (
              <p className="home-no-content">
                No profile data available. Please log in.
              </p>
            )
          )}
        </div>
      </aside>
      <section className="home-content-area">
        <div className="home-posts-feed">
          <h2 className="home-section-title">Recent Posts</h2>
          {loadingPosts && <p>Loading posts...</p>}
          {postsError && (
            <p className="home-error-message">
              Error loading posts: {postsError}
            </p>
          )}
          {posts && posts.length > 0
            ? posts.map((post: any) => (
                <div key={post._id} className="home-post-card">
                  <div className="home-post-header">
                    <div className="home-post-header-author">
                      <img
                        src={getImageUrl(post.image)}
                        alt="Author Avatar"
                        className="home-post-avatar"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/50x50/A0A0A0/FFFFFF?text=A";
                        }}
                      />
                      <span className="home-post-author">{post.author}</span>
                    </div>
                    <div className="home-post-header-actions">
                      <FaHeart className="home-post-like-icon" />
                      <span className="home-post-likes">{post.likes}</span>
                    </div>
                  </div>
                  <p className="home-post-content">{post.content}</p>
                  {post.image && (
                    <img
                      src={getImageUrl(post.image)}
                      alt="Post Image"
                      className="home-post-image"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/600x400/E0E0E0/000000?text=Image+Error";
                      }}
                    />
                  )}
                </div>
              ))
            : !loadingPosts &&
              !postsError && (
                <p className="home-no-content">No posts available.</p>
              )}
        </div>
      </section>
    </main>
  );
}

export default HomePage;
