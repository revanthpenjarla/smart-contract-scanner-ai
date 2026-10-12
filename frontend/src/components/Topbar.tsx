import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EVM_NETWORKS } from '@/lib/design-tokens';
import { Button } from '@/components/ui/button';
import { ScanSearch, ChevronDown } from 'lucide-react';

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  title = 'Web3 Security Dashboard',
  subtitle = 'Autonomous Multi-Agent Vulnerability Analysis',
}) => {
  const navigate = useNavigate();
  const [selectedNetwork, setSelectedNetwork] = useState<string>(EVM_NETWORKS[0].id);
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);

  const currentNet = EVM_NETWORKS.find((n) => n.id === selectedNetwork) || EVM_NETWORKS[0];

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-slate-800/80 bg-[#070b14]/85 backdrop-blur-md px-6 flex items-center justify-between gap-4">
      {/* Left: Title & Context */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-slate-100 flex items-center gap-2">
            {title}
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* EVM Network Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowNetworkMenu(!showNetworkMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 hover:text-slate-100 hover:border-slate-700 transition-all font-mono"
          >
            <span className={`w-2 h-2 rounded-full ${currentNet.color}`} />
            <span className="hidden md:inline">{currentNet.name}</span>
            <span className="md:hidden">{currentNet.symbol}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showNetworkMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
                EVM Target Network
              </div>
              {EVM_NETWORKS.map((net) => (
                <button
                  key={net.id}
                  onClick={() => {
                    setSelectedNetwork(net.id);
                    setShowNetworkMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-left ${
                    selectedNetwork === net.id
                      ? 'bg-cyan-500/10 text-cyan-400 font-medium'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${net.color}`} />
                    <span>{net.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{net.symbol}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Launch Audit Scan Button */}
        <Button
          onClick={() => navigate('/scan')}
          size="sm"
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs h-8 px-3 gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all"
        >
          <ScanSearch className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Audit Scan</span>
        </Button>
      </div>
    </header>
  );
};

export default Topbar;
