import { Heart, Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-reputation-black text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1 */}
          <div>
            <h3 className="text-xl font-display mb-4">Taylor Swift Store</h3>
            <p className="text-gray-400 text-sm">
              Tienda oficial de merchandise de Taylor Swift. Todos los productos
              son oficiales y de alta calidad.
            </p>
          </div>

          {/* Columna 2 */}
          <div>
            <h4 className="font-semibold mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="/productos"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Productos
                </a>
              </li>
              <li>
                <a
                  href="/categorias"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Categorías
                </a>
              </li>
              <li>
                <a
                  href="/carrito"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Carrito
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <h4 className="font-semibold mb-4">Ayuda</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/contacto"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contacto
                </a>
              </li>
              <li>
                <a
                  href="/envios"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Envíos
                </a>
              </li>
              <li>
                <a
                  href="/devoluciones"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Devoluciones
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4 */}
          <div>
            <h4 className="font-semibold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/taylorswift"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://twitter.com/taylorswift13"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://facebook.com/taylorswift"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p className="flex items-center justify-center space-x-1">
            <span>Hecho con</span>
            <Heart size={16} className="text-red-500 fill-current" />
            <span>por Swifties para Swifties © 2025</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
