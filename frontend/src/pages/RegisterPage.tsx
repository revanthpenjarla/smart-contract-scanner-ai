import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldCheck, Lock, Mail, UserPlus, AlertCircle, Shield } from 'lucide-react';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { email, password, role });
      login(res.data.access_token, res.data.user);
      navigate(res.data.user.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err: unknown) {
      const resData = (err as { response?: { data?: { detail?: unknown } } })?.response?.data;
      let msg = resData?.detail;
      if (Array.isArray(msg)) {
        msg = msg[0]?.msg;
      }
      setError(
        typeof msg === 'string'
          ? msg
          : 'Registration failed. The authentication service may be unavailable.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060a12] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-cyan-600/10 to-purple-600/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-xl shadow-cyan-500/20 mb-1">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            Create SMAI Account
          </h1>
          <p className="text-sm text-slate-400">
            Initialize your auditor workspace and security permissions
          </p>
        </div>

        {/* Register Card */}
        <Card className="border-slate-800/80 bg-[#0c1222]/90 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1.5 pb-4">
            <CardTitle className="text-lg text-slate-100 font-semibold">
              Register Credentials
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Select your system role to configure analysis and scanning permissions
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                    placeholder="auditor@security.org"
                    className="pl-9 bg-slate-900/80 border-slate-700/80 text-slate-100 placeholder:text-slate-500 focus-visible:ring-cyan-500/40 text-xs h-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    required
                    placeholder="Min. 8 characters"
                    className="pl-9 bg-slate-900/80 border-slate-700/80 text-slate-100 placeholder:text-slate-500 focus-visible:ring-cyan-500/40 text-xs h-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>Role Permission Level</span>
                  <span className="text-[10px] text-cyan-400 font-mono">RBAC Enforced</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('USER')}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs transition-all ${
                      role === 'USER'
                        ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Shield className="w-4 h-4 shrink-0 text-cyan-400" />
                    <div>
                      <div className="font-semibold text-slate-200">User</div>
                      <div className="text-[10px] text-slate-500">Scan & audit contracts</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('ADMIN')}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs transition-all ${
                      role === 'ADMIN'
                        ? 'border-purple-500/60 bg-purple-950/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0 text-purple-400" />
                    <div>
                      <div className="font-semibold text-slate-200">Admin</div>
                      <div className="text-[10px] text-slate-500">Full audit console</div>
                    </div>
                  </button>
                </div>
              </div>

              {error && (
                <Alert className="bg-red-950/40 border-red-800/60 text-red-300 py-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <AlertDescription className="text-xs ml-2">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold text-xs h-10 shadow-lg shadow-cyan-950/50 transition-all gap-1.5"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" /> Register Account
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="pt-2 border-t border-slate-800/60 flex flex-col gap-2 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold underline-offset-4 hover:underline">
                Sign in to your workspace
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
