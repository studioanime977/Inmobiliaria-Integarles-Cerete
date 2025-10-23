// Script para verificar que todos los enlaces del HTML apunten a carpetas válidas
const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN FINAL DE ENLACES EN INDEX.HTML');
console.log('═'.repeat(60));

const htmlPath = path.join(__dirname, 'index.html');

try {
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

  // Extraer todos los enlaces href que apunten a assets/img/
  const linkRegex = /href=["']([^"']*assets\/img\/[^"']*\/index\.html[^"']*)["']/g;
  const imgRegex = /src=["']([^"']*assets\/img\/[^"']*\/PORTADA\.jpg[^"']*)["']/g;

  const links = [];
  const images = [];

  let match;

  // Buscar enlaces
  while ((match = linkRegex.exec(htmlContent)) !== null) {
    links.push(match[1]);
  }

  // Buscar imágenes
  while ((match = imgRegex.exec(htmlContent)) !== null) {
    images.push(match[1]);
  }

  console.log(`🔗 Enlaces encontrados: ${links.length}`);
  console.log(`🖼️ Imágenes encontradas: ${images.length}`);

  console.log('\n📋 ENLACES DE PROPIEDADES:');
  console.log('─'.repeat(50));

  links.forEach((link, index) => {
    const fullPath = path.join(__dirname, link);
    const exists = fs.existsSync(fullPath);

    // Extraer el nombre de la propiedad del path
    const pathParts = link.split('/');
    const propertyName = pathParts[pathParts.length - 2]; // Nombre de la carpeta

    console.log(`\n${index + 1}. ${propertyName}`);
    console.log(`   📁 ${link}`);

    if (exists) {
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        const indexPath = path.join(fullPath, 'index.html');
        const hasIndex = fs.existsSync(indexPath);
        console.log(`   ✅ Directorio existe`);
        console.log(`   📄 index.html: ${hasIndex ? '✅' : '❌'}`);

        if (hasIndex) {
          const indexContent = fs.readFileSync(indexPath, 'utf-8');
          const hasContent = indexContent.length > 1000;
          console.log(`   📏 Contenido: ${hasContent ? '✅ (>1KB)' : '⚠️ (<1KB)'}`);
        }
      } else {
        console.log(`   ⚠️ Es archivo, no directorio`);
      }
    } else {
      console.log(`   ❌ Directorio no existe`);
    }
  });

  console.log('\n🖼️ VERIFICACIÓN DE IMÁGENES:');
  console.log('─'.repeat(50));

  images.forEach((img, index) => {
    const fullPath = path.join(__dirname, img);
    const exists = fs.existsSync(fullPath);

    // Extraer el nombre de la propiedad del path
    const pathParts = img.split('/');
    const propertyName = pathParts[pathParts.length - 2];

    console.log(`${index + 1}. ${propertyName}`);
    console.log(`   🖼️ ${img} ${exists ? '✅' : '❌'}`);

    if (exists) {
      const stats = fs.statSync(fullPath);
      const sizeKB = Math.round(stats.size / 1024);
      console.log(`   📏 Tamaño: ${sizeKB}KB`);
    } else {
      console.log(`   ❌ Archivo no encontrado`);
    }
  });

  // Resumen
  const brokenLinks = links.filter(link => !fs.existsSync(path.join(__dirname, link)));
  const brokenImages = images.filter(img => !fs.existsSync(path.join(__dirname, img)));

  console.log('\n📊 RESUMEN FINAL:');
  console.log('─'.repeat(50));
  console.log(`✅ Enlaces válidos: ${links.length - brokenLinks.length}/${links.length}`);
  console.log(`❌ Enlaces rotos: ${brokenLinks.length}`);
  console.log(`✅ Imágenes válidas: ${images.length - brokenImages.length}/${images.length}`);
  console.log(`❌ Imágenes faltantes: ${brokenImages.length}`);

  if (brokenLinks.length === 0 && brokenImages.length === 0) {
    console.log('\n🎉 ¡Todas las rutas están correctas!');
    console.log('\n📋 PROPIEDADES EN INDEX.HTML:');
    console.log('─'.repeat(50));
    console.log('🏪 LOCALES COMERCIALES:');
    links.filter(link => link.includes('LOCALES')).forEach(link => {
      const propertyName = link.split('/').slice(-2)[0];
      console.log(`   ✅ ${propertyName}`);
    });
    console.log('\n🏠 VIVIENDAS:');
    links.filter(link => link.includes('VIVIENDAS')).forEach(link => {
      const propertyName = link.split('/').slice(-2)[0];
      console.log(`   ✅ ${propertyName}`);
    });
  } else {
    console.log('\n⚠️ Hay problemas con algunas rutas:');
    if (brokenLinks.length > 0) {
      console.log('Enlaces rotos:');
      brokenLinks.forEach(link => console.log(`   ❌ ${link}`));
    }
    if (brokenImages.length > 0) {
      console.log('Imágenes faltantes:');
      brokenImages.forEach(img => console.log(`   ❌ ${img}`));
    }
  }

} catch (err) {
  console.error('❌ Error verificando HTML:', err.message);
}
