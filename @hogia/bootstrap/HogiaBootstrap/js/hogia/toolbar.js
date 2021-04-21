var HogiaBootstrap = HogiaBootstrap || {};

HogiaBootstrap.Toolbar = function () {
    var self = this;
    self.languageRepository = new HogiaBootstrap.LanguageRepository();
    self.validator = new HogiaBootstrap.SettingsValidator();
    self.viewModel = null;

    function setupOrganizations(settings) {
        self.viewModel.isSelectOrganizationVisible(settings.isSelectOrganizationVisible);
        self.viewModel.isSelectOrganizationPossible(settings.isSelectOrganizationPossible);
        self.viewModel.organizations(settings.organizations);

        var organization = new HogiaBootstrap.OrganizationModel();
        if (settings.isSelectOrganizationVisible) {
            if (settings.organizations && settings.selectedOrganizationId) {
                var org = $.grep(settings.organizations, function (x) { return x.id == settings.selectedOrganizationId; });
                if (org.length == 1)
                    organization = org[0];
            } else {
                organization = settings.organizations[0];
            }

            settings.changeOrganizationCallback(organization.id);
        }

        self.viewModel.selectedOrganization(organization);
    }

    function setupUserLinks(settings) {
        var userLinkViewModel = createUserLinkModels(settings);
        self.viewModel.addUserLink(userLinkViewModel);
    }

    function navigated(updatedBreadcrumb) {
        self.viewModel.navigated();
        self.viewModel.breadcrumbs(updatedBreadcrumb);
    }

    function getHtml() {
        var html = "";
        html += '<div id="mobile-menu-overlay"></div>';

        html += '<nav class="hogia-toolbar navbar navbar-fixed-top" role="navigation">';
        html += '    <div class="navbar-header">';

        html += '        <span class="helper"></span>';
        html += '        <div class="vertical-aligner">';
        html += '        <div class="table_pos">';
        html += '           <div class=""><button type="button" class="btn btn-link toggle-button pull-left visible-xs" id="Toolbar_openMobileMenu"><i class="fa fa-lg fa-bars"></i></button></div>';
        html += '           <div><a href="#" target="_blank" data-bind="attr: { \'href\': getSelectedEnvironmentUrl }" id="Toolbar__hogiaLink" class=""><img class="navbar-image hidden-xs" id="Toolbar__hogiaLogo" data-bind="attr: { \'src\': hogiaLogoUrl }" alt="Hogia" /></a>';
        html += '           <a href="#" id="Toolbar__homeLink" data-bind="alt: applicationName"><img class="navbar-application-image" id="Toolbar__applicationImage" data-bind="attr: { \'src\': applicationImageUrl, \'alt\': applicationImageAltText }" />';
        html += '           <span class="navbar-brand hidden-xs" id="Toolbar__applicationName" data-bind="text: applicationName"></span></a></div>';
        html += '       </div>';
        html += '   </div>';
        html += '        <ul class="nav navbar-nav navbar-right navbar-user hidden-xs">';
        html += '            <li class="dropdown"  data-bind="visible: isSelectOrganizationVisible">';
        html += '                <a href="#" id="Toolbar__orgMenu"class="dropdown-toggle" data-toggle="dropdown" data-bind="visible: isSelectOrganizationPossible">';
        html += '                   <i class="fa fa-lg fa-sitemap"></i>';
        html += '                   <span data-bind="text: selectedOrganization().name"></span><b class="caret"></b>';
        html += '                </a>';
        html += '                <span class="select-organization-possible" data-bind="visible: !isSelectOrganizationPossible(), text: selectedOrganization().name"></span>';
        html += '                <ul class="dropdown-menu hogia-toolbar-organizations" data-bind="visible: isSelectOrganizationPossible, foreach: organizations">';
        html += '                    <li><a href="#" data-bind="click: $parent.setSelectOrganization, text: name, attr: { \'data-option\': id, \'id\': \'Toolbar__orgMenu__\'+$index() }"></a></li>';
        html += '               <b class="notch"></b> </ul>';
        html += '            </li>';
        html += '            <!-- ko foreach: userLinks -->';
        html += '            <li class="dropdown" data-bind="css: { open: childIsActive }">';
        html += '                <a href="#" id="Toolbar__userLinks" class="dropdown-toggle" data-bind="css: { }, attr: { \'data-toggle\': isDropDown ? \'dropdown\' : \'\' }">';
        html += '                    <i data-bind="if: hasIcon, attr: { \'class\': icon }"></i>';
        html += '                    <i data-bind="visible: hasNoName" class="no-name-parent-icon fa fa-lg fa-exclamation-circle"></i>';
        html += '                    <span data-bind="text: name"></span>';
        html += '                    <b class="caret" data-bind="visible: isDropDown"></b>';
        html += '                </a>';
        html += '                <ul class="dropdown-menu hogia-toolbar-user-links" data-bind="visible: isDropDown">';
        html += '                    <li><div class="nameContent"><h4 data-bind="text: name"></h4><h5 data-bind="text: email"></h5></div></li>';
        html += '                    <!-- ko foreach: children -->';
        html += '                    <li>';
        html += '                        <a href="#" data-bind="css: { active: isActive }, click: function (data, e) { e.stopPropagation(); $root.navigateSubMenu($data) }, attr: {\'id\': \'Toolbar__userLinks__\'+$index()}">';
        html += '                            <i data-bind="if: hasIcon, attr: { \'class\': icon }"></i>';
        html += '                            <span data-bind="text: name"></span>';
        html += '                            <i data-bind="visible: hasNoName" class="no-name-child-icon fa fa-fw fa-exclamation-circle"></i>';
        html += '                        </a>';
        html += '                        ';
        html += '                    </li>';
        html += '                   <!-- /ko -->';
        html += '                <b class="notch"></b>';
        html += '                </ul>';
        html += '            </li>';
        html += '            <!-- /ko -->';
        html += '        </ul>';
        html += '    </div>';
        html += '    <div class="collapse navbar-collapse navbar-submenu">';
        html += '        <ul class="nav navbar-nav" data-bind="foreach: systemLinks">';
        html += '            <li class="dropdown wide" data-bind="css: { open: childIsActive }">';
        html += '                <a href="#" class="dropdown-toggle" data-bind="css: { active: isActive, \'drop-down\': isDropDown, \'child-active\': childIsActive,  \'subnav-visible\': isSubNavVisible}, attr: { \'data-toggle\': isDropDown ? \'dropdown\' : \'\',\'id\': \'Toolbar__menu__\'+ $index() }, click: function (data, e) { $root.navigate(id(), e.target) }">';
        //html += '                    <i data-bind="if: true, attr: { \'class\': icon }"></i>';
        html += '                    <span data-bind="text: name" class="uppercase"></span>';
        html += '                    <b class="caret" data-bind="visible: isDropDown"></b>';
        html += '                </a>';
        html += '                <div class="sub-menu"></div>';
        html += '                <ul class="dropdown-menu hogia-toolbar-system-links" data-bind="visible: isDropDown, foreach: children">';
        html += '                    <li>';
        html += '                        <a href="#" data-bind="text: name, css: { \'active\': isActive, \'subnav-visible\': $parent.isActive }, click: function (data, e) { e.stopPropagation(); $root.navigateSubMenu($data) }, attr: {\'id\': \'Toolbar__menu__\'+ $parentContext.$index() + \'__\' + $index()}"></a>';
        html += '                    </li>';
        html += '                </ul>';
        html += '            </li>';
        html += '        </ul>';
        html += '        <ul class="nav navbar-nav navbar-right" data-bind="foreach: staticLinks">';
        html += '            <li class="dropdown wide" data-bind="css: { open: childIsActive }">';
        html += '                <a href="#" class="dropdown-toggle" data-bind="css: { active: isActive, \'drop-down\': isDropDown, \'child-active\': childIsActive, \'subnav-visible\': isSubNavVisible }, attr: { \'data-toggle\': isDropDown ? \'dropdown\' : \'\',\'id\': \'Toolbar__menu__\'+ $index() }, click: function (data, e) { $root.navigate(id(), e.target) }">';
        html += '                    <i data-bind="if: true, attr: { \'class\': icon }"></i>';
        html += '                    <span data-bind="text: name" class="uppercase"></span>';
        html += '                    <b class="caret" data-bind="visible: isDropDown"></b>';
        html += '                </a>';
        html += '                <div class="sub-menu"></div>';
        html += '                <ul class="dropdown-menu hogia-toolbar-system-links" data-bind="visible: isDropDown, foreach: children">';
        html += '                    <li>';
        html += '                        <a href="#" data-bind="text: name, css: { active: isActive }, click: function (data, e) { e.stopPropagation(); $root.navigateSubMenu($data) }, attr: {\'id\': \'Toolbar__menu__\'+ $parentContext.$index() + \'__\' + $index()}"></a>';
        html += '                    </li>';
        html += '                </ul>';
        html += '            </li>';
        html += '        </ul>';
        html += '    </div>';
        html += '    <div class="navbar-breadcrumb" data-bind="visible: breadcrumbs()">';
        html += '        <ol class="breadcrumb" data-bind="foreach: breadcrumbs">';
        html += '            <li class="wide" data-bind="css: { active: isActive }">';
        html += '                <a data-bind="attr: {href: url, \'id\': \'Toolbar__breadcrumb__\'+ $index()}">';
        html += '                    <span data-bind="text: name">-</span>';
        html += '                </a>';
        html += '            </li>';
        html += '        </ol>';
        html += '    </div>';
        html += '';
        html += '    </nav>';
        html += '    <div class="hogia-toolbar" id="menu">';
        html += '       <div class="navbar-header left-menu">';
        //html += '           <a href="#">';
        //html += '           <span class="helper"></span>';
        html += '               <div class="vertical-aligner">';
        html += '                   <div class="table_pos">';
        html += '                       <div><a href="#" id="Toolbar__homeLink"><img class="navbar-image pull-left" id="Toolbar__hogiaLogo" data-bind="attr: { \'src\': hogiaLogoUrl }" alt="Hogia" /></a></div>';
        html += '                       <div class="pull-right"><button type="button" class="btn btn-link toggle-button" id="Toolbar_closeMobileMenu"><span class="fa-stack fa-lg"><i class="fa fa-circle fa-stack-2x fa-inverse"></i><i class="fa fa-bars fa-stack-1x"></i></span></i></button></div>';
        html += '                   </div>';
        html += '                   <div class="nameContent"><a href="#" data-bind="click: function (data, e) { e.stopPropagation(); $root.navigateSubMenu(userLinks()[0].children()[0]) }"><h4 data-bind="text: username"></h4><h5 data-bind="text: email"></h5></a></div>';
        html += '               </div>';
        //html += '           </a>';
        html += '       </div>';
        html += '        <ul class="" data-bind="foreach: systemLinks">';
        html += '            <li class="dropdown wide" data-bind="css: { open: childIsActive }">';
        html += '                <a href="#" class="dropdown-toggle" data-bind="css: { active: isActive, \'drop-down\': isDropDown, \'child-active\': childIsActive }, attr: { \'data-toggle\': isDropDown ? \'dropdown\' : \'\',\'id\': \'Toolbar__menu__\'+ $index() }, click: function (data, e) { $root.navigate(id(), e.target) }">';
        html += '                    <i data-bind="if: true, attr: { \'class\': icon }"></i>';
        html += '                    <div class="icon-placeholder" data-bind="visible: !icon()"></div>';
        html += '                    <span data-bind="text: name" class="uppercase"></span>';
        html += '                    <b class="caret" data-bind="visible: isDropDown"></b>';
        html += '                </a>';
        html += '                <div class="sub-menu"></div>';
        html += '                <ul class="dropdown-menu hogia-toolbar-system-links" data-bind="visible: isDropDown, foreach: children">';
        html += '                    <li>';
        html += '                        <a href="#" data-bind="text: name, css: { active: isActive }, click: function (data, e) { e.stopPropagation(); $root.navigateSubMenu($data) }, attr: {\'id\': \'Toolbar__menu__\'+ $parentContext.$index() + \'__\' + $index()}"></a>';
        html += '                    </li>';
        html += '                </ul>';
        html += '            </li>';
        html += '        </ul>';
        html += '        <hr data-bind="visible: staticLinks().length > 0"></hr>';
        html += '        <ul class="" data-bind="foreach: staticLinks">';
        html += '            <li class="dropdown wide" data-bind="css: { open: childIsActive }">';
        html += '                <a href="#" class="dropdown-toggle" data-bind="css: { active: isActive, \'drop-down\': isDropDown, \'child-active\': childIsActive }, attr: { \'data-toggle\': isDropDown ? \'dropdown\' : \'\',\'id\': \'Toolbar__menu__\'+ $index() }, click: function (data, e) { $root.navigate(id(), e.target) }">';
        html += '                    <i data-bind="if: true, attr: { \'class\': icon }"></i>';
        html += '                    <span data-bind="text: name" class="uppercase"></span>';
        html += '                    <b class="caret" data-bind="visible: isDropDown"></b>';
        html += '                </a>';
        html += '                <div class="sub-menu"></div>';
        html += '                <ul class="dropdown-menu hogia-toolbar-system-links" data-bind="visible: isDropDown, foreach: children">';
        html += '                    <li>';
        html += '                        <a href="#" data-bind="text: name, css: { active: isActive }, click: function (data, e) { e.stopPropagation(); $root.navigateSubMenu($data) }, attr: {\'id\': \'Toolbar__menu__\'+ $parentContext.$index() + \'__\' + $index()}"></a>';
        html += '                    </li>';
        html += '                </ul>';
        html += '            </li>';
        html += '        </ul>';
        html += '        <ul>';
        html += '        <hr data-bind="visible: isSelectOrganizationVisible"/>';
        html += '            <li class="dropdown"  data-bind="visible: isSelectOrganizationVisible">';
        html += '                <a href="#" id="Toolbar__orgMenu"class="dropdown-toggle drop-down" data-toggle="dropdown" data-bind="visible: isSelectOrganizationPossible">';
        html += '                   <i class="fa fa-lg fa-sitemap"></i>';
        html += '                   <span data-bind="text: selectedOrganization().name"></span><b class="caret"></b>';
        html += '                </a>';
        html += '                <span class="select-organization-possible" data-bind="visible: !isSelectOrganizationPossible(), text: selectedOrganization().name"></span>';
        html += '                <ul class="dropdown-menu hogia-toolbar-organizations" data-bind="visible: isSelectOrganizationPossible, foreach: organizations">';
        html += '                    <li><a href="#" data-bind="click: $parent.setSelectOrganization, text: name, attr: { \'data-option\': id, \'id\': \'Toolbar__orgMenu__\'+$index() }"></a></li>';
        html += '               <b class="notch"></b> </ul>';
        html += '            </li>';
        html += '        </ul>';
        html += '        <hr />';
        html += '        <ul class="">';
        html += '            <!-- ko with: userLinks()[0].children()[3] -->';
        html += '                    <li class="dropdown wide">';
        html += '                        <a href="#"class="dropdown-toggle" data-bind="css: { active: isActive }, click: function (data, e) { e.stopPropagation(); $root.navigateSubMenu($data) }">';
        html += '                            <i data-bind="if: hasIcon, attr: { \'class\': icon }"></i>';
        html += '                            <span class="uppercase" data-bind="text: name"></span>';
        html += '                        </a>';
        html += '                        ';
        html += '                    </li>';
        html += '            <!-- /ko -->';
        html += '        </ul>';
        html += '    </div>';

        return html;
    };

    function loadToolbarTemplate(file, id, success) {
        var $element = $('#' + id);

        $.get(file, function (template) {
            $element.html(template);
            success($element);
        });
    };

    function createUserLinkModels(settings) {
        var baseUrl = settings.getSelectedEnvironmentUrl();

        var userLinkViewModel = new HogiaBootstrap.MenuModel({
            name: settings.username,
            email: settings.email,
            navigateCallback: "/",
            icon: "fa fa-lg fa-user",
            subMenuAlignRight: true
        });

        var goToUrl = function (url) {
            window.open(url);
        };

        if (!settings.openUserLinksInNewTab) {
            goToUrl = function (url) {
                window.location.href = url;
            };
        }

        var myAccountViewModel = new HogiaBootstrap.MenuModel({
            name: self.languageRepository.getString("myHogiaID"),
            navigateCallback: function () {
                goToUrl(baseUrl + "settings/user-profile/" + getQueryString());
            },
            icon: "fa fa-fw fa-user",
            isOpeningInNewTab: settings.openUserLinksInNewTab
        });

        myAccountViewModel.setUrl(baseUrl + getQueryString());

        var logoutViewModel = new HogiaBootstrap.MenuModel({
            name: self.languageRepository.getString("logout"),
            navigateCallback: settings.logoutCallback,
            icon: "fa fa-fw fa-sign-out"
        });

        userLinkViewModel.addChildren(myAccountViewModel);
        userLinkViewModel.addChildren(logoutViewModel);

        return userLinkViewModel;

        function getQueryString() {
            if (!isOnHogiaId()) return "";

            var querystringStartIndex = location.href.indexOf("?"),
                hasQuerystring = querystringStartIndex > 0;

            return hasQuerystring ? location.href.substring(querystringStartIndex) : "";
        }

        function isOnHogiaId() {
            return window.location.href.indexOf(baseUrl) !== -1;
        }
    }

    function initialize(settings, isDevMode) {
        var devMode = isDevMode || false;

        var defaultSettings = new HogiaBootstrap.Settings();
        $.extend(defaultSettings, settings);

        self.validator.validate(defaultSettings);

        if (!devMode) {
            var toolbarContainer = document.getElementById(settings.toolbarId);
            if (!toolbarContainer) {
                throw "Cannot insert toolbar, missing div with id " + "'" + settings.toolbarId + "'";
            }
        }

        self.languageRepository.initialize();
        self.languageRepository.setCulture(defaultSettings.culture);

        self.viewModel = new HogiaBootstrap.ToolbarViewModel(defaultSettings.applicationImageUrl, defaultSettings.hogiaLogoUrl, defaultSettings.applicationName, defaultSettings.applicationImageWidth, defaultSettings.changeOrganizationCallback);
        setupOrganizations(defaultSettings);
        setupUserLinks(defaultSettings);
        self.viewModel.setSystemLinks(defaultSettings.systemLinks);
        self.viewModel.setStaticLinks(defaultSettings.staticLinks);
        self.viewModel.breadcrumbs(settings.breadcrumbs);
        self.viewModel.username = settings.username;
        self.viewModel.email = settings.email;
        self.viewModel.getSelectedEnvironmentUrl = settings.getSelectedEnvironmentUrl();

        if (!devMode) {
            toolbarContainer.innerHTML = getHtml();
            ko.applyBindings(self.viewModel, toolbarContainer);
        }

        if (devMode) {
            loadToolbarTemplate('/HogiaBootstrap3/Content/hogia/toolbar-template.html', settings.toolbarId, function ($element) {
                ko.applyBindings(self.viewModel, $element[0]);
            });
        }

        adjustSubMenuMinWidth(settings.toolbarId);

        this.navigated(settings.breadcrumbs);

        document.addEventListener("click", function (e) {
            if ((e.target.classList && ((e.target.classList.contains('dropdown') && e.target.classList.contains('wide')) || e.target.classList.contains('dropdown-toggle'))) || (e.target.offsetParent && e.target.offsetParent.classList && (e.target.offsetParent.classList.contains('dropdown-toggle') || e.target.offsetParent.classList.contains('drop-down')))) {
                return;
            }

            self.viewModel.staticLinks().forEach(function (staticLink) {
                if (!staticLink.isDropDown)
                    staticLink.isSubNavVisible(false);
            });
            self.viewModel.systemLinks().forEach(function (systemLink) {
                if (!systemLink.isDropDown)
                    systemLink.isSubNavVisible(false);
            });
        });

        var totalWidth = 0;
        $('.navbar-submenu li.dropdown.wide.open').find('a.active.child-active').parent('li').children('ul').children('li').each(function (index) {
            totalWidth += $(this).width();
        });
        $('.navbar-submenu li.dropdown.wide.open').find('a.active.child-active').parent('li').children('div.yellow-marker').css({ 'width': totalWidth + 'px', 'z-index': 100000 });

        var backgruondImgSrc = settings.getSelectedEnvironmentUrl() + "app/images/480.jpg";
        var menuHeader = document.querySelector('#menu > .left-menu');
        var dropDownHeader = document.querySelector('#toolbar .hogia-toolbar-user-links li:first-child');
        menuHeader.style.background = dropDownHeader.style.background = 'url(' + backgruondImgSrc + ') 50% 50%/cover no-repeat';


        HogiaBootstrapScrollHandler.ScrollHandler().initialize(Slideout);
        HogiaBootstrapSlideoutHandler.SlideoutHandler().initialize(Slideout);



    };

    function adjustSubMenuMinWidth() {
        $(function () {
            setTimeout(
                function () {
                    //setUserLinksMinWidth();
                    setSystemLinksMinWidth();
                    getToolbarHeight();
                }, 300);

            $(window).resize(function () {
                //setUserLinksMinWidth();
                setSystemLinksMinWidth();
                getToolbarHeight();
            });
        });
    }

    function getToolbarHeaderHeight() {
        var toolbar = document.querySelector('#toolbar');
        return parseInt(window.getComputedStyle(toolbar.querySelector('.navbar-header'), null).height, 10);
    }

    function getToolbarHeight(navbarBreadcrumb) {
        var toolbar = document.querySelector('#toolbar');

        //var navbarToggle = toolbar.querySelector('.navbar-toggle');
        var navbarCollapse = toolbar.querySelector('.navbar-collapse');
        //var navbarBreadcrumb = toolbar.querySelector('.navbar-breadcrumb');

        //var visibleToggle = window.getComputedStyle(navbarToggle, null).display !== 'none';
        var visibleMobileMenu = window.getComputedStyle(navbarCollapse, null).display === 'none';
        if (navbarBreadcrumb)
            var visibleBreadcrumb = window.getComputedStyle(navbarBreadcrumb, null).display !== 'none';

        var toolbarHeight = 5;
        /*if (visibleToggle)
            toolbarHeight = toolbarHeight + toolbar.find('.navbar-header').height();*/
        if (!visibleMobileMenu)
            toolbarHeight = toolbarHeight + parseInt(window.getComputedStyle(navbarCollapse, null).height, 10);
        if (visibleMobileMenu)
            toolbarHeight = parseInt(window.getComputedStyle(toolbar.querySelector('.navbar-header'), null).height, 10);
        if (visibleBreadcrumb)
            toolbarHeight = toolbarHeight + parseInt(window.getComputedStyle(navbarBreadcrumb, null).height, 10);
        return toolbarHeight;
    }

    function setSystemLinksMinWidth() {
        $(".hogia-toolbar-system-links").each(function () {
            var minWidth = $(window).width() - $(this).parent().offset().left;
            $(this).css({
                "min-width": minWidth + "px"
            });
        });
    }

    function setUserLinksMinWidth() {
        $(".hogia-toolbar-user-links").css({
            "min-width": $(window).width() + "px"
        });
    }

    function selectedOrganizationId() {
        var organization = self.viewModel.selectedOrganization();
        return organization.id;
    }

    return {
        initialize: initialize,
        navigated: navigated,
        selectedOrganizationId: selectedOrganizationId
    };
};

