import React from "react";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default Loading;
