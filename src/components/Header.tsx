import { Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'

export default function Header() {
  const [nav, setNav] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNav(prev => !prev);
  }

  const closeNav = () => setNav(false);

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

  return (
    <header className='flex py-2 px-6 justify-between items-center relative'>
      <h1
        role="button"
        tabIndex={0}
        onClick={handleClick}
        className='text-lg lg:text-3xl font-bold cursor-pointer'
      >
        Enigma Machine
      </h1>

      {nav && (
        <nav
          ref={navRef}
          className="absolute z-10 bg-slate-800 flex flex-col top-12 p-2 gap-2 text-center rounded-xl transition-all duration-300 ease-in-out opacity-100 scale-100">
          <Link
            to="/"
            onClick={closeNav}
            className="text-blue-200 bg-slate-700 hover:bg-slate-600 p-2 rounded">
            Home
          </Link>
          <Link
            to="/enigma"
            onClick={closeNav}
            className="text-blue-200 bg-slate-700 hover:bg-slate-600 p-2 rounded">
            Enigma
          </Link>
          {/* make this /enigma route dynamic by `/enigma:seed` */}
          <Link
            to="/new-machine"
            onClick={closeNav}
            className="text-blue-200 bg-slate-700 hover:bg-slate-600 p-2 rounded">
            Create New
          </Link>
        </nav>
      )}

      <button className='text-xs lg:text-sm font-mono bg-indigo-900 text-slate-50 rounded transition-all duration-300 ease-in-out py-2 px-4 hover:bg-indigo-800 active:bg-indigo-800 cursor-pointer'>
        Plugboard
      </button>
    </header>
  )
}