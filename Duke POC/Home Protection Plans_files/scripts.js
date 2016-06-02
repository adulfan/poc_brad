jq1102(function(){

	jq1102('.service-grid').on('click', function() {
		jq1102('.active-arrow').remove();
		var targetVal = '.' + ( jq1102(this).find('p').text().replace(/[ \/]/g,'-').replace(/(\&.+;)|[^-a-zA-Z]/g,'').replace(/[A-Z]/g, function(c){ return c.toLowerCase(); }) ),
			target = jq1102(targetVal);
		if (target.is(':visible')) {
			target.slideUp('fast');
		} else {
			jq1102(this).append('<div class="active-arrow"></div>');
			jq1102.when(
				jq1102('.service-grid-dropdown').slideUp('fast')
			).then( function() {
				jq1102(targetVal).slideDown('fast');
			});
		}
	});
});