import React from "react";
import { Scale, FileCheck, Ban, CreditCard } from "lucide-react";
import TopBar from "../navigation/TopBar";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
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
              2. Suscripciones y Pagos
            </h2>
            <p>
              Algunas partes del Servicio se facturan mediante suscripción ("Suscripción(es)"). Se te facturará por adelantado de forma recurrente y periódica ("Ciclo de Facturación").
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Puedes cancelar tu suscripción en cualquier momento desde el Dashboard.</li>
              <li>No ofrecemos reembolsos por periodos parciales de suscripción, salvo excepciones legales.</li>
            </ul>
          </section>

          <section>
            <h2 className="flex items-center gap-3 text-2xl">
              <Ban className="w-6 h-6 text-brand-500" />
              3. Uso Prohibido
            </h2>
            <p>
              Aceptas no utilizar el Servicio:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Para cualquier propósito ilegal o no autorizado.</li>
              <li>Para generar contenido spam, engañoso u ofensivo en LinkedIn.</li>
              <li>Para intentar ingeniería inversa o vulnerar la seguridad de la plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl">4. Propiedad Intelectual</h2>
            <p>
              El Servicio y su contenido original, características y funcionalidad son y seguirán siendo propiedad exclusiva de Kolink y sus licenciantes. El contenido que tú generes te pertenece a ti.
            </p>
          </section>

          <section>
            <h2 className="text-2xl">5. Limitación de Responsabilidad</h2>
            <p>
              En ningún caso Kolink, ni sus directores, empleados, socios, agentes, proveedores o afiliados, serán responsables de daños indirectos, incidentales, especiales, consecuentes o punitivos.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
