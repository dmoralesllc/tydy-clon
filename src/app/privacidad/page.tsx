// === COPIA Y PEGA ESTE CÓDIGO COMPLETO EN src/app/privacidad/page.tsx ===

export default function PrivacyPolicyPage() {
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.7', color: '#333', maxWidth: '800px', margin: 'auto', padding: '40px 20px' }}>
        <h1>Política de Privacidad para TyDy</h1>
        <p><strong>Última actualización:</strong> 10 de agosto de 2025</p>
        <p>Esta Política de Privacidad describe nuestras políticas sobre la recopilación, uso y divulgación de su información cuando utiliza nuestro servicio.</p>
        <p>El servicio "TyDy" (la "Aplicación") es operado por TyDy ("nosotros", "nuestro").</p>
  
        <h2>1. Información que Recopilamos</h2>
        <p>Para proveer y mejorar nuestro servicio, recopilamos los siguientes tipos de información:</p>
        
        <h3>a) Información de Identificación Personal:</h3>
        <ul>
          <li><strong>Dirección de correo electrónico (Email):</strong> La solicitamos para su registro y para el inicio de sesión en nuestro servicio.</li>
        </ul>
  
        <h3>b) Datos de Geolocalización (GPS):</h3>
        <p>La recopilación de datos de ubicación es <strong>esencial</strong> para el funcionamiento de la Aplicación.</p>
        <ul>
          <li><strong>Para Pasajeros:</strong> Recopilamos su ubicación precisa al usar la aplicación para mostrarle conductores cercanos y establecer su punto de partida.</li>
          <li><strong>Para Conductores:</strong> Recopilamos su ubicación precisa de forma continua <strong>mientras está en estado "Conectado"</strong>, incluso si la aplicación está en segundo plano. Esto es necesario para mostrar su ubicación a los pasajeros y para guiar el trayecto.</li>
        </ul>
  
        <h2>2. Cómo Usamos tu Información</h2>
        <p>Usamos los datos recopilados para:</p>
        <ul>
          <li><strong>Proveer y mantener nuestro Servicio:</strong> Incluyendo el emparejamiento de pasajeros con conductores y el seguimiento de los viajes.</li>
          <li><strong>Gestionar su cuenta:</strong> Administrar su registro como usuario.</li>
          <li><strong>Contactarlo:</strong> Enviarle notificaciones sobre el estado de sus viajes.</li>
          <li><strong>Mejorar nuestro Servicio:</strong> Analizar el uso de la aplicación para realizar mejoras.</li>
        </ul>
  
        <h2>3. Con Quién Compartimos tu Información</h2>
        <ul>
          <li><strong>Con otros usuarios:</strong> La ubicación de un conductor "Conectado" es visible para los pasajeros. El nombre de un pasajero se comparte con el conductor que acepta su viaje.</li>
          <li><strong>Con proveedores de servicios:</strong> Utilizamos servicios de terceros como <strong>Supabase</strong> para nuestro backend y base de datos. Están obligados a no divulgar ni usar sus datos para ningún otro propósito.</li>
        </ul>
  
        <h2>4. Seguridad de tus Datos</h2>
        <p>La seguridad de sus datos es importante para nosotros, pero recuerde que ningún método de transmisión por Internet o de almacenamiento electrónico es 100% seguro.</p>
        
        <h2>5. Contáctanos</h2>
        <p>Si tiene alguna pregunta sobre esta Política de Privacidad, puede contactarnos a través de:</p>
        <ul>
          {/* RECUERDA CAMBIAR ESTE EMAIL POR TU CORREO DE CONTACTO */}
          <li><strong>Email:</strong> contacto@tydy.lat</li>
        </ul>
      </div>
    );
  }