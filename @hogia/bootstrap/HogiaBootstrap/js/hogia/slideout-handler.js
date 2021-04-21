var HogiaBootstrapSlideoutHandler = HogiaBootstrapSlideoutHandler || {};

HogiaBootstrapSlideoutHandler.SlideoutHandler = function () {
    function initialize(Slideout) {

        window.addEventListener('resize', function () {
            enableDisableSlideout(slideout);
            if (window.innerWidth > 767) {
                if (slideout.isOpen()) {
                    slideout.close();
                }
            }
        }, true);


        var prefix = (function prefix() {
            var regex = /^(Webkit|Khtml|Moz|ms|O)(?=[A-Z])/;
            var styleDeclaration = document.getElementsByTagName('script')[0].style;
            for (var prop in styleDeclaration) {
                if (regex.test(prop)) {
                    return '-' + prop.match(regex)[0].toLowerCase() + '-';
                }
            }
            if ('WebkitOpacity' in styleDeclaration) { return '-webkit-'; }
            if ('KhtmlOpacity' in styleDeclaration) { return '-khtml-'; }
            return '';
        }());

        var t = document.querySelector('#toolbar > nav');
        var m = document.getElementById('menu');
        var o = document.getElementById('mobile-menu-overlay');
        var p = document.querySelector('#toolbar + div');

        var navbar = document.querySelector('.hogia-toolbar');

        var slideout = new Slideout({
            'panel': p,
            'menu': m,
            'padding': 256,
            'tolerance': 0
        });

        enableDisableSlideout(slideout);

        var buttons = document.querySelectorAll('.toggle-button');
        var menuItems = document.querySelectorAll('#menu a.dropdown-toggle:not(.drop-down)');
        var dropdownMenuItems = document.querySelectorAll('#menu .dropdown-menu > li > a');

        for (var i = 0; i < buttons.length; ++i) {
            var item = buttons[i];
            item.addEventListener('click', function () {

                slideout.toggle();
            });
        }

        for (var i = 0; i < menuItems.length; ++i) {
            var item = menuItems[i];
            item.addEventListener('click', function () {

                slideout.toggle();
            });
        }

        for (var i = 0; i < dropdownMenuItems.length; ++i) {
            var item = dropdownMenuItems[i];
            item.addEventListener('click', function () {

                slideout.toggle();
            });
        }

        p.addEventListener('click', function (e) {
            if (slideout.isOpen()) {
                e.preventDefault();
                slideout.close();
            }
        });

        slideout.on('translate', function (translated) {
            var toolbarPosition = getNavbarPosition(navbar);
            t.classList.add('toolbar-transition');
            m.classList.add('toolbar-transition');
            t.style.setProperty(prefix + 'Transform', 'translate3d(' + translated + 'px,' + toolbarPosition + 'px, 0)');
            m.style.setProperty(prefix + 'Transform', 'translate3d(' + translated + 'px, 0, 0)');
        });

        slideout.on('beforeclose', function () {
            var toolbarPosition = getNavbarPosition(navbar);
            o.style['display'] = o.style.opacity = '0';
            o.style['display'] = o.style.display = 'none';
            t.classList.remove('toolbar-transition');
            t.style.setProperty(prefix + 'Transform', 'translate3d(0,' + toolbarPosition + 'px, 0)');
            m.style.setProperty(prefix + 'Transform', 'translate3d(-256px, 0, 0)');
        });

        slideout.on('beforeopen', function () {
            var toolbarPosition = getNavbarPosition(navbar);
            o.style['display'] = o.style.opacity = '1';
            o.style['display'] = o.style.display = 'block';
            t.classList.add('toolbar-transition');
            m.classList.add('toolbar-transition');
            t.style.setProperty(prefix + 'Transform', 'translate3d(256px,' + toolbarPosition + 'px, 0)');
            m.style.setProperty(prefix + 'Transform', 'translate3d(256px, 0, 0)');
        });
    };

    function enableDisableSlideout(slideout) {
        if (window.innerWidth < 767)
            slideout.enableTouch();
        else {
            slideout.close();
            slideout.disableTouch();
        }
    }

    function getNavbarPosition(navbar) {
        var results = navbar.style.transform;

        results = results.split("(")[1];
        results = results.split(")")[0];
        results = results.replace(/px/g, "");

        var resultsList = results.split(", ");

        return resultsList;
    }

    return {
        initialize: initialize
    };
};
