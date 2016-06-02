//Last Publish: Friday, March 04, 2016 4:34 PM

var assetPath = "/includes/";
var aVideoIsPlaying = false;// this is used to fix an IE issue where jwplayer() needs to be loaded for the conditional to work
window.log = function(){log.history = log.history || [];log.history.push(arguments);if(this.console) {arguments.callee = arguments.callee.caller;console.log( Array.prototype.slice.call(arguments) );}};
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});
var IE6 = false;
if ($.browser.msie && $.browser.version < 7) { IE6 = true };
var confirmPage = false,
    childDomain,
    cachedSwitcherHref; // for caching the href on choose state. If they dont pick a state reset the choose state href
//Listen for cross domain messages - needs to be outside document.ready
$.receiveMessage(
    function(e){
        console.log('message: ' + e.data);
        if (e.data.indexOf('#') > -1) {
            var parts = e.data.split('#'),
            func = parts[1],
            arg = parts[0];
            switch( func ) {
                case 'openLightbox':
                    openLightbox(arg);
                    break;
                case 'closeLightbox':
                    closeLightbox(arg);
                    break;
                case 'closeRegistration':
                    closeRegistration(arg);
                    break;
                case 'resize':
                    resizeIframe(arg);
                    break;
                default:
                    console.log('unrecognized cross domain message');
            }
        } else if (e.data == 'confirmation-page') {
            confirmPage = true;
        } else {
            console.log('unrecognized message');
        }
    },
    childDomain
 );
