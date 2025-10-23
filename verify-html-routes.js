// Script para verificar que todas las rutas de imágenes en index.html existan
// y que no haya problemas con nombres de archivos

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

console.log('🔍 VERIFICACIÓN DE RUTAS DE IMÁGENES EN INDEX.HTML');
console.log('═'.repeat(60));

const htmlPath = path.join(__dirname, 'index.html');

try {
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

  // Extraer todas las rutas de imágenes del HTML
  const imgRegex = /src=["']([^"']+)["']/g;
  const hrefRegex = /href=["']([^"']+)["']/g;

  const images = [];
  const links = [];

  let match;

  // Buscar imágenes
  while ((match = imgRegex.exec(htmlContent)) !== null) {
    images.push(match[1]);
  }

  // Buscar enlaces (href)
  while ((match = hrefRegex.exec(htmlContent)) !== null) {
    // Filtrar solo enlaces que apunten a archivos locales (no URLs externas)
    if (!match[1].startsWith('http') && !match[1].startsWith('#') && match[1].includes('.')) {
      links.push(match[1]);
    }
  }

  console.log(`📸 Encontradas ${images.length} referencias a imágenes:`);
  images.forEach((img, index) => {
    const fullPath = path.join(__dirname, img);
    const exists = fs.existsSync(fullPath);
    console.log(`${index + 1}. ${img} ${exists ? '✅' : '❌'}`);
    if (!exists) {
      console.log(`   ❌ Archivo no encontrado: ${fullPath}`);
    }
  });

  console.log(`\n🔗 Encontrados ${links.length} enlaces locales:`);
  links.forEach((link, index) => {
    const fullPath = path.join(__dirname, link);
    const exists = fs.existsSync(fullPath);
    console.log(`${index + 1}. ${link} ${exists ? '✅' : '❌'}`);
    if (!exists) {
      console.log(`   ❌ Archivo no encontrado: ${fullPath}`);
    }
  });

  // Verificar específicamente las rutas de propiedades
  console.log('\n🏠 VERIFICACIÓN DE PROPIEDADES DESTACADAS:');
  console.log('─'.repeat(50));

  const propertyLinks = links.filter(link => link.includes('assets/img/'));
  propertyLinks.forEach((link, index) => {
    console.log(`\n📄 Propiedad ${index + 1}: ${path.basename(path.dirname(link))}`);
    console.log(`   📁 Ruta: ${link}`);

    const fullPath = path.join(__dirname, link);
    const exists = fs.existsSync(fullPath);

    if (exists) {
      // Verificar que sea un directorio con index.html
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        const indexPath = path.join(fullPath, 'index.html');
        const hasIndex = fs.existsSync(indexPath);
        console.log(`   📄 index.html: ${hasIndex ? '✅' : '❌'}`);

        if (hasIndex) {
          // Verificar que el index.html tenga contenido
          const indexContent = fs.readFileSync(indexPath, 'utf-8');
          const hasContent = indexContent.length > 100;
          console.log(`   📏 Contenido: ${hasContent ? '✅' : '❌'}`);
        }
      } else {
        console.log(`   ❌ No es un directorio`);
      }
    } else {
      console.log(`   ❌ Directorio no encontrado`);
    }
  });

  // Resumen
  const missingImages = images.filter(img => !fs.existsSync(path.join(__dirname, img)));
  const missingLinks = links.filter(link => !fs.existsSync(path.join(__dirname, link)));

  console.log('\n📊 RESUMEN:');
  console.log('─'.repeat(50));
  console.log(`✅ Imágenes encontradas: ${images.length - missingImages.length}/${images.length}`);
  console.log(`❌ Imágenes faltantes: ${missingImages.length}`);
  console.log(`✅ Enlaces válidos: ${links.length - missingLinks.length}/${links.length}`);
  console.log(`❌ Enlaces rotos: ${missingLinks.length}`);

  if (missingImages.length === 0 && missingLinks.length === 0) {
    console.log('\n🎉 ¡Todas las rutas están correctas!');
  } else {
    console.log('\n⚠️ Hay problemas con algunas rutas. Revisa los errores anteriores.');
  }

} catch (err) {
  console.error('❌ Error verificando rutas:', err.message);
}
