import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const {authUser}=useAuth();
  const [profile, setProfile] = useState(authUser);
  const [loading, setLoading] = useState(true);

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