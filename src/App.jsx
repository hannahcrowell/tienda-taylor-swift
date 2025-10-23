function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lover-pink via-the-tortured-poets-department to-1989-blue flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-display text-midnights-purple mb-2">
            Taylor Swift
          </h1>
          <h2 className="text-xl text-the-tortured-poets-department">
            Tienda Oficial
          </h2>
        </div>

        <div className="space-y-3">
          <button className="btn-primary w-full">💜 Explorar Productos</button>
          <button className="btn-secondary w-full">✨ Crear Cuenta</button>
          <button className="btn-danger w-full">🗑️ Eliminar</button>
        </div>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Buscar productos de Taylor..."
            className="input-field"
          />
        </div>

        <div className="grid gap-3 mt-6">
          <div className="product-card p-4 border-l-4 border-midnights-purple">
            <h3 className="font-semibold text-lg text-midnights-purple">
              Midnights Vinyl
            </h3>
            <p className="text-gray-600 text-sm">Edición Moonstone Blue</p>
            <p className="text-midnights-purple font-bold text-xl mt-2">
              $899 MXN
            </p>
          </div>

          <div className="product-card p-4 border-l-4 border-the-tortured-poets-department">
            <h3 className="font-semibold text-lg text-the-tortured-poets-department">
              TTPD Cardigan
            </h3>
            <p className="text-gray-600 text-sm">
              The Tortured Poets Department
            </p>
            <p className="text-the-tortured-poets-department font-bold text-xl mt-2">
              $1,899 MXN
            </p>
          </div>

          <div className="product-card p-4 border-l-4 border-red-classic">
            <h3 className="font-semibold text-lg text-red-classic">
              Red Scarf
            </h3>
            <p className="text-gray-600 text-sm">
              All Too Well (10 Minute Version)
            </p>
            <p className="text-red-classic font-bold text-xl mt-2">$349 MXN</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
