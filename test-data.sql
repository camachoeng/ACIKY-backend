-- ACIKY Test Data
-- Run this script in your MySQL database to add sample data

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, category, tags, featured_image, published, author_id, published_at, created_at) VALUES
('Bienvenidos a ACIKY', 'bienvenidos-a-aciky', 
'<h2>¡Sat Nam!</h2><p>Bienvenidos a la Asociación Cubana de Instructores de Kundalini Yoga. Somos una comunidad dedicada a difundir las enseñanzas del Kundalini Yoga en Cuba.</p><p>En ACIKY encontrarás clases, talleres, formación de instructores y una comunidad de yoguis comprometidos con su crecimiento personal y espiritual.</p>',
'Conoce ACIKY, la primera asociación de Kundalini Yoga en Cuba',
'Noticias',
'yoga,kundalini,cuba,aciky',
'images/blog/welcome.jpg',
true,
1,
NOW(),
NOW()),

('¿Qué es el Kundalini Yoga?', 'que-es-kundalini-yoga',
'<h2>La Yoga de la Conciencia</h2><p>El Kundalini Yoga, también conocido como la Yoga de la Conciencia, es una práctica milenaria que combina posturas físicas, técnicas de respiración, meditación y mantras.</p><h2>Beneficios</h2><p>• Reduce el estrés y la ansiedad</p><p>• Mejora la flexibilidad y fuerza</p><p>• Aumenta la vitalidad</p><p>• Desarrolla la claridad mental</p><p>• Fortalece el sistema nervioso</p>',
'Descubre qué es el Kundalini Yoga y cómo puede transformar tu vida',
'Educación',
'yoga,kundalini,beneficios,salud',
'images/blog/kundalini.jpg',
true,
1,
NOW(),
NOW()),

('Próximo Festival Wahe Guru 2025', 'festival-wahe-guru-2025',
'<h2>¡Nos vemos en el Festival!</h2><p>El Festival Wahe Guru es el evento más importante de Kundalini Yoga en Cuba. Este año celebraremos nuestra quinta edición con clases, talleres, música en vivo y mucho más.</p><p><strong>Fecha:</strong> Diciembre 2025</p><p><strong>Lugar:</strong> Por confirmar</p><p>¡No te lo pierdas!</p>',
'Anuncia el próximo Festival Wahe Guru 2025',
'Eventos',
'festival,eventos,kundalini',
'images/promos/wahe guru.png',
true,
1,
NOW(),
NOW());

-- Insert sample activities
INSERT INTO activities (name, description, short_description, schedule, duration, location, instructor_id, price, icon, difficulty_level, active, featured) VALUES
('Clase Matutina de Kundalini', 
'Comienza tu día con energía y vitalidad. Clase completa de Kundalini Yoga que incluye calentamiento, kriyas, meditación y relajación profunda.',
'Clase completa para empezar el día con energía',
'Lunes a Viernes 6:00 AM - 7:30 AM',
90,
'Centro ACIKY La Habana',
1,
10.00,
'🌅',
'all',
true,
true),

('Kundalini para Principiantes',
'Clase especial diseñada para quienes están comenzando su práctica de Kundalini Yoga. Aprenderás las bases de las posturas, respiraciones y mantras.',
'Ideal para quienes comienzan su práctica',
'Martes y Jueves 5:00 PM - 6:00 PM',
60,
'Casa de Asia',
1,
8.00,
'🧘',
'beginner',
true,
false),

('Meditación Kirtan Kriya',
'Sesión de meditación enfocada en la práctica de Kirtan Kriya, una de las joyas del Kundalini Yoga. Excelente para la mente y la memoria.',
'Meditación poderosa para claridad mental',
'Sábados 9:00 AM - 10:00 AM',
60,
'Centro ACIKY La Habana',
1,
5.00,
'🪷',
'all',
true,
true),

('Yoga para el Estrés',
'Clase terapéutica diseñada para reducir el estrés y la ansiedad. Incluye respiraciones calmantes, posturas suaves y meditación guiada.',
'Reduce el estrés con técnicas efectivas',
'Miércoles 7:00 PM - 8:00 PM',
60,
'Casa de Asia',
1,
10.00,
'🌿',
'beginner',
true,
false);

-- Insert sample routes (Rutas Doradas)
INSERT INTO routes (name, origin, destination, description, frequency, status, participants_count, spaces_established) VALUES
('Ruta Nueva Gerona',
'La Habana',
'Isla de la Juventud',
'Ruta de expansión del Kundalini Yoga hacia la Isla de la Juventud. Incluye clases, talleres y formación de instructores locales.',
'Trimestral',
'active',
45,
2),

('Ruta Oriente',
'La Habana',
'Santiago de Cuba',
'Llevamos el Kundalini Yoga al oriente de Cuba con clases regulares y formación de nuevos instructores.',
'Mensual',
'active',
60,
3),

('Ruta Centro',
'La Habana',
'Santa Clara',
'Expansión hacia el centro de Cuba estableciendo espacios de práctica permanentes.',
'Bimensual',
'planning',
30,
1);

-- Check results
SELECT 'Blog Posts Created:' as Info, COUNT(*) as Total FROM blog_posts WHERE slug IN ('bienvenidos-a-aciky', 'que-es-kundalini-yoga', 'festival-wahe-guru-2025');
SELECT 'Activities Created:' as Info, COUNT(*) as Total FROM activities WHERE name LIKE '%Kundalini%';
SELECT 'Routes Created:' as Info, COUNT(*) as Total FROM routes WHERE name LIKE 'Ruta%';
