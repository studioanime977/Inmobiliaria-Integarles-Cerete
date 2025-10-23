const fs = require('fs');
const path = require('path');

// Función para normalizar nombres de carpetas a títulos legibles
function normalizeTitle(folderName) {
  return folderName
    .replace(/\//g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Función para normalizar paths de carpetas (eliminar espacios y caracteres especiales)
function normalizePath(folderName) {
  return folderName
    .replace(/\s+/g, '-') // Reemplazar espacios por guiones
    .replace(/[^a-zA-Z0-9\-]/g, '') // Remover caracteres especiales
    .replace(/-+/g, '-') // Reemplazar múltiples guiones por uno solo
    .toLowerCase();
}

// Función para extraer precio del texto INFO
function extractPrice(text) {
  const match = text.match(/VALOR\s*\$?\s*([\d.,]+)/i);
  if (match) {
    const priceStr = match[1].replace(/\./g, '').replace(/,/g, '');
    return parseInt(priceStr, 10);
  }
  return null;
}

// Función para determinar el estado (arriendo o venta)
function extractStatus(text) {
  const textLower = text.toLowerCase();
  if (textLower.includes('arriendo') || textLower.includes('arrienda')) {
    return 'arriendo';
  }
  if (textLower.includes('venta') || textLower.includes('vende')) {
    return 'venta';
  }
  return 'arriendo'; // Por defecto
}

// Función para generar keywords desde el título y el texto
function generateKeywords(title, infoText) {
  const keywords = new Set();
  
  // Palabras del título
  title.toLowerCase().split(/\s+/).forEach(word => {
    if (word.length > 2) keywords.add(word);
  });
  
  // Palabras clave del texto
  const textLower = infoText.toLowerCase();
  const keywordPatterns = [
    /(\d+)\s*habitaciones?/gi,
    /(\d+)\s*baños?/gi,
    /barrio\s+([a-záéíóúñ\s]+)/gi,
    /calle\s+([a-záéíóúñ\s]+)/gi,
    /cerca\s+de\s+([a-záéíóúñ\s]+)/gi,
    /frente\s+a\s+([a-záéíóúñ\s]+)/gi
  ];
  
  keywordPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(textLower)) !== null) {
      if (match[1]) {
        match[1].split(/\s+/).forEach(word => {
          if (word.length > 2) keywords.add(word);
        });
      }
    }
  });
  
  return Array.from(keywords).slice(0, 15); // Limitar a 15 keywords
}

// Función para escanear una carpeta y sus subcarpetas
function scanFolder(basePath, category) {
  const items = [];
  
  try {
    const folders = fs.readdirSync(basePath, { withFileTypes: true });
    
    folders.forEach(folder => {
      if (folder.isDirectory()) {
        const folderPath = path.join(basePath, folder.name);
        const infoPath = path.join(folderPath, 'INFO.txt');
        
        if (fs.existsSync(infoPath)) {
          try {
            const infoText = fs.readFileSync(infoPath, 'utf-8');
            const title = normalizeTitle(folder.name);
            const price = extractPrice(infoText);
            const status = extractStatus(infoText);
            const keywords = generateKeywords(title, infoText);
            
            // Generar path relativo para el HTML con nombre limpio
            const cleanFolderName = normalizePath(folder.name);
            const relativePath = `assets/img/${category}/${cleanFolderName}/index.html`;
            
            items.push({
              category: category.toLowerCase(),
              title: title,
              path: relativePath,
              keywords: keywords,
              status: status,
              price: price,
              info: infoText.trim(),
              folder: folder.name
            });
            
            console.log(`✓ Procesado: ${title} (${status}, $${price || 'N/A'})`);
          } catch (err) {
            console.error(`✗ Error leyendo INFO.txt en ${folder.name}:`, err.message);
          }
        } else {
          console.warn(`⚠ No se encontró INFO.txt en ${folder.name}`);
        }
      }
    });
  } catch (err) {
    console.error(`✗ Error escaneando carpeta ${basePath}:`, err.message);
  }
  
  return items;
}

// Función principal
function generateIndex() {
  console.log('🚀 Generando índice de contenido...\n');
  
  const baseDir = __dirname;
  const localesPath = path.join(baseDir, 'assets', 'img', 'LOCALES');
  const viviendasPath = path.join(baseDir, 'assets', 'img', 'VIVIENDAS');
  
  let allItems = [];
  
  // Escanear LOCALES
  console.log('📁 Escaneando LOCALES...');
  const locales = scanFolder(localesPath, 'LOCALES');
  allItems = allItems.concat(locales);
  console.log(`✓ ${locales.length} locales encontrados\n`);
  
  // Escanear VIVIENDAS
  console.log('📁 Escaneando VIVIENDAS...');
  const viviendas = scanFolder(viviendasPath, 'VIVIENDAS');
  allItems = allItems.concat(viviendas);
  console.log(`✓ ${viviendas.length} viviendas encontradas\n`);
  
  // Ordenar por categoría y título
  allItems.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.title.localeCompare(b.title);
  });
  
  // Crear el objeto JSON
  const indexData = {
    version: 2,
    updated: new Date().toISOString().split('T')[0],
    totalItems: allItems.length,
    categories: {
      locales: locales.length,
      viviendas: viviendas.length
    },
    items: allItems
  };
  
  // Guardar el archivo
  const outputPath = path.join(baseDir, 'assets', 'data', 'content-index.json');
  
  // Crear directorio si no existe
  const dataDir = path.dirname(outputPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(indexData, null, 2), 'utf-8');
  
  console.log('✅ Índice generado exitosamente!');
  console.log(`📄 Archivo: ${outputPath}`);
  console.log(`📊 Total de propiedades: ${allItems.length}`);
  console.log(`   - Locales: ${locales.length}`);
  console.log(`   - Viviendas: ${viviendas.length}`);
}

// Ejecutar
try {
  generateIndex();
} catch (err) {
  console.error('❌ Error fatal:', err);
  process.exit(1);
}
