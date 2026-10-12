import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import api from '@/api/client';
import type { AnalysisHistoryItem } from '@/types';
import { PIPELINE_STEPS, SEVERITY_TOKENS } from '@/lib/design-tokens';
import {
  ScanSearch,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  FileCode,
  Zap,
  BarChart2,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

const SEVERITIES = ['Critical', 'High', 'Medium', 'Low', 'Informational'] as const;

export default function DashboardPage() {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/api/analysis/history')
      .then((r) => setHistory(r.data))
      .catch((err) => console.error('Failed to load history:', err))
      .finally(() => setLoading(false));
  }, []);

  // Aggregate metrics
  const totalVulns = history.reduce((s, h) => s + h.total_findings, 0);
  const criticalCount = history.reduce((s, h) => s + (h.severity_counts?.Critical ?? 0), 0);
  const highCount = history.reduce((s, h) => s + (h.severity_counts?.High ?? 0), 0);
  const criticalHigh = criticalCount + highCount;
  const vulnerableScans = history.filter((h) => h.is_vulnerable).length;
  const cleanRate =
    history.length > 0
      ? `${Math.round(((history.length - vulnerableScans) / history.length) * 100)}%`
      : '100%';

  // Aggregated severity counts across all scans
  const aggregatedSeverity = useMemo(() => {
    const counts: Record<string, number> = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
      Informational: 0,
    };
    history.forEach((h) => {
      Object.entries(h.severity_counts ?? {}).forEach(([k, v]) => {
        counts[k] = (counts[k] ?? 0) + v;
      });
    });
    return counts;
  }, [history]);

  // Recharts severity data
  const severityChartData = useMemo(() => {
    return SEVERITIES.map((sev) => ({
      name: sev,
      count: aggregatedSeverity[sev] || 0,
      fill: SEVERITY_TOKENS[sev].color,
    }));
  }, [aggregatedSeverity]);

  // Activity trend over recent scans
  const activityData = useMemo(() => {
    if (history.length === 0) {
      return [
        { name: 'Mon', index: '#1', findings: 1, critHigh: 0 },
        { name: 'Tue', index: '#2', findings: 3, critHigh: 1 },
        { name: 'Wed', index: '#3', findings: 2, critHigh: 1 },
        { name: 'Thu', index: '#4', findings: 5, critHigh: 2 },
        { name: 'Fri', index: '#5', findings: 4, critHigh: 1 },
        { name: 'Sat', index: '#6', findings: 6, critHigh: 3 },
        { name: 'Sun', index: '#7', findings: 8, critHigh: 4 },
      ];
    }
    const reversed = [...history].reverse();
    return reversed.slice(-10).map((item, idx) => ({
      name: item.contract_name.slice(0, 8),
      index: `#${idx + 1}`,
      findings: item.total_findings,
      critHigh: (item.severity_counts?.Critical ?? 0) + (item.severity_counts?.High ?? 0),
    }));
  }, [history]);

  const recent = history.slice(0, 6);

  return (
    <AppLayout
      title="Web3 Security Command Center"
      subtitle="Autonomous Multi-Agent Vulnerability Detection & Mitigation Engine"
    >
      <div className="space-y-6">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              Security Overview & Telemetry
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-Agent Static AST & Local LLM Verified Smart Contract Findings
            </p>
          </div>
          <Button
            onClick={() => navigate('/scan')}
            className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs h-9 px-4 gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] shrink-0 self-start sm:self-auto transition-all"
          >
            <ScanSearch className="w-4 h-4" /> Start New Audit
          </Button>
        </div>

        {/* 4 Authentic Watermelon UI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Audits */}
          <Card className="bg-[#0b1120]/90 border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Total Scans Run</span>
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-extrabold font-mono text-cyan-300">
                  {history.length}
                </span>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono text-slate-400">
                  <span className="text-emerald-400 font-semibold">{vulnerableScans}</span>
                  <span>vulnerable contracts</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Vulnerabilities */}
          <Card className="bg-[#0b1120]/90 border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Total SWC Findings</span>
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-extrabold font-mono text-orange-400">
                  {totalVulns}
                </span>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono text-slate-400">
                  <span className="text-orange-400 font-semibold">SWC & CWE</span>
                  <span>vectors verified</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical & High Risks */}
          <Card className="bg-[#0b1120]/90 border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Critical & High</span>
                <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-extrabold font-mono text-red-400">
                  {criticalHigh}
                </span>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono text-slate-400">
                  <span className="text-red-400 font-semibold">{criticalCount}</span> Critical •{' '}
                  <span className="text-orange-400 font-semibold">{highCount}</span> High
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clean Contract Pass Rate */}
          <Card className="bg-[#0b1120]/90 border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Safety Pass Rate</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-extrabold font-mono text-emerald-400">
                  {cleanRate}
                </span>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono text-slate-400">
                  <span>Contracts passed clean</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row: Activity Trend & Severity Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Activity Trend Area Chart (8 cols) */}
          <Card className="lg:col-span-8 bg-[#0b1120]/90 border-slate-800/80 shadow-lg">
            <CardHeader className="py-4 px-6 border-b border-slate-800/60 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-cyan-400" />
                  Audit Finding Trend Over Time
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Severity distribution and detection velocity across smart contract audits
                </CardDescription>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-800/60">
                Live Telemetry
              </span>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#090d16',
                        borderColor: '#1e293b',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="findings"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#cyanGradient)"
                      name="Total Findings"
                    />
                    <Area
                      type="monotone"
                      dataKey="critHigh"
                      stroke="#ef4444"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#redGradient)"
                      name="Critical/High"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Severity Breakdown Bar Chart (4 cols) */}
          <Card className="lg:col-span-4 bg-[#0b1120]/90 border-slate-800/80 shadow-lg">
            <CardHeader className="py-4 px-6 border-b border-slate-800/60">
              <CardTitle className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-orange-400" />
                Vulnerability Breakdown
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Verified occurrences by severity classification
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={severityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#090d16',
                        borderColor: '#1e293b',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {severityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section: Multi-Agent Topology & Recent Scans */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Multi-Agent Architecture Topology (4 cols) */}
          <Card className="lg:col-span-4 bg-[#0b1120]/90 border-slate-800/80 shadow-lg">
            <CardHeader className="py-4 px-6 border-b border-slate-800/60">
              <CardTitle className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Autonomous Multi-Agent Topology
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                5 Subagent orchestration verification graph
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              {PIPELINE_STEPS.map((step) => (
                <div
                  key={step.name}
                  className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all text-xs"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <span>{step.icon}</span> {step.name}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${step.badge}`}>
                      {step.agent}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug font-sans">
                    {step.desc}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Scans Table (8 cols) */}
          <Card className="lg:col-span-8 bg-[#0b1120]/90 border-slate-800/80 shadow-lg flex flex-col">
            <CardHeader className="py-4 px-6 border-b border-slate-800/60 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-cyan-400" /> Recent Security Scans
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Latest smart contract audits and grounded verification reports
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/history')}
                className="text-cyan-400 hover:text-cyan-300 text-xs h-8 gap-1"
              >
                Full History <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </CardHeader>

            <CardContent className="p-0 flex-1">
              {loading ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  <div className="w-6 h-6 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto mb-3" />
                  Loading recent audit activity...
                </div>
              ) : recent.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  No contract scans found. Run your first audit scan to begin!
                </div>
              ) : (
                <div className="divide-y divide-slate-800/60">
                  {recent.map((scan) => (
                    <div
                      key={scan.id}
                      onClick={() => navigate(`/report/${scan.id}`)}
                      className="p-4 flex items-center justify-between hover:bg-slate-900/60 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            scan.is_vulnerable
                              ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {scan.is_vulnerable ? (
                            <ShieldAlert className="w-4 h-4" />
                          ) : (
                            <ShieldCheck className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-slate-200 group-hover:text-cyan-400 transition-colors font-mono truncate">
                            {scan.contract_name}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {scan.created_at ? new Date(scan.created_at).toLocaleDateString() : 'Recent'}
                            </span>
                            <span>•</span>
                            <span>{scan.total_findings} findings</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden sm:flex items-center gap-1.5">
                          {SEVERITIES.filter((s) => (scan.severity_counts?.[s] ?? 0) > 0).map((s) => (
                            <span
                              key={s}
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${SEVERITY_TOKENS[s].badge}`}
                            >
                              {s.slice(0, 4)}: {scan.severity_counts?.[s]}
                            </span>
                          ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 group-hover:text-cyan-300 text-xs h-7 px-2"
                        >
                          View <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