function resizeIframe(height) {
    $('#overlay-frame').height(height);
    $('#overlay-content').height(height + 10);
}
$(function(){
    if (!getCookie('state')) {
        //console.log('no state cookie');
        $('#forgot-username, #forgot-password, #register_btn[href*="registration.asp"]').addClass('trigger-choose-state-overlay');
        var forgotUsernameUrl = $('#forgot-username'),
            forgotPasswordUrl = $('#forgot-password'),
            registrationUrl = $('#register_btn[href*="registration.asp"]');
        forgotUsernameUrl.attr('href', forgotUsernameUrl.attr('href') + '&targ=/forgot-username');
        forgotPasswordUrl.attr('href', forgotPasswordUrl.attr('href') + '&targ=/forgot-password');
        registrationUrl.attr('href', registrationUrl.attr('href') + '?targ=/registration');
    }
    /* Initialize collapsibles */
    $('.collapsible').each(function(){
        var obj = $(this),
        // First determine if this is old or new style
            oldStyle = (obj.find('h4.closed').length || obj.find('h4.q').length) ? true : false,
            newStyle = (!oldStyle && obj.find('.collapsible-trigger').length) ? true : false;
        // Then initialize accordingly
        if (oldStyle) {
            obj.parent().accordion({
                onLoad: function() {
                    $('#showHideAll').parent().addClass('collapsible-all collapsible-old').text('Show All');
                },
                paneClass: '.expand',
                triggerClass: 'h4',
                addShowAll: false
            });
            return false; // Exit each loop; only needs to initialize on the first
        } else if (newStyle) {
            obj.accordion();
        }
    });
    $('.tabs').dukeTabs();
/* -- Choose State -- */
    $(window).lightboxTrigger({
        href: function(element){
            var iframeTarget = getParameterByName('target'),
                iframeSrc = $('#change-state a.switcher').attr('href');
            if(iframeTarget == false) {
                iframeTarget =  getParameterByName('targ', thisLink);
            }
            // if still no target set then default
            if(iframeTarget == false) {
                iframeTarget =  '/';
            }
            cachedSwitcherHref = $('#change-state a.switcher').attr('href'); // store default href globally
            var obj = $(element),
                iframeTitle = obj.text().indexOf('Choose State') >= 0 ? 'Choose State' : 'Change State',
                iframeOlsTarget = iframeSrc.indexOf('://ols') > -1 ? iframeSrc.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[0].slice(0, -1) : '',
                iframeReferrer = '//' + location.hostname,
                iframeNewSrc = '#';
            if(obj.hasClass('promo-link')) {
                iframeTitle = obj.find('.promo-title').text().replace('&','and');
            }
            if (iframeTarget == '/') {
                if (dukeCookie.read('segment') == 'bus') {
                    iframeTarget = '/business';
                } else if (dukeCookie.read('segment') == 'lbus') {
                    iframeTarget = '/large-business';
                }
            }
            iframeNewSrc = iframeSrc + "?target="+iframeTarget + '&referrer=' + iframeReferrer + '&title=' + iframeTitle;
            if (iframeOlsTarget) {
                iframeNewSrc = iframeNewSrc + '&olsTarget=' + iframeOlsTarget;
            }
            return iframeNewSrc;
        },
        trigger: 'onload',
        urlParam: 'chooseState',
        height: 420,
        width: 500
    });
    $('a[href*="/choose-state/"], a[href*="choose-state.asp"], .trigger-choose-state-overlay').lightboxTrigger({
        href: function(element){
            var thisLink = $(element).attr('href'),
                obj = $(element),
                iframeTarget = getParameterByName('target'),
                iframeSrc = $('#change-state a.switcher').attr('href'); // have to look at 2 targer options
                if(iframeTarget == false) {
                    iframeTarget =  getParameterByName('targ', thisLink);
                }
                // if still no target set then default
                if(iframeTarget == false) {
                    iframeTarget =  '/';
                }
            cachedSwitcherHref = $('#change-state a.switcher').attr('href'); // store default href globally
            $("#change-state a").attr('href', iframeSrc);
            var iframeTitle = obj.text().indexOf('Choose State') >= 0 ? 'Choose State' : 'Change State',
                iframeOlsTarget = iframeSrc.indexOf('://ols') > -1 ? iframeSrc.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[0].slice(0, -1) : '',
                iframeReferrer = '//' + location.hostname,
                iframeNewSrc = '#';
            if(obj.hasClass('promo-link')) {
                iframeTitle = obj.find('.promo-title').text().replace('&','and');
            }
            if (iframeTarget == '/') {
                if (dukeCookie.read('segment') == 'bus') {
                    iframeTarget = '/business';
                } else if (dukeCookie.read('segment') == 'lbus') {
                    iframeTarget = '/large-business';
                }
            }
            iframeNewSrc = iframeSrc + "?target="+iframeTarget + '&referrer=' + iframeReferrer + '&title=' + iframeTitle;
            if (iframeOlsTarget) {
                iframeNewSrc = iframeNewSrc + '&olsTarget=' + iframeOlsTarget;
            }
            return iframeNewSrc;
        },
        trigger: 'onclick',
        height: 420,
        width: 500
    });
    /* -- Registration stuff -- */
    $('body').lightboxTrigger({
        href: function(){
            var href = location.protocol + '//' + location.hostname + '/authenticate/',
            customerState = customer.state || dukeCookie.read('state');
            if (customerState) { href += (customerState) ? '?state=' + customerState : '' };
            return href;
        },
        trigger: 'onload',
        urlParam: 'true',
        height: 580,
        width: 700,
        urlKey: 'showRegistration'
    });
    $('a[href*="/registration.asp"]').lightboxTrigger({
        href: function(element){
            var baseDomain = location.protocol + '//' + location.hostname;
            if (customer.state) {
                var href = baseDomain + '/authenticate/',
                    customerState = customer.state;
                if (customerState) { href += (customerState) ? '?state=' + customerState : '' };
                if (/(Log in|Sign in)/i.test($(element).text())) {
                    var join = (href.indexOf('?') > -1) ? '&' : '?';
                    join += 'tab=sign-in#sign-in';
                    href += join;
                }
                return href;
            }
            else {
                var obj = $(element),
                    iframeTitle = obj.text().indexOf('Choose State') >= 0 ? 'Choose State' : 'Change State',
                    iframeSrc = $('#change-state a.switcher').attr('href')+"?targ=/registration",
                    iframeNewSrc = iframeSrc + '&referrer=' + baseDomain + '&title=' + iframeTitle;
                return iframeNewSrc;
            }
        },
        trigger: 'onclick',
        height: 580,
        width: 700
    });
    // Handle OLS errors for signin and registration
    if (location.search) {
        if (getParameterByName('ERROR_CODE') || getParameterByName('error')) {
            var errorCode = getParameterByName('ERROR_CODE'),
                errorCodeType = errorCode ? 'sign-in' : 'register';
            errorCode = errorCode ? errorCode : getParameterByName('error');
            var href = location.protocol + '//' + location.hostname + '/authenticate/?state=' + dukeCookie.read('state') + '&errorCode=' + errorCode + '&errorCodeType=' + errorCodeType + '#' + errorCodeType;
            if (errorCodeType == 'sign-in') {
                openLightbox(href);
            } else {
                window.location.href = href;
            }
        }
    }
    $('.iframe-lightbox').live('click', function(e) {
        e.preventDefault();
        var href = $(this).attr('href'),
            width = Number($(this).attr('data-width')),
            height = Number($(this).attr('data-height'));
        confirmPage = (href.indexOf('eestore') > -1) ? true : false ;
        openLightbox({
            content: href,
            width: width || 760,
            height: height || 600
        });
        eventTracking({
            category: 'Lightbox',
            action: 'Open',
            value: $(this).text()
        });
    });
    $('#TXA-custComments').charCount();
    // HACK to fix the links to be root relative on ewidev
    if(location.hostname == 'ewidev.duke-energy.com') {
        //console.log('Hostname: ', location.hostname);
        $('a[href="http://www.duke-energy.com"]').each(function() {
            var obj = $(this),
                newLink = obj.attr('href').replace('http://www.duke-energy.com', '');
            obj.attr('href', newLink)
        });
    }
    // HACK to put "signup for email" link in header
    if($('#signup-for-email').length == 0) {
        $('#masthead').append('<div id="signup-for-email"><a class="iframe-lightbox" data-width="700" href="//www.pages02.net/dukeenergycorporation-reside/sign-up/?webSyncID=b2ab1771-8196-4504-1379-c4a964624337&amp;sessionGUID=2c63c12b-761c-da55-0c23-b02295627582" target="_blank">Sign up for Email</a></div>');
    }
    // HACK to change "href" attribute and remove "class" attribute (IT to update)
    $('#change-state span').click(function() {
        $('#change-state a').click();
    });
    $('#logo a').href = '/#' + customer.full;
    checkHeight();
    links.tag();
    tagSignin();
    $('#overlay .close').live('click', function(e) {
        e.preventDefault();
        //confirmPage = true;
        var pg = location.pathname;
        if (pg.indexOf('/deals/') || pg.indexOf('-savings-store/') || pg.indexOf('/freecfls/')) {
            closeLightbox({showConfirm:false});
        } else {
            closeLightbox();
        }
        eventTracking({
            category: 'Lightbox',
            action: 'Close',
            value: document.title
        });
    });
    //childDomain is only used for OLS Registration
    if (dukeCookie.read('msWebSphereServerName')) {
        childDomain = unescape(dukeCookie.read('msWebSphereServerName'));
    } else if (location.hostname == 'wwwqa.duke-energy.com') {
        childDomain = 'https://olsqa.duke-energy.com';
    } else {
        childDomain = 'https://ols.duke-energy.com';
    }
    // PROMO BANNERS
    $('#promo-banner').wrapInner('<div id="promo-banner-panes"></div>');
    if($('#promo-banner-panes > div').length > 1){
        var promoTabs = '<ul id="promo-banner-tabs">';
        $('#promo-banner-panes > div').each(function(index){
            promoTabs += '<li><a href="#"';
            if (index == 0) promoTabs += ' class="active"';
            promoTabs += '>' + (index+1) + '</a></li>';
        });
        promoTabs += '</ul>';
        $('#promo-banner').prepend(promoTabs);
        $("#promo-banner-tabs").tabs("#promo-banner-panes > div", {effect: 'fade', fadeOutSpeed: "slow", rotate: true}).slideshow({ autoplay: true, interval: 6000 });
    }
    /*****************************************************************************************************
    Load a video inside a lightbox - https://gist.github.com/de-ux/6010476
    *****************************************************************************************************/
     //Onclick launch lightbox or youtube player
    $('.lightbox-video-trigger').click(function(e) {
      e.preventDefault();
      var $this = $(this),
      videoTitle = $this.attr('data-title');
      videoPlayerLaunch($this, true);
      eventTracking({
            category: 'Lightbox',
            action: 'Open',
            value: videoTitle || document.title
        });
    });
    //On page load, if url has showVideo parameter then call lightbox launch function to open video on the page matching id
    window.onload = function(){
        if (window.location.href.indexOf("showVideo=") > -1) {
            videoPlayerLaunch();
            var videoId = getParameterByName('showVideo'),
            videoTitle = $('#' + videoId).attr('data-title');
            eventTracking({
                category: 'Lightbox',
                action: 'Auto Open',
                value: videoTitle || document.title
            });
        }
    }
    //Call youtube player or regular lightbox player based on video url
    var videoPlayerLaunch = function (element, clickevent) {
         if (window.location.href.indexOf("showVideo=") > -1 && clickevent != true) {
            var videoId = getParameterByName('showVideo'),
                video = $("#" + videoId).attr('href'),
                width = 640,
                height = 368,
                playlist = [{ 'file' : video}];
            if (video == undefined) {
                var width = element.attr('data-width') || 640,
                    height = element.attr('data-height') || 368,
                    video = element.attr('href'),
                    playlist = [{ 'file' : video}];
            }
         } else {
            var width = element.attr('data-width') || 640,
                    height = element.attr('data-height') || 368,
                    video = element.attr('href'),
                    playlist = [{ 'file' : video}];
         }
         if (video != undefined) {
            $.getScript(assetPath + "/js/plugins/jwplayer/jwplayer.js", function(data) {
                    // Pause any other players on the page
                    // Makes sure activePlayers.getState exists before
                    // trying to run it to prevent an error in IE
                    if (aVideoIsPlaying) {
                        activePlayers = jwplayer();
                        if (activePlayers && activePlayers.getState() === 'PLAYING') {
                            activePlayers.pause();
                        }
                    }
                openLightbox({
                  source: 'html',
                  content: '<div id="lightbox-video"> </div>',
                  width: width,
                  height: parseInt(height) + 15
                });
                if(video.indexOf("youtu") > -1) {
                    if ($('#youtubeIframeApi').length) {
                        youTubevideoIdGlobal = youtube_parser(video);
                        onYouTubeIframeAPIReady();
                    } else {
                        var tag = document.createElement('script');
                            tag.src = "https://www.youtube.com/iframe_api";
                            tag.id = "youtubeIframeApi";
                            var firstScriptTag = document.getElementsByTagName('script')[0];
                            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                            youTubevideoIdGlobal = youtube_parser(video);
                    }
                } else {
                    jw.create('lightbox-video', {
                      width: width,
                      height: height,
                      stretching: 'fill',
                      controlbar: 'over',
                      autostart: 'true',
                      skin: '',
                      playlist : playlist
                    });
                }
            });
         }
    }
    function youtube_parser(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    }

    /** @namespace trackLinks */
    var trackLinks = {
        /**
         * @type {array}
         * @desc An array of jquery filters
        */
        hrefExceptions: [
            '[href*="duke-energy.com"]',
            '[href*="progress-energy.com"]',
        ].join(''),
        /**
         * @type {array}
         * @desc An array of jquery filters
        */
        classExceptions: [
            '.exit-duke-trigger',
            '.lightbox-video-trigger',
            '.webcast a',
            '.iframe-lightbox'
        ].join(', '),
        /**
         * On Click
         * @event
         *
         * @callback
         * @param {object}
         * @desc When a link is clicked
        */
        onClick: function(href) {
            /** Track event */
            eventTracking({
                category: 'External Link',
                action: 'Clicked',
                value: $(this).attr('href')
            });
            /** Open in new window */
            window.open(href);
        }
    };
    /** @event watch class */
    $('.exit-duke-trigger').extDuke();
    /** Remove target add exit-duke-trigger class */
    /** @event webcast#trigger */
    $('.webcast a').removeAttr('target');
    $('.webcast a').extDuke({
        width: 600,
        height: 550,
        beforeContent: $('.scrollbox').prev().text(),
        content: $('.scrollbox').html(),
        afterContent: $('.scrollbox').next().text(),
        linkName: 'Continue to Webcast',
        target: true
    });
    /** @event Event Tracker for External Links */
    $('a[href^="http"]:not(' + trackLinks.hrefExceptions + ')').not( $(trackLinks.classExceptions) ).click(function(e) { e.preventDefault(); trackLinks.onClick($(this).attr('href')); });
    $('#promo-banner-panes > div > a').click(function(e){
        var $this = $(this);
        eventTracking({
            category: 'Home Promo',
            action: 'Click',
            value: $this.find('img').attr('alt')
        });
    });
    $('#promos > div > a').click(function(e) {
        var $this = $(this);
        eventTracking({
            category: 'Home Promo - Small',
            action: 'Click',
            value: $this.find('h4').text()
        });
    });
    $('.track-internal-ad').click(function(e){
        var $this = $(this);
        eventTracking({
            category: 'Internal Ad',
            action: 'Click',
            value: $this.find('img').attr('alt')
        });
    });
    $('.tabs > li').click(function(){
        var $this = $(this);
        eventTracking({
            category: 'Tabs',
            action: 'Click',
            value: $this.find('> a').text()
        });
    });

    if( $('.video-embed').length > 0 ) {
      $('.video-embed').videoEmbed();
    }
    if( $('.video-playlist').length > 0 ) {
        $('.video-playlist').embedPlaylist();
    }
    // initialize matchbox plugin
    $('.columns-balanced').matchbox();
    // initialize contractor search
    $('.contractor-search-init').click(function(e) {
        e.preventDefault();
        var query = $(this).attr('href');
        openLightbox({
            width: 850,
            height: 740,
            source: 'iframe',
            content: '/_assets/apps/contractor-search/includes/contractors.asp?' + query
        });
    });
});
function openLightbox(options) {
    var settings = {
        height: 580,
        width: 700,
        content: '#',
        wrapClass: '',
        maskClass: '',
        source: 'iframe',
        onClose: function() {
          return true;
        }
    };
    if (typeof options == 'object'){
        $.extend(settings, options);
    } else {
        settings.content = options;
    }
    var embeddedVideo = $('.video-embed');
    if ( embeddedVideo.length > 0 ) {
      $.each(embeddedVideo, function() {
        var videoID = $(this).find('object').attr('id');
        jwplayer(videoID).pause(true);
        if (!$('html').hasClass('ie')) {
          $(this).css({ 'visibility' : 'hidden' });
        }
      });
    }
    $('body').append('<div id="overlay"><div class="close">X</div><div id="overlay-content"></div></div><div id="overlay-mask"></div>');
    $('#overlay')
        .addClass(settings.wrapClass)
        .css({
            'width': parseInt(settings.width + 10) + 'px',
            'margin-left' : '-' + (settings.width/2) + 'px'
        });
    $('#overlay-mask').css({
        'height' : $(document).height()
    });
    if (settings.source == 'iframe'){
        var hostname = encodeURIComponent(location.protocol + '//' + location.hostname);
        dukeCookie.create('parentDomain', hostname);
        $('#overlay-content').html('<iframe id="overlay-frame" src="' + settings.content + '" frameborder="0" width="100%" height="' + settings.height +'">');
    } else {
        $('#overlay-content').html(settings.content);
        $('#overlay-content').height(settings.height);
        $('#overlay-content').width(settings.width);
        $('#overlay').height(settings.height);
    }
    $('#overlay-mask, #overlay').show();
    $('#overlay-content').addClass(settings.maskClass);
    $('html, body').animate({ scrollTop: 0 }, '500');
    $('#overlay .close').click(function(){
      settings.onClose();
    });
}
function closeLightbox(options) {
    var settings = {
        URL: null,
        showConfirm: true,
        msg: 'Are you sure you want to cancel the request? Any information you entered will be lost.'
    };
    if (typeof options == 'object'){
        $.extend(settings, options);
    } else {
        settings.URL = options;
    }
    dukeCookie.erase('parentDomain');
    var embeddedVideo = $('.video-embed');
    if ( embeddedVideo.length > 0 ) {
        if ($('html').hasClass('ie')) {
            embeddedVideo
                .find('object')
                    .remove();
            embeddedVideo
                .videoEmbed({ autostart: false })
        }
        else {
            embeddedVideo.css({ 'visibility': 'visible' });
        }
    }
    if (confirmPage || !settings.showConfirm) {
        $('#overlay-mask, #overlay').fadeOut('fast').remove();
    }
    else if (confirm(settings.msg)) {
        $('#overlay-mask, #overlay').fadeOut('fast').remove();
        return true;
    }
    if (settings.URL) {
        var sep = (loc.indexOf('?')) ? '&' : '?';
        loc = loc.split('#')[0] + sep + 'reload=true' + loc.split('#')[1];
        window.location = loc;
    }
    if(cachedSwitcherHref){ // restore old href if they cancel the state selector
        $("#change-state a.switcher").attr('href', cachedSwitcherHref);
    }
}
function forgotLinksAJAX(targetUrl){
    closeLightbox({showConfirm:false});
    //console.log('targetUrl: ', targetUrl);
    var target = targetUrl,
        iframeTitle = 'Forgot?';
    if (targetUrl.indexOf('Mode=11') >= 0) {
        target = '/forgot-password';
        iframeTitle = 'Forgot Password';
    } else if (targetUrl.indexOf('Mode=12') >= 0) {
        target = '/forgot-username';
        iframeTitle = 'Forgot Username';
    }
    //console.log('target: ', target);
    openLightbox({
        content: '/accounts/choose-state/?target=' + target + '&title=' + iframeTitle,
        width: 500,
        height: 425
    });
}
function openJurisdictionSearch() {
    $('body').append('<div id="choose-state-overlay" class="overlay hide"><div class="overlay-inner"><iframe id="choose-state-iframe" src="" frameborder="0" width="100%" height="425"></iframe></div></div>');
    $('#choose-state-iframe').attr('src', '/accounts/choose-state/?target=' + target + '&title=' + iframeTitle).overlay({ // setup button action. it will fire our overlay
        target: '#choose-state-overlay',
        fixed: false,
        mask: {
            color: '#000',
            loadSpeed: 200,
            opacity: 0.75
        },
        // when the overlay is opened, load our player
        onBeforeLoad: function() {
            //console.log('Overlay open!');
        },
        // when the overlay is closed, do something
        onClose: function() {
            //console.log('Overlay closed!');
            $('#choose-state-iframe').attr('src','');
        }
    });
}
function closeRegistration(loc) {
    $('#form-page-confirmation').hide();
    $('#form-page-closing').show();
    window.location = loc;
}
//Still needed?
function checkHeight() {
    if ($('#sidebar').height() > $('#content').height()) {
        $('#content').css('min-height', $('#sidebar').height() + 20 + 'px');
        if (IE6) $('#content').height($('#sidebar').height() + 20 + 'px');
    }
    var subnavH = $('#subnav').height();
    if (subnavH > $('#content').height()) {
        $('#content').css('min-height', subnavH);
        if (IE6) $('#content').css('height', subnavH);
    }
}
function tagSignin() {
    $('.registration #signin_btn').click(function(){
        pt('/register/signin/');
    });
    $('.registration #continue').click(function(){pt('/register/continue/')});
    $('.homePage #signin_btn').click(function(){
        pt('/home/signin/');
    });
}
dukeCookie = {
    create:function(name,value,days) {
        //alert('setting cookie:' + name + ': ' + value + ', for: ' + days);
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            var expires = '; expires=' + date.toGMTString();
        }
        else var expires = '';
        document.cookie = name + '=' + value + expires + '; path=/; domain=duke-energy.com';
    },
    read:function(name) {
        var nameEQ = name + '=';
        //alert(document.cookie);
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    },
    erase:function(name) {
        dukeCookie.create(name,'',-1);
    },
    validate:function(name, value) {
        for(var i = 0; i < customer[name].length; i++) {
            if(value == customer[name][i]) return true;
        }
        return false;
    }
}
//Is this all needed?
customer = {
    init: function() {
        customer.state = dukeCookie.read('state');
        customer.segment = dukeCookie.read('segment') ? dukeCookie.read('segment') : 'res';
        if (customer.segment == 'company') {
            customer.full = customer.segment;
        } else {
            customer.full = (customer.state) ? customer.state + customer.segment : customer.segment;
        }
    },
    state: '', segment: '', full: '',
    fullState: function() {
        switch(customer.state) {
            case "in":
                return "Indiana";
            case "ky":
                return "Kentucky";
            case "nc":
                return "North Carolina";
            case "oh":
                return "Ohio";
            case "sc":
                return "South Carolina";
            default:
                return "";
        }
    },
    fullSegment: function() {
        switch(customer.segment) {
            case "res":
                return "Residential";
            case "bus":
                return "Business";
            case "lbus":
                return "Large Business";
            default:
                return "Company";
        }
    },
    abbrevState: function(fullState) {
        switch(fullState) {
            case "indiana":
                return "in";
            case "kentucky":
                return "ky";
            case "north-carolina":
                return "nc";
            case "ohio":
                return "oh";
            case "south-carolina":
                return "sc";
        }
    }
}
customer.init();
//Will this still be used?
lightbox = {
    init:function() {
        //alert($('.trigger').length);
        $('.trigger').click(function(){lightbox.show(this);return false});
        $('.cancelLightbox').click(function(){lightbox.cancel();return false});
    },
    show:function(a) {
        //$("#fader").show("slow", function(){$("#lightbox").show();return false});
        lightbox.extra(a);
        $("#fader").css('height', $("body").height());
        $("#lightbox").css('left', ($("html").width() - $("#lightbox").width()) /2);
        $("#fader").slideDown('slow');
        $("#lightbox").show();
        return false;
    },
    cancel:function() {
        $("#fader").hide();
        $("#lightbox").hide();
        $('#lightbox div').hide();
        return false;
    },
    extra:function(){
        //placeholder for page specific functions
        return true;
    }
}
links = {
    tag: function() {
        $('#content a').each(function(){
            if (!links.checkType(this.href)) {
                //check external links list for items to tag
                for (var i = 0; i < links.external.length; i++) {
                    if (this.href.indexOf(links.external[i]) > -1) {
                        this.onclick = function() {pt(location.protocol + '//' + location.host + '/speedpay')};
                    }
                }
            }
            else if (this.href.indexOf('streams') > -1) {
                var href = this.href.replace('streams.duke-energy.com',location.host).replace('mms','http');
                this.onclick = function() {pt(href)};
            }
            else {
                this.onclick = function() {pt(this.href)};
            }
        });
    },
    fileTypes: ['wmv','pdf','doc','swf','xls','ppt', 'wma', 'ra', 'mp3', 'asx'],
    checkType: function(href) {
        var type = links.getType(href);
        var result = false;
        for (var i = 0; i < links.fileTypes.length; i++) {
            if (type == links.fileTypes[i]) {
                result = true;
                break;
            }
        }
        return result;
    },
    getType: function(href) {
        return href.substring(href.length - 3);
    },
    external: ['speedpay.com']
}
function pt(targ) {
    targ = targ.replace('http://' + location.host,'');
    _gaq.push([ '_trackPageview', targ ]);
    targ = 'lc=http://' + location.host + targ;
    O0000OO = 'http://extwebstats.duke-energy.com/ntpagetag.gif';
    O00O00O = 'https://extwebstats.duke-energy.com/ntpagetag.gif';
    ntptEventTag(targ);
}
// Change color of lighting poles in products and services page
function changeColor (link) {
    var image = $("#pole"),
        imageClass = image.attr("class"),
        color = link.innerHTML;
    image.attr("src","/images/content/" + color + "-pole-style-" + imageClass + ".jpg");
}

