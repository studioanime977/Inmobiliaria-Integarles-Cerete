// Script mejorado para verificar que todas las propiedades tengan sus archivos correctamente
// Específicamente para verificar que las carpetas renombradas tengan index.html

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN COMPLETA DE PROPIEDADES');
console.log('═'.repeat(60));

const categories = ['LOCALES', 'VIVIENDAS'];

categories.forEach(category => {
  const categoryPath = path.join(__dirname, 'assets', 'img', category);

  if (!fs.existsSync(categoryPath)) {
    console.log(`❌ No existe el directorio ${category}`);
    return;
  }

  console.log(`\n📁 ${category} (${fs.readdirSync(categoryPath).length} propiedades)`);
  console.log('─'.repeat(50));

  const folders = fs.readdirSync(categoryPath, { withFileTypes: true });

  folders.forEach(folder => {
    if (folder.isDirectory()) {
      const folderPath = path.join(categoryPath, folder.name);
      const indexPath = path.join(folderPath, 'index.html');
      const portadaPath = path.join(folderPath, 'PORTADA.jpg');

      console.log(`\n🏠 ${folder.name}`);

      // Verificar index.html
      if (fs.existsSync(indexPath)) {
        const indexContent = fs.readFileSync(indexPath, 'utf-8');
        const hasContent = indexContent.length > 1000; // Archivos HTML reales tienen más de 1000 caracteres
        console.log(`   📄 index.html: ${hasContent ? '✅ (con contenido)' : '⚠️ (vacío)'}`);
      } else {
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

      // Verificar otros archivos comunes
      const files = fs.readdirSync(folderPath);
      const images = files.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
      console.log(`   📸 Imágenes: ${images.length} archivos`);

      if (images.length === 0) {
        console.log(`   ⚠️ No hay imágenes en ${folder.name}`);
      }
    }
  });
});

console.log('\n🎯 VERIFICACIÓN ESPECÍFICA DE ENLACES DEL HTML');
console.log('─'.repeat(50));

// Verificar que los enlaces del HTML apunten a directorios válidos
const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

const linkRegex = /href=["']([^"']+\.html)["']/g;
let match;

console.log('\n🔗 Enlaces HTML encontrados:');
while ((match = linkRegex.exec(htmlContent)) !== null) {
  const link = match[1];
  if (link.includes('assets/img/')) {
    const fullPath = path.join(__dirname, link);
    const exists = fs.existsSync(fullPath);

    if (exists) {
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        const indexPath = path.join(fullPath, 'index.html');
        const hasIndex = fs.existsSync(indexPath);
        console.log(`   ✅ ${link} (${hasIndex ? 'con index.html' : 'sin index.html'})`);
      } else {
        console.log(`   ⚠️ ${link} (es archivo, no directorio)`);
      }
    } else {
      console.log(`   ❌ ${link} (no existe)`);
    }
  }
}

console.log('\n📊 RESUMEN DE PROPIEDADES EN INDEX.HTML');
console.log('─'.repeat(50));

// Listar todas las propiedades mencionadas en el HTML
const propertyLinks = [];
const linkRegex2 = /href=["']([^"']*assets\/img\/[^"']*)["']/g;
while ((match = linkRegex2.exec(htmlContent)) !== null) {
  propertyLinks.push(match[1]);
}

propertyLinks.forEach((link, index) => {
  const fullPath = path.join(__dirname, link);
  const exists = fs.existsSync(fullPath);

  console.log(`${index + 1}. ${path.basename(path.dirname(link))}`);
  console.log(`   📁 ${link} ${exists ? '✅' : '❌'}`);

  if (exists && fs.statSync(fullPath).isDirectory()) {
    const indexPath = path.join(fullPath, 'index.html');
    const hasIndex = fs.existsSync(indexPath);
    console.log(`   📄 index.html: ${hasIndex ? '✅' : '❌'}`);
  }
});

console.log('\n🎉 VERIFICACIÓN COMPLETADA');
