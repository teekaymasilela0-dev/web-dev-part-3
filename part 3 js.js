

(function () {
    'use strict';

    var PRODUCTS = [
        { id: 1,  name: 'Core Logo Tee',        category: 'Tees',        price: 349,  stock: 40, tag: 'New',  sizes: 'S-XXL', desc: 'Heavyweight cotton tee with the VSO7 chest print.' },
        { id: 2,  name: 'Block Graphic Tee',    category: 'Tees',        price: 399,  stock: 22, tag: '',     sizes: 'S-XL',  desc: 'Oversized fit, front and back graphic.' },
        { id: 3,  name: 'Night Shift Hoodie',   category: 'Hoodies',     price: 899,  stock: 15, tag: 'Hot',  sizes: 'S-XXL', desc: '450gsm fleece hoodie with a double-lined hood.' },
        { id: 4,  name: 'Red Line Zip Hoodie',  category: 'Hoodies',     price: 999,  stock: 0,  tag: 'Sold out', sizes: 'M-XL', desc: 'Full zip with contrast red piping.' },
        { id: 5,  name: 'Street Cargo Pants',   category: 'Bottoms',     price: 749,  stock: 18, tag: '',     sizes: '28-38', desc: 'Relaxed cargo with six utility pockets.' },
        { id: 6,  name: 'Everyday Joggers',     category: 'Bottoms',     price: 599,  stock: 30, tag: '',     sizes: 'S-XXL', desc: 'Soft brushed-back joggers with a tapered leg.' },
        { id: 7,  name: 'Utility Bomber',       category: 'Outerwear',   price: 1499, stock: 8,  tag: 'Limited', sizes: 'M-XL', desc: 'Water-resistant bomber with a quilted lining.' },
        { id: 8,  name: 'Windbreaker 07',       category: 'Outerwear',   price: 1199, stock: 12, tag: '',     sizes: 'S-XL',  desc: 'Packable windbreaker, reflective VSO7 logo.' },
        { id: 9,  name: 'VSO7 Dad Cap',         category: 'Accessories', price: 249,  stock: 50, tag: '',     sizes: 'One size', desc: 'Six-panel cap with an embroidered logo.' },
        { id: 10, name: 'Crossbody Bag',        category: 'Accessories', price: 449,  stock: 20, tag: 'New',  sizes: 'One size', desc: 'Compact bag with a weatherproof zip.' },
        { id: 11, name: 'Ribbed Beanie',        category: 'Accessories', price: 199,  stock: 35, tag: '',     sizes: 'One size', desc: 'Stretch-knit beanie with a woven label.' },
        { id: 12, name: 'Heavy Crew Sweat',     category: 'Hoodies',     price: 799,  stock: 14, tag: '',     sizes: 'S-XXL', desc: 'Boxy crew neck sweat in washed black.' }
    ];

    var GALLERY = [
        { title: 'Winter drop campaign',    alt: 'Model wearing the VSO7 Night Shift Hoodie on a Johannesburg rooftop' },
        { title: 'Streetwear lookbook',     alt: 'Two models in VSO7 cargo pants and graphic tees' },
        { title: 'Studio shoot',            alt: 'VSO7 Utility Bomber photographed in a studio' },
        { title: 'Behind the print',        alt: 'Screen printing a VSO7 logo onto a black tee' },
        { title: 'Accessories flat lay',    alt: 'VSO7 cap, beanie and crossbody bag laid out together' },
        { title: 'Pop-up store',            alt: 'Customers browsing the VSO7 pop-up store' },
        { title: 'Night street edit',       alt: 'Model in a VSO7 windbreaker under city lights' },
        { title: 'Team VSO7',               alt: 'The VSO7 team standing outside the studio' }
    ];

    function $(sel, root) { return (root || document).querySelector(sel); }
    function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

    function money(n) { return 'R ' + Number(n).toLocaleString('en-ZA'); }

    function placeholder(label) {
        var text = String(label || 'VSO7').replace(/[^\w\s\-]/g, '').slice(0, 22).toUpperCase();
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="800" viewBox="0 0 640 800">' +
            '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="#1f1f1f"/><stop offset="1" stop-color="#0a0a0a"/></linearGradient></defs>' +
            '<rect width="640" height="800" fill="url(#g)"/>' +
            '<rect x="-80" y="120" width="260" height="900" fill="#e8332a" opacity="0.2" transform="skewX(-12)"/>' +
            '<text x="50%" y="48%" text-anchor="middle" font-family="Impact, sans-serif" font-size="96" fill="#f5f5f3">VSO7</text>' +
            '<text x="50%" y="58%" text-anchor="middle" font-family="monospace" font-size="26" fill="#8a8a86">' + text + '</text></svg>';
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }

    function makeImg(src, alt, label) {
        var img = document.createElement('img');
        img.alt = alt;
        img.loading = 'lazy';
        img.width = 640;
        img.height = 800;
        img.src = src;
        img.addEventListener('error', function () {
            img.onerror = null;
            img.src = placeholder(label);
        }, { once: true });
        return img;
    }

    function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

    function getCart() {
        try { return JSON.parse(localStorage.getItem('vso7-cart')) || []; } catch (e) { return []; }
    }
    function saveCart(c) {
        try { localStorage.setItem('vso7-cart', JSON.stringify(c)); } catch (e) {}
    }
    function updateCartCount(bump) {
        var el = $('#cartCount');
        if (!el) { return; }
        el.textContent = getCart().length;
        if (bump) {
            el.classList.remove('bump');
            void el.offsetWidth;            
            el.classList.add('bump');
        }
    }
    function addToCart(id) {
        var cart = getCart();
        cart.push(id);
        saveCart(cart);
        updateCartCount(true);
    }

    function initNav() {
        var toggle = $('.nav-toggle');
        var links = $('#navLinks');
        if (!toggle || !links) { return; }
        toggle.addEventListener('click', function () {
            var open = links.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(open));
            toggle.textContent = open ? '\u2715' : '\u2630';
        });
        $all('a', links).forEach(function (a) {
            a.addEventListener('click', function () {
                links.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.textContent = '\u2630';
            });
        });
    
        var here = location.pathname.split('/').pop() || 'index.html';
        $all('a', links).forEach(function (a) {
            if (a.getAttribute('href') === here) { a.setAttribute('aria-current', 'page'); }
        });
    }

    function initReveal() {
        var items = $all('.reveal');
        if (!items.length) { return; }
        if (!('IntersectionObserver' in window)) {
            items.forEach(function (i) { i.classList.add('is-visible'); });
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('is-visible');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });
        items.forEach(function (i) { io.observe(i); });
    }

    function productCard(p) {
        var card = document.createElement('article');
        card.className = 'card is-new';
        card.dataset.id = p.id;

        var imgBox = document.createElement('div');
        imgBox.className = 'card-image';
        imgBox.appendChild(makeImg('images/' + slug(p.name) + '.jpg', p.name + ' by VSO7 - ' + p.category, p.name));
        if (p.tag) {
            var tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = p.tag;
            imgBox.appendChild(tag);
        }

        var body = document.createElement('div');
        body.className = 'card-body';
        var h3 = document.createElement('h3');
        h3.textContent = p.name;
        var meta = document.createElement('p');
        meta.className = 'card-meta';
        meta.textContent = p.category + ' / ' + p.sizes;
        var desc = document.createElement('p');
        desc.className = 'card-meta';
        desc.textContent = p.desc;

        var foot = document.createElement('div');
        foot.className = 'card-foot';
        var price = document.createElement('span');
        price.className = 'price';
        price.textContent = money(p.price);
        var btn = document.createElement('button');
        btn.className = 'add-btn';
        btn.type = 'button';
        if (p.stock === 0) {
            btn.textContent = 'Sold out';
            btn.disabled = true;
        } else {
            btn.textContent = 'Add';
            btn.setAttribute('aria-label', 'Add ' + p.name + ' to cart');
            btn.addEventListener('click', function () { addToCart(p.id); });
        }
        foot.appendChild(price);
        foot.appendChild(btn);

        body.appendChild(h3);
        body.appendChild(meta);
        body.appendChild(desc);
        body.appendChild(foot);
        card.appendChild(imgBox);
        card.appendChild(body);
        return card;
    }

    function initFeatured() {
        var grid = $('#featuredGrid');
        if (!grid) { return; }
        grid.innerHTML = '<div class="loader" role="status" aria-label="Loading products"></div>';
        
        setTimeout(function () {
            grid.innerHTML = '';
            PRODUCTS.filter(function (p) { return p.tag === 'New' || p.tag === 'Hot' || p.tag === 'Limited'; })
                .slice(0, 3)
                .forEach(function (p) { grid.appendChild(productCard(p)); });
        }, 500);
    }

    function initProducts() {
        var grid = $('#productGrid');
        if (!grid) { return; }

        var search = $('#searchInput');
        var sortSel = $('#sortSelect');
        var count = $('#resultsCount');
        var chipBox = $('#filterChips');
        var state = { q: '', cat: 'All', sort: 'featured' };

        var cats = ['All'];
        PRODUCTS.forEach(function (p) { if (cats.indexOf(p.category) === -1) { cats.push(p.category); } });
        cats.forEach(function (c) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'chip' + (c === 'All' ? ' active' : '');
            b.textContent = c;
            b.setAttribute('aria-pressed', c === 'All' ? 'true' : 'false');
            b.addEventListener('click', function () {
                state.cat = c;
                $all('.chip', chipBox).forEach(function (x) {
                    var on = x === b;
                    x.classList.toggle('active', on);
                    x.setAttribute('aria-pressed', String(on));
                });
                render();
            });
            chipBox.appendChild(b);
        });

        function render() {
            var q = state.q.trim().toLowerCase();
            var list = PRODUCTS.filter(function (p) {
                var inCat = state.cat === 'All' || p.category === state.cat;
                var hay = (p.name + ' ' + p.category + ' ' + p.desc).toLowerCase();
                return inCat && (!q || hay.indexOf(q) !== -1);
            });

            if (state.sort === 'price-asc')  { list.sort(function (a, b) { return a.price - b.price; }); }
            if (state.sort === 'price-desc') { list.sort(function (a, b) { return b.price - a.price; }); }
            if (state.sort === 'name')       { list.sort(function (a, b) { return a.name.localeCompare(b.name); }); }

            grid.innerHTML = '';
            if (!list.length) {
                var none = document.createElement('p');
                none.className = 'no-results';
                none.textContent = 'No products match "' + state.q + '". Try a different search or filter.';
                grid.appendChild(none);
            } else {
                list.forEach(function (p) { grid.appendChild(productCard(p)); });
            }
            count.textContent = list.length + (list.length === 1 ? ' product' : ' products');
        }

        var timer;
        search.addEventListener('input', function () {
            clearTimeout(timer);
            timer = setTimeout(function () { state.q = search.value; render(); }, 150);
        });
        sortSel.addEventListener('change', function () { state.sort = sortSel.value; render(); });

        grid.innerHTML = '<div class="loader" role="status" aria-label="Loading products"></div>';
        setTimeout(render, 400);
    }

    function initGallery() {
        var gal = $('#gallery');
        var box = $('#lightbox');
        if (!gal || !box) { return; }

        var img = $('img', box);
        var cap = $('.lightbox-caption', box);
        var counter = $('.lightbox-counter', box);
        var current = 0;
        var lastFocus = null;

        GALLERY.forEach(function (g, i) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'gallery-item reveal';
            b.setAttribute('aria-label', 'Open image: ' + g.title);
            b.appendChild(makeImg('images/gallery-' + (i + 1) + '.jpg', g.alt, g.title));
            var c = document.createElement('span');
            c.className = 'gallery-caption';
            c.textContent = g.title;
            b.appendChild(c);
            b.addEventListener('click', function () { open(i); });
            gal.appendChild(b);
        });
        initReveal();

        function show(i) {
            current = (i + GALLERY.length) % GALLERY.length;
            var g = GALLERY[current];
            var thumb = $all('.gallery-item img', gal)[current];
            img.src = thumb.src;
            img.alt = g.alt;
            cap.textContent = g.title;
            counter.textContent = (current + 1) + ' / ' + GALLERY.length;
        }
        function open(i) {
            lastFocus = document.activeElement;
            show(i);
            box.classList.add('open');
            box.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
            $('.lightbox-close', box).focus();
        }
        function close() {
            box.classList.remove('open');
            box.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            if (lastFocus) { lastFocus.focus(); }
        }

        $('.lightbox-close', box).addEventListener('click', close);
        $('.lightbox-prev', box).addEventListener('click', function () { show(current - 1); });
        $('.lightbox-next', box).addEventListener('click', function () { show(current + 1); });
        box.addEventListener('click', function (e) { if (e.target === box) { close(); } });
        document.addEventListener('keydown', function (e) {
            if (!box.classList.contains('open')) { return; }
            if (e.key === 'Escape')      { close(); }
            if (e.key === 'ArrowLeft')   { show(current - 1); }
            if (e.key === 'ArrowRight')  { show(current + 1); }
        });
    }

    function initMap() {
        var el = $('#map');
        if (!el) { return; }
        if (!window.L) {
            el.textContent = 'The map could not be loaded. Please check your internet connection.';
            return;
        }
        var stores = [
            { name: 'VSO7 Flagship Store', lat: -26.2041, lng: 28.0473, addr: 'Johannesburg CBD ' },
            { name: 'VSO7 Studio',         lat: -26.2023, lng: 28.0583, addr: 'Maboneng Precinct ' }
        ];
        var map = L.map(el).setView([-26.203, 28.052], 14);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        var list = $('#storeList');
        var markers = stores.map(function (s, i) {
            var popup = document.createElement('div');
            var b = document.createElement('strong');
            b.textContent = s.name;
            var p = document.createElement('div');
            p.textContent = s.addr;
            popup.appendChild(b);
            popup.appendChild(p);
            var m = L.marker([s.lat, s.lng]).addTo(map).bindPopup(popup);

            if (list) {
                var li = document.createElement('li');
                li.tabIndex = 0;
                li.textContent = s.name;
                function go() {
                    map.flyTo([s.lat, s.lng], 16);
                    m.openPopup();
                    $all('li', list).forEach(function (x) { x.classList.remove('active'); });
                    li.classList.add('active');
                }
                li.addEventListener('click', go);
                li.addEventListener('keydown', function (e) { if (e.key === 'Enter') { go(); } });
                list.appendChild(li);
            }
            return m;
        });
        return markers;
    }

    var RULES = {
        name:    { test: function (v) { return /^[A-Za-z][A-Za-z\s'\-]{1,49}$/.test(v); }, msg: 'Enter your name (2-50 letters).' },
        email:   { test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }, msg: 'Enter a valid email address.' },
        phone:   { test: function (v) { return /^(\+27|0)[0-9]{9}$/.test(v.replace(/[\s\-]/g, '')); }, msg: 'Use a South African number, e.g. 082 123 4567 or +27821234567.' },
        select:  { test: function (v) { return v !== ''; }, msg: 'Please choose an option.' },
        quantity:{ test: function (v) { var n = Number(v); return n >= 1 && n <= 500 && Math.floor(n) === n; }, msg: 'Enter a whole number from 1 to 500.' },
        date:    { test: function (v) { return v !== '' && new Date(v) >= startOfToday(); }, msg: 'Choose today or a future date.' },
        message: { test: function (v) { return v.trim().length >= 20 && v.length <= 500; }, msg: 'Message must be 20-500 characters.' }
    };

    function startOfToday() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }

    function validateField(input) {
        var rule = RULES[input.dataset.rule];
        var group = input.closest('.form-group');
        var err = $('.error-msg', group);
        var value = input.value;
        var ok = true;

        if (input.required && !value.trim()) {
            ok = false;
            err.textContent = 'This field is required.';
        } else if (rule && value.trim() && !rule.test(value)) {
            ok = false;
            err.textContent = rule.msg;
        }
        group.classList.toggle('has-error', !ok);
        input.setAttribute('aria-invalid', String(!ok));
        if (!ok) { input.dataset.error = err.textContent; }
        return ok;
    }

    function validateForm(form) {
        var errors = [];
        $all('[data-rule], [required]', form).forEach(function (input) {
            if (!validateField(input)) {
                var label = $('label', input.closest('.form-group'));
                errors.push((label ? label.textContent.replace('*', '').trim() : input.name) + ': ' + input.dataset.error);
            }
        });
        var box = $('.form-errors', form);
        if (box) {
            box.classList.toggle('show', errors.length > 0);
            var ul = $('ul', box);
            ul.innerHTML = '';
            errors.forEach(function (m) {
                var li = document.createElement('li');
                li.textContent = m;
                ul.appendChild(li);
            });
            if (errors.length) { box.focus(); }
        }
        return errors.length === 0;
    }

    function liveValidate(form) {
        $all('[data-rule], [required]', form).forEach(function (input) {
            input.addEventListener('blur', function () { validateField(input); });
            input.addEventListener('input', function () {
                if (input.closest('.form-group').classList.contains('has-error')) { validateField(input); }
            });
        });
        var ta = $('textarea', form);
        var cc = $('.char-count', form);
        if (ta && cc) {
            ta.addEventListener('input', function () {
                cc.textContent = ta.value.length + ' / ' + ta.maxLength;
                cc.classList.toggle('limit', ta.value.length >= ta.maxLength - 20);
            });
        }
    }

    function showStatus(el, type, text) {
        el.className = 'form-status show ' + type;
        el.textContent = text;
    }

    function ajaxSubmit(data) {
        return fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify(data)
        }).then(function (r) {
            if (!r.ok) { throw new Error('Server returned ' + r.status); }
            return r.json();
        });
    }

    function initEnquiry() {
        var form = $('#enquiryForm');
        if (!form) { return; }
        liveValidate(form);

        var productSel = $('#product');
        PRODUCTS.forEach(function (p) {
            var o = document.createElement('option');
            o.value = p.id;
            o.textContent = p.name + ' (' + money(p.price) + ')';
            productSel.appendChild(o);
        });

        var needBy = $('#needBy');
        var t = new Date();
        needBy.min = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');

        var status = $('#enquiryStatus');
        var result = $('#enquiryResult');
        var btn = $('button[type="submit"]', form);

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            result.classList.remove('show');
            status.className = 'form-status';
            if (!validateForm(form)) { return; }

            var data = {
                name: form.elements['name'].value.trim(),
                email: form.elements['email'].value.trim(),
                phone: form.elements['phone'].value.trim(),
                type: form.elements['enquiryType'].value,
                product: form.elements['product'].value,
                quantity: Number(form.elements['quantity'].value),
                needBy: form.elements['needBy'].value,
                message: form.elements['message'].value.trim()
            };

            btn.classList.add('is-loading');
            btn.disabled = true;

            ajaxSubmit(data).then(function () {
                showStatus(status, 'success', 'Thank you ' + data.name + ', your enquiry has been received.');
            }).catch(function () {
                showStatus(status, 'fail', 'We could not reach the server, but here is an instant quote. Please try again later to send the enquiry.');
            }).then(function () {
                btn.classList.remove('is-loading');
                btn.disabled = false;
                renderEnquiryResult(data, result);
            });
        });

        form.addEventListener('reset', function () {
            result.classList.remove('show');
            status.className = 'form-status';
            $all('.form-group', form).forEach(function (g) { g.classList.remove('has-error'); });
            var box = $('.form-errors', form);
            if (box) { box.classList.remove('show'); }
        });
    }

    function renderEnquiryResult(data, el) {
        var p = PRODUCTS.filter(function (x) { return String(x.id) === data.product; })[0];
        el.innerHTML = '';
        var h = document.createElement('h3');
        h.textContent = 'Your response';
        el.appendChild(h);

        var dl = document.createElement('dl');
        function row(k, v, cls) {
            var dt = document.createElement('dt');
            dt.textContent = k;
            var dd = document.createElement('dd');
            dd.textContent = v;
            if (cls) { dd.className = cls; }
            dl.appendChild(dt);
            dl.appendChild(dd);
        }

        row('Enquiry', data.type);
        if (p) {
            var qty = data.quantity;
            var discount = qty >= 25 ? 0.15 : qty >= 10 ? 0.10 : 0;
            var total = Math.round(p.price * qty * (1 - discount));
            var avail = p.stock === 0 ? 'Sold out - restock expected in 3 to 4 weeks'
                      : p.stock >= qty ? 'In stock (' + p.stock + ' available)'
                      : 'Only ' + p.stock + ' in stock - the rest can be backordered';
            var days = p.stock >= qty ? 3 : 14;
            var ship = new Date(data.needBy);
            row('Product', p.name);
            row('Quantity', String(qty));
            row('Bulk discount', discount ? (discount * 100) + '% off' : 'None (10% from 10 items, 15% from 25)');
            row('Availability', avail);
            row('Estimated delivery', days + ' working days');
            row('Needed by', ship.toLocaleDateString('en-ZA'));
            row('Estimated total', money(total), 'estimate');
        } else {
            row('Next step', 'Our team will reply to ' + data.email + ' within 1 working day.');
        }
        el.appendChild(dl);
        el.classList.add('show');
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function initContact() {
        var form = $('#contactForm');
        if (!form) { return; }
        liveValidate(form);

        var RECIPIENT = 'info@vso7.co.za'; 
        var status = $('#contactStatus');
        var preview = $('#emailPreview');
        var btn = $('button[type="submit"]', form);

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            status.className = 'form-status';
            if (!validateForm(form)) { return; }

            var subject = '[' + form.elements['messageType'].value + '] message from ' + form.elements['name'].value.trim();
            var body = 'Name: ' + form.elements['name'].value.trim() + '\n' +
                       'Email: ' + form.elements['email'].value.trim() + '\n' +
                       'Phone: ' + form.elements['phone'].value.trim() + '\n' +
                       'Message type: ' + form.elements['messageType'].value + '\n\n' +
                       form.elements['message'].value.trim();

            preview.innerHTML = '';
            [['To', RECIPIENT], ['Subject', subject]].forEach(function (r) {
                var b = document.createElement('b');
                b.textContent = r[0] + ': ';
                preview.appendChild(b);
                preview.appendChild(document.createTextNode(r[1] + '\n'));
            });
            preview.appendChild(document.createTextNode('\n' + body));
            preview.classList.add('show');

            btn.classList.add('is-loading');
            
            setTimeout(function () {
                btn.classList.remove('is-loading');
                window.location.href = 'mailto:' + RECIPIENT +
                    '?subject=' + encodeURIComponent(subject) +
                    '&body=' + encodeURIComponent(body);
                showStatus(status, 'success', 'Your email app should now open with the message ready to send to ' + RECIPIENT + '.');
            }, 600);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initNav();
        initReveal();
        updateCartCount(false);
        initFeatured();
        initProducts();
        initGallery();
        initMap();
        initEnquiry();
        initContact();
    });
})();