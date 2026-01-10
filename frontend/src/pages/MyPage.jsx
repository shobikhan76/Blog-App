import React, { useState } from "react";
import CreatePost from "./CreatePost";
import MyPostsList from "./MyPostsList";

const MyPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Clean Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
              <p className="text-gray-600 mt-1">Manage your blog posts</p>
            </div>
            
            {/* Enhanced Create Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="
                inline-flex items-center gap-2 
                bg-blue-600 hover:bg-blue-700 
                text-white px-5 py-2.5 
                rounded-lg font-medium
                transition-all duration-200
                hover:shadow-md hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              "
            >
              <span className="text-lg">+</span>
              Create Post
            </button>
          </div>
        </div>

       

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6">
            <MyPostsList />
          </div>
        </div>

        {/* Create Post Modal */}
        {showCreateModal && (
          <CreatePost
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MyPage;