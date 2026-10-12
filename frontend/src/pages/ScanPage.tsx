import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor, { OnMount } from '@monaco-editor/react';
import type * as monaco from 'monaco-editor';
import AppLayout from '@/components/AppLayout';
import api from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ANALYSIS_MODES,
  CONTRACT_TEMPLATES,
  PIPELINE_STEPS,
  AnalysisModeId,
} from '@/lib/design-tokens';
import {
  UploadCloud,
  FileCode2,
  AlertCircle,
  Zap,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function ScanPage() {
  const navigate = useNavigate();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const [contractName, setContractName] = useState('ReentrancyVault.sol');
  const [selectedMode, setSelectedMode] = useState<AnalysisModeId>('C');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setContractName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = (ev.target?.result as string) ?? '';
      if (editorRef.current) {
        editorRef.current.setValue(text);
      }
    };
    reader.readAsText(file);
  };

  const loadTemplate = (tmpl: (typeof CONTRACT_TEMPLATES)[number]) => {
    setContractName(`${tmpl.name.replace(/\s+/g, '')}.sol`);
    if (editorRef.current) {
      editorRef.current.setValue(tmpl.code);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    const sourceCode = editorRef.current?.getValue() || '';

    if (!sourceCode.trim()) {
      setError('Please provide or upload Solidity source code for analysis.');
      return;
    }

    setLoading(true);
    setActiveStep(1);

    // Simulate multi-step agent progression during dispatch
    const stepTimer = setInterval(() => {
      setActiveStep((prev) => (prev < 5 ? prev + 1 : prev));
    }, 400);

    try {
      const res = await api.post('/api/analysis', {
        contract_name: contractName,
        source_code: sourceCode,
        mode: selectedMode,
      });
      clearInterval(stepTimer);
      navigate(`/report/${res.data.analysis_id}`);
    } catch (err: unknown) {
      clearInterval(stepTimer);
      const msg = (err as { response?: { data?: { detail?: string } } }).response?.data?.detail;
      setError(msg || 'Scan pipeline failed. Please ensure the backend server is running.');
      setLoading(false);
      setActiveStep(0);
    }
  };

  return (
    <AppLayout
      title="Contract Audit Studio"
      subtitle="Configure multi-agent analysis mode, load smart contract vectors, and execute AST & LLM reasoning"
    >
      <div className="space-y-6">
        {/* Top: Mode Selection Strip */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Select Pipeline Execution Mode
              </h2>
              <p className="text-xs text-slate-400">
                Choose the depth of verification agents running against your Solidity code.
              </p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 px-2 py-0.5 rounded">
              Active: Mode {selectedMode}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ANALYSIS_MODES.map((mode) => {
              const isSelected = selectedMode === mode.id;
              return (
                <div
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`cursor-pointer rounded-xl p-4 transition-all duration-200 border relative ${
                    isSelected
                      ? 'bg-gradient-to-b from-cyan-950/30 to-slate-900/90 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{mode.icon}</span>
                      <span className="font-semibold text-xs text-slate-100">{mode.name}</span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${mode.tagClass}`}>
                      {mode.tag}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    {mode.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
                    <span>Latency: {mode.latency}</span>
                    <span className={isSelected ? 'text-cyan-400 font-bold' : 'text-slate-400'}>
                      {isSelected ? '✓ Selected' : 'Click to select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contract Preset Library Drawer */}
        <div className="rounded-xl p-4 bg-slate-900/50 border border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold text-slate-200">
                Solidity Vector Presets & Vulnerability Test Cases
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              6 Verified Templates
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {CONTRACT_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => loadTemplate(tmpl)}
                className="group p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/50 text-left transition-all"
              >
                <div className="text-[11px] font-semibold text-slate-200 group-hover:text-cyan-300 truncate mb-1">
                  {tmpl.name}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-cyan-400/90">{tmpl.swc}</span>
                  <span
                    className={
                      tmpl.severity === 'Critical'
                        ? 'text-red-400'
                        : tmpl.severity === 'High'
                        ? 'text-orange-400'
                        : tmpl.severity === 'Medium'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }
                  >
                    {tmpl.severity}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="bg-red-950/40 border-red-900/60 text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}

        {/* Live Multi-Agent Execution Stepper (Active during scan) */}
        {loading && (
          <div className="rounded-xl p-5 bg-cyan-950/20 border border-cyan-800/60 shadow-[0_0_30px_rgba(6,182,212,0.15)] animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-xs font-semibold text-cyan-300">
                  Executing Multi-Agent Security Pipeline ({selectedMode === 'C' ? 'Full Hybrid' : selectedMode === 'B' ? 'Static + LLM' : 'Static AST'})
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">
                Agent {activeStep} of 5 Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {PIPELINE_STEPS.map((step) => {
                const isCurrent = activeStep === step.step;
                const isDone = activeStep > step.step;
                return (
                  <div
                    key={step.step}
                    className={`p-3 rounded-lg border transition-all ${
                      isCurrent
                        ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : isDone
                        ? 'bg-slate-900/80 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold">{step.icon} {step.name}</span>
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      {step.agent}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Monaco Editor Container */}
        <Card className="bg-[#090d16]/90 border-slate-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
          <CardHeader className="py-3 px-5 border-b border-slate-800/80 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FileCode2 className="w-4 h-4 text-cyan-400" />
              <Input
                type="text"
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
                placeholder="Contract.sol"
                className="h-8 max-w-[220px] bg-slate-900 border-slate-700 text-xs text-white font-mono"
              />
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                Solidity 0.8.x
              </span>
            </div>

            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 transition-colors">
                <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upload .sol</span>
                <input
                  type="file"
                  accept=".sol,.txt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>

              <Button
                type="button"
                onClick={() => handleSubmit()}
                disabled={loading}
                className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs h-8 px-4 gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Run Security Audit</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </>
                )}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="h-[520px] w-full border-b border-slate-800/80">
              <Editor
                height="100%"
                defaultLanguage="sol"
                theme="vs-dark"
                defaultValue={CONTRACT_TEMPLATES[0].code}
                onMount={handleEditorDidMount}
                options={{
                  fontSize: 13,
                  fontFamily: 'Fira Code, Menlo, Monaco, Consolas, monospace',
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true,
                  lineNumbers: 'on',
                  renderLineHighlight: 'all',
                  padding: { top: 12, bottom: 12 },
                }}
              />
            </div>
            <div className="px-5 py-2.5 bg-slate-950/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                Ready to evaluate via Ingress, AST Analyzer, Evidence Slicer, RAG Librarian & Skeptic LLM
              </span>
              <span>UTF-8 • Solidity • Ready</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