var swapLogo = function(image) {
    $('#logo')
        .find('img')
        .attr('src', image)
        .hide()
        .height(65)
    setTimeout(function(){$('#logo img').show()}, 100);
}
/*****************************************************************************************************
    Get Parameters by Name from a Query String in the Address Bar of Browser
******************************************************************************************************/
/*function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}*/
function getParameterByName(name,string) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)",
        regex = new RegExp(regexS),
        urlString = string ? string : window.location.search,
        results = regex.exec(urlString);
    if (results == null) {
        return false;
    } else {
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
}
/*****************************************************************************************************
    Cookie functions...yummy
******************************************************************************************************/
function setCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value+expires + "; path=/; domain=.duke-energy.com";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function deleteCookie(name) {
    setCookie(name,"",-1);
}
/*******************************************************************************************************************
********************************************************************************************************************
    SMARTSAVERS
********************************************************************************************************************
********************************************************************************************************************/
$(function () {
    if($('#smartsaver').length > 0) {
        $('div#page').addClass('smartsaver-page')
    }
    $('.ss-collapsible').ssCollapsible();
    $('.ss-collapsible-more').ssCollapsibleMore();
    $('.ss-phase-toggle').ssCollapsiblePhase();
    $('.ss-overlay').hide();
    $('.ss-overlay-trigger[rel]').overlay({
        mask: {
            color: '#000',
            loadSpeed: 200,
            opacity: 0.75
        },
        fixed: false,
        onBeforeLoad: function(){
            $this = this;
            $('body').append($('' + $this.getTrigger().attr('rel') + ''));
        },
        onClose: function() {
            if($('.application-demo-video-player').length != 0) {
                jwplayer('application-demo-video-player').stop();
            }
        }
     });
    $('.ss-overlay a.close').addClass('button').append('<span>Close Window</span>');
    $('ul.ss-tabs').tabs('div#ss-tabs > div');
    $('#ss-video').ssVideoPlayer();
});
$.fn.ssCollapsible = function() {
    $(this).find('.ss-more').hide();
    $(this).find('.ss-expand').wrapInner('<a href="#"></a>').click(function(){
        $(this).toggleClass('ss-open').next('div.ss-more').slideToggle('fast');
        return false;
    });
    if($('.ss-collapsible').length > 0) {
        $('.ss-collapsible').prepend('<p><a class="ss-showall" href="#">Show All</a></p>');
        $('.ss-showall').toggle(function(){
            $(this).text('Hide All');
            $(this).parent().nextAll('.ss-expand').addClass('ss-open');
            $(this).parent().nextAll('.ss-more').slideDown('fast');
            return false;
        }, function(){
            $(this).text('Show All');
            $(this).parent().nextAll('.ss-expand').removeClass('ss-open');
            $(this).parent().nextAll('.ss-more').slideUp('fast');
            return false;
        });
    }
};
$.fn.ssCollapsibleMore = function() {
    $(this).find('.ss-more').hide().prev('p').append(' <a class="ss-expand ss-collapse" href="#">More &raquo;</a>');
    $(this).find('.ss-expand').click(function(){
        //alert( $(this).parent().next('div').is(":visible") );
        var isvisible = $(this).parent().next('div').is(":visible")
        $(this).toggleClass('ss-open').html( (isvisible ? 'More &raquo;' : 'Less &raquo;') ).parent().next('div').slideToggle('fast');
        return false;
    });
    if($('.ss-collapsible-more').length > 0){
        $('.ss-collapsible-more').prepend('<p><a class="ss-showall" href="#">Show All</a></p>');
        $('.ss-showall').toggle(function(){
            $(this).text('Hide All');
            $(this).parent().nextAll('p').find('.ss-expand').html('Less &raquo;').addClass('ss-open');
            $(this).parent().nextAll('.ss-more').slideDown('fast');
            return false;
        }, function(){
            $(this).text('Show All');
            $(this).parent().nextAll('p').find('.ss-expand').html('More &raquo;').removeClass('ss-open');
            $(this).parent().nextAll('.ss-more').slideUp('fast');
            return false;
        });
    }
};
$.fn.ssCollapsiblePhase = function() {
    $(this).find('div.ss-phase-details').hide();
    $(this).find('div.ss-phase-hdr').addClass('ss-closed').click(function(){
        $(this).toggleClass('ss-opened').next('div.ss-phase-details').slideToggle(500);
        return false;
    });
    $('.ss-phase-open-onload').find('.ss-phase-hdr').addClass('ss-opened').end().find('div.ss-phase-details').show();
};
$.fn.ssVideoPlayer = function(){
    $(this).each(function(){
        var pageUrl = 'http://' + window.location.hostname + window.location.pathname;
        $('#smartsaver').prepend('<script src="/includes/jwplayer/jwplayer.js"></script>');
        jwplayer('ss-video-player').setup({
            'flashplayer': '/includes/jwplayer/player.swf',
            'id': 'playerID',
            'width': '600',
            'height': '360',
            'autostart': false,
            'playlistfile': '/includes/xml/ss-video-playlist.xml',
            'controlbar': 'bottom',
            'skin': '/includes/jwplayer/skins/stormtrooper/stormtrooper.zip',
            'screencolor': 'ffffff',
            'plugins':
            {
                'googlytics-1': {},
                'sharing-2': {
                    'link': pageUrl
                }
            }
        });
        $.get('/includes/xml/ss-video-playlist.xml', function(data){
            window.myPlaylistData = data;
            var count = 0;
            var html = '<ul>';
            $(data).find("item").each(function(){
                html = html + '<li><a class="ss-video-item';
                if(count == 0) {
                    html = html + ' ss-current';
                };
                html = html + '" rel="' + count + '" href="#"><span>' + $(this).find("title").text() + '</span></a></li>';
                count++;
            });
            html = html + '</ul>';
            $("#ss-video-thumbs").append(html);
            $('#ss-video-title').html( $(myPlaylistData).find('item').find('title').eq(0).text() );
            $('#ss-video-description').html( $(myPlaylistData).find('item').find('description').eq(0).text() );
        });
        $('a.ss-video-item').live('click', function(){
            ssSwitchVideo( $(this).attr('rel') );
            $('.ss-video-item').removeClass('ss-current');
            $(this).addClass('ss-current');
            return false;
        });
    });
};
function ssSwitchVideo(id) {
    jwplayer().playlistItem(id);
    $('#ss-video-title').html( jwplayer().getPlaylistItem(id)['title'] );
    $('#ss-video-description').html( jwplayer().getPlaylistItem(id)['description'] );
}
function forceState(state) {
    if(state) {
        var fullState = {
            'oh' : 'Ohio',
            'in' : 'Indiana',
            'ky' : 'Kentucky',
            'nc' : 'North Carolina',
            'fl' : 'Florida'
        }
        setCookie('state',state);
        $('#change-state a.switcher').html(fullState[state]+'<i></i>');
    }
    else {
        console.log('please pass a state along');
    }
}
/*******************************************************************************************************************
********************************************************************************************************************
    //SMARTSAVERS
********************************************************************************************************************
******************************************
/*****************************************************************************************************
    * JavaScript Debug - v0.4 - 6/22/2010
    * http://benalman.com/projects/javascript-debug-console-log/
    *
    * Copyright (c) 2010 "Cowboy" Ben Alman
    * Dual licensed under the MIT and GPL licenses.
    * http://benalman.com/about/license/
    *
    * With lots of help from Paul Irish!
    * http://paulirish.com/
******************************************************************************************************/
window.debug=(function(){var i=this,b=Array.prototype.slice,d=i.console,h={},f,g,m=9,c=["error","warn","info","debug","log"],l="assert clear count dir dirxml exception group groupCollapsed groupEnd profile profileEnd table time timeEnd trace".split(" "),j=l.length,a=[];while(--j>=0){(function(n){h[n]=function(){m!==0&&d&&d[n]&&d[n].apply(d,arguments)}})(l[j])}j=c.length;while(--j>=0){(function(n,o){h[o]=function(){var q=b.call(arguments),p=[o].concat(q);a.push(p);e(p);if(!d||!k(n)){return}d.firebug?d[o].apply(i,q):d[o]?d[o](q):d.log(q)}})(j,c[j])}function e(n){if(f&&(g||!d||!d.log)){f.apply(i,n)}}h.setLevel=function(n){m=typeof n==="number"?n:9};function k(n){return m>0?m>n:c.length+m<=n}h.setCallback=function(){var o=b.call(arguments),n=a.length,p=n;f=o.shift()||null;g=typeof o[0]==="boolean"?o.shift():false;p-=typeof o[0]==="number"?o.shift():n;while(p<n){e(a[p++])}};return h})();
/*******************************************************************************************************************
********************************************************************************************************************
    //Javascript Plugins
********************************************************************************************************************
********************************************************************************************************************

/*****************************************************************************************************
    * WordCount Plugin - v0.0.24 - 6/20/2013 - jquery.charCount.js
******************************************************************************************************/
;(function($,window,document,undefined){var pluginName="charCount",defaults={maxlength:500};function Plugin(element,options){this.element=$(element);this.options=$.extend({},defaults,options);this._defaults=defaults;this._name=pluginName;this.init()}Plugin.prototype={init:function(){this.addCount(this.element,this.options)},addCount:function(el,options){var maxlength=(el.attr('maxlength'==undefined||el.attr('maxlength')==-1))?this.options.maxlength:el.attr('maxlength'),_FIXLENGTH=(el.attr('maxlength'==undefined||el.attr('maxlength')==-1))?this.options.maxlength:el.attr('maxlength'),count='<p class="textareaCont">Characters left: <span>'+maxlength+'</span></p>';el.after(count);el.attr('maxlength',maxlength);el.keyup(function(){var textAreaLength=$(this).val().length,wordsLeft=maxlength-textAreaLength;$(this).next().find('span').text(wordsLeft);if(textAreaLength>_FIXLENGTH){var para=$(this).val().substring(0,(_FIXLENGTH-1));$(this).val(para)}else if(wordsLeft<10){$(this).next().find('span').css('color','#FF0000')}else{$(this).next().find('span').css('color','#595959')}})}};$.fn[pluginName]=function(options){return this.each(function(){if(!$.data(this,"plugin_"+pluginName)){$.data(this,"plugin_"+pluginName,new Plugin(this,options))}})}})(jQuery,window,document);
/*****************************************************************************************************
    * EventTracking Plugin - v1.0.06 - 8/30/2013 - jquery.event-tracking.js
******************************************************************************************************/
;(function($,window,document,undefined){window.eventTracking=function(config){if(config.accounts instanceof Array){$.each(config.accounts,function(i,storage){if(storage[0].indexOf('_setAccount')>-1){_gaq.push(['_setAccount',storage[1]],['_trackEvent',config.category,config.action,config.value])}})}else{_gaq.push(['_trackEvent',config.category,config.action,config.value])}console.groupCollapsed('Tracking Event: ',config.category);console.info('Category: ',config.category);console.info('Action: ',config.action);console.info('Value: ',config.value);console.groupEnd();return false}})(jQuery,window,document);
/*****************************************************************************************************
    * Accordion Plugin - v1.0.0
******************************************************************************************************/
;(function(e,t,n,r){function u(t,n){s=this;s.element=e(t);s.options=e.extend({},o,n);s._defaults=o;s._name=i;s.init()}var i="accordion",s,o={onLoad:null,openClass:"collapsible-open",triggerClass:".collapsible-trigger",paneClass:".collapsible-pane",speed:"fast",addShowAll:true,trackEvent:true};u.prototype={init:function(){s.element.find(s.options.paneClass).hide();var t=location.hash.match(/C(\d+)R(\d+)/);if(t){var n=e(".collapsible-accordion").eq(t[1]).find(s.options.paneClass).eq(t[2]);n.slideDown(s.options.speed).toggleClass(s.options.openClass)}if(s.options.onLoad){s.options.onLoad()}if(s.options.addShowAll){if(!s.element.hasClass("collapsible-accordion")){s.element.prepend('<div class="collapsible-all">Show All</div>')}}s.element.find(s.options.triggerClass).click(function(e){s.toggle(this)});s.element.find(".collapsible-all").click(function(e){s.toggleAll(this)})},toggle:function(t){var n=e(t),r=n.parents(".collapsible").eq(0);if(r.hasClass("collapsible-accordion")){var i="C"+e(".collapsible-accordion").index(r)+"R"+e(s.options.triggerClass,r).index(n);setTimeout(function(){location.hash=i},100);n.next(s.options.paneClass).siblings(s.options.paneClass).slideUp(s.options.speed).prev().removeClass(s.options.openClass)}n.next(s.options.paneClass).slideToggle(s.options.speed);n.toggleClass(s.options.openClass);s.trackEvent(n)},toggleAll:function(t){var n=e(t),r=n.siblings(s.options.paneClass).add(n.siblings().find(s.options.paneClass)),i=n.siblings(s.options.triggerClass).add(n.siblings().find(s.options.triggerClass));if(n.text()==="Show All"){r.slideDown(s.options.speed).addClass(s.options.openClass);i.addClass(s.options.openClass);n.text("Hide All")}else{r.slideUp(s.options.speed).removeClass(s.options.openClass);i.removeClass(s.options.openClass);n.text("Show All")}s.trackEvent(n)},trackEvent:function(e){var t=e.hasClass("collapsible-open")||e.text()==="Hide All"?"Show":"Hide";eventTracking({category:"Collapsible",action:t,value:e.text()})}};e.fn[i]=function(t){return this.each(function(){if(!e.data(this,"plugin_"+i)){e.data(this,"plugin_"+i,new u(this,t))}})}})(jQuery,window,document);
/*****************************************************************************************************
    * Lightbox Trigger Plugin - v1 - 9/18/2013 - jquery.lightboxTrigger.js
******************************************************************************************************/
(function(e,t,n,r){function o(t,n){this.element=t;if(n.href){n=e.extend(n,{source:"iframe",content:n.href})}this.options=e.extend({},s,n);this._defaults=s;this._name=i;this.init()}var i="lightboxTrigger",s={width:500,height:350,href:null,content:null,source:"iframe",trigger:"onclick",urlParam:null,urlKey:"openLightbox"};o.prototype={init:function(){$plugin=this;e(this.element).each(function(e){$plugin._processOptions(this,$plugin.options)})},_processOptions:function(n,r){if(r.trigger=="onload"){$plugin=this;if(t.location.href.indexOf(r.urlKey+"="+r.urlParam)>-1){e(function(){$plugin._processContent(r);$plugin._openLightbox(r)})}}else if(r.trigger=="onclick"){$plugin=this;e(n).click(function(e){e.preventDefault();var t=this;$plugin._processContent(r,t);$plugin._openLightbox(r)})}},_processContent:function(e,t){var n={};if(n.toString.call(e.content)==="[object Function]"){e.content=e.content(t)}},_openLightbox:function(e){openLightbox({content:e.content,source:e.source,width:e.width,height:e.height})}};e.fn[i]=function(t){return this.each(function(){if(!e.data(this,"plugin_"+i)){e.data(this,"plugin_"+i,new o(this,t))}})}})(jQuery,window,document)
/*****************************************************************************************************
    * Mobile Redirect Plugin - v1.0.0 - 9/20/13 /includes/JS/deux/mobileredirect.js
******************************************************************************************************/
;(function(e,t,n,r){function o(t,n){this.element=t;this.settings=e.extend({},s,n);this._defaults=s;this._name=i;this.init()}var i="mobileRedirect",s={url:"/"};o.prototype={init:function(){if(getCookie("view")==="desktop"){}else if(getCookie("view")==="mobile"){location.href=this.settings.url+"/"}else{var e=confirm("This page has been optimized for mobile devices. Would you like to view the mobile-friendly version?");if(e===true){location.href=this.settings.url+"/"}else{setCookie("view","desktop")}}}};e.fn[i]=function(t){return this.each(function(){if(!e.data(this,"plugin_"+i)){e.data(this,"plugin_"+i,new o(this,t))}})}})(jQuery,window,document)
/*****************************************************************************************************
    * Exit Duke Plugin - v1.0.3 - 3/12/14 - updated jquery.extDukeplugin.js
******************************************************************************************************/
;(function(e,t,n){function o(t,n){this.element=t;this.$el=e(t);this.opts=e.extend({},i,n);this._defaults=i;this._name=r;this.link=this.$el.attr("href");this.init()}var r="extDuke";var i={width:450,height:375,title:"Please Read",beforeContent:"You are now leaving the duke-energy.com website. Privacy and security policies may differ from those practiced by Duke Energy.",content:null,afterContent:"By clicking the link below, you acknowlege, the above terms and conditions.",linkName:"Continue",target:false};var s=['<div class="exit-duke">',"<h2></h2>",'<p class="beforeContent"></p>','<div class="exit-content"></div>','<p class="afterContent"></p>',"<p>",'<a class="exit-link" href="#">Continue</a> | <a class="close-exit-duke" href="#">Cancel</a>',"</p>","</div>"].join("");o.prototype={init:function(){var e=this;this.$el.click(function(t){e.openModal(e.opts.content);e.closeModal();e.addLink();t.preventDefault()})},openModal:function(e){openLightbox({source:"html",width:this.opts.width,height:this.opts.content?this.opts.height:200,content:s});this.addSetup();if(e!=null)this.addContent(e);if(e==null)this.removeContent()},addLink:function(){var n=this;e(".exit-link").attr("href",this.link);e(".exit-link").click(function(e){eventTracking({category:"External Link",action:"Clicked",value:n.link});setTimeout(function(){t.location=n.link},1e3);e.preventDefault()})},addSetup:function(){e(".exit-duke").find("h2").append(this.opts.title);e(".beforeContent").text(this.opts.beforeContent);e(".afterContent").text(this.opts.afterContent);e(".exit-link").text(this.opts.linkName);if(this.opts.target)e(".exit-link").attr("target","_blank")},addContent:function(t){e(".exit-content").append(t)},removeContent:function(){e(".exit-content").remove()},closeModal:function(){e(".close-exit-duke, .close").click(function(e){t.location.reload();e.preventDefault()})}};e.fn[r]=function(t){return this.each(function(){if(!e.data(this,"plugin_"+r)){e.data(this,"plugin_"+r,new o(this,t))}})}})(jQuery,window)
/*****************************************************************************************************
    * Sniffer.js Plugin - v1.0.0 - 12/09/13 /includes/JS/sniffer.js
******************************************************************************************************/
!function(r,e,n,i){function o(){return this}o.prototype={log:function(){console.log(this.all())},pretty:function(){var r=["This browser name is "+this.browserName()+".","The Version number is "+this.browserVersion()+".","First Party Cookies are "+(navigator.cookieEnabled?"Enabled":"Disabled")+"."].join("\n");console.log(r)},all:function(){var r=this;return{browserName:r.browserName(),browserVersion:r.browserVersion(),firstPartyCookie:r.firstParty}},browserName:function(){var e=navigator.userAgent,n=["MSIE","Edge","Trident","OPR","Chrome","Safari","Firefox"],o=[];return r.each(n,function(r,n){return e.indexOf(n)<0||(o.push(n),o.length<1)?i:!1}),o.length>1?"Chrome":o[0]},browserVersion:function(){var r,e,n,i,o=navigator.userAgent;return r="Safari"==this.browserName()?"Version":this.browserName()+"/","MSIE/"==r?(e=o.substring(o.indexOf("MSIE")),n=e.substring(0,e.indexOf(";")).replace("MSIE","")):(e=o.substring(o.indexOf(r)),n=e.substring(e.indexOf("/"))),i="Trident"==this.browserName()?"11":(+n.substring(1,3)).toFixed(0)},firstParty:function(){return navigator.cookieEnabled?!0:!1}},e.sniff=new o}(jQuery,window,document);
/*****************************************************************************************************
    * Tabs.js Plugin - v1.0.0 - 01/30/14 /includes/JS/jquery.dukeTabs.js
******************************************************************************************************/
;(function(e,t,n,r){function o(t,n){this.el=e(t);this.settings=e.extend({},s,n);this._defaults=s;this._name=i;this.init()}var i="dukeTabs",s={triggerSelector:".tabs-nav",paneSelector:".tabs-content-pane",activeClass:"current"};o.prototype={init:function(){var t=this.el;var n=this.settings;t.find(n.paneSelector+":gt(0)").hide();t.find(n.triggerSelector+" a:first").addClass(n.activeClass);t.find(n.triggerSelector+" a").click(function(r){var i=e(this),s=i.attr("href");t.find(n.triggerSelector+" a").removeClass(n.activeClass);t.find(n.paneSelector).hide();i.addClass(n.activeClass);t.find(s).show();r.preventDefault()})}};e.fn[i]=function(t){return this.each(function(){if(!e.data(this,"plugin_"+i)){e.data(this,"plugin_"+i,new o(this,t))}})}})(jQuery,window,document);
/*****************************************************************************************************
    * Video Embed - v1.0.0 - 01/30/14 /includes/JS/deux/videoembed.js
******************************************************************************************************/
;(function(e,t,n,r){function o(t,n){this.element=t,$el=e(t);element_data={width:$el.attr("data-width"),height:$el.attr("data-height"),stretching:$el.attr("data-stretching"),controlbar:$el.attr("data-controlbar"),videoFormat:$el.attr("data-videoFormat"),autostart:$el.attr("data-autostart"),wmode:$el.attr("data-wmode")};this.settings=e.extend({},s,element_data,n);this._defaults=s;this._name=i;this.init()}var i="videoEmbed",s={width:640,height:368,stretching:"fill",controlbar:"over",videoFormat:"mp4",autostart:false,wmode:"transparent"};o.prototype={init:function(){var t=this;if(typeof jw!=="object"){e.getScript("/includes/js/plugins/jwplayer/jwplayer.js",function(e){t.embed()})}else{t.embed()}},embed:function(){var n;t.aVideoIsPlaying=true;$el=e(this.element);var i=$el.find("img").attr("src");if($el.attr("data-filename")!=r){n=$el.attr("data-filename")}else{fileName=i.replace(/^.*[\\\/]/,"");fileName=fileName.substr(0,fileName.lastIndexOf("."));n="http://streaming.duke-energy.com/"+fileName+"/"+fileName+"."+this.settings.videoFormat}$el.find("img").hide();$el.append('<div id="embed-video-'+n+'"></div>');jw.create("embed-video-"+n,{width:this.settings.width,height:this.settings.height,stretching:this.settings.stretching,controlbar:this.settings.controlbar,autostart:this.settings.autostart,wmode:this.settings.wmode,skin:"",playlist:[{file:n,image:i}]})}};e.fn[i]=function(t){e(this).each(function(){e.data(this,"plugin_"+i,new o(this,t))});return this}})(jQuery,window,document);
/*****************************************************************************************************
 * Video Embed Playlist - v1.0.0 - 06/30/15 includes/deux/embedplaylist.js
 ******************************************************************************************************/
