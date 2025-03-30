import React, { useContext } from "react";
import { WishlistContext } from "../../context/WishlistContext";
import TutorCard from "./TutorCard";

const WishlistPage = () => {
  const { wishlist } = useContext(WishlistContext);

  return (
    <div>
      <h1>❤️ My Wishlist ({wishlist.length})</h1>
      {wishlist.length === 0 ? (
        <p>No tutors in wishlist.</p>
      ) : (
        wishlist.map((tutor) => <TutorCard key={tutor._id} tutor={tutor} />)
      )}
    </div>
  );
};

export default WishlistPage;
