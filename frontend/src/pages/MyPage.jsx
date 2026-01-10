import React, { useState } from "react";
import CreatePost from "./CreatePost";
import MyPostsList from "./MyPostsList";

const MyPage = () => {
    console.log("my page")
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Posts</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => 
             setShowCreateModal(true)}
        >
          + Create Post
        </button>
      </div>

      <CreatePost
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <MyPostsList />
    </div>
  );
};

export default MyPage;
