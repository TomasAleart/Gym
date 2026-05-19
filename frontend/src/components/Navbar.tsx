interface NavbarProps {
  onLogout: () => void;
}

export function Navbar({ onLogout }: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm p-4 flex justify-between items-center px-8">
      <h1 className="text-xl font-bold text-blue-600">
        GymApp <span className="text-gray-400 text-sm font-normal">| Panel de Socios</span>
      </h1>
      <button 
        onClick={onLogout} 
        className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
      >
        Cerrar Sesión
      </button>
    </nav>
  );
}