import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile data from the backend
  const fetchProfile = async () => {
    try {
      const response = await axios.get("/api/customer/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProfile(response.data.profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <User className="text-wineRed" size={24} />
          My Profile
        </h1>

        {loading ? (
          <p className="text-gray-600">Loading profile...</p>
        ) : profile ? (
          <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={profile.avatar || "https://via.placeholder.com/150"}
                alt="Profile Avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {profile.name}
                </h2>
                <p className="text-sm text-gray-600">{profile.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-500">Phone</h3>
                <p className="text-gray-800">{profile.phone || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Address</h3>
                <p className="text-gray-800">{profile.address || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Joined On</h3>
                <p className="text-gray-800">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Failed to load profile.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;