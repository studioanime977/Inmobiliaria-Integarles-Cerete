/* ===================================
   INMOBILIARIA INTEGARLES CERETE
   JavaScript Principal
   =================================== */

(function($) {
    'use strict';

    // Preloader
    $(window).on('load', function() {
        $('#preloader').fadeOut('slow', function() {
            $(this).remove();
        });
    });

    // Document Ready
    $(document).ready(function() {
        
        // Initialize AOS (Animate On Scroll)
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });

        // Mobile Menu Toggle
        $('#mobile-menu').on('click', function() {
            $(this).toggleClass('active');
            $('#nav-menu').toggleClass('active');
        });

        // Close mobile menu when clicking on a link
        $('.nav-link').on('click', function() {
            $('#mobile-menu').removeClass('active');
            $('#nav-menu').removeClass('active');
        });

        // Brand click reload (logo + texto)
        $('.logo .logo-link').on('click', function(e){
            e.preventDefault();
            // Si ya estamos en el inicio, recarga; si no, navega al inicio y luego recarga
            if (location.hash === '#inicio' || location.pathname.endsWith('index.html') || location.pathname === '/') {
                location.reload();
            } else {
                window.location.href = 'index.html#inicio';
                setTimeout(function(){ location.reload(); }, 100);
            }
        });

        // Close mobile menu when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.nav-wrapper').length) {
                $('#mobile-menu').removeClass('active');
                $('#nav-menu').removeClass('active');
            }
        });

        // Smooth Scroll for Navigation Links
        $('a[href^="#"]').on('click', function(e) {
            var target = $(this.getAttribute('href'));
            if (target.length) {
                e.preventDefault();
                $('html, body').stop().animate({
                    scrollTop: target.offset().top - 80
                }, 1000);
            }
        });

        // Helper: desplazamiento consistente a #servicios con offset dinámico
        function scrollToServicios() {
            var $grid = $('.services-grid');
            var $target = $grid.length ? $grid : $('#servicios');
            if (!$target.length) return;
            var headerH = $('.header').outerHeight() || 0;
            var dest = Math.max(0, $target.offset().top - headerH - 16);
            $('html, body').stop().animate({ scrollTop: dest }, 600, function(){
                try { AOS.refresh(); } catch (err) {}
            });
            try { history.replaceState(null, '', '#servicios'); } catch (err) {}
        }
        
        // Header Scroll Effect
        $(window).on('scroll', function() {
            if ($(this).scrollTop() > 100) {
                $('.header').addClass('scrolled');
            } else {
                $('.header').removeClass('scrolled');
            }
        });

        // Active Navigation Link on Scroll
        $(window).on('scroll', function() {
            var scrollPos = $(document).scrollTop() + 100;
            
            $('.nav-link').each(function() {
                var currLink = $(this);
                var refElement = $(currLink.attr('href'));
                
                if (refElement.length && refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                    $('.nav-link').removeClass('active');
                    currLink.addClass('active');
                }
            });
        });

        // Hero Slider
        let currentSlide = 0;
        const slides = $('.hero-slide');
        const totalSlides = slides.length;
        const indicators = $('.indicator');

        function showSlide(n) {
            slides.removeClass('active');
            indicators.removeClass('active');
            
            currentSlide = (n + totalSlides) % totalSlides;
            
            slides.eq(currentSlide).addClass('active');
            indicators.eq(currentSlide).addClass('active');
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        // Auto slide
        let slideInterval = setInterval(nextSlide, 5000);

        // Pause auto slide on hover
        $('.hero').hover(
            function() {
                clearInterval(slideInterval);
            },
            function() {
                slideInterval = setInterval(nextSlide, 5000);
            }
        );

        // Navigation buttons
        $('.slider-btn.next').on('click', function() {
            nextSlide();
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });

        $('.slider-btn.prev').on('click', function() {
            prevSlide();
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });

        // Indicators
        $('.indicator').on('click', function() {
            const slideIndex = $(this).data('slide');
            showSlide(slideIndex);
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });

        // Search Form
        // Search form submit: filter featured cards on homepage
        $('.search-form').on('submit', function(e) {
          e.preventDefault();
          const tipo = $('#tipo').val(); // '' | 'arriendo' | 'venta'
          const propiedad = $('#propiedad').val(); // '' | 'apartamento' | 'casa' | 'local'
          const ubicacion = ($('#ubicacion').val() || '').trim().toLowerCase();
        
          const $cards = $('.featured-card');
          if ($cards.length === 0) {
            // If no featured cards on this page, do nothing (other pages)
            return;
          }
        
          $cards.each(function(){
            const $c = $(this);
            const status = ($c.attr('data-status') || '').toLowerCase();
            const type = ($c.attr('data-type') || '').toLowerCase();
            const city = ($c.attr('data-city') || '').toLowerCase();
            const text = ($c.text() || '').toLowerCase();
        
            const matchTipo = !tipo || status === tipo;
            const matchTipoProp = !propiedad || type === propiedad;
            const matchCity = !ubicacion || city.includes(ubicacion) || text.includes(ubicacion);
        
            const show = matchTipo && matchTipoProp && matchCity;
            $c.toggle(show);
          });
        });


        // Property Filters
        $('.filter-btn').on('click', function() {
            const filter = $(this).data('filter');
            
            $('.filter-btn').removeClass('active');
            $(this).addClass('active');
            
            if (filter === 'all') {
                $('.property-card').fadeIn(300);
            } else if (filter === 'arriendo') {
                // Excluir locales cuando se selecciona "En Arriendo"
                $('.property-card').hide();
                $('.property-card[data-category*="arriendo"]:not([data-category*="local"])').fadeIn(300);
            } else {
                $('.property-card').hide();
                $('.property-card[data-category*="' + filter + '"]').fadeIn(300);
            }
        });

        // Featured Filters (homepage)
        $('.featured-section .filter-btn').on('click', function(e) {
            e.preventDefault();
            const f = $(this).data('filter');
            const $grid = $('.featured-section .featured-grid');
            const ensureEmpty = (msg)=>{
              let $empty = $grid.find('.featured-empty');
              if(!$empty.length){
                $empty = $('<div class=\"featured-empty\" aria-live=\"polite\"></div>');
                $empty.append('<div class=\"featured-empty-content\"><h3>No hay propiedades para este filtro</h3><p>'+msg+'</p><div class=\"btns\"><a class=\"btn btn-primary btn-reset\" href=\"#todas\">Ver todas las propiedades</a><a class=\"btn btn-secondary btn-services\" href=\"#servicios\">Ver nuestros servicios</a></div></div>');
                $grid.append($empty);
              } else {
                $empty.find('p').text(msg);
              }
              $empty.show();
              // Auto-scroll para que el usuario vea el bloque inmediatamente
              const el = $empty.get(0);
              if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
              $empty.find('.btn-reset').off('click').on('click', function(ev){ ev.preventDefault(); $grid.closest('.featured-section').find('.featured-filters [data-filter=\"todas\"]').trigger('click'); });
              $empty.find('.btn-services').off('click').on('click', function(ev){ ev.preventDefault(); scrollToServicios(); });
            };
            const hideEmpty = ()=>{ $grid.find('.featured-empty').hide(); };

            $('.featured-section .filter-btn').removeClass('active');
            $(this).addClass('active');

            // Solicitud del usuario: 'asesoria' debe mostrar vacío y llevar a servicios
            if (f === 'asesoria') {
              $('.featured-card').hide();
              ensureEmpty('Asesoría inmobiliaria no lista propiedades.');
              scrollToServicios();
              return;
            }

            $('.featured-card').each(function(){
                const status = ($(this).attr('data-status') || '');
                const type   = ($(this).attr('data-type') || '');
                const show = f === 'todas' ||
                             (f === 'venta' && status === 'venta') ||
                             (f === 'locales' && type === 'local') ||
                             (f === 'vivienda' && type === 'vivienda');
                $(this).toggle(show);
            });

            const visible = $('.featured-card:visible').length;
            if(visible===0){
              ensureEmpty(f==='venta' ? 'Actualmente no hay propiedades en venta.' : 'No hay propiedades que coincidan.');
              scrollToServicios();
            } else {
              hideEmpty();
            }
            if (f === 'venta') { scrollToServicios(); }
        });

        // Servicios -> seleccionar filtro en Destacadas y/o abrir enlaces externos
          $('.services-grid .service-card').on('click', function(){
              const mapUrl = $(this).data('map');
              if (mapUrl) {
                  window.open(mapUrl, '_blank');
                  return;
              }
              const contact = $(this).data('contact');
              if (contact) {
                  window.open(contact, '_blank');
                  return;
              }
              const target = $(this).data('target-filter');
              const $btn = target ? $(`.featured-filters [data-filter="${target}"]`) : null;
              if ($btn && $btn.length) { $btn.trigger('click'); }
              const el = document.getElementById('propiedades');
              if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
          });

        // Property Card Favorite Toggle
        $('.property-overlay .btn-icon:nth-child(2)').on('click', function(e) {
            e.preventDefault();
            const icon = $(this).find('i');
            
            if (icon.hasClass('far')) {
                icon.removeClass('far').addClass('fas');
                $(this).css('color', '#e74c3c');
                
                // Animación
                $(this).addClass('animate__animated animate__heartBeat');
                setTimeout(() => {
                    $(this).removeClass('animate__animated animate__heartBeat');
                }, 1000);
            } else {
                icon.removeClass('fas').addClass('far');
                $(this).css('color', '');
            }
        });

        // Counter Animation
        function animateCounter(element, target) {
            let current = 0;
            const increment = target / 100;
            const duration = 2000;
            const stepTime = duration / 100;

            const timer = setInterval(function() {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (target >= 1000) {
                    $(element).text(Math.floor(current).toLocaleString() + '+');
                } else {
                    $(element).text(Math.floor(current) + '+');
                }
            }, stepTime);
        }

        // Trigger counter animation when in viewport
        const counters = $('.stat-number');
        let counterTriggered = false;

        $(window).on('scroll', function() {
            if (!counterTriggered && counters.length) {
                const counterOffset = counters.first().offset().top;
                const scrollTop = $(window).scrollTop() + $(window).height();

                if (scrollTop > counterOffset) {
                    counterTriggered = true;
                    counters.each(function() {
                        const text = $(this).text();
                        const target = parseInt(text.replace(/\D/g, ''));
                        animateCounter(this, target);
                    });
                }
            }
        });

        // Newsletter Form
        $('.newsletter-form').on('submit', function(e) {
            e.preventDefault();
            
            const email = $(this).find('input[type="email"]').val();
            
            if (email) {
                // Aquí puedes implementar la lógica de suscripción
                alert('¡Gracias por suscribirte! Te enviaremos información a: ' + email);
                $(this).find('input[type="email"]').val('');
            }
        });

        // Contact Form eliminado: no se aplica lógica de envío en esta versión

        // Scroll to Top Button
        const scrollTop = $('#scrollTop');
        
        $(window).on('scroll', function() {
            if ($(this).scrollTop() > 300) {
                scrollTop.addClass('show');
            } else {
                scrollTop.removeClass('show');
            }
        });
        
        scrollTop.on('click', function() {
            $('html, body').animate({scrollTop: 0}, 800);
        });

        // Lazy Loading Images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(function(img) {
                imageObserver.observe(img);
            });
        }

        // Form Input Animation
        $('.form-group input, .form-group select, .form-group textarea').on('focus', function() {
            $(this).parent().addClass('focused');
        }).on('blur', function() {
            if (!$(this).val()) {
                $(this).parent().removeClass('focused');
            }
        });

        // Tooltip Initialization (if using Bootstrap tooltips)
        // Desactivado para evitar errores cuando Bootstrap no está presente.

        // Parallax Effect for Hero
        $(window).on('scroll', function() {
            const scrolled = $(this).scrollTop();
            $('.hero-slide.active').css('transform', 'translateY(' + (scrolled * 0.5) + 'px)');
        });

        // Property Card Hover Effect Enhancement
        $('.property-card').hover(
            function() {
                $(this).find('.property-image img').css('transform', 'scale(1.1)');
            },
            function() {
                $(this).find('.property-image img').css('transform', 'scale(1)');
            }
        );

        // Testimonials Auto Rotate (optional)
        let testimonialIndex = 0;
        const testimonials = $('.testimonial-card');
        
        function rotateTestimonials() {
            testimonials.fadeOut(300);
            setTimeout(function() {
                testimonialIndex = (testimonialIndex + 1) % testimonials.length;
                testimonials.eq(testimonialIndex).fadeIn(300);
            }, 300);
        }

        // Uncomment to enable auto-rotation
        // setInterval(rotateTestimonials, 5000);

        // Console Welcome Message
        console.log('%c¡Bienvenido a Inmobiliaria Integarles Cerete!', 'color: #1a5490; font-size: 20px; font-weight: bold;');
        console.log('%cSitio web desarrollado con ❤️', 'color: #f39c12; font-size: 14px;');

        // Prevent Right Click on Images (optional - remove if not needed)
        // $('img').on('contextmenu', function(e) {
        //     e.preventDefault();
        //     return false;
        // });

        // Add Loading Animation to Buttons
        $('.btn').on('click', function() {
            const btn = $(this);
            if (!btn.hasClass('loading') && btn.is('[type="submit"]')) {
                btn.addClass('loading');
                setTimeout(function() {
                    btn.removeClass('loading');
                }, 2000);
            }
        });

        // Social Share Functionality (if needed)
        function shareOnSocialMedia(platform, url, title) {
            let shareUrl = '';
            
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        }

        // Add share functionality to property cards (example)
        $('.property-card').each(function() {
            const card = $(this);
            // You can add share buttons here if needed
        });

        // Detect if user is on mobile
        function isMobile() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }

        if (isMobile()) {
            $('body').addClass('mobile-device');
        }

        // Back Button History Management
        window.addEventListener('popstate', function(event) {
            // Handle back button navigation
            $('.nav-link').removeClass('active');
            const hash = window.location.hash;
            if (hash) {
                $(`.nav-link[href="${hash}"]`).addClass('active');
            }
        });

        // Performance Monitoring
        if (window.performance) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Tiempo de carga de página: ' + (pageLoadTime / 1000).toFixed(2) + ' segundos');
        }

        // Google Reviews Integration (via Maps JavaScript Places API)
        (function setupGoogleReviews() {
            const container = document.getElementById('google-reviews');
            if (!container) return;

            const apiKey = container.dataset.apiKey;
            const placeId = container.dataset.placeId;
            if (!apiKey || !placeId) {
                console.warn('Google Reviews: configure data-api-key and data-place-id on #google-reviews');
                return;
            }

            function loadScript() {
                return new Promise((resolve, reject) => {
                    if (window.google && window.google.maps && window.google.maps.places) {
                        resolve();
                        return;
                    }
                    const s = document.createElement('script');
                    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
                    s.async = true;
                    s.onload = resolve;
                    s.onerror = reject;
                    document.head.appendChild(s);
                });
            }

            function renderStars(rating) {
                const r = Math.round(rating || 0);
                let html = '<div class="testimonial-rating">';
                for (let i = 0; i < 5; i++) {
                    html += `<i class="fas fa-star${i < r ? '' : ' empty'}"></i>`;
                }
                html += '</div>';
                return html;
            }

            function renderReviewCard(review) {
                const photo = review.profile_photo_url || 'assets/ico/fondo.jpg';
                const text = review.text || '';
                const author = review.author_name || 'Cliente';
                return `
                    <div class="testimonial-card">
                        ${renderStars(review.rating)}
                        <p class="testimonial-text">${text.replace(/\n/g, ' ')}</p>
                        <div class="testimonial-author">
                            <img src="${photo}" alt="${author}">
                            <div class="author-info">
                                <h4>${author}</h4>
                                <p>Cliente</p>
                            </div>
                        </div>
                    </div>
                `;
            }

            function renderReviews(details) {
                const reviews = (details.reviews || []).slice(0, 6);
                if (!reviews.length) {
                    console.warn('Google Reviews: no reviews returned for Place');
                    return;
                }
                container.innerHTML = reviews.map(renderReviewCard).join('');
            }

            loadScript().then(() => {
                const service = new google.maps.places.PlacesService(document.createElement('div'));
                service.getDetails({
                    placeId: placeId,
                    fields: ['rating', 'user_ratings_total', 'reviews', 'name']
                }, (result, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && result) {
                        renderReviews(result);
                    } else {
                        console.error('Google Reviews getDetails status:', status);
                    }
                });
            }).catch((err) => {
                console.error('Google Maps script load failed', err);
            });
        })();

        // =====================
        // Viviendas en destacados
        // =====================
        (function(){
            const $grid = $('.featured-section .featured-grid');
            if ($grid.length === 0) return;

            const viviendas = [
              { folder: 'Barrio santa paula', title: 'Barrio santa paula' },
              { folder: 'PELAYO  cerca de la bomba entrada principal', title: 'PELAYO cerca de la bomba entrada principal' },
              { folder: 'altos del noval 2', title: 'Altos del Noval 2' },
              { folder: 'barrio 24 de mayo cerca del colegio', title: 'Barrio 24 de Mayo cerca del colegio' },
              { folder: 'barrio 24 de mayo urbanización San rafael', title: 'Barrio 24 de Mayo - Urbanización San Rafael' },
              { folder: 'barrio San Nicola', title: 'Barrio San Nicola' },
              { folder: 'barrio San Nicolas en toda la calle del cementerio', title: 'Barrio San Nicolas en toda la calle del cementerio' },
              { folder: 'barrio San diego consta de 3 habitaciones', title: 'Barrio San Diego - Consta de 3 habitaciones' },
              { folder: 'barrio San diego', title: 'Barrio San Diego' },
              { folder: 'barrio corinto, consta de 2 habitaciones', title: 'Barrio Corinto - Consta de 2 habitaciones' },
              { folder: 'barrio corinto', title: 'Barrio Corinto' },
              { folder: 'barrio el edén cerete', title: 'Barrio el Edén Cereté' },
              { folder: 'barrio el edén consta de 3 habitacione', title: 'Barrio el Edén - Consta de 3 habitaciones' },
              { folder: 'barrio el edén cuenta con 2 habitaciones', title: 'Barrio el Edén - Cuenta con 2 habitaciones' },
              { folder: 'barrio el noval frente a la calle de ferromateriales garces', title: 'Barrio el Noval - Frente a Ferromateriales Garcés' },
              { folder: 'barrio el pardo consta de 3', title: 'Barrio el Prado - Consta de 3' },
              { folder: 'barrio el prado al frente de la salida de colegio de los niños', title: 'Barrio el Prado - Frente a salida de colegio' },
              { folder: 'barrio el prado cuenta con 3 habitaciones', title: 'Barrio el Prado - Cuenta con 3 habitaciones' },
              { folder: 'barrio el prado de cereté', title: 'Barrio el Prado de Cereté' },
              { folder: 'barrio el prado', title: 'Barrio el Prado' },
              { folder: 'barrio la gloria consta de 3 habitacione', title: 'Barrio la Gloria - Consta de 3 habitaciones' },
              { folder: 'barrio santa clara consta de 3 habitaciones', title: 'Barrio Santa Clara - Consta de 3 habitaciones' },
              { folder: 'barrio santa clara frente a frutitodo', title: 'Barrio Santa Clara - Frente a Frutitodo' },
              { folder: 'barrio santa clara, cerca del parque', title: 'Barrio Santa Clara - Cerca del parque' },
              { folder: 'barrio santa clara', title: 'Barrio Santa Clara' },
              { folder: 'barrio santa paula, consta de 2 habitaciones', title: 'Barrio Santa Paula - Consta de 2 habitaciones' },
              { folder: 'barrio santa teresa consta 3 habitaciones', title: 'Barrio Santa Teresa - Consta 3 habitaciones' },
              { folder: 'barrio venus cereté', title: 'Barrio Venus Cereté' },
              { folder: 'barrio venus', title: 'Barrio Venus' },
              { folder: 'calle 23 de la gloria cuenta con 4 habitaciones', title: 'Calle 23 de la Gloria - Cuenta con 4 habitaciones' },
              { folder: 'calle cartagenita cerca de billares el hipico', title: 'Calle Cartagenita - Cerca de billares El Hípico' },
              { folder: 'calle cartagenita cerca del marceliano polo', title: 'Calle Cartagenita - Cerca del Marceliano Polo' },
              { folder: 'calle cartagenita en todo los semáforos', title: 'Calle Cartagenita - En todos los semáforos' },
              { folder: 'calle principal  del cañito', title: 'Calle Principal del Cañito' },
              { folder: 'edificio que está en los semáforos del granero jaramillo', title: 'Edificio en los semáforos del Granero Jaramillo' },
              { folder: 'garzones monteria', title: 'Garzones Montería' },
              { folder: 'orilla del rio centro', title: 'Orilla del río - Centro' },
              { folder: 'retiro de los indios', title: 'Retiro de los Indios' }
            ];

            function createCard(v) {
              const base = 'assets/img/VIVIENDAS/' + v.folder;
              const $card = $('<article/>', {
                class: 'featured-card',
                'data-type': 'vivienda',
                'data-status': 'arriendo',
                'data-city': 'cerete'
              });
              const $img = $('<img/>', { alt: 'Vivienda - ' + v.title });
              // Intento inicial a PORTADA.jpg, se resolverá por fallback onerror más abajo
              $img.attr('src', base + '/PORTADA.jpg');
              const $content = $('<div/>', { class: 'card-content' });
              $content.append($('<h3/>').text(v.title));
              const $p = $('<p/>', {
                class: 'info-text',
                'data-info-src': base + '/INFO.txt'
              }).text('Cargando información...');
              $content.append($p);
              $content.append($('<a/>', {
                class: 'btn btn-outline',
                href: base + '/index.html'
              }).text('Ver más información'));
              $card.append($img).append($content);
              return $card;
            }

            // Agregar tarjetas
            viviendas.forEach(v => { $grid.append(createCard(v)); });

            // Resolver imágenes de portada con fallback y cargar INFO.txt
            const $viviendaCards = $('.featured-card[data-type="vivienda"]');
            $viviendaCards.each(function(){
              const $card = $(this);
              const imgEl = $card.find('img')[0];
              const $info = $card.find('.info-text');

              // Fallback de imagen
              if (imgEl) {
                const basePath = (imgEl.getAttribute('src') || '').replace(/\\/g,'/').replace(/\/PORTADA\.jpg$/i,'');
                const candidates = ['PORTADA.jpg','portada.jpg','Portada.jpg','1.jpg'];
                let i = 0;
                const tryNext = () => {
                  if (i >= candidates.length) return;
                  imgEl.src = basePath + '/' + candidates[i++];
                };
                imgEl.onerror = tryNext;
              }

              // Cargar descripción desde INFO.txt
              if ($info.length) {
                const infoSrc = $info.attr('data-info-src');
                if (infoSrc) {
                  fetch(infoSrc).then(r => {
                    if (!r.ok) throw new Error('no ok');
                    return r.text();
                  }).then(t => {
                    $info.html(t.replace(/\n/g,'<br>'));
                  }).catch(() => {
                    $info.text('Información disponible en el detalle.');
                  });
                }
              }
            });
        })();

    }); // End Document Ready

    // Window Resize Handler
    $(window).on('resize', function() {
        // Reinitialize AOS on resize
        AOS.refresh();
    });

    // Prevent FOUC (Flash of Unstyled Content)
    $(window).on('load', function() {
        $('body').addClass('loaded');
    });

})(jQuery);

