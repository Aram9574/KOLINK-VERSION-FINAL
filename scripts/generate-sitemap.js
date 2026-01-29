import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURATION DUPLICATED FROM sehConfig.ts ---
// To avoid complex TS compilation in scripts for now
const ROLES = [
  // Real Estate
  { slug: 'inmobiliaria' },
  { slug: 'desarrolladores' },
  
  // Leadership & Execs
  { slug: 'ceos' },
  { slug: 'ctos' },
  { slug: 'cmos' },
  { slug: 'cfos' },

  // Sales & Business Development
  { slug: 'ventas' },
  { slug: 'desarrollo-negocio' },
  { slug: 'account-managers' },

  // Advanced Tech & Data
  { slug: 'ingenieros-ia' },
  { slug: 'arquitectos-cloud' },
  { slug: 'analistas-ciberseguridad' },
  { slug: 'sre-engineers' },
  { slug: 'ingenieros-embebidos' },
  { slug: 'game-designers' },

  // Specialized Healthcare
  { slug: 'cirujanos' },
  { slug: 'dermatologos' },
  { slug: 'quiropracticos' },
  { slug: 'fisioterapeutas' },
  { slug: 'logopedas' },
  { slug: 'terapeutas-ocupacionales' },

  // Finance & Corporate
  { slug: 'banqueros-inversion' },
  { slug: 'auditores' },
  { slug: 'actuarios' },
  { slug: 'gestores-riesgos' },
  { slug: 'compradores-corporativos' },
  { slug: 'consultores-sostenibilidad' },
  
  // Creative & Media
  { slug: 'periodistas' },
  { slug: 'productores-cine' },
  { slug: 'musicos' },
  { slug: 'ux-writers' },
  { slug: 'disenadores-moda' },
  { slug: 'animadores-3d' },

  // Education & Research
  { slug: 'candidatos-phd' },
  { slug: 'cientificos-investigadores' },
  { slug: 'decanos-universidad' },
  { slug: 'directores-colegio' },

  // Specialized Consulting
  { slug: 'agile-coaches' },
  { slug: 'directores-diversidad' },
  { slug: 'duenos-franquicias' },
  { slug: 'directores-ong' },

  // Real Estate & Architecture Niche
  { slug: 'paisajistas' },
  { slug: 'planificadores-urbanos' },
  { slug: 'home-stagers' },

  // Events & Hospitality
  { slug: 'wedding-planners' },
  { slug: 'gerentes-hotel' },
  { slug: 'guias-turisticos' },

  // Skilled Trades
  { slug: 'contratistas-generales' },
  { slug: 'instaladores-solares' },
  
  // Legal Niche
  { slug: 'consultores-legaltech' },
  { slug: 'mediadores-conflicto' },

  // Marketing Niche
  { slug: 'email-marketers' },
  { slug: 'especialistas-cro' },
  { slug: 'especialistas-pr' },
  { slug: 'creadores-contenido' },
  
  // NEW BATCH
  { slug: 'traductores-jurados' },
  { slug: 'productores-video' },
  { slug: 'ingenieros-sonido' },
  { slug: 'maquilladores-pro' },
  { slug: 'estilistas-moda' },
  { slug: 'decoradores-interiores' },
  { slug: 'disenadores-jardines' },
  { slug: 'floristas' },
  { slug: 'pasteleros' },
  { slug: 'cerveceros-artesanales' },
  { slug: 'enologos' },
  { slug: 'agricultores-modernos' },
  { slug: 'pilotos-comerciales' },
  { slug: 'tripulantes-cabina' },
  { slug: 'coordinadores-logistica' },

  // Creative & Design
  { slug: 'copywriters' },
  { slug: 'social-media-managers' },
  { slug: 'disenadores' },
  { slug: 'editores-video' },
  { slug: 'fotografos' },
  { slug: 'arquitectos' },
  { slug: 'disenadores-interiores' },
  { slug: 'directores-arte' },

  // Business & Operations
  { slug: 'project-managers' },
  { slug: 'analistas-negocio' },
  { slug: 'gerentes-operaciones' },
  { slug: 'supply-chain-managers' },
  { slug: 'gerentes-recursos-humanos' },
  { slug: 'asistentes-ejecutivos' },
  { slug: 'compliance-officers' },

  // Sales & Marketing Expansion
  { slug: 'especialistas-seo' },
  { slug: 'brand-managers' },
  { slug: 'ecommerce-managers' },
  { slug: 'afiliados' },
  { slug: 'directores-ventas' },

  // Health & Wellness
  { slug: 'nutricionistas' },
  { slug: 'entrenadores-personales' },
  { slug: 'farmaceuticos' },
  { slug: 'dentistas' },
  { slug: 'veterinarios' },
  { slug: 'instructores-yoga' },

  // Legal & Consulting Expansion
  { slug: 'asesores-fiscales' },
  { slug: 'abogados-inmigracion' },
  { slug: 'abogados-patentes' },

  // Services & Trades
  { slug: 'organizadores-eventos' },
  { slug: 'agentes-viajes' },
  { slug: 'chefs' },
  { slug: 'inversores-inmobiliarios' },

  // Education & Writing
  { slug: 'profesores-universitarios' },
  { slug: 'tutores-online' },
  { slug: 'escritores-freelance' },
  { slug: 'escritores-tecnicos' },

  // Consultores & Freelancers
  { slug: 'coaches' },
  { slug: 'consultores-estrategicos' },
  { slug: 'freelancers' },

  // HR & Recruiting
  { slug: 'recruiters' },
  { slug: 'career-coaches' },

  // Legal & Finance
  { slug: 'abogados' },
  { slug: 'asesores-financieros' },

  // Health & Wellness
  { slug: 'doctores' },
  { slug: 'psicologos' },

  // Education & Other
  { slug: 'profesores' },
  { slug: 'buscandotrabajo' }
];

