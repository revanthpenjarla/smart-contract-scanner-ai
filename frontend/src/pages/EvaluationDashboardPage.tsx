import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import api from '@/api/client';
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
import { AlertTriangle } from 'lucide-react';

interface MetricObj {
  precision: number;
  recall: number;
  f1: number;
  accuracy: number;
  fpr: number;
  fnr: number;
  mean_conf_correct?: number;
  mean_conf_incorrect?: number;
}

interface ModeData {
  dataset: string;
  model: string;
  mode: string;
  prompt?: string;
  metrics: MetricObj;
  TP: number;
  TN: number;
  FP: number;
  FN: number;
  infra_failures: number;
  partially_grounded?: number;
  generic?: number;
  hallucinated?: number;
  vuln_classes?: Record<string, { TP: number; TN: number; FP: number; FN: number }>;
  severity_matrix?: Record<string, Record<string, number>>;
}

interface RawResult {
  dataset?: string;
  contract: string;
  mode: string;
  model: string;
  prompt?: string;
  is_vulnerable: boolean | null;
  vulnerability?: string;
  severity?: string;
  fallback_used?: boolean;
}

export default function EvaluationDashboardPage() {
  const [data, setData] = useState<Record<string, ModeData> | null>(null);
  const [rawData, setRawData] = useState<RawResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('summary');

  // Filters
  const [selectedDataset, setSelectedDataset] = useState('Internal Diagnostic Suite');
  const [selectedPrompt, setSelectedPrompt] = useState('P1');

  useEffect(() => {
    Promise.all([
      api.get('/api/evaluation/metrics').then((res) => res.data),
      api.get('/api/evaluation/raw').then((res) => res.data),
    ])
      .then(([metricsData, rawResult]) => {
        if (metricsData.detail) setError(metricsData.detail);
        else setData(metricsData);

        if (!rawResult.detail) setRawData(rawResult);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <AppLayout title="Benchmark Metrics" subtitle="Loading Empirical Evaluation">
        <div className="flex flex-col items-center justify-center p-16 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading benchmark evaluation metrics...</p>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Benchmark Metrics" subtitle="Evaluation Error">
        <div className="max-w-xl mx-auto p-12 text-center text-red-400 text-xs">
          Error loading evaluation data: {error}
        </div>
      </AppLayout>
    );
  }

  if (!data) {
    return (
      <AppLayout title="Benchmark Metrics" subtitle="No Data Available">
        <div className="max-w-xl mx-auto p-12 text-center text-slate-400 text-xs">
          No benchmark evaluation metrics currently available.
        </div>
      </AppLayout>
    );
  }

  // Derive unique filters with fallback extraction from keys
  const allDatasets = Array.from(
    new Set(
      Object.entries(data).map(([k, v]) => v.dataset || (k.includes('|') ? k.split('|')[0].trim() : 'Internal Diagnostic Suite'))
    )
  );
  const allPrompts = Array.from(
    new Set(
      Object.entries(data).map(([k, v]) => v.prompt || (k.includes('P0') ? 'P0' : 'P1'))
    )
  );

  const activeDataset = allDatasets.includes(selectedDataset) ? selectedDataset : (allDatasets[0] || 'Internal Diagnostic Suite');
  const activePrompt = allPrompts.includes(selectedPrompt) ? selectedPrompt : (allPrompts[0] || 'P1');

  // Filter keys based on selected dataset and prompt (Static mode is prompt-agnostic)
  let modes = Object.keys(data).filter((key) => {
    const ds = data[key].dataset || (key.includes('|') ? key.split('|')[0].trim() : 'Internal Diagnostic Suite');
    const p = data[key].prompt || (key.includes('P0') ? 'P0' : 'P1');
    const m = data[key].model || (key.includes('static') ? 'static' : '');
    return ds === activeDataset && (m === 'static' || p === activePrompt);
  });

  if (modes.length === 0) {
    modes = Object.keys(data);
  }

  const tabs = [
    { id: 'summary', label: 'Overall Metrics' },
    { id: 'comparison', label: 'Model & RAG Ablation' },
    { id: 'prompt_ablation', label: 'Prompt Ablation (P0 vs P1)' },
    { id: 'details', label: 'Vulnerability Breakdown' },
    { id: 'grounding', label: 'Grounding & Calibration' },
    { id: 'contracts', label: 'Contract-Level Results' },
  ];

  return (
    <AppLayout
      title="Scanner Benchmark & Ablation Metrics"
      subtitle="Empirical precision, recall, F1, and grounding metrics across Static, RAG, and LLM reasoners"
    >
      <div className="space-y-6">

        {/* Dataset & Prompt Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 bg-[#0b1120]/80 border border-slate-800/80 p-4 rounded-xl">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Evaluation Dataset
            </label>
            <select
              value={activeDataset}
              onChange={(e) => setSelectedDataset(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 text-slate-100 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              {allDatasets.map((ds) => (
                <option key={ds} value={ds}>
                  {ds}
                </option>
              ))}
              {allDatasets.length === 1 && (
                <option value="SmartBugs Curated">SmartBugs Curated (Pending)</option>
              )}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Prompt Condition
            </label>
            <select
              value={activePrompt}
              onChange={(e) => setSelectedPrompt(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 text-slate-100 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              {allPrompts.map((p) => (
                <option key={p} value={p}>
                  {p === 'P0' ? 'P0 (Baseline Reasoning)' : 'P1 (Source-Grounding)'}
                </option>
              ))}
              {allPrompts.length === 1 && <option value="P0">P0 (Pending run)</option>}
            </select>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-slate-900/80 border border-slate-800 p-1.5 rounded-xl">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overall Metrics Cards */}
        {activeTab === 'summary' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {modes.map((mode) => (
              <Card
                key={mode}
                className="bg-[#0b1120]/80 border-slate-800/80 hover:border-slate-700/80 transition-all"
              >
                <CardHeader className="pb-3 border-b border-slate-800/60">
                  <CardTitle className="text-sm font-bold text-slate-100 font-mono">
                    {mode}
                  </CardTitle>
                  <CardDescription className="text-[11px] text-slate-400">
                    Model: {data[mode].model} · Mode: {data[mode].mode}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400">Precision:</span>
                    <span className="font-mono font-bold text-cyan-400">
                      {(data[mode].metrics.precision * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400">Recall:</span>
                    <span className="font-mono font-bold text-blue-400">
                      {(data[mode].metrics.recall * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400">F1 Score:</span>
                    <span className="font-mono font-bold text-purple-400">
                      {(data[mode].metrics.f1 * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400">Accuracy:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {(data[mode].metrics.accuracy * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400">False Positive Rate (FPR):</span>
                    <span className="font-mono text-slate-300">
                      {(data[mode].metrics.fpr * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">False Negative Rate (FNR):</span>
                    <span className="font-mono text-slate-300">
                      {(data[mode].metrics.fnr * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-4 gap-2 text-center text-[10px]">
                    <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                      <div className="text-slate-500">TP</div>
                      <div className="text-emerald-400 font-bold font-mono">{data[mode].TP}</div>
                    </div>
                    <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                      <div className="text-slate-500">TN</div>
                      <div className="text-emerald-400 font-bold font-mono">{data[mode].TN}</div>
                    </div>
                    <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                      <div className="text-slate-500">FP</div>
                      <div className="text-red-400 font-bold font-mono">{data[mode].FP}</div>
                    </div>
                    <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                      <div className="text-slate-500">FN</div>
                      <div className="text-red-400 font-bold font-mono">{data[mode].FN}</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-red-400/80 pt-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Failures (Timeout/OOM): {data[mode].infra_failures}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 2: Comparison Matrix Table */}
        {activeTab === 'comparison' && (
          <Card className="bg-[#0b1120]/90 border-slate-800/80 shadow-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-800/60">
              <CardTitle className="text-sm font-semibold text-slate-100">
                Ablation Comparison Matrix (Static vs RAG vs LLM)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800/80 hover:bg-transparent">
                    <TableHead className="text-slate-400 text-xs px-5 py-3">Mode / Model</TableHead>
                    <TableHead className="text-slate-400 text-xs px-5 py-3">Precision</TableHead>
                    <TableHead className="text-slate-400 text-xs px-5 py-3">Recall</TableHead>
                    <TableHead className="text-slate-400 text-xs px-5 py-3">F1 Score</TableHead>
                    <TableHead className="text-slate-400 text-xs px-5 py-3">Accuracy</TableHead>
                    <TableHead className="text-slate-400 text-xs px-5 py-3">Infra Failures</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modes.map((mode) => (
                    <TableRow
                      key={mode}
                      className="border-slate-800/60 hover:bg-slate-800/30 transition-colors"
                    >
                      <TableCell className="px-5 py-3.5 font-mono text-xs font-bold text-slate-100">
                        {mode}
                      </TableCell>
                      <TableCell className="px-5 py-3.5 text-xs font-mono text-cyan-400 font-semibold">
                        {(data[mode].metrics.precision * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell className="px-5 py-3.5 text-xs font-mono text-blue-400 font-semibold">
                        {(data[mode].metrics.recall * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell className="px-5 py-3.5 text-xs font-mono text-purple-400 font-semibold">
                        {(data[mode].metrics.f1 * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell className="px-5 py-3.5 text-xs font-mono text-emerald-400 font-semibold">
                        {(data[mode].metrics.accuracy * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell className="px-5 py-3.5 text-xs font-mono text-red-400 font-semibold">
                        {data[mode].infra_failures}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Tab 3: Prompt Ablation Table */}
        {activeTab === 'prompt_ablation' && (
          <Card className="bg-[#0b1120]/90 border-slate-800/80 shadow-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-800/60">
              <CardTitle className="text-sm font-semibold text-slate-100">
                Prompt Ablation Analysis (P0 Baseline vs P1 Source-Grounding)
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Evaluating the impact of injecting AST grounded evidence vs standard general prompt
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800/80 hover:bg-transparent">
                    <TableHead className="text-slate-400 text-xs px-5 py-3">Configuration</TableHead>
                    <TableHead className="text-slate-400 text-xs px-5 py-3">Prompt Condition</TableHead>
                    <TableHead className="text-slate-400 text-xs px-5 py-3">Precision</TableHead>
                    <TableHead className="text-slate-400 text-xs px-5 py-3">Recall</TableHead>
                    <TableHead className="text-slate-400 text-xs px-5 py-3">F1 Score</TableHead>
                    <TableHead className="text-slate-400 text-xs px-5 py-3">FPR</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.keys(data)
                    .filter((k) => data[k].model !== 'static' && data[k].dataset === selectedDataset)
                    .map((key) => (
                      <TableRow
                        key={key}
                        className="border-slate-800/60 hover:bg-slate-800/30 transition-colors"
                      >
                        <TableCell className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-100">
                          {data[key].mode} - {data[key].model}
                        </TableCell>
                        <TableCell className="px-5 py-3.5 text-xs font-mono">
                          <Badge variant="outline" className="text-[10px] text-cyan-300 border-cyan-700/50">
                            {data[key].prompt}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-3.5 text-xs font-mono text-cyan-400">
                          {(data[key].metrics.precision * 100).toFixed(1)}%
                        </TableCell>
                        <TableCell className="px-5 py-3.5 text-xs font-mono text-blue-400">
                          {(data[key].metrics.recall * 100).toFixed(1)}%
                        </TableCell>
                        <TableCell className="px-5 py-3.5 text-xs font-mono text-purple-400">
                          {(data[key].metrics.f1 * 100).toFixed(1)}%
                        </TableCell>
                        <TableCell className="px-5 py-3.5 text-xs font-mono text-slate-400">
                          {(data[key].metrics.fpr * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Tab 4: Vulnerability & Severity breakdown */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {modes.map((mode) => (
              <Card key={mode} className="bg-[#0b1120]/80 border-slate-800/80 p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                  <h3 className="text-sm font-bold text-white font-mono">{mode}</h3>
                  <Badge variant="outline" className="text-[10px] text-slate-400">
                    Per-Vulnerability Statistics
                  </Badge>
                </div>

                {data[mode].vuln_classes && (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-800/80">
                          <TableHead className="text-slate-400 text-xs px-3 py-2">Vulnerability Pattern</TableHead>
                          <TableHead className="text-slate-400 text-xs px-3 py-2">TP</TableHead>
                          <TableHead className="text-slate-400 text-xs px-3 py-2">TN</TableHead>
                          <TableHead className="text-slate-400 text-xs px-3 py-2">FP</TableHead>
                          <TableHead className="text-slate-400 text-xs px-3 py-2">FN</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(data[mode].vuln_classes || {}).map(([vuln, counts]) => (
                          <TableRow key={vuln} className="border-slate-800/40">
                            <TableCell className="px-3 py-2 font-mono text-xs text-slate-200">
                              {vuln}
                            </TableCell>
                            <TableCell className="px-3 py-2 text-emerald-400 font-mono text-xs font-bold">
                              {counts.TP}
                            </TableCell>
                            <TableCell className="px-3 py-2 text-emerald-400 font-mono text-xs font-bold">
                              {counts.TN}
                            </TableCell>
                            <TableCell className="px-3 py-2 text-red-400 font-mono text-xs font-bold">
                              {counts.FP}
                            </TableCell>
                            <TableCell className="px-3 py-2 text-red-400 font-mono text-xs font-bold">
                              {counts.FN}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {data[mode].severity_matrix && (
                  <div className="pt-2">
                    <h4 className="text-xs font-semibold text-slate-300 mb-2">
                      Severity Confusion Matrix (Predicted vs Actual)
                    </h4>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-800/80 bg-slate-900/40">
                            <TableHead className="text-slate-400 text-xs px-3 py-2">Pred \ Actual</TableHead>
                            <TableHead className="text-slate-400 text-xs px-3 py-2">Critical</TableHead>
                            <TableHead className="text-slate-400 text-xs px-3 py-2">High</TableHead>
                            <TableHead className="text-slate-400 text-xs px-3 py-2">Medium</TableHead>
                            <TableHead className="text-slate-400 text-xs px-3 py-2">Low</TableHead>
                            <TableHead className="text-slate-400 text-xs px-3 py-2">Informational</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(data[mode].severity_matrix || {}).map(([pred, actuals]) => (
                            <TableRow key={pred} className="border-slate-800/40">
                              <TableCell className="px-3 py-2 font-mono text-xs font-bold text-slate-200">
                                {pred}
                              </TableCell>
                              <TableCell className="px-3 py-2 font-mono text-xs">
                                {actuals['Critical'] || 0}
                              </TableCell>
                              <TableCell className="px-3 py-2 font-mono text-xs">
                                {actuals['High'] || 0}
                              </TableCell>
                              <TableCell className="px-3 py-2 font-mono text-xs">
                                {actuals['Medium'] || 0}
                              </TableCell>
                              <TableCell className="px-3 py-2 font-mono text-xs">
                                {actuals['Low'] || 0}
                              </TableCell>
                              <TableCell className="px-3 py-2 font-mono text-xs">
                                {actuals['Informational'] || 0}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Tab 5: Grounding & Confidence calibration */}
        {activeTab === 'grounding' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {modes.map((mode) => (
              <Card key={mode} className="bg-[#0b1120]/80 border-slate-800/80 p-5 space-y-4">
                <h3 className="text-sm font-bold text-white font-mono pb-2 border-b border-slate-800/60">
                  {mode}
                </h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <h4 className="font-semibold text-cyan-400 uppercase tracking-wider text-[11px] mb-2">
                      Grounding Quality
                    </h4>
                    <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Fully/Partially Grounded:</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          {data[mode].partially_grounded ?? 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Generic but Valid:</span>
                        <span className="font-mono text-amber-400 font-bold">
                          {data[mode].generic ?? 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Hallucinated Context:</span>
                        <span className="font-mono text-red-400 font-bold">
                          {data[mode].hallucinated ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-purple-400 uppercase tracking-wider text-[11px] mb-2">
                      Confidence Calibration
                    </h4>
                    <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Mean Confidence (Correct):</span>
                        <span className="font-mono text-slate-200 font-bold">
                          {data[mode].metrics.mean_conf_correct
                            ? `${(data[mode].metrics.mean_conf_correct * 100).toFixed(1)}%`
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Mean Confidence (Incorrect):</span>
                        <span className="font-mono text-slate-200 font-bold">
                          {data[mode].metrics.mean_conf_incorrect
                            ? `${(data[mode].metrics.mean_conf_incorrect * 100).toFixed(1)}%`
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 6: Contract-Level Raw Results */}
        {activeTab === 'contracts' && (
          <Card className="bg-[#0b1120]/90 border-slate-800/80 shadow-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-800/60">
              <CardTitle className="text-sm font-semibold text-slate-100">
                Individual Contract Diagnostic Traces
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800/80 hover:bg-transparent">
                    <TableHead className="text-slate-400 text-xs px-4 py-3">Contract</TableHead>
                    <TableHead className="text-slate-400 text-xs px-4 py-3">Mode</TableHead>
                    <TableHead className="text-slate-400 text-xs px-4 py-3">Model</TableHead>
                    <TableHead className="text-slate-400 text-xs px-4 py-3">Prompt</TableHead>
                    <TableHead className="text-slate-400 text-xs px-4 py-3">Vulnerable?</TableHead>
                    <TableHead className="text-slate-400 text-xs px-4 py-3">Vulnerability</TableHead>
                    <TableHead className="text-slate-400 text-xs px-4 py-3">Severity</TableHead>
                    <TableHead className="text-slate-400 text-xs px-4 py-3">Fallback?</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rawData
                    .filter(
                      (r) => (r.dataset || 'Internal Diagnostic Suite') === selectedDataset
                    )
                    .map((r, i) => (
                      <TableRow
                        key={i}
                        className="border-slate-800/60 hover:bg-slate-800/30 transition-colors"
                      >
                        <TableCell className="px-4 py-3 font-mono text-xs text-slate-100">
                          {r.contract}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-xs text-slate-400">{r.mode}</TableCell>
                        <TableCell className="px-4 py-3 text-xs text-slate-400">{r.model}</TableCell>
                        <TableCell className="px-4 py-3 text-xs text-slate-400">
                          {r.prompt || 'P1'}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-xs font-semibold">
                          {r.is_vulnerable === true ? (
                            <span className="text-red-400">Yes</span>
                          ) : r.is_vulnerable === false ? (
                            <span className="text-emerald-400">No</span>
                          ) : (
                            <span className="text-slate-500">Error</span>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 font-mono text-xs text-slate-300">
                          {r.vulnerability || '—'}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-xs">{r.severity || '—'}</TableCell>
                        <TableCell className="px-4 py-3 text-xs text-slate-400">
                          {r.fallback_used ? 'Yes' : 'No'}
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