HogiaBootstrap.Settings = function () {
    var self = this;
    self.applicationImageUrl = "";
    self.applicationImageWidth = undefined;
    self.hogiaLogoUrl = "Content/hogia/images/hogia.png";
    self.applicationName = "This is my app";
    self.culture = "sv-SE";
    self.toolbarId = "toolbar";
    self.openUserLinksInNewTab = true;

    self.environments = {};
    self.environments.production = "https://my.hogia.se/";
    self.environments.development = "https://mydev.hogia.se/";
    self.environments.test = "https://mytest.hogia.se/";
    self.environments.test2 = "https://mytest2.hogia.se/";
    self.environments.qualityassurance = "https://myqa.hogia.se/";
    self.environments.local = "https://mytest.hogia.se/";

    self.environment = "production";

    self.username = "";
    self.email = "";
    self.logoutCallback = function () { };

    self.organizations = [];
    self.changeOrganizationCallback = function (organizationId) { };
    self.isSelectOrganizationVisible = true;
    self.isSelectOrganizationPossible = true;

    self.systemLinks = [];

    self.staticLinks = [];

    self.breadcrumbs = [];

    function isMenuModel(menuModel) {
        if (typeof menuModel.navigateCallback == "undefined") {
            return false;
        }

        if (typeof menuModel.icon == "undefined") {
            return false;
        }

        return true;
    }

    function addLink(menuModel) {
        if (typeof menuModel == "undefined") {
            throw "menuModel cannot be undefined";
        }

        if (typeof menuModel.name == "undefined") {
            throw "menuModel.name cannot be undefined";
        }

        if (!isMenuModel(menuModel)) {
            throw "menuModel must be of type HogiaBootstrap.MenuModel";
        }

        self.systemLinks.push(menuModel);
    }

    function addReportLink(menuModel) {
        if (typeof menuModel == "undefined") {
            throw "menuModel cannot be undefined";
        }

        if (!isMenuModel(menuModel)) {
            throw "menuModel must be of type HogiaBootstrap.MenuModel";
        }
        menuModel.name = "Rapporter";

        menuModel.icon = 'fa fa-bar-chart fa-fw';

        self.staticLinks.push(menuModel);
    }

    function addSettingsLink(menuModel) {
        if (typeof menuModel == "undefined") {
            throw "menuModel cannot be undefined";
        }

        if (!isMenuModel(menuModel)) {
            throw "menuModel must be of type HogiaBootstrap.MenuModel";
        }
        menuModel.name = "Inställningar";

        menuModel.icon = 'fa fa-cog fa-fw';

        self.staticLinks.push(menuModel);
    }

    function addHelpLink(menuModel) {
        if (typeof menuModel == "undefined") {
            throw "menuModel cannot be undefined";
        }

        if (!isMenuModel(menuModel)) {
            throw "menuModel must be of type HogiaBootstrap.MenuModel";
        }
        menuModel.name = "Hjälp";

        menuModel.icon = 'fa fa-question-circle fa-fw';

        self.staticLinks.push(menuModel);
    }

    function getSelectedEnvironmentUrl() {
        return this.environments[this.environment];
    }

    return {
        applicationImageUrl: self.applicationImageUrl,
        applicationImageWidth: self.applicationImageWidth,
        hogiaLogoUrl: self.hogiaLogoUrl,
        culture: self.culture,
        username: self.username,
        email: self.email,
        environment: self.environment,
        environments: self.environments,
        toolbarId: self.toolbarId,
        logoutCallback: self.logoutCallback,
        organizations: self.organizations,
        changeOrganizationCallback: self.changeOrganizationCallback,
        isSelectOrganizationVisible: self.isSelectOrganizationVisible,
        isSelectOrganizationPossible: self.isSelectOrganizationPossible,
        systemLinks: self.systemLinks,
        staticLinks: self.staticLinks,
        breadcrumbs: self.breadcrumbs,
        openUserLinksInNewTab: self.openUserLinksInNewTab,
        getSelectedEnvironmentUrl: getSelectedEnvironmentUrl,
        addLink: addLink,
        addReportLink: addReportLink,
        addSettingsLink: addSettingsLink,
        addHelpLink: addHelpLink
    };
};

