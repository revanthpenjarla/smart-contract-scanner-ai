import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import api from '@/api/client';
import type { AnalysisHistoryItem } from '@/types';
import { calculateSecurityScore, SEVERITY_TOKENS } from '@/lib/design-tokens';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
  History,
  ScanSearch,
  Search,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  FileCode,
} from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'vulnerable' | 'clean'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/api/analysis/history')
      .then((r) => setHistory(r.data))
      .catch((err) => console.error('Failed to load history:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = history.filter((h) => {
    const matchSearch = h.contract_name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' || (filter === 'vulnerable' ? h.is_vulnerable : !h.is_vulnerable);
    return matchSearch && matchFilter;
  });

  const totalScans = history.length;
  const vulnerableCount = history.filter((h) => h.is_vulnerable).length;
  const cleanCount = totalScans - vulnerableCount;

  return (
    <AppLayout
      title="Audit Ledger & History"
      subtitle="Complete chronological record of all verified Solidity contract scans"
    >
      <div className="space-y-6">
        {/* Top Header & Metrics Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <History className="w-5 h-5 text-cyan-400" />
              Historical Scan Records
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Explore ground-truth findings, generated fix diffs, and historical security grades
            </p>
          </div>

          <Button
            onClick={() => navigate('/scan')}
            className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs h-9 px-4 gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] shrink-0 self-start sm:self-auto transition-all"
          >
            <ScanSearch className="w-4 h-4" /> Start New Audit
          </Button>
        </div>

        {/* Filter bar & Quick Counters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              type="text"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder="Search contracts by name..."
              className="pl-9 bg-slate-900/80 border-slate-700/80 text-slate-100 placeholder:text-slate-500 text-xs h-9 font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 p-1 rounded-xl">
              {(['all', 'vulnerable', 'clean'] as const).map((f) => {
                const count = f === 'all' ? totalScans : f === 'vulnerable' ? vulnerableCount : cleanCount;
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      filter === f
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Table Card */}
        <Card className="bg-[#0b1120]/90 border-slate-800/80 shadow-xl overflow-hidden">
          <CardHeader className="py-3 px-5 border-b border-slate-800/60 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-slate-200">
              Contract Audit Registry
            </CardTitle>
            <span className="text-[11px] font-mono text-slate-400">
              Showing {filtered.length} of {history.length} scans
            </span>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                <div className="w-6 h-6 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto mb-3" />
                Retrieving scan ledger...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No scans matching your current filter criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800/80 hover:bg-transparent">
                      <TableHead className="text-slate-400 font-semibold text-xs px-5 py-3">
                        Contract
                      </TableHead>
                      <TableHead className="text-slate-400 font-semibold text-xs px-5 py-3">
                        Security Grade
                      </TableHead>
                      <TableHead className="text-slate-400 font-semibold text-xs px-5 py-3">
                        Audited Date
                      </TableHead>
                      <TableHead className="text-slate-400 font-semibold text-xs px-5 py-3">
                        Findings
                      </TableHead>
                      <TableHead className="text-slate-400 font-semibold text-xs px-5 py-3">
                        Severity Breakdown
                      </TableHead>
                      <TableHead className="text-slate-400 font-semibold text-xs px-5 py-3">
                        Status
                      </TableHead>
                      <TableHead className="text-slate-400 font-semibold text-xs px-5 py-3 text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((item) => {
                      const sec = calculateSecurityScore(item.severity_counts);
                      return (
                        <TableRow
                          key={item.id}
                          className="border-slate-800/60 hover:bg-slate-800/30 transition-colors"
                        >
                          <TableCell className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-100">
                            <div className="flex items-center gap-2">
                              <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span className="truncate max-w-[180px]">{item.contract_name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="px-5 py-3.5">
                            <span
                              className="font-mono text-xs font-bold px-2 py-0.5 rounded border"
                              style={{
                                color: sec.color,
                                borderColor: `${sec.color}40`,
                                backgroundColor: `${sec.color}15`,
                              }}
                            >
                              Grade {sec.grade} ({sec.score})
                            </span>
                          </TableCell>
                          <TableCell className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap font-mono">
                            {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
                          </TableCell>
                          <TableCell className="px-5 py-3.5 text-xs font-bold font-mono">
                            {item.total_findings > 0 ? (
                              <span className="text-orange-400">{item.total_findings}</span>
                            ) : (
                              <span className="text-emerald-400">0</span>
                            )}
                          </TableCell>
                          <TableCell className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {['Critical', 'High', 'Medium', 'Low'].map(
                                (s) =>
                                  (item.severity_counts?.[s] ?? 0) > 0 && (
                                    <div
                                      key={s}
                                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${SEVERITY_TOKENS[s as keyof typeof SEVERITY_TOKENS].badge}`}
                                    >
                                      {s[0]}:{item.severity_counts[s]}
                                    </div>
                                  )
                              )}
                              {item.total_findings === 0 && (
                                <span className="text-slate-500 text-xs">Clean</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="px-5 py-3.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-semibold gap-1 ${
                                item.is_vulnerable
                                  ? 'bg-red-950/40 text-red-400 border-red-800/60'
                                  : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                              }`}
                            >
                              {item.is_vulnerable ? (
                                <>
                                  <ShieldAlert className="w-3 h-3 text-red-400" /> Vulnerable
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Passed
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-5 py-3.5 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/report/${item.id}`)}
                              className="text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 h-7 px-2.5 gap-1"
                            >
                              View <ArrowRight className="w-3 h-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
