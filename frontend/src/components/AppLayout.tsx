import React from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex">
      {/* Sidebar - fixed left */}
      <Sidebar />

      {/* Main Container - offset by sidebar width */}
      <div className="flex-1 flex flex-col min-w-0 pl-64 transition-all duration-300">
        <Topbar title={title} subtitle={subtitle} />

        {/* Content Area with subtle cyber grid background */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto cyber-grid relative">
          {/* Subtle atmospheric ambient glow */}
          <div className="pointer-events-none absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
