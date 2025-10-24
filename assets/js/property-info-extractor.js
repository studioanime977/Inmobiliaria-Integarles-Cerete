/**
 * Extractor automático de información clave de propiedades
 * Detecta y organiza medidas, habitaciones, baños, etc.
 */

document.addEventListener('DOMContentLoaded', function() {
    const propertyInfoDetails = document.querySelector('.property-info-details');
    if (!propertyInfoDetails) return;

    const descriptionParagraph = propertyInfoDetails.querySelector('p:first-of-type');
    if (!descriptionParagraph) return;

    const description = descriptionParagraph.textContent;
    
    // Patrones para extraer información específica
    const patterns = {
        medidas: /MEDIDAS\s+APROX\s+(\d+\s*[×x]\s*\d+)/gi,
        metrosCuadrados: /(\d+)\s*mts?\s*cuadrados?/gi,
        habitaciones: /(\d+)\s*habitacion(es)?/gi,
        banos: /(\d+)\s*ba[ñn]os?/gi,
        pisos: /(\d+)\s*pisos?/gi,
        parqueaderos: /(\d+)\s*parqueaderos?/gi,
        locales: /(\d+)\s*locales?/gi
    };

    const extractedInfo = [];

    // Extraer información usando los patrones
    Object.entries(patterns).forEach(([key, pattern]) => {
        const matches = [...description.matchAll(pattern)];
        matches.forEach(match => {
            let info = '';
            switch(key) {
                case 'medidas':
                    info = `📐 ${match[1]}`;
                    break;
                case 'metrosCuadrados':
                    info = `📏 ${match[1]} m²`;
                    break;
                case 'habitaciones':
                    info = `🛏️ ${match[1]} hab.`;
                    break;
                case 'banos':
                    info = `🚿 ${match[1]} baños`;
                    break;
                case 'pisos':
                    info = `🏢 ${match[1]} pisos`;
                    break;
                case 'parqueaderos':
                    info = `🚗 ${match[1]} parq.`;
                    break;
                case 'locales':
                    info = `🏪 ${match[1]} locales`;
                    break;
            }
            if (info && !extractedInfo.includes(info)) {
                extractedInfo.push(info);
            }
        });
    });

    // Crear contenedor de características si hay información extraída
    if (extractedInfo.length > 0) {
        let featuresContainer = propertyInfoDetails.querySelector('.property-features');
        
        if (!featuresContainer) {
            featuresContainer = document.createElement('div');
            featuresContainer.className = 'property-features';
            
            // Insertar después del primer párrafo
            const firstParagraph = propertyInfoDetails.querySelector('p:first-of-type');
            if (firstParagraph.nextSibling) {
                propertyInfoDetails.insertBefore(featuresContainer, firstParagraph.nextSibling);
            } else {
                propertyInfoDetails.appendChild(featuresContainer);
            }
        }

        // Añadir chips de información extraída
        extractedInfo.forEach(info => {
            const chip = document.createElement('span');
            chip.textContent = info;
            featuresContainer.appendChild(chip);
        });

        // Marcar el párrafo como que tiene medidas para CSS
        if (extractedInfo.some(info => info.includes('📐') || info.includes('📏'))) {
            descriptionParagraph.setAttribute('data-has-measurements', 'true');
        }
    }

    // Mejorar formato de números en la descripción
    const formattedDescription = description
        .replace(/(\d+)\s*[×x]\s*(\d+)/g, '<strong>$1 × $2</strong>')
        .replace(/\$(\d{1,3}(?:\.\d{3})*(?:\.\d{3})*)/g, '<strong class="price-highlight">$$$1</strong>')
        .replace(/(\d+)\s*mts?\s*cuadrados?/gi, '<strong class="area-highlight">$1 m²</strong>');

    if (formattedDescription !== description) {
        descriptionParagraph.innerHTML = formattedDescription;
    }
});

// Añadir estilos dinámicos para los elementos resaltados
const style = document.createElement('style');
style.textContent = `
    .price-highlight {
        background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
        color: #166534;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 700;
    }
    
    .area-highlight {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        color: #92400e;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 600;
    }
    
    .property-info-details p strong {
        font-weight: 600;
    }
`;
document.head.appendChild(style);