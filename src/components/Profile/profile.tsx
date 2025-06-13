import React, { useState } from "react";
import { FaEdit, FaCheck } from "react-icons/fa";
import {
  useUserProfile,
  useEditUserProfile,
  UserProfileData,
} from "../functions/logics";
import { MdCancel } from "react-icons/md";
import { useMyContext } from "../functions/logics";

interface EditableFieldProps {
  label: string;
  type: string;
  value: string;
  fieldName: keyof UserProfileData;
  isEditing: boolean;
  onEditToggle: (
    fieldName: keyof UserProfileData,
    currentValue: string
  ) => void;
  onSave: (fieldName: keyof UserProfileData, newValue: string) => void;
  onCancel: () => void;
  editedValue: string;
  onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function EditableField({
  label,
  type,
  value,
  fieldName,
  isEditing,
  onEditToggle,
  onSave,
  onCancel,
  editedValue,
  onValueChange,
}: EditableFieldProps) {
  return (
    <div className="profile-page-detail-item">
      <strong>{label}:</strong>{" "}
      {isEditing ? (
        <input
          type={type}
          value={editedValue}
          onChange={onValueChange}
          className="profile-page-edit-input"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSave(fieldName, editedValue);
            } else if (e.key === "Escape") {
              onCancel();
            }
          }}
        />
      ) : (
        <span>{value}</span>
      )}
      <button
        className="profile-page-edit-btn"
        onClick={() =>
          isEditing
            ? onSave(fieldName, editedValue)
            : onEditToggle(fieldName, value)
        }
      >
        {isEditing ? <FaCheck /> : <FaEdit />}
      </button>
      {isEditing && (
        <button className="profile-page-edit-btn" onClick={onCancel}>
          <MdCancel />
        </button>
      )}
    </div>
  );
}

function ProfilePage() {
  const { username } = useMyContext();

  const { profile, loadingProfile, profileError, refetchProfile } =
    useUserProfile(username);

  const [editingField, setEditingField] = useState<
    keyof UserProfileData | null
  >(null);
  const [editedValue, setEditedValue] = useState<string>("");
  const [pageMessage, setPageMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<
    "success" | "error" | null | string
  >(null);

  const { editUserProfile } = useEditUserProfile(
    refetchProfile,
    setPageMessage,
    setMessageType
  );

  // const IMAGE_BASE_URL = "https://media-project-production.up.railway.app";
  const IMAGE_BASE_URL = "http://localhost:3060";

  const getProfileImageUrl = (fileUrl: string | undefined) => {
    if (!fileUrl) {
      return "https://placehold.co/150x150/A0A0A0/FFFFFF?text=User";
    }
    try {
      const url = new URL(fileUrl, IMAGE_BASE_URL);
      return url.toString();
    } catch (e) {
      console.error("Invalid image URL construction:", e);
      return "https://placehold.co/150x150/FF0000/FFFFFF?text=Error";
    }
  };

  const handleEditToggle = (
    fieldName: keyof UserProfileData,
    currentValue: string
  ) => {
    setEditingField(fieldName);
    setEditedValue(currentValue);
    setPageMessage(null);
    setMessageType(null);
  };

  const handleSave = async (
    fieldName: keyof UserProfileData,
    newValue: string
  ) => {
    if (profile && profile[fieldName] !== newValue) {
      await editUserProfile(fieldName, newValue);
    }
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditedValue("");
    setPageMessage(null);
    setMessageType(null);
  };

  return (
    <main className="profile-page-main-content">
      <section className="profile-page-section-container">
        <h2 className="profile-page-title">Your Profile</h2>

        {loadingProfile && (
          <p className="profile-page-message">Loading profile...</p>
        )}
        {profileError && (
          <p className="profile-page-error-message">
            Error loading profile: {profileError}
          </p>
        )}

        {pageMessage && (
          <p
            className={`profile-page-message ${
              messageType === "success" ? "success" : "error"
            }`}
          >
            {pageMessage}
          </p>
        )}

        {profile ? (
          <div className="profile-page-details-card">
            <img
              src={getProfileImageUrl(profile.picture?.fileUrl)}
              alt="Profile Avatar"
              className="profile-page-avatar"
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/150x150/A0A0A0/FFFFFF?text=User";
              }}
            />
            <div className="profile-page-info">
              <EditableField
                label="Username"
                type="text"
                value={profile.username}
                fieldName="username"
                isEditing={editingField === "username"}
                onEditToggle={handleEditToggle}
                onSave={handleSave}
                onCancel={handleCancel}
                editedValue={editedValue}
                onValueChange={(e) => setEditedValue(e.target.value)}
              />
              <EditableField
                label="First Name"
                type="text"
                value={profile.firstname}
                fieldName="firstname"
                isEditing={editingField === "firstname"}
                onEditToggle={handleEditToggle}
                onSave={handleSave}
                onCancel={handleCancel}
                editedValue={editedValue}
                onValueChange={(e) => setEditedValue(e.target.value)}
              />
              <EditableField
                label="Last Name"
                type="text"
                value={profile.lastname}
                fieldName="lastname"
                isEditing={editingField === "lastname"}
                onEditToggle={handleEditToggle}
                onSave={handleSave}
                onCancel={handleCancel}
                editedValue={editedValue}
                onValueChange={(e) => setEditedValue(e.target.value)}
              />
              <EditableField
                label="Gender"
                type="text"
                value={profile.gender}
                fieldName="gender"
                isEditing={editingField === "gender"}
                onEditToggle={handleEditToggle}
                onSave={handleSave}
                onCancel={handleCancel}
                editedValue={editedValue}
                onValueChange={(e) => setEditedValue(e.target.value)}
              />
              <EditableField
                label="Email"
                type="email"
                value={profile.email}
                fieldName="email"
                isEditing={editingField === "email"}
                onEditToggle={handleEditToggle}
                onSave={handleSave}
                onCancel={handleCancel}
                editedValue={editedValue}
                onValueChange={(e) => setEditedValue(e.target.value)}
              />
              <EditableField
                label="Phone"
                type="text"
                value={profile.phone || ""}
                fieldName="phone"
                isEditing={editingField === "phone"}
                onEditToggle={handleEditToggle}
                onSave={handleSave}
                onCancel={handleCancel}
                editedValue={editedValue}
                onValueChange={(e) => setEditedValue(e.target.value)}
              />
              <EditableField
                label="Date of Birth"
                type="date"
                value={profile.dob || ""}
                fieldName="dob"
                isEditing={editingField === "dob"}
                onEditToggle={handleEditToggle}
                onSave={handleSave}
                onCancel={handleCancel}
                editedValue={editedValue}
                onValueChange={(e) => setEditedValue(e.target.value)}
              />
              <EditableField
                label="Address"
                type="text"
                value={profile.address || ""}
                fieldName="address"
                isEditing={editingField === "address"}
                onEditToggle={handleEditToggle}
                onSave={handleSave}
                onCancel={handleCancel}
                editedValue={editedValue}
                onValueChange={(e) => setEditedValue(e.target.value)}
              />
            </div>
          </div>
        ) : (
          !loadingProfile &&
          !profileError && (
            <p className="profile-page-no-data">
              No profile data available. Please ensure you are logged in.
            </p>
          )
        )}
      </section>
    </main>
  );
}

export default ProfilePage;
