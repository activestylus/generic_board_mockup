$(function() {

  $('.dropdown-toggle').click(function() {
    var div = $(this).next('.dropdown-menu');
    if (div.is(":hidden")) { div.slideDown(); } else { div.slideUp(); }
  });

  var api = $('.scroll-pane').jScrollPane({ showArrows: true }).data('jsp');
  $('.jspArrowDown').bind('mouseover', function() {
    var scrollInterval,
    link = $(this),
    doScroll = function() { api.scrollByY(5) };
    link.bind('mouseout.demo', function() {
      clearInterval(scrollInterval); link.unbind('mouseout.demo');
    });
    doScroll();
    scrollInterval = setInterval(doScroll, 50);
  });
  $('.jspArrowUp').bind('mouseover', function() {
    var scrollInterval,
    link = $(this),
    doScroll = function() { api.scrollByY(-5) };
    link.bind('mouseout.demo', function() {
      clearInterval(scrollInterval); link.unbind('mouseout.demo');
    });
    doScroll();
    scrollInterval = setInterval(doScroll, 50);
  });


  $('#advanced_search').hide();
  $('#toggle_advanced_search').click(function() {
    var self = $(this);
    var div = $('#advanced_search');
    if (div.is(":hidden")) { div.slideDown(); } else { div.slideUp(); }
    self.toggleClass('open');
    if ( self.hasClass('open') ) { self.html('Fewer options'); }
    else { self.html('Search more options'); }
    console.log($(this).html());
  });

});