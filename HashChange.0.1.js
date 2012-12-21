/*!
 * HashChange JavaScript Library v0.1
 *
 * Copyright 2012 http://github.com/acutecoder
 * Released under the MIT license
 *
 * Date: Thu Dec 20 2012 15:41 (GMT)
 */

var HashChange = (function() {
	'use strict';
	var hashtory = [ window.location.hash ],

		once = [],

		repeat = [],

		slice = [].slice,

		eventSupport = true,

		subCount = 0,

		has = function( obj, prop ) {
			return obj.hasOwnProperty( prop );
		},

		isFunc = function( fn ) {
			return typeof fn === 'function';
		},

		onHashChange = function() {
			var i, unit;

			for ( i = 0; i < subCount; i++ ) {
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
			var i, l, index;
			args = args || [];

			if ( what === 'once' ) {

				l = args.length;
				for ( i = 0; i < l; i++ ) {
					once.push( args[ i ] );
				}

			}	
			else {

				if ( !id ) {
					throw new Error('To Subscribe to the HashChange you need to provide an id key');
				}

				i = idIndexInRepeat( id );

				if ( i > -1 ) {
					repeat[ i ].fns = args;
					index = i;
				}
				else {
					repeat.push({
						id : id,
						fns : args
					});
					index = subCount;
				}

				if ( what === 'activate' ) {
					if ( repeat[ index ] && has( repeat[ index ], 'fns' )  ) {
						callFunctionsArrayPassingHash( repeat[ index ].fns );
					}
				}

				subCount += 1;
			}

		},

		//	returns index if present, else returns -1
		idIndexInRepeat = function( id ) {
			for ( var i = 0; i < subCount; i++ ) {
				if ( repeat[i].id !== undefined ) {
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
		},

		callForId = function( fn, id ) {
			if ( !id ) {
				throw new Error( 'Please Supply an ID for ' + fn + ' function.');
			} 
		};


		//	Add event listener

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
				callForId('subscribe', id );
				initialize( id, slice.call( arguments, 1 ) );
				return this;
			},

			activate : function( id ) {
				callForId('activate', id );
				initialize( id, slice.call( arguments, 1 ), 'activate' );
				return this;
			},

			once : function( id ) {
				initialize( null, slice.call( arguments ), 'once' );
				return this;
			},

			unsubscribe : function( id ) {
				var i;

				callForId('unsubscribe', id );
				i = idIndexInRepeat( id );

				if ( i === -1 ) {
					return;
				}

				repeat.splice( i, 1 );
				subCount -= 1;

				return this;
			},

			hash : function() {
				return window.location.hash;
			},

			count : function() {
				return subCount;
			},

			clear : function( id ) {
				var i = 0, l = arguments.length, index;
				
				for ( ; i < l; i++ ) {

					if ( arguments[ i ] !== undefined ) {
						index = idIndexInRepeat( arguments[ i ] );

						if ( index > -1 ) {
							repeat.splice( index, 1 );
							subCount -= 1;
						}
					}
				}

			},

			clearAll : function( what ) {
				
				if ( what === 'repeat' ) {
					repeat = [];
					subCount = 0;
				}
				else if ( what === 'once' ) {
					once = [];
				}
				else {
					repeat = [];
					subCount = 0;
					once = [];
				}

				return this;
			}
		};

}());