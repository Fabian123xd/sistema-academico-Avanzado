import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

function SidebarItem({ icon: Icon, label, to }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) => `ap-nav-item ${isActive ? 'active' : ''}`}
    >
      <div className="ap-nav-icon">
        <Icon size={16} />
      </div>
      <span className="ap-nav-label">{label}</span>
    </NavLink>
  )
}

/**
 * Shared layout: sticky header + sidebar with role-based nav + main content + footer.
 */
export default function AppLayout({ title, menuItems }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <div className="ap-layout" style={{ flex: 1 }}>
        {/* Sidebar */}
        <aside className="ap-sidebar">
          <div className="ap-sidebar-label">Menú</div>
          {menuItems.map((item) => (
            <SidebarItem key={item.to} {...item} />
          ))}
        </aside>

        {/* Main content */}
        <main className="ap-content">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  )
}
