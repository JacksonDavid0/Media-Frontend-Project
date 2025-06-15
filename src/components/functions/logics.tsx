import React from "react";
import { createContext, useContext, ReactNode } from "react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";

interface PictureData {
  filename: string;
  fileUrl: string;
  uploadAt: string;
}

interface PostData {
  _id: string;
  author: string;
  content: string;
  image?: string;
  likes: number;
}

export interface UserProfileData {
  username: string;
  firstname: string;
  lastname: string;
  gender: string;
  email: string;
  phone?: string;
  dob?: string;
  address?: string;
  picture?: PictureData;
}

export const useLoginLogic = (
  setError: React.Dispatch<React.SetStateAction<string>>,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    setError("");
    setSuccessMessage("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(
        // "https://media-project-production.up.railway.app/api/v1/user/login",
        "http://localhost:3060/api/v1/user/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data: any = await response.json();

      if (response.ok) {
        // console.log(data);

        setSuccessMessage("Login successful!");
        navigate("/home");
      } else {
        if (data.error.message) {
          const errorMessage = data.error.message;
          return setError(errorMessage);
        }
        const errorMessage = data.message || "Login failed. Please try again.";
        return setError(errorMessage);
      }
    } catch (networkError: any) {
      setError("Network error. Please check your connection and try again.");
      console.error("Network error during login:", networkError);
    }
  };

  return { handleLogin };
};

export function useApi(url: string) {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      const response = await fetch(url, {
        method: "GET",
        headers: headers,
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.warn("Unauthorized access (401). Redirecting to login.");
          navigate("/login");
          return;
        }
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      setData(result);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
      console.error("API fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [url, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useUserProfile(username?: string) {
  // const BASE_PROFILE_API_URL =
  //   `https://media-project-production.up.railway.app/api/v1/user/profile/${username}`;
  const BASE_PROFILE_API_URL = `http://localhost:3060/api/v1/user/profile`;

  console.log(username);

  const profileUrl = username
    ? `${BASE_PROFILE_API_URL}/${username}`
    : BASE_PROFILE_API_URL;
  const { data, loading, error, refetch } = useApi(profileUrl);

  return {
    profile: data,
    loadingProfile: loading,
    profileError: error,
    refetchProfile: refetch,
  };
}

export function useEditUserProfile(
  refetchProfile: () => void,
  setPageError: React.Dispatch<React.SetStateAction<string | null>>,
  setPageSuccess: React.Dispatch<React.SetStateAction<string | null>>
) {
  // const editUrl = "https://media-project-production.up.railway.app/api/v1/user/profile/update";
  const editUrl = "http://localhost:3060/api/v1/user/profile/update";

  const editUserProfile = async (value: string, data: string) => {
    setPageError(null);
    setPageSuccess(null);

    if (!value || !data) {
      setPageError("Field name or new value cannot be empty.");
      return;
    }

    try {
      const response = await fetch(editUrl, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [value]: data,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setPageSuccess("Profile updated successfully!");
        console.log("Profile update successful:", result);
        refetchProfile();
      } else {
        const errorMessage = result.message || "Failed to update profile.";
        setPageError(errorMessage);
        console.error("Profile update error:", result);
      }
    } catch (e: any) {
      setPageError(
        "Network error. Please check your connection and try again."
      );
      console.error("Network error during profile update:", e);
    }
  };

  return { editUserProfile };
}

interface MyContextType {
  username: string;
  updateUsername: (newMessage: string) => void;
}

const MyContext = createContext<MyContextType | undefined>(undefined);

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};
interface MyContextProviderProps {
  children: ReactNode;
}

export const MyContextProvider = ({ children }: MyContextProviderProps) => {
  const [username, setUsername] = useState(String);
  const updateUsername = (newUsername: string) => {
    setUsername(newUsername);
  };
  const contextValue = {
    username,
    updateUsername,
  };
  return (
    <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>
  );
};

export function usePosts() {
  const POSTS_API_URL = "http://localhost:3060/api/v1/post";
  const { data, loading, error, refetch } = useApi(POSTS_API_URL);

  return {
    posts: data,
    loadingPosts: loading,
    postsError: error,
    refetchPosts: refetch,
  };
}

export function usePostLikeDislike(refetchPosts: () => void) {
  const LIKE_URL = "http://localhost:3060/api/v1/post/like";
  const DISLIKE_URL = "http://localhost:3060/api/v1/post/dislike";

  const likePost = async (postId: string) => {
    try {
      const response = await fetch(`${LIKE_URL}/${postId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        refetchPosts();
        return { success: true };
      } else {
        return {
          success: false,
          message: result.message || "Failed to like post.",
        };
      }
    } catch (e) {
      console.error("Network error during like:", e);
      return { success: false, message: "Network error. Could not like post." };
    }
  };

  const dislikePost = async (postId: string) => {
    try {
      const response = await fetch(`${DISLIKE_URL}/${postId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        refetchPosts();
        return { success: true };
      } else {
        return {
          success: false,
          message: result.message || "Failed to dislike post.",
        };
      }
    } catch (e) {
      console.error("Network error during dislike:", e);
      return {
        success: false,
        message: "Network error. Could not dislike post.",
      };
    }
  };

  return { likePost, dislikePost };
}
