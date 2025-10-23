// Script para verificar el estado del content-index.json
// Ejecuta esto en el directorio del proyecto

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN DEL CONTENT-INDEX.JSON');
console.log('═'.repeat(60));

const indexPath = path.join(__dirname, 'assets', 'data', 'content-index.json');

try {
  if (!fs.existsSync(indexPath)) {
    console.log('❌ El archivo content-index.json no existe');
    console.log('💡 Ejecuta: node generate-index.js');
    process.exit(1);
  }

  const content = fs.readFileSync(indexPath, 'utf-8');
  const index = JSON.parse(content);

  console.log('✅ Archivo encontrado');
  console.log('📊 Total de propiedades:', index.totalItems);
  console.log('📁 Categorías:', index.categories);
  console.log('📅 Última actualización:', index.updated);

  console.log('\n🔗 VERIFICACIÓN DE PATHS:');
  console.log('─'.repeat(50));

  let problematicPaths = [];
  let cleanPaths = [];

  index.items.forEach((item, index) => {
    console.log(`\n📄 Propiedad ${index + 1}: ${item.title}`);
    console.log(`   📁 Path: ${item.path}`);

    if (item.path.includes('%20') || item.path.includes(' ')) {
      console.log(`   ❌ PROBLEMA: Contiene espacios o %20`);
      problematicPaths.push(item.path);
    } else {
      console.log(`   ✅ CORRECTO: Path limpio`);
      cleanPaths.push(item.path);
    }
  });

  console.log('\n📊 RESUMEN:');
  console.log('─'.repeat(50));
  console.log(`✅ Paths limpios: ${cleanPaths.length}`);
  console.log(`❌ Paths con problemas: ${problematicPaths.length}`);

  if (problematicPaths.length > 0) {
    console.log('\n⚠️ PATHS PROBLEMÁTICOS:');
    problematicPaths.forEach(path => {
      console.log(`   ❌ ${path}`);
    });
    console.log('\n💡 SOLUCIÓN: Regenera el índice');
    console.log('   Ejecuta: node generate-index.js');
  } else {
    console.log('\n🎉 ¡Todos los paths están limpios!');
  }

  // Verificar específicamente la propiedad "orilla del rio centro"
  const orillaProperty = index.items.find(item =>
    item.path.includes('orilla') || item.title.includes('orilla')
  );

  if (orillaProperty) {
    console.log('\n🎯 PROPIEDAD ESPECÍFICA:');
    console.log('─'.repeat(50));
    console.log(`📄 Título: ${orillaProperty.title}`);
    console.log(`📁 Path: ${orillaProperty.path}`);
    console.log(`📂 Folder: ${orillaProperty.folder}`);
    console.log(`💰 Precio: ${orillaProperty.price || 'N/A'}`);

    if (orillaProperty.path.includes('%20') || orillaProperty.path.includes(' ')) {
      console.log('❌ PROBLEMA: El path de orilla contiene caracteres no deseados');
    } else {
      console.log('✅ CORRECTO: El path de orilla está limpio');
    }
  } else {
    console.log('\n❌ No se encontró la propiedad "orilla"');
  }

} catch (err) {
  console.error('❌ Error leyendo el archivo:', err.message);
  console.log('💡 Regenera el índice: node generate-index.js');
}
