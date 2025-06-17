import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import {
  useUserProfile,
  usePosts,
  usePostLikeDislike,
} from "../functions/logics";
import { useMyContext } from "../functions/logics";

function HomePage() {
  const { updateUsername } = useMyContext();
  const { profile, loadingProfile, profileError } = useUserProfile();
  const { posts, loadingPosts, postsError, refetchPosts } = usePosts();

  const [likedPostIds, setLikedPostIds] = useState(new Set());

  const { likePost, dislikePost } = usePostLikeDislike(refetchPosts);

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

  useEffect(() => {
    if (posts) {
      console.log("Fetched Posts Data:", posts);
      if (posts.length > 0) {
        console.log("First Post Structure:", posts[0]);
      }
    }
  }, [posts]);

  const handleLikeDislike = async (postId: any, currentLikes: any) => {
    const isCurrentlyLiked = likedPostIds.has(postId);
    const prevLikedPostIds = new Set(likedPostIds);

    let tempPosts = posts ? [...posts] : [];
    const postIndex = tempPosts.findIndex((p) => p._id === postId);

    if (isCurrentlyLiked) {
      setLikedPostIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
      if (postIndex !== -1) {
        tempPosts[postIndex] = {
          ...tempPosts[postIndex],
          likes: currentLikes - 1,
        };
      }
      const result = await dislikePost(postId);
      if (!result.success) {
        setLikedPostIds(prevLikedPostIds);
        if (postIndex !== -1) {
          tempPosts[postIndex] = {
            ...tempPosts[postIndex],
            likes: currentLikes,
          };
        }
        alert(result.message || "Failed to dislike post.");
      }
    } else {
      setLikedPostIds((prev) => new Set(prev).add(postId));
      if (postIndex !== -1) {
        tempPosts[postIndex] = {
          ...tempPosts[postIndex],
          likes: currentLikes + 1,
        };
      }
      const result = await likePost(postId);
      if (!result.success) {
        setLikedPostIds(prevLikedPostIds);
        if (postIndex !== -1) {
          tempPosts[postIndex] = {
            ...tempPosts[postIndex],
            likes: currentLikes,
          };
        }
        alert(result.message || "Failed to like post.");
      }
    }
  };

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
            ? posts.map((post: any) => {
                const isPostLiked = likedPostIds.has(post._id);
                return (
                  <div key={post._id} className="home-post-card">
                    <div className="home-post-header">
                      <div className="home-post-header-author">
                        <img
                          src={getImageUrl(post.authorImage?.fileUrl)}
                          alt={post.authorImage?.filename}
                          className="home-post-avatar"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/50x50/A0A0A0/FFFFFF?text=A";
                          }}
                        />
                        <span className="home-post-author">{post.author}</span>
                      </div>

                      <div className="home-post-header-actions">
                        <FaHeart
                          className="home-post-like-icon"
                          style={{
                            color: isPostLiked ? "red" : "inherit",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleLikeDislike(post._id, post.likes)
                          }
                        />
                        <span className="home-post-likes">{post.likes}</span>
                      </div>
                    </div>
                    <p className="home-post-content">{post.content}</p>
                    {post.image && (
                      <img
                        src={getImageUrl(post.image.fileUrl)}
                        alt={post.image.filename}
                        className="home-post-image"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/600x400/E0E0E0/000000?text=Image+Error";
                        }}
                      />
                    )}
                  </div>
                );
              })
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
