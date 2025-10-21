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
        $('.search-form').on('submit', function(e) {
            e.preventDefault();
            
            const tipo = $('#tipo').val();
            const propiedad = $('#propiedad').val();
            const ubicacion = $('#ubicacion').val();
            
            console.log('Búsqueda:', {tipo, propiedad, ubicacion});
            
            // Aquí puedes implementar la lógica de búsqueda
            alert('Funcionalidad de búsqueda en desarrollo. Parámetros:\nTipo: ' + tipo + '\nPropiedad: ' + propiedad + '\nUbicación: ' + ubicacion);
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