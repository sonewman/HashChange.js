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
			expect( HashChange.length ).toEqual( 0 );
		});

		it('Should return back the current hash', function() {
			expect( HashChange.hash ).toEqual( window.location.hash );
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
			});

		});

		//	add multiple function test

	});

	describe('HashChange.activate();', function() {

		it('Should add a function to be called on the hash change', function() {
			var cb = jasmine.createSpy('cb');
			HashChange.activate( 'activate-test-1', cb );

			expect( cb ).toHaveBeenCalledWith( '' );

			waits( 200 );

			setHash('activate-test-1');

			runs(function() {
				expect( cb ).toHaveBeenCalledWith( '#activate-test-1' );
				expect( cb.callCount ).toEqual( 2 );
				setHash();
			});

		});

		//	add multiple function test

	});

	describe('HashChange.once();', function() {

		it('Should add a function to be called on the hash change', function() {
			var cb = jasmine.createSpy('cb');

			HashChange.once( cb );

			waits( 200 );

			setHash('once-test-1');

			runs(function() {
				expect( cb ).toHaveBeenCalledWith( '#once-test-1' );
				setHash();
			});

		});

		//	add multiple function test

	});


	describe('HashChange.clearAll();', function() {

		it('Should clear all events when called with no arguments', function() {
			HashChange.clearAll();
			expect( HashChange.length ).toEqual( 0 );
		});

		it('Should clear all once functions if once is specified', function() {
			var fn1, fn2;

			fn1 = jasmine.createSpy( 'fn1' );
			fn2 = jasmine.createSpy( 'fn2' );
			HashChange.once( fn1 );
			HashChange.once( fn2 );

			HashChange.clearAll();

			setHash('clearAll-test-one');

			expect( fn1 ).not.toHaveBeenCalled();
			expect( fn2 ).not.toHaveBeenCalled();

			setHash();
		});



	});


});