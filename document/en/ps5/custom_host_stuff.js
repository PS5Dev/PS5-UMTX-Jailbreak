const LOCALSTORE_WK_EXPLOIT_TYPE_KEY = "wk_exploit_type";
const LOCALSTORE_WK_EXPLOIT_TYPE_VALUE_PSFREE = "PSFree";
const LOCALSTORE_WK_EXPLOIT_TYPE_VALUE_FONTFACE = "FontFace";

const LOCALSTORE_REDIRECTOR_LAST_URL_KEY = "redirector_last_url";

const SESSIONSTORE_RUN_WK_EXPLOIT_ON_LOAD_KEY = "run_wk_exploit_on_load";

let exploitStarted = false;
async function runJailbreak(animate = true) {
    if (exploitStarted) {
        return;
    }
    exploitStarted = true;

    await switchPage("console-view", animate);

    // not setting it in the catch since we want to retry both on a handled error and on a browser crash
    sessionStorage.setItem(SESSIONSTORE_RUN_WK_EXPLOIT_ON_LOAD_KEY, "true");

    let wk_exploit_type = localStorage.getItem(LOCALSTORE_WK_EXPLOIT_TYPE_KEY);
    try {
        if (!animate) {
            // hack but waiting a bit seems to help
            // this only gets hit when auto-running on page load
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        if (wk_exploit_type == LOCALSTORE_WK_EXPLOIT_TYPE_VALUE_PSFREE) {
            debug_log("[+] running psfree for userland exploit...");
            await run_psfree();
        } else if (wk_exploit_type == LOCALSTORE_WK_EXPLOIT_TYPE_VALUE_FONTFACE) {
            debug_log("[+] running fontface for userland exploit...");
            await run_fontface();
        }
    } catch (error) {
        debug_log("[!] Webkit exploit failed: " + error);
        debug_log("[+] Retrying in 2 seconds...");

        await new Promise((resolve) => setTimeout(resolve, 2000));
        window.location.reload();
        return; // this is necessary
    }

    sessionStorage.removeItem(SESSIONSTORE_RUN_WK_EXPLOIT_ON_LOAD_KEY);
    run_hax();
}

async function switchPage(id, animate = true) {
    const parentElement = document.getElementById('main-content');
    const targetElement = document.getElementById(id);
    if (!targetElement || targetElement.parentElement !== parentElement) {
        throw new Error('Invalid target element');
    }

    const oldSelectedElement = parentElement.querySelector('.selected');

    if (oldSelectedElement) {
        if (animate) {
            let oldSelectedElementTransitionEnd = new Promise((resolve) => {
                oldSelectedElement.addEventListener("transitionend", function handler(event) {
                    // we get back transitionend for children too but we don't want that
                    if (event.target === oldSelectedElement) {
                        oldSelectedElement.removeEventListener("transitionend", handler);
                        resolve();
                    }
                });
            });
            oldSelectedElement.classList.remove('selected');
            await oldSelectedElementTransitionEnd;
        } else {
            // override transition with none for instant switch
            oldSelectedElement.style.setProperty('transition', 'none', 'important');
            oldSelectedElement.offsetHeight;
            oldSelectedElement.classList.remove('selected');
            oldSelectedElement.offsetHeight;
            oldSelectedElement.style.removeProperty('transition');
        }
    }

    if (animate) {
        let targetElementTransitionEnd = new Promise((resolve) => {
            targetElement.addEventListener("transitionend", function handler(event) {
                // we get back transitionend for children too but we don't want that
                if (event.target === targetElement) {
                    targetElement.removeEventListener("transitionend", handler);
                    resolve();
                }
            });
        });
        targetElement.classList.add('selected');
        await targetElementTransitionEnd;
    } else {
        // override transition with none for instant switch
        targetElement.style.setProperty('transition', 'none', 'important');
        targetElement.offsetHeight;
        targetElement.classList.add('selected');
        targetElement.offsetHeight;
        targetElement.style.removeProperty('transition');
    }
}


function registerAppCacheEventHandlers() {
    var appCache = window.applicationCache;

    let toast;

    function createOrUpdateAppCacheToast(message, timeout = -1) {
        if (!toast) {
            toast = showToast(message, timeout);
        } else {
            updateToastMessage(toast, message);
        }

        if (timeout > 0) {
            setTimeout(() => {
                removeToast(toast);
                toast = null;
            }, timeout);
        }
    }

    if (document.documentElement.hasAttribute("manifest")) {
        if (!navigator.onLine) {
            createOrUpdateAppCacheToast('Offline.', 2000);
        } else {
            // this is redundant
            createOrUpdateAppCacheToast("Checking for updates...");
        }        
    }

    appCache.addEventListener('cached', function (e) {
        createOrUpdateAppCacheToast('Finished caching site.', 1500);
    }, false);

    appCache.addEventListener('checking', function (e) {
        createOrUpdateAppCacheToast('Checking for updates...');
    }, false);

    appCache.addEventListener('downloading', function (e) {
        createOrUpdateAppCacheToast('Downloading new cache...');
    }, false);

    appCache.addEventListener('error', function (e) {
        // only show error toast if we're online
        if (navigator.onLine) {
            createOrUpdateAppCacheToast('Error while caching site.', 5000);
        } else {
            createOrUpdateAppCacheToast('Offline.', 2000);
        }
    }, false);

    appCache.addEventListener('noupdate', function (e) {
        createOrUpdateAppCacheToast('Cache is up-to-date.', 1500);
    }, false);

    appCache.addEventListener('obsolete', function (e) {
        createOrUpdateAppCacheToast('Site is obsolete.');
    }, false);

    appCache.addEventListener('progress', function (e) {
        let percentage = Math.round((e.loaded / e.total) * 100);

        createOrUpdateAppCacheToast('Downloading new cache... ' + percentage + '%');

        // the last item takes an unreasonably long time to complete (with a big update)
        // ig its doing some extra stuff before the last event is fired
        // so show a new message for it
        if (e.loaded + 1 == e.total) {
            createOrUpdateAppCacheToast("Processing... This may take a minute.");
        }
    }, false);

    appCache.addEventListener('updateready', function (e) {
        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
            createOrUpdateAppCacheToast('The site was updated. Refresh to switch to updated version');
        }
    }, false);
}

function registerL2ButtonHandler() {
    document.addEventListener("keydown", async (event) => {
        if (event.keyCode === 118) {
            const lastRedirectorValue = localStorage.getItem(LOCALSTORE_REDIRECTOR_LAST_URL_KEY) || "http://";
            const redirectorValue = prompt("Enter url", lastRedirectorValue);

            // pressing cancel works as expected, but pressing the back button unfortunately is the same as pressing ok
            // so verify that the value is different
            if (redirectorValue && redirectorValue !== lastRedirectorValue && redirectorValue !== "http://") {
                localStorage.setItem(LOCALSTORE_REDIRECTOR_LAST_URL_KEY, redirectorValue);
                window.location.href = redirectorValue;
            }
        }
    });
}

function showToast(message, timeout = 2000) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // Trigger reflow to enable animation
    toast.offsetHeight;

    toast.classList.add('show');

    if (timeout > 0) {
        setTimeout(() => {
            removeToast(toast);
        }, timeout);
    }

    return toast;
}

function updateToastMessage(toast, message) {
    if (!toast) {
        return;
    }
    toast.textContent = message;
}

async function removeToast(toast) {
    if (!toast) {
        return;
    }
    toast.classList.add('hide');
    toast.addEventListener('transitionend', () => {
        toast.remove();
    });
}
