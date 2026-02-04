import React from "react";
import { Info, Building, Globe, Mail } from "lucide-react";
import TopBar from "../navigation/TopBar";

const LegalNotice = () => {
  return (
    <div className="min-h-screen bg-white">
      <TopBar activeTab="settings" onNavigate={() => {}} />
      <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 mb-6">
            <Info className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Aviso Legal</h1>
          <p className="text-lg text-slate-500">Cumplimiento con la Ley 34/2002 (LSSI-CE)</p>
        </div>

        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 space-y-12">
          
          <section>
            <h2 className="flex items-center gap-3 text-2xl">
              <Building className="w-6 h-6 text-brand-500" />
              1. Datos Identificativos
            </h2>
            <p>
              En cumplimiento del deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, se detallan los siguientes datos:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Titular:</strong> [NOMBRE_O_EMPRESA_AQUÍ]</li>
              <li><strong>NIF/CIF:</strong> [NIF_AQUÍ]</li>
              <li><strong>Domicilio:</strong> [DIRECCIÓN_AQUÍ]</li>
              <li><strong>Correo Electrónico:</strong> soporte@kolink.ai</li>
            </ul>
          </section>

          <section>
            <h2 className="flex items-center gap-3 text-2xl">
              <Globe className="w-6 h-6 text-brand-500" />
              2. Usuarios
            </h2>
            <p>
              El acceso y/o uso de este portal de Kolink atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3 text-2xl">
              <Building className="w-6 h-6 text-brand-500" />
              3. Uso del Portal
            </h2>
            <p>
              Kolink proporciona el acceso a multitud de informaciones, servicios o datos en Internet pertenecientes a Kolink o a sus licenciantes a los que el USUARIO pueda tener acceso. El USUARIO asume la responsabilidad del uso del portal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl">4. Propiedad Intelectual e Industrial</h2>
            <p>
              Kolink por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma. Todos los derechos reservados.
            </p>
          </section>

          <section className="text-sm text-slate-400 italic mt-20 border-t pt-8">
            <p>Este documento es una plantilla informativa para cumplimiento de la LSSI-CE. Se recomienda su revisión por personal legal calificado.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice;
