import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { AppLanguage } from '../../types';
import { MARKETING_DOMAIN } from '../../constants';

interface TermsOfServiceProps {
    language: AppLanguage;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ language }) => {
    const isEs = language === 'es';

    return (
        <div className="min-h-screen bg-white">
            <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <a href={`https://${MARKETING_DOMAIN}`} className="flex items-center gap-2 text-slate-600 hover:text-brand-600 transition-colors font-medium">
                        <ArrowLeft className="w-5 h-5" />
                        {isEs ? 'Volver' : 'Back'}
                    </a>
                    <div className="flex items-center gap-2 font-display font-bold text-xl text-slate-900">
                        <div className="w-8 h-8 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-lg flex items-center justify-center text-white text-sm shadow-md">K</div>
                        Kolink
                    </div>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-display font-bold text-slate-900 mb-8">
                    {isEs ? 'Términos de Servicio' : 'Terms of Service'}
                </h1>
                <p className="text-slate-500 mb-8">
                    {isEs ? 'Última actualización: 1 de Diciembre de 2024' : 'Last updated: December 1, 2024'}
                </p>

                <div className="prose prose-slate max-w-none">
                    {isEs ? (
                        <>
                            <h3>1. Aceptación de los Términos</h3>
                            <p>Al acceder y utilizar Kolink, usted acepta cumplir y estar sujeto a estos Términos de Servicio. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.</p>

                            <h3>2. Descripción del Servicio</h3>
                            <p>Kolink es una herramienta impulsada por IA diseñada para ayudar a los creadores a generar contenido para LinkedIn. Nos reservamos el derecho de retirar o modificar el servicio sin previo aviso.</p>

                            <h3>3. Cuentas de Usuario</h3>
                            <p>Para utilizar la mayoría de las funciones del Servicio, debe registrarse para obtener una cuenta. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña.</p>

                            <h3>4. Propiedad Intelectual</h3>
                            <p>El Servicio y su contenido original, características y funcionalidad son y seguirán siendo propiedad exclusiva de Kolink y sus licenciantes. El contenido generado por usted utilizando el servicio es de su propiedad.</p>

                            <h3>5. Suscripciones y Pagos</h3>
                            <p>Algunas partes del Servicio se facturan mediante suscripción ("Suscripción(es)"). Se le facturará por adelantado de forma recurrente y periódica ("Ciclo de Facturación").</p>

                            <h3>6. Terminación</h3>
                            <p>Podemos terminar o suspender su cuenta inmediatamente, sin previo aviso o responsabilidad, por cualquier motivo, incluso si usted incumple los Términos.</p>

                            <h3>7. Limitación de Responsabilidad</h3>
                            <p>En ningún caso Kolink, ni sus directores, empleados, socios, agentes, proveedores o afiliados, serán responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos.</p>

                            <h3>8. Cambios</h3>
                            <p>Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos Términos en cualquier momento.</p>

                            <h3>9. Contacto</h3>
                            <p>Si tiene alguna pregunta sobre estos Términos, por favor contáctenos en: <a href="mailto:info@kolink.es">info@kolink.es</a></p>
                        </>
                    ) : (
                        <>
                            <h3>1. Acceptance of Terms</h3>
                            <p>By accessing and using Kolink, you accept and agree to be bound by the terms and provision of this agreement. If you disagree with any part of the terms then you may not access the Service.</p>

                            <h3>2. Description of Service</h3>
                            <p>Kolink is an AI-powered tool designed to help creators generate content for LinkedIn. We reserve the right to withdraw or amend the service without notice.</p>

                            <h3>3. User Accounts</h3>
                            <p>In order to use most aspects of the Service, you must register for and maintain an active user services account. You are responsible for safeguarding the password that you use to access the Service.</p>

                            <h3>4. Intellectual Property</h3>
                            <p>The Service and its original content, features and functionality are and will remain the exclusive property of Kolink and its licensors. Content generated by you using the service is owned by you.</p>

                            <h3>5. Subscriptions and Payments</h3>
                            <p>Some parts of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle").</p>

                            <h3>6. Termination</h3>
                            <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

                            <h3>7. Limitation of Liability</h3>
                            <p>In no event shall Kolink, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.</p>

                            <h3>8. Changes</h3>
                            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time.</p>

                            <h3>9. Contact Us</h3>
                            <p>If you have any questions about these Terms, please contact us at: <a href="mailto:info@kolink.es">info@kolink.es</a></p>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TermsOfService;
