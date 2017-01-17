class Cookie{

	constructor() {
        this.config = {};
        this.value = {};
	}

	getCookie() {
        let cookies = window.document.cookie.split('; ');
        let result = this.config.CookieName ? undefined : {};

        logDebug(InformationMessages.CookieSearch);

        for (let i = 0; i < cookies.length; i++) {
            let parts = cookies[i].split('=');
            let name = decoded(parts.shift());
            let cookie = decoded(parts.join('='));

            if (this.config.CookieName && this.config.CookieName === name) {
                result = converted(cookie);
                break;
            }

            if (!this.config.CookieName) {
                result[name] = converted(cookie);
            }
        }

        if (result) {
            logDebug(InformationMessages.CookieFound);

            try {
                let obj = JSON.parse(result);

                // Longer names are for backwards compatibility
                sessionId = obj.sid || obj.SessionId || sessionId;
                isEnabled = (typeof obj.ie != 'undefined') ? obj.ie : obj.IsEnabled;
                sessionAttributes = obj.sa || obj.SessionAttributes || sessionAttributes;
                userAttributes = obj.ua || obj.UserAttributes || userAttributes;
                userIdentities = obj.ui || obj.UserIdentities || userIdentities;
                serverSettings = obj.ss || obj.ServerSettings || serverSettings;
                devToken = obj.dt || obj.DeveloperToken || devToken;

                clientId = obj.cgid || generateUniqueId();

                if (isEnabled !== false || isEnabled !== true) {
                    isEnabled = true;
                }

                if (obj.les) {
                    lastEventSent = new Date(obj.les);
                }
                else if (obj.LastEventSent) {
                    lastEventSent = new Date(obj.LastEventSent);
                }
            }
            catch (e) {
                logDebug(ErrorMessages.CookieParseError);
            }
        }
    }

    setCookie(config, value) {
        this.config = config;
        this.value = value;
        let date = new Date();
        let expires = new Date(date.getTime() +
                (this.config.CookieExpiration * 24 * 60 * 60 * 1000)).toGMTString();
        let domain = this.config.CookieDomain ? ';domain=' + this.config.CookieDomain : '';

        logDebug(InformationMessages.CookieSet);

        window.document.cookie =
            encodeURIComponent(this.config.CookieName) + '=' + encodeURIComponent(JSON.stringify(this.value)) +
            ';expires=' + expires +
            ';path=/' + domain;
    }
}

export let cookie = new Cookie();