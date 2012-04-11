$(function() {

	$('.scroll-pane').jScrollPane({ showArrows: true });
	$('#advanced_search').hide();
	$('#toggle_advanced_search').click(function() {
	  var self = $(this)
	  $('#advanced_search').toggle();
	  self.toggleClass('open');
	  if ( self.hasClass('open') ) { self.html('Fewer options'); }
	  else { self.html('Search more options'); }
	  console.log($(this).html());
	});

});