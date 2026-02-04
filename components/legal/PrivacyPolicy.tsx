import React from "react";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import TopBar from "../navigation/TopBar";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <TopBar activeTab="settings" onNavigate={() => {}} />
      <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 mb-6">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Política de Privacidad</h1>
          <p className="text-lg text-slate-500">Última actualización: Enero 2026</p>
        </div>

        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 space-y-12">
          
          <section>
            <h2 className="flex items-center gap-3 text-2xl">
              <Eye className="w-6 h-6 text-brand-500" />
              1. Recopilación de Información
            </h2>
            <p>
              En Kolink, recopilamos información necesaria para proporcionar nuestros servicios de inteligencia artificial para LinkedIn. Esto incluye:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Información de Cuenta:</strong> Nombre, correo electrónico, imagen de perfil y credenciales de autenticación (gestionadas por Supabase).</li>
              <li><strong>Datos de LinkedIn:</strong> Títulos, descripciones, y métricas públicas de publicaciones que analizamos bajo tu consentimiento.</li>
              <li><strong>Contenido Generado:</strong> Posts, carruseles y estrategias creadas dentro de la plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="flex items-center gap-3 text-2xl">
              <Lock className="w-6 h-6 text-brand-500" />
              2. Uso de la Información
            </h2>
            <p>
              Utilizamos tus datos exclusivamente para:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Proporcionar y mantener el servicio Kolink.</li>
              <li>Personalizar la generación de contenido mediante IA (Gemini).</li>
              <li>Mejorar nuestros algoritmos de análisis (datos anonimizados).</li>
              <li>Enviar comunicaciones importantes sobre tu cuenta o suscripción.</li>
            </ul>
          </section>

          <section>
            <h2 className="flex items-center gap-3 text-2xl">
              <FileText className="w-6 h-6 text-brand-500" />
              3. Compartición de Datos y Sub-procesadores
            </h2>
            <p>
              No vendemos tus datos a terceros. Los datos se comparten con sub-procesadores solo para la prestación del servicio:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Supabase:</strong> Infraestructura técnica y seguridad de datos.</li>
              <li><strong>Google Cloud (Gemini IA):</strong> Procesamiento de texto para generación de contenido. Tus datos no se utilizan para re-entrenar modelos públicos.</li>
              <li><strong>Stripe:</strong> Gestión de pagos y cumplimiento fiscal.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl">4. Seguridad y Retención</h2>
            <p>
              Mantenemos tus datos mientras tu cuenta esté activa o sea necesario para cumplir obligaciones legales. Si solicitas la eliminación, procederemos a borrar tu información personal en un plazo de 30 días, salvo los datos de facturación que la ley nos obliga a conservar.
            </p>
          </section>

          <section>
            <h2 className="text-2xl">5. Tus Derechos (RGPD)</h2>
            <p>
              De acuerdo con el Reglamento General de Protección de Datos (RGPD), tienes los siguientes derechos:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Derecho de acceso, rectificación y supresión de tus datos.</li>
              <li>Derecho a la portabilidad de los datos.</li>
              <li>Derecho a retirar el consentimiento en cualquier momento.</li>
            </ul>
            <p className="mt-4">
              Para ejercer estos derechos, utiliza el panel de configuración o contacta a **soporte@kolink.ai**.
            </p>
          </section>

          <section className="text-sm text-slate-400 italic mt-20 border-t pt-8">
            <p>Este documento es una plantilla informativa. Se recomienda consultar con un abogado especializado para asesoramiento legal específico.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