HogiaBootstrap.SettingsValidator = function () {
    function validateApplicationImageUrl(settings) {
        if (typeof settings.applicationImageUrl == "undefined") {
            throw "Invalid applicationImageUrl cannot be undefined";
        }

        if (settings.applicationImageUrl.length == 0) {
            throw "Invalid applicationImageUrl cannot be empty";
        }
    }

    function validateCulture(settings) {
        if (typeof settings.culture == "undefined") {
            throw "Invalid culture cannot be undefined";
        }
    }

    function validateEnvironment(settings) {
        if (typeof settings.environment == "undefined") {
            throw "Invalid environment cannot be undefined";
        }

        if (settings.environment != "production" &&
            settings.environment != "development" &&
            settings.environment != "test" &&
            settings.environment != "test2" &&
            settings.environment != "qualityassurance" &&
            settings.environment != "local") {
            throw "Invalid environment expected development, test, test2, qualityassurance, production or local";
        }
    }

    function validateLogoutCallback(settings) {
        if (typeof settings.logoutCallback == "undefined") {
            throw "Invalid logoutCallback cannot be undefined";
        }
    }

    function validateChangeOrganizationCallback(settings) {
        if (typeof settings.changeOrganizationCallback == "undefined") {
            throw "Invalid changeOrganizationCallback cannot be undefined";
        }
    }

    function validateOrganizations(settings) {
        if (typeof settings.organizations == "undefined") {
            settings.organizations = [];
            settings.isSelectOrganizationVisible = false;
            return;
        }

        if (!$.isArray(settings.organizations)) {
            var organizations = [];
            organizations.push(settings.organizations);
            settings.organizations = organizations;
        }

        if (settings.organizations.length === 1) {
            settings.isSelectOrganizationPossible = false;
            return;
        }

        if (settings.organizations.length == 0) {
            settings.isSelectOrganizationVisible = false;
            return;
        }

        $.each(settings.organizations, function (index, organization) {
            validateOrganization(organization, index);
        });
    }

    function validateOrganization(organization, index) {
        if (typeof organization == "undefined") {
            throw "Invalid organization cannot be undefined at index " + index;
        }

        if (typeof organization.name == "undefined") {
            throw "Invalid organization name cannot be undefined at index " + index;
        }

        if (typeof organization.id == "undefined") {
            throw "Invalid organization id cannot be undefined at index " + index;
        }
    }

    function validateUsername(settings) {
        if (typeof settings.username == "undefined") {
            throw "Invalid username cannot be undefined";
        }
    }

    function validate(settings) {
        if (typeof settings == "undefined") {
            throw "Toolbar settings cannot be undefined";
        }

        validateApplicationImageUrl(settings);
        validateCulture(settings);
        validateEnvironment(settings);
        validateLogoutCallback(settings);
        validateChangeOrganizationCallback(settings);
        validateOrganizations(settings);
        validateUsername(settings);
    }

    return {
        validate: validate
    };
};

