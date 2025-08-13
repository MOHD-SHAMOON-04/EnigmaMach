import { useState } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from './constants'

export default function NewMachine() {
  const [email, setEmail] = useState('');
  const [seed, setSeed] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/enigma/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, seed }),
      });

      if (response.ok) {
        setSuccess(true);
        setEmail('');
        setSeed('');
      } else {
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setSuccess(false);
    setError('');
    setEmail('');
    setSeed('');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-50 mb-6">
            Create Your <span className="text-emerald-400">Custom</span> Machine
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Generate a unique Enigma machine configuration using your personal seed.
            We'll send the machine details to your email for secure access.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form Section */}
          <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-600/50 shadow-2xl">
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    We'll send your machine configuration to this email
                  </p>
                </div>

                <div>
                  <label htmlFor="seed" className="block text-sm font-medium text-slate-300 mb-2">
                    Machine Seed
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <input
                      type="text"
                      id="seed"
                      value={seed}
                      onChange={(e) => setSeed(e.target.value)}
                      required
                      minLength={3}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your unique seed phrase..."
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Any text (min 3 characters). Same seed = same machine configuration
                  </p>
                </div>

                {error && (
                  <div className="bg-red-900/20 border border-red-600/30 p-4 rounded-xl">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Generating Machine...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                      Generate My Machine
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Success Message */
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-50">Machine Generated!</h2>
                <p className="text-slate-300 leading-relaxed">
                  Your custom Enigma machine has been successfully generated.
                  Check your email for the machine configuration and instructions.
                </p>
                <div className="bg-emerald-900/20 border border-emerald-600/30 p-4 rounded-xl">
                  <div className="flex items-center gap-2 justify-center">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-emerald-300 text-sm font-medium">
                      Email sent successfully!
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="bg-slate-600 hover:bg-slate-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300"
                >
                  Create Another Machine
                </button>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-600">
              <h3 className="text-xl font-semibold text-slate-50 mb-4">How It Works</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-emerald-600 text-white text-sm rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-0.5">1</span>
                  <div>
                    <h4 className="font-medium text-slate-200">Enter Details</h4>
                    <p className="text-slate-400 text-sm">Provide your email and unique seed phrase</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-emerald-600 text-white text-sm rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-0.5">2</span>
                  <div>
                    <h4 className="font-medium text-slate-200">Server Generation</h4>
                    <p className="text-slate-400 text-sm">Our server creates unique rotor and reflector configurations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-emerald-600 text-white text-sm rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-0.5">3</span>
                  <div>
                    <h4 className="font-medium text-slate-200">Email Delivery</h4>
                    <p className="text-slate-400 text-sm">Receive machine configuration and usage instructions</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-900/20 border border-amber-600/30 p-6 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-amber-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-amber-300 mb-2">Important Notes</h3>
                  <ul className="text-amber-200 text-sm space-y-1">
                    <li>• Same seed always generates identical machine</li>
                    <li>• Keep your seed secure for machine reproduction</li>
                    <li>• Check spam folder if email doesn't arrive</li>
                    <li>• Machine configurations are deterministic</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}