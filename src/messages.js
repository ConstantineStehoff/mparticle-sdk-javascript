class Messages{
	constructor() {
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
		}

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
		}
	}

	getErrorMessages(key){
		
		return this.ErrorMessages[key];
	}

	getInformationMessages(key){
		return this.InformationMessages[key];
		// Object.keys(this.InformationMessages).map(key => this.InformationMessages[key]);
	}
}

export let messages = new Messages();