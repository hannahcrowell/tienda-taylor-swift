import { ShoppingCart, User, LogOut, Menu, Music } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import logoImage from "../../assets/taytay.jpg"; // Import your image

export default function Header() {
  const { user, profile, signOut } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <img src={logoImage} alt="Logo" className="h-8 w-auto" />{" "}
            {/* Add your image here */}
            <div>
              <h1 className=" text-midnights-purple">Taylor Swift</h1>
              <p className="text-xs text-gray-500">Tienda Oficial</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="/"
              className="text-gray-700 hover:text-midnights-purple transition-colors font-semibold"
            >
              Productos
            </a>
            <a
              href="/categorias"
              className="text-gray-700 hover:text-midnights-purple transition-colors font-semibold"
            >
              Categorías
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Carrito */}
            <a
              href="/carrito"
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart className="text-gray-700" size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-classic text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </a>

            {/* Usuario */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User className="text-gray-700" size={24} />
                  <span className="hidden md:block text-sm font-semibold text-gray-700">
                    {profile?.nombre_completo || user.email}
                  </span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                    <a
                      href="/perfil"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Mi Perfil
                    </a>
                    <a
                      href="/ordenes"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Mis Órdenes
                    </a>
                    {profile?.rol === "admin" && (
                      <a
                        href="/admin"
                        className="block px-4 py-2 text-midnights-purple hover:bg-gray-100 transition-colors font-semibold"
                      >
                        Panel Admin
                      </a>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a href="/login" className="btn-primary text-sm py-2 px-4">
                Iniciar Sesión
              </a>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu className="text-gray-700" size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <a
              href="/"
              className="block py-2 text-gray-700 hover:text-midnights-purple font-semibold"
            >
              Productos
            </a>
            <a
              href="/categorias"
              className="block py-2 text-gray-700 hover:text-midnights-purple font-semibold"
            >
              Categorías
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
