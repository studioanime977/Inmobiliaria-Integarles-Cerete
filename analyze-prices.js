const fs = require('fs');
const path = require('path');

// Leer el índice
const indexPath = path.join(__dirname, 'assets', 'data', 'content-index.json');
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

console.log('📊 ANÁLISIS DE PRECIOS - Inmobiliaria Integrales Cereté\n');
console.log('═'.repeat(60));

// Filtrar items con precio
const itemsWithPrice = index.items.filter(item => item.price && typeof item.price === 'number');

console.log(`\n📈 Total de propiedades: ${index.totalItems}`);
console.log(`💰 Propiedades con precio: ${itemsWithPrice.length}`);
console.log(`❓ Propiedades sin precio: ${index.totalItems - itemsWithPrice.length}\n`);

// Análisis por categoría
const categories = ['locales', 'viviendas'];

categories.forEach(category => {
  const items = itemsWithPrice.filter(item => item.category === category);
  
  if(items.length === 0) {
    console.log(`\n🏢 ${category.toUpperCase()}: Sin precios disponibles`);
    return;
  }
  
  const prices = items.map(item => item.price).sort((a, b) => a - b);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const median = prices[Math.floor(prices.length / 2)];
  
  console.log(`\n🏢 ${category.toUpperCase()}`);
  console.log('─'.repeat(60));
  console.log(`   Total: ${items.length} propiedades`);
  console.log(`   💵 Precio mínimo: $${min.toLocaleString('es-CO')}`);
  console.log(`   💰 Precio máximo: $${max.toLocaleString('es-CO')}`);
  console.log(`   📊 Precio promedio: $${avg.toLocaleString('es-CO')}`);
  console.log(`   📈 Precio mediano: $${median.toLocaleString('es-CO')}`);
  
  // Rangos sugeridos
  console.log(`\n   💡 Rangos sugeridos para búsqueda:`);
  const range1 = Math.round(min / 100000) * 100000;
  const range2 = Math.round(median / 100000) * 100000;
  const range3 = Math.round(max / 100000) * 100000;
  
  console.log(`      • Económico: $${range1.toLocaleString('es-CO')} - $${range2.toLocaleString('es-CO')}`);
  console.log(`      • Medio: $${range2.toLocaleString('es-CO')} - $${range3.toLocaleString('es-CO')}`);
  console.log(`      • Premium: Desde $${range3.toLocaleString('es-CO')}`);
  
  // Distribución por rangos
  console.log(`\n   📊 Distribución por rangos:`);
  const ranges = [
    { label: 'Menos de 500k', min: 0, max: 500000 },
    { label: '500k - 700k', min: 500000, max: 700000 },
    { label: '700k - 1M', min: 700000, max: 1000000 },
    { label: 'Más de 1M', min: 1000000, max: Infinity }
  ];
  
  ranges.forEach(range => {
    const count = prices.filter(p => p >= range.min && p < range.max).length;
    if(count > 0) {
      const percentage = Math.round((count / prices.length) * 100);
      const bar = '█'.repeat(Math.round(percentage / 5));
      console.log(`      ${range.label.padEnd(20)} ${count.toString().padStart(2)} (${percentage}%) ${bar}`);
    }
  });
});

// Análisis por estado (arriendo/venta)
console.log(`\n\n📋 ANÁLISIS POR ESTADO`);
console.log('═'.repeat(60));

const statuses = ['arriendo', 'venta'];

statuses.forEach(status => {
  const items = itemsWithPrice.filter(item => {
    const itemStatus = item.status || (item.category === 'locales' ? 'arriendo' : 'venta');
    return itemStatus === status;
  });
  
  if(items.length === 0) {
    console.log(`\n${status.toUpperCase()}: Sin propiedades`);
    return;
  }
  
  const prices = items.map(item => item.price).sort((a, b) => a - b);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  
  console.log(`\n${status.toUpperCase()}`);
  console.log('─'.repeat(60));
  console.log(`   Total: ${items.length} propiedades`);
  console.log(`   💵 Desde: $${min.toLocaleString('es-CO')}`);
  console.log(`   💰 Hasta: $${max.toLocaleString('es-CO')}`);
  
  // Ejemplos de búsqueda
  const example1 = Math.round(min / 100000) * 100000;
  const example2 = Math.round((min + max) / 2 / 100000) * 100000;
  
  console.log(`\n   💬 Ejemplos de búsqueda:`);
  console.log(`      • "${example1 / 1000}k-${example2 / 1000}k"`);
  console.log(`      • "desde ${example1 / 1000}k"`);
  console.log(`      • "hasta ${example2 / 1000}k"`);
});

console.log('\n' + '═'.repeat(60));
console.log('✅ Análisis completado\n');