const ACTIONS = [
  { slug: 'generar-posts-linkedin' },
  { slug: 'analisis-perfil-linkedin' },
  { slug: 'crear-carruseles-pdf' },
  { slug: 'ganchos-virales' }
];

const DOMAIN = 'https://kolink.ai';
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, '../public/sitemap.xml');

// --- GENERATOR ---

function generateSitemap() {
    const today = new Date().toISOString().split('T')[0];
    const urls = [];

    // 1. Static Routes (Example)
    urls.push({ loc: `${DOMAIN}/`, lastmod: today, changefreq: 'daily', priority: '1.0' });
    urls.push({ loc: `${DOMAIN}/login`, lastmod: today, changefreq: 'monthly', priority: '0.8' });

    // 2. Programmatic SEO Routes
    ACTIONS.forEach(action => {
        ROLES.forEach(role => {
            urls.push({
                loc: `${DOMAIN}/solutions/${action.slug}-para-${role.slug}`, // Note: Changed to /solutions/ to match router pattern if we updated App.tsx? 
                // WAIT, I used /tools/ in App.tsx but considered /solutions/. 
                // App.tsx currently has: <Route path="/tools/:nicheSlug" element={<ToolsRouter />} />
                // ToolsRouter checks for "-para-" in nicheSlug.
                // So the URL MUST be /tools/action-para-role.
                // I will correct this line below.
                loc: `${DOMAIN}/tools/${action.slug}-para-${role.slug}`,
                lastmod: today,
                changefreq: 'weekly',
                priority: '0.9'
            });
        });
    });

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return sitemapContent;
}

async function main() {
    console.log('Generating sitemap...');
    const sitemap = generateSitemap();
    
    try {
        await writeFile(OUTPUT_PATH, sitemap);
        console.log(`✅ Sitemap created at: ${OUTPUT_PATH}`);
        console.log(`   Generated ${urlsCount(sitemap)} URLs.`);
    } catch (err) {
        console.error('❌ Error generating sitemap:', err);
        process.exit(1);
    }
}

function urlsCount(xml) {
    return (xml.match(/<url>/g) || []).length;
}

main();
