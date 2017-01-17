class Utilities {
	constructor() {
		
	}

	createXHR(cb) {
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
        var i = 0;

        if (Array.prototype.indexOf) {
            return items.indexOf(name, 0) >= 0;
        }
        else {
            for (var n = items.length; i < n; i++) {
                if (i in items && items[i] === name) {
                    return true;
                }
            }
        }
    }

    isUIWebView() {
        return /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
    }

    isWebViewEmbedded() {
        if ((window.external && typeof (window.external.Notify) === 'unknown')
            || window.mParticleAndroid
            || isUIWebView()
            || window.mParticle.isIOS) {
            return true;
        }

        return false;
    }

    createXHR(cb) {
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

    isUIWebView() {
        return /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
    }

}

export let utilities = new Utilities();