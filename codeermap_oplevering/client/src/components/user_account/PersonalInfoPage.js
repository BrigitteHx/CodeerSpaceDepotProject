import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../AuthContext";
import axios from "axios";
import "./style/PersonalInfoPage.css";

const PersonalInfoPage = () => {
  const { userData, setUserData, token } = useAuth();
  const locations = [
    "Amsterdam",
    "Rotterdam",
    "Den Haag",
    "Utrecht",
    "Eindhoven",
    "Groningen",
    "Maastricht",
    "Tilburg",
    "Leiden",
    "Delft",
  ];
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch user profile data when the component mounts if the token is available
    if (token) {
      const authToken = localStorage.getItem("authToken");

      axios
        .get("/api/user-info", {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((response) => {
          setUserData(response.data.user); // Set the fetched data in context
        })
        .catch((err) => {
          console.error("Failed to load user data:", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load user data. Please try again later.",
          });
        });
    }
  }, [token, setUserData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        if (file.size <= 5 * 1024 * 1024) {
          const formData = new FormData();
          formData.append("profilePicture", file); // Append the file to the form data
    
          setLoading(true);
    
          axios
          .put("http://localhost:5000/api/user/uploadProfilePicture", formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                "Content-Type": "multipart/form-data",
              },
            })
            .then((response) => {
              console.log("File uploaded:", response.data);
              // Update the user profile with the new picture URL (file path)
              setUserData((prevData) => ({
                ...prevData,
                profilePicture: response.data.filePath, // Update the profile picture path in the state
              }));
              Swal.fire({
                icon: "success",
                title: "Profile picture updated!",
                text: "Your new profile picture has been saved.",
                timer: 1500,
                showConfirmButton: false,
              });
            })
            .catch((error) => {
              console.error("Upload error:", error);
              Swal.fire({
                icon: "error",
                title: "Upload Failed",
                text: "There was an error uploading your profile picture. Please try again.",
              });
            })
            .finally(() => setLoading(false));
        } else {
          Swal.fire({
            icon: "error",
            title: "File Size Too Large",
            text: "Please upload an image smaller than 5MB.",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid File Type",
          text: "Please upload a valid image file.",
        });
      }
    };
    

    const validateForm = () => {
      const { name, email, phoneNumber, location, bio } = userData;
      const newErrors = {};
      let isValid = true;
    
      // Name validation
      if (!name) {
        newErrors.name = "Name is required.";
        isValid = false;
      } else if (name.length > 20) { // Ensure name is less than 50 characters
        newErrors.name = "Name must be 20characters or less.";
        isValid = false;
      } else if (/[^a-zA-Z\s]/.test(name)) { // Ensure only letters and spaces
        newErrors.name = "Name should only contain letters and spaces.";
        isValid = false;
      }
    
      // Email validation
      if (!email) {
        newErrors.email = "Email is required.";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Please enter a valid email address.";
        isValid = false;
      } else if (email.length > 100) {
        newErrors.email = "Email must be 100 characters or less.";
        isValid = false;
      }
    
      // Phone number validation
      if (!phoneNumber) {
        newErrors.phoneNumber = "Phone number is required.";
        isValid = false;
      } else if (!/^\d{10,15}$/.test(phoneNumber)) {
        newErrors.phoneNumber = "Phone number must be between 10 and 15 digits.";
        isValid = false;
      }
    
      // Location validation
      if (!location) {
        newErrors.location = "Location is required.";
        isValid = false;
      }
    
      // Bio validation
      if (bio && bio.length > 300) {
        newErrors.bio = "Bio must be 300 characters or less.";
        isValid = false;
      }
    
      setErrors(newErrors);
      return isValid;
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validatie van het formulier
    if (!validateForm()) return;
  
    // Bevestigingsmelding
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to update your information?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
  
    if (!result.isConfirmed) return;
  
    setLoading(true);
  
    try {
      const authToken = localStorage.getItem("authToken");
  
      // Controleer of de e-mail al bestaat
      const emailExistsResponse = await axios.post(
        "http://localhost:5000/api/user/check-email",
        { email: userData.email },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (emailExistsResponse.data.exists) {
        Swal.fire({
          icon: "error",
          title: "Email already in use",
          text: "This email is already registered. Please use a different one.",
        });
        return;
      }
  
      // Profiel bijwerken
      const response = await axios.put(
        "http://localhost:5000/api/user/updateUserProfile",
        userData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      Swal.fire({
        icon: "success",
        title: "Profile updated successfully!",
        text: response.data.message,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error during update:", error);
  
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleDeleteAccount = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Deleting your account will permanently remove your data and cannot be undone. This action cannot be recovered.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const authToken = localStorage.getItem("authToken");
          if (!authToken) {
            Swal.fire({
              icon: "error",
              title: "Authorization Error",
              text: "You are not authorized to delete this account. Please log in again.",
            });
            return;
          }

          const response = await axios.delete("http://localhost:5000/api/user/deleteAccount", {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          
          Swal.fire({
            icon: "success",
            title: "Account deleted!",
            text: response.data.message || "Your account has been permanently deleted.",
            timer: 1500,
            showConfirmButton: false,
          });
  
          // Remove token and redirect after successful deletion
          localStorage.removeItem("authToken");
          sessionStorage.removeItem("authToken");
          window.location.href = "/login";
        } catch (error) {
          console.error("Error during account deletion:", error);
          
          // Enhanced error handling based on backend response
          if (error.response?.status === 401) {
            Swal.fire({
              icon: "error",
              title: "Session Expired",
              text: "Your session has expired. Please log in again.",
              confirmButtonText: "Log In",
            }).then(() => {
              localStorage.removeItem("authToken");
              window.location.href = "/login";
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error deleting account",
              text: error.response?.data?.message || "There was an issue deleting your account. Please try again.",
            });
          }
        }
      }
    });
  };

  return (
    <div className="personal-info-page">
      <div className="personal-info-container">
        <h1>Personal Information</h1>
        <p>Update your personal details and profile preferences</p>
      </div>

      <div className="personal-info-container">
        {/* Profile Picture */}
        <div className="profile-picture-container">
        {userData?.profilePicture ? (
          <img src={`http://localhost:5000${userData.profilePicture}`} alt="Profile" />
        ) : (
          <div className="placeholder">No profile picture uploaded</div>
        )}

          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
            id="profile-picture-upload"
          />
          <label className="upload-btn" htmlFor="profile-picture-upload">
            Upload Profile Picture
          </label>
          <p> {userData?.bio || ""} </p>
        </div>

        {/* Form */}
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                maxLength="50"
                value={userData?.name || ""}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
              {errors.name && <div className="error-message">{errors.name}</div>}

            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                maxLength="100"
                value={userData?.email || ""}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
              {errors.email && <div className="error-message">{errors.email}</div>}

            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phoneNumber"
                maxLength="15"
                value={userData?.phoneNumber || ""}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
              {errors.phoneNumber && (
                <div className="error-message">{errors.phoneNumber}</div>
              )}
            </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={userData?.dob ? userData.dob.slice(0, 10) : ""}
                  onChange={handleInputChange}
                />
                {errors.dob && (
                <div className="error-message">{errors.dob}</div>
              )}
              </div>
            </div>


          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={userData?.gender || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Gender (Optional)</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Location</label>
              <select
                name="location"
                value={userData?.location || ""}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Choose a location
                </option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              {errors.location && (
                <div className="error-message">{errors.location}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              maxLength="100"
              value={userData?.bio || ""}
              onChange={handleInputChange}
              placeholder="Tell us a bit about yourself"
            />
            <div className="character-counter">
              {userData?.bio?.length || 0}/100 characters
            </div>
            {errors.bio && <div className="error-message">{errors.bio}</div>}
          </div>


          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Delete Account Section */}
      <div className="personal-info-container">
        <div className="delete-account-container">
            <h3 className="warning-text">Warning: This action is irreversible!</h3>
            <button className="delete-account-btn" onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </div>
      </div>
    </div>
  );
};

export default PersonalInfoPage;
