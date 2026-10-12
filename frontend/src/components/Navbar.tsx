import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShieldAlert,
  LayoutDashboard,
  ScanSearch,
  History,
  BarChart3,
  LogOut,
  UserCheck,
  Shield,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
      isActive(path)
        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#060a12]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-8">
          <Link
            to={isAdmin ? '/admin' : '/dashboard'}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold tracking-tight text-base flex items-center gap-1.5">
                SMAI
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-normal">
                  v2.0
                </span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                Contract Security
              </span>
            </div>
          </Link>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5">
            {!isAdmin ? (
              <>
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
                <Link to="/scan" className={navLinkClass('/scan')}>
                  <ScanSearch className="w-3.5 h-3.5" />
                  New Scan
                </Link>
                <Link to="/history" className={navLinkClass('/history')}>
                  <History className="w-3.5 h-3.5" />
                  History
                </Link>
                <Link to="/evaluation" className={navLinkClass('/evaluation')}>
                  <BarChart3 className="w-3.5 h-3.5" />
                  Benchmark Metrics
                </Link>
              </>
            ) : (
              <>
                <Link to="/admin" className={navLinkClass('/admin')}>
                  <Shield className="w-3.5 h-3.5" />
                  Admin Console
                </Link>
                <Link to="/evaluation" className={navLinkClass('/evaluation')}>
                  <BarChart3 className="w-3.5 h-3.5" />
                  Benchmark Metrics
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right side: User info & logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300 text-xs font-mono max-w-[140px] sm:max-w-[200px] truncate">
              {user?.email}
            </span>
            <Badge
              variant="outline"
              className={
                isAdmin
                  ? 'border-purple-500/40 text-purple-300 bg-purple-950/40 text-[10px] px-1.5 py-0'
                  : 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40 text-[10px] px-1.5 py-0'
              }
            >
              {user?.role}
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 hover:bg-red-950/20 text-xs gap-1.5 h-8 px-2.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
