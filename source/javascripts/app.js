function changeUrl() {
  document.location.href = document.getElementById('choose_language').value;
}


var FileNav = {
  init: function() {
    var target = $("#file-nav .togglee");

    $("#file-nav").bind( "clickoutside", function(event){
      if (target.is(":visible")) {
        target.hide('slide');
        $("#file-nav .toggler").toggleClass('open');
      }
    });

    $('#head').bind('inview', function (event, visible, topOrBottomOrBoth) {
      if (visible == true) {
        // element is now visible in the viewport
        if (topOrBottomOrBoth == 'top')
        {
          // top part of element is visible
        }
        else if (topOrBottomOrBoth == 'bottom')
        {
          // bottom part of element is visible
        }
        else
        {
          $('#file-nav').removeClass('light');// whole part of element is visible
        }
      } else {
        $('#file-nav').addClass('light');// element has gone out of viewport
      }
    });
  }
};

var SlideShow = {
  init: function() {
    var logos = $('#slideshow');
    logos.jcarousel({wrap: 'circular'});
    $('#slide-left' ).click(function(){ logos.jcarousel( 'scroll', '-=3' ); return false});
    $('#slide-right').click(function(){ logos.jcarousel( 'scroll', '+=3' ); return false});
    setInterval( function() {logos.jcarousel( 'scroll', '+=3' )}, 8000 );
  }
};

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
};

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
      return false;
    });
  }
};

var DropDownMenu = {
  init: function() {
    $(".dropdown").bind( "clickoutside", function(event){
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

  SlideShow.init();
  AdvancedSearch.init();
  DropDownMenu.init();
  FileNav.init();
  HoverScroll.init();
  Selections.init();
  Toggler.init();

});