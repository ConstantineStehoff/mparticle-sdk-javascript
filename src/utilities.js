class Utilities {
	constructor() {
		this.pluses = /\+/g;
	}

	createXHR(cb, logDebug) {
        var xhr;

        try {
            xhr = new window.XMLHttpRequest();
        }
        catch (e) {
            logDebug('Error creating XMLHttpRequest object.');
        }

        if (xhr && cb && "withCredentials" in xhr) {
            xhr.onreadystatechange = cb;
        }
        else if (typeof window.XDomainRequest != 'undefined') {
            logDebug('Creating XDomainRequest object');

            try {
                xhr = new window.XDomainRequest();
                xhr.onload = cb;
            }
            catch (e) {
                logDebug('Error creating XDomainRequest object');
            }
        }

        return xhr;
    }

    createServiceUrl(serviceScheme, secureServiceUrl, serviceUrl, devToken) {
        return serviceScheme + ((window.location.protocol === 'https:') 
        	? secureServiceUrl : serviceUrl) + devToken;
    }

    inArray(items, name) {
        let result = items.findIndex(name);
        return result !== -1;
    }

    converted(s) {
        if (s.indexOf('"') === 0) {
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        return s;
    }

    decoded(s) {

        return decodeURIComponent(s.replace(this.pluses, ' '));
    }

    logDebug(msg) {
        if (mParticle.isDebug && window.console && window.console.log) {
            window.console.log(msg);
        }
    }

    isUIWebView(navigator) {
        return /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
    }

    isWebViewEmbedded(navigator) {
        return (window.external && typeof (window.external.Notify) === 'unknown')
            || window.mParticleAndroid
            || this.isUIWebView(navigator)
            || window.mParticle.isIOS;
    }

}

export let utilities = new Utilities();