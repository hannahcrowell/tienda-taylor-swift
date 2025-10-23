import { useEffect, useState } from "react";
import { adminService } from "../../services/admin.service";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { Edit, Trash2, Plus } from "lucide-react";

export default function CategoriesAdmin() {
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    slug: "",
    descripcion: "",
    esta_activo: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    const result = await adminService.getAllCategories();

    if (result.success) {
      setCategorias(result.categorias);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Auto-generar slug desde el nombre
    if (name === "nombre") {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let result;
    if (editingCategory) {
      result = await adminService.updateCategory(editingCategory.id, formData);
    } else {
      result = await adminService.createCategory(formData);
    }

    if (result.success) {
      alert(editingCategory ? "Categoría actualizada" : "Categoría creada");
      setShowModal(false);
      resetForm();
      loadCategories();
    } else {
      alert("Error: " + result.error);
    }
  };

  const handleEdit = (categoria) => {
    setEditingCategory(categoria);
    setFormData({
      nombre: categoria.nombre,
      slug: categoria.slug,
      descripcion: categoria.descripcion || "",
      esta_activo: categoria.esta_activo,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar esta categoría?")) return;

    const result = await adminService.deleteCategory(id);
    if (result.success) {
      alert("Categoría eliminada");
      loadCategories();
    } else {
      alert("Error: " + result.error);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      slug: "",
      descripcion: "",
      esta_activo: true,
    });
    setEditingCategory(null);
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={loadCategories} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-display font-bold text-midnights-purple">
          Gestión de Categorías
        </h1>
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Nueva Categoría
        </Button>
      </div>

      {/* Tabla de categorías */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td className="px-6 py-4 font-medium">{categoria.nombre}</td>
                <td className="px-6 py-4 text-gray-600">{categoria.slug}</td>
                <td className="px-6 py-4 text-gray-600">
                  {categoria.descripcion || "-"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      categoria.esta_activo
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {categoria.esta_activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(categoria)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(categoria.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de formulario */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-display font-bold mb-6">
              {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre de la Categoría"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />

              <Input
                label="Slug (URL amigable)"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows="3"
                  className="input-field"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="esta_activo"
                  checked={formData.esta_activo}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700">
                  Categoría activa
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary" className="flex-1">
                  {editingCategory ? "Actualizar" : "Crear"} Categoría
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
