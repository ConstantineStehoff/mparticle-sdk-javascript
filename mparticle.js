(function () {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Utilities = function () {
    function Utilities() {
        classCallCheck(this, Utilities);

        this.pluses = /\+/g;
    }

    createClass(Utilities, [{
        key: 'createXHR',
        value: function createXHR(cb, logDebug) {
            var xhr;

            try {
                xhr = new window.XMLHttpRequest();
            } catch (e) {
                logDebug('Error creating XMLHttpRequest object.');
            }

            if (xhr && cb && "withCredentials" in xhr) {
                xhr.onreadystatechange = cb;
            } else if (typeof window.XDomainRequest != 'undefined') {
                logDebug('Creating XDomainRequest object');

                try {
                    xhr = new window.XDomainRequest();
                    xhr.onload = cb;
                } catch (e) {
                    logDebug('Error creating XDomainRequest object');
                }
            }

            return xhr;
        }
    }, {
        key: 'createServiceUrl',
        value: function createServiceUrl(serviceScheme, secureServiceUrl, serviceUrl, devToken) {
            return serviceScheme + (window.location.protocol === 'https:' ? secureServiceUrl : serviceUrl) + devToken;
        }
    }, {
        key: 'inArray',
        value: function inArray(items, name) {
            var result = items.findIndex(name);
            return result !== -1;
        }
    }, {
        key: 'converted',
        value: function converted(s) {
            if (s.indexOf('"') === 0) {
                s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            }

            return s;
        }
    }, {
        key: 'decoded',
        value: function decoded(s) {

            return decodeURIComponent(s.replace(this.pluses, ' '));
        }
    }, {
        key: 'logDebug',
        value: function logDebug(msg) {
            if (mParticle.isDebug && window.console && window.console.log) {
                window.console.log(msg);
            }
        }
    }, {
        key: 'isUIWebView',
        value: function isUIWebView(navigator) {
            return (/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent)
            );
        }
    }, {
        key: 'isWebViewEmbedded',
        value: function isWebViewEmbedded(navigator) {
            return window.external && typeof window.external.Notify === 'unknown' || window.mParticleAndroid || this.isUIWebView(navigator) || window.mParticle.isIOS;
        }
    }]);
    return Utilities;
}();

var utilities = new Utilities();

var Messages = function () {
	function Messages() {
		classCallCheck(this, Messages);

		this.ErrorMessages = {
			NoToken: 'A token must be specified.',
			EventNameInvalidType: 'Event name must be a valid string value.',
			EventDataInvalidType: 'Event data must be a valid object hash.',
			LoggingDisabled: 'Event logging is currently disabled.',
			CookieParseError: 'Could not parse cookie',
			EventEmpty: 'Event object is null or undefined, cancelling send',
			NoEventType: 'Event type must be specified.',
			TransactionIdRequired: 'Transaction ID is required',
			TransactionRequired: 'A transaction attributes object is required',
			BadAttribute: 'Attribute value cannot be object or array'
		};

		this.InformationMessages = {
			CookieSearch: 'Searching for cookie',
			CookieFound: 'Cookie found, parsing values',
			CookieSet: 'Setting cookie',
			SendBegin: 'Starting to send event',
			SendWindowsPhone: 'Sending event to Windows Phone container',
			SendIOS: 'Calling iOS path: ',
			SendAndroid: 'Calling Android JS interface method: ',
			SendHttp: 'Sending event to mParticle HTTP service',
			StartingNewSession: 'Starting new Session',
			StartingLogEvent: 'Starting to log event',
			StartingLogOptOut: 'Starting to log user opt in/out',
			StartingEndSession: 'Starting to end session',
			StartingInitialization: 'Starting to initialize',
			StartingLogCommerceEvent: 'Starting to log commerce event',
			LoadingConfig: 'Loading configuration options',
			AbandonLogEvent: 'Cannot log event, logging disabled or developer token not set',
			AbandonStartSession: 'Cannot start session, logging disabled or developer token not set',
			AbandonEndSession: 'Cannot end session, logging disabled or developer token not set',
			NoSessionToEnd: 'Cannot end session, no active session found'
		};
	}

	createClass(Messages, [{
		key: 'getErrorMessages',
		value: function getErrorMessages(key) {

			return this.ErrorMessages[key];
		}
	}, {
		key: 'getInformationMessages',
		value: function getInformationMessages(key) {
			return this.InformationMessages[key];
			// Object.keys(this.InformationMessages).map(key => this.InformationMessages[key]);
		}
	}]);
	return Messages;
}();

var messages = new Messages();

var Cookie = function () {
    function Cookie() {
        classCallCheck(this, Cookie);

        this.config = {};
        this.value = {};
    }

    createClass(Cookie, [{
        key: 'getCookie',
        value: function getCookie() {
            var cookies = window.document.cookie.split('; ');
            var result = this.config.CookieName ? undefined : {};

            utilities.logDebug(messages.getInformationMessages('CookieSearch'));

            for (var i = 0; i < cookies.length; i++) {
                var parts = cookies[i].split('=');'';
                var name = utilities.decoded(parts.shift());
                var _cookie = utilities.decoded(parts.join('='));

                if (this.config.CookieName && this.config.CookieName === name) {
                    result = utilities.converted(_cookie);
                    break;
                }

                if (!this.config.CookieName) {
                    result[name] = utilities.converted(_cookie);
                }
            }

            if (result) {
                utilities.logDebug(messages.getInformationMessages('CookieFound'));

                try {
                    var obj = JSON.parse(result);

                    // Longer names are for backwards compatibility
                    sessionId = obj.sid || obj.SessionId || sessionId;
                    isEnabled = typeof obj.ie != 'undefined' ? obj.ie : obj.IsEnabled;
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
                    } else if (obj.LastEventSent) {
                        lastEventSent = new Date(obj.LastEventSent);
                    }
                } catch (e) {
                    utilities.logDebug(messages.getErrorMessages('CookieParseError'));
                }
            }
        }
    }, {
        key: 'setCookie',
        value: function setCookie(config, value) {
            this.config = config;
            this.value = value;
            var date = new Date();
            var expires = new Date(date.getTime() + this.config.CookieExpiration * 24 * 60 * 60 * 1000).toGMTString();
            var domain = this.config.CookieDomain ? ';domain=' + this.config.CookieDomain : '';

            utilities.logDebug(messages.getInformationMessages('CookieSet'));

            window.document.cookie = encodeURIComponent(this.config.CookieName) + '=' + encodeURIComponent(JSON.stringify(this.value)) + ';expires=' + expires + ';path=/' + domain;
        }
    }]);
    return Cookie;
}();

var cookie = new Cookie();

//
//  Copyright 2015 mParticle, Inc.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//
//  Uses portions of code from jQuery
//  jQuery v1.10.2 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license

var serviceUrl = "jssdk.mparticle.com/v1/JS/";
var secureServiceUrl = "jssdks.mparticle.com/v1/JS/";
var serviceScheme = window.location.protocol + '//';
var sdkVersion = '1.8.7';
var isEnabled$1 = true;
var sessionAttributes$1 = {};
var userAttributes$1 = {};
var userIdentities$1 = [];
var forwarderConstructors = [];
var forwarders = [];
var sessionId$1;
var clientId$1;
var devToken$1;
var serverSettings$1 = null;
var lastEventSent$1;
var currentPosition;
var isTracking = false;
var watchPositionId;
var readyQueue = [];
var isInitialized = false;
var productsBags = {};
var cartProducts = [];
var currencyCode = null;
var appVersion = null;
var appName = null;
var customFlags = null;
var METHOD_NAME = '$MethodName';
var LOG_LTV = 'LogLTVIncrease';
var RESERVED_KEY_LTV = '$Amount';

// forEach polyfill
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
// 
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback, thisArg) {
        var T, k;

        if (this == null) {
            throw new TypeError(' this is null or not defined');
        }

        var O = Object(this);
        var len = O.length >>> 0;

        if (typeof callback !== "function") {
            throw new TypeError(callback + ' is not a function');
        }

        if (arguments.length > 1) {
            T = thisArg;
        }

        k = 0;

        while (k < len) {
            var kValue;
            if (k in O) {
                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
}

// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {
    Array.prototype.map = function (callback, thisArg) {
        var T, A, k;

        if (this === null) {
            throw new TypeError(" this is null or not defined");
        }

        var O = Object(this);
        var len = O.length >>> 0;

        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }

        if (arguments.length > 1) {
            T = thisArg;
        }

        A = new Array(len);

        k = 0;

        while (k < len) {

            var kValue, mappedValue;

            if (k in O) {

                kValue = O[k];

                mappedValue = callback.call(T, kValue, k, O);

                A[k] = mappedValue;
            }

            k++;
        }

        return A;
    };
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

// Standalone version of jQuery.extend, from https://github.com/dansdom/extend
function extend() {
    var options,
        name,
        src,
        copy,
        copyIsArray,
        clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false,

    // helper which replicates the jquery internal functions
    objectHelper = {
        hasOwn: Object.prototype.hasOwnProperty,
        class2type: {},
        type: function type(obj) {
            return obj == null ? String(obj) : objectHelper.class2type[Object.prototype.toString.call(obj)] || "object";
        },
        isPlainObject: function isPlainObject(obj) {
            if (!obj || objectHelper.type(obj) !== "object" || obj.nodeType || objectHelper.isWindow(obj)) {
                return false;
            }

            try {
                if (obj.constructor && !objectHelper.hasOwn.call(obj, "constructor") && !objectHelper.hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                return false;
            }

            var key;
            for (key in obj) {}

            return key === undefined || objectHelper.hasOwn.call(obj, key);
        },
        isArray: Array.isArray || function (obj) {
            return objectHelper.type(obj) === "array";
        },
        isFunction: function isFunction(obj) {
            return objectHelper.type(obj) === "function";
        },
        isWindow: function isWindow(obj) {
            return obj != null && obj == obj.window;
        }
    }; // end of objectHelper

    // Handle a deep copy situation
    if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== "object" && !objectHelper.isFunction(target)) {
        target = {};
    }

    // If no second argument is used then this can extend an object that is using this method
    if (length === i) {
        target = this;
        --i;
    }

    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if (deep && copy && (objectHelper.isPlainObject(copy) || (copyIsArray = objectHelper.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && objectHelper.isArray(src) ? src : [];
                    } else {
                        clone = src && objectHelper.isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[name] = extend(deep, clone, copy);

                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
}

function tryNativeSdk(path, value) {
    if (window.mParticleAndroid) {
        utilities.logDebug(messages.getInformationMessages('SendAndroid') + path);
        window.mParticleAndroid[path](value);

        return true;
    } else if (window.mParticle.isIOS || utilities.isUIWebView(navigator)) {
        utilities.logDebug(messages.getInformationMessages('SendIOS') + path);
        var iframe = document.createElement("IFRAME");
        iframe.setAttribute("src", 'mp-sdk://' + path + '/' + value);
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;

        return true;
    }

    return false;
}

function send(event) {
    var xhr,
        xhrCallback = function xhrCallback() {
        if (xhr.readyState === 4) {
            utilities.logDebug('Received ' + xhr.statusText + ' from server');

            parseResponse(xhr.responseText);
        }
    };

    utilities.logDebug(messages.getInformationMessages('SendBegin'));

    if (!event) {
        utilities.logDebug(messages.getErrorMessages('EventEmpty'));
        return;
    }

    if (!tryNativeSdk(NativeSdkPaths.LogEvent, JSON.stringify(event))) {
        utilities.logDebug(messages.getInformationMessages('SendHttp'));

        xhr = utilities.createXHR(xhrCallback);

        if (xhr) {
            try {
                xhr.open('post', utilities.createServiceUrl(serviceScheme, secureServiceUrl, serviceUrl, devToken$1) + '/Events');
                xhr.send(JSON.stringify(convertEventToDTO(event)));

                sendEventToForwarders(event);
            } catch (e) {
                utilities.logDebug('Error sending event to mParticle servers.');
            }
        }
    }
}

function sendForwardingStats(forwarder, event) {
    var xhr, forwardingStat;

    if (forwarder && forwarder.isVisible) {
        xhr = utilities.createXHR();
        forwardingStat = JSON.stringify({
            mid: forwarder.id,
            n: event.EventName,
            attrs: event.EventAttributes,
            sdk: event.SDKVersion,
            dt: event.EventDataType,
            et: event.EventCategory,
            dbg: event.Debug,
            ct: event.Timestamp,
            eec: event.ExpandedEventCount
        });

        if (xhr) {
            try {
                xhr.open('post', utilities.createServiceUrl(serviceScheme, secureServiceUrl, serviceUrl, devToken$1) + '/Forwarding');
                xhr.send(forwardingStat);
            } catch (e) {
                utilities.logDebug('Error sending forwarding stats to mParticle servers.');
            }
        }
    }
}

function applyToForwarders(functionName, functionArgs) {
    if (forwarders) {
        for (var i = 0; i < forwarders.length; i++) {
            var forwarderFunction = forwarders[i][functionName];

            if (forwarderFunction) {
                try {
                    var result = forwarders[i][functionName](forwarders[i], functionArgs);

                    if (result) {
                        utilities.logDebug(result);
                    }
                } catch (e) {
                    utilities.logDebug(e);
                }
            }
        }
    }
}

function sendEventToForwarders(event) {
    var clonedEvent,
        hashedName,
        hashedType,
        filterUserAttributes = function filterUserAttributes(event, filterList) {
        var hash;

        if (event.UserAttributes) {
            for (var attrName in event.UserAttributes) {
                if (event.UserAttributes.hasOwnProperty(attrName)) {
                    hash = generateHash(attrName);

                    if (utilities.inArray(filterList, hash)) {
                        delete event.UserAttributes[attrName];
                    }
                }
            }
        }
    },
        filterUserIdentities = function filterUserIdentities(event, filterList) {
        if (event.UserIdentities && event.UserIdentities.length > 0) {
            for (var i = 0; i < event.UserIdentities.length; i++) {
                if (utilities.inArray(filterList, event.UserIdentities[i].Type)) {
                    event.UserIdentities.splice(i, 1);

                    if (i > 0) {
                        i--;
                    }
                }
            }
        }
    },
        filterAttributes = function filterAttributes(event, filterList) {
        var hash;

        if (!filterList) {
            return;
        }

        for (var attrName in event.EventAttributes) {
            if (event.EventAttributes.hasOwnProperty(attrName)) {
                hash = generateHash(event.EventCategory + event.EventName + attrName);

                if (utilities.inArray(filterList, hash)) {
                    delete event.EventAttributes[attrName];
                }
            }
        }
    },
        inFilteredList = function inFilteredList(filterList, hash) {
        if (filterList && filterList.length > 0) {
            if (utilities.inArray(filterList, hash)) {
                return true;
            }
        }

        return false;
    },
        forwardingRuleMessageTypes = [MessageType.PageEvent, MessageType.PageView, MessageType.Commerce];

    if (!utilities.isWebViewEmbedded(navigator) && forwarders) {
        hashedName = generateHash(event.EventCategory + event.EventName);
        hashedType = generateHash(event.EventCategory);

        for (var i = 0; i < forwarders.length; i++) {
            if (event.Debug === true && forwarders[i].isSandbox === false && forwarders[i].hasSandbox === true) {
                continue;
            } else if (event.Debug === false && forwarders[i].isSandbox === true) {
                continue;
            }

            // Check attribute forwarding rule. This rule allows users to only forward an event if a 
            // specific attribute exists and has a specific value. Alternatively, they can specify 
            // that an event not be forwarded if the specified attribute name and value exists.
            // The two cases are controlled by the "includeOnMatch" boolean value.
            // Supported message types for attribute forwarding rules are defined in the forwardingRuleMessageTypes array

            if (forwardingRuleMessageTypes.indexOf(event.EventDataType) > -1 && forwarders[i].filteringEventAttributeValue && forwarders[i].filteringEventAttributeValue.eventAttributeName && forwarders[i].filteringEventAttributeValue.eventAttributeValue) {

                var foundProp = null;

                // Attempt to find the attribute in the collection of event attributes
                if (event.EventAttributes) {
                    for (var prop in event.EventAttributes) {
                        var hashedName = generateHash(prop);

                        if (hashedName == forwarders[i].filteringEventAttributeValue.eventAttributeName) {
                            foundProp = {
                                name: hashedName,
                                value: generateHash(event.EventAttributes[prop])
                            };
                        }

                        break;
                    }
                }

                var isMatch = foundProp != null && foundProp.value == forwarders[i].filteringEventAttributeValue.eventAttributeValue;

                var shouldInclude = forwarders[i].filteringEventAttributeValue.includeOnMatch === true ? isMatch : !isMatch;

                if (!shouldInclude) {
                    continue;
                }
            }

            // Clone the event object, as we could be sending different attributes to each forwarder
            clonedEvent = {};
            clonedEvent = extend(true, clonedEvent, event);

            // Check event filtering rules
            if (event.EventDataType == MessageType.PageEvent && (inFilteredList(forwarders[i].eventNameFilters, hashedName) || inFilteredList(forwarders[i].eventTypeFilters, hashedType))) {
                continue;
            } else if (event.EventDataType == MessageType.Commerce && inFilteredList(forwarders[i].eventTypeFilters, hashedType)) {
                continue;
            } else if (event.EventDataType == MessageType.PageView && inFilteredList(forwarders[i].pageViewFilters, hashedName)) {
                continue;
            }

            // Check attribute filtering rules
            if (clonedEvent.EventAttributes) {
                if (event.EventDataType == MessageType.PageEvent) {
                    filterAttributes(clonedEvent, forwarders[i].attributeFilters);
                } else if (event.EventDataType == MessageType.PageView) {
                    filterAttributes(clonedEvent, forwarders[i].pageViewAttributeFilters);
                }
            }

            // Check user identity filtering rules
            filterUserIdentities(clonedEvent, forwarders[i].userIdentityFilters);

            // Check user attribute filtering rules
            filterUserAttributes(clonedEvent, forwarders[i].userAttributeFilters);

            utilities.logDebug('Sending message to forwarder: ' + forwarders[i].name);
            var result = forwarders[i].process(clonedEvent);

            if (result) {
                utilities.logDebug(result);
            }
        }
    }
}

function initForwarders() {
    if (!utilities.isWebViewEmbedded(navigator) && forwarders) {

        // Some js libraries require that they be loaded first, or last, etc
        forwarders.sort(function (x, y) {
            x.settings.PriorityValue = x.settings.PriorityValue || 0;
            y.settings.PriorityValue = y.settings.PriorityValue || 0;
            return -1 * (x.settings.PriorityValue - y.settings.PriorityValue);
        });

        for (var i = 0; i < forwarders.length; i++) {
            if (forwarders[i].isSandbox === mParticle$1.isSandbox || !forwarders[i].isSandbox && !forwarders[i].hasSandbox) {
                forwarders[i].init(forwarders[i].settings, sendForwardingStats, false, null, userAttributes$1, userIdentities$1, appVersion, appName, customFlags, clientId$1);
            }
        }
    }
}

function parseResponse(responseText) {
    var now = new Date(),
        settings,
        prop,
        fullProp;

    if (!responseText) {
        return;
    }

    try {
        utilities.logDebug('Parsing response from server');

        settings = JSON.parse(responseText);

        if (settings && settings.Store) {
            utilities.logDebug('Parsed store from response, updating local settings');

            if (serverSettings$1 === null) {
                serverSettings$1 = {};
            }

            for (prop in settings.Store) {
                if (!settings.Store.hasOwnProperty(prop)) {
                    continue;
                }

                fullProp = settings.Store[prop];

                if (!fullProp.Value || new Date(fullProp.Expires) < now) {
                    // This setting should be deleted from the local store if it exists

                    if (serverSettings$1.hasOwnProperty(prop)) {
                        delete serverSettings$1[prop];
                    }
                } else {
                    // This is a valid setting

                    serverSettings$1[prop] = fullProp;
                }
            }

            cookie.setCookie(Config, {
                sid: sessionId$1, ie: isEnabled$1, sa: sessionAttributes$1,
                ua: userAttributes$1, ui: userIdentities$1, ss: serverSettings$1, dt: devToken$1,
                les: lastEventSent$1 ? lastEventSent$1.getTime() : null,
                av: appVersion,
                cgid: clientId$1
            });
        }
    } catch (e) {
        utilities.logDebug("Error parsing JSON response from server: " + e.name);
    }
}

function startTracking() {
    if (!isTracking) {
        if ("geolocation" in navigator) {
            watchPositionId = navigator.geolocation.watchPosition(function (position) {
                currentPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
            });

            isTracking = true;
        }
    }
}

function stopTracking() {
    if (isTracking) {
        navigator.geolocation.clearWatch(watchPositionId);
        currentPosition = null;
        isTracking = false;
    }
}

function convertCustomFlags(event, dto) {
    var valueArray = [];
    dto.flags = {};

    for (var prop in event.CustomFlags) {
        valueArray = [];

        if (event.CustomFlags.hasOwnProperty(prop)) {
            if (Array.isArray(event.CustomFlags[prop])) {
                for (var i = 0; i < event.CustomFlags[prop].length; i++) {
                    if (typeof event.CustomFlags[prop][i] === 'number' || typeof event.CustomFlags[prop][i] === 'string' || typeof event.CustomFlags[prop][i] === 'boolean') {
                        valueArray.push(event.CustomFlags[prop][i].toString());
                    }
                }
            } else if (typeof event.CustomFlags[prop] === 'number' || typeof event.CustomFlags[prop] === 'string' || typeof event.CustomFlags[prop] === 'boolean') {
                valueArray.push(event.CustomFlags[prop].toString());
            }

            if (valueArray.length > 0) {
                dto.flags[prop] = valueArray;
            }
        }
    }
}

function convertEventToDTO(event) {
    var dto = {
        n: event.EventName,
        et: event.EventCategory,
        ua: event.UserAttributes,
        sa: event.SessionAttributes,
        ui: event.UserIdentities,
        str: event.Store,
        attrs: event.EventAttributes,
        sdk: event.SDKVersion,
        sid: event.SessionId,
        dt: event.EventDataType,
        dbg: event.Debug,
        ct: event.Timestamp,
        lc: event.Location,
        o: event.OptOut,
        eec: event.ExpandedEventCount,
        av: event.AppVersion,
        cgid: event.ClientGeneratedId
    };

    if (event.CustomFlags) {
        convertCustomFlags(event, dto);
    }

    dto.pb = convertProductBagToDTO();

    if (event.EventDataType == MessageType.Commerce) {
        dto.cu = currencyCode;

        if (event.ShoppingCart) {
            dto.sc = {
                pl: convertProductListToDTO(event.ShoppingCart.ProductList)
            };
        }

        if (event.ProductAction) {
            dto.pd = {
                an: event.ProductAction.ProductActionType,
                cs: event.ProductAction.CheckoutStep,
                co: event.ProductAction.CheckoutOptions,
                pl: convertProductListToDTO(event.ProductAction.ProductList),
                ti: event.ProductAction.TransactionId,
                ta: event.ProductAction.Affiliation,
                tcc: event.ProductAction.CouponCode,
                tr: event.ProductAction.TotalAmount,
                ts: event.ProductAction.ShippingAmount,
                tt: event.ProductAction.TaxAmount
            };
        } else if (event.PromotionAction) {
            dto.pm = {
                an: event.PromotionAction.PromotionActionType,
                pl: event.PromotionAction.PromotionList.map(function (promotion) {
                    return {
                        id: promotion.Id,
                        nm: promotion.Name,
                        cr: promotion.Creative,
                        ps: promotion.Position == null ? 0 : promotion.Position
                    };
                })
            };
        } else if (event.ProductImpressions) {
            dto.pi = event.ProductImpressions.map(function (impression) {
                return {
                    pil: impression.ProductImpressionList,
                    pl: convertProductListToDTO(impression.ProductList)
                };
            });
        }
    } else if (event.EventDataType == MessageType.Profile) {
        dto.pet = event.ProfileMessageType;
    }

    return dto;
}

function convertProductListToDTO(productList) {
    if (!productList) {
        return [];
    }

    return productList.map(function (product) {
        return convertProductToDTO(product);
    });
}

function convertProductToDTO(product) {
    return {
        id: product.Sku,
        nm: product.Name,
        pr: product.Price == null ? 0 : product.Price,
        qt: product.Quantity == null ? 0 : product.Quantity,
        br: product.Brand,
        va: product.Variant,
        ca: product.Category,
        ps: product.Position == null ? 0 : product.Position,
        cc: product.CouponCode,
        tpa: product.TotalAmount == null ? 0 : product.TotalAmount,
        attrs: product.Attributes
    };
}

function convertProductBagToDTO() {
    var convertedBag = {},
        list;

    for (var prop in productsBags) {
        if (!productsBags.hasOwnProperty(prop)) {
            continue;
        }

        list = productsBags[prop].map(function (item) {
            return convertProductToDTO(item);
        });

        if (utilities.isWebViewEmbedded(navigator)) {
            convertedBag[prop] = {
                ProductList: list
            };
        } else {
            convertedBag[prop] = {
                pl: list
            };
        }
    }

    return convertedBag;
}

function convertTransactionAttributesToProductAction(transactionAttributes, productAction) {
    productAction.TransactionId = transactionAttributes.Id;
    productAction.Affiliation = transactionAttributes.Affiliation;
    productAction.CouponCode = transactionAttributes.CouponCode;
    productAction.TotalAmount = transactionAttributes.Revenue;
    productAction.ShippingAmount = transactionAttributes.Shipping;
    productAction.TaxAmount = transactionAttributes.Tax;
}

function createEventObject(messageType, name, data, eventType, customFlags) {
    var optOut = messageType == MessageType.OptOut ? !isEnabled$1 : null;

    if (sessionId$1 || messageType == MessageType.OptOut) {
        lastEventSent$1 = new Date();

        return {
            EventName: name ? name : messageType,
            EventCategory: eventType,
            UserAttributes: userAttributes$1,
            SessionAttributes: sessionAttributes$1,
            UserIdentities: userIdentities$1,
            Store: serverSettings$1,
            EventAttributes: data,
            SDKVersion: sdkVersion,
            SessionId: sessionId$1,
            EventDataType: messageType,
            Debug: mParticle$1.isSandbox,
            Timestamp: lastEventSent$1.getTime(),
            Location: currentPosition,
            OptOut: optOut,
            ProductBags: productsBags,
            ExpandedEventCount: 0,
            CustomFlags: customFlags,
            AppVersion: appVersion,
            ClientGeneratedId: clientId$1
        };
    }

    return null;
}

function getProductActionEventName(productActionType) {
    switch (productActionType) {
        case ProductActionType.AddToCart:
            return 'AddToCart';
        case ProductActionType.AddToWishlist:
            return 'AddToWishlist';
        case ProductActionType.Checkout:
            return 'Checkout';
        case ProductActionType.Click:
            return 'Click';
        case ProductActionType.Purchase:
            return 'Purchase';
        case ProductActionType.Refund:
            return 'Refund';
        case ProductActionType.RemoveFromCart:
            return 'RemoveFromCart';
        case ProductActionType.RemoveFromWishlist:
            return 'RemoveFromWishlist';
        case ProductActionType.ViewDetail:
            return 'ViewDetail';
        case ProductActionType.Unknown:
        default:
            return 'Unknown';
    }
}

function getPromotionActionEventName(promotionActionType) {
    switch (promotionActionType) {
        case PromotionActionType.PromotionClick:
            return 'PromotionClick';
        case PromotionActionType.PromotionView:
            return 'PromotionView';
        default:
            return 'Unknown';
    }
}

function convertProductActionToEventType(productActionType) {
    switch (productActionType) {
        case ProductActionType.AddToCart:
            return CommerceEventType.ProductAddToCart;
        case ProductActionType.AddToWishlist:
            return CommerceEventType.ProductAddToWishlist;
        case ProductActionType.Checkout:
            return CommerceEventType.ProductCheckout;
        case ProductActionType.Click:
            return CommerceEventType.ProductClick;
        case ProductActionType.Purchase:
            return CommerceEventType.ProductPurchase;
        case ProductActionType.Refund:
            return CommerceEventType.ProductRefund;
        case ProductActionType.RemoveFromCart:
            return CommerceEventType.ProductRemoveFromCart;
        case ProductActionType.RemoveFromWishlist:
            return CommerceEventType.ProductRemoveFromWishlist;
        case ProductActionType.Unknown:
            return EventType.Unknown;
        case ProductActionType.ViewDetail:
            return CommerceEventType.ProductViewDetail;
        default:
            utilities.logDebug('Could not convert product action type ' + productActionType + ' to event type');
            return null;
    }
}

function convertPromotionActionToEventType(promotionActionType) {
    switch (promotionActionType) {
        case PromotionActionType.PromotionClick:
            return CommerceEventType.PromotionClick;
        case PromotionActionType.PromotionView:
            return CommerceEventType.PromotionView;
        default:
            utilities.logDebug('Could not convert promotion action type ' + promotionActionType + ' to event type');
            return null;
    }
}

function expandProductAction(commerceEvent) {
    var appEvents = [];
    if (commerceEvent.ProductAction == null) {
        return appEvents;
    }
    var shouldExtractActionAttributes = false;
    if (commerceEvent.ProductAction.ProductActionType == ProductActionType.Purchase || commerceEvent.ProductAction.ProductActionType == ProductActionType.Refund) {
        var attributes = commerceEvent.EventAttributes || {};
        extractActionAttributes(attributes, commerceEvent.ProductAction);
        if (commerceEvent.CurrencyCode != null) {
            attributes['Currency Code'] = commerceEvent.CurrencyCode;
        }
        var plusOneEvent = createEventObject(MessageType.PageEvent, generateExpandedEcommerceName(ProductActionType.getExpansionName(commerceEvent.ProductAction.ProductActionType), true), attributes, EventType.Transaction);
        appEvents.push(plusOneEvent);
    } else {
        shouldExtractActionAttributes = true;
    }
    var products = commerceEvent.ProductAction.ProductList;
    if (products == null) {
        return appEvents;
    }
    for (var i = 0; i < products.length; i++) {
        var attributes = products[i].Attributes || {};
        if (shouldExtractActionAttributes) {
            extractActionAttributes(attributes, commerceEvent.ProductAction);
        } else {
            extractTransactionId(attributes, commerceEvent.ProductAction);
        }
        extractProductAttributes(attributes, products[i]);

        var productEvent = createEventObject(MessageType.PageEvent, generateExpandedEcommerceName(ProductActionType.getExpansionName(commerceEvent.ProductAction.ProductActionType)), attributes, EventType.Transaction);
        appEvents.push(productEvent);
    }
    return appEvents;
}

function extractProductAttributes(attributes, product) {
    if (product.CouponCode != null) attributes['Coupon Code'] = product.CouponCode;

    if (product.Brand != null) attributes['Brand'] = product.Brand;

    if (product.Category != null) attributes['Category'] = product.Category;

    if (product.Name != null) attributes['Name'] = product.Name;

    if (product.Sku != null) attributes['Id'] = product.Sku;

    if (product.Price != null) attributes['Item Price'] = product.Price;

    if (product.Quantity != null) attributes['Quantity'] = product.Quantity;

    if (product.Position != null) attributes['Position'] = product.Position;

    if (product.Variant != null) attributes['Variant'] = product.Variant;

    attributes['Total Product Amount'] = product.TotalAmount != null ? product.TotalAmount : 0;
}

function extractTransactionId(attributes, productAction) {
    if (productAction.TransactionId != null) attributes['Transaction Id'] = productAction.TransactionId;
}

function extractActionAttributes(attributes, productAction) {
    extractTransactionId(attributes, productAction);

    if (productAction.Affiliation != null) attributes['Affiliation'] = productAction.Affiliation;

    if (productAction.CouponCode != null) attributes['Coupon Code'] = productAction.CouponCode;

    if (productAction.TotalAmount != null) attributes['Total Amount'] = productAction.TotalAmount;

    if (productAction.ShippingAmount != null) attributes['Shipping Amount'] = productAction.ShippingAmount;

    if (productAction.TaxAmount != null) attributes['Tax Amount'] = productAction.TaxAmount;

    if (productAction.CheckoutOptions != null) attributes['Checkout Options'] = productAction.CheckoutOptions;

    if (productAction.CheckoutStep != null) attributes['Checkout Step'] = productAction.CheckoutStep;
}

function expandPromotionAction(commerceEvent) {
    var appEvents = [];
    if (commerceEvent.PromotionAction == null) {
        return appEvents;
    }
    var promotions = commerceEvent.PromotionAction.PromotionList;
    for (var i = 0; i < promotions.length; i++) {
        var attributes = commerceEvent.EventAttributes || {};
        extractPromotionAttributes(attributes, promotions[i]);

        var appEvent = createEventObject(MessageType.PageEvent, generateExpandedEcommerceName(PromotionActionType.getExpansionName(commerceEvent.PromotionAction.PromotionActionType)), attributes, EventType.Transaction);
        appEvents.push(appEvent);
    }
    return appEvents;
}

function generateExpandedEcommerceName(eventName, plusOne) {
    return 'eCommerce - ' + eventName + ' - ' + (plusOne ? "Total" : "Item");
}

function extractPromotionAttributes(attributes, promotion) {
    if (promotion.Id != null) attributes['Id'] = promotion.Id;

    if (promotion.Creative != null) attributes['Creative'] = promotion.Creative;

    if (promotion.Name != null) attributes['Name'] = promotion.Name;

    if (promotion.Position != null) attributes['Position'] = promotion.Position;
}

function expandProductImpression(commerceEvent) {
    var appEvents = [];
    if (commerceEvent.ProductImpressions == null) {
        return appEvents;
    }
    for (var i = 0; i < commerceEvent.ProductImpressions.length; i++) {
        if (commerceEvent.ProductImpressions[i].ProductList != null) {
            for (var productIndex = 0; productIndex < commerceEvent.ProductImpressions[i].ProductList.length; productIndex++) {
                var product = commerceEvent.ProductImpressions[i].ProductList[productIndex];
                var attributes = commerceEvent.EventAttributes || {};
                if (product.Attributes != null) {
                    for (var attribute in product.Attributes) {
                        attributes[attribute] = product.Attributes[attribute];
                    }
                }
                extractProductAttributes(attributes, product);
                if (commerceEvent.ProductImpressions[i].ProductImpressionList != null) {
                    attributes['Product Impression List'] = commerceEvent.ProductImpressions[i].ProductImpressionList;
                }
                var appEvent = createEventObject(MessageType.PageEvent, generateExpandedEcommerceName('Impression'), attributes, EventType.Transaction);
                appEvents.push(appEvent);
            }
        }
    }
    return appEvents;
}

function _expandCommerceEvent(event) {
    if (event == null) {
        return null;
    }
    return expandProductAction(event).concat(expandPromotionAction(event)).concat(expandProductImpression(event));
}

function createCommerceEventObject() {
    var baseEvent;

    utilities.logDebug(messages.getInformationMessages('StartingLogCommerceEvent'));

    if (canLog()) {
        if (!sessionId$1) {
            mParticle$1.startNewSession();
        }

        baseEvent = createEventObject(MessageType.Commerce);
        baseEvent.EventName = 'eCommerce - ';
        baseEvent.CurrencyCode = currencyCode;
        baseEvent.ShoppingCart = {
            ProductList: cartProducts
        };

        return baseEvent;
    } else {
        utilities.logDebug(messages.getInformationMessages('AbandonLogEvent'));
    }

    return null;
}

function logCheckoutEvent(step, options, attrs) {
    var event = createCommerceEventObject();

    if (event) {
        event.EventName += getProductActionEventName(ProductActionType.Checkout);
        event.EventCategory = CommerceEventType.ProductCheckout;
        event.ProductAction = {
            ProductActionType: ProductActionType.Checkout,
            CheckoutStep: step,
            CheckoutOptions: options,
            ProductList: event.ShoppingCart.ProductList
        };

        logCommerceEvent(event, attrs);
    }
}

function logProductActionEvent(productActionType, product, attrs) {
    var event = createCommerceEventObject();

    if (event) {
        event.EventCategory = convertProductActionToEventType(productActionType);
        event.EventName += getProductActionEventName(productActionType);
        event.ProductAction = {
            ProductActionType: productActionType,
            ProductList: Array.isArray(product) ? product : [product]
        };

        logCommerceEvent(event, attrs);
    }
}

function logPurchaseEvent(transactionAttributes, product, attrs) {
    var event = createCommerceEventObject();

    if (event) {
        event.EventName += getProductActionEventName(ProductActionType.Purchase);
        event.EventCategory = CommerceEventType.ProductPurchase;
        event.ProductAction = {
            ProductActionType: ProductActionType.Purchase
        };
        event.ProductAction.ProductList = buildProductList(event, product);

        convertTransactionAttributesToProductAction(transactionAttributes, event.ProductAction);

        logCommerceEvent(event, attrs);
    }
}

function logRefundEvent(transactionAttributes, product, attrs) {
    if (transactionAttributes == null || typeof transactionAttributes == 'undefined') {
        utilities.logDebug(messages.getErrorMessages('TransactionRequired'));
        return;
    }

    var event = createCommerceEventObject();

    if (event) {
        event.EventName += getProductActionEventName(ProductActionType.Refund);
        event.EventCategory = CommerceEventType.ProductRefund;
        event.ProductAction = {
            ProductActionType: ProductActionType.Refund
        };
        event.ProductAction.ProductList = buildProductList(event, product);

        convertTransactionAttributesToProductAction(transactionAttributes, event.ProductAction);

        logCommerceEvent(event, attrs);
    }
}

function buildProductList(event, product) {
    if (product) {
        if (Array.isArray(product)) {
            return product;
        }

        return [product];
    }

    return event.ShoppingCart.ProductList;
}

function logPromotionEvent(promotionType, promotion, attrs) {
    var event = createCommerceEventObject();

    if (event) {
        event.EventName += getPromotionActionEventName(promotionType);
        event.EventCategory = convertPromotionActionToEventType(promotionType);
        event.PromotionAction = {
            PromotionActionType: promotionType,
            PromotionList: [promotion]
        };

        logCommerceEvent(event, attrs);
    }
}

function logImpressionEvent(impression, attrs) {
    var event = createCommerceEventObject();

    if (event) {
        event.EventName += 'Impression';
        event.EventCategory = CommerceEventType.ProductImpression;
        event.ProductImpressions = [{
            ProductImpressionList: impression.Name,
            ProductList: [impression.Product]
        }];

        logCommerceEvent(event, attrs);
    }
}

function logOptOut() {
    utilities.logDebug(messages.getInformationMessages('StartingLogOptOut'));

    send(createEventObject(MessageType.OptOut, null, null, EventType.Other));
}

function _logEvent(type, name, data, category, cflags) {
    utilities.logDebug(messages.getInformationMessages('StartingLogEvent') + ': ' + name);

    if (canLog()) {
        if (!sessionId$1) {
            mParticle$1.startNewSession();
        }

        if (data) {
            data = sanitizeAttributes(data);
        }

        send(createEventObject(type, name, data, category, cflags));
        cookie.setCookie(Config, {
            sid: sessionId$1, ie: isEnabled$1, sa: sessionAttributes$1,
            ua: userAttributes$1, ui: userIdentities$1, ss: serverSettings$1, dt: devToken$1,
            les: lastEventSent$1 ? lastEventSent$1.getTime() : null,
            av: appVersion,
            cgid: clientId$1
        });
    } else {
        utilities.logDebug(messages.getInformationMessages('AbandonLogEvent'));
    }
}

function logCommerceEvent(commerceEvent, attrs) {
    utilities.logDebug(messages.getInformationMessages('StartingLogCommerceEvent'));

    if (canLog()) {
        if (!sessionId$1) {
            mParticle$1.startNewSession();
        }

        if (utilities.isWebViewEmbedded(navigator)) {
            // Don't send shopping cart or product bags to parent sdks
            commerceEvent.ShoppingCart = {};
            commerceEvent.ProductBags = {};
        }

        if (attrs) {
            commerceEvent.EventAttributes = attrs;
        }

        send(commerceEvent);
        cookie.setCookie(Config, {
            sid: sessionId$1, ie: isEnabled$1, sa: sessionAttributes$1,
            ua: userAttributes$1, ui: userIdentities$1, ss: serverSettings$1, dt: devToken$1,
            les: lastEventSent$1 ? lastEventSent$1.getTime() : null,
            av: appVersion,
            cgid: clientId$1
        });
    } else {
        utilities.logDebug(messages.getInformationMessages('AbandonLogEvent'));
    }
}

function logLogOutEvent() {
    var evt;

    utilities.logDebug(messages.getInformationMessages('StartingLogEvent') + ': logOut');

    if (canLog()) {
        if (!sessionId$1) {
            mParticle$1.startNewSession();
        }

        evt = createEventObject(MessageType.Profile);
        evt.ProfileMessageType = ProfileMessageType.Logout;

        send(evt);
        cookie.setCookie(Config, {
            sid: sessionId$1, ie: isEnabled$1, sa: sessionAttributes$1,
            ua: userAttributes$1, ui: userIdentities$1, ss: serverSettings$1, dt: devToken$1,
            les: lastEventSent$1 ? lastEventSent$1.getTime() : null,
            av: appVersion,
            cgid: clientId$1
        });

        return evt;
    } else {
        utilities.logDebug(messages.getInformationMessages('AbandonLogEvent'));
    }
}

function generateRandomValue(a) {
    if (window.hasOwnProperty('crypto')) {
        if (window.crypto && window.crypto.getRandomValues) {
            return (a ^ window.crypto.getRandomValues(new Uint8Array(1))[0] % 16 >> a / 4).toString(16);
        }
    }

    return (a ^ Math.random() * 16 >> a / 4).toString(16);
}

function generateUniqueId$1(a) {
    // https://gist.github.com/jed/982883
    // Added support for crypto for better random

    return a // if the placeholder was passed, return
    ? generateRandomValue(a) // a random number 
    : ( // or otherwise a concatenated string:
    [1e7] + // 10000000 +
    -1e3 + // -1000 +
    -4e3 + // -4000 +
    -8e3 + // -80000000 +
    -1e11 // -100000000000,
    ).replace( // replacing
    /[018]/g, // zeroes, ones, and eights with
    generateUniqueId$1 // random hex digits
    );
}

function isEventType(type) {
    for (var prop in EventType) {
        if (EventType.hasOwnProperty(prop)) {
            if (EventType[prop] === type) {
                return true;
            }
        }
    }
    return false;
}

function mergeConfig(config) {
    utilities.logDebug(messages.getInformationMessages('LoadingConfig'));

    for (var prop in DefaultConfig) {
        if (DefaultConfig.hasOwnProperty(prop)) {
            Config[prop] = DefaultConfig[prop];
        }

        if (config.hasOwnProperty(prop)) {
            Config[prop] = config[prop];
        }
    }
}

function canLog() {
    if (isEnabled$1 && (devToken$1 || utilities.isWebViewEmbedded(navigator))) {
        return true;
    }

    return false;
}

function isObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
}

function addEventHandler(domEvent, selector, eventName, data, eventType) {
    var elements = [],
        handler = function handler(e) {
        var timeoutHandler = function timeoutHandler() {
            if (element.href) {
                window.location.href = element.href;
            } else if (element.submit) {
                element.submit();
            }
        };

        utilities.logDebug('DOM event triggered, handling event');

        _logEvent(MessageType.PageEvent, typeof eventName === 'function' ? eventName(element) : eventName, typeof data === 'function' ? data(element) : data, eventType ? eventType : EventType.Other);

        // TODO: Handle middle-clicks and special keys (ctrl, alt, etc)
        if (element.href && element.target != '_blank' || element.submit) {
            // Give xmlhttprequest enough time to execute before navigating a link or submitting form

            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }

            setTimeout(timeoutHandler, Config.Timeout);
        }
    },
        element,
        i;

    if (!selector) {
        utilities.logDebug('Can\'t bind event, selector is required');
        return;
    }

    // Handle a css selector string or a dom element
    if (typeof selector === 'string') {
        elements = document.querySelectorAll(selector);
    } else if (selector.nodeType) {
        elements = [selector];
    }

    if (elements.length > 0) {
        utilities.logDebug('Found ' + elements.length + ' element' + (elements.length > 1 ? 's' : '') + ', attaching event handlers');

        for (i = 0; i < elements.length; i++) {
            element = elements[i];

            if (element.addEventListener) {
                element.addEventListener(domEvent, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + domEvent, handler);
            } else {
                element['on' + domEvent] = handler;
            }
        }
    } else {
        utilities.logDebug('No elements found');
    }
}

function generateHash(name) {
    var hash = 0,
        i = 0,
        character;

    if (!name) {
        return null;
    }

    name = name.toString().toLowerCase();

    if (Array.prototype.reduce) {
        return name.split("").reduce(function (a, b) {
            a = (a << 5) - a + b.charCodeAt(0);return a & a;
        }, 0);
    }

    if (name.length === 0) {
        return hash;
    }

    for (i = 0; i < name.length; i++) {
        character = name.charCodeAt(i);
        hash = (hash << 5) - hash + character;
        hash = hash & hash;
    }

    return hash;
}

function _createProduct(name, sku, price, quantity, brand, variant, category, position, couponCode, attributes) {

    if (!name) {
        utilities.logDebug('Name is required when creating a product');
        return null;
    }

    if (!sku) {
        utilities.logDebug('SKU is required when creating a product');
        return null;
    }

    if (price !== price || price === null) {
        utilities.logDebug('Price is required when creating a product');
        return null;
    }

    if (!quantity) {
        quantity = 1;
    }

    return {
        Name: name,
        Sku: sku,
        Price: price,
        Quantity: quantity,
        Brand: brand,
        Variant: variant,
        Category: category,
        Position: position,
        CouponCode: couponCode,
        TotalAmount: quantity * price,
        Attributes: attributes
    };
}

function _createPromotion(id, creative, name, position) {
    return {
        Id: id,
        Creative: creative,
        Name: name,
        Position: position
    };
}

function _createImpression(name, product) {
    if (!name) {
        utilities.logDebug('Name is required when creating an impression.');
        return null;
    }

    if (!product) {
        utilities.logDebug('Product is required when creating an impression.');
        return null;
    }

    return {
        Name: name,
        Product: product
    };
}

function _createTransactionAttributes(id, affiliation, couponCode, revenue, shipping, tax) {

    if (id === null || typeof id == 'undefined') {
        utilities.logDebug(messages.getErrorMessages('TransactionIdRequired'));
        return null;
    }

    return {
        Id: id,
        Affiliation: affiliation,
        CouponCode: couponCode,
        Revenue: revenue,
        Shipping: shipping,
        Tax: tax
    };
}

function callSetUserAttributeOnForwarders(key, value) {
    if (forwarders) {
        for (var i = 0; i < forwarders.length; i++) {
            if (forwarders[i].setUserAttribute && forwarders[i].userAttributeFilters && !utilities.inArray(forwarders[i].userAttributeFilters, generateHash(key))) {

                try {
                    var result = forwarders[i].setUserAttribute(key, value);

                    if (result) {
                        utilities.logDebug(result);
                    }
                } catch (e) {
                    utilities.logDebug(e);
                }
            }
        }
    }
}

function findKeyInObject(obj, key) {
    if (key && obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && prop.toLowerCase() === key.toLowerCase()) {
                return prop;
            }
        }
    }

    return null;
}

function isValidAttributeValue(value) {
    return !isObject(value) && !Array.isArray(value);
}

function sanitizeAttributes(attrs) {
    if (!attrs || !isObject(attrs)) {
        return null;
    }

    var sanitizedAttrs = {};

    for (var prop in attrs) {
        // Make sure that attribute values are not objects or arrays, which are not valid
        if (attrs.hasOwnProperty(prop) && isValidAttributeValue(attrs[prop])) {
            sanitizedAttrs[prop] = attrs[prop];
        }
    }

    return sanitizedAttrs;
}

var MessageType = {
    SessionStart: 1,
    SessionEnd: 2,
    PageView: 3,
    PageEvent: 4,
    CrashReport: 5,
    OptOut: 6,
    Profile: 14,
    Commerce: 16
};

var EventType = {
    Unknown: 0,
    Navigation: 1,
    Location: 2,
    Search: 3,
    Transaction: 4,
    UserContent: 5,
    UserPreference: 6,
    Social: 7,
    Other: 8,
    Media: 9
};

var ProfileMessageType = {
    Logout: 3
};

EventType.getName = function (id) {
    switch (id) {
        case EventType.Navigation:
            return 'Navigation';
        case EventType.Location:
            return 'Location';
        case EventType.Search:
            return 'Search';
        case EventType.Transaction:
            return 'Transaction';
        case EventType.UserContent:
            return 'User Content';
        case EventType.UserPreference:
            return 'User Preference';
        case EventType.Social:
            return 'Social';
        case EventType.Media:
            return 'Media';
        case CommerceEventType.ProductAddToCart:
            return 'Product Added to Cart';
        case CommerceEventType.ProductAddToWishlist:
            return 'Product Added to Wishlist';
        case CommerceEventType.ProductCheckout:
            return 'Product Checkout';
        case CommerceEventType.ProductCheckoutOption:
            return 'Product Checkout Options';
        case CommerceEventType.ProductClick:
            return 'Product Click';
        case CommerceEventType.ProductImpression:
            return 'Product Impression';
        case CommerceEventType.ProductPurchase:
            return 'Product Purchased';
        case CommerceEventType.ProductRefund:
            return 'Product Refunded';
        case CommerceEventType.ProductRemoveFromCart:
            return 'Product Removed From Cart';
        case CommerceEventType.ProductRemoveFromWishlist:
            return 'Product Removed from Wishlist';
        case CommerceEventType.ProductViewDetail:
            return 'Product View Details';
        case CommerceEventType.PromotionClick:
            return 'Promotion Click';
        case CommerceEventType.PromotionView:
            return 'Promotion View';
        default:
            return 'Other';
    }
};

// Continuation of enum above, but in seperate object since we don't expose these to end user
var CommerceEventType = {
    ProductAddToCart: 10,
    ProductRemoveFromCart: 11,
    ProductCheckout: 12,
    ProductCheckoutOption: 13,
    ProductClick: 14,
    ProductViewDetail: 15,
    ProductPurchase: 16,
    ProductRefund: 17,
    PromotionView: 18,
    PromotionClick: 19,
    ProductAddToWishlist: 20,
    ProductRemoveFromWishlist: 21,
    ProductImpression: 22
};

var IdentityType = {
    Other: 0,
    CustomerId: 1,
    Facebook: 2,
    Twitter: 3,
    Google: 4,
    Microsoft: 5,
    Yahoo: 6,
    Email: 7,
    Alias: 8,
    FacebookCustomAudienceId: 9
};

IdentityType.getName = function (identityType) {
    switch (identityType) {
        case window.mParticle.IdentityType.CustomerId:
            return 'Customer ID';
        case window.mParticle.IdentityType.Facebook:
            return 'Facebook ID';
        case window.mParticle.IdentityType.Twitter:
            return 'Twitter ID';
        case window.mParticle.IdentityType.Google:
            return 'Google ID';
        case window.mParticle.IdentityType.Microsoft:
            return 'Microsoft ID';
        case window.mParticle.IdentityType.Yahoo:
            return 'Yahoo ID';
        case window.mParticle.IdentityType.Email:
            return 'Email';
        case window.mParticle.IdentityType.Alias:
            return 'Alias ID';
        case window.mParticle.IdentityType.FacebookCustomAudienceId:
            return 'Facebook App User ID';
        default:
            return 'Other ID';
    }
};

var DefaultConfig = {
    CookieName: 'mprtcl-api', // Name of the cookie stored on the user's machine
    CookieDomain: null, // If null, defaults to current location.host
    Debug: false, // If true, will print debug messages to browser console
    CookieExpiration: 365, // Cookie expiration time in days
    Verbose: false, // Whether the server will return verbose responses
    IncludeReferrer: true, // Include user's referrer
    IncludeGoogleAdwords: true, // Include utm_source and utm_properties
    Timeout: 300, // Timeout in milliseconds for logging functions
    SessionTimeout: 30, // Session timeout in minutes
    Sandbox: false, // Events are marked as debug and only forwarded to debug forwarders,
    Version: null // The version of this website/app
};

var Config = {};

var NativeSdkPaths = {
    LogEvent: 'logEvent',
    SetUserIdentity: 'setUserIdentity',
    RemoveUserIdentity: 'removeUserIdentity',
    SetUserTag: 'setUserTag',
    RemoveUserTag: 'removeUserTag',
    SetUserAttribute: 'setUserAttribute',
    RemoveUserAttribute: 'removeUserAttribute',
    SetSessionAttribute: 'setSessionAttribute',
    AddToProductBag: 'addToProductBag',
    RemoveFromProductBag: 'removeFromProductBag',
    ClearProductBag: 'clearProductBag',
    AddToCart: 'addToCart',
    RemoveFromCart: 'removeFromCart',
    ClearCart: 'clearCart',
    LogOut: 'logOut',
    SetUserAttributeList: 'setUserAttributeList',
    RemoveAllUserAttributes: 'removeAllUserAttributes',
    GetUserAttributesLists: 'getUserAttributesLists',
    GetAllUserAttributes: 'getAllUserAttributes'
};

var ProductActionType = {
    Unknown: 0,
    AddToCart: 1,
    RemoveFromCart: 2,
    Checkout: 3,
    CheckoutOption: 4,
    Click: 5,
    ViewDetail: 6,
    Purchase: 7,
    Refund: 8,
    AddToWishlist: 9,
    RemoveFromWishlist: 10
};

ProductActionType.getName = function (id) {
    switch (id) {
        case ProductActionType.AddToCart:
            return 'Add to Cart';
        case ProductActionType.RemoveFromCart:
            return 'Remove from Cart';
        case ProductActionType.Checkout:
            return 'Checkout';
        case ProductActionType.CheckoutOption:
            return 'Checkout Option';
        case ProductActionType.Click:
            return 'Click';
        case ProductActionType.ViewDetail:
            return 'View Detail';
        case ProductActionType.Purchase:
            return 'Purchase';
        case ProductActionType.Refund:
            return 'Refund';
        case ProductActionType.AddToWishlist:
            return 'Add to Wishlist';
        case ProductActionType.RemoveFromWishlist:
            return 'Remove from Wishlist';
        default:
            return 'Unknown';
    }
};

//these are the action names used by server and mobile SDKs when expanding a CommerceEvent
ProductActionType.getExpansionName = function (id) {
    switch (id) {
        case ProductActionType.AddToCart:
            return 'add_to_cart';
        case ProductActionType.RemoveFromCart:
            return 'remove_from_cart';
        case ProductActionType.Checkout:
            return 'checkout';
        case ProductActionType.CheckoutOption:
            return 'checkout_option';
        case ProductActionType.Click:
            return 'click';
        case ProductActionType.ViewDetail:
            return 'view_detail';
        case ProductActionType.Purchase:
            return 'purchase';
        case ProductActionType.Refund:
            return 'refund';
        case ProductActionType.AddToWishlist:
            return 'add_to_wishlist';
        case ProductActionType.RemoveFromWishlist:
            return 'remove_from_wishlist';
        default:
            return 'Unknown';
    }
};

var PromotionActionType = {
    Unknown: 0,
    PromotionView: 1,
    PromotionClick: 2
};

PromotionActionType.getName = function (id) {
    switch (id) {
        case PromotionActionType.PromotionView:
            return 'Promotion View';
        case PromotionActionType.PromotionClick:
            return 'Promotion Click';
        default:
            return 'Unknown';
    }
};

//these are the names that the server and mobile SDKs use while expanding CommerceEvent
PromotionActionType.getExpansionName = function (id) {
    switch (id) {
        case PromotionActionType.PromotionView:
            return 'view';
        case PromotionActionType.PromotionClick:
            return 'click';
        default:
            return 'Unknown';
    }
};

var mParticle$1 = {
    isIOS: false,
    isDebug: false,
    isSandbox: false,
    generateHash: generateHash,
    IdentityType: IdentityType,
    EventType: EventType,
    CommerceEventType: CommerceEventType,
    PromotionType: PromotionActionType,
    ProductActionType: ProductActionType,
    init: function init() {
        var token, config;

        utilities.logDebug(messages.getInformationMessages('StartingInitialization'));

        // Set configuration to default settings
        mergeConfig({});
        // Load any settings/identities/attributes from cookie
        cookie.getCookie();

        if (arguments && arguments.length > 0) {
            if (typeof arguments[0] == 'string') {
                // This is the dev token
                token = arguments[0];

                if (devToken$1 !== token) {
                    mParticle$1.endSession();
                    devToken$1 = token;
                }

                initForwarders();
            }

            if (_typeof(arguments[0]) == 'object') {
                config = arguments[0];
            } else if (arguments.length > 1 && _typeof(arguments[1]) == 'object') {
                config = arguments[1];
            }

            if (config) {
                mergeConfig(config);
            }
        }

        // Call any functions that are waiting for the library to be initialized
        if (readyQueue && readyQueue.length) {
            for (var i = 0; i < readyQueue.length; i++) {
                if (typeof readyQueue[i] == 'function') {
                    readyQueue[i]();
                }
            }

            readyQueue = [];
        }

        cookie.setCookie(Config, {
            sid: sessionId$1, ie: isEnabled$1, sa: sessionAttributes$1,
            ua: userAttributes$1, ui: userIdentities$1, ss: serverSettings$1, dt: devToken$1,
            les: lastEventSent$1 ? lastEventSent$1.getTime() : null,
            av: appVersion,
            cgid: clientId$1
        });
        isInitialized = true;
    },
    reset: function reset() {
        // Completely resets the state of the SDK. mParticle.init() will need to be called again.

        isEnabled$1 = true;
        stopTracking();
        devToken$1 = null;
        sessionId$1 = null;
        appName = null;
        appVersion = null;
        sessionAttributes$1 = {};
        userAttributes$1 = {};
        userIdentities$1 = [];
        forwarders = [];
        forwarderConstructors = [];
        productsBags = {};
        cartProducts = [];
        serverSettings$1 = null;
        mergeConfig({});
        cookie.setCookie(Config, {
            sid: sessionId$1, ie: isEnabled$1, sa: sessionAttributes$1,
            ua: userAttributes$1, ui: userIdentities$1, ss: serverSettings$1, dt: devToken$1,
            les: lastEventSent$1 ? lastEventSent$1.getTime() : null,
            av: appVersion,
            cgid: clientId$1
        });

        isInitialized = false;
    },
    ready: function ready(f) {
        if (isInitialized && typeof f == 'function') {
            f();
        } else {
            readyQueue.push(f);
        }
    },
    getVersion: function getVersion() {
        return sdkVersion;
    },
    setAppVersion: function setAppVersion(version) {
        appVersion = version;
        cookie.setCookie(Config, {
            sid: sessionId$1, ie: isEnabled$1, sa: sessionAttributes$1,
            ua: userAttributes$1, ui: userIdentities$1, ss: serverSettings$1, dt: devToken$1,
            les: lastEventSent$1 ? lastEventSent$1.getTime() : null,
            av: appVersion,
            cgid: clientId$1
        });
    },
    getAppName: function getAppName() {
        return appName;
    },
    setAppName: function setAppName(name) {
        appName = name;
    },
    getAppVersion: function getAppVersion() {
        return appVersion;
    },
    stopTrackingLocation: function stopTrackingLocation() {
        stopTracking();
    },
    startTrackingLocation: function startTrackingLocation() {
        startTracking();
    },
    setPosition: function setPosition(lat, lng) {
        if (typeof lat === 'number' && typeof lng === 'number') {
            currentPosition = {
                lat: lat,
                lng: lng
            };
        } else {
            utilities.logDebug('Position latitude and/or longitude are invalid');
        }
    },
    setUserIdentity: function setUserIdentity(id, type) {
        if (canLog()) {
            var userIdentity = {
                Identity: id,
                Type: type
            };

            mParticle$1.removeUserIdentity(id);
            userIdentities$1.push(userIdentity);

            if (!tryNativeSdk(NativeSdkPaths.SetUserIdentity, JSON.stringify(userIdentity))) {
                if (forwarders) {
                    for (var i = 0; i < forwarders.length; i++) {
                        if (forwarders[i].setUserIdentity && (!forwarders[i].userIdentityFilters || !utilities.inArray(forwarders[i].userIdentityFilters, type))) {

                            var result = forwarders[i].setUserIdentity(id, type);

                            if (result) {
                                utilities.logDebug(result);
                            }
                        }
                    }
                }
            }

            cookie.setCookie(Config, {
                sid: sessionId$1, ie: isEnabled$1, sa: sessionAttributes$1,
                ua: userAttributes$1, ui: userIdentities$1, ss: serverSettings$1, dt: devToken$1,
                les: lastEventSent$1 ? lastEventSent$1.getTime() : null,
                av: appVersion,
                cgid: clientId$1
            });
        }
    },
    getUserIdentity: function getUserIdentity(id) {
        var foundIdentity = null;

        userIdentities$1.forEach(function (identity) {
            if (identity.Identity === id) {
                foundIdentity = identity;
            }
        });

        return foundIdentity;
    },
    removeUserIdentity: function removeUserIdentity(id) {
        var i = 0;

        for (i = 0; i < userIdentities$1.length; i++) {
            if (userIdentities$1[i].Identity === id) {
                userIdentities$1.splice(i, 1);
                i--;
            }
        }

        tryNativeSdk(NativeSdkPaths.RemoveUserIdentity, id);
        cookie.setCookie(Config, {
            sid: sessionId$1, ie: isEnabled$1, sa: sessionAttributes$1,
            ua: userAttributes$1, ui: userIdentities$1, ss: serverSettings$1, dt: devToken$1,
            les: lastEventSent$1 ? lastEventSent$1.getTime() : null,
            av: appVersion,
            cgid: clientId$1
        });
    },
    startNewSession: function startNewSession() {
        // Ends the current session if one is in progress

        utilities.logDebug(messages.getInformationMessages('StartingNewSession'));

        if (canLog()) {
            mParticle$1.endSession();
            sessionId$1 = generateUniqueId$1();

            if (!lastEventSent$1) {
                lastEventSent$1 = new Date();
            }

            _logEvent(MessageType.SessionStart);
        } else {
            utilities.logDebug(messages.getInformationMessages('AbandonStartSession'));
        }
    },
    endSession: function endSession() {
        utilities.logDebug(messages.getInformationMessages('StartingEndSession'));

        // Ends the current session.
        if (canLog()) {
            if (!sessionId$1) {
                utilities.logDebug(messages.getInformationMessages('NoSessionToEnd'));
                return;
            }

            _logEvent(MessageType.SessionEnd);

            sessionId$1 = null;
            sessionAttributes$1 = {};
        } else {
            utilities.logDebug(messages.getInformationMessages('AbandonEndSession'));
        }
    },
    logEvent: function logEvent(eventName, eventType, eventInfo, customFlags) {
        if (typeof eventName != 'string') {
            utilities.logDebug(messages.getErrorMessages('EventNameInvalidType'));
            return;
        }

        if (!eventType) {
            eventType = EventType.Unknown;
        }

        if (!isEventType(eventType)) {
            utilities.logDebug('Invalid event type: ' + eventType + ', must be one of: \n' + JSON.stringify(EventType));
            return;
        }

        if (!canLog()) {
            utilities.logDebug(messages.getErrorMessages('LoggingDisabled'));
            return;
        }

        if (!lastEventSent$1) {
            lastEventSent$1 = new Date();
        } else if (new Date() > new Date(lastEventSent$1.getTime() + Config.SessionTimeout * 60000)) {
            // Session has timed out, start a new one
            mParticle$1.startNewSession();
        }

        _logEvent(MessageType.PageEvent, eventName, eventInfo, eventType, customFlags);
    },
    logError: function logError(error) {
        if (!error) {
            return;
        }

        if (typeof error == 'string') {
            error = {
                message: error
            };
        }

        _logEvent(MessageType.CrashReport, error.name ? error.name : 'Error', {
            m: error.message ? error.message : error,
            s: 'Error',
            t: error.stack
        }, EventType.Other);
    },
    logLink: function logLink(selector, eventName, eventType, eventInfo) {
        addEventHandler('click', selector, eventName, eventInfo, eventType);
    },
    logForm: function logForm(selector, eventName, eventType, eventInfo) {
        addEventHandler('submit', selector, eventName, eventInfo, eventType);
    },
    logPageView: function logPageView() {
        var eventName = null,
            attrs = null,
            flags = null;

        if (canLog()) {
            if (arguments.length <= 1) {
                // Handle original function signature

                eventName = window.location.pathname;
                attrs = {
                    hostname: window.location.hostname,
                    title: window.document.title
                };

                if (arguments.length == 1) {
                    flags = arguments[0];
                }
            } else if (arguments.length > 1) {
                eventName = arguments[0];
                attrs = arguments[1];

                if (arguments.length == 3) {
                    flags = arguments[2];
                }
            }

            _logEvent(MessageType.PageView, eventName, attrs, EventType.Unknown, flags);
        }
    },
    eCommerce: {
        ProductBags: {
            add: function add(productBagName, product) {
                if (!productsBags[productBagName]) {
                    productsBags[productBagName] = [];
                }

                productsBags[productBagName].push(product);

                tryNativeSdk(NativeSdkPaths.AddToProductBag, JSON.stringify(product));
            },
            remove: function remove(productBagName, product) {
                var productIndex = -1;

                if (productsBags[productBagName]) {
                    productsBags[productBagName].forEach(function (item, index) {
                        if (item.sku === product.sku) {
                            productIndex = index;
                        }
                    });

                    if (productIndex > -1) {
                        productsBags[productBagName].splice(productIndex, 1);
                    }
                }

                tryNativeSdk(NativeSdkPaths.RemoveFromProductBag, JSON.stringify(product));
            },
            clear: function clear(productBagName) {
                productsBags[productBagName] = [];

                tryNativeSdk(NativeSdkPaths.ClearProductBag, productBagName);
            }
        },
        Cart: {
            add: function add(product, logEvent) {
                var arrayCopy = [];

                if (Array.isArray(product)) {
                    for (var i = 0; i < product.length; i++) {
                        arrayCopy.push(product[i]);
                    }
                } else {
                    arrayCopy.push(product);
                }

                cartProducts = cartProducts.concat(arrayCopy);

                if (utilities.isWebViewEmbedded(navigator)) {
                    tryNativeSdk(NativeSdkPaths.AddToCart, JSON.stringify(arrayCopy));
                } else if (logEvent === true) {
                    logProductActionEvent(ProductActionType.AddToCart, arrayCopy);
                }
            },
            remove: function remove(product, logEvent) {
                var cartIndex = -1,
                    cartItem = null;

                if (cartProducts) {
                    cartProducts.forEach(function (item, index) {
                        if (item.Sku === product.Sku) {
                            cartIndex = index;
                            cartItem = item;
                        }
                    });

                    if (cartIndex > -1) {
                        cartProducts.splice(cartIndex, 1);

                        if (utilities.isWebViewEmbedded(navigator)) {
                            tryNativeSdk(NativeSdkPaths.RemoveFromCart, JSON.stringify(cartItem));
                        } else if (logEvent === true) {
                            logProductActionEvent(ProductActionType.RemoveFromCart, cartItem);
                        }
                    }
                }
            },
            clear: function clear() {
                cartProducts = [];
                tryNativeSdk(NativeSdkPaths.ClearCart);
            }
        },
        setCurrencyCode: function setCurrencyCode(code) {
            currencyCode = code;
        },
        createProduct: function createProduct(name, sku, price, quantity, variant, category, brand, position, coupon, attributes) {
            return _createProduct(name, sku, price, quantity, variant, category, brand, position, coupon, attributes);
        },
        createPromotion: function createPromotion(id, creative, name, position) {
            return _createPromotion(id, creative, name, position);
        },
        createImpression: function createImpression(name, product) {
            return _createImpression(name, product);
        },
        createTransactionAttributes: function createTransactionAttributes(id, affiliation, couponCode, revenue, shipping, tax) {
            return _createTransactionAttributes(id, affiliation, couponCode, revenue, shipping, tax);
        },
        logCheckout: function logCheckout(step, paymentMethod, attrs) {
            logCheckoutEvent(step, paymentMethod, attrs);
        },
        logProductAction: function logProductAction(productActionType, product, attrs) {
            logProductActionEvent(productActionType, product, attrs);
        },
        logPurchase: function logPurchase(transactionAttributes, product, clearCart, attrs) {
            logPurchaseEvent(transactionAttributes, product, attrs);

            if (clearCart === true) {
                mParticle$1.eCommerce.Cart.clear();
            }
        },
        logPromotion: function logPromotion(type, promotion, attrs) {
            logPromotionEvent(type, promotion, attrs);
        },
        logImpression: function logImpression(impression, attrs) {
            logImpressionEvent(impression, attrs);
        },
        logRefund: function logRefund(transactionAttributes, product, clearCart, attrs) {
            logRefundEvent(transactionAttributes, product, attrs);

            if (clearCart === true) {
                mParticle$1.eCommerce.Cart.clear();
            }
        },
        expandCommerceEvent: function expandCommerceEvent(event) {
            return _expandCommerceEvent(event);
        }
    },
    logEcommerceTransaction: function logEcommerceTransaction(productName, productSKU, productUnitPrice, productQuantity, productCategory, revenueAmount, taxAmount, shippingAmount, currencyCode, affiliation, transactionId) {

        var attributes = {};
        attributes.$MethodName = 'LogEcommerceTransaction';

        attributes.ProductName = productName ? productName : '';
        attributes.ProductSKU = productSKU ? productSKU : '';
        attributes.ProductUnitPrice = productUnitPrice ? productUnitPrice : 0;
        attributes.ProductQuantity = productQuantity ? productQuantity : 0;
        attributes.ProductCategory = productCategory ? productCategory : '';
        attributes.RevenueAmount = revenueAmount ? revenueAmount : 0;
        attributes.TaxAmount = taxAmount ? taxAmount : 0;
        attributes.ShippingAmount = shippingAmount ? shippingAmount : 0;
        attributes.CurrencyCode = currencyCode ? currencyCode : 'USD';
        attributes.TransactionAffiliation = affiliation ? affiliation : '';
        attributes.TransactionID = transactionId ? transactionId : generateUniqueId$1();

        _logEvent(MessageType.PageEvent, 'Ecommerce', attributes, EventType.Transaction);
    },
    logLTVIncrease: function logLTVIncrease(amount, eventName, attributes) {
        if (amount == null || typeof amount == "undefined") {
            utilities.logDebug('A valid amount must be passed to logLTVIncrease.');
            return;
        }

        if (!attributes) {
            attributes = {};
        }

        attributes[RESERVED_KEY_LTV] = amount;
        attributes[METHOD_NAME] = LOG_LTV;

        _logEvent(MessageType.PageEvent, !eventName ? 'Increase LTV' : eventName, attributes, EventType.Transaction);
    },
    setUserTag: function setUserTag(tagName) {
        window.mParticle.setUserAttribute(tagName, null);
    },
    removeUserTag: function removeUserTag(tagName) {
        var existingProp = findKeyInObject(userAttributes$1, tagName);

        if (existingProp != null) {
            tagName = existingProp;
        }

        delete userAttributes$1[tagName];
        tryNativeSdk(NativeSdkPaths.RemoveUserTag, JSON.stringify({ key: tagName, value: null }));
        cookie.setCookie(Config, {
            sid: sessionId$1, ie: isEnabled$1, sa: sessionAttributes$1,
            ua: userAttributes$1, ui: userIdentities$1, ss: serverSettings$1, dt: devToken$1,
            les: lastEventSent$1 ? lastEventSent$1.getTime() : null,
            av: appVersion,
            cgid: clientId$1
        });
    },
    setUserAttribute: function setUserAttribute(key, value) {
        // Logs to cookie
        // And logs to in-memory object
        // Example: mParticle.setUserAttribute('email', 'tbreffni@mparticle.com');
        if (canLog()) {
            if (!isValidAttributeValue(value)) {
                utilities.logDebug(messages.getErrorMessages('BadAttribute'));
                return;
            }

            var existingProp = findKeyInObject(userAttributes$1, key);

            if (existingProp != null) {
                key = existingProp;
            }

            userAttributes$1[key] = value;
            cookie.setCookie(Config, {
                sid: sessionId$1, ie: isEnabled$1, sa: sessionAttributes$1,
                ua: userAttributes$1, ui: userIdentities$1, ss: serverSettings$1, dt: devToken$1,
                les: lastEventSent$1 ? lastEventSent$1.getTime() : null,
                av: appVersion,
                cgid: clientId$1
            });

            if (!tryNativeSdk(NativeSdkPaths.SetUserAttribute, JSON.stringify({ key: key, value: value }))) {
                callSetUserAttributeOnForwarders(key, value);
            }
        }
    },
    removeUserAttribute: function removeUserAttribute(key) {
        var existingProp = findKeyInObject(userAttributes$1, key);

        if (existingProp != null) {
            key = existingProp;
        }

        delete userAttributes$1[key];

        if (!tryNativeSdk(NativeSdkPaths.RemoveUserAttribute, JSON.stringify({ key: key, value: null }))) {
            applyToForwarders('removeUserAttribute', key, null);
        }

        cookie.setCookie(Config, {
            sid: sessionId$1, ie: isEnabled$1, sa: sessionAttributes$1,
            ua: userAttributes$1, ui: userIdentities$1, ss: serverSettings$1, dt: devToken$1,
            les: lastEventSent$1 ? lastEventSent$1.getTime() : null,
            av: appVersion,
            cgid: clientId$1
        });
    },
    setUserAttributeList: function setUserAttributeList(key, value) {
        var arrayCopy = [];

        if (Array.isArray(value)) {
            for (var i = 0; i < value.length; i++) {
                arrayCopy.push(value[i]);
            }

            var existingProp = findKeyInObject(userAttributes$1, key);

            if (existingProp != null) {
                key = existingProp;
            }

            userAttributes$1[key] = arrayCopy;
            cookie.setCookie(Config, {
                sid: sessionId$1, ie: isEnabled$1, sa: sessionAttributes$1,
                ua: userAttributes$1, ui: userIdentities$1, ss: serverSettings$1, dt: devToken$1,
                les: lastEventSent$1 ? lastEventSent$1.getTime() : null,
                av: appVersion,
                cgid: clientId$1
            });

            if (!tryNativeSdk(NativeSdkPaths.SetUserAttributeList, JSON.stringify({ key: key, value: arrayCopy }))) {
                callSetUserAttributeOnForwarders(key, arrayCopy);
            }
        }
    },
    removeAllUserAttributes: function removeAllUserAttributes() {
        if (!tryNativeSdk(NativeSdkPaths.RemoveAllUserAttributes)) {
            if (userAttributes$1) {
                for (var prop in userAttributes$1) {
                    if (userAttributes$1.hasOwnProperty(prop)) {
                        applyToForwarders('removeUserAttribute', userAttributes$1[prop]);
                    }
                }
            }
        }

        userAttributes$1 = {};
        cookie.setCookie(Config, {
            sid: sessionId$1, ie: isEnabled$1, sa: sessionAttributes$1,
            ua: userAttributes$1, ui: userIdentities$1, ss: serverSettings$1, dt: devToken$1,
            les: lastEventSent$1 ? lastEventSent$1.getTime() : null,
            av: appVersion,
            cgid: clientId$1
        });
    },
    getUserAttributesLists: function getUserAttributesLists() {
        var userAttributeLists = {},
            arrayCopy;

        for (var key in userAttributes$1) {
            if (userAttributes$1.hasOwnProperty(key) && Array.isArray(userAttributes$1[key])) {
                arrayCopy = [];

                for (var i = 0; i < userAttributes$1[key].length; i++) {
                    arrayCopy.push(userAttributes$1[key][i]);
                }

                userAttributeLists[key] = arrayCopy;
            }
        }

        return userAttributeLists;
    },
    getAllUserAttributes: function getAllUserAttributes() {
        var userAttributesCopy = {},
            arrayCopy;

        if (userAttributes$1) {
            for (var prop in userAttributes$1) {
                if (userAttributes$1.hasOwnProperty(prop)) {
                    if (Array.isArray(userAttributes$1[prop])) {
                        arrayCopy = [];

                        for (var i = 0; i < userAttributes$1[prop].length; i++) {
                            arrayCopy.push(userAttributes$1[prop][i]);
                        }

                        userAttributesCopy[prop] = arrayCopy;
                    } else {
                        userAttributesCopy[prop] = userAttributes$1[prop];
                    }
                }
            }
        }

        return userAttributesCopy;
    },
    setSessionAttribute: function setSessionAttribute(key, value) {
        // Logs to cookie
        // And logs to in-memory object
        // Example: mParticle.setSessionAttribute('location', '33431');
        if (canLog()) {
            if (!isValidAttributeValue(value)) {
                utilities.logDebug(messages.getErrorMessages('BadAttribute'));
                return;
            }

            var existingProp = findKeyInObject(sessionAttributes$1, key);

            if (existingProp != null) {
                key = existingProp;
            }

            sessionAttributes$1[key] = value;
            cookie.setCookie(Config, {
                sid: sessionId$1, ie: isEnabled$1, sa: sessionAttributes$1,
                ua: userAttributes$1, ui: userIdentities$1, ss: serverSettings$1, dt: devToken$1,
                les: lastEventSent$1 ? lastEventSent$1.getTime() : null,
                av: appVersion,
                cgid: clientId$1
            });
            if (!tryNativeSdk(NativeSdkPaths.SetSessionAttribute, JSON.stringify({ key: key, value: value }))) {
                applyToForwarders('setSessionAttribute', [key, value]);
            }
        }
    },
    setOptOut: function setOptOut(isOptingOut) {
        isEnabled$1 = !isOptingOut;

        logOptOut();
        cookie.setCookie(Config, {
            sid: sessionId$1, ie: isEnabled$1, sa: sessionAttributes$1,
            ua: userAttributes$1, ui: userIdentities$1, ss: serverSettings$1, dt: devToken$1,
            les: lastEventSent$1 ? lastEventSent$1.getTime() : null,
            av: appVersion,
            cgid: clientId$1
        });

        if (forwarders) {
            for (var i = 0; i < forwarders.length; i++) {
                if (forwarders[i].setOptOut) {
                    var result = forwarders[i].setOptOut(isOptingOut);

                    if (result) {
                        utilities.logDebug(result);
                    }
                }
            }
        }
    },
    logOut: function logOut() {
        var evt;

        if (canLog()) {
            if (!tryNativeSdk(NativeSdkPaths.LogOut)) {
                evt = logLogOutEvent();

                if (forwarders) {
                    for (var i = 0; i < forwarders.length; i++) {
                        if (forwarders[i].logOut) {
                            forwarders[i].logOut(evt);
                        }
                    }
                }
            }
        }
    },
    addForwarder: function addForwarder(forwarderProcessor) {
        forwarderConstructors.push(forwarderProcessor);
    },
    configureForwarder: function configureForwarder() {
        var newForwarder = null,
            config = null;

        if (arguments.length === 1) {
            config = arguments[0];
        } else {
            /*  Added for backwards compatibility
                Old signature for reference:
            
            configureForwarder: function (name,
                settings,
                eventNameFilters,
                eventTypeFilters,
                attributeFilters,
                pageViewFilters,
                pageViewAttributeFilters,
                userIdentityFilters,
                userAttributeFilters,
                id,
                isSandbox,
                hasSandbox,
                isVisible)
            */
            config = {
                name: arguments[0],
                settings: arguments[1],
                eventNameFilters: arguments[2],
                eventTypeFilters: arguments[3],
                attributeFilters: arguments[4],
                pageViewFilters: arguments[5],
                pageViewAttributeFilters: arguments[6],
                userIdentityFilters: arguments[7],
                userAttributeFilters: arguments[8],
                moduleId: arguments[9],
                isSandbox: arguments[10],
                hasSandbox: arguments[11],
                isVisible: arguments[12],
                filteringEventAttributeValue: null
            };
        }

        for (var i = 0; i < forwarderConstructors.length; i++) {
            if (forwarderConstructors[i].name == config.name) {
                newForwarder = new forwarderConstructors[i].constructor();

                newForwarder.id = config.moduleId;
                newForwarder.isSandbox = config.isDebug;
                newForwarder.hasSandbox = config.hasDebugString === 'true' ? true : false;
                newForwarder.isVisible = config.isVisible;
                newForwarder.settings = config.settings;

                newForwarder.eventNameFilters = config.eventNameFilters;
                newForwarder.eventTypeFilters = config.eventTypeFilters;
                newForwarder.attributeFilters = config.attributeFilters;

                newForwarder.pageViewFilters = config.pageViewFilters;
                newForwarder.pageViewAttributeFilters = config.pageViewAttributeFilters;

                newForwarder.userIdentityFilters = config.userIdentityFilters;
                newForwarder.userAttributeFilters = config.userAttributeFilters;

                newForwarder.filteringEventAttributeValue = config.filteringEventAttributeValue;

                forwarders.push(newForwarder);

                break;
            }
        }
    }
};

// Read existing configuration if present
if (window.mParticle && window.mParticle.config) {
    if (window.mParticle.config.serviceUrl) {
        serviceUrl = window.mParticle.config.serviceUrl;
    }

    if (window.mParticle.config.secureServiceUrl) {
        secureServiceUrl = window.mParticle.config.secureServiceUrl;
    }

    // Check for any functions queued
    if (window.mParticle.config.rq) {
        readyQueue = window.mParticle.config.rq;
    }

    if (window.mParticle.config.hasOwnProperty('isDebug')) {
        mParticle$1.isDebug = window.mParticle.config.isDebug;
    }

    if (window.mParticle.config.hasOwnProperty('isSandbox')) {
        mParticle$1.isSandbox = window.mParticle.config.isSandbox;
    }

    if (window.mParticle.config.hasOwnProperty('appName')) {
        appName = window.mParticle.config.appName;
    }

    if (window.mParticle.config.hasOwnProperty('appVersion')) {
        appVersion = window.mParticle.config.appVersion;
    }

    // Some forwarders require custom flags on initialization, so allow them to be set using config object
    if (window.mParticle.config.hasOwnProperty('customFlags')) {
        customFlags = window.mParticle.config.customFlags;
    }
}

window.mParticle = mParticle$1;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbInNyYy91dGlsaXRpZXMuanMiLCJzcmMvbWVzc2FnZXMuanMiLCJzcmMvY29va2llLmpzIiwic3JjL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgVXRpbGl0aWVzIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5wbHVzZXMgPSAvXFwrL2c7XG5cdH1cblxuXHRjcmVhdGVYSFIoY2IsIGxvZ0RlYnVnKSB7XG4gICAgICAgIHZhciB4aHI7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHhociA9IG5ldyB3aW5kb3cuWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgbG9nRGVidWcoJ0Vycm9yIGNyZWF0aW5nIFhNTEh0dHBSZXF1ZXN0IG9iamVjdC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh4aHIgJiYgY2IgJiYgXCJ3aXRoQ3JlZGVudGlhbHNcIiBpbiB4aHIpIHtcbiAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBjYjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygd2luZG93LlhEb21haW5SZXF1ZXN0ICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBsb2dEZWJ1ZygnQ3JlYXRpbmcgWERvbWFpblJlcXVlc3Qgb2JqZWN0Jyk7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgeGhyID0gbmV3IHdpbmRvdy5YRG9tYWluUmVxdWVzdCgpO1xuICAgICAgICAgICAgICAgIHhoci5vbmxvYWQgPSBjYjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgbG9nRGVidWcoJ0Vycm9yIGNyZWF0aW5nIFhEb21haW5SZXF1ZXN0IG9iamVjdCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHhocjtcbiAgICB9XG5cbiAgICBjcmVhdGVTZXJ2aWNlVXJsKHNlcnZpY2VTY2hlbWUsIHNlY3VyZVNlcnZpY2VVcmwsIHNlcnZpY2VVcmwsIGRldlRva2VuKSB7XG4gICAgICAgIHJldHVybiBzZXJ2aWNlU2NoZW1lICsgKCh3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgPT09ICdodHRwczonKSBcbiAgICAgICAgXHQ/IHNlY3VyZVNlcnZpY2VVcmwgOiBzZXJ2aWNlVXJsKSArIGRldlRva2VuO1xuICAgIH1cblxuICAgIGluQXJyYXkoaXRlbXMsIG5hbWUpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGl0ZW1zLmZpbmRJbmRleChuYW1lKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCAhPT0gLTE7XG4gICAgfVxuXG4gICAgY29udmVydGVkKHMpIHtcbiAgICAgICAgaWYgKHMuaW5kZXhPZignXCInKSA9PT0gMCkge1xuICAgICAgICAgICAgcyA9IHMuc2xpY2UoMSwgLTEpLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKS5yZXBsYWNlKC9cXFxcXFxcXC9nLCAnXFxcXCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfVxuXG4gICAgZGVjb2RlZChzKSB7XG5cbiAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzLnJlcGxhY2UodGhpcy5wbHVzZXMsICcgJykpO1xuICAgIH1cblxuICAgIGxvZ0RlYnVnKG1zZykge1xuICAgICAgICBpZiAobVBhcnRpY2xlLmlzRGVidWcgJiYgd2luZG93LmNvbnNvbGUgJiYgd2luZG93LmNvbnNvbGUubG9nKSB7XG4gICAgICAgICAgICB3aW5kb3cuY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzVUlXZWJWaWV3KG5hdmlnYXRvcikge1xuICAgICAgICByZXR1cm4gLyhpUGhvbmV8aVBvZHxpUGFkKS4qQXBwbGVXZWJLaXQoPyEuKlNhZmFyaSkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgIH1cblxuICAgIGlzV2ViVmlld0VtYmVkZGVkKG5hdmlnYXRvcikge1xuICAgICAgICByZXR1cm4gKHdpbmRvdy5leHRlcm5hbCAmJiB0eXBlb2YgKHdpbmRvdy5leHRlcm5hbC5Ob3RpZnkpID09PSAndW5rbm93bicpXG4gICAgICAgICAgICB8fCB3aW5kb3cubVBhcnRpY2xlQW5kcm9pZFxuICAgICAgICAgICAgfHwgdGhpcy5pc1VJV2ViVmlldyhuYXZpZ2F0b3IpXG4gICAgICAgICAgICB8fCB3aW5kb3cubVBhcnRpY2xlLmlzSU9TO1xuICAgIH1cblxufVxuXG5leHBvcnQgbGV0IHV0aWxpdGllcyA9IG5ldyBVdGlsaXRpZXMoKTsiLCJjbGFzcyBNZXNzYWdlc3tcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5FcnJvck1lc3NhZ2VzID0ge1xuXHRcdFx0Tm9Ub2tlbjogJ0EgdG9rZW4gbXVzdCBiZSBzcGVjaWZpZWQuJyxcblx0XHQgICAgRXZlbnROYW1lSW52YWxpZFR5cGU6ICdFdmVudCBuYW1lIG11c3QgYmUgYSB2YWxpZCBzdHJpbmcgdmFsdWUuJyxcblx0XHQgICAgRXZlbnREYXRhSW52YWxpZFR5cGU6ICdFdmVudCBkYXRhIG11c3QgYmUgYSB2YWxpZCBvYmplY3QgaGFzaC4nLFxuXHRcdCAgICBMb2dnaW5nRGlzYWJsZWQ6ICdFdmVudCBsb2dnaW5nIGlzIGN1cnJlbnRseSBkaXNhYmxlZC4nLFxuXHRcdCAgICBDb29raWVQYXJzZUVycm9yOiAnQ291bGQgbm90IHBhcnNlIGNvb2tpZScsXG5cdFx0ICAgIEV2ZW50RW1wdHk6ICdFdmVudCBvYmplY3QgaXMgbnVsbCBvciB1bmRlZmluZWQsIGNhbmNlbGxpbmcgc2VuZCcsXG5cdFx0ICAgIE5vRXZlbnRUeXBlOiAnRXZlbnQgdHlwZSBtdXN0IGJlIHNwZWNpZmllZC4nLFxuXHRcdCAgICBUcmFuc2FjdGlvbklkUmVxdWlyZWQ6ICdUcmFuc2FjdGlvbiBJRCBpcyByZXF1aXJlZCcsXG5cdFx0ICAgIFRyYW5zYWN0aW9uUmVxdWlyZWQ6ICdBIHRyYW5zYWN0aW9uIGF0dHJpYnV0ZXMgb2JqZWN0IGlzIHJlcXVpcmVkJyxcblx0XHQgICAgQmFkQXR0cmlidXRlOiAnQXR0cmlidXRlIHZhbHVlIGNhbm5vdCBiZSBvYmplY3Qgb3IgYXJyYXknXG5cdFx0fVxuXG5cdFx0dGhpcy5JbmZvcm1hdGlvbk1lc3NhZ2VzID0ge1xuXHRcdFx0Q29va2llU2VhcmNoOiAnU2VhcmNoaW5nIGZvciBjb29raWUnLFxuXHRcdCAgICBDb29raWVGb3VuZDogJ0Nvb2tpZSBmb3VuZCwgcGFyc2luZyB2YWx1ZXMnLFxuXHRcdCAgICBDb29raWVTZXQ6ICdTZXR0aW5nIGNvb2tpZScsXG5cdFx0ICAgIFNlbmRCZWdpbjogJ1N0YXJ0aW5nIHRvIHNlbmQgZXZlbnQnLFxuXHRcdCAgICBTZW5kV2luZG93c1Bob25lOiAnU2VuZGluZyBldmVudCB0byBXaW5kb3dzIFBob25lIGNvbnRhaW5lcicsXG5cdFx0ICAgIFNlbmRJT1M6ICdDYWxsaW5nIGlPUyBwYXRoOiAnLFxuXHRcdCAgICBTZW5kQW5kcm9pZDogJ0NhbGxpbmcgQW5kcm9pZCBKUyBpbnRlcmZhY2UgbWV0aG9kOiAnLFxuXHRcdCAgICBTZW5kSHR0cDogJ1NlbmRpbmcgZXZlbnQgdG8gbVBhcnRpY2xlIEhUVFAgc2VydmljZScsXG5cdFx0ICAgIFN0YXJ0aW5nTmV3U2Vzc2lvbjogJ1N0YXJ0aW5nIG5ldyBTZXNzaW9uJyxcblx0XHQgICAgU3RhcnRpbmdMb2dFdmVudDogJ1N0YXJ0aW5nIHRvIGxvZyBldmVudCcsXG5cdFx0ICAgIFN0YXJ0aW5nTG9nT3B0T3V0OiAnU3RhcnRpbmcgdG8gbG9nIHVzZXIgb3B0IGluL291dCcsXG5cdFx0ICAgIFN0YXJ0aW5nRW5kU2Vzc2lvbjogJ1N0YXJ0aW5nIHRvIGVuZCBzZXNzaW9uJyxcblx0XHQgICAgU3RhcnRpbmdJbml0aWFsaXphdGlvbjogJ1N0YXJ0aW5nIHRvIGluaXRpYWxpemUnLFxuXHRcdCAgICBTdGFydGluZ0xvZ0NvbW1lcmNlRXZlbnQ6ICdTdGFydGluZyB0byBsb2cgY29tbWVyY2UgZXZlbnQnLFxuXHRcdCAgICBMb2FkaW5nQ29uZmlnOiAnTG9hZGluZyBjb25maWd1cmF0aW9uIG9wdGlvbnMnLFxuXHRcdCAgICBBYmFuZG9uTG9nRXZlbnQ6ICdDYW5ub3QgbG9nIGV2ZW50LCBsb2dnaW5nIGRpc2FibGVkIG9yIGRldmVsb3BlciB0b2tlbiBub3Qgc2V0Jyxcblx0XHQgICAgQWJhbmRvblN0YXJ0U2Vzc2lvbjogJ0Nhbm5vdCBzdGFydCBzZXNzaW9uLCBsb2dnaW5nIGRpc2FibGVkIG9yIGRldmVsb3BlciB0b2tlbiBub3Qgc2V0Jyxcblx0XHQgICAgQWJhbmRvbkVuZFNlc3Npb246ICdDYW5ub3QgZW5kIHNlc3Npb24sIGxvZ2dpbmcgZGlzYWJsZWQgb3IgZGV2ZWxvcGVyIHRva2VuIG5vdCBzZXQnLFxuXHRcdCAgICBOb1Nlc3Npb25Ub0VuZDogJ0Nhbm5vdCBlbmQgc2Vzc2lvbiwgbm8gYWN0aXZlIHNlc3Npb24gZm91bmQnXG5cdFx0fVxuXHR9XG5cblx0Z2V0RXJyb3JNZXNzYWdlcyhrZXkpe1xuXHRcdFxuXHRcdHJldHVybiB0aGlzLkVycm9yTWVzc2FnZXNba2V5XTtcblx0fVxuXG5cdGdldEluZm9ybWF0aW9uTWVzc2FnZXMoa2V5KXtcblx0XHRyZXR1cm4gdGhpcy5JbmZvcm1hdGlvbk1lc3NhZ2VzW2tleV07XG5cdFx0Ly8gT2JqZWN0LmtleXModGhpcy5JbmZvcm1hdGlvbk1lc3NhZ2VzKS5tYXAoa2V5ID0+IHRoaXMuSW5mb3JtYXRpb25NZXNzYWdlc1trZXldKTtcblx0fVxufVxuXG5leHBvcnQgbGV0IG1lc3NhZ2VzID0gbmV3IE1lc3NhZ2VzKCk7IiwiaW1wb3J0IHt1dGlsaXRpZXN9IGZyb20gJy4vdXRpbGl0aWVzLmpzJztcbmltcG9ydCB7bWVzc2FnZXN9IGZyb20gJy4vbWVzc2FnZXMuanMnO1xuXG5jbGFzcyBDb29raWV7XG5cblx0Y29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0ge307XG4gICAgICAgIHRoaXMudmFsdWUgPSB7fTtcblx0fVxuXG5cdGdldENvb2tpZSgpIHtcbiAgICAgICAgbGV0IGNvb2tpZXMgPSB3aW5kb3cuZG9jdW1lbnQuY29va2llLnNwbGl0KCc7ICcpO1xuICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5jb25maWcuQ29va2llTmFtZSA/IHVuZGVmaW5lZCA6IHt9O1xuXG4gICAgICAgIHV0aWxpdGllcy5sb2dEZWJ1ZyhtZXNzYWdlcy5nZXRJbmZvcm1hdGlvbk1lc3NhZ2VzKCdDb29raWVTZWFyY2gnKSk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcGFydHMgPSBjb29raWVzW2ldLnNwbGl0KCc9Jyk7YGBcbiAgICAgICAgICAgIGxldCBuYW1lID0gdXRpbGl0aWVzLmRlY29kZWQocGFydHMuc2hpZnQoKSk7XG4gICAgICAgICAgICBsZXQgY29va2llID0gdXRpbGl0aWVzLmRlY29kZWQocGFydHMuam9pbignPScpKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlnLkNvb2tpZU5hbWUgJiYgdGhpcy5jb25maWcuQ29va2llTmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHV0aWxpdGllcy5jb252ZXJ0ZWQoY29va2llKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5Db29raWVOYW1lKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W25hbWVdID0gdXRpbGl0aWVzLmNvbnZlcnRlZChjb29raWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgdXRpbGl0aWVzLmxvZ0RlYnVnKG1lc3NhZ2VzLmdldEluZm9ybWF0aW9uTWVzc2FnZXMoJ0Nvb2tpZUZvdW5kJykpO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxldCBvYmogPSBKU09OLnBhcnNlKHJlc3VsdCk7XG5cbiAgICAgICAgICAgICAgICAvLyBMb25nZXIgbmFtZXMgYXJlIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgICAgIHNlc3Npb25JZCA9IG9iai5zaWQgfHwgb2JqLlNlc3Npb25JZCB8fCBzZXNzaW9uSWQ7XG4gICAgICAgICAgICAgICAgaXNFbmFibGVkID0gKHR5cGVvZiBvYmouaWUgIT0gJ3VuZGVmaW5lZCcpID8gb2JqLmllIDogb2JqLklzRW5hYmxlZDtcbiAgICAgICAgICAgICAgICBzZXNzaW9uQXR0cmlidXRlcyA9IG9iai5zYSB8fCBvYmouU2Vzc2lvbkF0dHJpYnV0ZXMgfHwgc2Vzc2lvbkF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAgICAgdXNlckF0dHJpYnV0ZXMgPSBvYmoudWEgfHwgb2JqLlVzZXJBdHRyaWJ1dGVzIHx8IHVzZXJBdHRyaWJ1dGVzO1xuICAgICAgICAgICAgICAgIHVzZXJJZGVudGl0aWVzID0gb2JqLnVpIHx8IG9iai5Vc2VySWRlbnRpdGllcyB8fCB1c2VySWRlbnRpdGllcztcbiAgICAgICAgICAgICAgICBzZXJ2ZXJTZXR0aW5ncyA9IG9iai5zcyB8fCBvYmouU2VydmVyU2V0dGluZ3MgfHwgc2VydmVyU2V0dGluZ3M7XG4gICAgICAgICAgICAgICAgZGV2VG9rZW4gPSBvYmouZHQgfHwgb2JqLkRldmVsb3BlclRva2VuIHx8IGRldlRva2VuO1xuXG4gICAgICAgICAgICAgICAgY2xpZW50SWQgPSBvYmouY2dpZCB8fCBnZW5lcmF0ZVVuaXF1ZUlkKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNFbmFibGVkICE9PSBmYWxzZSB8fCBpc0VuYWJsZWQgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAob2JqLmxlcykge1xuICAgICAgICAgICAgICAgICAgICBsYXN0RXZlbnRTZW50ID0gbmV3IERhdGUob2JqLmxlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG9iai5MYXN0RXZlbnRTZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RFdmVudFNlbnQgPSBuZXcgRGF0ZShvYmouTGFzdEV2ZW50U2VudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICB1dGlsaXRpZXMubG9nRGVidWcobWVzc2FnZXMuZ2V0RXJyb3JNZXNzYWdlcygnQ29va2llUGFyc2VFcnJvcicpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldENvb2tpZShjb25maWcsIHZhbHVlKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgbGV0IGV4cGlyZXMgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSArXG4gICAgICAgICAgICAgICAgKHRoaXMuY29uZmlnLkNvb2tpZUV4cGlyYXRpb24gKiAyNCAqIDYwICogNjAgKiAxMDAwKSkudG9HTVRTdHJpbmcoKTtcbiAgICAgICAgbGV0IGRvbWFpbiA9IHRoaXMuY29uZmlnLkNvb2tpZURvbWFpbiA/ICc7ZG9tYWluPScgKyB0aGlzLmNvbmZpZy5Db29raWVEb21haW4gOiAnJztcblxuICAgICAgICB1dGlsaXRpZXMubG9nRGVidWcobWVzc2FnZXMuZ2V0SW5mb3JtYXRpb25NZXNzYWdlcygnQ29va2llU2V0JykpO1xuXG4gICAgICAgIHdpbmRvdy5kb2N1bWVudC5jb29raWUgPVxuICAgICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuY29uZmlnLkNvb2tpZU5hbWUpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHRoaXMudmFsdWUpKSArXG4gICAgICAgICAgICAnO2V4cGlyZXM9JyArIGV4cGlyZXMgK1xuICAgICAgICAgICAgJztwYXRoPS8nICsgZG9tYWluO1xuICAgIH1cbn1cblxuZXhwb3J0IGxldCBjb29raWUgPSBuZXcgQ29va2llKCk7IiwiLy9cbi8vICBDb3B5cmlnaHQgMjAxNSBtUGFydGljbGUsIEluYy5cbi8vXG4vLyAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4vL1xuLy8gIFVzZXMgcG9ydGlvbnMgb2YgY29kZSBmcm9tIGpRdWVyeVxuLy8gIGpRdWVyeSB2MS4xMC4yIHwgKGMpIDIwMDUsIDIwMTMgalF1ZXJ5IEZvdW5kYXRpb24sIEluYy4gfCBqcXVlcnkub3JnL2xpY2Vuc2VcblxuaW1wb3J0IHt1dGlsaXRpZXN9IGZyb20gJy4vdXRpbGl0aWVzLmpzJztcbmltcG9ydCB7Y29va2llfSBmcm9tICcuL2Nvb2tpZS5qcyc7XG5pbXBvcnQge21lc3NhZ2VzfSBmcm9tICcuL21lc3NhZ2VzLmpzJztcblxudmFyIHNlcnZpY2VVcmwgPSBcImpzc2RrLm1wYXJ0aWNsZS5jb20vdjEvSlMvXCIsXG4gICAgc2VjdXJlU2VydmljZVVybCA9IFwianNzZGtzLm1wYXJ0aWNsZS5jb20vdjEvSlMvXCIsXG4gICAgc2VydmljZVNjaGVtZSA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArICcvLycsXG4gICAgc2RrVmVyc2lvbiA9ICcxLjguNycsXG4gICAgaXNFbmFibGVkID0gdHJ1ZSxcbiAgICBzZXNzaW9uQXR0cmlidXRlcyA9IHt9LFxuICAgIHVzZXJBdHRyaWJ1dGVzID0ge30sXG4gICAgdXNlcklkZW50aXRpZXMgPSBbXSxcbiAgICBmb3J3YXJkZXJDb25zdHJ1Y3RvcnMgPSBbXSxcbiAgICBmb3J3YXJkZXJzID0gW10sXG4gICAgc2Vzc2lvbklkLFxuICAgIGNsaWVudElkLFxuICAgIGRldlRva2VuLFxuICAgIHNlcnZlclNldHRpbmdzID0gbnVsbCxcbiAgICBsYXN0RXZlbnRTZW50LFxuICAgIGN1cnJlbnRQb3NpdGlvbixcbiAgICBpc1RyYWNraW5nID0gZmFsc2UsXG4gICAgd2F0Y2hQb3NpdGlvbklkLFxuICAgIHJlYWR5UXVldWUgPSBbXSxcbiAgICBpc0luaXRpYWxpemVkID0gZmFsc2UsXG4gICAgcHJvZHVjdHNCYWdzID0ge30sXG4gICAgY2FydFByb2R1Y3RzID0gW10sXG4gICAgY3VycmVuY3lDb2RlID0gbnVsbCxcbiAgICBNb2NrSHR0cFJlcXVlc3QgPSBudWxsLFxuICAgIGFwcFZlcnNpb24gPSBudWxsLFxuICAgIGFwcE5hbWUgPSBudWxsLFxuICAgIGN1c3RvbUZsYWdzID0gbnVsbCxcbiAgICBNRVRIT0RfTkFNRSA9ICckTWV0aG9kTmFtZScsXG4gICAgTE9HX0xUViA9ICdMb2dMVFZJbmNyZWFzZScsXG4gICAgUkVTRVJWRURfS0VZX0xUViA9ICckQW1vdW50JztcblxuLy8gZm9yRWFjaCBwb2x5ZmlsbFxuLy8gUHJvZHVjdGlvbiBzdGVwcyBvZiBFQ01BLTI2MiwgRWRpdGlvbiA1LCAxNS40LjQuMThcbi8vIFJlZmVyZW5jZTogaHR0cDovL2VzNS5naXRodWIuaW8vI3gxNS40LjQuMThcbi8vIFxuaWYgKCFBcnJheS5wcm90b3R5cGUuZm9yRWFjaCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgICAgdmFyIFQsIGs7XG5cbiAgICAgICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignIHRoaXMgaXMgbnVsbCBvciBub3QgZGVmaW5lZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XG4gICAgICAgIHZhciBsZW4gPSBPLmxlbmd0aCA+Pj4gMDtcblxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoY2FsbGJhY2sgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIFQgPSB0aGlzQXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgayA9IDA7XG5cbiAgICAgICAgd2hpbGUgKGsgPCBsZW4pIHtcbiAgICAgICAgICAgIHZhciBrVmFsdWU7XG4gICAgICAgICAgICBpZiAoayBpbiBPKSB7XG4gICAgICAgICAgICAgICAga1ZhbHVlID0gT1trXTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKFQsIGtWYWx1ZSwgaywgTyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrKys7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG4vLyBQcm9kdWN0aW9uIHN0ZXBzIG9mIEVDTUEtMjYyLCBFZGl0aW9uIDUsIDE1LjQuNC4xOVxuLy8gUmVmZXJlbmNlOiBodHRwOi8vZXM1LmdpdGh1Yi5pby8jeDE1LjQuNC4xOVxuaWYgKCFBcnJheS5wcm90b3R5cGUubWFwKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICAgIHZhciBULCBBLCBrO1xuXG4gICAgICAgIGlmICh0aGlzID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiIHRoaXMgaXMgbnVsbCBvciBub3QgZGVmaW5lZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBPID0gT2JqZWN0KHRoaXMpO1xuICAgICAgICB2YXIgbGVuID0gTy5sZW5ndGggPj4+IDA7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGNhbGxiYWNrICsgXCIgaXMgbm90IGEgZnVuY3Rpb25cIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIFQgPSB0aGlzQXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgQSA9IG5ldyBBcnJheShsZW4pO1xuXG4gICAgICAgIGsgPSAwO1xuXG4gICAgICAgIHdoaWxlIChrIDwgbGVuKSB7XG5cbiAgICAgICAgICAgIHZhciBrVmFsdWUsIG1hcHBlZFZhbHVlO1xuXG4gICAgICAgICAgICBpZiAoayBpbiBPKSB7XG5cbiAgICAgICAgICAgICAgICBrVmFsdWUgPSBPW2tdO1xuXG4gICAgICAgICAgICAgICAgbWFwcGVkVmFsdWUgPSBjYWxsYmFjay5jYWxsKFQsIGtWYWx1ZSwgaywgTyk7XG5cbiAgICAgICAgICAgICAgICBBW2tdID0gbWFwcGVkVmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGsrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBBO1xuICAgIH07XG59XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2lzQXJyYXlcbmlmICghQXJyYXkuaXNBcnJheSkge1xuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9O1xufVxuXG4vLyBTdGFuZGFsb25lIHZlcnNpb24gb2YgalF1ZXJ5LmV4dGVuZCwgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZGFuc2RvbS9leHRlbmRcbmZ1bmN0aW9uIGV4dGVuZCgpIHtcbiAgICB2YXIgb3B0aW9ucywgbmFtZSwgc3JjLCBjb3B5LCBjb3B5SXNBcnJheSwgY2xvbmUsXG4gICAgICAgIHRhcmdldCA9IGFyZ3VtZW50c1swXSB8fCB7fSxcbiAgICAgICAgaSA9IDEsXG4gICAgICAgIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsXG4gICAgICAgIGRlZXAgPSBmYWxzZSxcbiAgICAgICAgLy8gaGVscGVyIHdoaWNoIHJlcGxpY2F0ZXMgdGhlIGpxdWVyeSBpbnRlcm5hbCBmdW5jdGlvbnNcbiAgICAgICAgb2JqZWN0SGVscGVyID0ge1xuICAgICAgICAgICAgaGFzT3duOiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LFxuICAgICAgICAgICAgY2xhc3MydHlwZToge30sXG4gICAgICAgICAgICB0eXBlOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqID09IG51bGwgP1xuICAgICAgICAgICAgICAgICAgICBTdHJpbmcob2JqKSA6XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdEhlbHBlci5jbGFzczJ0eXBlW09iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopXSB8fCBcIm9iamVjdFwiO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzUGxhaW5PYmplY3Q6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgICAgICAgIGlmICghb2JqIHx8IG9iamVjdEhlbHBlci50eXBlKG9iaikgIT09IFwib2JqZWN0XCIgfHwgb2JqLm5vZGVUeXBlIHx8IG9iamVjdEhlbHBlci5pc1dpbmRvdyhvYmopKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2JqLmNvbnN0cnVjdG9yICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhb2JqZWN0SGVscGVyLmhhc093bi5jYWxsKG9iaiwgXCJjb25zdHJ1Y3RvclwiKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIW9iamVjdEhlbHBlci5oYXNPd24uY2FsbChvYmouY29uc3RydWN0b3IucHJvdG90eXBlLCBcImlzUHJvdG90eXBlT2ZcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBrZXk7XG4gICAgICAgICAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7IH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBrZXkgPT09IHVuZGVmaW5lZCB8fCBvYmplY3RIZWxwZXIuaGFzT3duLmNhbGwob2JqLCBrZXkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzQXJyYXk6IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdEhlbHBlci50eXBlKG9iaikgPT09IFwiYXJyYXlcIjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpc0Z1bmN0aW9uOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqZWN0SGVscGVyLnR5cGUob2JqKSA9PT0gXCJmdW5jdGlvblwiO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzV2luZG93OiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqICE9IG51bGwgJiYgb2JqID09IG9iai53aW5kb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07ICAvLyBlbmQgb2Ygb2JqZWN0SGVscGVyXG5cbiAgICAvLyBIYW5kbGUgYSBkZWVwIGNvcHkgc2l0dWF0aW9uXG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgIGRlZXAgPSB0YXJnZXQ7XG4gICAgICAgIHRhcmdldCA9IGFyZ3VtZW50c1sxXSB8fCB7fTtcbiAgICAgICAgLy8gc2tpcCB0aGUgYm9vbGVhbiBhbmQgdGhlIHRhcmdldFxuICAgICAgICBpID0gMjtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgY2FzZSB3aGVuIHRhcmdldCBpcyBhIHN0cmluZyBvciBzb21ldGhpbmcgKHBvc3NpYmxlIGluIGRlZXAgY29weSlcbiAgICBpZiAodHlwZW9mIHRhcmdldCAhPT0gXCJvYmplY3RcIiAmJiAhb2JqZWN0SGVscGVyLmlzRnVuY3Rpb24odGFyZ2V0KSkge1xuICAgICAgICB0YXJnZXQgPSB7fTtcbiAgICB9XG5cbiAgICAvLyBJZiBubyBzZWNvbmQgYXJndW1lbnQgaXMgdXNlZCB0aGVuIHRoaXMgY2FuIGV4dGVuZCBhbiBvYmplY3QgdGhhdCBpcyB1c2luZyB0aGlzIG1ldGhvZFxuICAgIGlmIChsZW5ndGggPT09IGkpIHtcbiAgICAgICAgdGFyZ2V0ID0gdGhpcztcbiAgICAgICAgLS1pO1xuICAgIH1cblxuICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gT25seSBkZWFsIHdpdGggbm9uLW51bGwvdW5kZWZpbmVkIHZhbHVlc1xuICAgICAgICBpZiAoKG9wdGlvbnMgPSBhcmd1bWVudHNbaV0pICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIEV4dGVuZCB0aGUgYmFzZSBvYmplY3RcbiAgICAgICAgICAgIGZvciAobmFtZSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgc3JjID0gdGFyZ2V0W25hbWVdO1xuICAgICAgICAgICAgICAgIGNvcHkgPSBvcHRpb25zW25hbWVdO1xuXG4gICAgICAgICAgICAgICAgLy8gUHJldmVudCBuZXZlci1lbmRpbmcgbG9vcFxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgPT09IGNvcHkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gUmVjdXJzZSBpZiB3ZSdyZSBtZXJnaW5nIHBsYWluIG9iamVjdHMgb3IgYXJyYXlzXG4gICAgICAgICAgICAgICAgaWYgKGRlZXAgJiYgY29weSAmJiAob2JqZWN0SGVscGVyLmlzUGxhaW5PYmplY3QoY29weSkgfHwgKGNvcHlJc0FycmF5ID0gb2JqZWN0SGVscGVyLmlzQXJyYXkoY29weSkpKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29weUlzQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvcHlJc0FycmF5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9uZSA9IHNyYyAmJiBvYmplY3RIZWxwZXIuaXNBcnJheShzcmMpID8gc3JjIDogW107XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lID0gc3JjICYmIG9iamVjdEhlbHBlci5pc1BsYWluT2JqZWN0KHNyYykgPyBzcmMgOiB7fTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIE5ldmVyIG1vdmUgb3JpZ2luYWwgb2JqZWN0cywgY2xvbmUgdGhlbVxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0gPSBleHRlbmQoZGVlcCwgY2xvbmUsIGNvcHkpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIERvbid0IGJyaW5nIGluIHVuZGVmaW5lZCB2YWx1ZXNcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvcHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0gPSBjb3B5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiB0aGUgbW9kaWZpZWQgb2JqZWN0XG4gICAgcmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gdHJ5TmF0aXZlU2RrKHBhdGgsIHZhbHVlKSB7XG4gICAgaWYgKHdpbmRvdy5tUGFydGljbGVBbmRyb2lkKSB7XG4gICAgICAgIHV0aWxpdGllcy5sb2dEZWJ1ZyhtZXNzYWdlcy5nZXRJbmZvcm1hdGlvbk1lc3NhZ2VzKCdTZW5kQW5kcm9pZCcpICsgcGF0aCk7XG4gICAgICAgIHdpbmRvdy5tUGFydGljbGVBbmRyb2lkW3BhdGhdKHZhbHVlKTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAod2luZG93Lm1QYXJ0aWNsZS5pc0lPUyB8fCB1dGlsaXRpZXMuaXNVSVdlYlZpZXcobmF2aWdhdG9yKSkge1xuICAgICAgICB1dGlsaXRpZXMubG9nRGVidWcobWVzc2FnZXMuZ2V0SW5mb3JtYXRpb25NZXNzYWdlcygnU2VuZElPUycpICsgcGF0aCk7XG4gICAgICAgIHZhciBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiSUZSQU1FXCIpO1xuICAgICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKFwic3JjXCIsICdtcC1zZGs6Ly8nICsgcGF0aCArICcvJyArIHZhbHVlKTtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gICAgICAgIGlmcmFtZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gICAgICAgIGlmcmFtZSA9IG51bGw7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBzZW5kKGV2ZW50KSB7XG4gICAgdmFyIHhocixcbiAgICAgICAgeGhyQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgICAgIHV0aWxpdGllcy5sb2dEZWJ1ZygnUmVjZWl2ZWQgJyArIHhoci5zdGF0dXNUZXh0ICsgJyBmcm9tIHNlcnZlcicpO1xuXG4gICAgICAgICAgICAgICAgcGFyc2VSZXNwb25zZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgIHV0aWxpdGllcy5sb2dEZWJ1ZyhtZXNzYWdlcy5nZXRJbmZvcm1hdGlvbk1lc3NhZ2VzKCdTZW5kQmVnaW4nKSk7XG5cbiAgICBpZiAoIWV2ZW50KSB7XG4gICAgICAgICAgICB1dGlsaXRpZXMubG9nRGVidWcobWVzc2FnZXMuZ2V0RXJyb3JNZXNzYWdlcygnRXZlbnRFbXB0eScpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdHJ5TmF0aXZlU2RrKE5hdGl2ZVNka1BhdGhzLkxvZ0V2ZW50LCBKU09OLnN0cmluZ2lmeShldmVudCkpKSB7XG4gICAgICAgIHV0aWxpdGllcy5sb2dEZWJ1ZyhtZXNzYWdlcy5nZXRJbmZvcm1hdGlvbk1lc3NhZ2VzKCdTZW5kSHR0cCcpKTtcbiAgICAgICAgXG4gICAgICAgIHhociA9IHV0aWxpdGllcy5jcmVhdGVYSFIoeGhyQ2FsbGJhY2spO1xuXG4gICAgICAgIGlmICh4aHIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgeGhyLm9wZW4oJ3Bvc3QnLCB1dGlsaXRpZXMuY3JlYXRlU2VydmljZVVybChzZXJ2aWNlU2NoZW1lLCBzZWN1cmVTZXJ2aWNlVXJsLCBzZXJ2aWNlVXJsLCBkZXZUb2tlbikgKyAnL0V2ZW50cycpO1xuICAgICAgICAgICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KGNvbnZlcnRFdmVudFRvRFRPKGV2ZW50KSkpO1xuXG4gICAgICAgICAgICAgICAgc2VuZEV2ZW50VG9Gb3J3YXJkZXJzKGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdXRpbGl0aWVzLmxvZ0RlYnVnKCdFcnJvciBzZW5kaW5nIGV2ZW50IHRvIG1QYXJ0aWNsZSBzZXJ2ZXJzLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzZW5kRm9yd2FyZGluZ1N0YXRzKGZvcndhcmRlciwgZXZlbnQpIHtcbiAgICB2YXIgeGhyLFxuICAgICAgICBmb3J3YXJkaW5nU3RhdDtcblxuICAgIGlmIChmb3J3YXJkZXIgJiYgZm9yd2FyZGVyLmlzVmlzaWJsZSkge1xuICAgICAgICB4aHIgPSB1dGlsaXRpZXMuY3JlYXRlWEhSKCk7XG4gICAgICAgIGZvcndhcmRpbmdTdGF0ID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgbWlkOiBmb3J3YXJkZXIuaWQsXG4gICAgICAgICAgICBuOiBldmVudC5FdmVudE5hbWUsXG4gICAgICAgICAgICBhdHRyczogZXZlbnQuRXZlbnRBdHRyaWJ1dGVzLFxuICAgICAgICAgICAgc2RrOiBldmVudC5TREtWZXJzaW9uLFxuICAgICAgICAgICAgZHQ6IGV2ZW50LkV2ZW50RGF0YVR5cGUsXG4gICAgICAgICAgICBldDogZXZlbnQuRXZlbnRDYXRlZ29yeSxcbiAgICAgICAgICAgIGRiZzogZXZlbnQuRGVidWcsXG4gICAgICAgICAgICBjdDogZXZlbnQuVGltZXN0YW1wLFxuICAgICAgICAgICAgZWVjOiBldmVudC5FeHBhbmRlZEV2ZW50Q291bnRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHhocikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB4aHIub3BlbigncG9zdCcsIHV0aWxpdGllcy5jcmVhdGVTZXJ2aWNlVXJsKHNlcnZpY2VTY2hlbWUsIHNlY3VyZVNlcnZpY2VVcmwsIHNlcnZpY2VVcmwsIGRldlRva2VuKSArICcvRm9yd2FyZGluZycpO1xuICAgICAgICAgICAgICAgIHhoci5zZW5kKGZvcndhcmRpbmdTdGF0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdXRpbGl0aWVzLmxvZ0RlYnVnKCdFcnJvciBzZW5kaW5nIGZvcndhcmRpbmcgc3RhdHMgdG8gbVBhcnRpY2xlIHNlcnZlcnMuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFwcGx5VG9Gb3J3YXJkZXJzKGZ1bmN0aW9uTmFtZSwgZnVuY3Rpb25BcmdzKSB7XG4gICAgaWYgKGZvcndhcmRlcnMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmb3J3YXJkZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZm9yd2FyZGVyRnVuY3Rpb24gPSBmb3J3YXJkZXJzW2ldW2Z1bmN0aW9uTmFtZV07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChmb3J3YXJkZXJGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBmb3J3YXJkZXJzW2ldW2Z1bmN0aW9uTmFtZV0oZm9yd2FyZGVyc1tpXSwgZnVuY3Rpb25BcmdzKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlsaXRpZXMubG9nRGVidWcocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHV0aWxpdGllcy5sb2dEZWJ1ZyhlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNlbmRFdmVudFRvRm9yd2FyZGVycyhldmVudCkge1xuICAgIHZhciBjbG9uZWRFdmVudCxcbiAgICAgICAgaGFzaGVkTmFtZSxcbiAgICAgICAgaGFzaGVkVHlwZSxcbiAgICAgICAgZmlsdGVyVXNlckF0dHJpYnV0ZXMgPSBmdW5jdGlvbihldmVudCwgZmlsdGVyTGlzdCkge1xuICAgICAgICAgICAgdmFyIGhhc2g7XG5cbiAgICAgICAgICAgIGlmIChldmVudC5Vc2VyQXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGF0dHJOYW1lIGluIGV2ZW50LlVzZXJBdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5Vc2VyQXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShhdHRyTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc2ggPSBnZW5lcmF0ZUhhc2goYXR0ck5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXRpbGl0aWVzLmluQXJyYXkoZmlsdGVyTGlzdCwgaGFzaCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgZXZlbnQuVXNlckF0dHJpYnV0ZXNbYXR0ck5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmaWx0ZXJVc2VySWRlbnRpdGllcyA9IGZ1bmN0aW9uKGV2ZW50LCBmaWx0ZXJMaXN0KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuVXNlcklkZW50aXRpZXMgJiYgZXZlbnQuVXNlcklkZW50aXRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnQuVXNlcklkZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHV0aWxpdGllcy5pbkFycmF5KGZpbHRlckxpc3QsIGV2ZW50LlVzZXJJZGVudGl0aWVzW2ldLlR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5Vc2VySWRlbnRpdGllcy5zcGxpY2UoaSwgMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZmlsdGVyQXR0cmlidXRlcyA9IGZ1bmN0aW9uKGV2ZW50LCBmaWx0ZXJMaXN0KSB7XG4gICAgICAgICAgICB2YXIgaGFzaDtcblxuICAgICAgICAgICAgaWYgKCFmaWx0ZXJMaXN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBhdHRyTmFtZSBpbiBldmVudC5FdmVudEF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuRXZlbnRBdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGF0dHJOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBoYXNoID0gZ2VuZXJhdGVIYXNoKGV2ZW50LkV2ZW50Q2F0ZWdvcnkgKyBldmVudC5FdmVudE5hbWUgKyBhdHRyTmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHV0aWxpdGllcy5pbkFycmF5KGZpbHRlckxpc3QsIGhhc2gpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgZXZlbnQuRXZlbnRBdHRyaWJ1dGVzW2F0dHJOYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaW5GaWx0ZXJlZExpc3QgPSBmdW5jdGlvbihmaWx0ZXJMaXN0LCBoYXNoKSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyTGlzdCAmJiBmaWx0ZXJMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAodXRpbGl0aWVzLmluQXJyYXkoZmlsdGVyTGlzdCwgaGFzaCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIGZvcndhcmRpbmdSdWxlTWVzc2FnZVR5cGVzID0gW1xuICAgICAgICAgICAgTWVzc2FnZVR5cGUuUGFnZUV2ZW50LFxuICAgICAgICAgICAgTWVzc2FnZVR5cGUuUGFnZVZpZXcsXG4gICAgICAgICAgICBNZXNzYWdlVHlwZS5Db21tZXJjZVxuICAgICAgICBdO1xuXG4gICAgaWYgKCF1dGlsaXRpZXMuaXNXZWJWaWV3RW1iZWRkZWQobmF2aWdhdG9yKSAmJiBmb3J3YXJkZXJzKSB7XG4gICAgICAgIGhhc2hlZE5hbWUgPSBnZW5lcmF0ZUhhc2goZXZlbnQuRXZlbnRDYXRlZ29yeSArIGV2ZW50LkV2ZW50TmFtZSk7XG4gICAgICAgIGhhc2hlZFR5cGUgPSBnZW5lcmF0ZUhhc2goZXZlbnQuRXZlbnRDYXRlZ29yeSk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmb3J3YXJkZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuRGVidWcgPT09IHRydWUgJiYgZm9yd2FyZGVyc1tpXS5pc1NhbmRib3ggPT09IGZhbHNlICYmIGZvcndhcmRlcnNbaV0uaGFzU2FuZGJveCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZXZlbnQuRGVidWcgPT09IGZhbHNlICYmIGZvcndhcmRlcnNbaV0uaXNTYW5kYm94ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGF0dHJpYnV0ZSBmb3J3YXJkaW5nIHJ1bGUuIFRoaXMgcnVsZSBhbGxvd3MgdXNlcnMgdG8gb25seSBmb3J3YXJkIGFuIGV2ZW50IGlmIGEgXG4gICAgICAgICAgICAvLyBzcGVjaWZpYyBhdHRyaWJ1dGUgZXhpc3RzIGFuZCBoYXMgYSBzcGVjaWZpYyB2YWx1ZS4gQWx0ZXJuYXRpdmVseSwgdGhleSBjYW4gc3BlY2lmeSBcbiAgICAgICAgICAgIC8vIHRoYXQgYW4gZXZlbnQgbm90IGJlIGZvcndhcmRlZCBpZiB0aGUgc3BlY2lmaWVkIGF0dHJpYnV0ZSBuYW1lIGFuZCB2YWx1ZSBleGlzdHMuXG4gICAgICAgICAgICAvLyBUaGUgdHdvIGNhc2VzIGFyZSBjb250cm9sbGVkIGJ5IHRoZSBcImluY2x1ZGVPbk1hdGNoXCIgYm9vbGVhbiB2YWx1ZS5cbiAgICAgICAgICAgIC8vIFN1cHBvcnRlZCBtZXNzYWdlIHR5cGVzIGZvciBhdHRyaWJ1dGUgZm9yd2FyZGluZyBydWxlcyBhcmUgZGVmaW5lZCBpbiB0aGUgZm9yd2FyZGluZ1J1bGVNZXNzYWdlVHlwZXMgYXJyYXlcblxuICAgICAgICAgICAgaWYgKGZvcndhcmRpbmdSdWxlTWVzc2FnZVR5cGVzLmluZGV4T2YoZXZlbnQuRXZlbnREYXRhVHlwZSkgPiAtMVxuICAgICAgICAgICAgICAgICYmIGZvcndhcmRlcnNbaV0uZmlsdGVyaW5nRXZlbnRBdHRyaWJ1dGVWYWx1ZVxuICAgICAgICAgICAgICAgICYmIGZvcndhcmRlcnNbaV0uZmlsdGVyaW5nRXZlbnRBdHRyaWJ1dGVWYWx1ZS5ldmVudEF0dHJpYnV0ZU5hbWVcbiAgICAgICAgICAgICAgICAmJiBmb3J3YXJkZXJzW2ldLmZpbHRlcmluZ0V2ZW50QXR0cmlidXRlVmFsdWUuZXZlbnRBdHRyaWJ1dGVWYWx1ZSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIGZvdW5kUHJvcCA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAvLyBBdHRlbXB0IHRvIGZpbmQgdGhlIGF0dHJpYnV0ZSBpbiB0aGUgY29sbGVjdGlvbiBvZiBldmVudCBhdHRyaWJ1dGVzXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LkV2ZW50QXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIGV2ZW50LkV2ZW50QXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhhc2hlZE5hbWUgPSBnZW5lcmF0ZUhhc2gocHJvcCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNoZWROYW1lID09IGZvcndhcmRlcnNbaV0uZmlsdGVyaW5nRXZlbnRBdHRyaWJ1dGVWYWx1ZS5ldmVudEF0dHJpYnV0ZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZFByb3AgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGhhc2hlZE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBnZW5lcmF0ZUhhc2goZXZlbnQuRXZlbnRBdHRyaWJ1dGVzW3Byb3BdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGlzTWF0Y2ggPSBmb3VuZFByb3AgIT0gbnVsbFxuICAgICAgICAgICAgICAgICAgICAmJiBmb3VuZFByb3AudmFsdWUgPT0gZm9yd2FyZGVyc1tpXS5maWx0ZXJpbmdFdmVudEF0dHJpYnV0ZVZhbHVlLmV2ZW50QXR0cmlidXRlVmFsdWU7XG5cbiAgICAgICAgICAgICAgICB2YXIgc2hvdWxkSW5jbHVkZSA9XG4gICAgICAgICAgICAgICAgICAgIGZvcndhcmRlcnNbaV0uZmlsdGVyaW5nRXZlbnRBdHRyaWJ1dGVWYWx1ZS5pbmNsdWRlT25NYXRjaCA9PT0gdHJ1ZSA/IGlzTWF0Y2ggOiAhaXNNYXRjaDtcblxuICAgICAgICAgICAgICAgIGlmICghc2hvdWxkSW5jbHVkZSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENsb25lIHRoZSBldmVudCBvYmplY3QsIGFzIHdlIGNvdWxkIGJlIHNlbmRpbmcgZGlmZmVyZW50IGF0dHJpYnV0ZXMgdG8gZWFjaCBmb3J3YXJkZXJcbiAgICAgICAgICAgIGNsb25lZEV2ZW50ID0ge307XG4gICAgICAgICAgICBjbG9uZWRFdmVudCA9IGV4dGVuZCh0cnVlLCBjbG9uZWRFdmVudCwgZXZlbnQpO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBldmVudCBmaWx0ZXJpbmcgcnVsZXNcbiAgICAgICAgICAgIGlmIChldmVudC5FdmVudERhdGFUeXBlID09IE1lc3NhZ2VUeXBlLlBhZ2VFdmVudFxuICAgICAgICAgICAgICAgICYmIChpbkZpbHRlcmVkTGlzdChmb3J3YXJkZXJzW2ldLmV2ZW50TmFtZUZpbHRlcnMsIGhhc2hlZE5hbWUpXG4gICAgICAgICAgICAgICAgICAgIHx8IGluRmlsdGVyZWRMaXN0KGZvcndhcmRlcnNbaV0uZXZlbnRUeXBlRmlsdGVycywgaGFzaGVkVHlwZSkpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChldmVudC5FdmVudERhdGFUeXBlID09IE1lc3NhZ2VUeXBlLkNvbW1lcmNlICYmIGluRmlsdGVyZWRMaXN0KGZvcndhcmRlcnNbaV0uZXZlbnRUeXBlRmlsdGVycywgaGFzaGVkVHlwZSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGV2ZW50LkV2ZW50RGF0YVR5cGUgPT0gTWVzc2FnZVR5cGUuUGFnZVZpZXcgJiYgaW5GaWx0ZXJlZExpc3QoZm9yd2FyZGVyc1tpXS5wYWdlVmlld0ZpbHRlcnMsIGhhc2hlZE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGF0dHJpYnV0ZSBmaWx0ZXJpbmcgcnVsZXNcbiAgICAgICAgICAgIGlmIChjbG9uZWRFdmVudC5FdmVudEF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuRXZlbnREYXRhVHlwZSA9PSBNZXNzYWdlVHlwZS5QYWdlRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyQXR0cmlidXRlcyhjbG9uZWRFdmVudCwgZm9yd2FyZGVyc1tpXS5hdHRyaWJ1dGVGaWx0ZXJzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZXZlbnQuRXZlbnREYXRhVHlwZSA9PSBNZXNzYWdlVHlwZS5QYWdlVmlldykge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJBdHRyaWJ1dGVzKGNsb25lZEV2ZW50LCBmb3J3YXJkZXJzW2ldLnBhZ2VWaWV3QXR0cmlidXRlRmlsdGVycyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDaGVjayB1c2VyIGlkZW50aXR5IGZpbHRlcmluZyBydWxlc1xuICAgICAgICAgICAgZmlsdGVyVXNlcklkZW50aXRpZXMoY2xvbmVkRXZlbnQsIGZvcndhcmRlcnNbaV0udXNlcklkZW50aXR5RmlsdGVycyk7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIHVzZXIgYXR0cmlidXRlIGZpbHRlcmluZyBydWxlc1xuICAgICAgICAgICAgZmlsdGVyVXNlckF0dHJpYnV0ZXMoY2xvbmVkRXZlbnQsIGZvcndhcmRlcnNbaV0udXNlckF0dHJpYnV0ZUZpbHRlcnMpO1xuXG4gICAgICAgICAgICB1dGlsaXRpZXMubG9nRGVidWcoJ1NlbmRpbmcgbWVzc2FnZSB0byBmb3J3YXJkZXI6ICcgKyBmb3J3YXJkZXJzW2ldLm5hbWUpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGZvcndhcmRlcnNbaV0ucHJvY2VzcyhjbG9uZWRFdmVudCk7XG5cbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB1dGlsaXRpZXMubG9nRGVidWcocmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gaW5pdEZvcndhcmRlcnMoKSB7XG4gICAgaWYgKCF1dGlsaXRpZXMuaXNXZWJWaWV3RW1iZWRkZWQobmF2aWdhdG9yKSAmJiBmb3J3YXJkZXJzKSB7XG5cbiAgICAgICAgLy8gU29tZSBqcyBsaWJyYXJpZXMgcmVxdWlyZSB0aGF0IHRoZXkgYmUgbG9hZGVkIGZpcnN0LCBvciBsYXN0LCBldGNcbiAgICAgICAgZm9yd2FyZGVycy5zb3J0KGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgICAgICAgIHguc2V0dGluZ3MuUHJpb3JpdHlWYWx1ZSA9IHguc2V0dGluZ3MuUHJpb3JpdHlWYWx1ZSB8fCAwO1xuICAgICAgICAgICAgeS5zZXR0aW5ncy5Qcmlvcml0eVZhbHVlID0geS5zZXR0aW5ncy5Qcmlvcml0eVZhbHVlIHx8IDA7XG4gICAgICAgICAgICByZXR1cm4gLTEgKiAoeC5zZXR0aW5ncy5Qcmlvcml0eVZhbHVlIC0geS5zZXR0aW5ncy5Qcmlvcml0eVZhbHVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmb3J3YXJkZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZm9yd2FyZGVyc1tpXS5pc1NhbmRib3ggPT09IG1QYXJ0aWNsZS5pc1NhbmRib3ggfHxcbiAgICAgICAgICAgICAgICAoIWZvcndhcmRlcnNbaV0uaXNTYW5kYm94ICYmICFmb3J3YXJkZXJzW2ldLmhhc1NhbmRib3gpKSB7XG4gICAgICAgICAgICAgICAgZm9yd2FyZGVyc1tpXS5pbml0KGZvcndhcmRlcnNbaV0uc2V0dGluZ3MsXG4gICAgICAgICAgICAgICAgICAgIHNlbmRGb3J3YXJkaW5nU3RhdHMsXG4gICAgICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICB1c2VyQXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkZW50aXRpZXMsXG4gICAgICAgICAgICAgICAgICAgIGFwcFZlcnNpb24sXG4gICAgICAgICAgICAgICAgICAgIGFwcE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbUZsYWdzLFxuICAgICAgICAgICAgICAgICAgICBjbGllbnRJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlUmVzcG9uc2UocmVzcG9uc2VUZXh0KSB7XG4gICAgdmFyIG5vdyA9IG5ldyBEYXRlKCksXG4gICAgICAgIHNldHRpbmdzLFxuICAgICAgICBwcm9wLFxuICAgICAgICBmdWxsUHJvcDtcblxuICAgIGlmICghcmVzcG9uc2VUZXh0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgICB1dGlsaXRpZXMubG9nRGVidWcoJ1BhcnNpbmcgcmVzcG9uc2UgZnJvbSBzZXJ2ZXInKTtcblxuICAgICAgICBzZXR0aW5ncyA9IEpTT04ucGFyc2UocmVzcG9uc2VUZXh0KTtcblxuICAgICAgICBpZiAoc2V0dGluZ3MgJiYgc2V0dGluZ3MuU3RvcmUpIHtcbiAgICAgICAgICAgIHV0aWxpdGllcy5sb2dEZWJ1ZygnUGFyc2VkIHN0b3JlIGZyb20gcmVzcG9uc2UsIHVwZGF0aW5nIGxvY2FsIHNldHRpbmdzJyk7XG5cbiAgICAgICAgICAgIGlmKHNlcnZlclNldHRpbmdzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgc2VydmVyU2V0dGluZ3MgPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChwcm9wIGluIHNldHRpbmdzLlN0b3JlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzZXR0aW5ncy5TdG9yZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmdWxsUHJvcCA9IHNldHRpbmdzLlN0b3JlW3Byb3BdO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFmdWxsUHJvcC5WYWx1ZSB8fCBuZXcgRGF0ZShmdWxsUHJvcC5FeHBpcmVzKSA8IG5vdykge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHNldHRpbmcgc2hvdWxkIGJlIGRlbGV0ZWQgZnJvbSB0aGUgbG9jYWwgc3RvcmUgaWYgaXQgZXhpc3RzXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlcnZlclNldHRpbmdzLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2VydmVyU2V0dGluZ3NbcHJvcF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSB2YWxpZCBzZXR0aW5nXG5cbiAgICAgICAgICAgICAgICAgICAgc2VydmVyU2V0dGluZ3NbcHJvcF0gPSBmdWxsUHJvcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvb2tpZS5zZXRDb29raWUoXG4gICAgICAgICAgICAgICAgQ29uZmlnLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgc2lkOiBzZXNzaW9uSWQsIGllOiBpc0VuYWJsZWQsIHNhOiBzZXNzaW9uQXR0cmlidXRlcywgXG4gICAgICAgICAgICAgICAgICAgIHVhOiB1c2VyQXR0cmlidXRlcywgdWk6IHVzZXJJZGVudGl0aWVzLCBzczogc2VydmVyU2V0dGluZ3MsIGR0OiBkZXZUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgbGVzOiBsYXN0RXZlbnRTZW50ID8gbGFzdEV2ZW50U2VudC5nZXRUaW1lKCkgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBhdjogYXBwVmVyc2lvbixcbiAgICAgICAgICAgICAgICAgICAgY2dpZDogY2xpZW50SWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIHV0aWxpdGllcy5sb2dEZWJ1ZyhcIkVycm9yIHBhcnNpbmcgSlNPTiByZXNwb25zZSBmcm9tIHNlcnZlcjogXCIgKyBlLm5hbWUpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc3RhcnRUcmFja2luZygpIHtcbiAgICBpZiAoIWlzVHJhY2tpbmcpIHtcbiAgICAgICAgaWYgKFwiZ2VvbG9jYXRpb25cIiBpbiBuYXZpZ2F0b3IpIHtcbiAgICAgICAgICAgIHdhdGNoUG9zaXRpb25JZCA9IG5hdmlnYXRvci5nZW9sb2NhdGlvbi53YXRjaFBvc2l0aW9uKGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFBvc2l0aW9uID0ge1xuICAgICAgICAgICAgICAgICAgICBsYXQ6IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgICAgICAgICAgICAgbG5nOiBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpc1RyYWNraW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc3RvcFRyYWNraW5nKCkge1xuICAgIGlmIChpc1RyYWNraW5nKSB7XG4gICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5jbGVhcldhdGNoKHdhdGNoUG9zaXRpb25JZCk7XG4gICAgICAgIGN1cnJlbnRQb3NpdGlvbiA9IG51bGw7XG4gICAgICAgIGlzVHJhY2tpbmcgPSBmYWxzZTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRDdXN0b21GbGFncyhldmVudCwgZHRvKSB7XG4gICAgdmFyIHZhbHVlQXJyYXkgPSBbXTtcbiAgICBkdG8uZmxhZ3MgPSB7fTtcblxuICAgIGZvciAodmFyIHByb3AgaW4gZXZlbnQuQ3VzdG9tRmxhZ3MpIHtcbiAgICAgICAgdmFsdWVBcnJheSA9IFtdO1xuXG4gICAgICAgIGlmIChldmVudC5DdXN0b21GbGFncy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZXZlbnQuQ3VzdG9tRmxhZ3NbcHJvcF0pKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBldmVudC5DdXN0b21GbGFnc1twcm9wXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGV2ZW50LkN1c3RvbUZsYWdzW3Byb3BdW2ldID09PSAnbnVtYmVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfHwgdHlwZW9mIGV2ZW50LkN1c3RvbUZsYWdzW3Byb3BdW2ldID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfHwgdHlwZW9mIGV2ZW50LkN1c3RvbUZsYWdzW3Byb3BdW2ldID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlQXJyYXkucHVzaChldmVudC5DdXN0b21GbGFnc1twcm9wXVtpXS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBldmVudC5DdXN0b21GbGFnc1twcm9wXSA9PT0gJ251bWJlcidcbiAgICAgICAgICAgICAgICB8fCB0eXBlb2YgZXZlbnQuQ3VzdG9tRmxhZ3NbcHJvcF0gPT09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgfHwgdHlwZW9mIGV2ZW50LkN1c3RvbUZsYWdzW3Byb3BdID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZUFycmF5LnB1c2goZXZlbnQuQ3VzdG9tRmxhZ3NbcHJvcF0udG9TdHJpbmcoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZUFycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBkdG8uZmxhZ3NbcHJvcF0gPSB2YWx1ZUFycmF5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjb252ZXJ0RXZlbnRUb0RUTyhldmVudCkge1xuICAgIHZhciBkdG8gPSB7XG4gICAgICAgIG46IGV2ZW50LkV2ZW50TmFtZSxcbiAgICAgICAgZXQ6IGV2ZW50LkV2ZW50Q2F0ZWdvcnksXG4gICAgICAgIHVhOiBldmVudC5Vc2VyQXR0cmlidXRlcyxcbiAgICAgICAgc2E6IGV2ZW50LlNlc3Npb25BdHRyaWJ1dGVzLFxuICAgICAgICB1aTogZXZlbnQuVXNlcklkZW50aXRpZXMsXG4gICAgICAgIHN0cjogZXZlbnQuU3RvcmUsXG4gICAgICAgIGF0dHJzOiBldmVudC5FdmVudEF0dHJpYnV0ZXMsXG4gICAgICAgIHNkazogZXZlbnQuU0RLVmVyc2lvbixcbiAgICAgICAgc2lkOiBldmVudC5TZXNzaW9uSWQsXG4gICAgICAgIGR0OiBldmVudC5FdmVudERhdGFUeXBlLFxuICAgICAgICBkYmc6IGV2ZW50LkRlYnVnLFxuICAgICAgICBjdDogZXZlbnQuVGltZXN0YW1wLFxuICAgICAgICBsYzogZXZlbnQuTG9jYXRpb24sXG4gICAgICAgIG86IGV2ZW50Lk9wdE91dCxcbiAgICAgICAgZWVjOiBldmVudC5FeHBhbmRlZEV2ZW50Q291bnQsXG4gICAgICAgIGF2OiBldmVudC5BcHBWZXJzaW9uLFxuICAgICAgICBjZ2lkOiBldmVudC5DbGllbnRHZW5lcmF0ZWRJZFxuICAgIH07XG5cbiAgICBpZiAoZXZlbnQuQ3VzdG9tRmxhZ3MpIHtcbiAgICAgICAgY29udmVydEN1c3RvbUZsYWdzKGV2ZW50LCBkdG8pO1xuICAgIH1cblxuICAgIGR0by5wYiA9IGNvbnZlcnRQcm9kdWN0QmFnVG9EVE8oKTtcblxuICAgIGlmIChldmVudC5FdmVudERhdGFUeXBlID09IE1lc3NhZ2VUeXBlLkNvbW1lcmNlKSB7XG4gICAgICAgIGR0by5jdSA9IGN1cnJlbmN5Q29kZTtcblxuICAgICAgICBpZiAoZXZlbnQuU2hvcHBpbmdDYXJ0KSB7XG4gICAgICAgICAgICBkdG8uc2MgPSB7XG4gICAgICAgICAgICAgICAgcGw6IGNvbnZlcnRQcm9kdWN0TGlzdFRvRFRPKGV2ZW50LlNob3BwaW5nQ2FydC5Qcm9kdWN0TGlzdClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudC5Qcm9kdWN0QWN0aW9uKSB7XG4gICAgICAgICAgICBkdG8ucGQgPSB7XG4gICAgICAgICAgICAgICAgYW46IGV2ZW50LlByb2R1Y3RBY3Rpb24uUHJvZHVjdEFjdGlvblR5cGUsXG4gICAgICAgICAgICAgICAgY3M6IGV2ZW50LlByb2R1Y3RBY3Rpb24uQ2hlY2tvdXRTdGVwLFxuICAgICAgICAgICAgICAgIGNvOiBldmVudC5Qcm9kdWN0QWN0aW9uLkNoZWNrb3V0T3B0aW9ucyxcbiAgICAgICAgICAgICAgICBwbDogY29udmVydFByb2R1Y3RMaXN0VG9EVE8oZXZlbnQuUHJvZHVjdEFjdGlvbi5Qcm9kdWN0TGlzdCksXG4gICAgICAgICAgICAgICAgdGk6IGV2ZW50LlByb2R1Y3RBY3Rpb24uVHJhbnNhY3Rpb25JZCxcbiAgICAgICAgICAgICAgICB0YTogZXZlbnQuUHJvZHVjdEFjdGlvbi5BZmZpbGlhdGlvbixcbiAgICAgICAgICAgICAgICB0Y2M6IGV2ZW50LlByb2R1Y3RBY3Rpb24uQ291cG9uQ29kZSxcbiAgICAgICAgICAgICAgICB0cjogZXZlbnQuUHJvZHVjdEFjdGlvbi5Ub3RhbEFtb3VudCxcbiAgICAgICAgICAgICAgICB0czogZXZlbnQuUHJvZHVjdEFjdGlvbi5TaGlwcGluZ0Ftb3VudCxcbiAgICAgICAgICAgICAgICB0dDogZXZlbnQuUHJvZHVjdEFjdGlvbi5UYXhBbW91bnRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZXZlbnQuUHJvbW90aW9uQWN0aW9uKSB7XG4gICAgICAgICAgICBkdG8ucG0gPSB7XG4gICAgICAgICAgICAgICAgYW46IGV2ZW50LlByb21vdGlvbkFjdGlvbi5Qcm9tb3Rpb25BY3Rpb25UeXBlLFxuICAgICAgICAgICAgICAgIHBsOiBldmVudC5Qcm9tb3Rpb25BY3Rpb24uUHJvbW90aW9uTGlzdC5tYXAoZnVuY3Rpb24ocHJvbW90aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogcHJvbW90aW9uLklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm06IHByb21vdGlvbi5OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3I6IHByb21vdGlvbi5DcmVhdGl2ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBzOiBwcm9tb3Rpb24uUG9zaXRpb24gPT0gbnVsbCA/IDAgOiBwcm9tb3Rpb24uUG9zaXRpb25cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChldmVudC5Qcm9kdWN0SW1wcmVzc2lvbnMpIHtcbiAgICAgICAgICAgIGR0by5waSA9IGV2ZW50LlByb2R1Y3RJbXByZXNzaW9ucy5tYXAoZnVuY3Rpb24oaW1wcmVzc2lvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHBpbDogaW1wcmVzc2lvbi5Qcm9kdWN0SW1wcmVzc2lvbkxpc3QsXG4gICAgICAgICAgICAgICAgICAgIHBsOiBjb252ZXJ0UHJvZHVjdExpc3RUb0RUTyhpbXByZXNzaW9uLlByb2R1Y3RMaXN0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGV2ZW50LkV2ZW50RGF0YVR5cGUgPT0gTWVzc2FnZVR5cGUuUHJvZmlsZSkge1xuICAgICAgICBkdG8ucGV0ID0gZXZlbnQuUHJvZmlsZU1lc3NhZ2VUeXBlO1xuICAgIH1cblxuICAgIHJldHVybiBkdG87XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRQcm9kdWN0TGlzdFRvRFRPKHByb2R1Y3RMaXN0KSB7XG4gICAgaWYgKCFwcm9kdWN0TGlzdCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb2R1Y3RMaXN0Lm1hcChmdW5jdGlvbihwcm9kdWN0KSB7XG4gICAgICAgIHJldHVybiBjb252ZXJ0UHJvZHVjdFRvRFRPKHByb2R1Y3QpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0UHJvZHVjdFRvRFRPKHByb2R1Y3QpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBpZDogcHJvZHVjdC5Ta3UsXG4gICAgICAgIG5tOiBwcm9kdWN0Lk5hbWUsXG4gICAgICAgIHByOiBwcm9kdWN0LlByaWNlID09IG51bGwgPyAwIDogcHJvZHVjdC5QcmljZSxcbiAgICAgICAgcXQ6IHByb2R1Y3QuUXVhbnRpdHkgPT0gbnVsbCA/IDAgOiBwcm9kdWN0LlF1YW50aXR5LFxuICAgICAgICBicjogcHJvZHVjdC5CcmFuZCxcbiAgICAgICAgdmE6IHByb2R1Y3QuVmFyaWFudCxcbiAgICAgICAgY2E6IHByb2R1Y3QuQ2F0ZWdvcnksXG4gICAgICAgIHBzOiBwcm9kdWN0LlBvc2l0aW9uID09IG51bGwgPyAwIDogcHJvZHVjdC5Qb3NpdGlvbixcbiAgICAgICAgY2M6IHByb2R1Y3QuQ291cG9uQ29kZSxcbiAgICAgICAgdHBhOiBwcm9kdWN0LlRvdGFsQW1vdW50ID09IG51bGwgPyAwIDogcHJvZHVjdC5Ub3RhbEFtb3VudCxcbiAgICAgICAgYXR0cnM6IHByb2R1Y3QuQXR0cmlidXRlc1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRQcm9kdWN0QmFnVG9EVE8oKSB7XG4gICAgdmFyIGNvbnZlcnRlZEJhZyA9IHt9LFxuICAgICAgICBsaXN0O1xuXG4gICAgZm9yICh2YXIgcHJvcCBpbiBwcm9kdWN0c0JhZ3MpIHtcbiAgICAgICAgaWYgKCFwcm9kdWN0c0JhZ3MuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGlzdCA9IHByb2R1Y3RzQmFnc1twcm9wXS5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnZlcnRQcm9kdWN0VG9EVE8oaXRlbSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh1dGlsaXRpZXMuaXNXZWJWaWV3RW1iZWRkZWQobmF2aWdhdG9yKSkge1xuICAgICAgICAgICAgY29udmVydGVkQmFnW3Byb3BdID0ge1xuICAgICAgICAgICAgICAgIFByb2R1Y3RMaXN0OiBsaXN0XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29udmVydGVkQmFnW3Byb3BdID0ge1xuICAgICAgICAgICAgICAgIHBsOiBsaXN0XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnZlcnRlZEJhZztcbn1cblxuZnVuY3Rpb24gY29udmVydFRyYW5zYWN0aW9uQXR0cmlidXRlc1RvUHJvZHVjdEFjdGlvbih0cmFuc2FjdGlvbkF0dHJpYnV0ZXMsIHByb2R1Y3RBY3Rpb24pIHtcbiAgICBwcm9kdWN0QWN0aW9uLlRyYW5zYWN0aW9uSWQgPSB0cmFuc2FjdGlvbkF0dHJpYnV0ZXMuSWQ7XG4gICAgcHJvZHVjdEFjdGlvbi5BZmZpbGlhdGlvbiA9IHRyYW5zYWN0aW9uQXR0cmlidXRlcy5BZmZpbGlhdGlvbjtcbiAgICBwcm9kdWN0QWN0aW9uLkNvdXBvbkNvZGUgPSB0cmFuc2FjdGlvbkF0dHJpYnV0ZXMuQ291cG9uQ29kZTtcbiAgICBwcm9kdWN0QWN0aW9uLlRvdGFsQW1vdW50ID0gdHJhbnNhY3Rpb25BdHRyaWJ1dGVzLlJldmVudWU7XG4gICAgcHJvZHVjdEFjdGlvbi5TaGlwcGluZ0Ftb3VudCA9IHRyYW5zYWN0aW9uQXR0cmlidXRlcy5TaGlwcGluZztcbiAgICBwcm9kdWN0QWN0aW9uLlRheEFtb3VudCA9IHRyYW5zYWN0aW9uQXR0cmlidXRlcy5UYXg7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUV2ZW50T2JqZWN0KG1lc3NhZ2VUeXBlLCBuYW1lLCBkYXRhLCBldmVudFR5cGUsIGN1c3RvbUZsYWdzKSB7XG4gICAgdmFyIG9wdE91dCA9IChtZXNzYWdlVHlwZSA9PSBNZXNzYWdlVHlwZS5PcHRPdXQgPyAhaXNFbmFibGVkIDogbnVsbCk7XG5cbiAgICBpZiAoc2Vzc2lvbklkIHx8IG1lc3NhZ2VUeXBlID09IE1lc3NhZ2VUeXBlLk9wdE91dCkge1xuICAgICAgICBsYXN0RXZlbnRTZW50ID0gbmV3IERhdGUoKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgRXZlbnROYW1lOiBuYW1lID8gbmFtZSA6IG1lc3NhZ2VUeXBlLFxuICAgICAgICAgICAgRXZlbnRDYXRlZ29yeTogZXZlbnRUeXBlLFxuICAgICAgICAgICAgVXNlckF0dHJpYnV0ZXM6IHVzZXJBdHRyaWJ1dGVzLFxuICAgICAgICAgICAgU2Vzc2lvbkF0dHJpYnV0ZXM6IHNlc3Npb25BdHRyaWJ1dGVzLFxuICAgICAgICAgICAgVXNlcklkZW50aXRpZXM6IHVzZXJJZGVudGl0aWVzLFxuICAgICAgICAgICAgU3RvcmU6IHNlcnZlclNldHRpbmdzLFxuICAgICAgICAgICAgRXZlbnRBdHRyaWJ1dGVzOiBkYXRhLFxuICAgICAgICAgICAgU0RLVmVyc2lvbjogc2RrVmVyc2lvbixcbiAgICAgICAgICAgIFNlc3Npb25JZDogc2Vzc2lvbklkLFxuICAgICAgICAgICAgRXZlbnREYXRhVHlwZTogbWVzc2FnZVR5cGUsXG4gICAgICAgICAgICBEZWJ1ZzogbVBhcnRpY2xlLmlzU2FuZGJveCxcbiAgICAgICAgICAgIFRpbWVzdGFtcDogbGFzdEV2ZW50U2VudC5nZXRUaW1lKCksXG4gICAgICAgICAgICBMb2NhdGlvbjogY3VycmVudFBvc2l0aW9uLFxuICAgICAgICAgICAgT3B0T3V0OiBvcHRPdXQsXG4gICAgICAgICAgICBQcm9kdWN0QmFnczogcHJvZHVjdHNCYWdzLFxuICAgICAgICAgICAgRXhwYW5kZWRFdmVudENvdW50OiAwLFxuICAgICAgICAgICAgQ3VzdG9tRmxhZ3M6IGN1c3RvbUZsYWdzLFxuICAgICAgICAgICAgQXBwVmVyc2lvbjogYXBwVmVyc2lvbixcbiAgICAgICAgICAgIENsaWVudEdlbmVyYXRlZElkOiBjbGllbnRJZFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBnZXRQcm9kdWN0QWN0aW9uRXZlbnROYW1lKHByb2R1Y3RBY3Rpb25UeXBlKSB7XG4gICAgc3dpdGNoIChwcm9kdWN0QWN0aW9uVHlwZSkge1xuICAgICAgICBjYXNlIFByb2R1Y3RBY3Rpb25UeXBlLkFkZFRvQ2FydDpcbiAgICAgICAgICAgIHJldHVybiAnQWRkVG9DYXJ0JztcbiAgICAgICAgY2FzZSBQcm9kdWN0QWN0aW9uVHlwZS5BZGRUb1dpc2hsaXN0OlxuICAgICAgICAgICAgcmV0dXJuICdBZGRUb1dpc2hsaXN0JztcbiAgICAgICAgY2FzZSBQcm9kdWN0QWN0aW9uVHlwZS5DaGVja291dDpcbiAgICAgICAgICAgIHJldHVybiAnQ2hlY2tvdXQnO1xuICAgICAgICBjYXNlIFByb2R1Y3RBY3Rpb25UeXBlLkNsaWNrOlxuICAgICAgICAgICAgcmV0dXJuICdDbGljayc7XG4gICAgICAgIGNhc2UgUHJvZHVjdEFjdGlvblR5cGUuUHVyY2hhc2U6XG4gICAgICAgICAgICByZXR1cm4gJ1B1cmNoYXNlJztcbiAgICAgICAgY2FzZSBQcm9kdWN0QWN0aW9uVHlwZS5SZWZ1bmQ6XG4gICAgICAgICAgICByZXR1cm4gJ1JlZnVuZCc7XG4gICAgICAgIGNhc2UgUHJvZHVjdEFjdGlvblR5cGUuUmVtb3ZlRnJvbUNhcnQ6XG4gICAgICAgICAgICByZXR1cm4gJ1JlbW92ZUZyb21DYXJ0JztcbiAgICAgICAgY2FzZSBQcm9kdWN0QWN0aW9uVHlwZS5SZW1vdmVGcm9tV2lzaGxpc3Q6XG4gICAgICAgICAgICByZXR1cm4gJ1JlbW92ZUZyb21XaXNobGlzdCc7XG4gICAgICAgIGNhc2UgUHJvZHVjdEFjdGlvblR5cGUuVmlld0RldGFpbDpcbiAgICAgICAgICAgIHJldHVybiAnVmlld0RldGFpbCc7XG4gICAgICAgIGNhc2UgUHJvZHVjdEFjdGlvblR5cGUuVW5rbm93bjpcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiAnVW5rbm93bic7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRQcm9tb3Rpb25BY3Rpb25FdmVudE5hbWUocHJvbW90aW9uQWN0aW9uVHlwZSkge1xuICAgIHN3aXRjaCAocHJvbW90aW9uQWN0aW9uVHlwZSkge1xuICAgICAgICBjYXNlIFByb21vdGlvbkFjdGlvblR5cGUuUHJvbW90aW9uQ2xpY2s6XG4gICAgICAgICAgICByZXR1cm4gJ1Byb21vdGlvbkNsaWNrJztcbiAgICAgICAgY2FzZSBQcm9tb3Rpb25BY3Rpb25UeXBlLlByb21vdGlvblZpZXc6XG4gICAgICAgICAgICByZXR1cm4gJ1Byb21vdGlvblZpZXcnO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuICdVbmtub3duJztcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRQcm9kdWN0QWN0aW9uVG9FdmVudFR5cGUocHJvZHVjdEFjdGlvblR5cGUpIHtcbiAgICBzd2l0Y2ggKHByb2R1Y3RBY3Rpb25UeXBlKSB7XG4gICAgICAgIGNhc2UgUHJvZHVjdEFjdGlvblR5cGUuQWRkVG9DYXJ0OlxuICAgICAgICAgICAgcmV0dXJuIENvbW1lcmNlRXZlbnRUeXBlLlByb2R1Y3RBZGRUb0NhcnQ7XG4gICAgICAgIGNhc2UgUHJvZHVjdEFjdGlvblR5cGUuQWRkVG9XaXNobGlzdDpcbiAgICAgICAgICAgIHJldHVybiBDb21tZXJjZUV2ZW50VHlwZS5Qcm9kdWN0QWRkVG9XaXNobGlzdDtcbiAgICAgICAgY2FzZSBQcm9kdWN0QWN0aW9uVHlwZS5DaGVja291dDpcbiAgICAgICAgICAgIHJldHVybiBDb21tZXJjZUV2ZW50VHlwZS5Qcm9kdWN0Q2hlY2tvdXQ7XG4gICAgICAgIGNhc2UgUHJvZHVjdEFjdGlvblR5cGUuQ2xpY2s6XG4gICAgICAgICAgICByZXR1cm4gQ29tbWVyY2VFdmVudFR5cGUuUHJvZHVjdENsaWNrO1xuICAgICAgICBjYXNlIFByb2R1Y3RBY3Rpb25UeXBlLlB1cmNoYXNlOlxuICAgICAgICAgICAgcmV0dXJuIENvbW1lcmNlRXZlbnRUeXBlLlByb2R1Y3RQdXJjaGFzZTtcbiAgICAgICAgY2FzZSBQcm9kdWN0QWN0aW9uVHlwZS5SZWZ1bmQ6XG4gICAgICAgICAgICByZXR1cm4gQ29tbWVyY2VFdmVudFR5cGUuUHJvZHVjdFJlZnVuZDtcbiAgICAgICAgY2FzZSBQcm9kdWN0QWN0aW9uVHlwZS5SZW1vdmVGcm9tQ2FydDpcbiAgICAgICAgICAgIHJldHVybiBDb21tZXJjZUV2ZW50VHlwZS5Qcm9kdWN0UmVtb3ZlRnJvbUNhcnQ7XG4gICAgICAgIGNhc2UgUHJvZHVjdEFjdGlvblR5cGUuUmVtb3ZlRnJvbVdpc2hsaXN0OlxuICAgICAgICAgICAgcmV0dXJuIENvbW1lcmNlRXZlbnRUeXBlLlByb2R1Y3RSZW1vdmVGcm9tV2lzaGxpc3Q7XG4gICAgICAgIGNhc2UgUHJvZHVjdEFjdGlvblR5cGUuVW5rbm93bjpcbiAgICAgICAgICAgIHJldHVybiBFdmVudFR5cGUuVW5rbm93bjtcbiAgICAgICAgY2FzZSBQcm9kdWN0QWN0aW9uVHlwZS5WaWV3RGV0YWlsOlxuICAgICAgICAgICAgcmV0dXJuIENvbW1lcmNlRXZlbnRUeXBlLlByb2R1Y3RWaWV3RGV0YWlsO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdXRpbGl0aWVzLmxvZ0RlYnVnKCdDb3VsZCBub3QgY29udmVydCBwcm9kdWN0IGFjdGlvbiB0eXBlICcgKyBwcm9kdWN0QWN0aW9uVHlwZSArICcgdG8gZXZlbnQgdHlwZScpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjb252ZXJ0UHJvbW90aW9uQWN0aW9uVG9FdmVudFR5cGUocHJvbW90aW9uQWN0aW9uVHlwZSkge1xuICAgIHN3aXRjaCAocHJvbW90aW9uQWN0aW9uVHlwZSkge1xuICAgICAgICBjYXNlIFByb21vdGlvbkFjdGlvblR5cGUuUHJvbW90aW9uQ2xpY2s6XG4gICAgICAgICAgICByZXR1cm4gQ29tbWVyY2VFdmVudFR5cGUuUHJvbW90aW9uQ2xpY2s7XG4gICAgICAgIGNhc2UgUHJvbW90aW9uQWN0aW9uVHlwZS5Qcm9tb3Rpb25WaWV3OlxuICAgICAgICAgICAgcmV0dXJuIENvbW1lcmNlRXZlbnRUeXBlLlByb21vdGlvblZpZXc7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB1dGlsaXRpZXMubG9nRGVidWcoJ0NvdWxkIG5vdCBjb252ZXJ0IHByb21vdGlvbiBhY3Rpb24gdHlwZSAnICsgcHJvbW90aW9uQWN0aW9uVHlwZSArICcgdG8gZXZlbnQgdHlwZScpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIGV4cGFuZFByb2R1Y3RBY3Rpb24oY29tbWVyY2VFdmVudCkge1xuICAgIHZhciBhcHBFdmVudHMgPSBbXTtcbiAgICBpZiAoY29tbWVyY2VFdmVudC5Qcm9kdWN0QWN0aW9uID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGFwcEV2ZW50cztcbiAgICB9XG4gICAgdmFyIHNob3VsZEV4dHJhY3RBY3Rpb25BdHRyaWJ1dGVzID0gZmFsc2U7XG4gICAgaWYgKGNvbW1lcmNlRXZlbnQuUHJvZHVjdEFjdGlvbi5Qcm9kdWN0QWN0aW9uVHlwZSA9PSBQcm9kdWN0QWN0aW9uVHlwZS5QdXJjaGFzZSB8fCBcbiAgICAgICAgY29tbWVyY2VFdmVudC5Qcm9kdWN0QWN0aW9uLlByb2R1Y3RBY3Rpb25UeXBlID09IFByb2R1Y3RBY3Rpb25UeXBlLlJlZnVuZCkge1xuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IGNvbW1lcmNlRXZlbnQuRXZlbnRBdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICBleHRyYWN0QWN0aW9uQXR0cmlidXRlcyhhdHRyaWJ1dGVzLCBjb21tZXJjZUV2ZW50LlByb2R1Y3RBY3Rpb24pO1xuICAgICAgICBpZiAoY29tbWVyY2VFdmVudC5DdXJyZW5jeUNvZGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgYXR0cmlidXRlc1snQ3VycmVuY3kgQ29kZSddID0gY29tbWVyY2VFdmVudC5DdXJyZW5jeUNvZGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBsdXNPbmVFdmVudCA9IGNyZWF0ZUV2ZW50T2JqZWN0KE1lc3NhZ2VUeXBlLlBhZ2VFdmVudCxcbiAgICAgICAgICAgIGdlbmVyYXRlRXhwYW5kZWRFY29tbWVyY2VOYW1lKFByb2R1Y3RBY3Rpb25UeXBlLmdldEV4cGFuc2lvbk5hbWUoY29tbWVyY2VFdmVudC5Qcm9kdWN0QWN0aW9uLlByb2R1Y3RBY3Rpb25UeXBlKSwgdHJ1ZSksXG4gICAgICAgICAgICBhdHRyaWJ1dGVzLFxuICAgICAgICAgICAgRXZlbnRUeXBlLlRyYW5zYWN0aW9uXG4gICAgICAgICk7XG4gICAgICAgIGFwcEV2ZW50cy5wdXNoKHBsdXNPbmVFdmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2hvdWxkRXh0cmFjdEFjdGlvbkF0dHJpYnV0ZXMgPSB0cnVlO1xuICAgIH1cbiAgICB2YXIgcHJvZHVjdHMgPSBjb21tZXJjZUV2ZW50LlByb2R1Y3RBY3Rpb24uUHJvZHVjdExpc3Q7XG4gICAgaWYgKHByb2R1Y3RzID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGFwcEV2ZW50cztcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9kdWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHByb2R1Y3RzW2ldLkF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGlmIChzaG91bGRFeHRyYWN0QWN0aW9uQXR0cmlidXRlcykge1xuICAgICAgICAgICAgZXh0cmFjdEFjdGlvbkF0dHJpYnV0ZXMoYXR0cmlidXRlcywgY29tbWVyY2VFdmVudC5Qcm9kdWN0QWN0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV4dHJhY3RUcmFuc2FjdGlvbklkKGF0dHJpYnV0ZXMsIGNvbW1lcmNlRXZlbnQuUHJvZHVjdEFjdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgZXh0cmFjdFByb2R1Y3RBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMsIHByb2R1Y3RzW2ldKTtcblxuICAgICAgICB2YXIgcHJvZHVjdEV2ZW50ID0gY3JlYXRlRXZlbnRPYmplY3QoTWVzc2FnZVR5cGUuUGFnZUV2ZW50LFxuICAgICAgICAgICAgZ2VuZXJhdGVFeHBhbmRlZEVjb21tZXJjZU5hbWUoUHJvZHVjdEFjdGlvblR5cGUuZ2V0RXhwYW5zaW9uTmFtZShjb21tZXJjZUV2ZW50LlByb2R1Y3RBY3Rpb24uUHJvZHVjdEFjdGlvblR5cGUpKSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMsXG4gICAgICAgICAgICBFdmVudFR5cGUuVHJhbnNhY3Rpb25cbiAgICAgICAgKTtcbiAgICAgICAgYXBwRXZlbnRzLnB1c2gocHJvZHVjdEV2ZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIGFwcEV2ZW50cztcbn1cblxuZnVuY3Rpb24gZXh0cmFjdFByb2R1Y3RBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMsIHByb2R1Y3QpIHtcbiAgICBpZiAocHJvZHVjdC5Db3Vwb25Db2RlICE9IG51bGwpXG4gICAgICAgIGF0dHJpYnV0ZXNbJ0NvdXBvbiBDb2RlJ10gPSBwcm9kdWN0LkNvdXBvbkNvZGU7XG5cbiAgICBpZiAocHJvZHVjdC5CcmFuZCAhPSBudWxsKVxuICAgICAgICBhdHRyaWJ1dGVzWydCcmFuZCddID0gcHJvZHVjdC5CcmFuZDtcblxuICAgIGlmIChwcm9kdWN0LkNhdGVnb3J5ICE9IG51bGwpXG4gICAgICAgIGF0dHJpYnV0ZXNbJ0NhdGVnb3J5J10gPSBwcm9kdWN0LkNhdGVnb3J5O1xuXG4gICAgaWYgKHByb2R1Y3QuTmFtZSAhPSBudWxsKVxuICAgICAgICBhdHRyaWJ1dGVzWydOYW1lJ10gPSBwcm9kdWN0Lk5hbWU7XG5cbiAgICBpZiAocHJvZHVjdC5Ta3UgIT0gbnVsbClcbiAgICAgICAgYXR0cmlidXRlc1snSWQnXSA9IHByb2R1Y3QuU2t1O1xuXG4gICAgaWYgKHByb2R1Y3QuUHJpY2UgIT0gbnVsbClcbiAgICAgICAgYXR0cmlidXRlc1snSXRlbSBQcmljZSddID0gcHJvZHVjdC5QcmljZTtcblxuICAgIGlmIChwcm9kdWN0LlF1YW50aXR5ICE9IG51bGwpXG4gICAgICAgIGF0dHJpYnV0ZXNbJ1F1YW50aXR5J10gPSBwcm9kdWN0LlF1YW50aXR5O1xuXG4gICAgaWYgKHByb2R1Y3QuUG9zaXRpb24gIT0gbnVsbClcbiAgICAgICAgYXR0cmlidXRlc1snUG9zaXRpb24nXSA9IHByb2R1Y3QuUG9zaXRpb247XG5cbiAgICBpZiAocHJvZHVjdC5WYXJpYW50ICE9IG51bGwpXG4gICAgICAgIGF0dHJpYnV0ZXNbJ1ZhcmlhbnQnXSA9IHByb2R1Y3QuVmFyaWFudDtcblxuICAgIGF0dHJpYnV0ZXNbJ1RvdGFsIFByb2R1Y3QgQW1vdW50J10gPSBwcm9kdWN0LlRvdGFsQW1vdW50ICE9IG51bGwgPyBwcm9kdWN0LlRvdGFsQW1vdW50IDogMDtcblxufVxuXG5mdW5jdGlvbiBleHRyYWN0VHJhbnNhY3Rpb25JZChhdHRyaWJ1dGVzLCBwcm9kdWN0QWN0aW9uKSB7XG4gICAgaWYgKHByb2R1Y3RBY3Rpb24uVHJhbnNhY3Rpb25JZCAhPSBudWxsKVxuICAgICAgICBhdHRyaWJ1dGVzWydUcmFuc2FjdGlvbiBJZCddID0gcHJvZHVjdEFjdGlvbi5UcmFuc2FjdGlvbklkO1xufVxuXG5mdW5jdGlvbiBleHRyYWN0QWN0aW9uQXR0cmlidXRlcyhhdHRyaWJ1dGVzLCBwcm9kdWN0QWN0aW9uKSB7XG4gICAgZXh0cmFjdFRyYW5zYWN0aW9uSWQoYXR0cmlidXRlcywgcHJvZHVjdEFjdGlvbik7XG5cbiAgICBpZiAocHJvZHVjdEFjdGlvbi5BZmZpbGlhdGlvbiAhPSBudWxsKVxuICAgICAgICBhdHRyaWJ1dGVzWydBZmZpbGlhdGlvbiddID0gcHJvZHVjdEFjdGlvbi5BZmZpbGlhdGlvbjtcblxuICAgIGlmIChwcm9kdWN0QWN0aW9uLkNvdXBvbkNvZGUgIT0gbnVsbClcbiAgICAgICAgYXR0cmlidXRlc1snQ291cG9uIENvZGUnXSA9IHByb2R1Y3RBY3Rpb24uQ291cG9uQ29kZTtcbiAgICBcbiAgICBpZiAocHJvZHVjdEFjdGlvbi5Ub3RhbEFtb3VudCAhPSBudWxsKVxuICAgICAgICBhdHRyaWJ1dGVzWydUb3RhbCBBbW91bnQnXSA9IHByb2R1Y3RBY3Rpb24uVG90YWxBbW91bnQ7XG5cbiAgICBpZiAocHJvZHVjdEFjdGlvbi5TaGlwcGluZ0Ftb3VudCAhPSBudWxsKVxuICAgICAgICBhdHRyaWJ1dGVzWydTaGlwcGluZyBBbW91bnQnXSA9IHByb2R1Y3RBY3Rpb24uU2hpcHBpbmdBbW91bnQ7XG4gICAgXG4gICAgaWYgKHByb2R1Y3RBY3Rpb24uVGF4QW1vdW50ICE9IG51bGwpXG4gICAgICAgIGF0dHJpYnV0ZXNbJ1RheCBBbW91bnQnXSA9IHByb2R1Y3RBY3Rpb24uVGF4QW1vdW50O1xuXG4gICAgaWYgKHByb2R1Y3RBY3Rpb24uQ2hlY2tvdXRPcHRpb25zICE9IG51bGwpXG4gICAgICAgIGF0dHJpYnV0ZXNbJ0NoZWNrb3V0IE9wdGlvbnMnXSA9IHByb2R1Y3RBY3Rpb24uQ2hlY2tvdXRPcHRpb25zO1xuXG4gICAgaWYgKHByb2R1Y3RBY3Rpb24uQ2hlY2tvdXRTdGVwICE9IG51bGwpXG4gICAgICAgIGF0dHJpYnV0ZXNbJ0NoZWNrb3V0IFN0ZXAnXSA9IHByb2R1Y3RBY3Rpb24uQ2hlY2tvdXRTdGVwO1xufVxuXG5mdW5jdGlvbiBleHBhbmRQcm9tb3Rpb25BY3Rpb24oY29tbWVyY2VFdmVudCkge1xuICAgIHZhciBhcHBFdmVudHMgPSBbXTtcbiAgICBpZiAoY29tbWVyY2VFdmVudC5Qcm9tb3Rpb25BY3Rpb24gPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYXBwRXZlbnRzO1xuICAgIH1cbiAgICB2YXIgcHJvbW90aW9ucyA9IGNvbW1lcmNlRXZlbnQuUHJvbW90aW9uQWN0aW9uLlByb21vdGlvbkxpc3Q7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9tb3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBhdHRyaWJ1dGVzID0gY29tbWVyY2VFdmVudC5FdmVudEF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGV4dHJhY3RQcm9tb3Rpb25BdHRyaWJ1dGVzKGF0dHJpYnV0ZXMsIHByb21vdGlvbnNbaV0pO1xuXG4gICAgICAgIHZhciBhcHBFdmVudCA9IGNyZWF0ZUV2ZW50T2JqZWN0KE1lc3NhZ2VUeXBlLlBhZ2VFdmVudCxcbiAgICAgICAgICAgICAgICBnZW5lcmF0ZUV4cGFuZGVkRWNvbW1lcmNlTmFtZShQcm9tb3Rpb25BY3Rpb25UeXBlLmdldEV4cGFuc2lvbk5hbWUoY29tbWVyY2VFdmVudC5Qcm9tb3Rpb25BY3Rpb24uUHJvbW90aW9uQWN0aW9uVHlwZSkpLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgICAgRXZlbnRUeXBlLlRyYW5zYWN0aW9uXG4gICAgICAgICAgICApO1xuICAgICAgICBhcHBFdmVudHMucHVzaChhcHBFdmVudCk7XG4gICAgfVxuICAgIHJldHVybiBhcHBFdmVudHM7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlRXhwYW5kZWRFY29tbWVyY2VOYW1lKGV2ZW50TmFtZSwgcGx1c09uZSkge1xuICAgIHJldHVybiAnZUNvbW1lcmNlIC0gJyArIGV2ZW50TmFtZSArICcgLSAnICsgKHBsdXNPbmUgPyBcIlRvdGFsXCIgOiBcIkl0ZW1cIik7XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RQcm9tb3Rpb25BdHRyaWJ1dGVzKGF0dHJpYnV0ZXMsIHByb21vdGlvbikge1xuICAgIGlmIChwcm9tb3Rpb24uSWQgIT0gbnVsbClcbiAgICAgICAgYXR0cmlidXRlc1snSWQnXSA9IHByb21vdGlvbi5JZDtcblxuICAgIGlmIChwcm9tb3Rpb24uQ3JlYXRpdmUgIT0gbnVsbCkgXG4gICAgICAgIGF0dHJpYnV0ZXNbJ0NyZWF0aXZlJ10gPSBwcm9tb3Rpb24uQ3JlYXRpdmU7XG5cbiAgICBpZiAocHJvbW90aW9uLk5hbWUgIT0gbnVsbClcbiAgICAgICAgYXR0cmlidXRlc1snTmFtZSddID0gcHJvbW90aW9uLk5hbWU7XG5cbiAgICBpZiAocHJvbW90aW9uLlBvc2l0aW9uICE9IG51bGwpXG4gICAgICAgIGF0dHJpYnV0ZXNbJ1Bvc2l0aW9uJ10gPSBwcm9tb3Rpb24uUG9zaXRpb247XG59XG5cbmZ1bmN0aW9uIGV4cGFuZFByb2R1Y3RJbXByZXNzaW9uKGNvbW1lcmNlRXZlbnQpIHtcbiAgICB2YXIgYXBwRXZlbnRzID0gW107XG4gICAgaWYgKGNvbW1lcmNlRXZlbnQuUHJvZHVjdEltcHJlc3Npb25zID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGFwcEV2ZW50cztcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21tZXJjZUV2ZW50LlByb2R1Y3RJbXByZXNzaW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY29tbWVyY2VFdmVudC5Qcm9kdWN0SW1wcmVzc2lvbnNbaV0uUHJvZHVjdExpc3QgIT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yICh2YXIgcHJvZHVjdEluZGV4ID0gMDsgcHJvZHVjdEluZGV4IDwgY29tbWVyY2VFdmVudC5Qcm9kdWN0SW1wcmVzc2lvbnNbaV0uUHJvZHVjdExpc3QubGVuZ3RoOyBwcm9kdWN0SW5kZXgrKykge1xuICAgICAgICAgICAgICAgIHZhciBwcm9kdWN0ID0gY29tbWVyY2VFdmVudC5Qcm9kdWN0SW1wcmVzc2lvbnNbaV0uUHJvZHVjdExpc3RbcHJvZHVjdEluZGV4XTtcbiAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IGNvbW1lcmNlRXZlbnQuRXZlbnRBdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICAgICAgICAgIGlmIChwcm9kdWN0LkF0dHJpYnV0ZXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBhdHRyaWJ1dGUgaW4gcHJvZHVjdC5BdHRyaWJ1dGVzKSB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlc1thdHRyaWJ1dGVdID0gcHJvZHVjdC5BdHRyaWJ1dGVzW2F0dHJpYnV0ZV07IFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGV4dHJhY3RQcm9kdWN0QXR0cmlidXRlcyhhdHRyaWJ1dGVzLCBwcm9kdWN0KTtcbiAgICAgICAgICAgICAgICBpZiAoY29tbWVyY2VFdmVudC5Qcm9kdWN0SW1wcmVzc2lvbnNbaV0uUHJvZHVjdEltcHJlc3Npb25MaXN0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlc1snUHJvZHVjdCBJbXByZXNzaW9uIExpc3QnXSA9IGNvbW1lcmNlRXZlbnQuUHJvZHVjdEltcHJlc3Npb25zW2ldLlByb2R1Y3RJbXByZXNzaW9uTGlzdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGFwcEV2ZW50ID0gY3JlYXRlRXZlbnRPYmplY3QoTWVzc2FnZVR5cGUuUGFnZUV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVFeHBhbmRlZEVjb21tZXJjZU5hbWUoJ0ltcHJlc3Npb24nKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBFdmVudFR5cGUuVHJhbnNhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBhcHBFdmVudHMucHVzaChhcHBFdmVudClcbiAgICAgICAgICAgIH0gICBcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXBwRXZlbnRzO1xufVxuXG5mdW5jdGlvbiBleHBhbmRDb21tZXJjZUV2ZW50KGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50ID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBleHBhbmRQcm9kdWN0QWN0aW9uKGV2ZW50KVxuICAgICAgICAgICAgLmNvbmNhdChleHBhbmRQcm9tb3Rpb25BY3Rpb24oZXZlbnQpKVxuICAgICAgICAgICAgLmNvbmNhdChleHBhbmRQcm9kdWN0SW1wcmVzc2lvbihldmVudCkpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb21tZXJjZUV2ZW50T2JqZWN0KCkge1xuICAgIHZhciBiYXNlRXZlbnQ7XG5cbiAgICB1dGlsaXRpZXMubG9nRGVidWcobWVzc2FnZXMuZ2V0SW5mb3JtYXRpb25NZXNzYWdlcygnU3RhcnRpbmdMb2dDb21tZXJjZUV2ZW50JykpO1xuXG4gICAgaWYgKGNhbkxvZygpKSB7XG4gICAgICAgIGlmICghc2Vzc2lvbklkKSB7XG4gICAgICAgICAgICBtUGFydGljbGUuc3RhcnROZXdTZXNzaW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICBiYXNlRXZlbnQgPSBjcmVhdGVFdmVudE9iamVjdChNZXNzYWdlVHlwZS5Db21tZXJjZSk7XG4gICAgICAgIGJhc2VFdmVudC5FdmVudE5hbWUgPSAnZUNvbW1lcmNlIC0gJztcbiAgICAgICAgYmFzZUV2ZW50LkN1cnJlbmN5Q29kZSA9IGN1cnJlbmN5Q29kZTtcbiAgICAgICAgYmFzZUV2ZW50LlNob3BwaW5nQ2FydCA9IHtcbiAgICAgICAgICAgIFByb2R1Y3RMaXN0OiBjYXJ0UHJvZHVjdHNcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gYmFzZUV2ZW50O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdXRpbGl0aWVzLmxvZ0RlYnVnKG1lc3NhZ2VzLmdldEluZm9ybWF0aW9uTWVzc2FnZXMoJ0FiYW5kb25Mb2dFdmVudCcpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbn07XG5cbmZ1bmN0aW9uIGxvZ0NoZWNrb3V0RXZlbnQoc3RlcCwgb3B0aW9ucywgYXR0cnMpIHtcbiAgICB2YXIgZXZlbnQgPSBjcmVhdGVDb21tZXJjZUV2ZW50T2JqZWN0KCk7XG5cbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuRXZlbnROYW1lICs9IGdldFByb2R1Y3RBY3Rpb25FdmVudE5hbWUoUHJvZHVjdEFjdGlvblR5cGUuQ2hlY2tvdXQpO1xuICAgICAgICBldmVudC5FdmVudENhdGVnb3J5ID0gQ29tbWVyY2VFdmVudFR5cGUuUHJvZHVjdENoZWNrb3V0O1xuICAgICAgICBldmVudC5Qcm9kdWN0QWN0aW9uID0ge1xuICAgICAgICAgICAgUHJvZHVjdEFjdGlvblR5cGU6IFByb2R1Y3RBY3Rpb25UeXBlLkNoZWNrb3V0LFxuICAgICAgICAgICAgQ2hlY2tvdXRTdGVwOiBzdGVwLFxuICAgICAgICAgICAgQ2hlY2tvdXRPcHRpb25zOiBvcHRpb25zLFxuICAgICAgICAgICAgUHJvZHVjdExpc3Q6IGV2ZW50LlNob3BwaW5nQ2FydC5Qcm9kdWN0TGlzdFxuICAgICAgICB9O1xuXG4gICAgICAgIGxvZ0NvbW1lcmNlRXZlbnQoZXZlbnQsIGF0dHJzKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxvZ1Byb2R1Y3RBY3Rpb25FdmVudChwcm9kdWN0QWN0aW9uVHlwZSwgcHJvZHVjdCwgYXR0cnMpIHtcbiAgICB2YXIgZXZlbnQgPSBjcmVhdGVDb21tZXJjZUV2ZW50T2JqZWN0KCk7XG5cbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuRXZlbnRDYXRlZ29yeSA9IGNvbnZlcnRQcm9kdWN0QWN0aW9uVG9FdmVudFR5cGUocHJvZHVjdEFjdGlvblR5cGUpO1xuICAgICAgICBldmVudC5FdmVudE5hbWUgKz0gZ2V0UHJvZHVjdEFjdGlvbkV2ZW50TmFtZShwcm9kdWN0QWN0aW9uVHlwZSk7XG4gICAgICAgIGV2ZW50LlByb2R1Y3RBY3Rpb24gPSB7XG4gICAgICAgICAgICBQcm9kdWN0QWN0aW9uVHlwZTogcHJvZHVjdEFjdGlvblR5cGUsXG4gICAgICAgICAgICBQcm9kdWN0TGlzdDogQXJyYXkuaXNBcnJheShwcm9kdWN0KSA/IHByb2R1Y3QgOiBbcHJvZHVjdF1cbiAgICAgICAgfTtcblxuICAgICAgICBsb2dDb21tZXJjZUV2ZW50KGV2ZW50LCBhdHRycyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBsb2dQdXJjaGFzZUV2ZW50KHRyYW5zYWN0aW9uQXR0cmlidXRlcywgcHJvZHVjdCwgYXR0cnMpIHtcbiAgICB2YXIgZXZlbnQgPSBjcmVhdGVDb21tZXJjZUV2ZW50T2JqZWN0KCk7XG5cbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuRXZlbnROYW1lICs9IGdldFByb2R1Y3RBY3Rpb25FdmVudE5hbWUoUHJvZHVjdEFjdGlvblR5cGUuUHVyY2hhc2UpO1xuICAgICAgICBldmVudC5FdmVudENhdGVnb3J5ID0gQ29tbWVyY2VFdmVudFR5cGUuUHJvZHVjdFB1cmNoYXNlO1xuICAgICAgICBldmVudC5Qcm9kdWN0QWN0aW9uID0ge1xuICAgICAgICAgICAgUHJvZHVjdEFjdGlvblR5cGU6IFByb2R1Y3RBY3Rpb25UeXBlLlB1cmNoYXNlXG4gICAgICAgIH07XG4gICAgICAgIGV2ZW50LlByb2R1Y3RBY3Rpb24uUHJvZHVjdExpc3QgPSBidWlsZFByb2R1Y3RMaXN0KGV2ZW50LCBwcm9kdWN0KTtcblxuICAgICAgICBjb252ZXJ0VHJhbnNhY3Rpb25BdHRyaWJ1dGVzVG9Qcm9kdWN0QWN0aW9uKHRyYW5zYWN0aW9uQXR0cmlidXRlcywgZXZlbnQuUHJvZHVjdEFjdGlvbik7XG5cbiAgICAgICAgbG9nQ29tbWVyY2VFdmVudChldmVudCwgYXR0cnMpO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIGxvZ1JlZnVuZEV2ZW50KHRyYW5zYWN0aW9uQXR0cmlidXRlcywgcHJvZHVjdCwgYXR0cnMpIHtcbiAgICBpZiAodHJhbnNhY3Rpb25BdHRyaWJ1dGVzID09IG51bGwgfHwgdHlwZW9mIHRyYW5zYWN0aW9uQXR0cmlidXRlcyA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB1dGlsaXRpZXMubG9nRGVidWcobWVzc2FnZXMuZ2V0RXJyb3JNZXNzYWdlcygnVHJhbnNhY3Rpb25SZXF1aXJlZCcpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBldmVudCA9IGNyZWF0ZUNvbW1lcmNlRXZlbnRPYmplY3QoKTtcblxuICAgIGlmIChldmVudCkge1xuICAgICAgICBldmVudC5FdmVudE5hbWUgKz0gZ2V0UHJvZHVjdEFjdGlvbkV2ZW50TmFtZShQcm9kdWN0QWN0aW9uVHlwZS5SZWZ1bmQpO1xuICAgICAgICBldmVudC5FdmVudENhdGVnb3J5ID0gQ29tbWVyY2VFdmVudFR5cGUuUHJvZHVjdFJlZnVuZDtcbiAgICAgICAgZXZlbnQuUHJvZHVjdEFjdGlvbiA9IHtcbiAgICAgICAgICAgIFByb2R1Y3RBY3Rpb25UeXBlOiBQcm9kdWN0QWN0aW9uVHlwZS5SZWZ1bmRcbiAgICAgICAgfTtcbiAgICAgICAgZXZlbnQuUHJvZHVjdEFjdGlvbi5Qcm9kdWN0TGlzdCA9IGJ1aWxkUHJvZHVjdExpc3QoZXZlbnQsIHByb2R1Y3QpO1xuXG4gICAgICAgIGNvbnZlcnRUcmFuc2FjdGlvbkF0dHJpYnV0ZXNUb1Byb2R1Y3RBY3Rpb24odHJhbnNhY3Rpb25BdHRyaWJ1dGVzLCBldmVudC5Qcm9kdWN0QWN0aW9uKTtcblxuICAgICAgICBsb2dDb21tZXJjZUV2ZW50KGV2ZW50LCBhdHRycyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBidWlsZFByb2R1Y3RMaXN0KGV2ZW50LCBwcm9kdWN0KSB7XG4gICAgaWYgKHByb2R1Y3QpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJvZHVjdCkpIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9kdWN0O1xuICAgICAgICB9XG4gICAgICAgICBcbiAgICAgICAgcmV0dXJuIFtwcm9kdWN0XTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIGV2ZW50LlNob3BwaW5nQ2FydC5Qcm9kdWN0TGlzdDtcbn1cblxuZnVuY3Rpb24gbG9nUHJvbW90aW9uRXZlbnQocHJvbW90aW9uVHlwZSwgcHJvbW90aW9uLCBhdHRycykge1xuICAgIHZhciBldmVudCA9IGNyZWF0ZUNvbW1lcmNlRXZlbnRPYmplY3QoKTtcblxuICAgIGlmIChldmVudCkge1xuICAgICAgICBldmVudC5FdmVudE5hbWUgKz0gZ2V0UHJvbW90aW9uQWN0aW9uRXZlbnROYW1lKHByb21vdGlvblR5cGUpO1xuICAgICAgICBldmVudC5FdmVudENhdGVnb3J5ID0gY29udmVydFByb21vdGlvbkFjdGlvblRvRXZlbnRUeXBlKHByb21vdGlvblR5cGUpO1xuICAgICAgICBldmVudC5Qcm9tb3Rpb25BY3Rpb24gPSB7XG4gICAgICAgICAgICBQcm9tb3Rpb25BY3Rpb25UeXBlOiBwcm9tb3Rpb25UeXBlLFxuICAgICAgICAgICAgUHJvbW90aW9uTGlzdDogW3Byb21vdGlvbl1cbiAgICAgICAgfTtcblxuICAgICAgICBsb2dDb21tZXJjZUV2ZW50KGV2ZW50LCBhdHRycyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBsb2dJbXByZXNzaW9uRXZlbnQoaW1wcmVzc2lvbiwgYXR0cnMpIHtcbiAgICB2YXIgZXZlbnQgPSBjcmVhdGVDb21tZXJjZUV2ZW50T2JqZWN0KCk7XG5cbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuRXZlbnROYW1lICs9ICdJbXByZXNzaW9uJztcbiAgICAgICAgZXZlbnQuRXZlbnRDYXRlZ29yeSA9IENvbW1lcmNlRXZlbnRUeXBlLlByb2R1Y3RJbXByZXNzaW9uO1xuICAgICAgICBldmVudC5Qcm9kdWN0SW1wcmVzc2lvbnMgPSBbe1xuICAgICAgICAgICAgUHJvZHVjdEltcHJlc3Npb25MaXN0OiBpbXByZXNzaW9uLk5hbWUsXG4gICAgICAgICAgICBQcm9kdWN0TGlzdDogW2ltcHJlc3Npb24uUHJvZHVjdF1cbiAgICAgICAgfV07XG5cbiAgICAgICAgbG9nQ29tbWVyY2VFdmVudChldmVudCwgYXR0cnMpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbG9nT3B0T3V0KCkge1xuICAgIHV0aWxpdGllcy5sb2dEZWJ1ZyhtZXNzYWdlcy5nZXRJbmZvcm1hdGlvbk1lc3NhZ2VzKCdTdGFydGluZ0xvZ09wdE91dCcpKTtcblxuICAgIHNlbmQoY3JlYXRlRXZlbnRPYmplY3QoTWVzc2FnZVR5cGUuT3B0T3V0LCBudWxsLCBudWxsLCBFdmVudFR5cGUuT3RoZXIpKTtcbn1cblxuZnVuY3Rpb24gbG9nRXZlbnQodHlwZSwgbmFtZSwgZGF0YSwgY2F0ZWdvcnksIGNmbGFncykge1xuICAgIHV0aWxpdGllcy5sb2dEZWJ1ZyhtZXNzYWdlcy5nZXRJbmZvcm1hdGlvbk1lc3NhZ2VzKCdTdGFydGluZ0xvZ0V2ZW50JykgKyAnOiAnICsgbmFtZSk7XG5cbiAgICBpZiAoY2FuTG9nKCkpIHtcbiAgICAgICAgaWYgKCFzZXNzaW9uSWQpIHtcbiAgICAgICAgICAgIG1QYXJ0aWNsZS5zdGFydE5ld1Nlc3Npb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEgPSBzYW5pdGl6ZUF0dHJpYnV0ZXMoZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICBzZW5kKGNyZWF0ZUV2ZW50T2JqZWN0KHR5cGUsIG5hbWUsIGRhdGEsIGNhdGVnb3J5LCBjZmxhZ3MpKTtcbiAgICAgICAgY29va2llLnNldENvb2tpZShcbiAgICAgICAgICAgICAgICBDb25maWcsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzaWQ6IHNlc3Npb25JZCwgaWU6IGlzRW5hYmxlZCwgc2E6IHNlc3Npb25BdHRyaWJ1dGVzLCBcbiAgICAgICAgICAgICAgICAgICAgdWE6IHVzZXJBdHRyaWJ1dGVzLCB1aTogdXNlcklkZW50aXRpZXMsIHNzOiBzZXJ2ZXJTZXR0aW5ncywgZHQ6IGRldlRva2VuLFxuICAgICAgICAgICAgICAgICAgICBsZXM6IGxhc3RFdmVudFNlbnQgPyBsYXN0RXZlbnRTZW50LmdldFRpbWUoKSA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGF2OiBhcHBWZXJzaW9uLFxuICAgICAgICAgICAgICAgICAgICBjZ2lkOiBjbGllbnRJZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB1dGlsaXRpZXMubG9nRGVidWcobWVzc2FnZXMuZ2V0SW5mb3JtYXRpb25NZXNzYWdlcygnQWJhbmRvbkxvZ0V2ZW50JykpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbG9nQ29tbWVyY2VFdmVudChjb21tZXJjZUV2ZW50LCBhdHRycykge1xuICAgIHV0aWxpdGllcy5sb2dEZWJ1ZyhtZXNzYWdlcy5nZXRJbmZvcm1hdGlvbk1lc3NhZ2VzKCdTdGFydGluZ0xvZ0NvbW1lcmNlRXZlbnQnKSk7XG5cbiAgICBpZiAoY2FuTG9nKCkpIHtcbiAgICAgICAgaWYgKCFzZXNzaW9uSWQpIHtcbiAgICAgICAgICAgIG1QYXJ0aWNsZS5zdGFydE5ld1Nlc3Npb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1dGlsaXRpZXMuaXNXZWJWaWV3RW1iZWRkZWQobmF2aWdhdG9yKSkge1xuICAgICAgICAgICAgLy8gRG9uJ3Qgc2VuZCBzaG9wcGluZyBjYXJ0IG9yIHByb2R1Y3QgYmFncyB0byBwYXJlbnQgc2Rrc1xuICAgICAgICAgICAgY29tbWVyY2VFdmVudC5TaG9wcGluZ0NhcnQgPSB7fTtcbiAgICAgICAgICAgIGNvbW1lcmNlRXZlbnQuUHJvZHVjdEJhZ3MgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhdHRycykge1xuICAgICAgICAgICAgY29tbWVyY2VFdmVudC5FdmVudEF0dHJpYnV0ZXMgPSBhdHRycztcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbmQoY29tbWVyY2VFdmVudCk7XG4gICAgICAgIGNvb2tpZS5zZXRDb29raWUoXG4gICAgICAgICAgICAgICAgQ29uZmlnLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgc2lkOiBzZXNzaW9uSWQsIGllOiBpc0VuYWJsZWQsIHNhOiBzZXNzaW9uQXR0cmlidXRlcywgXG4gICAgICAgICAgICAgICAgICAgIHVhOiB1c2VyQXR0cmlidXRlcywgdWk6IHVzZXJJZGVudGl0aWVzLCBzczogc2VydmVyU2V0dGluZ3MsIGR0OiBkZXZUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgbGVzOiBsYXN0RXZlbnRTZW50ID8gbGFzdEV2ZW50U2VudC5nZXRUaW1lKCkgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBhdjogYXBwVmVyc2lvbixcbiAgICAgICAgICAgICAgICAgICAgY2dpZDogY2xpZW50SWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdXRpbGl0aWVzLmxvZ0RlYnVnKG1lc3NhZ2VzLmdldEluZm9ybWF0aW9uTWVzc2FnZXMoJ0FiYW5kb25Mb2dFdmVudCcpKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxvZ0xvZ091dEV2ZW50KCkge1xuICAgIHZhciBldnQ7XG5cbiAgICB1dGlsaXRpZXMubG9nRGVidWcobWVzc2FnZXMuZ2V0SW5mb3JtYXRpb25NZXNzYWdlcygnU3RhcnRpbmdMb2dFdmVudCcpICsgJzogbG9nT3V0Jyk7XG5cbiAgICBpZiAoY2FuTG9nKCkpIHtcbiAgICAgICAgaWYgKCFzZXNzaW9uSWQpIHtcbiAgICAgICAgICAgIG1QYXJ0aWNsZS5zdGFydE5ld1Nlc3Npb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2dCA9IGNyZWF0ZUV2ZW50T2JqZWN0KE1lc3NhZ2VUeXBlLlByb2ZpbGUpO1xuICAgICAgICBldnQuUHJvZmlsZU1lc3NhZ2VUeXBlID0gUHJvZmlsZU1lc3NhZ2VUeXBlLkxvZ291dDtcblxuICAgICAgICBzZW5kKGV2dCk7XG4gICAgICAgIGNvb2tpZS5zZXRDb29raWUoXG4gICAgICAgICAgICAgICAgQ29uZmlnLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgc2lkOiBzZXNzaW9uSWQsIGllOiBpc0VuYWJsZWQsIHNhOiBzZXNzaW9uQXR0cmlidXRlcywgXG4gICAgICAgICAgICAgICAgICAgIHVhOiB1c2VyQXR0cmlidXRlcywgdWk6IHVzZXJJZGVudGl0aWVzLCBzczogc2VydmVyU2V0dGluZ3MsIGR0OiBkZXZUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgbGVzOiBsYXN0RXZlbnRTZW50ID8gbGFzdEV2ZW50U2VudC5nZXRUaW1lKCkgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBhdjogYXBwVmVyc2lvbixcbiAgICAgICAgICAgICAgICAgICAgY2dpZDogY2xpZW50SWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBldnQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB1dGlsaXRpZXMubG9nRGVidWcobWVzc2FnZXMuZ2V0SW5mb3JtYXRpb25NZXNzYWdlcygnQWJhbmRvbkxvZ0V2ZW50JykpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21WYWx1ZShhKSB7XG4gICAgaWYod2luZG93Lmhhc093blByb3BlcnR5KCdjcnlwdG8nKSkge1xuICAgICAgICBpZih3aW5kb3cuY3J5cHRvICYmIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgICAgICAgICByZXR1cm4gKGEgXiB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheSgxKSlbMF0gJSAxNiA+PiBhLzQpLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAoYSBeIE1hdGgucmFuZG9tKCkgKiAxNiA+PiBhLzQpLnRvU3RyaW5nKDE2KTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVVbmlxdWVJZChhKSB7XG4gICAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vamVkLzk4Mjg4M1xuICAgIC8vIEFkZGVkIHN1cHBvcnQgZm9yIGNyeXB0byBmb3IgYmV0dGVyIHJhbmRvbVxuXG4gICAgcmV0dXJuIGEgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHBsYWNlaG9sZGVyIHdhcyBwYXNzZWQsIHJldHVyblxuICAgICAgICAgICAgPyBnZW5lcmF0ZVJhbmRvbVZhbHVlKGEpICAgIC8vIGEgcmFuZG9tIG51bWJlciBcbiAgICAgICAgICAgIDogKCAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvciBvdGhlcndpc2UgYSBjb25jYXRlbmF0ZWQgc3RyaW5nOlxuICAgICAgICAgICAgWzFlN10gKyAgICAgICAgICAgICAgICAgICAgIC8vIDEwMDAwMDAwICtcbiAgICAgICAgICAgIC0xZTMgKyAgICAgICAgICAgICAgICAgICAgICAvLyAtMTAwMCArXG4gICAgICAgICAgICAtNGUzICsgICAgICAgICAgICAgICAgICAgICAgLy8gLTQwMDAgK1xuICAgICAgICAgICAgLThlMyArICAgICAgICAgICAgICAgICAgICAgIC8vIC04MDAwMDAwMCArXG4gICAgICAgICAgICAtMWUxMSAgICAgICAgICAgICAgICAgICAgICAgLy8gLTEwMDAwMDAwMDAwMCxcbiAgICAgICAgICAgICkucmVwbGFjZSggICAgICAgICAgICAgICAgICAvLyByZXBsYWNpbmdcbiAgICAgICAgICAgICAgICAvWzAxOF0vZywgICAgICAgICAgICAgICAvLyB6ZXJvZXMsIG9uZXMsIGFuZCBlaWdodHMgd2l0aFxuICAgICAgICAgICAgICAgIGdlbmVyYXRlVW5pcXVlSWQgICAgICAgIC8vIHJhbmRvbSBoZXggZGlnaXRzXG4gICAgICAgICAgICApO1xufVxuXG5mdW5jdGlvbiBpc0V2ZW50VHlwZSh0eXBlKSB7XG4gICAgZm9yICh2YXIgcHJvcCBpbiBFdmVudFR5cGUpIHtcbiAgICAgICAgaWYgKEV2ZW50VHlwZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgaWYgKEV2ZW50VHlwZVtwcm9wXSA9PT0gdHlwZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VDb25maWcoY29uZmlnKSB7XG4gICAgdXRpbGl0aWVzLmxvZ0RlYnVnKG1lc3NhZ2VzLmdldEluZm9ybWF0aW9uTWVzc2FnZXMoJ0xvYWRpbmdDb25maWcnKSk7XG5cbiAgICBmb3IgKHZhciBwcm9wIGluIERlZmF1bHRDb25maWcpIHtcbiAgICAgICAgaWYgKERlZmF1bHRDb25maWcuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgIENvbmZpZ1twcm9wXSA9IERlZmF1bHRDb25maWdbcHJvcF07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICBDb25maWdbcHJvcF0gPSBjb25maWdbcHJvcF07XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNhbkxvZygpIHtcbiAgICBpZiAoaXNFbmFibGVkICYmIChkZXZUb2tlbiB8fCB1dGlsaXRpZXMuaXNXZWJWaWV3RW1iZWRkZWQobmF2aWdhdG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSBcIltvYmplY3QgT2JqZWN0XVwiO1xufVxuXG5mdW5jdGlvbiBhZGRFdmVudEhhbmRsZXIoZG9tRXZlbnQsIHNlbGVjdG9yLCBldmVudE5hbWUsIGRhdGEsIGV2ZW50VHlwZSkge1xuICAgIHZhciBlbGVtZW50cyA9IFtdLFxuICAgICAgICBoYW5kbGVyID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgdmFyIHRpbWVvdXRIYW5kbGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuaHJlZikge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGVsZW1lbnQuaHJlZjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZWxlbWVudC5zdWJtaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdWJtaXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB1dGlsaXRpZXMubG9nRGVidWcoJ0RPTSBldmVudCB0cmlnZ2VyZWQsIGhhbmRsaW5nIGV2ZW50Jyk7XG5cbiAgICAgICAgICAgIGxvZ0V2ZW50KE1lc3NhZ2VUeXBlLlBhZ2VFdmVudCxcbiAgICAgICAgICAgICAgICB0eXBlb2YgZXZlbnROYW1lID09PSAnZnVuY3Rpb24nID8gZXZlbnROYW1lKGVsZW1lbnQpIDogZXZlbnROYW1lLFxuICAgICAgICAgICAgICAgIHR5cGVvZiBkYXRhID09PSAnZnVuY3Rpb24nID8gZGF0YShlbGVtZW50KSA6IGRhdGEsXG4gICAgICAgICAgICAgICAgZXZlbnRUeXBlID8gZXZlbnRUeXBlIDogRXZlbnRUeXBlLk90aGVyKTtcblxuICAgICAgICAgICAgLy8gVE9ETzogSGFuZGxlIG1pZGRsZS1jbGlja3MgYW5kIHNwZWNpYWwga2V5cyAoY3RybCwgYWx0LCBldGMpXG4gICAgICAgICAgICBpZiAoKGVsZW1lbnQuaHJlZiAmJiBlbGVtZW50LnRhcmdldCAhPSAnX2JsYW5rJykgfHwgZWxlbWVudC5zdWJtaXQpIHtcbiAgICAgICAgICAgICAgICAvLyBHaXZlIHhtbGh0dHByZXF1ZXN0IGVub3VnaCB0aW1lIHRvIGV4ZWN1dGUgYmVmb3JlIG5hdmlnYXRpbmcgYSBsaW5rIG9yIHN1Ym1pdHRpbmcgZm9ybVxuXG4gICAgICAgICAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodGltZW91dEhhbmRsZXIsIENvbmZpZy5UaW1lb3V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZWxlbWVudCxcbiAgICAgICAgaTtcblxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgICAgdXRpbGl0aWVzLmxvZ0RlYnVnKCdDYW5cXCd0IGJpbmQgZXZlbnQsIHNlbGVjdG9yIGlzIHJlcXVpcmVkJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgYSBjc3Mgc2VsZWN0b3Igc3RyaW5nIG9yIGEgZG9tIGVsZW1lbnRcbiAgICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJykge1xuICAgICAgICBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICAgIH1cbiAgICBlbHNlIGlmIChzZWxlY3Rvci5ub2RlVHlwZSkge1xuICAgICAgICBlbGVtZW50cyA9IFtzZWxlY3Rvcl07XG4gICAgfVxuXG4gICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdXRpbGl0aWVzLmxvZ0RlYnVnKCdGb3VuZCAnICtcbiAgICAgICAgICAgIGVsZW1lbnRzLmxlbmd0aCArXG4gICAgICAgICAgICAnIGVsZW1lbnQnICtcbiAgICAgICAgICAgIChlbGVtZW50cy5sZW5ndGggPiAxID8gJ3MnIDogJycpICtcbiAgICAgICAgICAgICcsIGF0dGFjaGluZyBldmVudCBoYW5kbGVycycpO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnRzW2ldO1xuXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGRvbUV2ZW50LCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChlbGVtZW50LmF0dGFjaEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hdHRhY2hFdmVudCgnb24nICsgZG9tRXZlbnQsIGhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudFsnb24nICsgZG9tRXZlbnRdID0gaGFuZGxlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdXRpbGl0aWVzLmxvZ0RlYnVnKCdObyBlbGVtZW50cyBmb3VuZCcpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVIYXNoKG5hbWUpIHtcbiAgICB2YXIgaGFzaCA9IDAsXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBjaGFyYWN0ZXI7XG5cbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbmFtZSA9IG5hbWUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgaWYgKEFycmF5LnByb3RvdHlwZS5yZWR1Y2UpIHtcbiAgICAgICAgcmV0dXJuIG5hbWUuc3BsaXQoXCJcIikucmVkdWNlKGZ1bmN0aW9uKGEsIGIpIHsgYSA9ICgoYSA8PCA1KSAtIGEpICsgYi5jaGFyQ29kZUF0KDApOyByZXR1cm4gYSAmIGE7IH0sIDApO1xuICAgIH1cblxuICAgIGlmIChuYW1lLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gaGFzaDtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbmFtZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBjaGFyYWN0ZXIgPSBuYW1lLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGhhc2ggPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIGNoYXJhY3RlcjtcbiAgICAgICAgaGFzaCA9IGhhc2ggJiBoYXNoO1xuICAgIH1cblxuICAgIHJldHVybiBoYXNoO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQcm9kdWN0KG5hbWUsXG4gICAgc2t1LFxuICAgIHByaWNlLFxuICAgIHF1YW50aXR5LFxuICAgIGJyYW5kLFxuICAgIHZhcmlhbnQsXG4gICAgY2F0ZWdvcnksXG4gICAgcG9zaXRpb24sXG4gICAgY291cG9uQ29kZSxcbiAgICBhdHRyaWJ1dGVzKSB7XG5cbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgdXRpbGl0aWVzLmxvZ0RlYnVnKCdOYW1lIGlzIHJlcXVpcmVkIHdoZW4gY3JlYXRpbmcgYSBwcm9kdWN0Jyk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmICghc2t1KSB7XG4gICAgICAgIHV0aWxpdGllcy5sb2dEZWJ1ZygnU0tVIGlzIHJlcXVpcmVkIHdoZW4gY3JlYXRpbmcgYSBwcm9kdWN0Jyk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChwcmljZSAhPT0gcHJpY2UgfHwgcHJpY2UgPT09IG51bGwpIHtcbiAgICAgICAgdXRpbGl0aWVzLmxvZ0RlYnVnKCdQcmljZSBpcyByZXF1aXJlZCB3aGVuIGNyZWF0aW5nIGEgcHJvZHVjdCcpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIXF1YW50aXR5KSB7XG4gICAgICAgIHF1YW50aXR5ID0gMTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBOYW1lOiBuYW1lLFxuICAgICAgICBTa3U6IHNrdSxcbiAgICAgICAgUHJpY2U6IHByaWNlLFxuICAgICAgICBRdWFudGl0eTogcXVhbnRpdHksXG4gICAgICAgIEJyYW5kOiBicmFuZCxcbiAgICAgICAgVmFyaWFudDogdmFyaWFudCxcbiAgICAgICAgQ2F0ZWdvcnk6IGNhdGVnb3J5LFxuICAgICAgICBQb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgIENvdXBvbkNvZGU6IGNvdXBvbkNvZGUsXG4gICAgICAgIFRvdGFsQW1vdW50OiBxdWFudGl0eSAqIHByaWNlLFxuICAgICAgICBBdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzXG4gICAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUHJvbW90aW9uKGlkLCBjcmVhdGl2ZSwgbmFtZSwgcG9zaXRpb24pIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBJZDogaWQsXG4gICAgICAgIENyZWF0aXZlOiBjcmVhdGl2ZSxcbiAgICAgICAgTmFtZTogbmFtZSxcbiAgICAgICAgUG9zaXRpb246IHBvc2l0aW9uXG4gICAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlSW1wcmVzc2lvbihuYW1lLCBwcm9kdWN0KSB7XG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIHV0aWxpdGllcy5sb2dEZWJ1ZygnTmFtZSBpcyByZXF1aXJlZCB3aGVuIGNyZWF0aW5nIGFuIGltcHJlc3Npb24uJylcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCFwcm9kdWN0KSB7XG4gICAgICAgIHV0aWxpdGllcy5sb2dEZWJ1ZygnUHJvZHVjdCBpcyByZXF1aXJlZCB3aGVuIGNyZWF0aW5nIGFuIGltcHJlc3Npb24uJyk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIE5hbWU6IG5hbWUsXG4gICAgICAgIFByb2R1Y3Q6IHByb2R1Y3RcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUcmFuc2FjdGlvbkF0dHJpYnV0ZXMoaWQsXG4gICAgYWZmaWxpYXRpb24sXG4gICAgY291cG9uQ29kZSxcbiAgICByZXZlbnVlLFxuICAgIHNoaXBwaW5nLFxuICAgIHRheCkge1xuXG4gICAgaWYgKGlkID09PSBudWxsIHx8IHR5cGVvZiBpZCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB1dGlsaXRpZXMubG9nRGVidWcobWVzc2FnZXMuZ2V0RXJyb3JNZXNzYWdlcygnVHJhbnNhY3Rpb25JZFJlcXVpcmVkJykpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBJZDogaWQsXG4gICAgICAgIEFmZmlsaWF0aW9uOiBhZmZpbGlhdGlvbixcbiAgICAgICAgQ291cG9uQ29kZTogY291cG9uQ29kZSxcbiAgICAgICAgUmV2ZW51ZTogcmV2ZW51ZSxcbiAgICAgICAgU2hpcHBpbmc6IHNoaXBwaW5nLFxuICAgICAgICBUYXg6IHRheFxuICAgIH07XG59XG5cblxuZnVuY3Rpb24gY2FsbFNldFVzZXJBdHRyaWJ1dGVPbkZvcndhcmRlcnMoa2V5LCB2YWx1ZSkge1xuICAgIGlmIChmb3J3YXJkZXJzKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZm9yd2FyZGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZvcndhcmRlcnNbaV0uc2V0VXNlckF0dHJpYnV0ZSAmJlxuICAgICAgICAgICAgICAgIGZvcndhcmRlcnNbaV0udXNlckF0dHJpYnV0ZUZpbHRlcnMgJiZcbiAgICAgICAgICAgICAgICAhdXRpbGl0aWVzLmluQXJyYXkoZm9yd2FyZGVyc1tpXS51c2VyQXR0cmlidXRlRmlsdGVycywgZ2VuZXJhdGVIYXNoKGtleSkpKSB7XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZm9yd2FyZGVyc1tpXS5zZXRVc2VyQXR0cmlidXRlKGtleSwgdmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHV0aWxpdGllcy5sb2dEZWJ1ZyhyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHV0aWxpdGllcy5sb2dEZWJ1ZyhlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZpbmRLZXlJbk9iamVjdChvYmosIGtleSkge1xuICAgIGlmKGtleSAmJiBvYmopIHtcbiAgICAgICAgZm9yKHZhciBwcm9wIGluIG9iaikge1xuICAgICAgICAgICAgaWYob2JqLmhhc093blByb3BlcnR5KHByb3ApICYmIHByb3AudG9Mb3dlckNhc2UoKSA9PT0ga2V5LnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkQXR0cmlidXRlVmFsdWUodmFsdWUpIHtcbiAgICByZXR1cm4gIWlzT2JqZWN0KHZhbHVlKSAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIHNhbml0aXplQXR0cmlidXRlcyhhdHRycykge1xuICAgIGlmKCFhdHRycyB8fCAhaXNPYmplY3QoYXR0cnMpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciBzYW5pdGl6ZWRBdHRycyA9IHt9O1xuXG4gICAgZm9yKHZhciBwcm9wIGluIGF0dHJzKSB7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IGF0dHJpYnV0ZSB2YWx1ZXMgYXJlIG5vdCBvYmplY3RzIG9yIGFycmF5cywgd2hpY2ggYXJlIG5vdCB2YWxpZFxuICAgICAgICBpZihhdHRycy5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJiBpc1ZhbGlkQXR0cmlidXRlVmFsdWUoYXR0cnNbcHJvcF0pKSB7XG4gICAgICAgICAgICBzYW5pdGl6ZWRBdHRyc1twcm9wXSA9IGF0dHJzW3Byb3BdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNhbml0aXplZEF0dHJzO1xufVxuXG52YXIgTWVzc2FnZVR5cGUgPSB7XG4gICAgU2Vzc2lvblN0YXJ0OiAxLFxuICAgIFNlc3Npb25FbmQ6IDIsXG4gICAgUGFnZVZpZXc6IDMsXG4gICAgUGFnZUV2ZW50OiA0LFxuICAgIENyYXNoUmVwb3J0OiA1LFxuICAgIE9wdE91dDogNixcbiAgICBQcm9maWxlOiAxNCxcbiAgICBDb21tZXJjZTogMTZcbn07XG5cbnZhciBFdmVudFR5cGUgPSB7XG4gICAgVW5rbm93bjogMCxcbiAgICBOYXZpZ2F0aW9uOiAxLFxuICAgIExvY2F0aW9uOiAyLFxuICAgIFNlYXJjaDogMyxcbiAgICBUcmFuc2FjdGlvbjogNCxcbiAgICBVc2VyQ29udGVudDogNSxcbiAgICBVc2VyUHJlZmVyZW5jZTogNixcbiAgICBTb2NpYWw6IDcsXG4gICAgT3RoZXI6IDgsXG4gICAgTWVkaWE6IDlcbn07XG5cbnZhciBQcm9maWxlTWVzc2FnZVR5cGUgPSB7XG4gICAgTG9nb3V0OiAzXG59O1xuXG5FdmVudFR5cGUuZ2V0TmFtZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgc3dpdGNoIChpZCkge1xuICAgICAgICBjYXNlIEV2ZW50VHlwZS5OYXZpZ2F0aW9uOlxuICAgICAgICAgICAgcmV0dXJuICdOYXZpZ2F0aW9uJztcbiAgICAgICAgY2FzZSBFdmVudFR5cGUuTG9jYXRpb246XG4gICAgICAgICAgICByZXR1cm4gJ0xvY2F0aW9uJztcbiAgICAgICAgY2FzZSBFdmVudFR5cGUuU2VhcmNoOlxuICAgICAgICAgICAgcmV0dXJuICdTZWFyY2gnO1xuICAgICAgICBjYXNlIEV2ZW50VHlwZS5UcmFuc2FjdGlvbjpcbiAgICAgICAgICAgIHJldHVybiAnVHJhbnNhY3Rpb24nO1xuICAgICAgICBjYXNlIEV2ZW50VHlwZS5Vc2VyQ29udGVudDpcbiAgICAgICAgICAgIHJldHVybiAnVXNlciBDb250ZW50JztcbiAgICAgICAgY2FzZSBFdmVudFR5cGUuVXNlclByZWZlcmVuY2U6XG4gICAgICAgICAgICByZXR1cm4gJ1VzZXIgUHJlZmVyZW5jZSc7XG4gICAgICAgIGNhc2UgRXZlbnRUeXBlLlNvY2lhbDpcbiAgICAgICAgICAgIHJldHVybiAnU29jaWFsJztcbiAgICAgICAgY2FzZSBFdmVudFR5cGUuTWVkaWE6XG4gICAgICAgICAgICByZXR1cm4gJ01lZGlhJztcbiAgICAgICAgY2FzZSBDb21tZXJjZUV2ZW50VHlwZS5Qcm9kdWN0QWRkVG9DYXJ0OlxuICAgICAgICAgICAgcmV0dXJuICdQcm9kdWN0IEFkZGVkIHRvIENhcnQnO1xuICAgICAgICBjYXNlIENvbW1lcmNlRXZlbnRUeXBlLlByb2R1Y3RBZGRUb1dpc2hsaXN0OlxuICAgICAgICAgICAgcmV0dXJuICdQcm9kdWN0IEFkZGVkIHRvIFdpc2hsaXN0JztcbiAgICAgICAgY2FzZSBDb21tZXJjZUV2ZW50VHlwZS5Qcm9kdWN0Q2hlY2tvdXQ6XG4gICAgICAgICAgICByZXR1cm4gJ1Byb2R1Y3QgQ2hlY2tvdXQnO1xuICAgICAgICBjYXNlIENvbW1lcmNlRXZlbnRUeXBlLlByb2R1Y3RDaGVja291dE9wdGlvbjpcbiAgICAgICAgICAgIHJldHVybiAnUHJvZHVjdCBDaGVja291dCBPcHRpb25zJztcbiAgICAgICAgY2FzZSBDb21tZXJjZUV2ZW50VHlwZS5Qcm9kdWN0Q2xpY2s6XG4gICAgICAgICAgICByZXR1cm4gJ1Byb2R1Y3QgQ2xpY2snO1xuICAgICAgICBjYXNlIENvbW1lcmNlRXZlbnRUeXBlLlByb2R1Y3RJbXByZXNzaW9uOlxuICAgICAgICAgICAgcmV0dXJuICdQcm9kdWN0IEltcHJlc3Npb24nO1xuICAgICAgICBjYXNlIENvbW1lcmNlRXZlbnRUeXBlLlByb2R1Y3RQdXJjaGFzZTpcbiAgICAgICAgICAgIHJldHVybiAnUHJvZHVjdCBQdXJjaGFzZWQnO1xuICAgICAgICBjYXNlIENvbW1lcmNlRXZlbnRUeXBlLlByb2R1Y3RSZWZ1bmQ6XG4gICAgICAgICAgICByZXR1cm4gJ1Byb2R1Y3QgUmVmdW5kZWQnO1xuICAgICAgICBjYXNlIENvbW1lcmNlRXZlbnRUeXBlLlByb2R1Y3RSZW1vdmVGcm9tQ2FydDpcbiAgICAgICAgICAgIHJldHVybiAnUHJvZHVjdCBSZW1vdmVkIEZyb20gQ2FydCc7XG4gICAgICAgIGNhc2UgQ29tbWVyY2VFdmVudFR5cGUuUHJvZHVjdFJlbW92ZUZyb21XaXNobGlzdDpcbiAgICAgICAgICAgIHJldHVybiAnUHJvZHVjdCBSZW1vdmVkIGZyb20gV2lzaGxpc3QnO1xuICAgICAgICBjYXNlIENvbW1lcmNlRXZlbnRUeXBlLlByb2R1Y3RWaWV3RGV0YWlsOlxuICAgICAgICAgICAgcmV0dXJuICdQcm9kdWN0IFZpZXcgRGV0YWlscyc7XG4gICAgICAgIGNhc2UgQ29tbWVyY2VFdmVudFR5cGUuUHJvbW90aW9uQ2xpY2s6XG4gICAgICAgICAgICByZXR1cm4gJ1Byb21vdGlvbiBDbGljayc7XG4gICAgICAgIGNhc2UgQ29tbWVyY2VFdmVudFR5cGUuUHJvbW90aW9uVmlldzpcbiAgICAgICAgICAgIHJldHVybiAnUHJvbW90aW9uIFZpZXcnO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuICdPdGhlcic7XG4gICAgfVxufTtcblxuLy8gQ29udGludWF0aW9uIG9mIGVudW0gYWJvdmUsIGJ1dCBpbiBzZXBlcmF0ZSBvYmplY3Qgc2luY2Ugd2UgZG9uJ3QgZXhwb3NlIHRoZXNlIHRvIGVuZCB1c2VyXG52YXIgQ29tbWVyY2VFdmVudFR5cGUgPSB7XG4gICAgUHJvZHVjdEFkZFRvQ2FydDogMTAsXG4gICAgUHJvZHVjdFJlbW92ZUZyb21DYXJ0OiAxMSxcbiAgICBQcm9kdWN0Q2hlY2tvdXQ6IDEyLFxuICAgIFByb2R1Y3RDaGVja291dE9wdGlvbjogMTMsXG4gICAgUHJvZHVjdENsaWNrOiAxNCxcbiAgICBQcm9kdWN0Vmlld0RldGFpbDogMTUsXG4gICAgUHJvZHVjdFB1cmNoYXNlOiAxNixcbiAgICBQcm9kdWN0UmVmdW5kOiAxNyxcbiAgICBQcm9tb3Rpb25WaWV3OiAxOCxcbiAgICBQcm9tb3Rpb25DbGljazogMTksXG4gICAgUHJvZHVjdEFkZFRvV2lzaGxpc3Q6IDIwLFxuICAgIFByb2R1Y3RSZW1vdmVGcm9tV2lzaGxpc3Q6IDIxLFxuICAgIFByb2R1Y3RJbXByZXNzaW9uOiAyMlxufTtcblxudmFyIElkZW50aXR5VHlwZSA9IHtcbiAgICBPdGhlcjogMCxcbiAgICBDdXN0b21lcklkOiAxLFxuICAgIEZhY2Vib29rOiAyLFxuICAgIFR3aXR0ZXI6IDMsXG4gICAgR29vZ2xlOiA0LFxuICAgIE1pY3Jvc29mdDogNSxcbiAgICBZYWhvbzogNixcbiAgICBFbWFpbDogNyxcbiAgICBBbGlhczogOCxcbiAgICBGYWNlYm9va0N1c3RvbUF1ZGllbmNlSWQ6IDlcbn07XG5cbklkZW50aXR5VHlwZS5nZXROYW1lID0gZnVuY3Rpb24oaWRlbnRpdHlUeXBlKSB7XG4gICAgc3dpdGNoIChpZGVudGl0eVR5cGUpIHtcbiAgICAgICAgY2FzZSB3aW5kb3cubVBhcnRpY2xlLklkZW50aXR5VHlwZS5DdXN0b21lcklkOlxuICAgICAgICAgICAgcmV0dXJuICdDdXN0b21lciBJRCc7XG4gICAgICAgIGNhc2Ugd2luZG93Lm1QYXJ0aWNsZS5JZGVudGl0eVR5cGUuRmFjZWJvb2s6XG4gICAgICAgICAgICByZXR1cm4gJ0ZhY2Vib29rIElEJztcbiAgICAgICAgY2FzZSB3aW5kb3cubVBhcnRpY2xlLklkZW50aXR5VHlwZS5Ud2l0dGVyOlxuICAgICAgICAgICAgcmV0dXJuICdUd2l0dGVyIElEJztcbiAgICAgICAgY2FzZSB3aW5kb3cubVBhcnRpY2xlLklkZW50aXR5VHlwZS5Hb29nbGU6XG4gICAgICAgICAgICByZXR1cm4gJ0dvb2dsZSBJRCc7XG4gICAgICAgIGNhc2Ugd2luZG93Lm1QYXJ0aWNsZS5JZGVudGl0eVR5cGUuTWljcm9zb2Z0OlxuICAgICAgICAgICAgcmV0dXJuICdNaWNyb3NvZnQgSUQnO1xuICAgICAgICBjYXNlIHdpbmRvdy5tUGFydGljbGUuSWRlbnRpdHlUeXBlLllhaG9vOlxuICAgICAgICAgICAgcmV0dXJuICdZYWhvbyBJRCc7XG4gICAgICAgIGNhc2Ugd2luZG93Lm1QYXJ0aWNsZS5JZGVudGl0eVR5cGUuRW1haWw6XG4gICAgICAgICAgICByZXR1cm4gJ0VtYWlsJztcbiAgICAgICAgY2FzZSB3aW5kb3cubVBhcnRpY2xlLklkZW50aXR5VHlwZS5BbGlhczpcbiAgICAgICAgICAgIHJldHVybiAnQWxpYXMgSUQnO1xuICAgICAgICBjYXNlIHdpbmRvdy5tUGFydGljbGUuSWRlbnRpdHlUeXBlLkZhY2Vib29rQ3VzdG9tQXVkaWVuY2VJZDpcbiAgICAgICAgICAgIHJldHVybiAnRmFjZWJvb2sgQXBwIFVzZXIgSUQnO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuICdPdGhlciBJRCc7XG4gICAgfVxufTtcblxudmFyIERlZmF1bHRDb25maWcgPSB7XG4gICAgQ29va2llTmFtZTogJ21wcnRjbC1hcGknLFx0XHQvLyBOYW1lIG9mIHRoZSBjb29raWUgc3RvcmVkIG9uIHRoZSB1c2VyJ3MgbWFjaGluZVxuICAgIENvb2tpZURvbWFpbjogbnVsbCxcdFx0XHRcdC8vIElmIG51bGwsIGRlZmF1bHRzIHRvIGN1cnJlbnQgbG9jYXRpb24uaG9zdFxuICAgIERlYnVnOiBmYWxzZSxcdFx0XHRcdFx0Ly8gSWYgdHJ1ZSwgd2lsbCBwcmludCBkZWJ1ZyBtZXNzYWdlcyB0byBicm93c2VyIGNvbnNvbGVcbiAgICBDb29raWVFeHBpcmF0aW9uOiAzNjUsXHRcdFx0Ly8gQ29va2llIGV4cGlyYXRpb24gdGltZSBpbiBkYXlzXG4gICAgVmVyYm9zZTogZmFsc2UsXHRcdFx0XHRcdC8vIFdoZXRoZXIgdGhlIHNlcnZlciB3aWxsIHJldHVybiB2ZXJib3NlIHJlc3BvbnNlc1xuICAgIEluY2x1ZGVSZWZlcnJlcjogdHJ1ZSxcdFx0XHQvLyBJbmNsdWRlIHVzZXIncyByZWZlcnJlclxuICAgIEluY2x1ZGVHb29nbGVBZHdvcmRzOiB0cnVlLFx0XHQvLyBJbmNsdWRlIHV0bV9zb3VyY2UgYW5kIHV0bV9wcm9wZXJ0aWVzXG4gICAgVGltZW91dDogMzAwLFx0XHRcdFx0XHQvLyBUaW1lb3V0IGluIG1pbGxpc2Vjb25kcyBmb3IgbG9nZ2luZyBmdW5jdGlvbnNcbiAgICBTZXNzaW9uVGltZW91dDogMzAsXHRcdFx0XHQvLyBTZXNzaW9uIHRpbWVvdXQgaW4gbWludXRlc1xuICAgIFNhbmRib3g6IGZhbHNlLCAgICAgICAgICAgICAgICAgLy8gRXZlbnRzIGFyZSBtYXJrZWQgYXMgZGVidWcgYW5kIG9ubHkgZm9yd2FyZGVkIHRvIGRlYnVnIGZvcndhcmRlcnMsXG4gICAgVmVyc2lvbjogbnVsbCAgICAgICAgICAgICAgICAgICAvLyBUaGUgdmVyc2lvbiBvZiB0aGlzIHdlYnNpdGUvYXBwXG59O1xuXG52YXIgQ29uZmlnID0ge307XG5cbnZhciBOYXRpdmVTZGtQYXRocyA9IHtcbiAgICBMb2dFdmVudDogJ2xvZ0V2ZW50JyxcbiAgICBTZXRVc2VySWRlbnRpdHk6ICdzZXRVc2VySWRlbnRpdHknLFxuICAgIFJlbW92ZVVzZXJJZGVudGl0eTogJ3JlbW92ZVVzZXJJZGVudGl0eScsXG4gICAgU2V0VXNlclRhZzogJ3NldFVzZXJUYWcnLFxuICAgIFJlbW92ZVVzZXJUYWc6ICdyZW1vdmVVc2VyVGFnJyxcbiAgICBTZXRVc2VyQXR0cmlidXRlOiAnc2V0VXNlckF0dHJpYnV0ZScsXG4gICAgUmVtb3ZlVXNlckF0dHJpYnV0ZTogJ3JlbW92ZVVzZXJBdHRyaWJ1dGUnLFxuICAgIFNldFNlc3Npb25BdHRyaWJ1dGU6ICdzZXRTZXNzaW9uQXR0cmlidXRlJyxcbiAgICBBZGRUb1Byb2R1Y3RCYWc6ICdhZGRUb1Byb2R1Y3RCYWcnLFxuICAgIFJlbW92ZUZyb21Qcm9kdWN0QmFnOiAncmVtb3ZlRnJvbVByb2R1Y3RCYWcnLFxuICAgIENsZWFyUHJvZHVjdEJhZzogJ2NsZWFyUHJvZHVjdEJhZycsXG4gICAgQWRkVG9DYXJ0OiAnYWRkVG9DYXJ0JyxcbiAgICBSZW1vdmVGcm9tQ2FydDogJ3JlbW92ZUZyb21DYXJ0JyxcbiAgICBDbGVhckNhcnQ6ICdjbGVhckNhcnQnLFxuICAgIExvZ091dDogJ2xvZ091dCcsXG4gICAgU2V0VXNlckF0dHJpYnV0ZUxpc3Q6ICdzZXRVc2VyQXR0cmlidXRlTGlzdCcsXG4gICAgUmVtb3ZlQWxsVXNlckF0dHJpYnV0ZXM6ICdyZW1vdmVBbGxVc2VyQXR0cmlidXRlcycsXG4gICAgR2V0VXNlckF0dHJpYnV0ZXNMaXN0czogJ2dldFVzZXJBdHRyaWJ1dGVzTGlzdHMnLFxuICAgIEdldEFsbFVzZXJBdHRyaWJ1dGVzOiAnZ2V0QWxsVXNlckF0dHJpYnV0ZXMnXG59O1xuXG52YXIgUHJvZHVjdEFjdGlvblR5cGUgPSB7XG4gICAgVW5rbm93bjogMCxcbiAgICBBZGRUb0NhcnQ6IDEsXG4gICAgUmVtb3ZlRnJvbUNhcnQ6IDIsXG4gICAgQ2hlY2tvdXQ6IDMsXG4gICAgQ2hlY2tvdXRPcHRpb246IDQsXG4gICAgQ2xpY2s6IDUsXG4gICAgVmlld0RldGFpbDogNixcbiAgICBQdXJjaGFzZTogNyxcbiAgICBSZWZ1bmQ6IDgsXG4gICAgQWRkVG9XaXNobGlzdDogOSxcbiAgICBSZW1vdmVGcm9tV2lzaGxpc3Q6IDEwXG59O1xuXG5Qcm9kdWN0QWN0aW9uVHlwZS5nZXROYW1lID0gZnVuY3Rpb24oaWQpIHtcbiAgICBzd2l0Y2ggKGlkKSB7XG4gICAgICAgIGNhc2UgUHJvZHVjdEFjdGlvblR5cGUuQWRkVG9DYXJ0OlxuICAgICAgICAgICAgcmV0dXJuICdBZGQgdG8gQ2FydCc7XG4gICAgICAgIGNhc2UgUHJvZHVjdEFjdGlvblR5cGUuUmVtb3ZlRnJvbUNhcnQ6XG4gICAgICAgICAgICByZXR1cm4gJ1JlbW92ZSBmcm9tIENhcnQnO1xuICAgICAgICBjYXNlIFByb2R1Y3RBY3Rpb25UeXBlLkNoZWNrb3V0OlxuICAgICAgICAgICAgcmV0dXJuICdDaGVja291dCc7XG4gICAgICAgIGNhc2UgUHJvZHVjdEFjdGlvblR5cGUuQ2hlY2tvdXRPcHRpb246XG4gICAgICAgICAgICByZXR1cm4gJ0NoZWNrb3V0IE9wdGlvbic7XG4gICAgICAgIGNhc2UgUHJvZHVjdEFjdGlvblR5cGUuQ2xpY2s6XG4gICAgICAgICAgICByZXR1cm4gJ0NsaWNrJztcbiAgICAgICAgY2FzZSBQcm9kdWN0QWN0aW9uVHlwZS5WaWV3RGV0YWlsOlxuICAgICAgICAgICAgcmV0dXJuICdWaWV3IERldGFpbCc7XG4gICAgICAgIGNhc2UgUHJvZHVjdEFjdGlvblR5cGUuUHVyY2hhc2U6XG4gICAgICAgICAgICByZXR1cm4gJ1B1cmNoYXNlJztcbiAgICAgICAgY2FzZSBQcm9kdWN0QWN0aW9uVHlwZS5SZWZ1bmQ6XG4gICAgICAgICAgICByZXR1cm4gJ1JlZnVuZCc7XG4gICAgICAgIGNhc2UgUHJvZHVjdEFjdGlvblR5cGUuQWRkVG9XaXNobGlzdDpcbiAgICAgICAgICAgIHJldHVybiAnQWRkIHRvIFdpc2hsaXN0JztcbiAgICAgICAgY2FzZSBQcm9kdWN0QWN0aW9uVHlwZS5SZW1vdmVGcm9tV2lzaGxpc3Q6XG4gICAgICAgICAgICByZXR1cm4gJ1JlbW92ZSBmcm9tIFdpc2hsaXN0JztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiAnVW5rbm93bic7XG4gICAgfVxufTtcblxuLy90aGVzZSBhcmUgdGhlIGFjdGlvbiBuYW1lcyB1c2VkIGJ5IHNlcnZlciBhbmQgbW9iaWxlIFNES3Mgd2hlbiBleHBhbmRpbmcgYSBDb21tZXJjZUV2ZW50XG5Qcm9kdWN0QWN0aW9uVHlwZS5nZXRFeHBhbnNpb25OYW1lID0gZnVuY3Rpb24oaWQpIHtcbiAgICBzd2l0Y2ggKGlkKSB7XG4gICAgICAgIGNhc2UgUHJvZHVjdEFjdGlvblR5cGUuQWRkVG9DYXJ0OlxuICAgICAgICAgICAgcmV0dXJuICdhZGRfdG9fY2FydCc7XG4gICAgICAgIGNhc2UgUHJvZHVjdEFjdGlvblR5cGUuUmVtb3ZlRnJvbUNhcnQ6XG4gICAgICAgICAgICByZXR1cm4gJ3JlbW92ZV9mcm9tX2NhcnQnO1xuICAgICAgICBjYXNlIFByb2R1Y3RBY3Rpb25UeXBlLkNoZWNrb3V0OlxuICAgICAgICAgICAgcmV0dXJuICdjaGVja291dCc7XG4gICAgICAgIGNhc2UgUHJvZHVjdEFjdGlvblR5cGUuQ2hlY2tvdXRPcHRpb246XG4gICAgICAgICAgICByZXR1cm4gJ2NoZWNrb3V0X29wdGlvbic7XG4gICAgICAgIGNhc2UgUHJvZHVjdEFjdGlvblR5cGUuQ2xpY2s6XG4gICAgICAgICAgICByZXR1cm4gJ2NsaWNrJztcbiAgICAgICAgY2FzZSBQcm9kdWN0QWN0aW9uVHlwZS5WaWV3RGV0YWlsOlxuICAgICAgICAgICAgcmV0dXJuICd2aWV3X2RldGFpbCc7XG4gICAgICAgIGNhc2UgUHJvZHVjdEFjdGlvblR5cGUuUHVyY2hhc2U6XG4gICAgICAgICAgICByZXR1cm4gJ3B1cmNoYXNlJztcbiAgICAgICAgY2FzZSBQcm9kdWN0QWN0aW9uVHlwZS5SZWZ1bmQ6XG4gICAgICAgICAgICByZXR1cm4gJ3JlZnVuZCc7XG4gICAgICAgIGNhc2UgUHJvZHVjdEFjdGlvblR5cGUuQWRkVG9XaXNobGlzdDpcbiAgICAgICAgICAgIHJldHVybiAnYWRkX3RvX3dpc2hsaXN0JztcbiAgICAgICAgY2FzZSBQcm9kdWN0QWN0aW9uVHlwZS5SZW1vdmVGcm9tV2lzaGxpc3Q6XG4gICAgICAgICAgICByZXR1cm4gJ3JlbW92ZV9mcm9tX3dpc2hsaXN0JztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiAnVW5rbm93bic7XG4gICAgfVxufTtcblxudmFyIFByb21vdGlvbkFjdGlvblR5cGUgPSB7XG4gICAgVW5rbm93bjogMCxcbiAgICBQcm9tb3Rpb25WaWV3OiAxLFxuICAgIFByb21vdGlvbkNsaWNrOiAyLFxufTtcblxuUHJvbW90aW9uQWN0aW9uVHlwZS5nZXROYW1lID0gZnVuY3Rpb24oaWQpIHtcbiAgICBzd2l0Y2ggKGlkKSB7XG4gICAgICAgIGNhc2UgUHJvbW90aW9uQWN0aW9uVHlwZS5Qcm9tb3Rpb25WaWV3OlxuICAgICAgICAgICAgcmV0dXJuICdQcm9tb3Rpb24gVmlldyc7XG4gICAgICAgIGNhc2UgUHJvbW90aW9uQWN0aW9uVHlwZS5Qcm9tb3Rpb25DbGljazpcbiAgICAgICAgICAgIHJldHVybiAnUHJvbW90aW9uIENsaWNrJztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiAnVW5rbm93bic7XG4gICAgfVxufTtcblxuLy90aGVzZSBhcmUgdGhlIG5hbWVzIHRoYXQgdGhlIHNlcnZlciBhbmQgbW9iaWxlIFNES3MgdXNlIHdoaWxlIGV4cGFuZGluZyBDb21tZXJjZUV2ZW50XG5Qcm9tb3Rpb25BY3Rpb25UeXBlLmdldEV4cGFuc2lvbk5hbWUgPSBmdW5jdGlvbihpZCkge1xuICAgIHN3aXRjaCAoaWQpIHtcbiAgICAgICAgY2FzZSBQcm9tb3Rpb25BY3Rpb25UeXBlLlByb21vdGlvblZpZXc6XG4gICAgICAgICAgICByZXR1cm4gJ3ZpZXcnO1xuICAgICAgICBjYXNlIFByb21vdGlvbkFjdGlvblR5cGUuUHJvbW90aW9uQ2xpY2s6XG4gICAgICAgICAgICByZXR1cm4gJ2NsaWNrJztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiAnVW5rbm93bic7XG4gICAgfVxufTtcblxudmFyIG1QYXJ0aWNsZSA9IHtcbiAgICBpc0lPUzogZmFsc2UsXG4gICAgaXNEZWJ1ZzogZmFsc2UsXG4gICAgaXNTYW5kYm94OiBmYWxzZSxcbiAgICBnZW5lcmF0ZUhhc2g6IGdlbmVyYXRlSGFzaCxcbiAgICBJZGVudGl0eVR5cGU6IElkZW50aXR5VHlwZSxcbiAgICBFdmVudFR5cGU6IEV2ZW50VHlwZSxcbiAgICBDb21tZXJjZUV2ZW50VHlwZTogQ29tbWVyY2VFdmVudFR5cGUsXG4gICAgUHJvbW90aW9uVHlwZTogUHJvbW90aW9uQWN0aW9uVHlwZSxcbiAgICBQcm9kdWN0QWN0aW9uVHlwZTogUHJvZHVjdEFjdGlvblR5cGUsXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0b2tlbixcbiAgICAgICAgICAgIGNvbmZpZztcblxuICAgICAgICB1dGlsaXRpZXMubG9nRGVidWcobWVzc2FnZXMuZ2V0SW5mb3JtYXRpb25NZXNzYWdlcygnU3RhcnRpbmdJbml0aWFsaXphdGlvbicpKTtcblxuICAgICAgICAvLyBTZXQgY29uZmlndXJhdGlvbiB0byBkZWZhdWx0IHNldHRpbmdzXG4gICAgICAgIG1lcmdlQ29uZmlnKHt9KTtcbiAgICAgICAgLy8gTG9hZCBhbnkgc2V0dGluZ3MvaWRlbnRpdGllcy9hdHRyaWJ1dGVzIGZyb20gY29va2llXG4gICAgICAgIGNvb2tpZS5nZXRDb29raWUoKTtcblxuICAgICAgICBpZiAoYXJndW1lbnRzICYmIGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIGRldiB0b2tlblxuICAgICAgICAgICAgICAgIHRva2VuID0gYXJndW1lbnRzWzBdO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRldlRva2VuICE9PSB0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICBtUGFydGljbGUuZW5kU2Vzc2lvbigpO1xuICAgICAgICAgICAgICAgICAgICBkZXZUb2tlbiA9IHRva2VuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGluaXRGb3J3YXJkZXJzKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgdHlwZW9mIGFyZ3VtZW50c1sxXSA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGNvbmZpZyA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvbmZpZykge1xuICAgICAgICAgICAgICAgIG1lcmdlQ29uZmlnKGNvbmZpZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDYWxsIGFueSBmdW5jdGlvbnMgdGhhdCBhcmUgd2FpdGluZyBmb3IgdGhlIGxpYnJhcnkgdG8gYmUgaW5pdGlhbGl6ZWRcbiAgICAgICAgaWYgKHJlYWR5UXVldWUgJiYgcmVhZHlRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVhZHlRdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVhZHlRdWV1ZVtpXSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlYWR5UXVldWVbaV0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlYWR5UXVldWUgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvb2tpZS5zZXRDb29raWUoXG4gICAgICAgICAgICAgICAgQ29uZmlnLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgc2lkOiBzZXNzaW9uSWQsIGllOiBpc0VuYWJsZWQsIHNhOiBzZXNzaW9uQXR0cmlidXRlcywgXG4gICAgICAgICAgICAgICAgICAgIHVhOiB1c2VyQXR0cmlidXRlcywgdWk6IHVzZXJJZGVudGl0aWVzLCBzczogc2VydmVyU2V0dGluZ3MsIGR0OiBkZXZUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgbGVzOiBsYXN0RXZlbnRTZW50ID8gbGFzdEV2ZW50U2VudC5nZXRUaW1lKCkgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBhdjogYXBwVmVyc2lvbixcbiAgICAgICAgICAgICAgICAgICAgY2dpZDogY2xpZW50SWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICBpc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9LFxuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gQ29tcGxldGVseSByZXNldHMgdGhlIHN0YXRlIG9mIHRoZSBTREsuIG1QYXJ0aWNsZS5pbml0KCkgd2lsbCBuZWVkIHRvIGJlIGNhbGxlZCBhZ2Fpbi5cblxuICAgICAgICBpc0VuYWJsZWQgPSB0cnVlO1xuICAgICAgICBzdG9wVHJhY2tpbmcoKTtcbiAgICAgICAgZGV2VG9rZW4gPSBudWxsO1xuICAgICAgICBzZXNzaW9uSWQgPSBudWxsO1xuICAgICAgICBhcHBOYW1lID0gbnVsbDtcbiAgICAgICAgYXBwVmVyc2lvbiA9IG51bGw7XG4gICAgICAgIHNlc3Npb25BdHRyaWJ1dGVzID0ge307XG4gICAgICAgIHVzZXJBdHRyaWJ1dGVzID0ge307XG4gICAgICAgIHVzZXJJZGVudGl0aWVzID0gW107XG4gICAgICAgIGZvcndhcmRlcnMgPSBbXTtcbiAgICAgICAgZm9yd2FyZGVyQ29uc3RydWN0b3JzID0gW107XG4gICAgICAgIHByb2R1Y3RzQmFncyA9IHt9O1xuICAgICAgICBjYXJ0UHJvZHVjdHMgPSBbXTtcbiAgICAgICAgc2VydmVyU2V0dGluZ3MgPSBudWxsO1xuICAgICAgICBtZXJnZUNvbmZpZyh7fSk7XG4gICAgICAgIGNvb2tpZS5zZXRDb29raWUoXG4gICAgICAgICAgICBDb25maWcsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2lkOiBzZXNzaW9uSWQsIGllOiBpc0VuYWJsZWQsIHNhOiBzZXNzaW9uQXR0cmlidXRlcywgXG4gICAgICAgICAgICAgICAgdWE6IHVzZXJBdHRyaWJ1dGVzLCB1aTogdXNlcklkZW50aXRpZXMsIHNzOiBzZXJ2ZXJTZXR0aW5ncywgZHQ6IGRldlRva2VuLFxuICAgICAgICAgICAgICAgIGxlczogbGFzdEV2ZW50U2VudCA/IGxhc3RFdmVudFNlbnQuZ2V0VGltZSgpIDogbnVsbCxcbiAgICAgICAgICAgICAgICBhdjogYXBwVmVyc2lvbixcbiAgICAgICAgICAgICAgICBjZ2lkOiBjbGllbnRJZFxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIGlzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB9LFxuICAgIHJlYWR5OiBmdW5jdGlvbihmKSB7XG4gICAgICAgIGlmIChpc0luaXRpYWxpemVkICYmIHR5cGVvZiBmID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGYoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlYWR5UXVldWUucHVzaChmKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0VmVyc2lvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzZGtWZXJzaW9uO1xuICAgIH0sXG4gICAgc2V0QXBwVmVyc2lvbjogZnVuY3Rpb24odmVyc2lvbikge1xuICAgICAgICBhcHBWZXJzaW9uID0gdmVyc2lvbjtcbiAgICAgICAgY29va2llLnNldENvb2tpZShcbiAgICAgICAgICAgIENvbmZpZyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzaWQ6IHNlc3Npb25JZCwgaWU6IGlzRW5hYmxlZCwgc2E6IHNlc3Npb25BdHRyaWJ1dGVzLCBcbiAgICAgICAgICAgICAgICB1YTogdXNlckF0dHJpYnV0ZXMsIHVpOiB1c2VySWRlbnRpdGllcywgc3M6IHNlcnZlclNldHRpbmdzLCBkdDogZGV2VG9rZW4sXG4gICAgICAgICAgICAgICAgbGVzOiBsYXN0RXZlbnRTZW50ID8gbGFzdEV2ZW50U2VudC5nZXRUaW1lKCkgOiBudWxsLFxuICAgICAgICAgICAgICAgIGF2OiBhcHBWZXJzaW9uLFxuICAgICAgICAgICAgICAgIGNnaWQ6IGNsaWVudElkXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSxcbiAgICBnZXRBcHBOYW1lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGFwcE5hbWU7XG4gICAgfSxcbiAgICBzZXRBcHBOYW1lOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIGFwcE5hbWUgPSBuYW1lO1xuICAgIH0sXG4gICAgZ2V0QXBwVmVyc2lvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBhcHBWZXJzaW9uO1xuICAgIH0sXG4gICAgc3RvcFRyYWNraW5nTG9jYXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICBzdG9wVHJhY2tpbmcoKTtcbiAgICB9LFxuICAgIHN0YXJ0VHJhY2tpbmdMb2NhdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHN0YXJ0VHJhY2tpbmcoKTtcbiAgICB9LFxuICAgIHNldFBvc2l0aW9uOiBmdW5jdGlvbihsYXQsIGxuZykge1xuICAgICAgICBpZiAodHlwZW9mIGxhdCA9PT0gJ251bWJlcicgJiYgdHlwZW9mIGxuZyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGN1cnJlbnRQb3NpdGlvbiA9IHtcbiAgICAgICAgICAgICAgICBsYXQ6IGxhdCxcbiAgICAgICAgICAgICAgICBsbmc6IGxuZ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHV0aWxpdGllcy5sb2dEZWJ1ZygnUG9zaXRpb24gbGF0aXR1ZGUgYW5kL29yIGxvbmdpdHVkZSBhcmUgaW52YWxpZCcpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRVc2VySWRlbnRpdHk6IGZ1bmN0aW9uKGlkLCB0eXBlKSB7XG4gICAgICAgIGlmIChjYW5Mb2coKSkge1xuICAgICAgICAgICAgdmFyIHVzZXJJZGVudGl0eSA9IHtcbiAgICAgICAgICAgICAgICBJZGVudGl0eTogaWQsXG4gICAgICAgICAgICAgICAgVHlwZTogdHlwZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbVBhcnRpY2xlLnJlbW92ZVVzZXJJZGVudGl0eShpZCk7XG4gICAgICAgICAgICB1c2VySWRlbnRpdGllcy5wdXNoKHVzZXJJZGVudGl0eSk7XG5cbiAgICAgICAgICAgIGlmICghdHJ5TmF0aXZlU2RrKE5hdGl2ZVNka1BhdGhzLlNldFVzZXJJZGVudGl0eSwgSlNPTi5zdHJpbmdpZnkodXNlcklkZW50aXR5KSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZm9yd2FyZGVycykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZvcndhcmRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3J3YXJkZXJzW2ldLnNldFVzZXJJZGVudGl0eSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICghZm9yd2FyZGVyc1tpXS51c2VySWRlbnRpdHlGaWx0ZXJzIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICF1dGlsaXRpZXMuaW5BcnJheShmb3J3YXJkZXJzW2ldLnVzZXJJZGVudGl0eUZpbHRlcnMsIHR5cGUpKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGZvcndhcmRlcnNbaV0uc2V0VXNlcklkZW50aXR5KGlkLCB0eXBlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXRpbGl0aWVzLmxvZ0RlYnVnKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb29raWUuc2V0Q29va2llKFxuICAgICAgICAgICAgICAgIENvbmZpZyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHNpZDogc2Vzc2lvbklkLCBpZTogaXNFbmFibGVkLCBzYTogc2Vzc2lvbkF0dHJpYnV0ZXMsIFxuICAgICAgICAgICAgICAgICAgICB1YTogdXNlckF0dHJpYnV0ZXMsIHVpOiB1c2VySWRlbnRpdGllcywgc3M6IHNlcnZlclNldHRpbmdzLCBkdDogZGV2VG9rZW4sXG4gICAgICAgICAgICAgICAgICAgIGxlczogbGFzdEV2ZW50U2VudCA/IGxhc3RFdmVudFNlbnQuZ2V0VGltZSgpIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgYXY6IGFwcFZlcnNpb24sXG4gICAgICAgICAgICAgICAgICAgIGNnaWQ6IGNsaWVudElkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0VXNlcklkZW50aXR5OiBmdW5jdGlvbihpZCkge1xuICAgICAgICB2YXIgZm91bmRJZGVudGl0eSA9IG51bGw7XG5cbiAgICAgICAgdXNlcklkZW50aXRpZXMuZm9yRWFjaChmdW5jdGlvbihpZGVudGl0eSkge1xuICAgICAgICAgICAgaWYgKGlkZW50aXR5LklkZW50aXR5ID09PSBpZCkge1xuICAgICAgICAgICAgICAgIGZvdW5kSWRlbnRpdHkgPSBpZGVudGl0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZvdW5kSWRlbnRpdHk7XG4gICAgfSxcbiAgICByZW1vdmVVc2VySWRlbnRpdHk6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIHZhciBpID0gMDtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdXNlcklkZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh1c2VySWRlbnRpdGllc1tpXS5JZGVudGl0eSA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICB1c2VySWRlbnRpdGllcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdHJ5TmF0aXZlU2RrKE5hdGl2ZVNka1BhdGhzLlJlbW92ZVVzZXJJZGVudGl0eSwgaWQpO1xuICAgICAgICBjb29raWUuc2V0Q29va2llKFxuICAgICAgICAgICAgICAgIENvbmZpZyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHNpZDogc2Vzc2lvbklkLCBpZTogaXNFbmFibGVkLCBzYTogc2Vzc2lvbkF0dHJpYnV0ZXMsIFxuICAgICAgICAgICAgICAgICAgICB1YTogdXNlckF0dHJpYnV0ZXMsIHVpOiB1c2VySWRlbnRpdGllcywgc3M6IHNlcnZlclNldHRpbmdzLCBkdDogZGV2VG9rZW4sXG4gICAgICAgICAgICAgICAgICAgIGxlczogbGFzdEV2ZW50U2VudCA/IGxhc3RFdmVudFNlbnQuZ2V0VGltZSgpIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgYXY6IGFwcFZlcnNpb24sXG4gICAgICAgICAgICAgICAgICAgIGNnaWQ6IGNsaWVudElkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICB9LFxuICAgIHN0YXJ0TmV3U2Vzc2lvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIEVuZHMgdGhlIGN1cnJlbnQgc2Vzc2lvbiBpZiBvbmUgaXMgaW4gcHJvZ3Jlc3NcblxuICAgICAgICB1dGlsaXRpZXMubG9nRGVidWcobWVzc2FnZXMuZ2V0SW5mb3JtYXRpb25NZXNzYWdlcygnU3RhcnRpbmdOZXdTZXNzaW9uJykpO1xuXG4gICAgICAgIGlmIChjYW5Mb2coKSkge1xuICAgICAgICAgICAgbVBhcnRpY2xlLmVuZFNlc3Npb24oKTtcbiAgICAgICAgICAgIHNlc3Npb25JZCA9IGdlbmVyYXRlVW5pcXVlSWQoKTtcblxuICAgICAgICAgICAgaWYgKCFsYXN0RXZlbnRTZW50KSB7XG4gICAgICAgICAgICAgICAgbGFzdEV2ZW50U2VudCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxvZ0V2ZW50KE1lc3NhZ2VUeXBlLlNlc3Npb25TdGFydCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB1dGlsaXRpZXMubG9nRGVidWcobWVzc2FnZXMuZ2V0SW5mb3JtYXRpb25NZXNzYWdlcygnQWJhbmRvblN0YXJ0U2Vzc2lvbicpKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZW5kU2Vzc2lvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHV0aWxpdGllcy5sb2dEZWJ1ZyhtZXNzYWdlcy5nZXRJbmZvcm1hdGlvbk1lc3NhZ2VzKCdTdGFydGluZ0VuZFNlc3Npb24nKSk7XG5cbiAgICAgICAgLy8gRW5kcyB0aGUgY3VycmVudCBzZXNzaW9uLlxuICAgICAgICBpZiAoY2FuTG9nKCkpIHtcbiAgICAgICAgICAgIGlmICghc2Vzc2lvbklkKSB7XG4gICAgICAgICAgICAgICAgdXRpbGl0aWVzLmxvZ0RlYnVnKG1lc3NhZ2VzLmdldEluZm9ybWF0aW9uTWVzc2FnZXMoJ05vU2Vzc2lvblRvRW5kJykpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbG9nRXZlbnQoTWVzc2FnZVR5cGUuU2Vzc2lvbkVuZCk7XG5cbiAgICAgICAgICAgIHNlc3Npb25JZCA9IG51bGw7XG4gICAgICAgICAgICBzZXNzaW9uQXR0cmlidXRlcyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdXRpbGl0aWVzLmxvZ0RlYnVnKG1lc3NhZ2VzLmdldEluZm9ybWF0aW9uTWVzc2FnZXMoJ0FiYW5kb25FbmRTZXNzaW9uJykpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBsb2dFdmVudDogZnVuY3Rpb24oZXZlbnROYW1lLCBldmVudFR5cGUsIGV2ZW50SW5mbywgY3VzdG9tRmxhZ3MpIHtcbiAgICAgICAgaWYgKHR5cGVvZiAoZXZlbnROYW1lKSAhPSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdXRpbGl0aWVzLmxvZ0RlYnVnKG1lc3NhZ2VzLmdldEVycm9yTWVzc2FnZXMoJ0V2ZW50TmFtZUludmFsaWRUeXBlJykpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFldmVudFR5cGUpIHtcbiAgICAgICAgICAgIGV2ZW50VHlwZSA9IEV2ZW50VHlwZS5Vbmtub3duO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc0V2ZW50VHlwZShldmVudFR5cGUpKSB7XG4gICAgICAgICAgICB1dGlsaXRpZXMubG9nRGVidWcoJ0ludmFsaWQgZXZlbnQgdHlwZTogJyArIGV2ZW50VHlwZSArICcsIG11c3QgYmUgb25lIG9mOiBcXG4nICsgSlNPTi5zdHJpbmdpZnkoRXZlbnRUeXBlKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNhbkxvZygpKSB7XG4gICAgICAgICAgICB1dGlsaXRpZXMubG9nRGVidWcobWVzc2FnZXMuZ2V0RXJyb3JNZXNzYWdlcygnTG9nZ2luZ0Rpc2FibGVkJykpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFsYXN0RXZlbnRTZW50KSB7XG4gICAgICAgICAgICBsYXN0RXZlbnRTZW50ID0gbmV3IERhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChuZXcgRGF0ZSgpID4gbmV3IERhdGUobGFzdEV2ZW50U2VudC5nZXRUaW1lKCkgKyBDb25maWcuU2Vzc2lvblRpbWVvdXQgKiA2MDAwMCkpIHtcbiAgICAgICAgICAgIC8vIFNlc3Npb24gaGFzIHRpbWVkIG91dCwgc3RhcnQgYSBuZXcgb25lXG4gICAgICAgICAgICBtUGFydGljbGUuc3RhcnROZXdTZXNzaW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsb2dFdmVudChNZXNzYWdlVHlwZS5QYWdlRXZlbnQsIGV2ZW50TmFtZSwgZXZlbnRJbmZvLCBldmVudFR5cGUsIGN1c3RvbUZsYWdzKTtcbiAgICB9LFxuICAgIGxvZ0Vycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGVycm9yID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBlcnJvciA9IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvclxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvZ0V2ZW50KE1lc3NhZ2VUeXBlLkNyYXNoUmVwb3J0LFxuICAgICAgICAgICAgZXJyb3IubmFtZSA/IGVycm9yLm5hbWUgOiAnRXJyb3InLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG06IGVycm9yLm1lc3NhZ2UgPyBlcnJvci5tZXNzYWdlIDogZXJyb3IsXG4gICAgICAgICAgICAgICAgczogJ0Vycm9yJyxcbiAgICAgICAgICAgICAgICB0OiBlcnJvci5zdGFja1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEV2ZW50VHlwZS5PdGhlcik7XG4gICAgfSxcbiAgICBsb2dMaW5rOiBmdW5jdGlvbihzZWxlY3RvciwgZXZlbnROYW1lLCBldmVudFR5cGUsIGV2ZW50SW5mbykge1xuICAgICAgICBhZGRFdmVudEhhbmRsZXIoJ2NsaWNrJywgc2VsZWN0b3IsIGV2ZW50TmFtZSwgZXZlbnRJbmZvLCBldmVudFR5cGUpO1xuICAgIH0sXG4gICAgbG9nRm9ybTogZnVuY3Rpb24oc2VsZWN0b3IsIGV2ZW50TmFtZSwgZXZlbnRUeXBlLCBldmVudEluZm8pIHtcbiAgICAgICAgYWRkRXZlbnRIYW5kbGVyKCdzdWJtaXQnLCBzZWxlY3RvciwgZXZlbnROYW1lLCBldmVudEluZm8sIGV2ZW50VHlwZSk7XG4gICAgfSxcbiAgICBsb2dQYWdlVmlldzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBldmVudE5hbWUgPSBudWxsLFxuICAgICAgICAgICAgYXR0cnMgPSBudWxsLFxuICAgICAgICAgICAgZmxhZ3MgPSBudWxsO1xuXG4gICAgICAgIGlmIChjYW5Mb2coKSkge1xuICAgICAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIG9yaWdpbmFsIGZ1bmN0aW9uIHNpZ25hdHVyZVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGV2ZW50TmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICAgICAgICAgICAgICBhdHRycyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvc3RuYW1lOiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogd2luZG93LmRvY3VtZW50LnRpdGxlXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBmbGFncyA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgICAgIGF0dHJzID0gYXJndW1lbnRzWzFdO1xuXG4gICAgICAgICAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIGZsYWdzID0gYXJndW1lbnRzWzJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbG9nRXZlbnQoTWVzc2FnZVR5cGUuUGFnZVZpZXcsIGV2ZW50TmFtZSwgYXR0cnMsIEV2ZW50VHlwZS5Vbmtub3duLCBmbGFncyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGVDb21tZXJjZToge1xuICAgICAgICBQcm9kdWN0QmFnczoge1xuICAgICAgICAgICAgYWRkOiBmdW5jdGlvbihwcm9kdWN0QmFnTmFtZSwgcHJvZHVjdCkge1xuICAgICAgICAgICAgICAgIGlmICghcHJvZHVjdHNCYWdzW3Byb2R1Y3RCYWdOYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0c0JhZ3NbcHJvZHVjdEJhZ05hbWVdID0gW107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcHJvZHVjdHNCYWdzW3Byb2R1Y3RCYWdOYW1lXS5wdXNoKHByb2R1Y3QpO1xuXG4gICAgICAgICAgICAgICAgdHJ5TmF0aXZlU2RrKE5hdGl2ZVNka1BhdGhzLkFkZFRvUHJvZHVjdEJhZywgSlNPTi5zdHJpbmdpZnkocHJvZHVjdCkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbW92ZTogZnVuY3Rpb24ocHJvZHVjdEJhZ05hbWUsIHByb2R1Y3QpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvZHVjdEluZGV4ID0gLTE7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJvZHVjdHNCYWdzW3Byb2R1Y3RCYWdOYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0c0JhZ3NbcHJvZHVjdEJhZ05hbWVdLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnNrdSA9PT0gcHJvZHVjdC5za3UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2R1Y3RJbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0c0JhZ3NbcHJvZHVjdEJhZ05hbWVdLnNwbGljZShwcm9kdWN0SW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdHJ5TmF0aXZlU2RrKE5hdGl2ZVNka1BhdGhzLlJlbW92ZUZyb21Qcm9kdWN0QmFnLCBKU09OLnN0cmluZ2lmeShwcm9kdWN0KSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xlYXI6IGZ1bmN0aW9uKHByb2R1Y3RCYWdOYW1lKSB7XG4gICAgICAgICAgICAgICAgcHJvZHVjdHNCYWdzW3Byb2R1Y3RCYWdOYW1lXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgdHJ5TmF0aXZlU2RrKE5hdGl2ZVNka1BhdGhzLkNsZWFyUHJvZHVjdEJhZywgcHJvZHVjdEJhZ05hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBDYXJ0OiB7XG4gICAgICAgICAgICBhZGQ6IGZ1bmN0aW9uKHByb2R1Y3QsIGxvZ0V2ZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIGFycmF5Q29weSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgaWYoQXJyYXkuaXNBcnJheShwcm9kdWN0KSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgcHJvZHVjdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXlDb3B5LnB1c2gocHJvZHVjdFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFycmF5Q29weS5wdXNoKHByb2R1Y3QpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNhcnRQcm9kdWN0cyA9IGNhcnRQcm9kdWN0cy5jb25jYXQoYXJyYXlDb3B5KTtcblxuICAgICAgICAgICAgICAgIGlmICh1dGlsaXRpZXMuaXNXZWJWaWV3RW1iZWRkZWQobmF2aWdhdG9yKSkge1xuICAgICAgICAgICAgICAgICAgICB0cnlOYXRpdmVTZGsoTmF0aXZlU2RrUGF0aHMuQWRkVG9DYXJ0LCBKU09OLnN0cmluZ2lmeShhcnJheUNvcHkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobG9nRXZlbnQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nUHJvZHVjdEFjdGlvbkV2ZW50KFByb2R1Y3RBY3Rpb25UeXBlLkFkZFRvQ2FydCwgYXJyYXlDb3B5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbihwcm9kdWN0LCBsb2dFdmVudCkge1xuICAgICAgICAgICAgICAgIHZhciBjYXJ0SW5kZXggPSAtMSxcbiAgICAgICAgICAgICAgICAgICAgY2FydEl0ZW0gPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNhcnRQcm9kdWN0cykge1xuICAgICAgICAgICAgICAgICAgICBjYXJ0UHJvZHVjdHMuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uU2t1ID09PSBwcm9kdWN0LlNrdSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhcnRJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhcnRJdGVtID0gaXRlbTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhcnRJbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJ0UHJvZHVjdHMuc3BsaWNlKGNhcnRJbmRleCwgMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1dGlsaXRpZXMuaXNXZWJWaWV3RW1iZWRkZWQobmF2aWdhdG9yKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeU5hdGl2ZVNkayhOYXRpdmVTZGtQYXRocy5SZW1vdmVGcm9tQ2FydCwgSlNPTi5zdHJpbmdpZnkoY2FydEl0ZW0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGxvZ0V2ZW50ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nUHJvZHVjdEFjdGlvbkV2ZW50KFByb2R1Y3RBY3Rpb25UeXBlLlJlbW92ZUZyb21DYXJ0LCBjYXJ0SXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNhcnRQcm9kdWN0cyA9IFtdO1xuICAgICAgICAgICAgICAgIHRyeU5hdGl2ZVNkayhOYXRpdmVTZGtQYXRocy5DbGVhckNhcnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzZXRDdXJyZW5jeUNvZGU6IGZ1bmN0aW9uKGNvZGUpIHtcbiAgICAgICAgICAgIGN1cnJlbmN5Q29kZSA9IGNvZGU7XG4gICAgICAgIH0sXG4gICAgICAgIGNyZWF0ZVByb2R1Y3Q6IGZ1bmN0aW9uKG5hbWUsIHNrdSwgcHJpY2UsIHF1YW50aXR5LCB2YXJpYW50LCBjYXRlZ29yeSwgYnJhbmQsIHBvc2l0aW9uLCBjb3Vwb24sIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVQcm9kdWN0KG5hbWUsIHNrdSwgcHJpY2UsIHF1YW50aXR5LCB2YXJpYW50LCBjYXRlZ29yeSwgYnJhbmQsIHBvc2l0aW9uLCBjb3Vwb24sIGF0dHJpYnV0ZXMpO1xuICAgICAgICB9LFxuICAgICAgICBjcmVhdGVQcm9tb3Rpb246IGZ1bmN0aW9uKGlkLCBjcmVhdGl2ZSwgbmFtZSwgcG9zaXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVQcm9tb3Rpb24oaWQsIGNyZWF0aXZlLCBuYW1lLCBwb3NpdGlvbik7XG4gICAgICAgIH0sXG4gICAgICAgIGNyZWF0ZUltcHJlc3Npb246IGZ1bmN0aW9uKG5hbWUsIHByb2R1Y3QpIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVJbXByZXNzaW9uKG5hbWUsIHByb2R1Y3QpO1xuICAgICAgICB9LFxuICAgICAgICBjcmVhdGVUcmFuc2FjdGlvbkF0dHJpYnV0ZXM6IGZ1bmN0aW9uKGlkLCBhZmZpbGlhdGlvbiwgY291cG9uQ29kZSwgcmV2ZW51ZSwgc2hpcHBpbmcsIHRheCkge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVRyYW5zYWN0aW9uQXR0cmlidXRlcyhpZCwgYWZmaWxpYXRpb24sIGNvdXBvbkNvZGUsIHJldmVudWUsIHNoaXBwaW5nLCB0YXgpO1xuICAgICAgICB9LFxuICAgICAgICBsb2dDaGVja291dDogZnVuY3Rpb24oc3RlcCwgcGF5bWVudE1ldGhvZCwgYXR0cnMpIHtcbiAgICAgICAgICAgIGxvZ0NoZWNrb3V0RXZlbnQoc3RlcCwgcGF5bWVudE1ldGhvZCwgYXR0cnMpO1xuICAgICAgICB9LFxuICAgICAgICBsb2dQcm9kdWN0QWN0aW9uOiBmdW5jdGlvbihwcm9kdWN0QWN0aW9uVHlwZSwgcHJvZHVjdCwgYXR0cnMpIHtcbiAgICAgICAgICAgIGxvZ1Byb2R1Y3RBY3Rpb25FdmVudChwcm9kdWN0QWN0aW9uVHlwZSwgcHJvZHVjdCwgYXR0cnMpO1xuICAgICAgICB9LFxuICAgICAgICBsb2dQdXJjaGFzZTogZnVuY3Rpb24odHJhbnNhY3Rpb25BdHRyaWJ1dGVzLCBwcm9kdWN0LCBjbGVhckNhcnQsIGF0dHJzKSB7XG4gICAgICAgICAgICBsb2dQdXJjaGFzZUV2ZW50KHRyYW5zYWN0aW9uQXR0cmlidXRlcywgcHJvZHVjdCwgYXR0cnMpO1xuXG4gICAgICAgICAgICBpZiAoY2xlYXJDYXJ0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgbVBhcnRpY2xlLmVDb21tZXJjZS5DYXJ0LmNsZWFyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGxvZ1Byb21vdGlvbjogZnVuY3Rpb24odHlwZSwgcHJvbW90aW9uLCBhdHRycykge1xuICAgICAgICAgICAgbG9nUHJvbW90aW9uRXZlbnQodHlwZSwgcHJvbW90aW9uLCBhdHRycyk7XG4gICAgICAgIH0sXG4gICAgICAgIGxvZ0ltcHJlc3Npb246IGZ1bmN0aW9uKGltcHJlc3Npb24sIGF0dHJzKSB7XG4gICAgICAgICAgICBsb2dJbXByZXNzaW9uRXZlbnQoaW1wcmVzc2lvbiwgYXR0cnMpO1xuICAgICAgICB9LFxuICAgICAgICBsb2dSZWZ1bmQ6IGZ1bmN0aW9uKHRyYW5zYWN0aW9uQXR0cmlidXRlcywgcHJvZHVjdCwgY2xlYXJDYXJ0LCBhdHRycykge1xuICAgICAgICAgICAgbG9nUmVmdW5kRXZlbnQodHJhbnNhY3Rpb25BdHRyaWJ1dGVzLCBwcm9kdWN0LCBhdHRycyk7XG5cbiAgICAgICAgICAgIGlmIChjbGVhckNhcnQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBtUGFydGljbGUuZUNvbW1lcmNlLkNhcnQuY2xlYXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXhwYW5kQ29tbWVyY2VFdmVudDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBleHBhbmRDb21tZXJjZUV2ZW50KGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgbG9nRWNvbW1lcmNlVHJhbnNhY3Rpb246IGZ1bmN0aW9uKHByb2R1Y3ROYW1lLFxuICAgICAgICBwcm9kdWN0U0tVLFxuICAgICAgICBwcm9kdWN0VW5pdFByaWNlLFxuICAgICAgICBwcm9kdWN0UXVhbnRpdHksXG4gICAgICAgIHByb2R1Y3RDYXRlZ29yeSxcbiAgICAgICAgcmV2ZW51ZUFtb3VudCxcbiAgICAgICAgdGF4QW1vdW50LFxuICAgICAgICBzaGlwcGluZ0Ftb3VudCxcbiAgICAgICAgY3VycmVuY3lDb2RlLFxuICAgICAgICBhZmZpbGlhdGlvbixcbiAgICAgICAgdHJhbnNhY3Rpb25JZCkge1xuXG4gICAgICAgIHZhciBhdHRyaWJ1dGVzID0ge307XG4gICAgICAgIGF0dHJpYnV0ZXMuJE1ldGhvZE5hbWUgPSAnTG9nRWNvbW1lcmNlVHJhbnNhY3Rpb24nO1xuXG4gICAgICAgIGF0dHJpYnV0ZXMuUHJvZHVjdE5hbWUgPSBwcm9kdWN0TmFtZSA/IHByb2R1Y3ROYW1lIDogJyc7XG4gICAgICAgIGF0dHJpYnV0ZXMuUHJvZHVjdFNLVSA9IHByb2R1Y3RTS1UgPyBwcm9kdWN0U0tVIDogJyc7XG4gICAgICAgIGF0dHJpYnV0ZXMuUHJvZHVjdFVuaXRQcmljZSA9IHByb2R1Y3RVbml0UHJpY2UgPyBwcm9kdWN0VW5pdFByaWNlIDogMDtcbiAgICAgICAgYXR0cmlidXRlcy5Qcm9kdWN0UXVhbnRpdHkgPSBwcm9kdWN0UXVhbnRpdHkgPyBwcm9kdWN0UXVhbnRpdHkgOiAwO1xuICAgICAgICBhdHRyaWJ1dGVzLlByb2R1Y3RDYXRlZ29yeSA9IHByb2R1Y3RDYXRlZ29yeSA/IHByb2R1Y3RDYXRlZ29yeSA6ICcnO1xuICAgICAgICBhdHRyaWJ1dGVzLlJldmVudWVBbW91bnQgPSByZXZlbnVlQW1vdW50ID8gcmV2ZW51ZUFtb3VudCA6IDA7XG4gICAgICAgIGF0dHJpYnV0ZXMuVGF4QW1vdW50ID0gdGF4QW1vdW50ID8gdGF4QW1vdW50IDogMDtcbiAgICAgICAgYXR0cmlidXRlcy5TaGlwcGluZ0Ftb3VudCA9IHNoaXBwaW5nQW1vdW50ID8gc2hpcHBpbmdBbW91bnQgOiAwO1xuICAgICAgICBhdHRyaWJ1dGVzLkN1cnJlbmN5Q29kZSA9IGN1cnJlbmN5Q29kZSA/IGN1cnJlbmN5Q29kZSA6ICdVU0QnO1xuICAgICAgICBhdHRyaWJ1dGVzLlRyYW5zYWN0aW9uQWZmaWxpYXRpb24gPSBhZmZpbGlhdGlvbiA/IGFmZmlsaWF0aW9uIDogJyc7XG4gICAgICAgIGF0dHJpYnV0ZXMuVHJhbnNhY3Rpb25JRCA9IHRyYW5zYWN0aW9uSWQgPyB0cmFuc2FjdGlvbklkIDogZ2VuZXJhdGVVbmlxdWVJZCgpO1xuXG4gICAgICAgIGxvZ0V2ZW50KE1lc3NhZ2VUeXBlLlBhZ2VFdmVudCwgJ0Vjb21tZXJjZScsIGF0dHJpYnV0ZXMsIEV2ZW50VHlwZS5UcmFuc2FjdGlvbik7XG4gICAgfSxcbiAgICBsb2dMVFZJbmNyZWFzZTogZnVuY3Rpb24gKGFtb3VudCwgZXZlbnROYW1lLCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGlmKGFtb3VudCA9PSBudWxsIHx8IHR5cGVvZiBhbW91bnQgPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdXRpbGl0aWVzLmxvZ0RlYnVnKCdBIHZhbGlkIGFtb3VudCBtdXN0IGJlIHBhc3NlZCB0byBsb2dMVFZJbmNyZWFzZS4nKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYoIWF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgYXR0cmlidXRlc1tSRVNFUlZFRF9LRVlfTFRWXSA9IGFtb3VudDtcbiAgICAgICAgYXR0cmlidXRlc1tNRVRIT0RfTkFNRV0gPSBMT0dfTFRWO1xuICAgICAgICBcbiAgICAgICAgbG9nRXZlbnQoTWVzc2FnZVR5cGUuUGFnZUV2ZW50LCBcbiAgICAgICAgICAgICFldmVudE5hbWUgPyAnSW5jcmVhc2UgTFRWJyA6IGV2ZW50TmFtZSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMsXG4gICAgICAgICAgICBFdmVudFR5cGUuVHJhbnNhY3Rpb24pO1xuICAgIH0sXG4gICAgc2V0VXNlclRhZzogZnVuY3Rpb24odGFnTmFtZSkge1xuICAgICAgICB3aW5kb3cubVBhcnRpY2xlLnNldFVzZXJBdHRyaWJ1dGUodGFnTmFtZSwgbnVsbCk7XG4gICAgfSxcbiAgICByZW1vdmVVc2VyVGFnOiBmdW5jdGlvbih0YWdOYW1lKSB7XG4gICAgICAgIHZhciBleGlzdGluZ1Byb3AgPSBmaW5kS2V5SW5PYmplY3QodXNlckF0dHJpYnV0ZXMsIHRhZ05hbWUpO1xuXG4gICAgICAgIGlmKGV4aXN0aW5nUHJvcCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0YWdOYW1lID0gZXhpc3RpbmdQcm9wO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIHVzZXJBdHRyaWJ1dGVzW3RhZ05hbWVdO1xuICAgICAgICB0cnlOYXRpdmVTZGsoTmF0aXZlU2RrUGF0aHMuUmVtb3ZlVXNlclRhZywgSlNPTi5zdHJpbmdpZnkoeyBrZXk6IHRhZ05hbWUsIHZhbHVlOiBudWxsIH0pKTtcbiAgICAgICAgY29va2llLnNldENvb2tpZShcbiAgICAgICAgICAgICAgICBDb25maWcsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzaWQ6IHNlc3Npb25JZCwgaWU6IGlzRW5hYmxlZCwgc2E6IHNlc3Npb25BdHRyaWJ1dGVzLCBcbiAgICAgICAgICAgICAgICAgICAgdWE6IHVzZXJBdHRyaWJ1dGVzLCB1aTogdXNlcklkZW50aXRpZXMsIHNzOiBzZXJ2ZXJTZXR0aW5ncywgZHQ6IGRldlRva2VuLFxuICAgICAgICAgICAgICAgICAgICBsZXM6IGxhc3RFdmVudFNlbnQgPyBsYXN0RXZlbnRTZW50LmdldFRpbWUoKSA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGF2OiBhcHBWZXJzaW9uLFxuICAgICAgICAgICAgICAgICAgICBjZ2lkOiBjbGllbnRJZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgfSxcbiAgICBzZXRVc2VyQXR0cmlidXRlOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgIC8vIExvZ3MgdG8gY29va2llXG4gICAgICAgIC8vIEFuZCBsb2dzIHRvIGluLW1lbW9yeSBvYmplY3RcbiAgICAgICAgLy8gRXhhbXBsZTogbVBhcnRpY2xlLnNldFVzZXJBdHRyaWJ1dGUoJ2VtYWlsJywgJ3RicmVmZm5pQG1wYXJ0aWNsZS5jb20nKTtcbiAgICAgICAgaWYgKGNhbkxvZygpKSB7XG4gICAgICAgICAgICBpZighaXNWYWxpZEF0dHJpYnV0ZVZhbHVlKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHV0aWxpdGllcy5sb2dEZWJ1ZyhtZXNzYWdlcy5nZXRFcnJvck1lc3NhZ2VzKCdCYWRBdHRyaWJ1dGUnKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZXhpc3RpbmdQcm9wID0gZmluZEtleUluT2JqZWN0KHVzZXJBdHRyaWJ1dGVzLCBrZXkpO1xuXG4gICAgICAgICAgICBpZihleGlzdGluZ1Byb3AgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGtleSA9IGV4aXN0aW5nUHJvcDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXNlckF0dHJpYnV0ZXNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgY29va2llLnNldENvb2tpZShcbiAgICAgICAgICAgICAgICBDb25maWcsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzaWQ6IHNlc3Npb25JZCwgaWU6IGlzRW5hYmxlZCwgc2E6IHNlc3Npb25BdHRyaWJ1dGVzLCBcbiAgICAgICAgICAgICAgICAgICAgdWE6IHVzZXJBdHRyaWJ1dGVzLCB1aTogdXNlcklkZW50aXRpZXMsIHNzOiBzZXJ2ZXJTZXR0aW5ncywgZHQ6IGRldlRva2VuLFxuICAgICAgICAgICAgICAgICAgICBsZXM6IGxhc3RFdmVudFNlbnQgPyBsYXN0RXZlbnRTZW50LmdldFRpbWUoKSA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGF2OiBhcHBWZXJzaW9uLFxuICAgICAgICAgICAgICAgICAgICBjZ2lkOiBjbGllbnRJZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmICghdHJ5TmF0aXZlU2RrKE5hdGl2ZVNka1BhdGhzLlNldFVzZXJBdHRyaWJ1dGUsIEpTT04uc3RyaW5naWZ5KHsga2V5OiBrZXksIHZhbHVlOiB2YWx1ZSB9KSkpIHtcbiAgICAgICAgICAgICAgICBjYWxsU2V0VXNlckF0dHJpYnV0ZU9uRm9yd2FyZGVycyhrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlVXNlckF0dHJpYnV0ZTogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHZhciBleGlzdGluZ1Byb3AgPSBmaW5kS2V5SW5PYmplY3QodXNlckF0dHJpYnV0ZXMsIGtleSk7XG5cbiAgICAgICAgaWYoZXhpc3RpbmdQcm9wICE9IG51bGwpIHtcbiAgICAgICAgICAgIGtleSA9IGV4aXN0aW5nUHJvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZSB1c2VyQXR0cmlidXRlc1trZXldO1xuXG4gICAgICAgIGlmICghdHJ5TmF0aXZlU2RrKE5hdGl2ZVNka1BhdGhzLlJlbW92ZVVzZXJBdHRyaWJ1dGUsIEpTT04uc3RyaW5naWZ5KHsga2V5OiBrZXksIHZhbHVlOiBudWxsIH0pKSkge1xuICAgICAgICAgICAgYXBwbHlUb0ZvcndhcmRlcnMoJ3JlbW92ZVVzZXJBdHRyaWJ1dGUnLCBrZXksIG51bGwpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29va2llLnNldENvb2tpZShcbiAgICAgICAgICAgICAgICBDb25maWcsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzaWQ6IHNlc3Npb25JZCwgaWU6IGlzRW5hYmxlZCwgc2E6IHNlc3Npb25BdHRyaWJ1dGVzLCBcbiAgICAgICAgICAgICAgICAgICAgdWE6IHVzZXJBdHRyaWJ1dGVzLCB1aTogdXNlcklkZW50aXRpZXMsIHNzOiBzZXJ2ZXJTZXR0aW5ncywgZHQ6IGRldlRva2VuLFxuICAgICAgICAgICAgICAgICAgICBsZXM6IGxhc3RFdmVudFNlbnQgPyBsYXN0RXZlbnRTZW50LmdldFRpbWUoKSA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGF2OiBhcHBWZXJzaW9uLFxuICAgICAgICAgICAgICAgICAgICBjZ2lkOiBjbGllbnRJZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgfSxcbiAgICBzZXRVc2VyQXR0cmlidXRlTGlzdDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICB2YXIgYXJyYXlDb3B5ID0gW107XG5cbiAgICAgICAgaWYoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGFycmF5Q29weS5wdXNoKHZhbHVlW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGV4aXN0aW5nUHJvcCA9IGZpbmRLZXlJbk9iamVjdCh1c2VyQXR0cmlidXRlcywga2V5KTtcblxuICAgICAgICAgICAgaWYoZXhpc3RpbmdQcm9wICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBrZXkgPSBleGlzdGluZ1Byb3A7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHVzZXJBdHRyaWJ1dGVzW2tleV0gPSBhcnJheUNvcHk7XG4gICAgICAgICAgICBjb29raWUuc2V0Q29va2llKFxuICAgICAgICAgICAgICAgIENvbmZpZyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHNpZDogc2Vzc2lvbklkLCBpZTogaXNFbmFibGVkLCBzYTogc2Vzc2lvbkF0dHJpYnV0ZXMsIFxuICAgICAgICAgICAgICAgICAgICB1YTogdXNlckF0dHJpYnV0ZXMsIHVpOiB1c2VySWRlbnRpdGllcywgc3M6IHNlcnZlclNldHRpbmdzLCBkdDogZGV2VG9rZW4sXG4gICAgICAgICAgICAgICAgICAgIGxlczogbGFzdEV2ZW50U2VudCA/IGxhc3RFdmVudFNlbnQuZ2V0VGltZSgpIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgYXY6IGFwcFZlcnNpb24sXG4gICAgICAgICAgICAgICAgICAgIGNnaWQ6IGNsaWVudElkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYoIXRyeU5hdGl2ZVNkayhOYXRpdmVTZGtQYXRocy5TZXRVc2VyQXR0cmlidXRlTGlzdCwgSlNPTi5zdHJpbmdpZnkoe2tleToga2V5LCB2YWx1ZTogYXJyYXlDb3B5fSkpKSB7XG4gICAgICAgICAgICAgICAgY2FsbFNldFVzZXJBdHRyaWJ1dGVPbkZvcndhcmRlcnMoa2V5LCBhcnJheUNvcHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICByZW1vdmVBbGxVc2VyQXR0cmlidXRlczogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZighdHJ5TmF0aXZlU2RrKE5hdGl2ZVNka1BhdGhzLlJlbW92ZUFsbFVzZXJBdHRyaWJ1dGVzKSkge1xuICAgICAgICAgICAgaWYodXNlckF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgICBmb3IodmFyIHByb3AgaW4gdXNlckF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYodXNlckF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGx5VG9Gb3J3YXJkZXJzKCdyZW1vdmVVc2VyQXR0cmlidXRlJywgdXNlckF0dHJpYnV0ZXNbcHJvcF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdXNlckF0dHJpYnV0ZXMgPSB7fTtcbiAgICAgICAgY29va2llLnNldENvb2tpZShcbiAgICAgICAgICAgICAgICBDb25maWcsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzaWQ6IHNlc3Npb25JZCwgaWU6IGlzRW5hYmxlZCwgc2E6IHNlc3Npb25BdHRyaWJ1dGVzLCBcbiAgICAgICAgICAgICAgICAgICAgdWE6IHVzZXJBdHRyaWJ1dGVzLCB1aTogdXNlcklkZW50aXRpZXMsIHNzOiBzZXJ2ZXJTZXR0aW5ncywgZHQ6IGRldlRva2VuLFxuICAgICAgICAgICAgICAgICAgICBsZXM6IGxhc3RFdmVudFNlbnQgPyBsYXN0RXZlbnRTZW50LmdldFRpbWUoKSA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGF2OiBhcHBWZXJzaW9uLFxuICAgICAgICAgICAgICAgICAgICBjZ2lkOiBjbGllbnRJZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgfSxcbiAgICBnZXRVc2VyQXR0cmlidXRlc0xpc3RzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB1c2VyQXR0cmlidXRlTGlzdHMgPSB7fSxcbiAgICAgICAgICAgIGFycmF5Q29weTtcblxuICAgICAgICBmb3IodmFyIGtleSBpbiB1c2VyQXR0cmlidXRlcykge1xuICAgICAgICAgICAgaWYodXNlckF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBBcnJheS5pc0FycmF5KHVzZXJBdHRyaWJ1dGVzW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgYXJyYXlDb3B5ID0gW107XG5cbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdXNlckF0dHJpYnV0ZXNba2V5XS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBhcnJheUNvcHkucHVzaCh1c2VyQXR0cmlidXRlc1trZXldW2ldKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB1c2VyQXR0cmlidXRlTGlzdHNba2V5XSA9IGFycmF5Q29weTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1c2VyQXR0cmlidXRlTGlzdHM7XG4gICAgfSxcbiAgICBnZXRBbGxVc2VyQXR0cmlidXRlczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB1c2VyQXR0cmlidXRlc0NvcHkgPSB7fSxcbiAgICAgICAgICAgIGFycmF5Q29weTtcblxuICAgICAgICBpZih1c2VyQXR0cmlidXRlcykge1xuICAgICAgICAgICAgZm9yKHZhciBwcm9wIGluIHVzZXJBdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgICAgaWYodXNlckF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoQXJyYXkuaXNBcnJheSh1c2VyQXR0cmlidXRlc1twcm9wXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5Q29weSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdXNlckF0dHJpYnV0ZXNbcHJvcF0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJheUNvcHkucHVzaCh1c2VyQXR0cmlidXRlc1twcm9wXVtpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJBdHRyaWJ1dGVzQ29weVtwcm9wXSA9IGFycmF5Q29weTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJBdHRyaWJ1dGVzQ29weVtwcm9wXSA9IHVzZXJBdHRyaWJ1dGVzW3Byb3BdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVzZXJBdHRyaWJ1dGVzQ29weTtcbiAgICB9LFxuICAgIHNldFNlc3Npb25BdHRyaWJ1dGU6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgLy8gTG9ncyB0byBjb29raWVcbiAgICAgICAgLy8gQW5kIGxvZ3MgdG8gaW4tbWVtb3J5IG9iamVjdFxuICAgICAgICAvLyBFeGFtcGxlOiBtUGFydGljbGUuc2V0U2Vzc2lvbkF0dHJpYnV0ZSgnbG9jYXRpb24nLCAnMzM0MzEnKTtcbiAgICAgICAgaWYgKGNhbkxvZygpKSB7XG4gICAgICAgICAgICBpZighaXNWYWxpZEF0dHJpYnV0ZVZhbHVlKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHV0aWxpdGllcy5sb2dEZWJ1ZyhtZXNzYWdlcy5nZXRFcnJvck1lc3NhZ2VzKCdCYWRBdHRyaWJ1dGUnKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZXhpc3RpbmdQcm9wID0gZmluZEtleUluT2JqZWN0KHNlc3Npb25BdHRyaWJ1dGVzLCBrZXkpO1xuXG4gICAgICAgICAgICBpZihleGlzdGluZ1Byb3AgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGtleSA9IGV4aXN0aW5nUHJvcDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2Vzc2lvbkF0dHJpYnV0ZXNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgY29va2llLnNldENvb2tpZShcbiAgICAgICAgICAgICAgICBDb25maWcsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzaWQ6IHNlc3Npb25JZCwgaWU6IGlzRW5hYmxlZCwgc2E6IHNlc3Npb25BdHRyaWJ1dGVzLCBcbiAgICAgICAgICAgICAgICAgICAgdWE6IHVzZXJBdHRyaWJ1dGVzLCB1aTogdXNlcklkZW50aXRpZXMsIHNzOiBzZXJ2ZXJTZXR0aW5ncywgZHQ6IGRldlRva2VuLFxuICAgICAgICAgICAgICAgICAgICBsZXM6IGxhc3RFdmVudFNlbnQgPyBsYXN0RXZlbnRTZW50LmdldFRpbWUoKSA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGF2OiBhcHBWZXJzaW9uLFxuICAgICAgICAgICAgICAgICAgICBjZ2lkOiBjbGllbnRJZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoIXRyeU5hdGl2ZVNkayhOYXRpdmVTZGtQYXRocy5TZXRTZXNzaW9uQXR0cmlidXRlLCBKU09OLnN0cmluZ2lmeSh7IGtleToga2V5LCB2YWx1ZTogdmFsdWUgfSkpKSB7XG4gICAgICAgICAgICAgICAgYXBwbHlUb0ZvcndhcmRlcnMoJ3NldFNlc3Npb25BdHRyaWJ1dGUnLCBba2V5LCB2YWx1ZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRPcHRPdXQ6IGZ1bmN0aW9uKGlzT3B0aW5nT3V0KSB7XG4gICAgICAgIGlzRW5hYmxlZCA9ICFpc09wdGluZ091dDtcblxuICAgICAgICBsb2dPcHRPdXQoKTtcbiAgICAgICAgY29va2llLnNldENvb2tpZShcbiAgICAgICAgICAgIENvbmZpZyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzaWQ6IHNlc3Npb25JZCwgaWU6IGlzRW5hYmxlZCwgc2E6IHNlc3Npb25BdHRyaWJ1dGVzLCBcbiAgICAgICAgICAgICAgICB1YTogdXNlckF0dHJpYnV0ZXMsIHVpOiB1c2VySWRlbnRpdGllcywgc3M6IHNlcnZlclNldHRpbmdzLCBkdDogZGV2VG9rZW4sXG4gICAgICAgICAgICAgICAgbGVzOiBsYXN0RXZlbnRTZW50ID8gbGFzdEV2ZW50U2VudC5nZXRUaW1lKCkgOiBudWxsLFxuICAgICAgICAgICAgICAgIGF2OiBhcHBWZXJzaW9uLFxuICAgICAgICAgICAgICAgIGNnaWQ6IGNsaWVudElkXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKGZvcndhcmRlcnMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZm9yd2FyZGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChmb3J3YXJkZXJzW2ldLnNldE9wdE91dCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZm9yd2FyZGVyc1tpXS5zZXRPcHRPdXQoaXNPcHRpbmdPdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHV0aWxpdGllcy5sb2dEZWJ1ZyhyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBsb2dPdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZXZ0O1xuXG4gICAgICAgIGlmIChjYW5Mb2coKSkge1xuICAgICAgICAgICAgaWYgKCF0cnlOYXRpdmVTZGsoTmF0aXZlU2RrUGF0aHMuTG9nT3V0KSkge1xuICAgICAgICAgICAgICAgIGV2dCA9IGxvZ0xvZ091dEV2ZW50KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZm9yd2FyZGVycykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZvcndhcmRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3J3YXJkZXJzW2ldLmxvZ091dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcndhcmRlcnNbaV0ubG9nT3V0KGV2dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGFkZEZvcndhcmRlcjogZnVuY3Rpb24oZm9yd2FyZGVyUHJvY2Vzc29yKSB7XG4gICAgICAgIGZvcndhcmRlckNvbnN0cnVjdG9ycy5wdXNoKGZvcndhcmRlclByb2Nlc3Nvcik7XG4gICAgfSxcbiAgICBjb25maWd1cmVGb3J3YXJkZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbmV3Rm9yd2FyZGVyID0gbnVsbCxcbiAgICAgICAgICAgIGNvbmZpZyA9IG51bGw7XG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGNvbmZpZyA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8qICBBZGRlZCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgICAgICAgICAgICAgICBPbGQgc2lnbmF0dXJlIGZvciByZWZlcmVuY2U6XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbmZpZ3VyZUZvcndhcmRlcjogZnVuY3Rpb24gKG5hbWUsXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MsXG4gICAgICAgICAgICAgICAgZXZlbnROYW1lRmlsdGVycyxcbiAgICAgICAgICAgICAgICBldmVudFR5cGVGaWx0ZXJzLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZUZpbHRlcnMsXG4gICAgICAgICAgICAgICAgcGFnZVZpZXdGaWx0ZXJzLFxuICAgICAgICAgICAgICAgIHBhZ2VWaWV3QXR0cmlidXRlRmlsdGVycyxcbiAgICAgICAgICAgICAgICB1c2VySWRlbnRpdHlGaWx0ZXJzLFxuICAgICAgICAgICAgICAgIHVzZXJBdHRyaWJ1dGVGaWx0ZXJzLFxuICAgICAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgICAgIGlzU2FuZGJveCxcbiAgICAgICAgICAgICAgICBoYXNTYW5kYm94LFxuICAgICAgICAgICAgICAgIGlzVmlzaWJsZSlcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25maWcgPSB7XG4gICAgICAgICAgICAgICAgbmFtZTogYXJndW1lbnRzWzBdLFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBhcmd1bWVudHNbMV0sXG4gICAgICAgICAgICAgICAgZXZlbnROYW1lRmlsdGVyczogYXJndW1lbnRzWzJdLFxuICAgICAgICAgICAgICAgIGV2ZW50VHlwZUZpbHRlcnM6IGFyZ3VtZW50c1szXSxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVGaWx0ZXJzOiBhcmd1bWVudHNbNF0sXG4gICAgICAgICAgICAgICAgcGFnZVZpZXdGaWx0ZXJzOiBhcmd1bWVudHNbNV0sXG4gICAgICAgICAgICAgICAgcGFnZVZpZXdBdHRyaWJ1dGVGaWx0ZXJzOiBhcmd1bWVudHNbNl0sXG4gICAgICAgICAgICAgICAgdXNlcklkZW50aXR5RmlsdGVyczogYXJndW1lbnRzWzddLFxuICAgICAgICAgICAgICAgIHVzZXJBdHRyaWJ1dGVGaWx0ZXJzOiBhcmd1bWVudHNbOF0sXG4gICAgICAgICAgICAgICAgbW9kdWxlSWQ6IGFyZ3VtZW50c1s5XSxcbiAgICAgICAgICAgICAgICBpc1NhbmRib3g6IGFyZ3VtZW50c1sxMF0sXG4gICAgICAgICAgICAgICAgaGFzU2FuZGJveDogYXJndW1lbnRzWzExXSxcbiAgICAgICAgICAgICAgICBpc1Zpc2libGU6IGFyZ3VtZW50c1sxMl0sXG4gICAgICAgICAgICAgICAgZmlsdGVyaW5nRXZlbnRBdHRyaWJ1dGVWYWx1ZTogbnVsbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZm9yd2FyZGVyQ29uc3RydWN0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZm9yd2FyZGVyQ29uc3RydWN0b3JzW2ldLm5hbWUgPT0gY29uZmlnLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBuZXdGb3J3YXJkZXIgPSBuZXcgZm9yd2FyZGVyQ29uc3RydWN0b3JzW2ldLmNvbnN0cnVjdG9yKCk7XG5cbiAgICAgICAgICAgICAgICBuZXdGb3J3YXJkZXIuaWQgPSBjb25maWcubW9kdWxlSWQ7XG4gICAgICAgICAgICAgICAgbmV3Rm9yd2FyZGVyLmlzU2FuZGJveCA9IGNvbmZpZy5pc0RlYnVnO1xuICAgICAgICAgICAgICAgIG5ld0ZvcndhcmRlci5oYXNTYW5kYm94ID0gY29uZmlnLmhhc0RlYnVnU3RyaW5nID09PSAndHJ1ZScgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgbmV3Rm9yd2FyZGVyLmlzVmlzaWJsZSA9IGNvbmZpZy5pc1Zpc2libGU7XG4gICAgICAgICAgICAgICAgbmV3Rm9yd2FyZGVyLnNldHRpbmdzID0gY29uZmlnLnNldHRpbmdzO1xuXG4gICAgICAgICAgICAgICAgbmV3Rm9yd2FyZGVyLmV2ZW50TmFtZUZpbHRlcnMgPSBjb25maWcuZXZlbnROYW1lRmlsdGVycztcbiAgICAgICAgICAgICAgICBuZXdGb3J3YXJkZXIuZXZlbnRUeXBlRmlsdGVycyA9IGNvbmZpZy5ldmVudFR5cGVGaWx0ZXJzO1xuICAgICAgICAgICAgICAgIG5ld0ZvcndhcmRlci5hdHRyaWJ1dGVGaWx0ZXJzID0gY29uZmlnLmF0dHJpYnV0ZUZpbHRlcnM7XG5cbiAgICAgICAgICAgICAgICBuZXdGb3J3YXJkZXIucGFnZVZpZXdGaWx0ZXJzID0gY29uZmlnLnBhZ2VWaWV3RmlsdGVycztcbiAgICAgICAgICAgICAgICBuZXdGb3J3YXJkZXIucGFnZVZpZXdBdHRyaWJ1dGVGaWx0ZXJzID0gY29uZmlnLnBhZ2VWaWV3QXR0cmlidXRlRmlsdGVycztcblxuICAgICAgICAgICAgICAgIG5ld0ZvcndhcmRlci51c2VySWRlbnRpdHlGaWx0ZXJzID0gY29uZmlnLnVzZXJJZGVudGl0eUZpbHRlcnM7XG4gICAgICAgICAgICAgICAgbmV3Rm9yd2FyZGVyLnVzZXJBdHRyaWJ1dGVGaWx0ZXJzID0gY29uZmlnLnVzZXJBdHRyaWJ1dGVGaWx0ZXJzO1xuXG4gICAgICAgICAgICAgICAgbmV3Rm9yd2FyZGVyLmZpbHRlcmluZ0V2ZW50QXR0cmlidXRlVmFsdWUgPSBjb25maWcuZmlsdGVyaW5nRXZlbnRBdHRyaWJ1dGVWYWx1ZTtcblxuICAgICAgICAgICAgICAgIGZvcndhcmRlcnMucHVzaChuZXdGb3J3YXJkZXIpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vLyBSZWFkIGV4aXN0aW5nIGNvbmZpZ3VyYXRpb24gaWYgcHJlc2VudFxuaWYgKHdpbmRvdy5tUGFydGljbGUgJiYgd2luZG93Lm1QYXJ0aWNsZS5jb25maWcpIHtcbiAgICBpZiAod2luZG93Lm1QYXJ0aWNsZS5jb25maWcuc2VydmljZVVybCkge1xuICAgICAgICBzZXJ2aWNlVXJsID0gd2luZG93Lm1QYXJ0aWNsZS5jb25maWcuc2VydmljZVVybDtcbiAgICB9XG5cbiAgICBpZiAod2luZG93Lm1QYXJ0aWNsZS5jb25maWcuc2VjdXJlU2VydmljZVVybCkge1xuICAgICAgICBzZWN1cmVTZXJ2aWNlVXJsID0gd2luZG93Lm1QYXJ0aWNsZS5jb25maWcuc2VjdXJlU2VydmljZVVybDtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBmb3IgYW55IGZ1bmN0aW9ucyBxdWV1ZWRcbiAgICBpZiAod2luZG93Lm1QYXJ0aWNsZS5jb25maWcucnEpIHtcbiAgICAgICAgcmVhZHlRdWV1ZSA9IHdpbmRvdy5tUGFydGljbGUuY29uZmlnLnJxO1xuICAgIH1cblxuICAgIGlmICh3aW5kb3cubVBhcnRpY2xlLmNvbmZpZy5oYXNPd25Qcm9wZXJ0eSgnaXNEZWJ1ZycpKSB7XG4gICAgICAgIG1QYXJ0aWNsZS5pc0RlYnVnID0gd2luZG93Lm1QYXJ0aWNsZS5jb25maWcuaXNEZWJ1ZztcbiAgICB9XG5cbiAgICBpZiAod2luZG93Lm1QYXJ0aWNsZS5jb25maWcuaGFzT3duUHJvcGVydHkoJ2lzU2FuZGJveCcpKSB7XG4gICAgICAgIG1QYXJ0aWNsZS5pc1NhbmRib3ggPSB3aW5kb3cubVBhcnRpY2xlLmNvbmZpZy5pc1NhbmRib3g7XG4gICAgfVxuXG4gICAgaWYgKHdpbmRvdy5tUGFydGljbGUuY29uZmlnLmhhc093blByb3BlcnR5KCdhcHBOYW1lJykpIHtcbiAgICAgICAgYXBwTmFtZSA9IHdpbmRvdy5tUGFydGljbGUuY29uZmlnLmFwcE5hbWU7XG4gICAgfVxuXG4gICAgaWYgKHdpbmRvdy5tUGFydGljbGUuY29uZmlnLmhhc093blByb3BlcnR5KCdhcHBWZXJzaW9uJykpIHtcbiAgICAgICAgYXBwVmVyc2lvbiA9IHdpbmRvdy5tUGFydGljbGUuY29uZmlnLmFwcFZlcnNpb247XG4gICAgfVxuXG4gICAgLy8gU29tZSBmb3J3YXJkZXJzIHJlcXVpcmUgY3VzdG9tIGZsYWdzIG9uIGluaXRpYWxpemF0aW9uLCBzbyBhbGxvdyB0aGVtIHRvIGJlIHNldCB1c2luZyBjb25maWcgb2JqZWN0XG4gICAgaWYgKHdpbmRvdy5tUGFydGljbGUuY29uZmlnLmhhc093blByb3BlcnR5KCdjdXN0b21GbGFncycpKSB7XG4gICAgICAgIGN1c3RvbUZsYWdzID0gd2luZG93Lm1QYXJ0aWNsZS5jb25maWcuY3VzdG9tRmxhZ3M7XG4gICAgfVxufVxuXG53aW5kb3cubVBhcnRpY2xlID0gbVBhcnRpY2xlO1xuXG4iXSwibmFtZXMiOlsiVXRpbGl0aWVzIiwicGx1c2VzIiwiY2IiLCJsb2dEZWJ1ZyIsInhociIsIndpbmRvdyIsIlhNTEh0dHBSZXF1ZXN0IiwiZSIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsIlhEb21haW5SZXF1ZXN0Iiwib25sb2FkIiwic2VydmljZVNjaGVtZSIsInNlY3VyZVNlcnZpY2VVcmwiLCJzZXJ2aWNlVXJsIiwiZGV2VG9rZW4iLCJsb2NhdGlvbiIsInByb3RvY29sIiwiaXRlbXMiLCJuYW1lIiwicmVzdWx0IiwiZmluZEluZGV4IiwicyIsImluZGV4T2YiLCJzbGljZSIsInJlcGxhY2UiLCJkZWNvZGVVUklDb21wb25lbnQiLCJtc2ciLCJtUGFydGljbGUiLCJpc0RlYnVnIiwiY29uc29sZSIsImxvZyIsIm5hdmlnYXRvciIsInRlc3QiLCJ1c2VyQWdlbnQiLCJleHRlcm5hbCIsIk5vdGlmeSIsIm1QYXJ0aWNsZUFuZHJvaWQiLCJpc1VJV2ViVmlldyIsImlzSU9TIiwidXRpbGl0aWVzIiwiTWVzc2FnZXMiLCJFcnJvck1lc3NhZ2VzIiwiSW5mb3JtYXRpb25NZXNzYWdlcyIsImtleSIsIm1lc3NhZ2VzIiwiQ29va2llIiwiY29uZmlnIiwidmFsdWUiLCJjb29raWVzIiwiZG9jdW1lbnQiLCJjb29raWUiLCJzcGxpdCIsIkNvb2tpZU5hbWUiLCJ1bmRlZmluZWQiLCJnZXRJbmZvcm1hdGlvbk1lc3NhZ2VzIiwiaSIsImxlbmd0aCIsInBhcnRzIiwiZGVjb2RlZCIsInNoaWZ0Iiwiam9pbiIsImNvbnZlcnRlZCIsIm9iaiIsIkpTT04iLCJwYXJzZSIsInNpZCIsIlNlc3Npb25JZCIsInNlc3Npb25JZCIsImllIiwiSXNFbmFibGVkIiwic2EiLCJTZXNzaW9uQXR0cmlidXRlcyIsInNlc3Npb25BdHRyaWJ1dGVzIiwidWEiLCJVc2VyQXR0cmlidXRlcyIsInVzZXJBdHRyaWJ1dGVzIiwidWkiLCJVc2VySWRlbnRpdGllcyIsInVzZXJJZGVudGl0aWVzIiwic3MiLCJTZXJ2ZXJTZXR0aW5ncyIsInNlcnZlclNldHRpbmdzIiwiZHQiLCJEZXZlbG9wZXJUb2tlbiIsImNnaWQiLCJnZW5lcmF0ZVVuaXF1ZUlkIiwiaXNFbmFibGVkIiwibGVzIiwiRGF0ZSIsIkxhc3RFdmVudFNlbnQiLCJnZXRFcnJvck1lc3NhZ2VzIiwiZGF0ZSIsImV4cGlyZXMiLCJnZXRUaW1lIiwiQ29va2llRXhwaXJhdGlvbiIsInRvR01UU3RyaW5nIiwiZG9tYWluIiwiQ29va2llRG9tYWluIiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwic3RyaW5naWZ5Iiwic2RrVmVyc2lvbiIsImZvcndhcmRlckNvbnN0cnVjdG9ycyIsImZvcndhcmRlcnMiLCJjbGllbnRJZCIsImxhc3RFdmVudFNlbnQiLCJjdXJyZW50UG9zaXRpb24iLCJpc1RyYWNraW5nIiwid2F0Y2hQb3NpdGlvbklkIiwicmVhZHlRdWV1ZSIsImlzSW5pdGlhbGl6ZWQiLCJwcm9kdWN0c0JhZ3MiLCJjYXJ0UHJvZHVjdHMiLCJjdXJyZW5jeUNvZGUiLCJhcHBWZXJzaW9uIiwiYXBwTmFtZSIsImN1c3RvbUZsYWdzIiwiTUVUSE9EX05BTUUiLCJMT0dfTFRWIiwiUkVTRVJWRURfS0VZX0xUViIsIkFycmF5IiwicHJvdG90eXBlIiwiZm9yRWFjaCIsImNhbGxiYWNrIiwidGhpc0FyZyIsIlQiLCJrIiwiVHlwZUVycm9yIiwiTyIsIk9iamVjdCIsImxlbiIsImFyZ3VtZW50cyIsImtWYWx1ZSIsImNhbGwiLCJtYXAiLCJBIiwibWFwcGVkVmFsdWUiLCJpc0FycmF5IiwiYXJnIiwidG9TdHJpbmciLCJleHRlbmQiLCJvcHRpb25zIiwic3JjIiwiY29weSIsImNvcHlJc0FycmF5IiwiY2xvbmUiLCJ0YXJnZXQiLCJkZWVwIiwiaGFzT3duUHJvcGVydHkiLCJTdHJpbmciLCJvYmplY3RIZWxwZXIiLCJjbGFzczJ0eXBlIiwidHlwZSIsIm5vZGVUeXBlIiwiaXNXaW5kb3ciLCJjb25zdHJ1Y3RvciIsImhhc093biIsImlzRnVuY3Rpb24iLCJpc1BsYWluT2JqZWN0IiwidHJ5TmF0aXZlU2RrIiwicGF0aCIsImlmcmFtZSIsImNyZWF0ZUVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJkb2N1bWVudEVsZW1lbnQiLCJhcHBlbmRDaGlsZCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsInNlbmQiLCJldmVudCIsInhockNhbGxiYWNrIiwicmVhZHlTdGF0ZSIsInN0YXR1c1RleHQiLCJyZXNwb25zZVRleHQiLCJOYXRpdmVTZGtQYXRocyIsIkxvZ0V2ZW50IiwiY3JlYXRlWEhSIiwib3BlbiIsImNyZWF0ZVNlcnZpY2VVcmwiLCJjb252ZXJ0RXZlbnRUb0RUTyIsInNlbmRGb3J3YXJkaW5nU3RhdHMiLCJmb3J3YXJkZXIiLCJmb3J3YXJkaW5nU3RhdCIsImlzVmlzaWJsZSIsImlkIiwiRXZlbnROYW1lIiwiRXZlbnRBdHRyaWJ1dGVzIiwiU0RLVmVyc2lvbiIsIkV2ZW50RGF0YVR5cGUiLCJFdmVudENhdGVnb3J5IiwiRGVidWciLCJUaW1lc3RhbXAiLCJFeHBhbmRlZEV2ZW50Q291bnQiLCJhcHBseVRvRm9yd2FyZGVycyIsImZ1bmN0aW9uTmFtZSIsImZ1bmN0aW9uQXJncyIsImZvcndhcmRlckZ1bmN0aW9uIiwic2VuZEV2ZW50VG9Gb3J3YXJkZXJzIiwiY2xvbmVkRXZlbnQiLCJoYXNoZWROYW1lIiwiaGFzaGVkVHlwZSIsImZpbHRlclVzZXJBdHRyaWJ1dGVzIiwiZmlsdGVyTGlzdCIsImhhc2giLCJhdHRyTmFtZSIsImdlbmVyYXRlSGFzaCIsImluQXJyYXkiLCJmaWx0ZXJVc2VySWRlbnRpdGllcyIsIlR5cGUiLCJzcGxpY2UiLCJmaWx0ZXJBdHRyaWJ1dGVzIiwiaW5GaWx0ZXJlZExpc3QiLCJmb3J3YXJkaW5nUnVsZU1lc3NhZ2VUeXBlcyIsIk1lc3NhZ2VUeXBlIiwiUGFnZUV2ZW50IiwiUGFnZVZpZXciLCJDb21tZXJjZSIsImlzV2ViVmlld0VtYmVkZGVkIiwiaXNTYW5kYm94IiwiaGFzU2FuZGJveCIsImZpbHRlcmluZ0V2ZW50QXR0cmlidXRlVmFsdWUiLCJldmVudEF0dHJpYnV0ZU5hbWUiLCJldmVudEF0dHJpYnV0ZVZhbHVlIiwiZm91bmRQcm9wIiwicHJvcCIsImlzTWF0Y2giLCJzaG91bGRJbmNsdWRlIiwiaW5jbHVkZU9uTWF0Y2giLCJldmVudE5hbWVGaWx0ZXJzIiwiZXZlbnRUeXBlRmlsdGVycyIsInBhZ2VWaWV3RmlsdGVycyIsImF0dHJpYnV0ZUZpbHRlcnMiLCJwYWdlVmlld0F0dHJpYnV0ZUZpbHRlcnMiLCJ1c2VySWRlbnRpdHlGaWx0ZXJzIiwidXNlckF0dHJpYnV0ZUZpbHRlcnMiLCJwcm9jZXNzIiwiaW5pdEZvcndhcmRlcnMiLCJzb3J0IiwieCIsInkiLCJzZXR0aW5ncyIsIlByaW9yaXR5VmFsdWUiLCJpbml0IiwicGFyc2VSZXNwb25zZSIsIm5vdyIsImZ1bGxQcm9wIiwiU3RvcmUiLCJWYWx1ZSIsIkV4cGlyZXMiLCJzZXRDb29raWUiLCJDb25maWciLCJzdGFydFRyYWNraW5nIiwiZ2VvbG9jYXRpb24iLCJ3YXRjaFBvc2l0aW9uIiwicG9zaXRpb24iLCJjb29yZHMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsInN0b3BUcmFja2luZyIsImNsZWFyV2F0Y2giLCJjb252ZXJ0Q3VzdG9tRmxhZ3MiLCJkdG8iLCJ2YWx1ZUFycmF5IiwiZmxhZ3MiLCJDdXN0b21GbGFncyIsInB1c2giLCJMb2NhdGlvbiIsIk9wdE91dCIsIkFwcFZlcnNpb24iLCJDbGllbnRHZW5lcmF0ZWRJZCIsInBiIiwiY29udmVydFByb2R1Y3RCYWdUb0RUTyIsImN1IiwiU2hvcHBpbmdDYXJ0Iiwic2MiLCJjb252ZXJ0UHJvZHVjdExpc3RUb0RUTyIsIlByb2R1Y3RMaXN0IiwiUHJvZHVjdEFjdGlvbiIsInBkIiwiUHJvZHVjdEFjdGlvblR5cGUiLCJDaGVja291dFN0ZXAiLCJDaGVja291dE9wdGlvbnMiLCJUcmFuc2FjdGlvbklkIiwiQWZmaWxpYXRpb24iLCJDb3Vwb25Db2RlIiwiVG90YWxBbW91bnQiLCJTaGlwcGluZ0Ftb3VudCIsIlRheEFtb3VudCIsIlByb21vdGlvbkFjdGlvbiIsInBtIiwiUHJvbW90aW9uQWN0aW9uVHlwZSIsIlByb21vdGlvbkxpc3QiLCJwcm9tb3Rpb24iLCJJZCIsIk5hbWUiLCJDcmVhdGl2ZSIsIlBvc2l0aW9uIiwiUHJvZHVjdEltcHJlc3Npb25zIiwicGkiLCJpbXByZXNzaW9uIiwiUHJvZHVjdEltcHJlc3Npb25MaXN0IiwiUHJvZmlsZSIsInBldCIsIlByb2ZpbGVNZXNzYWdlVHlwZSIsInByb2R1Y3RMaXN0IiwicHJvZHVjdCIsImNvbnZlcnRQcm9kdWN0VG9EVE8iLCJTa3UiLCJQcmljZSIsIlF1YW50aXR5IiwiQnJhbmQiLCJWYXJpYW50IiwiQ2F0ZWdvcnkiLCJBdHRyaWJ1dGVzIiwiY29udmVydGVkQmFnIiwibGlzdCIsIml0ZW0iLCJjb252ZXJ0VHJhbnNhY3Rpb25BdHRyaWJ1dGVzVG9Qcm9kdWN0QWN0aW9uIiwidHJhbnNhY3Rpb25BdHRyaWJ1dGVzIiwicHJvZHVjdEFjdGlvbiIsIlJldmVudWUiLCJTaGlwcGluZyIsIlRheCIsImNyZWF0ZUV2ZW50T2JqZWN0IiwibWVzc2FnZVR5cGUiLCJkYXRhIiwiZXZlbnRUeXBlIiwib3B0T3V0IiwiZ2V0UHJvZHVjdEFjdGlvbkV2ZW50TmFtZSIsInByb2R1Y3RBY3Rpb25UeXBlIiwiQWRkVG9DYXJ0IiwiQWRkVG9XaXNobGlzdCIsIkNoZWNrb3V0IiwiQ2xpY2siLCJQdXJjaGFzZSIsIlJlZnVuZCIsIlJlbW92ZUZyb21DYXJ0IiwiUmVtb3ZlRnJvbVdpc2hsaXN0IiwiVmlld0RldGFpbCIsIlVua25vd24iLCJnZXRQcm9tb3Rpb25BY3Rpb25FdmVudE5hbWUiLCJwcm9tb3Rpb25BY3Rpb25UeXBlIiwiUHJvbW90aW9uQ2xpY2siLCJQcm9tb3Rpb25WaWV3IiwiY29udmVydFByb2R1Y3RBY3Rpb25Ub0V2ZW50VHlwZSIsIkNvbW1lcmNlRXZlbnRUeXBlIiwiUHJvZHVjdEFkZFRvQ2FydCIsIlByb2R1Y3RBZGRUb1dpc2hsaXN0IiwiUHJvZHVjdENoZWNrb3V0IiwiUHJvZHVjdENsaWNrIiwiUHJvZHVjdFB1cmNoYXNlIiwiUHJvZHVjdFJlZnVuZCIsIlByb2R1Y3RSZW1vdmVGcm9tQ2FydCIsIlByb2R1Y3RSZW1vdmVGcm9tV2lzaGxpc3QiLCJFdmVudFR5cGUiLCJQcm9kdWN0Vmlld0RldGFpbCIsImNvbnZlcnRQcm9tb3Rpb25BY3Rpb25Ub0V2ZW50VHlwZSIsImV4cGFuZFByb2R1Y3RBY3Rpb24iLCJjb21tZXJjZUV2ZW50IiwiYXBwRXZlbnRzIiwic2hvdWxkRXh0cmFjdEFjdGlvbkF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzIiwiQ3VycmVuY3lDb2RlIiwicGx1c09uZUV2ZW50IiwiZ2VuZXJhdGVFeHBhbmRlZEVjb21tZXJjZU5hbWUiLCJnZXRFeHBhbnNpb25OYW1lIiwiVHJhbnNhY3Rpb24iLCJwcm9kdWN0cyIsInByb2R1Y3RFdmVudCIsImV4dHJhY3RQcm9kdWN0QXR0cmlidXRlcyIsImV4dHJhY3RUcmFuc2FjdGlvbklkIiwiZXh0cmFjdEFjdGlvbkF0dHJpYnV0ZXMiLCJleHBhbmRQcm9tb3Rpb25BY3Rpb24iLCJwcm9tb3Rpb25zIiwiYXBwRXZlbnQiLCJldmVudE5hbWUiLCJwbHVzT25lIiwiZXh0cmFjdFByb21vdGlvbkF0dHJpYnV0ZXMiLCJleHBhbmRQcm9kdWN0SW1wcmVzc2lvbiIsInByb2R1Y3RJbmRleCIsImF0dHJpYnV0ZSIsImV4cGFuZENvbW1lcmNlRXZlbnQiLCJjb25jYXQiLCJjcmVhdGVDb21tZXJjZUV2ZW50T2JqZWN0IiwiYmFzZUV2ZW50IiwiY2FuTG9nIiwic3RhcnROZXdTZXNzaW9uIiwibG9nQ2hlY2tvdXRFdmVudCIsInN0ZXAiLCJhdHRycyIsImxvZ1Byb2R1Y3RBY3Rpb25FdmVudCIsImxvZ1B1cmNoYXNlRXZlbnQiLCJidWlsZFByb2R1Y3RMaXN0IiwibG9nUmVmdW5kRXZlbnQiLCJsb2dQcm9tb3Rpb25FdmVudCIsInByb21vdGlvblR5cGUiLCJsb2dJbXByZXNzaW9uRXZlbnQiLCJQcm9kdWN0SW1wcmVzc2lvbiIsIlByb2R1Y3QiLCJsb2dPcHRPdXQiLCJPdGhlciIsImxvZ0V2ZW50IiwiY2F0ZWdvcnkiLCJjZmxhZ3MiLCJzYW5pdGl6ZUF0dHJpYnV0ZXMiLCJsb2dDb21tZXJjZUV2ZW50IiwiUHJvZHVjdEJhZ3MiLCJsb2dMb2dPdXRFdmVudCIsImV2dCIsIkxvZ291dCIsImdlbmVyYXRlUmFuZG9tVmFsdWUiLCJhIiwiY3J5cHRvIiwiZ2V0UmFuZG9tVmFsdWVzIiwiVWludDhBcnJheSIsIk1hdGgiLCJyYW5kb20iLCJpc0V2ZW50VHlwZSIsIm1lcmdlQ29uZmlnIiwiRGVmYXVsdENvbmZpZyIsImlzT2JqZWN0IiwiYWRkRXZlbnRIYW5kbGVyIiwiZG9tRXZlbnQiLCJzZWxlY3RvciIsImVsZW1lbnRzIiwiaGFuZGxlciIsInRpbWVvdXRIYW5kbGVyIiwiZWxlbWVudCIsImhyZWYiLCJzdWJtaXQiLCJwcmV2ZW50RGVmYXVsdCIsInJldHVyblZhbHVlIiwiVGltZW91dCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJhZGRFdmVudExpc3RlbmVyIiwiYXR0YWNoRXZlbnQiLCJjaGFyYWN0ZXIiLCJ0b0xvd2VyQ2FzZSIsInJlZHVjZSIsImIiLCJjaGFyQ29kZUF0IiwiY3JlYXRlUHJvZHVjdCIsInNrdSIsInByaWNlIiwicXVhbnRpdHkiLCJicmFuZCIsInZhcmlhbnQiLCJjb3Vwb25Db2RlIiwiY3JlYXRlUHJvbW90aW9uIiwiY3JlYXRpdmUiLCJjcmVhdGVJbXByZXNzaW9uIiwiY3JlYXRlVHJhbnNhY3Rpb25BdHRyaWJ1dGVzIiwiYWZmaWxpYXRpb24iLCJyZXZlbnVlIiwic2hpcHBpbmciLCJ0YXgiLCJjYWxsU2V0VXNlckF0dHJpYnV0ZU9uRm9yd2FyZGVycyIsInNldFVzZXJBdHRyaWJ1dGUiLCJmaW5kS2V5SW5PYmplY3QiLCJpc1ZhbGlkQXR0cmlidXRlVmFsdWUiLCJzYW5pdGl6ZWRBdHRycyIsImdldE5hbWUiLCJOYXZpZ2F0aW9uIiwiU2VhcmNoIiwiVXNlckNvbnRlbnQiLCJVc2VyUHJlZmVyZW5jZSIsIlNvY2lhbCIsIk1lZGlhIiwiUHJvZHVjdENoZWNrb3V0T3B0aW9uIiwiSWRlbnRpdHlUeXBlIiwiaWRlbnRpdHlUeXBlIiwiQ3VzdG9tZXJJZCIsIkZhY2Vib29rIiwiVHdpdHRlciIsIkdvb2dsZSIsIk1pY3Jvc29mdCIsIllhaG9vIiwiRW1haWwiLCJBbGlhcyIsIkZhY2Vib29rQ3VzdG9tQXVkaWVuY2VJZCIsIkNoZWNrb3V0T3B0aW9uIiwidG9rZW4iLCJnZXRDb29raWUiLCJlbmRTZXNzaW9uIiwiYmFiZWxIZWxwZXJzLnR5cGVvZiIsImYiLCJ2ZXJzaW9uIiwibGF0IiwibG5nIiwidXNlcklkZW50aXR5IiwicmVtb3ZlVXNlcklkZW50aXR5IiwiU2V0VXNlcklkZW50aXR5Iiwic2V0VXNlcklkZW50aXR5IiwiZm91bmRJZGVudGl0eSIsImlkZW50aXR5IiwiSWRlbnRpdHkiLCJSZW1vdmVVc2VySWRlbnRpdHkiLCJTZXNzaW9uU3RhcnQiLCJTZXNzaW9uRW5kIiwiZXZlbnRJbmZvIiwiU2Vzc2lvblRpbWVvdXQiLCJlcnJvciIsIkNyYXNoUmVwb3J0IiwibWVzc2FnZSIsInN0YWNrIiwicGF0aG5hbWUiLCJob3N0bmFtZSIsInRpdGxlIiwicHJvZHVjdEJhZ05hbWUiLCJBZGRUb1Byb2R1Y3RCYWciLCJpbmRleCIsIlJlbW92ZUZyb21Qcm9kdWN0QmFnIiwiQ2xlYXJQcm9kdWN0QmFnIiwiYXJyYXlDb3B5IiwiY2FydEluZGV4IiwiY2FydEl0ZW0iLCJDbGVhckNhcnQiLCJjb2RlIiwiY291cG9uIiwicGF5bWVudE1ldGhvZCIsImNsZWFyQ2FydCIsImVDb21tZXJjZSIsIkNhcnQiLCJjbGVhciIsInByb2R1Y3ROYW1lIiwicHJvZHVjdFNLVSIsInByb2R1Y3RVbml0UHJpY2UiLCJwcm9kdWN0UXVhbnRpdHkiLCJwcm9kdWN0Q2F0ZWdvcnkiLCJyZXZlbnVlQW1vdW50IiwidGF4QW1vdW50Iiwic2hpcHBpbmdBbW91bnQiLCJ0cmFuc2FjdGlvbklkIiwiJE1ldGhvZE5hbWUiLCJQcm9kdWN0TmFtZSIsIlByb2R1Y3RTS1UiLCJQcm9kdWN0VW5pdFByaWNlIiwiUHJvZHVjdFF1YW50aXR5IiwiUHJvZHVjdENhdGVnb3J5IiwiUmV2ZW51ZUFtb3VudCIsIlRyYW5zYWN0aW9uQWZmaWxpYXRpb24iLCJUcmFuc2FjdGlvbklEIiwiYW1vdW50IiwidGFnTmFtZSIsImV4aXN0aW5nUHJvcCIsIlJlbW92ZVVzZXJUYWciLCJTZXRVc2VyQXR0cmlidXRlIiwiUmVtb3ZlVXNlckF0dHJpYnV0ZSIsIlNldFVzZXJBdHRyaWJ1dGVMaXN0IiwiUmVtb3ZlQWxsVXNlckF0dHJpYnV0ZXMiLCJ1c2VyQXR0cmlidXRlTGlzdHMiLCJ1c2VyQXR0cmlidXRlc0NvcHkiLCJTZXRTZXNzaW9uQXR0cmlidXRlIiwiaXNPcHRpbmdPdXQiLCJzZXRPcHRPdXQiLCJMb2dPdXQiLCJsb2dPdXQiLCJmb3J3YXJkZXJQcm9jZXNzb3IiLCJuZXdGb3J3YXJkZXIiLCJtb2R1bGVJZCIsImhhc0RlYnVnU3RyaW5nIiwicnEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBTUE7eUJBQ1M7OzthQUNSQyxNQUFMLEdBQWMsS0FBZDs7Ozs7a0NBR1NDLElBQUlDLFVBQVU7Z0JBQ2JDLEdBQUo7O2dCQUVJO3NCQUNNLElBQUlDLE9BQU9DLGNBQVgsRUFBTjthQURKLENBR0EsT0FBT0MsQ0FBUCxFQUFVO3lCQUNHLHVDQUFUOzs7Z0JBR0FILE9BQU9GLEVBQVAsSUFBYSxxQkFBcUJFLEdBQXRDLEVBQTJDO29CQUNuQ0ksa0JBQUosR0FBeUJOLEVBQXpCO2FBREosTUFHSyxJQUFJLE9BQU9HLE9BQU9JLGNBQWQsSUFBZ0MsV0FBcEMsRUFBaUQ7eUJBQ3pDLGdDQUFUOztvQkFFSTswQkFD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
