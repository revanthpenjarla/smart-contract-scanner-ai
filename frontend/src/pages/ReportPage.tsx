import React, { useEffect, useState, lazy, Suspense, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import SeverityBadge from '@/components/SeverityBadge';
import DiffViewer from '@/components/DiffViewer';
import RiskBar from '@/components/RiskBar';
import api from '@/api/client';
import type { VulnerabilityReport, VerifiedVulnerability } from '@/types';
import { calculateSecurityScore } from '@/lib/design-tokens';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ShieldAlert,
  ShieldCheck,
  ArrowLeft,
  FileCode,
  Sparkles,
  GitCompare,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Printer,
  Search,
  Filter,
  Copy,
  Check,
  Cpu,
  AlertTriangle,
} from 'lucide-react';

const CodeViewer = lazy(() => import('@/components/CodeViewer'));
const SEVERITIES = ['Critical', 'High', 'Medium', 'Low', 'Informational'] as const;

function FindingCard({ f, idx, isSuppressed = false }: { f: VerifiedVulnerability; idx: number; isSuppressed?: boolean }) {
  const [open, setOpen] = useState(idx === 0 && !isSuppressed);
  const [activeTab, setActiveTab] = useState<'explanation' | 'code' | 'diff'>('explanation');
  const [copiedPatch, setCopiedPatch] = useState(false);
  const hasDiff = !!f.fixed_code && f.fixed_code !== f.codeSnippet && f.fixed_code.trim().length > 0;

  const isHighOrCrit = !isSuppressed && (f.severity === 'Critical' || f.severity === 'High');

  const copyPatch = () => {
    if (f.fixed_code) {
      navigator.clipboard.writeText(f.fixed_code);
      setCopiedPatch(true);
      setTimeout(() => setCopiedPatch(false), 2000);
    }
  };

  const isAiConfirmed = f.verification_status === 'CONFIRMED' || (!f.fallback_used && f.verification_status !== 'UNVERIFIED' && f.model_used !== 'RAG Only (No AI)' && !!f.model_used);
  const isAiFallback = !!f.fallback_used;

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 border ${
        isSuppressed
          ? 'border-blue-900/40 bg-[#09101d]/70 opacity-90'
          : isHighOrCrit
          ? 'border-red-500/30 bg-[#0c1222]/90 shadow-[0_0_16px_rgba(239,68,68,0.08)]'
          : 'border-slate-800/80 bg-[#0c1222]/80'
      }`}
    >
      {/* Header button for expanding/collapsing */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors text-left"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <span className="text-slate-500 font-mono text-xs w-6 shrink-0">
            #{idx + 1}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-bold text-sm ${isSuppressed ? 'text-slate-300 line-through' : 'text-slate-100'}`}>
                {f.title || f.type}
              </span>
              {f.swcId && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/50">
                  {f.swcId}
                </span>
              )}
              {f.cweId && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/50">
                  {f.cweId}
                </span>
              )}

              {/* Engine Attribution Badge */}
              {isSuppressed ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-700/60 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3 h-3 text-blue-400" /> AI Filtered (False Positive)
                </span>
              ) : isAiFallback ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/60 flex items-center gap-1 font-semibold" title={f.fallback_reason}>
                  <AlertTriangle className="w-3 h-3 text-amber-400" /> AI Fallback ({f.fallback_reason || 'Unverified'})
                </span>
              ) : isAiConfirmed ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 flex items-center gap-1 font-semibold">
                  <Cpu className="w-3 h-3 text-emerald-400" /> AI Confirmed ({f.model_used || 'Qwen2.5-Coder'})
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-700/60 flex items-center gap-1 font-semibold">
                  <FileCode className="w-3 h-3 text-purple-400" /> AST Heuristic Only
                </span>
              )}
            </div>
            <p className="text-slate-400 text-xs mt-1 flex items-center gap-2 flex-wrap font-mono">
              {f.function && (
                <span>
                  Function:&nbsp;<span className="text-cyan-400">{f.function}</span>
                </span>
              )}
              {f.function && <span className="text-slate-600">·</span>}
              <span>
                Line&nbsp;<span className="text-amber-400 font-semibold">{f.line}</span>
              </span>
              <span className="text-slate-600">·</span>
              <span>
                {isAiConfirmed ? 'Calibrated Conf: ' : 'Confidence: '}
                <span className="text-slate-200 font-semibold">
                  {(f.confidence * 100).toFixed(0)}%
                </span>
              </span>
              {f.static_confidence !== undefined && isAiConfirmed && (
                <>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-500">
                    AST: {(f.static_confidence * 100).toFixed(0)}%
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-3">
          <SeverityBadge severity={f.severity} size="md" showDot />
          <div className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-200">
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Expanded finding body */}
      {open && (
        <div className="border-t border-slate-800/80 bg-slate-950/60">
          {/* Sub-tab navigation */}
          <div className="flex border-b border-slate-800/80 px-5 gap-2 bg-[#090e1a]">
            <button
              type="button"
              onClick={() => setActiveTab('explanation')}
              className={`py-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'explanation'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Explanation & Evidence
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`py-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'code'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" /> Vulnerable Snippet
            </button>
            {hasDiff && (
              <button
                type="button"
                onClick={() => setActiveTab('diff')}
                className={`py-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'diff'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" /> Synthesized Remediation Diff
              </button>
            )}
          </div>

          <div className="p-5 space-y-4">
            {activeTab === 'explanation' && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Vulnerability Description
                  </h4>
                  <p className="text-slate-300 leading-relaxed font-sans">{f.description}</p>
                </div>

                {f.attackScenario && (
                  <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-900/30">
                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
                      Exploit & Attack Vector
                    </h4>
                    <p className="text-slate-300 font-sans leading-relaxed text-xs">
                      {f.attackScenario}
                    </p>
                  </div>
                )}

                {f.staticEvidence && (
                  <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1 font-mono">
                      Static AST Evidence
                    </h4>
                    <p className="text-slate-400 font-mono text-xs leading-relaxed">
                      {f.staticEvidence}
                    </p>
                  </div>
                )}

                {f.recommendation && (
                  <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Mitigation Recommendation
                    </h4>
                    <p className="text-slate-300 font-sans leading-relaxed text-xs">
                      {f.recommendation}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'code' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Line {f.line} • Isolated Scope Context</span>
                </div>
                <Suspense
                  fallback={
                    <div className="h-40 flex items-center justify-center text-xs text-slate-500 font-mono">
                      Loading code viewer...
                    </div>
                  }
                >
                  <CodeViewer code={f.codeSnippet} language="solidity" highlightLines={[f.line]} />
                </Suspense>
              </div>
            )}

            {activeTab === 'diff' && hasDiff && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">
                    LLM-generated patch verified against SWC mitigation rules
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyPatch}
                    className="text-xs h-7 px-2.5 gap-1.5 text-slate-300 border-slate-700 bg-slate-900 hover:bg-slate-800"
                  >
                    {copiedPatch ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Patch</span>
                      </>
                    )}
                  </Button>
                </div>
                <DiffViewer
                  original={f.codeSnippet}
                  fixed={f.fixed_code!}
                  label="Vulnerable AST Scope vs Remediated Contract Code"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<VulnerabilityReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pollCount, setPollCount] = useState(0);

  // Filters and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  useEffect(() => {
    if (!id) return;
    let timer: number;

    const fetchReport = async () => {
      try {
        const r = await api.get(`/api/analysis/${id}`);
        if (r.data.status === 'PENDING') {
          timer = window.setTimeout(() => setPollCount((p) => p + 1), 1500);
        } else if (r.data.status === 'FAILED') {
          setError('Contract analysis failed during background execution.');
          setLoading(false);
        } else {
          setReport(r.data);
          setLoading(false);
        }
      } catch {
        setError('Report not found or your user role is not authorized to view it.');
        setLoading(false);
      }
    };
    fetchReport();
    return () => clearTimeout(timer);
  }, [id, pollCount]);

  // Export handlers
  const handleExportJSON = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.contract_name.replace(/\s+/g, '_')}_audit_report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    if (!report) return;
    const sec = calculateSecurityScore(report.severity_counts);
    let md = `# Smart Contract Security Audit Report: ${report.contract_name}\n\n`;
    md += `**Date:** ${new Date(report.timestamp).toLocaleString()}\n`;
    md += `**Security Score:** ${sec.score}/100 (Grade: ${sec.grade})\n`;
    md += `**Total Findings:** ${report.total_findings}\n\n`;
    md += `## Executive Summary\n\n${report.summary}\n\n`;
    md += `## Severity Breakdown\n\n`;
    Object.entries(report.severity_counts || {}).forEach(([k, v]) => {
      md += `- **${k}:** ${v}\n`;
    });
    md += `\n## Verified Findings\n\n`;

    report.findings.forEach((f, idx) => {
      md += `### ${idx + 1}. [${f.severity}] ${f.title || f.type}\n\n`;
      md += `- **SWC/CWE:** ${f.swcId || 'N/A'} / ${f.cweId || 'N/A'}\n`;
      md += `- **Location:** Line ${f.line} in function \`${f.function}\`\n`;
      md += `- **Confidence:** ${(f.confidence * 100).toFixed(0)}%\n\n`;
      md += `**Description:**\n${f.description}\n\n`;
      if (f.attackScenario) {
        md += `**Attack Scenario:**\n${f.attackScenario}\n\n`;
      }
      if (f.recommendation) {
        md += `**Mitigation:**\n${f.recommendation}\n\n`;
      }
      if (f.fixed_code) {
        md += `**Remediation Patch:**\n\`\`\`solidity\n${f.fixed_code}\n\`\`\`\n\n`;
      }
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.contract_name.replace(/\s+/g, '_')}_audit_report.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtered findings
  const filteredFindings = useMemo(() => {
    if (!report?.findings) return [];
    return report.findings.filter((f) => {
      const matchesSev = selectedSeverity === 'ALL' || f.severity === selectedSeverity;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        f.title?.toLowerCase().includes(q) ||
        f.type?.toLowerCase().includes(q) ||
        f.function?.toLowerCase().includes(q) ||
        f.swcId?.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q);
      return matchesSev && matchesQuery;
    });
  }, [report, selectedSeverity, searchQuery]);

  if (loading) {
    return (
      <AppLayout title="Audit Progress" subtitle="Multi-Agent Pipeline Active">
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-12 h-12 border-3 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
          <h2 className="text-xl font-bold text-white">Analyzing Smart Contract...</h2>
          <p className="text-xs text-slate-400 max-w-md font-sans">
            The multi-agent pipeline is executing static AST analysis, RAG mitigation matching, and local LLM verification.
          </p>
        </div>
      </AppLayout>
    );
  }

  if (error || !report) {
    return (
      <AppLayout title="Audit Report" subtitle="Error Loading Report">
        <div className="max-w-xl mx-auto py-16 text-center space-y-4">
          <Alert className="bg-red-950/40 border-red-800/60 text-red-300 text-left">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <AlertDescription className="text-xs ml-2">{error || 'Report unavailable.'}</AlertDescription>
          </Alert>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/history')}
            className="text-xs text-slate-300 border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Return to History
          </Button>
        </div>
      </AppLayout>
    );
  }

  const secScore = calculateSecurityScore(report.severity_counts);
  const totalFindings = report.total_findings;

  return (
    <AppLayout
      title={`Audit: ${report.contract_name}`}
      subtitle={`Completed on ${new Date(report.timestamp).toLocaleString()} • ID: ${report.analysis_id}`}
    >
      <div className="space-y-6">
        {/* Top Header & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/history')}
              className="text-slate-400 hover:text-cyan-400 text-xs px-2 h-8 gap-1.5 bg-slate-900/60 border border-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> History
            </Button>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border tracking-wide ${
                  report.is_vulnerable
                    ? 'bg-red-500/10 text-red-400 border-red-500/40'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40'
                }`}
              >
                {report.is_vulnerable ? (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> VULNERABLE
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> AUDIT PASSED
                  </>
                )}
              </span>

              {report.mode && (
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 font-semibold">
                  Mode {report.mode}: {report.mode === 'A' ? 'Static AST' : report.mode === 'B' ? 'Direct LLM' : 'Full Hybrid RAG'}
                </span>
              )}

              {/* LLM vs AST Diagnostic Chips */}
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 flex items-center gap-1.5 font-medium">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                Model: <span className="text-cyan-300 font-semibold">{report.model_used || 'qwen2.5-coder:1.5b'}</span>
              </span>

              {report.raw_findings_count !== undefined && (
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 flex items-center gap-1 font-medium">
                  AST Flagged: <span className="text-amber-300 font-semibold">{report.raw_findings_count}</span>
                </span>
              )}

              {report.ai_rejected_count !== undefined && report.ai_rejected_count > 0 && (
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-blue-950/70 text-blue-300 border border-blue-700/60 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  AI Filtered False Positives: +{report.ai_rejected_count}
                </span>
              )}
            </div>
          </div>

          {/* Export Actions Suite */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJSON}
              className="text-xs h-8 px-3 gap-1.5 text-slate-300 border-slate-700 bg-slate-900/80 hover:bg-slate-800"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>JSON</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportMarkdown}
              className="text-xs h-8 px-3 gap-1.5 text-slate-300 border-slate-700 bg-slate-900/80 hover:bg-slate-800"
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Markdown</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs h-8 px-3 gap-1.5 text-slate-300 border-slate-700 bg-slate-900/80 hover:bg-slate-800 hidden sm:inline-flex"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print</span>
            </Button>
          </div>
        </div>

        {/* Security Score & Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Security Score Radial Card */}
          <Card className="bg-[#0b1120]/90 border-slate-800/80 p-5 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>Security Score</span>
              <span className="font-mono text-[10px] text-slate-500">EVM Spec</span>
            </div>
            <div className="my-4 flex items-center justify-center gap-4">
              <div
                className="w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center shadow-inner"
                style={{ borderColor: secScore.color }}
              >
                <span className="text-2xl font-extrabold text-white font-mono">
                  {secScore.score}
                </span>
                <span className="text-[10px] font-mono text-slate-400">/100</span>
              </div>
              <div className="flex flex-col">
                <span
                  className="text-2xl font-black font-mono"
                  style={{ color: secScore.color }}
                >
                  Grade {secScore.grade}
                </span>
                <span className="text-xs text-slate-400">{secScore.label}</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono text-center">
              Deductions calculated from SWC severity weightings
            </div>
          </Card>

          {/* Executive Summary Card (Spans 3 cols) */}
          <Card className="md:col-span-3 bg-[#0b1120]/90 border-slate-800/80 shadow-lg flex flex-col justify-between">
            <CardHeader className="py-3 px-5 border-b border-slate-800/60">
              <CardTitle className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                Executive Audit Findings Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {report.summary}
              </p>
              {totalFindings > 0 && (
                <div className="pt-2">
                  <RiskBar counts={report.severity_counts} total={totalFindings} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Findings Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mr-1">
              <Filter className="w-3.5 h-3.5 text-cyan-400" /> Severity:
            </span>
            <button
              onClick={() => setSelectedSeverity('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                selectedSeverity === 'ALL'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-800/40'
              }`}
            >
              All ({totalFindings})
            </button>
            {SEVERITIES.map((s) => {
              const count = report.severity_counts[s] ?? 0;
              if (count === 0) return null;
              const isSelected = selectedSeverity === s;
              return (
                <button
                  key={s}
                  onClick={() => setSelectedSeverity(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-800/40'
                  }`}
                >
                  {s} ({count})
                </button>
              );
            })}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter findings by text or SWC..."
              className="h-8 pl-8 text-xs bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500 font-mono"
            />
          </div>
        </div>

        {/* Findings List */}
        {filteredFindings.length === 0 ? (
          <Card className="bg-[#0b1120]/80 border-slate-800 text-center p-12 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-4 shadow-lg shadow-emerald-950/50">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-white">
              {totalFindings === 0 ? 'No Vulnerabilities Detected' : 'No Matching Findings'}
            </h2>
            <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
              {totalFindings === 0
                ? 'Deterministic AST parsers and the LLM reasoner verified zero attack surface in the supplied code.'
                : 'Try adjusting your search query or severity filter.'}
            </p>
          </Card>
        ) : (
          <div className="space-y-3.5">
            {filteredFindings.map((f, i) => (
              <FindingCard key={f.finding_id} f={f} idx={i} />
            ))}
          </div>
        )}

        {/* AI Filtered False Positives Section */}
        {report.suppressed_findings && report.suppressed_findings.length > 0 && (
          <div className="pt-6 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-slate-200">
                  AI Filtered False Positives ({report.suppressed_findings.length})
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Candidates flagged by AST static heuristics but safely rejected by LLM reasoning
              </span>
            </div>
            <div className="space-y-3">
              {report.suppressed_findings.map((f, i) => (
                <FindingCard key={`suppressed-${f.finding_id || i}`} f={f} idx={i} isSuppressed={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
