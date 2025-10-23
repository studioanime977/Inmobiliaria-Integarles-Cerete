// Script para verificar que los enlaces se generan correctamente
// Copia y pega esto en la consola del navegador (F12)

console.log('🔍 VERIFICACIÓN DE ENLACES DE PROPIEDADES');
console.log('═'.repeat(60));

// Función buildAbsUrl del código actual
function buildAbsUrl(path){
  try {
    // Si ya es una URL completa, devolverla tal cual
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // Detectar el entorno actual
    const isProduction = window.location.hostname.includes('vercel.app') ||
                        window.location.hostname.includes('inmobiliariaintegarlescerete.vercel.app');
    const isLocalhost = window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1';

    let baseUrl;

    if (isProduction) {
      // En producción (Vercel) - usar URL completa del sitio
      baseUrl = window.location.origin;
      console.log('🌐 Entorno producción - Base URL:', baseUrl);
    } else if (isLocalhost) {
      // En desarrollo (localhost) - usar URL con ruta base
      baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
      console.log('🏠 Entorno desarrollo - Base URL:', baseUrl);
    } else {
      // Otros entornos - fallback
      baseUrl = window.location.origin;
      console.log('❓ Entorno desconocido - Base URL:', baseUrl);
    }

    // Si el path ya incluye assets/img/, usarlo directamente
    if (path.startsWith('assets/')) {
      const finalUrl = baseUrl + '/' + path;
      console.log('🔗 URL final generada:', finalUrl);
      return finalUrl;
    }

    // Si no, agregar el prefijo assets/img/
    const finalUrl = baseUrl + '/assets/img/' + path;
    console.log('🔗 URL final generada:', finalUrl);
    return finalUrl;
  } catch(e) {
    console.error('❌ Error construyendo la URL absoluta:', e);
    console.error('🔧 Path original:', path);
    console.error('🔧 window.location:', window.location.href);
    // Como fallback, intentar construir una URL relativa simple
    return new URL(path, window.location.href).href;
  }
}

// Datos de prueba basados en el content-index.json real
const testPaths = [
  "assets/img/VIVIENDAS/orilla-del-rio-centro/index.html",
  "assets/img/LOCALES/barrio-santa-teresa/index.html",
  "assets/img/VIVIENDAS/barrio-santa-clara/index.html",
  "assets/img/VIVIENDAS/pelayo-cerca-de-la-bomba-entrada-principal/index.html"
];

console.log('\n🧪 PRUEBA DE ENLACES:');
console.log('─'.repeat(50));

testPaths.forEach((path, index) => {
  console.log(`\n📁 PRUEBA ${index + 1}: ${path}`);

  const url = buildAbsUrl(path);
  console.log(`🔗 URL GENERADA: ${url}`);

  const hasPercent20 = url.includes('%20');
  console.log(`❌ CONTIENE %20: ${hasPercent20 ? 'SÍ (PROBLEMA)' : 'NO (CORRECTO)'}`);

  // Verificar que la URL es limpia
  const cleanUrl = url.replace(window.location.origin, '');
  console.log(`🧹 URL LIMPIA: ${cleanUrl}`);
  console.log(`✅ URL CORRECTA: ${!cleanUrl.includes('%20') && cleanUrl.includes('orilla-del-rio-centro')}`);
  console.log('');
});

// Verificar el entorno actual
console.log('\n🌐 ENTORNO ACTUAL:');
console.log('─'.repeat(50));
console.log('URL completa:', window.location.href);
console.log('Origen:', window.location.origin);
console.log('Hostname:', window.location.hostname);
console.log('Pathname:', window.location.pathname);
console.log('Protocol:', window.location.protocol);

console.log('\n📋 INSTRUCCIONES:');
console.log('1. Busca una propiedad en el chatbot (ej: "orilla")');
console.log('2. Haz clic en "📄 Ver detalle completo"');
console.log('3. Revisa la consola para ver los logs');
console.log('4. Verifica que el enlace no contenga %20');
console.log('5. Si sigue mostrando %20, recarga la página (Ctrl+F5)');

console.log('\n🎯 URLs ESPERADAS:');
console.log('✅ Localhost: http://localhost:8000/assets/img/VIVIENDAS/orilla-del-rio-centro/index.html');
console.log('✅ Vercel: https://inmobiliariaintegarlescerete.vercel.app/assets/img/VIVIENDAS/orilla-del-rio-centro/index.html');
