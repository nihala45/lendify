// src/components/adminside/AdminSidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

const AdminSidebar = () => {
  const sidebarLinks = [
    { name: 'Dashboard', path: '/admin', icon: HomeIcon },
    { name: 'Manage Users', path: '/admin/manage-users', icon: UsersIcon },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200">
      <div className="p-6 text-2xl font-bold text-gray-800 border-b border-gray-200">
        Admin Panel
      </div>
      <nav className="p-4 space-y-2">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-md hover:bg-gray-100 ${
                isActive ? 'bg-gray-100 font-semibold' : 'text-gray-700'
              }`
            }
          >
            <link.icon className="h-6 w-6" />
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