HogiaBootstrap.LanguageRepository = function () {
    var self = this;
    self.culture = "sv-SE";
    self.languages = new Array();
    self.currentLanguage = new Array();

    function setCulture(culture) {
        var language = self.languages[culture];
        if (typeof language == 'undefined') {
            throw "Culture not supported '" + culture + "'";
        }
        self.culture = culture;
        self.currentLanguage = language;
    }

    function getString(key) {
        var string = self.currentLanguage[key];
        if (typeof string == 'undefined') {
            throw "No language string exist with key '" + key + "'";
        }
        return string;
    }

    function initialize() {
        var english = new Array();
        english['myHogiaID'] = "My HogiaID";
        english['logout'] = "Log out";
        self.languages['en'] = english;

        var swedish = new Array();
        swedish['myHogiaID'] = "Mitt HogiaID";
        swedish['logout'] = "Logga ut";

        self.languages['sv-SE'] = swedish;
        self.currentLanguage = swedish;
    }

    return {
        initialize: initialize,
        setCulture: setCulture,
        getString: getString
    };
};

HogiaBootstrap.ToolbarViewModel = function (applicationImageUrl, hogiaLogoUrl, applicationName, applicationImageWidth, changeOrganizationCallback) {
    var self = this;

    self.applicationImageUrl = ko.observable(applicationImageUrl);
    self.applicationImageAltText = ko.observable('');
    self.applicationImageWidth = ko.observable(applicationImageWidth);
    self.hogiaLogoUrl = ko.observable(hogiaLogoUrl);
    self.applicationName = ko.observable(applicationName);
    self.userLinks = ko.observableArray([]);
    self.systemLinks = ko.observableArray([]);
    self.staticLinks = ko.observableArray([]);
    self.breadcrumbs = ko.observableArray([]);
    self.subLinks = ko.observableArray([]);
    self.organizations = ko.observableArray([]);
    self.selectedOrganization = ko.observable('');
    self.isSubNavVisible = ko.observable(false);
    self.subNavMarginLeft = ko.observable('');
    self.isSelectOrganizationVisible = ko.observable(false);
    self.isSelectOrganizationPossible = ko.observable(true);
    self.changeOrganizationCallback = changeOrganizationCallback;
    self.isMobileNavVisible = ko.observable(true);
    self.activeMenuViewModel;
    self.selectedDropDownName = ko.observable("");
    self.selectedDropDownId = ko.observable();
    self.index = 0;

    function mobileNavVisible() {
        self.isMobileNavVisible(true);
    }

    function mobileNavHidden() {
        self.isMobileNavVisible(false);
    }

    function toggleMobileNav() {
        self.isMobileNavVisible() ? mobileNavHidden() : mobileNavVisible();
    }

    self.navigate = function (id, doNavigate) {
        if (typeof doNavigate == 'undefined')
            doNavigate = true;

        var clickedLinkViewModel = ko.utils.arrayFirst(self.systemLinks().concat(self.staticLinks()), function (link) {
            return id == link.id();
        });

        if (clickedLinkViewModel.children().length > 0) {

            showSubNavigation(clickedLinkViewModel);
            return;
        }

        if (!canNavigateAway())
            return;



        ko.utils.arrayForEach(self.systemLinks().concat(self.staticLinks()), function (link) {
            link.subNavHidden();
            link.isActive(false);
            self.isSubNavVisible(false);
        });

        activateMenuViewModel(clickedLinkViewModel, doNavigate);
    };

    self.navigateSubMenu = function (subMenuViewModel, doNavigate) {
        ko.utils.arrayForEach(self.systemLinks().concat(self.staticLinks()), function (link) {
            link.subNavHidden();
            link.isActive(false);
            self.isSubNavVisible(false);
        });
        if (typeof doNavigate == 'undefined')
            doNavigate = true;

        if (!canNavigateAway())
            return;

        if (!self.isSubNavVisible())
            showSubNavigation(subMenuViewModel.parent, subMenuViewModel);

        activateMenuViewModel(subMenuViewModel, doNavigate);
    };

    self.allSubLinks = function () {
        var all = [];

        ko.utils.arrayForEach(self.systemLinks(), function (link) {
            ko.utils.arrayForEach(link.children(), function (child) {
                all.push(child);
            });
        });

        ko.utils.arrayForEach(self.userLinks(), function (link) {
            ko.utils.arrayForEach(link.children(), function (child) {
                all.push(child);
            });
        });

        return all;
    };

    self.navigated = function () {

        var allLinks = self.systemLinks().concat(self.userLinks(), self.staticLinks());

        $.each(allLinks, function (i, link) {
            link.isActive(false);

            if (link.isCurrentUrl()) {
                self.navigate(link.id(), false);
                return;
            }

        });

        $.each(self.allSubLinks(), function (i, link) {
            if (link.isCurrentUrl()) {
                self.navigateSubMenu(link, false);
            }
        });
    };

    function activateMenuViewModel(clickedLinkViewModel, doNavigate) {
        if (typeof doNavigate == 'undefined')
            doNavigate = true;

        clearSubMenus();
        clearMainMenus(clickedLinkViewModel);

        if (clickedLinkViewModel.parent) {
            clickedLinkViewModel.parent.childIsActive(true);
            clickedLinkViewModel.parent.isActive(true);
        }

        if (clickedLinkViewModel.isDropDown) {
            clickedLinkViewModel.parent.childIsActive(true);
        }

        self.activeMenuViewModel = clickedLinkViewModel;
        if (!self.activeMenuViewModel.isOpeningInNewTab)
            clickedLinkViewModel.isActive(true);

        if (doNavigate)
            clickedLinkViewModel.navigate();
    }

    function clearMainMenus(clickedLinkViewModel) {
        var allLinks = self.userLinks().concat(self.systemLinks());

        if (!clickedLinkViewModel.isDropDown && !clickedLinkViewModel.isChild) {
            ko.utils.arrayForEach(allLinks, function (link) {
                link.isActive(false);
            });
        }

        ko.utils.arrayForEach(allLinks, function (link) {
            if (!link.isDropDown) {
                link.isActive(false);
            }

        });
    }

    function clearSubMenus() {
        var allLinks = self.userLinks().concat(self.systemLinks());

        $.each(allLinks, function (i, link) {
            $.each(link.children(), function (j, subLink) {
                subLink.isActive(false);
            });
        });
    }

    function addUserLink(menuModel) {
        setMenuModelId(menuModel);
        self.userLinks.push(menuModel);
    };

    function addSystemLink(menuModel) {
        setMenuModelId(menuModel);
        self.systemLinks.push(menuModel);
    };

    function setSystemLinks(menuModels) {
        ko.utils.arrayForEach(menuModels, function (menuModel) {
            setMenuModelId(menuModel);
        });

        self.systemLinks(menuModels);
    };

    function setStaticLinks(menuModels) {
        ko.utils.arrayForEach(menuModels, function (menuModel) {
            setMenuModelId(menuModel);
        });

        self.staticLinks(menuModels);
    };

    function hideSubNavigation() {
        var allLinks = self.userLinks().concat(self.systemLinks());

        var clickedItem = ko.utils.arrayFirst(allLinks, function (link) {
            return link.id() === self.selectedDropDownId();
        });

        clickedItem.isActive(false);
        self.isSubNavVisible(false);
        self.selectedDropDownName('');
        self.selectedDropDownId(-1);
        self.systemLinks()[0].childIsActive(false);
        self.staticLinks()[0].childIsActive(false);
    }

    function showSubNavigation(clickedItem, clickedSubMenuViewModel) {
        var id = clickedItem.id();

        if (typeof clickedItem.name == "function") {
            self.selectedDropDownName(clickedItem.name());

            clickedItem.name.subscribe(function (name) {
                self.selectedDropDownName(name);
            });
        } else {
            self.selectedDropDownName(clickedItem.name);
        }

        self.selectedDropDownId(clickedItem.id());

        var allLinks = self.systemLinks().concat(self.userLinks(), self.staticLinks());

        if (isSystemLink(id))
            self.isMobileNavVisible(true);


        ko.utils.arrayForEach(allLinks, function (link) {
            var isClickedItem = link.id() === id;
            if (isClickedItem && link.isDropDown) {

                if (link.isActive()) {
                    link.childIsActive(true);

                } else {
                    link.isActive(false);
                    if (!clickedSubMenuViewModel) {
                        self.staticLinks().forEach(function (staticLink) {
                            if (!staticLink.isDropDown)
                                staticLink.isSubNavVisible(!staticLink.isSubNavVisible());
                        });
                        self.systemLinks().forEach(function (systemLink) {
                            if (!systemLink.isDropDown)
                                systemLink.isSubNavVisible(!systemLink.isSubNavVisible());
                        });
                    }
                }

                self.subLinks(link.children());


            } else if (isClickedItem) {
                self.subLinks([]);
                self.isSubNavVisible(false);
            } else if (link.isDropDown) {
                link.isActive(false);
                link.isSubNavVisible(false);
            }
        });

        function isSystemLink(id) {
            return !!ko.utils.arrayFirst(self.userLinks(), function (link) {
                return link.id() === id;
            });
        }

    };

    function setSelectOrganization(item) {
        self.selectedOrganization(item);
        self.changeOrganizationCallback(item.id);
    };

    function setMenuModelId(menuModel) {
        menuModel.setId(self.index);
        self.index++;
    };

    function canNavigateAway() {
        if (typeof self.activeMenuViewModel == "undefined")
            return true;

        return self.activeMenuViewModel.canNavigateAway();
    };

    return {
        navigated: self.navigated,
        applicationImageUrl: self.applicationImageUrl,
        applicationImageAltText: self.applicationImageAltText,
        applicationName: self.applicationName,
        hogiaLogoUrl: self.hogiaLogoUrl,
        userLinks: self.userLinks,
        systemLinks: self.systemLinks,
        staticLinks: self.staticLinks,
        subLinks: self.subLinks,
        allSubLinks: self.allSubLinks,
        breadcrumbs: self.breadcrumbs,
        organizations: self.organizations,
        selectedOrganization: self.selectedOrganization,
        isSubNavVisible: self.isSubNavVisible,
        isSelectOrganizationVisible: self.isSelectOrganizationVisible,
        isSelectOrganizationPossible: self.isSelectOrganizationPossible,
        addUserLink: addUserLink,
        addSystemLink: addSystemLink,
        setSystemLinks: setSystemLinks,
        setStaticLinks: setStaticLinks,
        showSubNavigation: showSubNavigation,
        setSelectOrganization: setSelectOrganization,
        navigate: self.navigate,
        navigateSubMenu: self.navigateSubMenu,
        subNavMarginLeft: self.subNavMarginLeft,
        applicationImageWidth: self.applicationImageWidth,
        toggleMobileNav: toggleMobileNav,
        mobileNavVisible: mobileNavVisible,
        mobileNavHidden: mobileNavHidden,
        isMobileNavVisible: self.isMobileNavVisible,
        selectedDropDownName: self.selectedDropDownName,
        hideSubNavigation: hideSubNavigation
    };
};