// Chatbot logic
(function(){
  function ensureChatbotMarkup(){
    let root = document.getElementById('chatbot');
    if(root) return root;
    root = document.createElement('div');
    root.id = 'chatbot';
    root.className = 'chatbot';
    root.setAttribute('aria-live','polite');
    root.setAttribute('aria-label','Asistente virtual');
    root.innerHTML = `
      <button id="chatToggle" aria-label="Abrir chat" class="chat-toggle"><span class="chat-toggle-icon">💬</span></button>
      <div class="chat-panel" aria-hidden="true">
        <div class="chat-header">
          <div class="chat-title">Chat Inmobiliaria</div>
          <button id="chatClose" aria-label="Cerrar" class="chat-close">×</button>
        </div>
        <div id="chatBody" class="chat-body"></div>
        <div class="chat-quick">
          <button class="quick-btn" data-action="viviendas">Viviendas</button>
          <button class="quick-btn" data-action="locales">Locales</button>
          <button class="quick-btn" data-action="venta">Venta</button>
          <button class="quick-btn" data-action="arrendadas">Arriendo</button>
          <button class="quick-btn" data-action="contacto">Contacto</button>
        </div>
        <div class="chat-input">
          <input id="chatInput" type="text" placeholder="Escribe tu consulta..." />
          <button id="chatSend" class="chat-send">Enviar</button>
        </div>
      </div>`;
    document.body.appendChild(root);
    return root;
  }

  let chatbot = document.getElementById('chatbot');
  if(!chatbot){
    chatbot = ensureChatbotMarkup();
  }
  const panel = chatbot.querySelector('.chat-panel');
  const toggle = document.getElementById('chatToggle') || chatbot.querySelector('.chat-toggle') || chatbot.querySelector('button');
  const closeBtn = document.getElementById('chatClose') || chatbot.querySelector('.chat-close');
  const body = document.getElementById('chatBody') || chatbot.querySelector('.chat-body');
  const input = document.getElementById('chatInput') || chatbot.querySelector('.chat-input input');
  const send = document.getElementById('chatSend') || chatbot.querySelector('.chat-send');

  if(!panel || !toggle || !closeBtn || !body || !input || !send){
    console.warn('Chatbot: faltan elementos para inicializar.');
    return;
  }

  let contentIndex = null;
  let indexLoaded = false;
  
  async function ensureIndex(){
    if(indexLoaded) return;
    
    console.log('🔍 Iniciando carga del índice...');
    console.log('📍 Protocolo:', window.location.protocol);
    console.log('📍 URL actual:', window.location.href);
    
    // Determinar la ruta base correcta según el protocolo
    let paths = [];
    
    if(window.location.protocol === 'file:'){
      // Archivo local - usar rutas relativas
      const currentPath = window.location.pathname;
      const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
      paths = [
        basePath + 'assets/data/content-index.json',
        'assets/data/content-index.json',
        './assets/data/content-index.json'
      ];
      console.log('⚠️ Detectado protocolo file:// - usando rutas relativas');
    } else {
      // Servidor HTTP - usar rutas normales
      const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
      paths = [
        baseUrl + 'assets/data/content-index.json',
        'assets/data/content-index.json',
        './assets/data/content-index.json',
        '/assets/data/content-index.json'
      ];
      console.log('✅ Detectado servidor HTTP');
    }
    
    for(const path of paths){
      try{
        console.log('⏳ Intentando:', path);
        const res = await fetch(path, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          },
          cache: 'no-cache'
        });
        
        if(!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const text = await res.text();
        contentIndex = JSON.parse(text);
        indexLoaded = true;
        
        console.log('✅ ¡ÉXITO! Índice cargado desde:', path);
        console.log('📊 Total propiedades:', contentIndex.totalItems);
        console.log('📁 Locales:', contentIndex.categories.locales);
        console.log('📁 Viviendas:', contentIndex.categories.viviendas);
        console.log('📝 Primera propiedad:', contentIndex.items[0].title);
        
        return; // Éxito
      }catch(e){
        console.warn(`❌ Falló ${path}:`, e.message);
      }
    }
    
    // Si llegamos aquí, ninguna ruta funcionó
    indexLoaded = true;
    console.error('💥 ERROR CRÍTICO: No se pudo cargar el índice desde ninguna ruta');
    console.error('🔧 SOLUCIÓN: Abre el sitio con un servidor HTTP');
    console.error('🔧 Ejecuta: python -m http.server 8000');
    console.error('🔧 Luego abre: http://localhost:8000/index.html');
  }

  function open(){ panel.style.display = 'flex'; panel.setAttribute('aria-hidden','false'); }
  function close(){ panel.style.display = 'none'; panel.setAttribute('aria-hidden','true'); }
  // Exponer apertura para usarla desde index.html
  window.openChatbot = open;
  // Estado de la conversación
  let conversationState = {
    step: null,
    category: null,
    priceRange: null,
    status: null
  };

  function resetConversation(){
    conversationState = {
      step: null,
      category: null,
      priceRange: null,
      status: null
    };
  }

  function appendMessage(text, who, opts){
    const el = document.createElement('div');
    el.className = `chat-message ${who}`;
    if(opts && opts.html) el.innerHTML = text; else el.textContent = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  // Función para mostrar mensajes con delay (efecto de escritura)
  async function appendMessageWithDelay(text, who, opts, delay = 800){
    return new Promise(resolve => {
      setTimeout(() => {
        appendMessage(text, who, opts);
        resolve();
      }, delay);
    });
  }

  function getStatus(item){
    if(item.status) return item.status;
    return item.category === 'locales' ? 'arriendo' : 'venta';
  }

  function scoreItem(q, item, wantStatus){
    const t = (q||'').toLowerCase();
    let s = 0;
    if(item.title && item.title.toLowerCase().includes(t)) s += 2;
    if(Array.isArray(item.keywords)) item.keywords.forEach(k=>{ if((k||'').toLowerCase().includes(t)) s += 1; });
    if(t.includes('casa') || t.includes('vivienda')) if(item.category==='viviendas') s += 2;
    if(t.includes('local')) if(item.category==='locales') s += 2;
    if(wantStatus && getStatus(item) === wantStatus) s += 3;
    return s;
  }

  function searchItems(query, options={}){
    const wantStatus = options.status || null;
    const wantCategory = options.category || null;
    
    // Validar que el índice esté cargado
    if(!contentIndex){
      console.error('❌ searchItems: contentIndex es null');
      return [];
    }
    if(!contentIndex.items){
      console.error('❌ searchItems: contentIndex.items no existe');
      return [];
    }
    if(!Array.isArray(contentIndex.items)){
      console.error('❌ searchItems: contentIndex.items no es un array');
      return [];
    }
    if(contentIndex.items.length === 0){
      console.warn('⚠️ searchItems: contentIndex.items está vacío');
      return [];
    }
    
    console.log('🔍 Buscando:', query || '(todas)', 'Categoría:', wantCategory || 'todas', 'Estado:', wantStatus || 'todos');
    
    // Si no hay query, devolver todas las propiedades filtradas por status y/o categoría
    if(!query || query.trim() === ''){
      let items = contentIndex.items;
      console.log('📊 Total items antes de filtrar:', items.length);
      
      if(wantStatus){
        items = items.filter(it => getStatus(it) === wantStatus);
        console.log('📊 Después de filtrar por status:', items.length);
      }
      if(wantCategory){
        items = items.filter(it => it.category === wantCategory);
        console.log('📊 Después de filtrar por categoría:', items.length);
      }
      
      const result = items.slice(0, 10);
      console.log('✅ Retornando:', result.length, 'items');
      return result;
    }
    
    const items = contentIndex.items
      .map(it=>({it, s: scoreItem(query, it, wantStatus)}))
      .filter(x=>{
        if(x.s <= 0) return false;
        if(wantStatus && getStatus(x.it) !== wantStatus) return false;
        if(wantCategory && x.it.category !== wantCategory) return false;
        return true;
      })
      .sort((a,b)=>b.s-a.s)
      .slice(0,10)
      .map(x=>x.it);
    
    console.log('✅ Retornando:', items.length, 'items con búsqueda');
    return items;
  }

  function renderResults(items){
    if(!items.length) return '<div class="chat-message bot">No encontré coincidencias. Prueba otra palabra clave o indica si buscas <strong>Viviendas</strong> o <strong>Locales</strong>.</div>';
    const cards = items.map(it=>{
      const st = getStatus(it);
      const kind = it.category === 'locales' ? 'local' : 'vivienda';
      const pill = `<span style=\"display:inline-block;margin-left:4px;padding:2px 8px;border-radius:999px;font-size:11px;background:${st==='venta'?'#dcfce7':'#fee2e2'};color:${st==='venta'?'#166534':'#991b1b'};border:1px solid ${st==='venta'?'#bbf7d0':'#fecaca'}\">${st==='venta'?'En venta':'Arriendo'}</span>`;
      
      // Formatear precio
      const priceText = it.price ? `<div style=\"font-size:14px;color:#059669;font-weight:600;margin-top:4px\">💰 $${it.price.toLocaleString('es-CO')}</div>` : '';
      
      // Información de la propiedad (primeras 150 caracteres)
      const infoPreview = it.info ? `<div style=\"font-size:13px;color:#4b5563;margin-top:6px;line-height:1.4\">${it.info.substring(0, 200)}${it.info.length > 200 ? '...' : ''}</div>` : '';
      
      return `
        <div class=\"result-card\" style=\"padding:10px 12px;margin:8px 0;border-radius:10px;background:#ffffff;border:1px solid #e0e7ff;box-shadow:0 2px 4px rgba(0,0,0,0.05)\">
          <div style=\"color:#1e40af;font-weight:600;font-size:15px\">${it.title}${pill}</div>
          ${priceText}
          ${infoPreview}
          <div style=\"display:flex;gap:8px;margin-top:10px;flex-wrap:wrap\">
            <a href=\"${it.path}\" target=\"_self\" class=\"result-link\" style=\"display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:6px;background:#3b82f6;color:#fff;text-decoration:none;font-size:13px;font-weight:500\">📄 Ver detalle completo</a>
            <button class=\"wa-item\" data-path=\"${it.path}\" data-title=\"${it.title.replace(/\"/g,'&quot;')}\" data-category=\"${it.category}\" data-price=\"${it.price || ''}\" data-info=\"${(it.info || '').replace(/\"/g, '&quot;').substring(0, 100)}\" style=\"display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:6px;background:#25D366;color:#fff;border:none;cursor:pointer;font-size:13px;font-weight:500\">💬 Consultar por WhatsApp</button>
          </div>
        </div>
      `;
    }).join('');
    return `<div style=\"max-width:100%\">${cards}</div>`;
  }

  function buildAbsUrl(path){
    try {
      // El path ya viene limpio desde el script, solo agregar la URL base
      const baseUrl = window.location.origin;
      return baseUrl + '/' + path;
    } catch(e) {
      console.error('Error construyendo la URL absoluta:', e);
      // Como fallback, intentar construir una URL relativa simple
      return new URL(path, window.location.href).href;
    }
  }

  function buildWhatsAppText(title, category, path, info, price){
    const kind = category === 'locales' ? 'local comercial' : 'vivienda';
    const url = buildAbsUrl(path);
    
    // Extraer información clave del info
    let priceText = '';
    if(price && typeof price === 'number'){
      priceText = `\n💰 Precio: $${price.toLocaleString('es-CO')}`;
    }
    
    // Construir mensaje profesional
    const message = `¡Hola! 👋

Me interesa esta propiedad que vi en su página web:

🏠 *${title}*
📍 Tipo: ${kind.charAt(0).toUpperCase() + kind.slice(1)}${priceText}

🔗 Ver detalles completos:
${url}

¿Podrían darme más información sobre disponibilidad y condiciones de arriendo?

¡Gracias!`;
    
    return message;
  }

  // Delegación: botón WhatsApp por propiedad
  (document.body || document.querySelector('body')).addEventListener('click', async (e)=>{
    const btn = e.target.closest('.wa-item');
    if(!btn) return;
    
    const {title, category, path, info, price} = btn.dataset;
    const priceNum = price ? parseInt(price, 10) : null;
    const text = buildWhatsAppText(title, category, path, info, priceNum);
    
    // Intentar copiar al portapapeles
    try {
      await navigator.clipboard.writeText(text);
      await appendMessageWithDelay('✅ ¡Perfecto! Copié el mensaje al portapapeles.', 'bot', null, 400);
      await appendMessageWithDelay('📱 Abriendo WhatsApp... Solo pega el mensaje (Ctrl+V) y envía.', 'bot', null, 600);
    } catch(err){
      // Si falla, mostrar el mensaje para copiar manualmente
      await appendMessageWithDelay('📋 Copia este mensaje y envíalo por WhatsApp:', 'bot', null, 400);
      await appendMessageWithDelay(text, 'bot', null, 600);
    }
    
    // Abrir WhatsApp con el número de la inmobiliaria
    const phoneNumber = '573015717622'; // Formato internacional sin +
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    
    // Abrir en nueva pestaña
    window.open(whatsappUrl, '_blank');
  });

  function replyContact(){
    const wa = 'https://wa.me/qr/6WQZ2EFOAR46O1';
    return `
      <div style="display:flex;flex-direction:column;gap:8px">
        <div>Escríbenos por WhatsApp y te asesoramos de inmediato.</div>
        <a href="${wa}" target="_blank" style="display:inline-flex;align-items:center;gap:8px;background:#25D366;color:#fff;padding:8px 12px;border-radius:8px;text-decoration:none">Abrir WhatsApp</a>
      </div>
    `;
  }

  function replyInfo(){
    return `📍 Inmobiliaria Integrales Cereté
📞 Teléfonos: 3015717622 - 3007256161
📧 Email: info@integarlescerete.com
🕐 Horario: Lun - Vie: 8:00 AM - 6:00 PM
📍 Ubicación: Cereté, Córdoba, Colombia

Ofrecemos servicios de compra, venta, arriendo y asesoría inmobiliaria y jurídica.`;
  }

  // Parseador de rangos de precio: "500k-800k", "desde 500k", "hasta 1.2M", "800000", "$500.000", "500 mil"
  function parsePriceRange(text){
    if(!text) return null;
    const t = text.toLowerCase().replace(/\$/g, ''); // Remover símbolo $
    
    const normalize = (s)=>{
      if(!s) return null;
      s = s.replace(/\s/g, '').replace(/\$/g, '');
      
      // Manejar "mil", "millones", "millon"
      if(/mil(es|lones|lon)?/.test(s)){
        const numMatch = s.match(/([0-9]+(?:[\.,][0-9]+)?)/);
        if(numMatch){
          let num = parseFloat(numMatch[1].replace(',','.'));
          if(/millon(es)?/.test(s)) num = num * 1000000;
          else if(/mil/.test(s)) num = num * 1000;
          return Math.round(num);
        }
      }
      
      // Manejar formato con puntos como separadores de miles: 500.000
      const dotCount = (s.match(/\./g) || []).length;
      if(dotCount >= 1 && !s.includes(',')){
        // Es formato colombiano: 500.000 o 1.500.000
        s = s.replace(/\./g, '');
      }
      
      // Manejar k (miles) y m (millones)
      const m = s.match(/([0-9]+(?:[\.,][0-9]+)?)(m|k)?/i);
      if(!m) return null;
      let num = parseFloat(m[1].replace(',','.'));
      const unit = (m[2]||'').toLowerCase();
      if(unit==='m') num = num * 1000000;
      else if(unit==='k') num = num * 1000;
      return Math.round(num);
    };
    
    // Rangos: A-B, A a B
    let mm = t.match(/(\d[\d\.\,]*\s*(?:k|m|mil|millon(?:es)?)?)\s*[-–a]\s*(\d[\d\.\,]*\s*(?:k|m|mil|millon(?:es)?)?)/);
    if(mm){ return { min: normalize(mm[1]), max: normalize(mm[2]) }; }
    
    // desde X
    mm = t.match(/desde\s*(\d[\d\.\,]*\s*(?:k|m|mil|millon(?:es)?)?)/);
    if(mm){ return { min: normalize(mm[1]), max: null }; }
    
    // hasta Y, máximo Y
    mm = t.match(/(?:hasta|m[aá]ximo?)\s*(\d[\d\.\,]*\s*(?:k|m|mil|millon(?:es)?)?)/);
    if(mm){ return { min: null, max: normalize(mm[1]) }; }
    
    // más de X, mayor a X
    mm = t.match(/(?:m[aá]s\s*de|mayor\s*(?:a|que))\s*(\d[\d\.\,]*\s*(?:k|m|mil|millon(?:es)?)?)/);
    if(mm){ return { min: normalize(mm[1]), max: null }; }
    
    // menos de X, menor a X
    mm = t.match(/(?:menos\s*de|menor\s*(?:a|que))\s*(\d[\d\.\,]*\s*(?:k|m|mil|millon(?:es)?)?)/);
    if(mm){ return { min: null, max: normalize(mm[1]) }; }
    
    // entre X y Y
    mm = t.match(/entre\s*(\d[\d\.\,]*\s*(?:k|m|mil|millon(?:es)?)?)\s*y\s*(\d[\d\.\,]*\s*(?:k|m|mil|millon(?:es)?)?)/);
    if(mm){ return { min: normalize(mm[1]), max: normalize(mm[2]) }; }
    
    // único número (buscar exacto o rango cercano ±10%)
    mm = t.match(/(\d[\d\.\,]*\s*(?:k|m|mil|millon(?:es)?)?)/);
    if(mm){ 
      const v = normalize(mm[1]); 
      // Rango de ±15% para búsquedas de precio único
      const margin = Math.round(v * 0.15);
      return { min: v - margin, max: v + margin }; 
    }
    
    return null;
  }

  function filterByPrice(items, range){
    if(!range || !Array.isArray(items)) return items || [];
    const {min, max} = range;
    const hasPrice = items.some(it=>typeof it.price === 'number');
    if(!hasPrice) return [];
    return items.filter(it=>{
      const p = it.price;
      if(typeof p !== 'number') return false;
      if(min!=null && max!=null) return p>=min && p<=max;
      if(min!=null) return p>=min;
      if(max!=null) return p<=max;
      return true;
    });
  }

  async function handleUserInput(userText){
     const t = (userText||'').toLowerCase();
     await ensureIndex();

     console.log('💬 Input del usuario:', userText);
     console.log('📊 Estado conversación:', conversationState);

     // Comandos especiales que reinician la conversación
     if(/^(inicio|empezar|comenzar|nuevo|reiniciar)$/i.test(t)){
       resetConversation();
       await appendMessageWithDelay('¡Perfecto! Empecemos de nuevo. 😊', 'bot', null, 500);
       await appendMessageWithDelay('¿Qué tipo de propiedad buscas? Escribe:<br>• <strong>Vivienda</strong><br>• <strong>Local comercial</strong><br>• <strong>Asesoría</strong>', 'bot', {html:true}, 800);
       return;
     }

     // Contacto directo
     if(/contact(o|a)|whats|telefono|teléfono/.test(t)){
       await appendMessageWithDelay('¡Claro! Aquí está nuestra información de contacto:', 'bot', null, 500);
       await appendMessageWithDelay(replyContact(), 'bot', {html:true}, 600);
       return;
     }

     // Información general
     if(/(info|informaci[oó]n)/.test(t)){
       await appendMessageWithDelay(replyInfo(), 'bot', {html:false}, 500);
       return;
     }

     // === FLUJO CONVERSACIONAL ===
     
     // PASO 1: Usuario selecciona tipo de propiedad
     if(!conversationState.step || conversationState.step === null){
       if(/(vivienda|casa|apartamento)/i.test(t)){
         conversationState.step = 'ask_status';
         conversationState.category = 'viviendas';
         await appendMessageWithDelay('¡Excelente! Tenemos varias viviendas disponibles. 🏠', 'bot', null, 600);
         await appendMessageWithDelay('¿La vivienda es para <strong>arriendo</strong> o <strong>venta</strong>?', 'bot', {html:true}, 1000);
         return;
       }
       if(/(local|comercial)/i.test(t)){
         conversationState.step = 'ask_status';
         conversationState.category = 'locales';
         await appendMessageWithDelay('¡Perfecto! Tenemos locales comerciales disponibles. 🏪', 'bot', null, 600);
         await appendMessageWithDelay('¿El local es para <strong>arriendo</strong> o <strong>venta</strong>?', 'bot', {html:true}, 1000);
         return;
       }
       if(/rural/i.test(t)){
         conversationState.step = 'ask_price';
         conversationState.category = 'viviendas';
         conversationState.status = 'arriendo';
         await appendMessageWithDelay('¡Genial! Viviendas rurales. 🌾', 'bot', null, 600);
         await appendMessageWithDelay(`¿Cuál es tu presupuesto? 💰<br><br>
           <strong>Nuestras viviendas van desde $300.000 hasta $10.000.000</strong><br><br>
           Ejemplos de búsqueda:<br>
           • "300k-700k" (Económicas)<br>
           • "700k-1M" (Rango medio)<br>
           • "desde 1M" (Premium)<br>
           • "$500.000 - $800.000"`, 'bot', {html:true}, 1000);
         return;
       }
       if(/asesor[ií]a|jur[ií]dica/.test(t)){
         await appendMessageWithDelay('Ofrecemos asesoría inmobiliaria y jurídica completa. 📋', 'bot', null, 600);
         await appendMessageWithDelay(replyContact(), 'bot', {html:true}, 800);
         const el = document.getElementById('servicios');
         if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
         return;
       }
       
       // No entendió, dar opciones
       await appendMessageWithDelay('No estoy seguro de entender. ¿Qué tipo de propiedad buscas?', 'bot', null, 500);
       await appendMessageWithDelay('Escribe:<br>• <strong>Vivienda</strong><br>• <strong>Local comercial</strong><br>• <strong>Asesoría</strong>', 'bot', {html:true}, 800);
       return;
     }

     // PASO 2: Usuario selecciona arriendo o venta
     if(conversationState.step === 'ask_status'){
       if(/arriendo|arrendar|alquiler|arrendadas/i.test(t)){
         conversationState.status = 'arriendo';
         conversationState.step = 'ask_price';
         
         // Rangos de precio según la categoría
         let priceExamples = '';
         if(conversationState.category === 'locales'){
           priceExamples = `¿Cuál es tu presupuesto mensual? 💰<br><br>
             <strong>Nuestros locales van desde $400.000 hasta $160.000.000</strong><br><br>
             Ejemplos de búsqueda:<br>
             • "400k-800k" (Económicos)<br>
             • "800k-1M" (Rango medio)<br>
             • "desde 1M" (Premium)<br>
             • "$500.000 - $700.000"`;
         } else {
           priceExamples = `¿Cuál es tu presupuesto mensual? 💰<br><br>
             <strong>Nuestras viviendas van desde $300.000 hasta $10.000.000</strong><br><br>
             Ejemplos de búsqueda:<br>
             • "300k-700k" (Económicas)<br>
             • "700k-1M" (Rango medio)<br>
             • "desde 1M" (Premium)<br>
             • "$500.000 - $800.000"`;
         }
         
         await appendMessageWithDelay('Perfecto, propiedades en arriendo. 📝', 'bot', null, 600);
         await appendMessageWithDelay(priceExamples, 'bot', {html:true}, 1000);
         return;
       }
       if(/venta|comprar|en venta/i.test(t)){
         conversationState.status = 'venta';
         conversationState.step = 'ask_price';
         await appendMessageWithDelay('Entendido, propiedades en venta. 💰', 'bot', null, 600);
         await appendMessageWithDelay('Actualmente tenemos más propiedades en arriendo. Para opciones en venta, te conectamos con un asesor:', 'bot', null, 800);
         await appendMessageWithDelay(replyContact(), 'bot', {html:true}, 600);
         resetConversation();
         return;
       }
       
       // No entendió
       await appendMessageWithDelay('Por favor, indica si es para <strong>arriendo</strong> o <strong>venta</strong>.', 'bot', {html:true}, 500);
       return;
     }

     // PASO 3: Usuario indica presupuesto
     if(conversationState.step === 'ask_price'){
       const priceRange = parsePriceRange(t);
       
       if(priceRange){
         conversationState.priceRange = priceRange;
         conversationState.step = 'show_results';
         
         await appendMessageWithDelay('¡Excelente! Déjame buscar las mejores opciones para ti... 🔍', 'bot', null, 800);
         
         // Buscar propiedades
         const allItems = contentIndex && contentIndex.items ? contentIndex.items : [];
         let filtered = allItems.filter(it => {
           if(conversationState.category && it.category !== conversationState.category) return false;
           if(conversationState.status && getStatus(it) !== conversationState.status) return false;
           return true;
         });
         
         const byPrice = filterByPrice(filtered, priceRange);
         
         if(byPrice.length){
           const formatPrice = (p) => p ? `$${p.toLocaleString('es-CO')}` : '';
           let priceMsg = '✨ <strong>Encontré ' + byPrice.length + ' propiedad' + (byPrice.length > 1 ? 'es' : '') + '</strong> ';
           if(priceRange.min && priceRange.max){
             priceMsg += `entre ${formatPrice(priceRange.min)} y ${formatPrice(priceRange.max)}`;
           } else if(priceRange.min){
             priceMsg += `desde ${formatPrice(priceRange.min)}`;
           } else if(priceRange.max){
             priceMsg += `hasta ${formatPrice(priceRange.max)}`;
           }
           priceMsg += ':';
           
           await appendMessageWithDelay(priceMsg, 'bot', {html:true}, 1200);
           
           // Mostrar resultados de 3 en 3 con delay
           const resultsPerBatch = 3;
           for(let i = 0; i < byPrice.length; i += resultsPerBatch){
             const batch = byPrice.slice(i, i + resultsPerBatch);
             await appendMessageWithDelay(renderResults(batch), 'bot', {html:true}, 1500);
           }
           
           await appendMessageWithDelay('¿Te gustaría ver más opciones o cambiar los filtros? Escribe "nuevo" para empezar de nuevo. 😊', 'bot', null, 1000);
         } else {
           await appendMessageWithDelay('Lo siento, no encontré propiedades con ese presupuesto. 😔', 'bot', null, 1000);
           await appendMessageWithDelay('Te conecto con un asesor por WhatsApp para buscar más opciones:', 'bot', null, 800);
           await appendMessageWithDelay(replyContact(), 'bot', {html:true}, 600);
         }
         
         resetConversation();
         return;
       }
       
       // No entendió el precio
       await appendMessageWithDelay('No entendí el presupuesto. Por favor, escribe un rango de precio.', 'bot', null, 500);
       await appendMessageWithDelay('Ejemplos:<br>• "500k-800k"<br>• "desde 600 mil"<br>• "$500.000 - $800.000"', 'bot', {html:true}, 800);
       return;
     }

     // Búsqueda general (sin conversación activa)
     const items = searchItems(t);
     if(items.length){
       await appendMessageWithDelay('Encontré estas propiedades:', 'bot', null, 600);
       await appendMessageWithDelay(renderResults(items), 'bot', {html:true}, 1000);
     } else {
       await appendMessageWithDelay('No encontré resultados. Intenta con:<br>• Tipo de propiedad (vivienda, local)<br>• Barrio (santa clara, el prado)<br>• Precio (500k-800k)', 'bot', {html:true}, 500);
     }
   }

  toggle.addEventListener('click', ()=>{
    const visible = panel.style.display === 'flex';
    visible ? close() : open();
  });
  closeBtn.addEventListener('click', close);

  // Permitir abrir el chat al hacer clic en la imagen del hero
  document.querySelectorAll('.hero-slide img').forEach(el=>{
    el.style.cursor = el.style.cursor || 'pointer';
    el.addEventListener('click', (e)=>{
      open();
      e.stopPropagation();
    });
  });

  send.addEventListener('click', ()=>{
    const text = (input.value || '').trim();
    if(!text) return;
    appendMessage(text, 'user');
    input.value = '';
    setTimeout(()=> handleUserInput(text), 300);
  });

  input.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){ send.click(); }
  });

  chatbot.querySelectorAll('.quick-btn').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const action = btn.dataset.action;
      let prompt = '';
      switch(action){
        case 'viviendas': prompt = 'Mostrar viviendas'; break;
        case 'rural': prompt = 'Vivienda rural'; break;
        case 'locales': prompt = 'Mostrar locales'; break;
        case 'venta': prompt = 'Propiedades en venta'; break;
        case 'arrendadas': prompt = 'Propiedades en arriendo'; break;
        case 'asesoria': prompt = 'Asesoría inmobiliaria'; break;
        case 'whatsapp': prompt = 'Contacto por WhatsApp'; break;
        case 'contacto': prompt = 'Información de contacto'; break;
      }
      appendMessage(prompt, 'user');
      await handleUserInput(prompt);

      const map = { viviendas: 'vivienda', rurales: 'rural', locales: 'locales', venta: 'venta', arrendadas: 'arriendo', rural: 'rural' };
      const target = map[action];
      if(target){
        const btnFilter = document.querySelector(`.featured-filters [data-filter="${target}"]`);
        if(btnFilter){ btnFilter.click(); }
      }
      if(action === 'asesoria'){
        const el = document.getElementById('servicios');
        if(el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if(action === 'whatsapp'){
        const link = 'https://wa.me/qr/6WQZ2EFOAR46O1';
        window.open(link, '_blank');
      }
    });
  });

  // Mostrar mensaje de bienvenida al cargar
  async function showWelcomeMessage(){
    console.log('👋 Mostrando mensaje de bienvenida...');
    await ensureIndex();
    
    // Verificar si el índice se cargó correctamente
    if(!contentIndex || !contentIndex.items || contentIndex.items.length === 0){
      console.error('❌ No se pudo cargar el índice en showWelcomeMessage');
      appendMessage('⚠️ Estoy teniendo problemas para cargar las propiedades. Por favor, recarga la página o contáctanos directamente.', 'bot');
      appendMessage(replyContact(), 'bot', {html:true});
      return;
    }
    
    console.log('✅ Índice verificado, mostrando bienvenida');
    
    // Mensaje de bienvenida conversacional
    await appendMessageWithDelay('¡Hola! 👋 Bienvenido a <strong>Inmobiliaria Integrales Cereté</strong>', 'bot', {html:true}, 500);
    await appendMessageWithDelay(`Tenemos <strong>${contentIndex.totalItems} propiedades</strong> disponibles para ti:<br>• 🏠 ${contentIndex.categories.viviendas} Viviendas<br>• 🏪 ${contentIndex.categories.locales} Locales comerciales`, 'bot', {html:true}, 1000);
    await appendMessageWithDelay('¿Qué tipo de propiedad buscas hoy?<br><br>Escribe:<br>• <strong>Vivienda</strong><br>• <strong>Local comercial</strong><br>• <strong>Asesoría</strong>', 'bot', {html:true}, 1200);
  }

  // Inicializar con mensaje de bienvenida si el chat body está vacío
  if(body.children.length === 0){
    console.log('🚀 Inicializando chatbot...');
    showWelcomeMessage();
  }
})();