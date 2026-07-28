/* =========================================================
   SCRIPT.JS — Sebastián Loitegui | Portafolio
   Funcionalidades:
   1. Menú hamburguesa (mobile)
   2. Modo oscuro / claro
   3. Animaciones al hacer scroll (reveal)
   4. Contador animado en stats
   5. Validación del formulario de contacto
   6. Botón "volver arriba"
   7. Carrusel de certificaciones
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* =========================================================
       1. MENÚ HAMBURGUESA (MOBILE)
       ========================================================= */

    const menuBtn = document.getElementById('menuHamburguesa');
    const navMenu = document.getElementById('navPrincipal');
    const overlay = document.getElementById('overlayMenu');
    const navLinks = navMenu ? navMenu.querySelectorAll('a') : [];

    function toggleMenu(isOpen = undefined) {
        const shouldOpen = typeof isOpen === 'boolean' ? isOpen : !navMenu.classList.contains('activo');

        navMenu?.classList.toggle('activo', shouldOpen);
        overlay?.classList.toggle('activo', shouldOpen);
        menuBtn?.classList.toggle('activo', shouldOpen);
        menuBtn?.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
        body.style.overflow = shouldOpen ? 'hidden' : '';
    }

    menuBtn?.addEventListener('click', () => toggleMenu());
    overlay?.addEventListener('click', () => toggleMenu(false));
    navLinks.forEach((link) => link.addEventListener('click', () => toggleMenu(false)));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu?.classList.contains('activo')) {
            toggleMenu(false);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            toggleMenu(false);
        }
    });

    /* =========================================================
       2. MODO OSCURO / CLARO
       ========================================================= */

    const modoBtn = document.getElementById('modoOscuroBtn');
    const modoIcono = modoBtn?.querySelector('i');

    function aplicarModo(isDark) {
        body.classList.toggle('modo-oscuro', isDark);

        if (modoIcono) {
            modoIcono.classList.toggle('fa-moon', !isDark);
            modoIcono.classList.toggle('fa-sun', isDark);
        }
    }

    function aplicarModoGuardado() {
        const modoGuardado = sessionStorage.getItem('modo');
        if (modoGuardado === 'oscuro') {
            aplicarModo(true);
        }
    }

    modoBtn?.addEventListener('click', () => {
        const esOscuro = !body.classList.contains('modo-oscuro');
        aplicarModo(esOscuro);
        sessionStorage.setItem('modo', esOscuro ? 'oscuro' : 'claro');
    });

    aplicarModoGuardado();

    /* =========================================================
       3. ANIMACIONES AL HACER SCROLL (REVEAL)
       ========================================================= */

    const elementosReveal = document.querySelectorAll('section, .experiencia-card, .card, .item, .certificado');

    elementosReveal.forEach((elemento) => elemento.classList.add('reveal'));

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        elementosReveal.forEach((elemento) => elemento.classList.add('reveal-visible'));
    } else {
        const observerReveal = new IntersectionObserver((entradas) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('reveal-visible');
                    observerReveal.unobserve(entrada.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        elementosReveal.forEach((elemento) => observerReveal.observe(elemento));
    }

    /* =========================================================
       4. CONTADOR ANIMADO EN STATS
       ========================================================= */

    const statsContainer = document.getElementById('statsContainer');
    const numeros = document.querySelectorAll('.stats h3[data-target]');
    let contadorYaAnimado = false;

    function animarContador(elemento) {
        const target = Number(elemento.dataset.target) || 0;
        const duracion = 1500;
        const inicio = performance.now();

        function paso(ahora) {
            const progreso = Math.min((ahora - inicio) / duracion, 1);
            const valor = Math.floor(target * (1 - Math.pow(1 - progreso, 3)));
            elemento.textContent = valor;

            if (progreso < 1) {
                requestAnimationFrame(paso);
            } else {
                elemento.textContent = target;
            }
        }

        requestAnimationFrame(paso);
    }

    if (statsContainer && numeros.length) {
        const observerStats = new IntersectionObserver((entradas, observer) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting && !contadorYaAnimado) {
                    contadorYaAnimado = true;
                    numeros.forEach(animarContador);
                    observer.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.4 });

        observerStats.observe(statsContainer);
    }

    /* =========================================================
       5. VALIDACIÓN DEL FORMULARIO DE CONTACTO
       ========================================================= */

    const formulario = document.getElementById('formularioContacto');
    const campoNombre = document.getElementById('nombre');
    const campoEmail = document.getElementById('email');
    const campoMensaje = document.getElementById('mensaje');
    const errorNombre = document.getElementById('errorNombre');
    const errorEmail = document.getElementById('errorEmail');
    const errorMensaje = document.getElementById('errorMensaje');
    const formStatus = document.getElementById('formStatus');

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function mostrarError(input, spanError, mensaje) {
        input.classList.add('input-error');
        spanError.textContent = mensaje;
        input.setAttribute('aria-invalid', 'true');
    }

    function limpiarError(input, spanError) {
        input.classList.remove('input-error');
        spanError.textContent = '';
        input.setAttribute('aria-invalid', 'false');
    }

    function validarNombre() {
        const valor = campoNombre.value.trim();
        if (valor.length < 3) {
            mostrarError(campoNombre, errorNombre, 'Ingresá al menos 3 caracteres.');
            return false;
        }
        limpiarError(campoNombre, errorNombre);
        return true;
    }

    function validarEmail() {
        const valor = campoEmail.value.trim();
        if (!regexEmail.test(valor)) {
            mostrarError(campoEmail, errorEmail, 'Ingresá un email válido.');
            return false;
        }
        limpiarError(campoEmail, errorEmail);
        return true;
    }

    function validarMensaje() {
        const valor = campoMensaje.value.trim();
        if (valor.length < 10) {
            mostrarError(campoMensaje, errorMensaje, 'El mensaje debe tener al menos 10 caracteres.');
            return false;
        }
        limpiarError(campoMensaje, errorMensaje);
        return true;
    }

    function actualizarEstadoFormulario(mensaje, tipo) {
        formStatus.textContent = mensaje;
        formStatus.className = `form-status ${tipo}`.trim();
    }

    campoNombre?.addEventListener('blur', validarNombre);
    campoEmail?.addEventListener('blur', validarEmail);
    campoMensaje?.addEventListener('blur', validarMensaje);

    formulario?.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const nombreOk = validarNombre();
        const emailOk = validarEmail();
        const mensajeOk = validarMensaje();

        if (nombreOk && emailOk && mensajeOk) {
            actualizarEstadoFormulario('¡Gracias! Tu mensaje fue enviado correctamente.', 'form-status-exito');
            formulario.reset();

            window.setTimeout(() => {
                actualizarEstadoFormulario('', '');
            }, 5000);
        } else {
            actualizarEstadoFormulario('Revisá los campos marcados antes de enviar.', 'form-status-error');
        }
    });

    /* =========================================================
       6. BOTÓN "VOLVER ARRIBA"
       ========================================================= */

    const btnVolverArriba = document.getElementById('btnVolverArriba');
    let ticking = false;

    function actualizarBotonVolverArriba() {
        if (!btnVolverArriba) return;

        btnVolverArriba.classList.toggle('visible', window.scrollY > 400);
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                actualizarBotonVolverArriba();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    btnVolverArriba?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    actualizarBotonVolverArriba();

    /* =========================================================
       7. CAROUSEL DE CERTIFICACIONES
       ========================================================= */

    const track = document.getElementById('carouselTrack');

    if (track) {
        const dots = document.querySelectorAll('.carousel-dot');
        const btnPrev = document.getElementById('btnPrev');
        const btnNext = document.getElementById('btnNext');
        const total = dots.length;
        let current = 0;

        function goTo(index) {
            current = (index + total) % total;
            track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((dot, indexDot) => {
                const isActive = indexDot === current;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });
        }

        btnPrev?.addEventListener('click', () => {
            goTo(current - 1);
        });

        btnNext?.addEventListener('click', () => {
            goTo(current + 1);
        });

        dots.forEach((dot) => dot.addEventListener('click', () => {
            goTo(Number(dot.dataset.index));
        }));

        goTo(0);
    }
});