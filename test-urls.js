// Script para probar la generación de URLs de WhatsApp
// Simular las funciones del chatbot para verificar que no generan %20

function buildAbsUrl(path){
  try {
    // Si ya es una URL completa, devolverla tal cual
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // Construir URL basada en el entorno actual
    const baseUrl = window.location.origin;

    // Si el path ya incluye assets/img/, usarlo directamente
    if (path.startsWith('assets/')) {
      return baseUrl + '/' + path;
    }

    // Si no, agregar el prefijo assets/img/
    return baseUrl + '/assets/img/' + path;
  } catch(e) {
    console.error('Error construyendo la URL absoluta:', e);
    // Como fallback, intentar construir una URL relativa simple
    return new URL(path, window.location.href).href;
  }
}

function buildWhatsAppText(title, category, path, info, price){
  const kind = category === 'locales' ? 'local comercial' : 'vivienda';
  const url = buildAbsUrl(path);

  // Extraer información clave del info
  let priceText = '';
  if(price && typeof price === 'number'){
    priceText = `\n💰 Precio: $${price.toLocaleString('es-CO')}`;
  }

  // Construir mensaje profesional
  const message = `¡Hola! 👋

Me interesa esta propiedad que vi en su página web:

🏠 *${title}*
📍 Tipo: ${kind.charAt(0).toUpperCase() + kind.slice(1)}${priceText}

🔗 Ver detalles completos:
${url}

¿Podrían darme más información sobre disponibilidad y condiciones de arriendo?

¡Gracias!`;

  return message;
}

// Función para codificar el mensaje de WhatsApp sin dañar la URL
function encodeWhatsAppMessage(message) {
  // Codificar solo el texto del mensaje, manteniendo la URL intacta
  const messageText = message.replace(/\n/g, '%0A').replace(/\s+/g, '%20');
  return messageText;
}

// Pruebas con datos reales del content-index.json
console.log('🧪 PROBANDO GENERACIÓN DE URLs DE WHATSAPP\n');
console.log('═'.repeat(60));

// Datos de prueba basados en el content-index.json real
const testProperties = [
  {
    title: "Orilla-del-rio-centro",
    category: "viviendas",
    path: "assets/img/VIVIENDAS/orilla-del-rio-centro/index.html",
    price: 300000,
    info: "SE ARRIENDA VIVIENDA O LOCAL COMERCIAL: Esta ubicada en la orilla del rio centro..."
  },
  {
    title: "Barrio-santa-clara",
    category: "viviendas",
    path: "assets/img/VIVIENDAS/barrio-santa-clara/index.html",
    price: 1000000,
    info: "SE ARRIENDA VIVIENDA URBANA: Esta ubicada en el barrio santa clara..."
  },
  {
    title: "Centro-calle-de-los-celulares",
    category: "locales",
    path: "assets/img/LOCALES/centro-calle-de-los-celulares/index.html",
    price: 400000,
    info: "SE ARRIENDA LOCAL COMERCIAL: Esta ubicado en el centro calle de los celulares..."
  }
];

testProperties.forEach((property, index) => {
  console.log(`\n📍 PROPIEDAD ${index + 1}: ${property.title}`);
  console.log('─'.repeat(50));

  // Generar el mensaje completo
  const fullMessage = buildWhatsAppText(
    property.title,
    property.category,
    property.path,
    property.info,
    property.price
  );

  // Codificar para WhatsApp
  const whatsappEncoded = encodeWhatsAppMessage(fullMessage);
  const whatsappUrl = `https://wa.me/573015717622?text=${whatsappEncoded}`;

  console.log('✅ MENSAJE COMPLETO:');
  console.log(fullMessage);

  console.log('\n🔗 URL GENERADA:');
  console.log(whatsappUrl);

  // Verificar si contiene %20 en la URL del path
  const hasPercent20 = whatsappUrl.includes('%20');
  console.log(`\n⚠️ CONTIENE %20: ${hasPercent20 ? '❌ SÍ (PROBLEMA)' : '✅ NO (CORRECTO)'}`);

  if (hasPercent20) {
    console.log('❌ ERROR: La URL contiene caracteres codificados');
  } else {
    console.log('✅ CORRECTO: La URL está limpia sin %20');
  }

  console.log('');
});

// Verificar URLs específicas del content-index.json
console.log('\n🔍 VERIFICACIÓN DE URLs DEL ÍNDICE');
console.log('═'.repeat(50));

const problematicPaths = [
  "assets/img/VIVIENDAS/orilla-del-rio-centro/index.html",
  "assets/img/LOCALES/barrio-santa-teresa/index.html",
  "assets/img/VIVIENDAS/barrio-santa-clara/index.html",
  "assets/img/VIVIENDAS/pelayo-cerca-de-la-bomba-entrada-principal/index.html"
];

problematicPaths.forEach(path => {
  const url = buildAbsUrl(path);
  console.log(`📁 ${path}`);
  console.log(`🔗 ${url}`);
  console.log(`✅ Limpia: ${!url.includes('%20')}`);
  console.log('');
});

console.log('\n🎉 PRUEBA COMPLETADA');
console.log('═'.repeat(60));

// Instrucciones para usar el script
console.log('\n💡 CÓMO USAR ESTE SCRIPT:');
console.log('1. Abre el navegador en: http://localhost:8000');
console.log('2. Abre la consola del desarrollador (F12)');
console.log('3. Copia y pega este script completo');
console.log('4. Presiona Enter para ejecutar');
console.log('5. Revisa los resultados para confirmar que no hay %20');
