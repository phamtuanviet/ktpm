import React from "react";
import ReduxProvider from "@/redux/provider";
import { Toaster } from "sonner";

const AppProvider = ({ children }) => {
  return (
    <ReduxProvider>
      <div className="w-[100vw] h-[100vh] max-w-full">
        {children}
        <Toaster/>
      </div>
    </ReduxProvider>
  );
};

export default AppProvider;
