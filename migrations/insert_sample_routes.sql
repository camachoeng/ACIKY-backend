-- Insert sample routes for Golden Routes (Rutas Doradas)
-- These are the routes that were previously hardcoded in goldenroutes.html

INSERT INTO routes (name, origin, destination, description, frequency, status, participants_count, spaces_established, image_url) VALUES
('Ruta Nueva Gerona', 'La Habana', 'Isla de la Juventud - Nueva Gerona', 'Llevando yoga a la Isla de la Juventud, tierra de historia, naturaleza exuberante y espíritu renovador.', 'Anual', 'active', 150, 3, NULL),

('Ruta Varadero', 'La Habana', 'Varadero', 'Llevando yoga a Varadero, un paraíso de playas y relax.', 'Anual', 'active', 50, 1, NULL),

('Ruta Holguín', 'La Habana', 'Holguín', 'Llevando la práctica a Holguín, donde la naturaleza y la cultura se entrelazan en un abrazo transformador.', 'Anual', 'active', 60, 4, NULL),

('Ruta Las Tunas', 'La Habana', 'Las Tunas - Manatí', 'Llevando la práctica a Las Tunas y Manatí, donde la tradición campesina y el espíritu de comunidad abren caminos para el crecimiento interior.', 'Anual', 'active', 100, 3, NULL),

('Ruta Camagüeyana', 'La Habana', 'Camagüey', 'Expandiendo hacia la región ganadera, llevando paz interior a tierras de abundancia.', 'Anual', 'active', 30, 1, NULL),

('Ruta Baracoa', 'La Habana', 'Guantánamo - Baracoa', 'Llegando al oriente cubano, donde la música y la espiritualidad se encuentran naturalmente.', 'Anual', 'active', 150, 3, NULL),

('Ruta Contramaestre', 'La Habana', 'Santiago - Contramaestre', 'Próxima ruta hacia provincias con gran potencial espiritual y comunidades receptivas.', 'Marzo 2026', 'planning', 0, 0, NULL);

-- To run this migration:
-- mysql -u your_username -p yoga_db < migrations/insert_sample_routes.sql
-- OR copy and paste the INSERT statements into your MySQL client
