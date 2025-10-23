const fs = require('fs');
const path = require('path');

// Función para normalizar paths
function normalizePath(folderName) {
  return folderName
    .replace(/\s+/g, '-') // Reemplazar espacios por guiones
    .replace(/[^a-zA-Z0-9\-]/g, '') // Remover caracteres especiales
    .replace(/-+/g, '-') // Reemplazar múltiples guiones por uno solo
    .toLowerCase();
}

console.log('🔄 RENOMBRANDO CARPETAS PARA URLs LIMPIAS\n');
console.log('═'.repeat(60));

const categories = ['LOCALES', 'VIVIENDAS'];

categories.forEach(category => {
  const basePath = path.join(__dirname, 'assets', 'img', category);

  try {
    const folders = fs.readdirSync(basePath, { withFileTypes: true });

    console.log(`\n📁 Procesando ${category}...`);
    console.log('─'.repeat(40));

    folders.forEach(folder => {
      if (folder.isDirectory()) {
        const actualName = folder.name;
        const normalizedName = normalizePath(actualName);

        if (actualName !== normalizedName) {
          const oldPath = path.join(basePath, actualName);
          const newPath = path.join(basePath, normalizedName);

          console.log(`🔄 Renombrando:`);
          console.log(`   De: ${actualName}`);
          console.log(`   A:  ${normalizedName}`);

          // Verificar si el directorio destino ya existe
          if (fs.existsSync(newPath)) {
            console.log(`   ⚠️  Ya existe: ${normalizedName} (saltando)`);
          } else {
            try {
              fs.renameSync(oldPath, newPath);
              console.log(`   ✅ Renombrado exitosamente`);
            } catch (err) {
              console.log(`   ❌ Error renombrando: ${err.message}`);
            }
          }
          console.log('');
        } else {
          console.log(`✅ ${actualName} (ya está correcto)`);
        }
      }
    });

  } catch (err) {
    console.error(`❌ Error procesando ${category}:`, err.message);
  }
});

console.log('\n🎉 ¡Renombrado completado!');
console.log('\n💡 NOTA: Si hay errores, ejecuta este script con permisos de administrador');
console.log('   o verifica que no hay archivos abiertos en las carpetas.');
