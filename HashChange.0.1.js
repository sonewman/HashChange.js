/*!
 * HashChange JavaScript Library v0.1
 *
 * Copyright 2012 http://github.com/acutecoder
 * Released under the MIT license
 *
 * Date: Tue Dec 18 2012 20:06:33 (GMT)
 */

var HashChange = (function() {
	'use strict';
	var hashtory = [ window.location.hash ],

		once = [],

		repeat = [],

		length = 0,

		slice = [].slice,

		eventSupport = true,

		has = function( obj, prop ) {
			return obj.hasOwnProperty( prop );
		},

		isFunc = function( fn ) {
			return typeof fn === 'function';
		},

		onHashChange = function() {
			var i, unit;

			for ( i = 0; i < length; i++ ) {
				unit = repeat[ i ];
				if ( unit && has( unit, 'fns' ) ) {
					callFunctionsArrayPassingHash( repeat[ i ].fns );
				}
			}

			callFunctionsArrayPassingHash( once );

			once = [];

			if ( !eventSupport ) {
				setFallback();
			}

		},


		check = function() {
			var last_index = hashtory.length - 1,
				newHash = window.location.hash,
				currentHash = hashtory[ last_index ];

			if ( newHash !== currentHash ) {
				currentHash = hashtory[hashtory.length] = newHash;
				onHashChange();
			}
		},


		setFallback = function() {
			setTimeout( check, 200 );
		},

		fallback = function() {
			eventSupport = false;
			setFallback();
		},


		initialize = function( id, args, what ) {
			var fn, i, l;
			args = args || [];

			if ( what === 'once' ) {

				l = args.length;
				for ( i = 0; i < l; i++ ) {
					once[ once.length ] = fn;
				}

			}	
			else {

				if ( !id ) {
					throw new Error('To Subscribe to the HashChange you need to provide an id key');
				}

				i = idIndexInRepeat( id );

				if ( i > -1 ) {
					repeat[ i ].fns = args;
				}
				else {
					repeat[length] = {
						id : id,
						fns : args
					};
				}

				if ( what === 'activate' ) {
					callFunctionsArrayPassingHash( repeat[length].fns );
				}

				length += 1;
			}

		},

		//	returns index if present, else returns -1
		idIndexInRepeat = function( id ) {
			for ( var i = 0; i < length; i++ ) {
				if ( repeat[i][id] !== undefined ) {
					return i;
				}
			}
			return -1;
		},


		callFunctionsArrayPassingHash = function( arrayOfFns ) {
			var i, l, fn, hash = window.location.hash;

			if ( has( arrayOfFns, 'length' ) ) {
				for ( i = 0, l = arrayOfFns.length; i < l; i++ ) {
					fn = arrayOfFns[ i ];
					if ( isFunc( fn ) ) {
						fn( hash );
					}
				}
			}
		};

		if ( window.onhashchange !== undefined ) {

			if ( window.addEventListener ) {
				window.addEventListener( 'hashchange', check, false );
			}
			else if ( window.attachEvent ) {
				window.attachEvent( 'onhashchange', check );
			}
			else {
				fallback();
			}

		}
		else {
			fallback();
		}


		return {

			subscribe : function( id ) {
				initialize( id, slice.call( arguments, 1 ) );
				return this;
			},

			activate : function( id ) {
				initialize( id, slice.call( arguments, 1 ), 'activate' );
				return this;
			},

			once : function( id ) {
				initialize( id, slice.call( arguments, 1 ), 'once' );
				return this;
			},

			unsubscribe : function( id ) {
				var i;

				if ( !id ) {
					return;
				}

				i = idIndexInRepeat( id );

				if ( i === -1 ) {
					return;
				}

				repeat.splice( i, 1 );
				length -= 1;

				return this;
			},

			hash : hashtory[ length ] || window.location.hash,

			length : length,

			clearAll : function( what ) {
				
				if ( what === 'repeat' ) {
					repeat = [];
				}
				else if ( what === 'once' ) {
					once = [];
				}
				else {
					repeat = [];
					once = [];
				}

				return this;
			}

		};


	}());