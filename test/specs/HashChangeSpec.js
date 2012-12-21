/** 
* Resets all of a spy's the tracking variables so that it can be 
used again. 
* 
* @example 
* spyOn(foo, 'bar'); 
* 
* foo.bar(); 
* 
* expect(foo.bar.callCount).toEqual(1); 
* 
* foo.bar.reset(); 
* 
* expect(foo.bar.callCount).toEqual(0); 
*/ 
jasmine.Spy.prototype.reset = function() { 
	this.wasCalled = false; 
	this.callCount = 0; 
	this.argsForCall = []; 
	this.calls = []; 
	this.mostRecentCall = {}; 
};


function setHash ( hash ) {
	window.location.hash = hash ? '#' + hash : '';
}

//	reset Hash before starting test
setHash();

describe('HashChange.js', function() {

	describe('initialization', function() {

		it('Should be defined', function() {
			expect( HashChange ).toBeDefined();
		});

		it('Should return back a length of zero', function() {
			expect( HashChange.count() ).toEqual( 0 );
		});

		it('Should return back the current hash', function() {
			expect( HashChange.hash() ).toEqual( window.location.hash );
		});
	});

	describe('HashChange.subscribe();', function() {

		it('Should add a function to be called on the hash change', function() {
			var cb = jasmine.createSpy('cb');
			HashChange.subscribe( 'subscribe-test-1', cb );

			waits( 100 );

			setHash('subscribe-test-1');

			runs(function() {
				expect( cb ).toHaveBeenCalledWith( '#subscribe-test-1' );
				setHash();
				HashChange.clearAll( 'repeat' );
			});

		});

		it('Should add two functions to be called on the hash change and on initialisation', function() {
			var cb1, cb2;
			cb1 = jasmine.createSpy('cb');
			cb2 = jasmine.createSpy('cb');
			HashChange.subscribe( 'activate-test-2', cb1, cb2 );

			waits( 200 );

			setHash('subscribe-test-2');

			runs(function() {
				expect( cb1 ).toHaveBeenCalledWith( '#subscribe-test-2' );
				expect( cb2 ).toHaveBeenCalledWith( '#subscribe-test-2' );
				setHash();
				HashChange.clearAll( 'repeat' );
			});

		});

	});

	describe('HashChange.activate();', function() {

		it('Should add a function to be called on the hash change and call them on initialisation', function() {
			var cb = jasmine.createSpy('cb');
			HashChange.activate( 'activate-test-1', cb );

			expect( cb ).toHaveBeenCalledWith( '' );
			waits( 200 );

			setHash('activate-test-1');

			runs(function() {
				expect( cb ).toHaveBeenCalledWith( '#activate-test-1' );
				expect( cb.callCount ).toEqual( 2 );
				setHash();
				HashChange.clear( 'activate-test-1' );
			});

		});

		it('Should add two functions to be called on the hash change and on initialisation', function() {
			var cb1, cb2;
			cb1 = jasmine.createSpy('cb');
			cb2 = jasmine.createSpy('cb');
			HashChange.activate( 'activate-test-2', cb1, cb2 );

			expect( cb1 ).toHaveBeenCalledWith( '' );
			expect( cb2 ).toHaveBeenCalledWith( '' );
			waits( 200 );

			setHash('activate-test-2');

			runs(function() {
				expect( cb1 ).toHaveBeenCalledWith( '#activate-test-2' );
				expect( cb1.callCount ).toEqual( 2 );
				expect( cb2 ).toHaveBeenCalledWith( '#activate-test-2' );
				expect( cb2.callCount ).toEqual( 2 );
				setHash();
			});

		});

	});

	describe('HashChange.once();', function() {

		it('Should add a function to be called on the hash change', function() {
			var cb = jasmine.createSpy('cb');

			HashChange.once( cb );
			waits( 200 );

			setHash('once-test-1');

			runs(function() {
				expect( cb ).toHaveBeenCalledWith( '#once-test-1' );
				setHash('once-test-1.1');
				expect( cb.callCount ).toEqual( 1 );
				setHash();
			});

		});

		it('Should add two functions to be called on the hash change once', function() {
			var cb1, cb2;
			cb1 = jasmine.createSpy('cb');
			cb2 = jasmine.createSpy('cb');
			HashChange.once( 'once-test-2', cb1, cb2 );

			waits( 200 );

			setHash('once-test-2');

			runs(function() {
				expect( cb1 ).toHaveBeenCalledWith( '#once-test-2' );
				expect( cb2 ).toHaveBeenCalledWith( '#once-test-2' );
				setHash( 'once-test-2.1' );
				expect( cb1.callCount ).toEqual( 1 );
				expect( cb2.callCount ).toEqual( 1 );
				setHash();
			});

		});

	});

	describe('HashChange.clearAll();', function() {

		it('Should clear all events when called with no arguments', function() {
			HashChange.clearAll();
			expect( HashChange.count() ).toEqual( 0 );
		});

		it('Should clear all once functions if once is specified', function() {
			var fn1, fn2;

			fn1 = jasmine.createSpy( 'fn1' );
			fn2 = jasmine.createSpy( 'fn2' );
			HashChange.once( fn1 );
			HashChange.once( fn2 );

			HashChange.clearAll( 'once' );

			setHash('clearAll-test-one');

			expect( fn1 ).not.toHaveBeenCalled();
			expect( fn2 ).not.toHaveBeenCalled();

			setHash();
		});

		it('Should clear all repeat functions if repeat is specified', function() {
			var fn1, fn2;

			fn1 = jasmine.createSpy( 'fn1' );
			fn2 = jasmine.createSpy( 'fn2' );
			HashChange.subscribe( 'fn1', fn1 );
			HashChange.subscribe( 'fn2', fn2 );

			HashChange.clearAll( 'repeat' );

			setHash('clearAll-test-two');

			expect( HashChange.count() ).toEqual( 0 );

			setHash();
		});

	});

	describe('HashChange.clear();', function() {

		it('Should take and Id and clear that event from the HashChange Repeat event list', function() {
			var fn = jasmine.createSpy( 'fn' );

			HashChange.subscribe( 'clear-test', fn );

			expect( HashChange.count() ).toEqual( 1 );
			HashChange.clear( 'clear-test' );
			expect( HashChange.count() ).toEqual( 0 );
			expect( fn ).not.toHaveBeenCalled();
		});

	});


	
});


