import { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, Key } from 'lucide-react';

const LoginView = () => {
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 'email') setStep('otp');
    else {
      // Logic for OTP verification
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-6">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="title-font text-3xl font-extrabold tracking-tighter mb-2">
            LITE<span className="text-accent">RIGHT</span> ACADEMY
          </div>
          <p className="text-text-secondary text-sm">Welcome back. Let's continue your journey.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-border">
          <form className="space-y-6" onSubmit={handleNext}>
            {step === 'email' ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-primary px-1">Email Address</label>
                  <div className="flex items-center gap-3 bg-secondary/50 border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-accent-light focus-within:border-accent">
                    <Mail className="h-5 w-5 text-text-secondary" />
                    <input 
                      type="email" 
                      placeholder="name@company.com" 
                      className="bg-transparent border-none outline-none w-full text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  We'll send you a One-Time Password (OTP) to verify your account.
                </p>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-primary px-1">Enter 6-digit OTP</label>
                  <div className="flex items-center gap-3 bg-secondary/50 border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-accent-light focus-within:border-accent">
                    <Key className="h-5 w-5 text-text-secondary" />
                    <input 
                      type="text" 
                      placeholder="0 0 0 0 0 0" 
                      maxLength="6"
                      className="bg-transparent border-none outline-none w-full text-sm tracking-[0.5em] font-mono text-center"
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Sent to <span className="font-bold text-text-primary">{email}</span>. Check your inbox.
                </p>
              </>
            )}

            <button type="submit" className="btn-primary w-full py-3.5 justify-center text-lg mt-4">
              {step === 'email' ? 'Send OTP' : 'Verify & Continue'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border flex flex-col items-center gap-4">
            <button className="text-sm text-text-secondary hover:text-accent font-medium transition-colors">
              Trouble logging in?
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-text-secondary">
          By signing in, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default LoginView;
