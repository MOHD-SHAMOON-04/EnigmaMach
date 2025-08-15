import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'

export default function Header() {
  const [nav, setNav] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNav(prev => !prev);
  }

  const closeNav = () => setNav(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        closeNav();
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, []);

  const navLinks = [
    {
      to: "/",
      label: "Home",
      icon: (
        <svg className="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      to: "/enigma",
      label: "Try Machine",
      icon: (
        <svg className="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      to: "/new-machine",
      label: "Create New",
      icon: (
        <svg className="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      isSpecial: true
    }
  ];

  return (
    <header className='bg-zinc-900/90 backdrop-blur-sm border-b border-slate-700/50 shadow-lg sticky top-0 z-50'>
      <div className='flex py-4 px-6 justify-between items-center max-w-7xl mx-auto'>
        <Link to="/" className="group">
          <h1 className='text-xl lg:text-2xl font-bold text-slate-50 group-hover:text-indigo-300 transition-colors duration-300'>
            The <span className="text-indigo-400">Enigma</span> Machine
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ease-in-out font-medium ${isActive(link.to)
                  ? link.isSpecial
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : link.isSpecial
                    ? 'text-slate-200 hover:text-white hover:bg-emerald-600/20 border border-transparent hover:border-emerald-500/30'
                    : 'text-slate-200 hover:text-white hover:bg-slate-700/50 border border-transparent hover:border-slate-600/30'
                }`}
            >
              <span className={`${isActive(link.to)
                  ? link.isSpecial
                    ? 'text-emerald-400'
                    : 'text-indigo-400'
                  : link.isSpecial
                    ? 'text-slate-400 group-hover:text-emerald-400'
                    : 'text-slate-400 group-hover:text-indigo-400'
                }`}>
                {link.icon}
              </span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className='relative bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 rounded-xl transition-all duration-300 ease-in-out p-3 shadow-lg hover:shadow-xl border border-slate-600/30 flex items-center justify-center md:hidden'
          onClick={handleClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="currentColor"
            className={`transition-all duration-300 ease-in-out ${nav ? 'rotate-90 opacity-0 scale-0' : 'rotate-0 opacity-100 scale-100'}`}
            style={{ position: nav ? 'absolute' : 'relative' }}
          >
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="currentColor"
            className={`transition-all duration-300 ease-in-out ${nav ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-0'}`}
            style={{ position: nav ? 'relative' : 'absolute' }}
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </button>

        {/* Mobile Navigation Menu */}
        {nav && (
          <nav
            ref={navRef}
            className="absolute z-50 bg-slate-800/95 backdrop-blur-lg flex flex-col top-full right-6 mt-2 p-2 gap-1 rounded-2xl shadow-2xl border border-slate-600/30 min-w-[220px] animate-in slide-in-from-top-2 duration-300 md:hidden">

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeNav}
                className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ease-in-out font-medium ${isActive(link.to)
                    ? link.isSpecial
                      ? 'text-white bg-emerald-600/30 border border-emerald-500/40'
                      : 'text-white bg-indigo-600/30 border border-indigo-500/40'
                    : link.isSpecial
                      ? 'text-slate-200 hover:text-white bg-transparent hover:bg-emerald-600/20 border border-transparent'
                      : 'text-slate-200 hover:text-white bg-transparent hover:bg-slate-700/50 border border-transparent'
                  }`}
              >
                <span className={`${isActive(link.to)
                    ? link.isSpecial
                      ? 'text-emerald-400'
                      : 'text-indigo-400'
                    : link.isSpecial
                      ? 'text-slate-400 group-hover:text-emerald-400'
                      : 'text-slate-400 group-hover:text-indigo-400'
                  }`}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            ))}

            <div className="h-px bg-slate-600/50 mx-2 my-1"></div>
          </nav>
        )}
      </div>
    </header>
  )
}