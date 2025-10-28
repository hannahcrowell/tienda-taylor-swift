-- ==========================================
-- TIENDA TAYLOR SWIFT - DATOS DE PRUEBA
-- Autor: Hannah Crowell
-- Descripción: Productos iniciales para la tienda
-- ==========================================

-- Insertar categorías
INSERT INTO categorias (nombre, slug, descripcion, esta_activo) VALUES
('Discos', 'discos', 'Álbumes de estudio y ediciones especiales', true),
('Vinilos', 'vinilos', 'Ediciones en vinilo de los álbumes', true),
('Cardigans', 'cardigans', 'Cardigans inspirados en folklore y evermore', true),
('Ropa', 'ropa', 'Camisetas, hoodies y más merch oficial', true);

-- Insertar productos
DO $$
DECLARE
  cat_discos UUID;
  cat_vinilos UUID;
  cat_cardigans UUID;
  cat_ropa UUID;
BEGIN
  SELECT id INTO cat_discos FROM categorias WHERE slug = 'discos';
  SELECT id INTO cat_vinilos FROM categorias WHERE slug = 'vinilos';
  SELECT id INTO cat_cardigans FROM categorias WHERE slug = 'cardigans';
  SELECT id INTO cat_ropa FROM categorias WHERE slug = 'ropa';

  -- DISCOS
  INSERT INTO productos (categoria_id, nombre, slug, descripcion, precio, inventario, url_imagen, esta_activo, calificacion_promedio) VALUES
  (cat_discos, 'Midnights (3am Edition)', 'midnights-3am', 'Álbum completo con 7 tracks adicionales', 599.00, 50, 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=500', true, 4.9),
  (cat_discos, '1989 (Taylor''s Version)', '1989-tv', 'Re-grabación del icónico álbum pop', 549.00, 45, 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500', true, 5.0),
  (cat_discos, 'folklore (deluxe version)', 'folklore-deluxe', 'Edición deluxe con "the lakes"', 499.00, 30, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500', true, 4.8),
  (cat_discos, 'evermore (deluxe edition)', 'evermore-deluxe', 'El álbum hermano de folklore', 499.00, 35, 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=500', true, 4.7),
  (cat_discos, 'Red (Taylor''s Version)', 'red-tv', 'Con All Too Well (10 Minute Version)', 549.00, 40, 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500', true, 4.9);

  -- VINILOS
  INSERT INTO productos (categoria_id, nombre, slug, descripcion, precio, inventario, url_imagen, esta_activo, calificacion_promedio) VALUES
  (cat_vinilos, 'Midnights Vinyl (Moonstone Blue)', 'midnights-vinyl-blue', 'Vinilo edición limitada azul', 899.00, 20, 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500', true, 5.0),
  (cat_vinilos, 'folklore Vinyl (in the trees)', 'folklore-vinyl-trees', 'Vinilo con arte exclusivo', 849.00, 15, 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500', true, 4.9),
  (cat_vinilos, '1989 TV Vinyl (Tangerine)', '1989-vinyl-tangerine', 'Vinilo color tangerina', 899.00, 25, 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=500', true, 4.8);

  -- CARDIGANS
  INSERT INTO productos (categoria_id, nombre, slug, descripcion, precio, inventario, url_imagen, esta_activo, calificacion_promedio) VALUES
  (cat_cardigans, 'folklore cardigan (original)', 'folklore-cardigan-original', 'El cardigan icónico con estrellas', 1899.00, 12, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500', true, 5.0),
  (cat_cardigans, 'evermore cardigan (ivy green)', 'evermore-cardigan-green', 'Cardigan verde evermore', 1899.00, 10, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500', true, 4.9);

  -- ROPA
  INSERT INTO productos (categoria_id, nombre, slug, descripcion, precio, inventario, url_imagen, esta_activo, calificacion_promedio) VALUES
  (cat_ropa, 'Anti-Hero T-Shirt', 'anti-hero-tshirt', 'Camiseta con letras de Anti-Hero', 449.00, 60, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', true, 4.6),
  (cat_ropa, 'Eras Tour Hoodie', 'eras-tour-hoodie', 'Hoodie oficial del Eras Tour', 899.00, 40, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', true, 4.8),
  (cat_ropa, 'Red Scarf Tote Bag', 'red-scarf-tote', 'Bolsa tote All Too Well', 349.00, 70, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500', true, 4.4);

END $$;