import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext"; // ✅ Access token & login state

export const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth(); // ✅ Get current logged-in user with token

  // ✅ Load wishlist from backend when user logs in
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.token) return;

      try {
        const res = await api.get("/wishlist", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const tutorList = res.data.map((item) => item.tutor); // populated tutor
        setWishlist(tutorList);
        localStorage.setItem("wishlist", JSON.stringify(tutorList));
      } catch (err) {
        console.error("❌ Error loading wishlist:", err.response?.data || err.message);
      }
    };

    fetchWishlist();
  }, [user?.token]); // 🔄 refetch only when token changes

  const addToWishlist = async (tutor) => {
    try {
      await api.post(
        "/wishlist",
        { tutorId: tutor._id },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );

      setWishlist((prev) => [...prev, tutor]);
      localStorage.setItem("wishlist", JSON.stringify([...wishlist, tutor]));
    } catch (err) {
      console.error("❌ Error adding to wishlist:", err.response?.data || err.message);
    }
  };

  const removeFromWishlist = async (tutorId) => {
    try {
      await api.delete(`/wishlist/${tutorId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      const updated = wishlist.filter((t) => t._id !== tutorId);
      setWishlist(updated);
      localStorage.setItem("wishlist", JSON.stringify(updated));
    } catch (err) {
      console.error("❌ Error removing from wishlist:", err.response?.data || err.message);
    }
  };

  const isInWishlist = (tutorId) => wishlist.some((t) => t._id === tutorId);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
