var ScrollHandler = function () { 
    function initialize(Slideout) {
        var delta = 20;
        var navbar = document.querySelector('.hogia-toolbar');
        var toolbar = document.querySelector('#toolbar');
        var navbarCollapse = toolbar.querySelector('.navbar-collapse');
        var navbarBreadcrumb = toolbar.querySelector('.navbar-breadcrumb');

        var latestKnownScrollY = (document.documentElement && document.documentElement.scrollTop) ||
              document.body.scrollTop;
        var toolbarHeight = getToolbarHeight(navbarBreadcrumb);
        var toolbarHeaderHeight = getToolbarHeaderHeight();

        var prefix = (function prefix() {
            var regex = /^(Webkit|Khtml|Moz|ms|O)(?=[A-Z])/;
            var styleDeclaration = document.getElementsByTagName('script')[0].style;
            for (var prop in styleDeclaration) {
                if (regex.test(prop)) {
                    return '-' + prop.match(regex)[0].toLowerCase() + '-';
                    //return prop.match(regex)[0];
                }
            }
            // Nothing found so far? Webkit does not enumerate over the CSS properties of the style object.
            // However (prop in style) returns the correct value, so we'll have to test for
            // the precence of a specific property
            if ('WebkitOpacity' in styleDeclaration) { return '-webkit-'; }
            if ('KhtmlOpacity' in styleDeclaration) { return '-khtml-'; }
            return '';
        }());

        navbar.style.setProperty(prefix + 'Transform', 'translate3d(0,' + Math.max(-toolbarHeight, -window.pageYOffset) + 'px, 0)');

        window.addEventListener('resize', function () {
            navbarBreadcrumb = toolbar.querySelector('.navbar-breadcrumb');
            toolbarHeight = getToolbarHeight(navbarBreadcrumb);
            toolbarHeaderHeight = getToolbarHeaderHeight();
            positionFromToolbar(toolbarHeight);
        }, true);

        window.addEventListener('focusin', function () {
            navbarBreadcrumb = toolbar.querySelector('.navbar-breadcrumb');
            toolbarHeight = getToolbarHeight(navbarBreadcrumb);
            toolbarHeaderHeight = getToolbarHeaderHeight();
            positionFromToolbar(toolbarHeight);
        }, true);

        positionFromToolbar(toolbarHeight);

        function update() {
            var pageYOffset = (document.documentElement && document.documentElement.scrollTop) ||
              document.body.scrollTop;
            var navbarClassList = navbar.classList;
            var navbarStyle = navbar.style;
            var toolbarPosition;
            var scrolled;
            var translateY;
            var visibleMobileMenu;

            var checkToolbarHeight = getToolbarHeight(navbarBreadcrumb);

            if (toolbarHeight !== checkToolbarHeight) {
                toolbarHeight = checkToolbarHeight;
                positionFromToolbar(toolbarHeight);
            }

            if (!navbarBreadcrumb && toolbar.querySelector('.navbar-breadcrumb')) {
                navbarBreadcrumb = toolbar.querySelector('.navbar-breadcrumb');
                toolbarHeight = getToolbarHeight(navbarBreadcrumb);
                positionFromToolbar(toolbarHeight);
            }
            
            if (pageYOffset !== latestKnownScrollY) {
                visibleMobileMenu = window.getComputedStyle(navbarCollapse, null).display === 'none';

                if (pageYOffset <= toolbarHeaderHeight) {
                    //scroll-top mindre �n toolbar-height
                    navbarClassList.remove("toolbar-transition");
                    navbarClassList.remove("toolbar-shadow");

                    if (visibleMobileMenu) {
                        navbar.style.setProperty(prefix + 'Transform', 'translate3d(0, 0px, 0)');
                    } else {
                        navbar.style.setProperty(prefix + 'Transform', 'translate3d(0, ' + -pageYOffset + 'px, 0)');
                    }
                    latestKnownScrollY = pageYOffset;
                } else {
                    if (pageYOffset >= latestKnownScrollY) {
                        //ner
                        if (document.querySelector('#toolbar .navbar-user > li.open'))
                            document.querySelector('#toolbar .navbar-user > li.open').classList.remove('open');

                        navbarClassList.remove("toolbar-transition");
                        navbarClassList.remove("toolbar-shadow");

                        scrolled = pageYOffset - latestKnownScrollY;

                        translateY = Math.max(-toolbarHeight, getNavbarPosition(navbar)[1] - scrolled);

                        navbar.style.setProperty(prefix + 'Transform', 'translate3d(0, ' + translateY + 'px, 0)');

                        latestKnownScrollY = pageYOffset;
                    } else if (pageYOffset + delta < latestKnownScrollY) {
                        //upp
                        navbarClassList.add("toolbar-transition");
                        navbarClassList.add("toolbar-shadow");

                        if (visibleMobileMenu)
                            navbar.style.setProperty(prefix + 'Transform', 'translate3d(0, 0, 0)');
                        else
                            navbar.style.setProperty(prefix + 'Transform', 'translate3d(0, ' + -toolbarHeaderHeight + 'px, 0)');

                        latestKnownScrollY = pageYOffset;
                    }
                }

            }

            requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    };

    function getToolbarHeaderHeight() {
        var toolbar = document.querySelector('#toolbar');
        return parseInt(window.getComputedStyle(toolbar.querySelector('.navbar-header'), null).height, 10);
    }

    function getToolbarHeight(navbarBreadcrumb) {
        var toolbar = document.querySelector('#toolbar');

        var navbarSubmenu = toolbar.querySelector('.navbar-submenu');
        var navbarHeader = toolbar.querySelector('.navbar-header');

        var visibleMobileMenu = (navbarSubmenu != null) ? window.getComputedStyle(navbarSubmenu, null).display === 'none' : false;
        if (navbarBreadcrumb)
            var visibleBreadcrumb = window.getComputedStyle(navbarBreadcrumb, null).display !== 'none';
  
        var toolbarHeight = 0;
  
        if (!visibleMobileMenu)
            var navbarSubmenuHeight = (navbarSubmenu != null) ? parseInt(window.getComputedStyle(navbarSubmenu, null).height, 10) : 0;
            var navbarHeaderHeight = (navbarHeader != null) ? parseInt(window.getComputedStyle(navbarHeader, null).height, 10) : 0;
            toolbarHeight = navbarSubmenuHeight + navbarHeaderHeight;
        if (visibleMobileMenu)
            toolbarHeight = parseInt(window.getComputedStyle(toolbar.querySelector('.navbar-header'), null).height, 10);
        if (visibleBreadcrumb)
            toolbarHeight = toolbarHeight + parseInt(window.getComputedStyle(navbarBreadcrumb, null).height, 10);
        return toolbarHeight;
    }

    function getNavbarPosition(navbar) {
        var results = navbar.style.transform;

        results = results.split("(")[1];
        results = results.split(")")[0];
        results = results.replace(/px/g, "");

        var resultsList = results.split(", ");

        return resultsList;
    }

    function positionFromToolbar(toolbarHeight) {
        var page = document.querySelector('#toolbar + div');
        page.style.paddingTop = toolbarHeight + 'px';
    }

    return {
        initialize: initialize
    };
};

exports.ScrollHandler = ScrollHandler;