-- Insert initial spaces from the static HTML

-- 1. Casa-Museo de Asia (Community Space)
INSERT INTO spaces (name, image, address, phone, email, location) VALUES 
('Casa-Museo de Asia', '../../images/activities/clases.jpg', 'Calle Mercaderes #111 / Obispo y Obrapía, Habana Vieja, La Habana', '+5350759360', 'acikyrespiray@gmail.com', 'https://maps.app.goo.gl/18LMji1CtFU6fzhu6');

-- Get the ID of Casa-Museo de Asia
SET @casa_museo_id = LAST_INSERT_ID();

-- Add disciplines for Casa-Museo de Asia
INSERT INTO spaces_disciplines (space_id, discipline_name) VALUES 
(@casa_museo_id, 'Kundalini Yoga'),
(@casa_museo_id, 'Meditación');

-- 2. DLuzVerde (Narayan Nam)
INSERT INTO spaces (name, image, address, phone, email, location) VALUES 
('DLuzVerde', '../../images/spaces/dluzverde.jpg', 'Calle 2da #275 /Santa Catalina y Albear El Cerro, Cerro, La Habana', '+5350759360', 'somosdluzverde@gmail.com', 'https://maps.app.goo.gl/Lih5aYjaWzC3HD7u6');

-- Get the ID of DLuzVerde
SET @dluzverde_id = LAST_INSERT_ID();

-- Add disciplines for DLuzVerde
INSERT INTO spaces_disciplines (space_id, discipline_name) VALUES 
(@dluzverde_id, 'Kundalini Yoga'),
(@dluzverde_id, 'Medicina Natural y Tradicional'),
(@dluzverde_id, 'Sonoterapia'),
(@dluzverde_id, 'Proceso de Desarrollo Personal'),
(@dluzverde_id, 'Numerología');

-- 3. Centro Arbol (Dass Mani, Indra Kirti y Gurudeep)
INSERT INTO spaces (name, image, address, phone, email, location) VALUES 
('Centro Arbol', '../../images/spaces/centroarbol.jpg', 'Ave 37#14022 /140 y 142. Coco solo. Marianao, La Habana', '+5353869750', 'indrakirtikaurk@gmail.com', 'https://maps.app.goo.gl/MUqKywfRknWp2NGU8');

-- Get the ID of Centro Arbol
SET @centro_arbol_id = LAST_INSERT_ID();

-- Add disciplines for Centro Arbol
INSERT INTO spaces_disciplines (space_id, discipline_name) VALUES 
(@centro_arbol_id, 'Kundalini Yoga'),
(@centro_arbol_id, 'Sadhanas Matinales'),
(@centro_arbol_id, 'Meditaciones con Mantra'),
(@centro_arbol_id, 'Gurdwara'),
(@centro_arbol_id, 'Festival Wahe Gurú (Mayo y Noviembre)'),
(@centro_arbol_id, 'Sonoterapia');

-- 4. Anahata Havana (Mahan Devi)
INSERT INTO spaces (name, image, address, phone, email, location) VALUES 
('Anahata Havana', '../../images/spaces/anahatahavana.jpg', 'Merced #166 / Habana y Damas, Habana Vieja, La Habana', '+5353020375', 'mahandevi612@gmail.com', 'https://maps.app.goo.gl/TjqYTpxTxybSs57h7');

-- Get the ID of Anahata Havana
SET @anahata_id = LAST_INSERT_ID();

-- Add disciplines for Anahata Havana
INSERT INTO spaces_disciplines (space_id, discipline_name) VALUES 
(@anahata_id, 'Kundalini Yoga');

-- Note: To link instructors to spaces, you need to get their user IDs from the users table
-- Example (uncomment and adjust IDs as needed):
-- INSERT INTO spaces_instructors (space_id, user_id) VALUES (@dluzverde_id, <narayan_nam_user_id>);
-- INSERT INTO spaces_instructors (space_id, user_id) VALUES (@centro_arbol_id, <dass_mani_user_id>);
-- INSERT INTO spaces_instructors (space_id, user_id) VALUES (@centro_arbol_id, <indra_kirti_user_id>);
-- INSERT INTO spaces_instructors (space_id, user_id) VALUES (@centro_arbol_id, <gurudeep_user_id>);
-- INSERT INTO spaces_instructors (space_id, user_id) VALUES (@anahata_id, <mahan_devi_user_id>);
