-- Seed data for LinkedIn Expert Knowledge Base
-- Note: These would usually be embedded first. For now, I'll provide the content.
-- In a real scenario, we would run a script to generate embeddings for these.
-- Since I can't run a Deno script easily that connects to Supabase and uses the AI Service here,
-- I'll provide a placeholder or a way for the user to seed it.
-- Actually, I can create a temporary edge function to seed the data!

INSERT INTO public.linkedin_knowledge_base (content, metadata) VALUES
('El mejor horario para publicar en LinkedIn suele ser los martes, miércoles y jueves entre las 9:00 AM y las 12:00 PM (hora local de tu audiencia). Evita los fines de semana si buscas alcance B2B.', '{"category": "scheduling"}'),
('La estructura ideal de un post viral en LinkedIn es: 1. El Hook (Gancho) que detenga el scroll. 2. El Puente que conecte con la emoción. 3. Los Puntos Clave (Bullet points) para escaneabilidad. 4. El CTA (Llamado a la acción) claro.', '{"category": "content_structure"}'),
('El algoritmo de LinkedIn penaliza los posts que tienen enlaces externos en el cuerpo del mensaje. Es mejor poner el enlace en el primer comentario una vez publicado el post.', '{"category": "algorithm"}'),
('La "Hora de Oro" en LinkedIn: Los primeros 60 minutos después de publicar son cruciales. Responde a todos los comentarios inmediatamente para aumentar el alcance exponencialmente.', '{"category": "engagement"}'),
('LinkedIn favorece el contenido nativo. Los carruseles (subidos como PDF) y los videos cortos nativos suelen tener más alcance que las imágenes estáticas o los links a YouTube.', '{"category": "content_types"}'),
('Para mejorar tu perfil de LinkedIn: Usa una foto profesional, un banner que comunique tu propuesta de valor y un titular que no solo diga tu cargo, sino el problema que resuelves.', '{"category": "profile_optimization"}');
