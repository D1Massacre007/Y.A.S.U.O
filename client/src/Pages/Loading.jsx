import React from "react";
import { useAppContext } from "../Context/AppContext";

const Loading = () => {
  const { loadingUser } = useAppContext();

  if (!loadingUser) return null; // hide loading if not active

  return (
    <div className='fixed inset-0 z-50 bg-gradient-to-b from-[#531B81] to-[#29184B]
      flex items-center justify-center text-white text-2xl'>
      <div className='w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin'></div>
    </div>
  );
};

export default Loading;
