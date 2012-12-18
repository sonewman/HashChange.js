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


});