// Mantenemos el objeto estático para evitar que funciones antiguas se rompan
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Nueva función de seguridad dinámica (Lista Blanca)
export const getCorsHeaders = (req: Request) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:54321',
    'https://kolink.ai',
    'https://app.kolink.ai',
    'capacitor://localhost'
  ];
  
  const origin = req.headers.get('origin') || '';
  
  if (allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    };
  }
  
  // Fallback seguro: devuelve headers permisivos pero se podría cambiar a restrictivos en el futuro
  return corsHeaders;
};
