import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { AppLanguage } from '../../types';
import { MARKETING_DOMAIN } from '../../constants';

interface PrivacyPolicyProps {
    language: AppLanguage;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ language }) => {
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
                    {isEs ? 'Política de Privacidad' : 'Privacy Policy'}
                </h1>
                <p className="text-slate-500 mb-8">
                    {isEs ? 'Última actualización: 1 de Diciembre de 2024' : 'Last updated: December 1, 2024'}
                </p>

                <div className="prose prose-slate max-w-none">
                    {isEs ? (
                        <>
                            <p>En Kolink ("nosotros", "nuestro"), respetamos su privacidad y estamos comprometidos a proteger sus datos personales. Esta política de privacidad le informará sobre cómo cuidamos sus datos personales cuando visita nuestro sitio web y le informará sobre sus derechos de privacidad y cómo la ley lo protege.</p>

                            <h3>1. Información que recopilamos</h3>
                            <p>Podemos recopilar, usar, almacenar y transferir diferentes tipos de datos personales sobre usted, que hemos agrupado de la siguiente manera:</p>
                            <ul>
                                <li><strong>Datos de Identidad:</strong> incluye nombre, apellido, nombre de usuario o identificador similar.</li>
                                <li><strong>Datos de Contacto:</strong> incluye dirección de correo electrónico.</li>
                                <li><strong>Datos Técnicos:</strong> incluye dirección IP, datos de inicio de sesión, tipo y versión del navegador, configuración de zona horaria y ubicación.</li>
                                <li><strong>Datos de Uso:</strong> incluye información sobre cómo utiliza nuestro sitio web y servicios.</li>
                            </ul>

                            <h3>2. Cómo usamos sus datos personales</h3>
                            <p>Solo usaremos sus datos personales cuando la ley lo permita. Más comúnmente, usaremos sus datos personales en las siguientes circunstancias:</p>
                            <ul>
                                <li>Para registrarlo como nuevo cliente.</li>
                                <li>Para procesar y entregar su pedido, incluyendo gestionar pagos, tarifas y cargos.</li>
                                <li>Para gestionar nuestra relación con usted.</li>
                                <li>Para mejorar nuestro sitio web, productos/servicios, marketing, relaciones con los clientes y experiencias.</li>
                            </ul>

                            <h3>3. Seguridad de los datos</h3>
                            <p>Hemos implementado medidas de seguridad adecuadas para evitar que sus datos personales se pierdan accidentalmente, se usen o accedan de forma no autorizada, se alteren o divulguen.</p>

                            <h3>4. Sus derechos legales</h3>
                            <p>Bajo ciertas circunstancias, tiene derechos bajo las leyes de protección de datos en relación con sus datos personales, incluyendo el derecho a solicitar acceso, corrección, borrado, restricción, transferencia de sus datos personales y derecho a retirar el consentimiento.</p>

                            <h3>5. Contacto</h3>
                            <p>Si tiene alguna pregunta sobre esta política de privacidad, por favor contáctenos en: <a href="mailto:info@kolink.es">info@kolink.es</a></p>
                        </>
                    ) : (
                        <>
                            <p>At Kolink ("we", "us", or "our"), we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>

                            <h3>1. Information We Collect</h3>
                            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
                            <ul>
                                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data:</strong> includes email address.</li>
                                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                                <li><strong>Usage Data:</strong> includes information about how you use our website and services.</li>
                            </ul>

                            <h3>2. How We Use Your Personal Data</h3>
                            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                            <ul>
                                <li>To register you as a new customer.</li>
                                <li>To process and deliver your order including managing payments, fees and charges.</li>
                                <li>To manage our relationship with you.</li>
                                <li>To improve our website, products/services, marketing, customer relationships and experiences.</li>
                            </ul>

                            <h3>3. Data Security</h3>
                            <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>

                            <h3>4. Your Legal Rights</h3>
                            <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.</p>

                            <h3>5. Contact Details</h3>
                            <p>If you have any questions about this privacy policy, please contact us at: <a href="mailto:info@kolink.es">info@kolink.es</a></p>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PrivacyPolicy;
