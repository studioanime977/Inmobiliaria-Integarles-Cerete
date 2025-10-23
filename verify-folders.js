const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN DE ESTRUCTURA DE CARPETAS\n');
console.log('═'.repeat(60));

// Función para normalizar paths
function normalizePath(folderName) {
  return folderName
    .replace(/\s+/g, '-') // Reemplazar espacios por guiones
    .replace(/[^a-zA-Z0-9\-]/g, '') // Remover caracteres especiales
    .replace(/-+/g, '-') // Reemplazar múltiples guiones por uno solo
    .toLowerCase();
}

const basePath = path.join(__dirname, 'assets', 'img', 'VIVIENDAS');

try {
  const folders = fs.readdirSync(basePath, { withFileTypes: true });

  console.log(`📁 Carpetas encontradas en VIVIENDAS: ${folders.length}\n`);

  let mismatches = [];

  folders.forEach(folder => {
    if (folder.isDirectory()) {
      const actualName = folder.name;
      const normalizedName = normalizePath(actualName);

      if (actualName !== normalizedName) {
        console.log(`⚠️ INCONSISTENCIA ENCONTRADA:`);
        console.log(`   📁 Actual: ${actualName}`);
        console.log(`   🎯 Debería ser: ${normalizedName}`);
        console.log(`   🔗 URL generada: assets/img/VIVIENDAS/${normalizedName}/index.html`);
        console.log('');

        mismatches.push({
          actual: actualName,
          normalized: normalizedName,
          path: `assets/img/VIVIENDAS/${normalizedName}/index.html`
        });
      } else {
        console.log(`✅ ${actualName} (correcto)`);
      }
    }
  });

  if (mismatches.length === 0) {
    console.log('\n🎉 ¡Todas las carpetas están correctamente nombradas!');
  } else {
    console.log(`\n📋 RESUMEN DE CAMBIOS NECESARIOS:`);
    console.log('─'.repeat(60));

    mismatches.forEach((item, index) => {
      console.log(`${index + 1}. Renombrar:`);
      console.log(`   De: ${item.actual}`);
      console.log(`   A: ${item.normalized}`);
      console.log('');
    });

    console.log(`\n💡 COMANDOS PARA RENOMBRAR CARPETAS:`);
    mismatches.forEach((item, index) => {
      console.log(`mv "assets/img/VIVIENDAS/${item.actual}" "assets/img/VIVIENDAS/${item.normalized}"`);
    });
  }

} catch (err) {
  console.error('❌ Error escaneando carpetas:', err.message);
}
