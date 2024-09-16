function get_appcache_state() {
    var appCache = window.applicationCache;

    switch (appCache.status) {
        case appCache.UNCACHED: // UNCACHED == 0
            return 'UNCACHED';
            break;
        case appCache.IDLE: // IDLE == 1
            return 'IDLE';
            break;
        case appCache.CHECKING: // CHECKING == 2
            return 'CHECKING';
            break;
        case appCache.DOWNLOADING: // DOWNLOADING == 3
            return 'DOWNLOADING';
            break;
        case appCache.UPDATEREADY:  // UPDATEREADY == 4
            return 'UPDATEREADY';
            break;
        case appCache.OBSOLETE: // OBSOLETE == 5
            return 'OBSOLETE';
            break;
        default:
            return 'UKNOWN CACHE STATUS';
            break;
    };

}

function add_cache_event_toasts() {
    // showToast('Appcache state: ' + get_appcache_state());
    var appCache = window.applicationCache;
    
    if (!navigator.onLine) {
        showToast('You are offline.');
    }

    appCache.addEventListener('cached', function (e) {
        showToast('Finished caching site.');
    }, false);

    // appCache.addEventListener('checking', function (e) {
    //     showToast('Checking for updates.');
    // }, false);

    appCache.addEventListener('downloading', function (e) {
        showToast('Downloading new cache.');
    }, false);

    appCache.addEventListener('error', function (e) {
        // only show error toast if we're online
        if (navigator.onLine) {
            showToast('Error while caching site.', 5000);
        }
    }, false);

    appCache.addEventListener('noupdate', function (e) {
        showToast('Cache is up-to-date.');
    }, false);

    appCache.addEventListener('obsolete', function (e) {
        showToast('Site is obsolete.');
    }, false);

    // appCache.addEventListener('progress', function (e) {
    //     showToast('Caching site.');
    // }, false);

    appCache.addEventListener('updateready', function (e) {
        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
            showToast('The site was updated. Refresh to switch to updated version',8000);
        }
    }, false);




 }