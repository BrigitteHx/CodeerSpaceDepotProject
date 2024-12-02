import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import "./style/UserAccountLayout.css";

const UserAccountLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className={`user-account-layout ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <Sidebar onToggle={handleSidebarToggle} />
      <div className="user-account-content">
        <Outlet />
      </div>
    </div>
  );
};

export default UserAccountLayout;
