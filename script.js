/* =========================================================
   SCRIPT.JS — Sebastián Loitegui | Portafolio
   Funcionalidades:
   1. Menú hamburguesa (mobile)
   2. Modo oscuro / claro
   3. Animaciones al hacer scroll (reveal)
   4. Contador animado en stats
   5. Validación del formulario de contacto
   6. Botón "volver arriba"
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       1. MENÚ HAMBURGUESA (MOBILE)
       ========================================================= */

    const menuBtn   = document.getElementById('menuHamburguesa');
    const navMenu   = document.getElementById('navPrincipal');
    const overlay   = document.getElementById('overlayMenu');
    const navLinks  = navMenu.querySelectorAll('a');

    function abrirMenu() {
        navMenu.classList.add('activo');
        overlay.classList.add('activo');
        menuBtn.classList.add('activo');
        menuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function cerrarMenu() {
        navMenu.classList.remove('activo');
        overlay.classList.remove('activo');
        menuBtn.classList.remove('activo');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    menuBtn.addEventListener('click', () => {
        const estaAbierto = navMenu.classList.contains('activo');
        estaAbierto ? cerrarMenu() : abrirMenu();
    });

    overlay.addEventListener('click', cerrarMenu);

    // Cierra el menú al hacer click en un link (mobile)
    navLinks.forEach(link => link.addEventListener('click', cerrarMenu));

    // Cierra el menú si se agranda la ventana a desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) cerrarMenu();
    });


    /* =========================================================
       2. MODO OSCURO / CLARO
       ========================================================= */

    const modoBtn   = document.getElementById('modoOscuroBtn');
    const modoIcono = modoBtn.querySelector('i');

    // Revisa si el usuario ya eligió un modo en esta sesión
    function aplicarModoGuardado() {
        const modoGuardado = sessionStorage.getItem('modo');
        if (modoGuardado === 'oscuro') {
            document.body.classList.add('modo-oscuro');
            modoIcono.classList.replace('fa-moon', 'fa-sun');
        }
    }

    modoBtn.addEventListener('click', () => {
        document.body.classList.toggle('modo-oscuro');
        const esOscuro = document.body.classList.contains('modo-oscuro');

        modoIcono.classList.toggle('fa-moon', !esOscuro);
        modoIcono.classList.toggle('fa-sun', esOscuro);

        sessionStorage.setItem('modo', esOscuro ? 'oscuro' : 'claro');
    });

    aplicarModoGuardado();


    /* =========================================================
       3. ANIMACIONES AL HACER SCROLL (REVEAL)
       ========================================================= */

    // Elementos que vamos a animar al entrar en pantalla
    const elementosReveal = document.querySelectorAll(
        'section, .experiencia-card, .card, .item, .certificado'
    );

    elementosReveal.forEach(el => el.classList.add('reveal'));

    const observerReveal = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('reveal-visible');
                observerReveal.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    elementosReveal.forEach(el => observerReveal.observe(el));


    /* =========================================================
       4. CONTADOR ANIMADO EN STATS
       ========================================================= */

    const statsContainer = document.getElementById('statsContainer');
    const numeros = document.querySelectorAll('.stats h3[data-target]');
    let contadorYaAnimado = false;

    function animarContador(elemento) {
        const target = parseInt(elemento.dataset.target, 10);
        const duracion = 1500; // ms
        const inicio = performance.now();

        function paso(ahora) {
            const progreso = Math.min((ahora - inicio) / duracion, 1);
            // easing suave (ease-out)
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

    const observerStats = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting && !contadorYaAnimado) {
                contadorYaAnimado = true;
                numeros.forEach(animarContador);
                observerStats.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.4 });

    if (statsContainer) observerStats.observe(statsContainer);


    /* =========================================================
       5. VALIDACIÓN DEL FORMULARIO DE CONTACTO
       ========================================================= */

    const formulario   = document.getElementById('formularioContacto');
    const campoNombre   = document.getElementById('nombre');
    const campoEmail    = document.getElementById('email');
    const campoMensaje  = document.getElementById('mensaje');
    const errorNombre   = document.getElementById('errorNombre');
    const errorEmail    = document.getElementById('errorEmail');
    const errorMensaje  = document.getElementById('errorMensaje');
    const formStatus    = document.getElementById('formStatus');

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function mostrarError(input, spanError, mensaje) {
        input.classList.add('input-error');
        spanError.textContent = mensaje;
    }

    function limpiarError(input, spanError) {
        input.classList.remove('input-error');
        spanError.textContent = '';
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

    // Validación en tiempo real
    campoNombre.addEventListener('blur', validarNombre);
    campoEmail.addEventListener('blur', validarEmail);
    campoMensaje.addEventListener('blur', validarMensaje);

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const nombreOk  = validarNombre();
        const emailOk   = validarEmail();
        const mensajeOk = validarMensaje();

        if (nombreOk && emailOk && mensajeOk) {
            formStatus.textContent = '¡Gracias! Tu mensaje fue enviado correctamente.';
            formStatus.classList.remove('form-status-error');
            formStatus.classList.add('form-status-exito');

            // Nota: este formulario no tiene backend conectado todavía.
            // Para enviarlo de verdad, conectalo con un servicio como Formspree.
            formulario.reset();

            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.classList.remove('form-status-exito');
            }, 5000);

        } else {
            formStatus.textContent = 'Revisá los campos marcados antes de enviar.';
            formStatus.classList.remove('form-status-exito');
            formStatus.classList.add('form-status-error');
        }
    });


    /* =========================================================
       6. BOTÓN "VOLVER ARRIBA"
       ========================================================= */

    const btnVolverArriba = document.getElementById('btnVolverArriba');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btnVolverArriba.classList.add('visible');
        } else {
            btnVolverArriba.classList.remove('visible');
        }
    });

    btnVolverArriba.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

    /* =========================================================
       7. CAROUSEL DE CERTIFICACIONES
       ========================================================= */

    const track   = document.getElementById('carouselTrack');

    if (track) {
        const dots    = document.querySelectorAll('.carousel-dot');
        const btnPrev = document.getElementById('btnPrev');
        const btnNext = document.getElementById('btnNext');
        const total   = dots.length;
        let current   = 0;

        function goTo(index) {
            current = (index + total) % total;
            track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === current);
                d.setAttribute('aria-selected', i === current);
            });
        }

        btnPrev.addEventListener('click', () => goTo(current - 1));
        btnNext.addEventListener('click', () => goTo(current + 1));
        dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.index)));

        // Auto-avance cada 4 segundos
        setInterval(() => goTo(current + 1), 4000);
    }

});