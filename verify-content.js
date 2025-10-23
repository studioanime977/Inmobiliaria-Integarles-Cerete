// Script para verificar que todos los index.html de las propiedades tengan contenido válido
const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN DE CONTENIDO DE PROPIEDADES');
console.log('═'.repeat(60));

const categories = ['LOCALES', 'VIVIENDAS'];
let totalProperties = 0;
let propertiesWithContent = 0;
let propertiesWithoutContent = 0;
let propertiesWithImages = 0;

categories.forEach(category => {
  const categoryPath = path.join(__dirname, 'assets', 'img', category);

  if (!fs.existsSync(categoryPath)) {
    console.log(`❌ No existe el directorio ${category}`);
    return;
  }

  console.log(`\n📁 ${category.toUpperCase()} - Verificando contenido:`);
  console.log('─'.repeat(50));

  const folders = fs.readdirSync(categoryPath, { withFileTypes: true });

  folders.forEach(folder => {
    if (folder.isDirectory()) {
      totalProperties++;
      const folderPath = path.join(categoryPath, folder.name);
      const indexPath = path.join(folderPath, 'index.html');
      const portadaPath = path.join(folderPath, 'PORTADA.jpg');

      console.log(`\n🏠 ${folder.name}`);

      // Verificar index.html
      if (fs.existsSync(indexPath)) {
        const indexContent = fs.readFileSync(indexPath, 'utf-8');
        const hasContent = indexContent.length > 1000; // Contenido mínimo esperado
        const hasTitle = indexContent.includes('<title>') || indexContent.includes('INFO.txt');
        const hasImages = indexContent.includes('<img') || indexContent.includes('PORTADA');

        console.log(`   📄 index.html: ✅ (${Math.round(indexContent.length / 1024)}KB)`);
        console.log(`   🏷️ Tiene título: ${hasTitle ? '✅' : '⚠️'}`);
        console.log(`   🖼️ Tiene imágenes: ${hasImages ? '✅' : '⚠️'}`);

        if (hasContent && hasTitle) {
          propertiesWithContent++;
          if (hasImages) propertiesWithImages++;
        } else {
          propertiesWithoutContent++;
          console.log(`   ⚠️ CONTENIDO INSUFICIENTE`);
        }
      } else {
        propertiesWithoutContent++;
        console.log(`   ❌ index.html: no existe`);
      }

      // Verificar PORTADA.jpg
      if (fs.existsSync(portadaPath)) {
        const stats = fs.statSync(portadaPath);
        const sizeKB = Math.round(stats.size / 1024);
        console.log(`   🖼️ PORTADA.jpg: ✅ (${sizeKB}KB)`);
      } else {
        console.log(`   ❌ PORTADA.jpg: no existe`);
      }

      // Listar otros archivos
      const files = fs.readdirSync(folderPath);
      const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
      console.log(`   📸 Otras imágenes: ${imageFiles.length} archivos`);

      if (imageFiles.length > 0) {
        console.log(`      ${imageFiles.join(', ')}`);
      }
    }
  });
});

console.log('\n📊 RESUMEN COMPLETO:');
console.log('─'.repeat(50));
console.log(`📁 Total de propiedades: ${totalProperties}`);
console.log(`✅ Con contenido válido: ${propertiesWithContent}`);
console.log(`⚠️ Sin contenido suficiente: ${propertiesWithoutContent}`);
console.log(`🖼️ Con imágenes: ${propertiesWithImages}`);

if (propertiesWithoutContent === 0) {
  console.log('\n🎉 ¡Todas las propiedades tienen contenido válido!');
} else {
  console.log(`\n⚠️ ${propertiesWithoutContent} propiedades necesitan revisión.`);
}

console.log('\n🏆 PROPIEDADES DESTACADAS EN INDEX.HTML:');
console.log('─'.repeat(50));

// Listar las propiedades que están en el HTML
const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

const linkRegex = /href=["']([^"']*assets\/img\/[^"']*\/index\.html[^"']*)["']/g;
let match;

console.log('\n📋 PROPIEDADES EN HTML:');
while ((match = linkRegex.exec(htmlContent)) !== null) {
  const link = match[1];
  const fullPath = path.join(__dirname, link);
  const exists = fs.existsSync(fullPath);

  const pathParts = link.split('/');
  const propertyName = pathParts[pathParts.length - 2];
  const category = pathParts.includes('LOCALES') ? 'LOCALES' : 'VIVIENDAS';

  console.log(`\n🏠 ${propertyName} (${category})`);
  console.log(`   📁 ${link}`);

  if (exists) {
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      const indexPath = path.join(fullPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf-8');
        console.log(`   ✅ Contenido: ${Math.round(content.length / 1024)}KB`);
        console.log(`   📄 Estado: ${content.includes('<title>') ? 'Completo' : 'Incompleto'}`);
      } else {
        console.log(`   ❌ Sin index.html`);
      }
    } else {
      console.log(`   ⚠️ No es directorio`);
    }
  } else {
    console.log(`   ❌ No existe`);
  }
}

console.log('\n🎯 TODOS LOS ENLACES VERIFICADOS ✅');