HogiaBootstrap.MenuModel = function (settings) {
    var defaultSettings = new HogiaBootstrap.MenuModelSettings();
    $.extend(defaultSettings, settings);

    var self = this;
    self.navigateCallback = defaultSettings.navigateCallback;
    self.name = typeof defaultSettings.name == "function" ? defaultSettings.name : ko.observable(defaultSettings.name);
    self.email = typeof defaultSettings.email == "function" ? defaultSettings.email : ko.observable(defaultSettings.email);
    self.icon = ko.observable(defaultSettings.icon);
    self.subMenuAlignRight = defaultSettings.subMenuAlignRight;
    self.canNavigateAway = defaultSettings.canNavigateAwayCallback;
    self.isCurrentUrl = defaultSettings.isCurrentUrl;
    self.isOpeningInNewTab = defaultSettings.isOpeningInNewTab;

    self.isSubNavVisible = ko.observable(false);

    self.children = ko.observableArray([]);
    self.id = ko.observable('');
    self.isActive = ko.observable(false);
    self.isDropDown = false;
    self.isChild = false;
    self.url = defaultSettings.url;
    self.parent = null;
    self.childIsActive = ko.observable(false);

    self.hasIcon = new ko.computed(function () {
        var d = (!!self.icon());
        return d;
    });

    self.hasNoName = new ko.computed(function () {
        if (self.name === "" || self.name === undefined) {
            return true;
        } else {
            return false;
        }
    });

    self.hasChildren = new ko.computed(function () {
        return (self.children().length > 0);
    });

    self.navigate = function () {
        self.navigateCallback(self);
    };

    function setId(id) {
        self.id(id);
    }

    function setName(name) {
        self.name(name);
    }

    function setUrl(url) {
        self.url(url);
    }

    function setNavigateCallback(navigateCallback) {
        self.navigateCallback = navigateCallback;
    }

    function addChildren(menuModel) {
        this.isDropDown = true;
        menuModel.isChild = true;
        menuModel.parent = self;
        self.children.push(menuModel);
    }

    function subNavVisible() {
        self.isSubNavVisible(true);
    }

    function subNavHidden() {
        self.isSubNavVisible(false);
    }

    return {
        id: self.id,
        name: self.name,
        email: self.email,
        url: self.url,
        icon: self.icon,
        subMenuAlignRight: self.subMenuAlignRight,
        children: self.children,
        isSubNavVisible: self.isSubNavVisible,
        hasIcon: self.hasIcon,
        hasNoName: self.hasNoName,
        hasChildren: self.hasChildren,
        setId: setId,
        setName: setName,
        setUrl: setUrl,
        setNavigateCallback: setNavigateCallback,
        addChildren: addChildren,
        subNavVisible: subNavVisible,
        subNavHidden: subNavHidden,
        navigateCallback: self.navigateCallback,
        navigate: self.navigate,
        isActive: self.isActive,
        canNavigateAway: self.canNavigateAway,
        isDropDown: self.isDropDown,
        isChild: self.isChild,
        isCurrentUrl: self.isCurrentUrl,
        parent: self.parent,
        childIsActive: self.childIsActive,
        isOpeningInNewTab: self.isOpeningInNewTab
    };
};

