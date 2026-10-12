import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldAlert,
  LayoutDashboard,
  ScanSearch,
  History,
  BarChart3,
  Shield,
  LogOut,
  Cpu,
  Database,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = !isAdmin
    ? [
        { path: '/dashboard', label: 'Security Dashboard', icon: LayoutDashboard, badge: undefined },
        { path: '/scan', label: 'New Audit Scan', icon: ScanSearch, badge: 'Modes A·B·C' },
        { path: '/history', label: 'Audit History', icon: History, badge: undefined },
        { path: '/evaluation', label: 'Benchmark & Metrics', icon: BarChart3, badge: 'P0/P1' },
      ]
    : [
        { path: '/admin', label: 'Admin Console', icon: Shield, badge: 'Superuser' },
        { path: '/evaluation', label: 'Benchmark & Metrics', icon: BarChart3, badge: 'P0/P1' },
        { path: '/dashboard', label: 'User Dashboard', icon: LayoutDashboard, badge: undefined },
        { path: '/scan', label: 'Run Audit Scan', icon: ScanSearch, badge: undefined },
      ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 flex flex-col justify-between border-r border-slate-800/80 bg-[#070b14]/95 backdrop-blur-xl ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Brand */}
      <div>
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/70">
          <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#090d16] rounded-xl flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold tracking-tight text-slate-100 text-base font-mono">SMAI</span>
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    WEB3 v2
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                  Multi-Agent Security
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="p-3 space-y-1">
          <div className="px-3 pt-3 pb-1.5 text-[10px] font-mono tracking-wider uppercase text-slate-400 font-semibold">
            {!collapsed ? 'Audit Platform' : '• • •'}
          </div>
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      active ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </div>
                {!collapsed && item.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                      active
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700/80'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Live System Diagnostics Widget */}
        {!collapsed && (
          <div className="mx-3 mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-2">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Pipeline Diagnostics
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1 text-[10px]">
                  <Cpu className="w-3 h-3 text-purple-400" /> Skeptic LLM
                </span>
                <span className="text-[10px] text-slate-300">qwen2.5:1.5b</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1 text-[10px]">
                  <Database className="w-3 h-3 text-emerald-400" /> RAG Vectors
                </span>
                <span className="text-[10px] text-emerald-400">12 Verified</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1 text-[10px]">
                  <Shield className="w-3 h-3 text-cyan-400" /> AST Parsers
                </span>
                <span className="text-[10px] text-cyan-400">6 Detectors</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom User Area */}
      <div className="p-3 border-t border-slate-800/70">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/40 border border-slate-800/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-cyan-900/30 shrink-0">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-mono font-medium text-slate-200 truncate" title={user?.email}>
                  {user?.email}
                </span>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-[9px] font-mono px-1 rounded uppercase tracking-wider ${
                      isAdmin ? 'text-purple-400 bg-purple-950/60' : 'text-cyan-400 bg-cyan-950/60'
                    }`}
                  >
                    {user?.role}
                  </span>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
