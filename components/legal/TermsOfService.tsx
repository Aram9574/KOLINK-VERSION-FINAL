import React from "react";
import { Scale, FileCheck, Ban, CreditCard } from "lucide-react";
import TopBar from "../navigation/TopBar";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <TopBar activeTab="settings" onNavigate={() => {}} />
      <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 mb-6">
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Términos de Servicio</h1>
          <p className="text-lg text-slate-500">Última actualización: Enero 2026</p>
        </div>

        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 space-y-12">
          
          <section>
            <h2 className="flex items-center gap-3 text-2xl">
              <FileCheck className="w-6 h-6 text-brand-500" />
              1. Aceptación de los Términos
            </h2>
            <p>
              Al acceder o utilizar Kolink ("Servicio"), aceptas estar sujeto a estos Términos. Si no estás de acuerdo con alguna parte de los términos, no podrás acceder al Servicio.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3 text-2xl">
              <CreditCard className="w-6 h-6 text-brand-500" />
              2. Suscripciones y Sistema de Créditos
            </h2>
            <p>
              El Servicio utiliza un sistema de créditos para la generación de contenido mediante IA.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Créditos:</strong> Cada generación consume una cantidad específica de créditos según el módulo utilizado. Los créditos no son transferibles y caducan al final del ciclo de facturación si no se indica lo contrario.</li>
              <li><strong>Suscripciones:</strong> Se facturan por adelantado de forma recurrente. Puedes cancelar en cualquier momento, manteniendo el acceso hasta el final del periodo pagado.</li>
              <li><strong>Reembolsos:</strong> Debido a los costes de computación de la IA, solo se procesarán reembolsos si el servicio técnico no ha funcionado correctamente y bajo revisión del equipo de soporte.</li>
            </ul>
          </section>

          <section>
            <h2 className="flex items-center gap-3 text-2xl">
              <Ban className="w-6 h-6 text-brand-500" />
              3. Uso Prohibido y Contenido IA
            </h2>
            <p>
              Aceptas no utilizar el Servicio para generar:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Contenido que infrinja las políticas de comunidad de LinkedIn.</li>
              <li>Material engañoso, difamatorio o que incite al odio.</li>
              <li>Interferir con la seguridad de la plataforma o intentar eludir los límites de créditos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl">4. Propiedad Intelectual y Contenido IA</h2>
            <p>
              <strong>Tu Contenido:</strong> Eres el propietario de los derechos sobre el contenido final generado por la IA de Kolink. Sin embargo, reconoces que la IA puede generar resultados similares para otros usuarios debido al entrenamiento del modelo.
            </p>
            <p>
              <strong>Uso del Servicio:</strong> Kolink otorga una licencia limitada e intransferible para usar la herramienta. No tienes derecho a revender el software como propio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl">5. Limitación de Responsabilidad</h2>
            <p>
              Kolink es una herramienta de asistencia. **No garantizamos resultados específicos de alcance, ventas o crecimiento en LinkedIn.** El uso del contenido generado es responsabilidad exclusiva del usuario. No nos hacemos responsables de acciones tomadas por LinkedIn contra el perfil del usuario por el uso de automatizaciones externas.
            </p>
          </section>

          <section className="text-sm text-slate-400 italic">
            <p>Este documento es una plantilla informativa. Se recomienda consultar con un abogado especializado para asesoramiento legal específico.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
