
import React from 'react';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';

export const Layout = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
