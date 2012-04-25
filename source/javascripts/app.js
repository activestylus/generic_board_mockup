var Selections = {
  init: function() {
    $('#select-all').click(function() {
      var select = $(this);
      var checks = $('table#select').find('td input[type=checkbox]');
      $.each(checks, function() {
        if (select.is(":checked")) {
          $(this).attr('checked', true);
        } else {
          $(this).attr('checked', false);
        }
      });
    });
  }
}

var Toggler = {
  init: function() {
    $('.toggler').click(function() {
      var div = $(this).next('.togglee');
      if (div.is(":hidden")) { div.slideDown(); } else { div.slideUp(); };
      $(this).toggleClass('open');
    });
  }
};

// var toggleSlide = function(div) {
//   if (div.is(":hidden")) { div.slideDown(); } else { div.slideUp(); }
// };

var AdvancedSearch = {
  init: function() {
    $('#advanced_search').hide();
    $('#toggle_advanced_search').click(function() {
      var self = $(this);
      var div = $('#advanced_search');
      if (div.is(":hidden")) { div.slideDown(); } else { div.slideUp(); };
      self.toggleClass('open');
      if ( self.hasClass('open') ) { self.html('Fewer options'); }
      else { self.html('Search more options'); };
    });
  }
};

var DropDownMenu = {
  init: function() {
    // $("li.dropdown").bind( "clickoutside", function(event){
    //   $(this).find('.dropdown-menu').slideUp();
    //   $(this).find('.dropdown-toggle').toggleClass('open');
    // });
    $("li.dropdown").bind( "clickoutside", function(event){
      $(this).find('.dropdown-menu').slideUp();
      $(this).find('.dropdown-toggle').toggleClass('open');
    });
    $('.dropdown-toggle').click(function() {
      var div = $(this).next('.dropdown-menu');
      //$(this).parent('li').toggleClass('open');
      if (div.is(":hidden")) { div.slideDown(); } else { div.slideUp(); };
    });
  }
};

var HoverScroll = {
  init: function() {
    var api = $('.scroll-pane').jScrollPane({ showArrows: true }).data('jsp');
    $('.hoverscroll.down').bind('mouseover', function() {
      var scrollInterval,
      link = $(this),
      doScroll = function() { api.scrollByY(5) };
      link.bind('mouseout.demo', function() {
        clearInterval(scrollInterval); link.unbind('mouseout.demo');
      });
      doScroll();
      scrollInterval = setInterval(doScroll, 50);
    });
    $('.hoverscroll.up').bind('mouseover', function() {
      var scrollInterval,
      link = $(this),
      doScroll = function() { api.scrollByY(-5) };
      link.bind('mouseout.demo', function() {
        clearInterval(scrollInterval); link.unbind('mouseout.demo');
      });
      doScroll();
      scrollInterval = setInterval(doScroll, 50);
    });
  }
};

$(function() {

  AdvancedSearch.init();
  DropDownMenu.init();
  HoverScroll.init();
  Selections.init();
  Toggler.init();

});