!function(i,t,s,e){function l(t){this.$el=i(t),this.settings={},this.settings.url=this.$el.attr("data-playlist"),this.settings.assetsDir=this.settings.url.replace(/(.+\/)js.+/,"$1"),this.settings.data={},this.settings.noConflict=!1,this._name=n,this.init()}var n="embedPlaylist",d=d||e;l.prototype={init:function(){var t=this;d?t.run():i.getScript("/includes/js/libs/jquery-1.10.2.min.js",function(){i.getScript("/includes/js/libs/jquery.flexslider-2.2.0.min.js",function(){t.settings.noConflict=!0,t.run()})})},run:function(){var t=this;i.getJSON(this.settings.url,function(s){t.settings.data=s.videos,t.$el.after('<div class="video-playlist-section-content">'+t.buildEmbedList()+t.buildThumbList()+"</div>"),i(".video-embed").videoEmbed(),t.trigger()})},buildEmbedList:function(){for(var i=this,t='<div class="video-playlist-video-slider flexslider" id="js-video-playlist-video-slider"><ul class="slides">',s=0,e=i.settings.data.length;e>s;s++)t+='<li><div class="video-embed" data-filename="'+i.settings.data[s].source+'" data-height="412" data-width="740"><img src="'+i.settings.assetsDir+"img/video-"+i.settings.data[s].id+'-large.jpg"></div><div class="video-playlist-video-slider-caption"><h5>'+i.settings.data[s].title+"</h5>"+i.settings.data[s].caption+"</div></li>";return t+="</ul></div>"},buildThumbList:function(){for(var i=this,t='<div class="video-playlist-video-slider-nav flexslider" id="js-video-playlist-video-slider-nav"><ul class="slides">',s=0,e=i.settings.data.length;e>s;s++)t+='<li class="video-playlist-video-icon-small"><img src="'+i.settings.assetsDir+"img/video-"+i.settings.data[s].id+'-thumb.jpg"></li>';return t+="</ul></div>"},trigger:function(){var i=i||jQuery.noConflict(!0);setTimeout(function(){i("#js-video-playlist-video-slider").flexslider({animation:"fade",manualControls:".video-playlist-video-slider-nav li",directionNav:!1,animationLoop:!0,slideshow:!1,sync:"#js-video-playlist-video-slider-nav",smoothHeight:!0,before:function(){i(".video-playlist-video-slider-nav li.video-playlist-video-icon-small").each(function(t){jwplayer(t).stop(),i(".video-playlist-video-caption").removeClass("is-hidden")})}}),i("#js-video-playlist-video-slider-nav").flexslider({animation:"slide",prevText:"&laquo;",nextText:"&raquo;",controlNav:!1,animationLoop:!0,slideshow:!1,itemWidth:121,itemMargin:4,asNavFor:"#js-video-playlist-video-slider"})},1e3)}},i.fn[n]=function(t){return this.each(function(){i.data(this,"plugin_"+n)||i.data(this,"plugin_"+n,new l(this,t))})}}(jQuery,window,document);
/*****************************************************************************************************
    * Matchbox Plugin - v1.0.0 - 04/04/14 /demo/matchbox/mbPlugin.js
******************************************************************************************************/
;(function(e,t,n,r){function o(t,n){this.element=e(t);this.settings=e.extend({},s,n);this._defaults=s;this._name=i;this.init()}var i="matchbox",s={propertyName:"value"};o.prototype={init:function(){var e=this.element.height();this.element.find("div").children().height(e)}};e.fn[i]=function(e){return new o(this,e)}})(jQuery,window,document);
/*****************************************************************************************************
    * Marketing Tag Plugin - v1.0.0 - 08/18/14 includes/jquery.marketingTag.js
******************************************************************************************************/
;(function(a,b,c,d){a.fn.marketingTag=function(b){function f(){var b=Math.random()+"",c=1e13*b,d='<iframe src="http://'+e.floodlightID+".fls.doubleclick.net/activityi;src="+e.floodlightID+";type="+e.floodlightType+";cat="+e.floodlightCat+";ord="+c+'?" width="1" height="1" frameborder="0" style="display:none"></iframe>';a("body").prepend(d)}function g(){var b="https:"==c.location.protocol?"https":"http";a.getScript(b+"://18.xg4ken.com/media/getpx.php?cid="+e.kenshooID,function(){var a=[];a[0]="id="+e.kenshooID,a[1]="type="+e.kenshooType,a[2]="val=0",a[3]="orderId=",a[4]="promoCode=",a[5]="valueCurrency=USD",a[6]="GCID=",a[7]="kw=",a[8]="product=",k_trackevent(a,"18")})}var e={name:"floodlight",click:!1};return b&&a.extend(e,b),"floodlight"!=e.name||e.click||(d==e.floodlightID||d==e.floodlightType||d==e.floodlightCat?console.error("Please set all configuration options for Floodlight Tag (floodlightID, floodlightType, floodlightCat)"):f()),"floodlight"==e.name&&e.click&&(d==e.floodlightID||d==e.floodlightType||d==e.floodlightCat?console.error("Please set all configuration options for Floodlight Tag (floodlightID, floodlightType, floodlightCat)"):this.bind("click",function(){f()})),"kenshoo"!=e.name||e.click||(d==e.kenshooID||d==e.kenshooType?console.error("Please set all configuration options for Kenshoo Tag (kenshooID, kenshooType)"):g()),"kenshoo"==e.name&&e.click&&(d==e.kenshooID||d==e.kenshooType?console.error("Please set all configuration options for Kenshoo Tag (kenshooID, kenshooType)"):this.bind("click",function(){g()})),this}})(jQuery,window,document);
/*****************************************************************************************************
 * Social Bar - v1.0.0 - 06/16/15 includes/deux/socialbar.js
 ******************************************************************************************************/
