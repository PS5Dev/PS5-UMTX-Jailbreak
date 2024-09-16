async function runJailbreak() {
    let l2_redirector = document.getElementById("l2-redirect");
    l2_redirector.style.opacity = "0";

    // Hide jailbreak button and show console
    document.getElementById("run-jb-parent").style.opacity = "0";
    document.getElementById("console-parent").style.opacity = "1";

    setTimeout(async () => {
        let wk_exploit_type = localStorage.getItem("wk_exploit_type");
        if (wk_exploit_type == "psfree") {
            debug_log("[+] running psfree for userland exploit...");
            await run_psfree();
        } else if (wk_exploit_type == "fontface") {
            await run_fontface();
        }
    }, 100);
}

function onload_setup() {

    if (document.documentElement.hasAttribute("manifest")) {
        add_cache_event_toasts();
    }

    create_redirector_buttons();

    document.documentElement.style.overflowX = 'hidden';
    let redirector = document.getElementById("redirector-view");
    let center_view = document.getElementById("center-view");

    let menu_overlay = document.getElementById("menu-overlay");
    let menu = document.getElementById("menu-bar-wrapper");

    if (localStorage.getItem("wk_exploit_type") == null) {
        localStorage.setItem("wk_exploit_type", "psfree");
    }

    create_redirector_buttons();
}

function redirectorGo() {
    let redirector_input = document.getElementById("redirector-input");
    let redirector_input_value = redirector_input.value;
    if (redirector_input_value == "" || redirector_input_value == "http://") {
        showToast("Enter a valid URL.");
        return;
    }

    let redirector_history_store_raw = localStorage.getItem("redirector_history");

    if (redirector_history_store_raw == null) {
        localStorage.setItem("redirector_history", JSON.stringify([redirector_input_value]));
    }
    else {
        let redirector_history_store = JSON.parse(redirector_history_store_raw);

        redirector_history_store.unshift(redirector_input_value);

        localStorage.setItem("redirector_history", JSON.stringify(redirector_history_store));
    }


    window.location = redirector_input_value;
}

const default_pinned_websites = [
    "https://es7in1.site/ps5",
    "https://google.com"
]

const dummy_history = [
    "https://es7in1.site/ps5",
    "https://google.com",
    "https://ps5jb.pages.dev",
    "https://github.com",
    "https://duckduckgo.com",
    "https://youtube.com",
    "https://twitter.com",
    "https://reddit.com",
    "https://facebook.com",
    "https://instagram.com",
    "https://amazon.com",
    "https://wikipedia.org",
    "https://netflix.com"
]

function create_redirector_buttons() {
    let redirector_pinned_store_raw = localStorage.getItem("redirector_pinned");

    if (redirector_pinned_store_raw == null) { // || redirector_pinned_store_raw == "[]"
        localStorage.setItem("redirector_pinned", JSON.stringify(default_pinned_websites));
        redirector_pinned_store_raw = localStorage.getItem("redirector_pinned");
    }

    let redirector_pinned_store = JSON.parse(redirector_pinned_store_raw);

    const redirector_pinned = document.getElementById("redirector-pinned");

    redirector_pinned.innerHTML = "";

    let pinned_text = document.createElement("p");
    pinned_text.innerHTML = "Pinned";
    pinned_text.style.textAlign = "center";

    redirector_pinned.appendChild(pinned_text);


    for (let i = 0; i < redirector_pinned_store.length; i++) {
        let div = document.createElement("div");
        div.style.display = "flex";

        let a1 = document.createElement("a");
        a1.className = "btn small-btn";
        a1.tabIndex = "0";
        a1.innerHTML = redirector_pinned_store[i];
        a1.onclick = () => {
            window.location.replace(redirector_pinned_store[i]);
        };

        div.appendChild(a1);

        let a2 = document.createElement("a");
        a2.className = "btn icon-btn";
        a2.tabIndex = "0";
        a2.innerHTML = '<svg width="24px" height="24px" fill="#ddd"><use href="#delete-icon" /></svg>';
        a2.onclick = () => {
            let pinned_raw = localStorage.getItem("redirector_pinned");
            let pinned = JSON.parse(pinned_raw);
            // pinned = pinned.filter(item => item !== redirector_pinned_store[i]);
            pinned.splice(i, 1);
            localStorage.setItem("redirector_pinned", JSON.stringify(pinned));
            create_redirector_buttons();
        };

        div.appendChild(a2);


        redirector_pinned.appendChild(div);
    }

    let redirector_history_store_raw = localStorage.getItem("redirector_history");

    if (redirector_history_store_raw == null) {
        localStorage.setItem("redirector_history", JSON.stringify([]));
        redirector_history_store_raw = localStorage.getItem("redirector_history");
    }


    let redirector_history_store = JSON.parse(redirector_history_store_raw);

    // history stuff
    let redirector_history = document.getElementById("redirector-history");

    redirector_history.innerHTML = "";

    let history_text = document.createElement("p");
    history_text.innerHTML = "History";
    history_text.style.textAlign = "center";

    redirector_history.appendChild(history_text);


    for (let i = 0; i < redirector_history_store.length; i++) {
        let div = document.createElement("div");
        div.style.display = "flex";

        let a1 = document.createElement("a");
        a1.className = "btn small-btn";
        a1.tabIndex = "0";
        a1.innerHTML = redirector_history_store[i];
        a1.onclick = () => {
            window.location.replace(redirector_history_store[i]);
        };
        div.appendChild(a1);

        let a2 = document.createElement("a");
        a2.className = "btn icon-btn";
        a2.tabIndex = "0";
        a2.innerHTML = "&#9733;"
        a2.onclick = () => {
            let pinned_raw = localStorage.getItem("redirector_pinned");
            let pinned = JSON.parse(pinned_raw);
            pinned.unshift(redirector_history_store[i]);
            localStorage.setItem("redirector_pinned", JSON.stringify(pinned));
            create_redirector_buttons();
        };
        div.appendChild(a2);

        let a3 = document.createElement("a");
        a3.className = "btn icon-btn";
        a3.tabIndex = "0";
        a3.innerHTML = '<svg width="24px" height="24px" fill="#ddd"><use href="#delete-icon" /></svg>';
        a3.onclick = () => {
            let history_raw = localStorage.getItem("redirector_history");
            let history = JSON.parse(history_raw);
            // history = history.filter(item => item !== redirector_history_store[i]);
            history.splice(i, 1);
            localStorage.setItem("redirector_history", JSON.stringify(history));
            create_redirector_buttons();
        };
        div.appendChild(a3);

        redirector_history.appendChild(div);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showToast(message, timeout = 2000) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // Trigger reflow and enable animation
    toast.offsetHeight;

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.add('hide');
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }, timeout);
}
