import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import api from '@/api/client';
import type { AdminAnalytics, AdminUser, AdminAnalysis } from '@/types';
import { SEVERITY_TOKENS } from '@/lib/design-tokens';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Users,
  FileCode,
  BarChart3,
  ShieldAlert,
  TrendingUp,
  Activity,
  ArrowRight,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

type Tab = 'overview' | 'users' | 'analyses';

const SEVERITIES = ['Critical', 'High', 'Medium', 'Low', 'Informational'] as const;

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [analyses, setAnalyses] = useState<AdminAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get('/api/admin/analytics').then((r) => r.data),
      api.get('/api/admin/users').then((r) => r.data),
      api.get('/api/admin/analyses').then((r) => r.data),
    ])
      .then(([analyticsData, usersData, analysesData]) => {
        setAnalytics(analyticsData);
        setUsers(usersData);
        setAnalyses(analysesData);
      })
      .catch((err) => console.error('Failed to load admin data:', err))
      .finally(() => setLoading(false));
  }, []);

  const severityChartData = useMemo(() => {
    if (!analytics) return [];
    return SEVERITIES.map((sev) => ({
      name: sev,
      count: analytics.severity_distribution[sev] || 0,
      fill: SEVERITY_TOKENS[sev].color,
    }));
  }, [analytics]);

  const categoryChartData = useMemo(() => {
    if (!analytics || !analytics.category_distribution) return [];
    return Object.entries(analytics.category_distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, count]) => ({
        name: name.length > 14 ? `${name.slice(0, 12)}...` : name,
        fullName: name,
        count,
      }));
  }, [analytics]);

  return (
    <AppLayout
      title="System Admin & Surveillance Console"
      subtitle="Global telemetry, role-based auditor access control, and cross-organization audit registry"
    >
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              Administrative Surveillance Console
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Superuser access level: global audit monitoring, user account auditing, and flaw distribution telemetry
            </p>
          </div>
          <Badge
            variant="outline"
            className="border-purple-500/50 bg-purple-950/40 text-purple-300 text-xs px-3 py-1 self-start sm:self-auto font-mono"
          >
            Superuser Mode Active
          </Badge>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 p-1.5 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
              tab === 'overview'
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Analytics Overview
          </button>
          <button
            type="button"
            onClick={() => setTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
              tab === 'users'
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Auditor Accounts ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('analyses')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
              tab === 'analyses'
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" /> Global Audits ({analyses.length})
          </button>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-3" />
            Aggregating platform metrics and audit reports...
          </div>
        ) : tab === 'overview' && analytics ? (
          <div className="space-y-6">
            {/* Global Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-[#0b1120]/90 border-slate-800/80 shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Total Auditors</span>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="mt-3">
                    <span className="text-3xl font-bold font-mono text-blue-400">
                      {analytics.total_users}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">Registered accounts</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0b1120]/90 border-slate-800/80 shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Global Scans</span>
                    <Activity className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="mt-3">
                    <span className="text-3xl font-bold font-mono text-purple-400">
                      {analytics.total_analyses}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">Contracts audited</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0b1120]/90 border-slate-800/80 shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Total Findings</span>
                    <TrendingUp className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="mt-3">
                    <span className="text-3xl font-bold font-mono text-orange-400">
                      {analytics.total_vulnerabilities}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">Verified vulnerabilities</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0b1120]/90 border-slate-800/80 shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Vulnerable Ratio</span>
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="mt-3">
                    <span className="text-3xl font-bold font-mono text-red-400">
                      {(analytics.vulnerable_contracts_ratio * 100).toFixed(0)}%
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">Contracts requiring patch</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recharts Analytics: Severity Distribution & Category Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Severity Bar Chart */}
              <Card className="bg-[#0b1120]/90 border-slate-800/80 shadow-lg">
                <CardHeader className="py-4 px-6 border-b border-slate-800/60">
                  <CardTitle className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-cyan-400" /> Global Severity Distribution
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Total findings classified across the entire system
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={severityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {severityChartData.map((entry, index) => (
                            <Cell key={`sev-cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Category Bar Chart */}
              <Card className="bg-[#0b1120]/90 border-slate-800/80 shadow-lg">
                <CardHeader className="py-4 px-6 border-b border-slate-800/60">
                  <CardTitle className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" /> Top Flaw Categories
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Prevalent vulnerability patterns detected by AST & LLM
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {categoryChartData.length === 0 ? (
                    <div className="h-60 flex items-center justify-center text-xs text-slate-500">
                      No vulnerability categories recorded yet.
                    </div>
                  ) : (
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={categoryChartData}
                          layout="vertical"
                          margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                        >
                          <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                          <YAxis
                            type="category"
                            dataKey="name"
                            stroke="#64748b"
                            fontSize={10}
                            tickLine={false}
                            width={80}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#090d16',
                              borderColor: '#1e293b',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontFamily: 'monospace',
                            }}
                          />
                          <Bar dataKey="count" fill="#a855f7" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : tab === 'users' ? (
          <Card className="bg-[#0b1120]/90 border-slate-800/80 shadow-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-800/60">
              <CardTitle className="text-sm font-semibold text-slate-100">
                Auditor Accounts Directory
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800/80 hover:bg-transparent">
                    <TableHead className="text-slate-400 font-semibold text-xs px-5 py-3">
                      Email
                    </TableHead>
                    <TableHead className="text-slate-400 font-semibold text-xs px-5 py-3">
                      Role
                    </TableHead>
                    <TableHead className="text-slate-400 font-semibold text-xs px-5 py-3">
                      Audits Performed
                    </TableHead>
                    <TableHead className="text-slate-400 font-semibold text-xs px-5 py-3">
                      Registration Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow
                      key={u.id}
                      className="border-slate-800/60 hover:bg-slate-800/30 transition-colors"
                    >
                      <TableCell className="px-5 py-3.5 text-xs font-mono text-slate-100">
                        {u.email}
                      </TableCell>
                      <TableCell className="px-5 py-3.5">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-950/40 text-purple-300 border-purple-700/60'
                              : 'bg-cyan-950/40 text-cyan-300 border-cyan-700/60'
                          }`}
                        >
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-3.5 text-xs text-slate-300 font-mono font-bold">
                        {u.scan_count}
                      </TableCell>
                      <TableCell className="px-5 py-3.5 text-xs text-slate-400 font-mono">
                        {new Date(u.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-[#0b1120]/90 border-slate-800/80 shadow-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-800/60">
              <CardTitle className="text-sm font-semibold text-slate-100">
                System-Wide Contract Audit Ledger
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800/80 hover:bg-transparent">
                    <TableHead className="text-slate-400 font-semibold text-xs px-5 py-3">
                      User Email
                    </TableHead>
                    <TableHead className="text-slate-400 font-semibold text-xs px-5 py-3">
                      Contract
                    </TableHead>
                    <TableHead className="text-slate-400 font-semibold text-xs px-5 py-3">
                      Timestamp
                    </TableHead>
                    <TableHead className="text-slate-400 font-semibold text-xs px-5 py-3">
                      Findings
                    </TableHead>
                    <TableHead className="text-slate-400 font-semibold text-xs px-5 py-3">
                      Verdict
                    </TableHead>
                    <TableHead className="text-slate-400 font-semibold text-xs px-5 py-3 text-right">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyses.map((a) => (
                    <TableRow
                      key={a.id}
                      className="border-slate-800/60 hover:bg-slate-800/30 transition-colors"
                    >
                      <TableCell className="px-5 py-3.5 text-xs text-slate-400 font-mono">
                        {a.user_email}
                      </TableCell>
                      <TableCell className="px-5 py-3.5 text-xs font-mono font-semibold text-slate-100">
                        {a.contract_name}
                      </TableCell>
                      <TableCell className="px-5 py-3.5 text-xs text-slate-400 font-mono">
                        {new Date(a.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="px-5 py-3.5 text-xs font-bold font-mono">
                        {a.total_findings}
                      </TableCell>
                      <TableCell className="px-5 py-3.5">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold ${
                            a.is_vulnerable
                              ? 'bg-red-950/40 text-red-400 border-red-800/60'
                              : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                          }`}
                        >
                          {a.is_vulnerable ? 'Vulnerable' : 'Clean'}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-3.5 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/report/${a.id}`)}
                          className="text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-950/30 h-7 px-2.5 gap-1"
                        >
                          Audit Details <ArrowRight className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
