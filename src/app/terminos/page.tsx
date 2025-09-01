'use client';

import Link from 'next/link';

const TerminosPage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-red-500">Términos y Condiciones de Servicio</h1>
        <div className="space-y-6 text-gray-300">
          <p>Última actualización: 31 de Agosto de 2025</p>
          
          <h2 className="text-2xl font-semibold mt-6 border-b border-gray-700 pb-2">1. Aceptación y Alcance</h2>
          <p>
            Al acceder y utilizar TyDy Clon (la "Aplicación"), usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo, no podrá utilizar nuestro servicio. dmoralesllc es un nombre de fantasía para el desarrollo y publicación de soluciones tecnológicas que facilitan el vínculo entre oferta y demanda, sin implicar responsabilidad directa, intermediación ni vinculación legal alguna entre las partes.
          </p>

          <h2 className="text-2xl font-semibold mt-6 border-b border-gray-700 pb-2">2. Naturaleza del Servicio</h2>
          <p>
            Todas las plataformas, herramientas y productos desarrollados bajo esta identidad tienen como único propósito brindar un canal funcional y automatizado para el contacto directo entre usuarios (conductores, pasajeros, etc.), sin que exista relación laboral, societaria ni contractual con dmoralesllc.
          </p>

          <h2 className="text-2xl font-semibold mt-6 border-b border-gray-700 pb-2">3. Responsabilidad del Usuario</h2>
          <p>
            Las funcionalidades se basan en principios de neutralidad tecnológica. No suponen respaldo, verificación, ni control de los antecedentes, habilitaciones, seguros o condiciones legales de los usuarios. La veracidad de los datos, documentos y declaraciones cargados en la plataforma es exclusiva responsabilidad de quienes los proveen.
          </p>

          <h2 className="text-2xl font-semibold mt-6 border-b border-gray-700 pb-2">4. Limitación de Responsabilidad y Seguridad</h2>
          <p>
            Aunque dmoralesllc aplica medidas de seguridad informática razonables según los estándares de la industria, no garantiza ni se responsabiliza por eventuales accesos no autorizados, filtraciones, robo de datos, ataques cibernéticos o cualquier vulneración de seguridad que pudiera afectar al sistema o a sus usuarios, más allá del control razonable del desarrollador.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6 border-b border-gray-700 pb-2">5. Asunción de Riesgo</h2>
          <p>
            Toda interacción dentro de las herramientas desarrolladas supone la aceptación plena de estos términos, reconociendo que el uso de tecnologías en entornos abiertos o conectados a internet conlleva riesgos inherentes que deben ser asumidos por el usuario.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6 border-b border-gray-700 pb-2">6. Política de Privacidad</h2>
          <p>
            El uso de la Aplicación también se rige por nuestra Política de Privacidad, la cual puede consultar en el siguiente enlace: <Link href="/privacidad" legacyBehavior><a className="text-red-400 hover:underline">Política de Privacidad</a></Link>.
          </p>

          <h2 className="text-2xl font-semibold mt-6 border-b border-gray-700 pb-2">7. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Le notificaremos de cualquier cambio publicando los nuevos Términos en esta página.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TerminosPage;