HogiaBootstrap.OrganizationModel = function (id, name) {
    var self = this;
    self.id = id;
    self.name = name;

    return {
        id: self.id,
        name: self.name
    };
};

HogiaBootstrap.BreadcrumbModel = function (settings) {
    var self = this;
    self.name = settings.name;
    self.url = settings.url;
    self.isActive = settings.isActive;
    self.icon = settings.icon;
    self.hasIcon = new ko.computed(function () {
        var d = (!!self.icon);
        return d;
    });
    self.index = settings.index;

    return {
        name: self.name,
        url: self.url,
        isActive: self.isActive,
        icon: self.icon,
        hasIcon: self.hasIcon,
        index: self.index
    };
};

HogiaBootstrap.MenuModelSettings = function () {
    var self = this;
    self.name = "placeholder";
    self.email = "";
    self.navigateCallback = function () { };
    self.icon = "";
    self.url = ko.observable('');
    self.subMenuAlignRight = false;
    self.canNavigateAwayCallback = function () { return true; };
    self.isOpeningInNewTab = false;

    self.isCurrentUrl = function () {
        var linkUrl = this.url();
        var linkUrlWithoutQuerystring = hasQuerystring() ? linkUrl.substring(0, linkUrl.indexOf('?')) : linkUrl;
        return linkUrl === location.href || (linkUrl.length > 0 && linkUrlWithoutQuerystring === location.href);

        function hasQuerystring() {
            return linkUrl.indexOf('?') > 0;
        }
    };

    return {
        name: self.name,
        email: self.email,
        navigateCallback: self.navigateCallback,
        icon: self.icon,
        url: self.url,
        subMenuAlignRight: self.subMenuAlignRight,
        canNavigateAwayCallback: self.canNavigateAwayCallback,
        isCurrentUrl: self.isCurrentUrl,
        isOpeningInNewTab: self.isOpeningInNewTab
    };
};

$(function () {
    ko.bindingHandlers.setSubMenuLeftMargin = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        },

        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var value = valueAccessor(),
                $element = $(element);

            var isActive = value();

            if (isActive) {
                var marginLeft = $element.offset().left;
                bindingContext.$parent.subNavMarginLeft(marginLeft.toString() + 'px');
            }
        }
    };
});
// test
