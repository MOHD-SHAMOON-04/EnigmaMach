import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 snap-start">
      {/* Hero Section */}
      <section className="px-4 py-12 lg:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-50 mb-6">
            The <span className="text-indigo-400">Enigma</span> Machine
          </h1>
          <p className="text-xl lg:text-2xl text-slate-300 mb-8 leading-relaxed">
            Experience the legendary encryption device that changed the course of history.
            Encrypt and decrypt messages using authentic Enigma machine mechanics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/enigma"
              className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center gap-2">
                Try the Machine
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link
              to="/new-machine"
              className="group bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Create New Machine
            </Link>
          </div>
        </div>
      </section>

      {/* What is Enigma Section */}
      <section className="px-4 py-16 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-50 text-center mb-12">
            What is the Enigma Machine?
          </h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-slate-300 text-lg leading-relaxed">
                The Enigma machine was an encryption device used extensively by Nazi Germany during World War II.
                It was considered unbreakable at the time, making it crucial for secure military communications.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed">
                The machine used a series of rotating wheels (rotors) and a plugboard to scramble messages.
                Each keypress would advance the rotors, creating a different encryption path for each letter.
              </p>
              <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
                <h3 className="text-xl font-semibold text-indigo-400 mb-3">Historical Impact</h3>
                <p className="text-slate-300">
                  The breaking of Enigma by Allied codebreakers, including Alan Turing at Bletchley Park,
                  is estimated to have shortened WWII by 2-4 years and saved millions of lives.
                </p>
              </div>
            </div>
            <div className="bg-slate-700/30 p-8 rounded-2xl border border-slate-600">
              <h3 className="text-2xl font-bold text-slate-50 mb-6">Key Components</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Rotors</h4>
                    <p className="text-slate-400 text-sm">Three rotating wheels that scramble each letter</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Plugboard</h4>
                    <p className="text-slate-400 text-sm">Additional letter swapping for extra security</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Reflector</h4>
                    <p className="text-slate-400 text-sm">Sends the signal back through the rotors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-50 text-center mb-12">
            How to Use the Machine
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-600">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                <h3 className="text-xl font-semibold text-slate-50">Set Up Rotors</h3>
              </div>
              <p className="text-slate-300">
                Configure the three rotors to your desired starting positions. Each rotor can be set from 1-26,
                representing the 26 letters of the alphabet.
              </p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-600">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                <h3 className="text-xl font-semibold text-slate-50">Configure Plugboard</h3>
              </div>
              <p className="text-slate-300">
                Optionally set up letter pairs on the plugboard. This adds an extra layer of encryption
                by swapping certain letters before and after the rotor processing.
              </p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-600">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                <h3 className="text-xl font-semibold text-slate-50">Type Your Message</h3>
              </div>
              <p className="text-slate-300">
                Use your keyboard or click the virtual keyboard to input your message.
                Watch as each letter lights up and gets encrypted in real-time.
              </p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-600">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                <h3 className="text-xl font-semibold text-slate-50">Share & Decrypt</h3>
              </div>
              <p className="text-slate-300">
                Copy the encrypted message and share it. To decrypt, use the same rotor and plugboard settings,
                then type the encrypted message to get the original back.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-amber-900/20 border border-amber-600/30 p-6 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-amber-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className="font-semibold text-amber-300 mb-2">Important Note</h3>
                <p className="text-amber-200 text-sm">
                  The Enigma machine is reciprocal - the same settings that encrypt a message will decrypt it.
                  Both sender and receiver must have identical rotor positions and plugboard configurations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Create New Machine Section */}
      <section className="px-4 py-16 bg-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-50 mb-6">
            Create Your Own Machine
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Generate a unique Enigma machine using a custom seed. Each seed creates a completely
            different rotor and reflector configuration for maximum security.
          </p>

          <div className="bg-slate-700/50 p-8 rounded-2xl border border-slate-600 mb-8">
            <h3 className="text-2xl font-semibold text-slate-50 mb-6">Seed-Based Generation</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-emerald-400 mb-2">Unique Seed</h4>
                <p className="text-slate-300 text-sm">
                  Enter any text as your seed - same seed always generates the same machine
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-emerald-400 mb-2">Custom Wirings</h4>
                <p className="text-slate-300 text-sm">
                  Server generates unique rotor and reflector wirings based on your seed
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-emerald-400 mb-2">Share & Use</h4>
                <p className="text-slate-300 text-sm">
                  Share your seed with others to use the same machine configuration
                </p>
              </div>
            </div>
          </div>

          {/* Seed Input Preview */}
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-600/50 mb-8 max-w-md mx-auto">
            <h4 className="text-lg font-semibold text-slate-200 mb-4">How it Works</h4>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-indigo-600 text-white text-sm rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-0.5">1</span>
                <p className="text-slate-300 text-sm">Enter a unique seed (password, phrase, or any text)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-indigo-600 text-white text-sm rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-0.5">2</span>
                <p className="text-slate-300 text-sm">Server generates custom machine configuration</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-indigo-600 text-white text-sm rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-0.5">3</span>
                <p className="text-slate-300 text-sm">Use your personalized Enigma machine instantly</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/new-machine"
              className="group inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-6 h-6 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              Generate Machine
            </Link>

            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Same seed = Same machine</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home;