;function socialbar(e){$(function(){function t(){var e="";for(key in o)o[key]&&key.indexOf("URL")<0&&(e+='<li><a class="social-bar-'+key+'" href="'+o[key+"URL"]+'" target="_blank">'+key+"</a></li>");return e}var n={facebook:!0,twitter:!0,linkedin:!0,youtube:!0,instagram:!1,flickr:!0,facebookURL:"https://www.facebook.com/DukeEnergy",twitterURL:"https://twitter.com/DukeEnergy",linkedinURL:"https://www.linkedin.com/company/duke-energy-corporation",youtubeURL:"https://www.youtube.com/user/DukeEnergyMediaCtr",instagramURL:"https://instagram.com/DukeEnegy",flickrURL:"https://www.flickr.com/photos/DukeEnergy"},o=$.extend({},n,e),r=$("#content"),a='<ul class="social-bar">'+t()+"</ul>";r.append(a)})};
/*****************************************************************************************************
 * Youtube Video Player - 02/1/16
 ******************************************************************************************************/
function onYouTubeIframeAPIReady(){youTubePlayer()}function youTubePlayer(){function e(e){e.target.playVideo()}player=new YT.Player("lightbox-video",{playerVars:{rel:0},height:"368",width:"640",videoId:youTubevideoIdGlobal,events:{onReady:e}})}