function changeUrl() {
  document.location.href = document.getElementById('choose_language').value;
}
Array.prototype.chunk = function(chunkSize) {
  var array=this;
  return [].concat.apply([],
    array.map(function(elem,i) {
      return i%chunkSize ? [] : [array.slice(i,i+chunkSize)];
    })
  );
};
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
Array.prototype.has = function (v) {
  for (i=0;i<this.length;i++){
    if (this[i]==v) return i;
  }
  return false;
};
// FileNav is just for mockup purposes. It can be deleted in production
//
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
        if (topOrBottomOrBoth == 'top') {
          // top part of element is visible
        }
        else if (topOrBottomOrBoth == 'bottom') {
          // bottom part of element is visible
        }
        else {
          // whole part of element is visible
          $('#file-nav').removeClass('light');
        }
      } else {
        // element has gone out of viewport
        $('#file-nav').addClass('light');
      }
    });
  }
};

var SlideShow = {
  
  init: function() {
    var logos = $('#slideshow');
    logos.jcarousel({wrap: 'circular'});

    $('#slide-left' ).click(function(){
      logos.jcarousel( 'scroll', '-=3' );
      return false
    });
    
    $('#slide-right').click(function(){
      logos.jcarousel( 'scroll', '+=3' );
      return false
    });
    
    setInterval( function() {
      logos.jcarousel( 'scroll', '+=3' )
    }, 8000 );
  }
};

var Selections = {
  
  init: function() {
    
    $('#select-all').click(function() {
      
      var select = $(this),
          checks = $('table#select').find('td input[type=checkbox]');
      
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
      
      if (div.is(":hidden"))
      {
        div.slideDown();
      } else {
        div.slideUp();
      };
      
      $(this).toggleClass('open');
      return false;
    });
  }
};

var AdvancedSearch = {
  
  init: function() {  
    $('#advanced_search').hide();
    $('#toggle_advanced_search').click(function() {
      
      var self = $(this);
      var div = $('#advanced_search');
      
      if (div.is(":hidden")) {
        div.slideDown();
      } else {        
        div.slideUp();
      };

      self.toggleClass('open');
      
      if ( self.hasClass('open') ) {
        self.html('Fewer options');
      } else {
        self.html('Search more options');
      };      
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
      if (div.is(":hidden"))
      {
        div.slideDown();
      } else {
        div.slideUp();
      };
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
        clearInterval(scrollInterval);
        link.unbind('mouseout.demo');
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

var ModalWindow = {
  
  init: function() {  
    var dialog  = new ModalDialog ("#modal"),
        closers = ["#s--modalbox-overlay", "#btn-close"];
  
    $("#modal-trigger").click (function() {
      dialog.show(); return false;
    });
    $.each(closers, function(i,id) {
      $(id).on('click',function() { dialog.hide(); return false;});
    });
  }
};

var Dom = {
 
  addText: function (node, txt) {
    node.appendChild( document.createTextNode(txt) );
    return false;
  },

  copyAttributes: function (elem, copy) {
    for(var i = 0, attrs = elem.attributes; i < attrs.length; i++) {
      copy.setAttribute(attrs[i].name, attrs[i].value);
    }
  },

  insertAfter: function(node, newNode) {
    node.parentNode.insertBefore(newNode, node.nextSibling);
  },

  cleanText: function(str) {
    return str.replace('&amp;','').replace('&','').replace('[x]','');
    
  }

};

var MultiLevelSelect = {

  init: function() {
    this.cloneSelects();
    this.createParentMenus(this);
    this.createChildMenus(this);
    this.watchTogglers();
    this.watchParentLinks(this);
    this.watchChildLinks(this);
    this.watchTokenRemovers(this);
    this.togglePopups();
    return false;
  },

  cloneSelects: function() {
    $.each($('select.pop-menu'), function(i, elem) {
      var fragment = document.createDocumentFragment()
        , input    = document.createElement('input')
        ;
      input.setAttribute('type','hidden');
      Dom.copyAttributes(elem, input)
      Dom.insertAfter(elem, fragment.appendChild(input))
    });
    return false
  },

  createParentMenus: function (self) {
    $.each($('select.pop-menu.parent'), function (i, elem) {
      var hash  = self.selectToHash(elem);
      var list  = hash["industries"];
      var chunk = self.getChunk(elem, list);
      var html  = self.createHtmlMenu("industries", list, chunk, 'parent');
      var label = document.createElement('div');
      label.setAttribute('class','pop-parent-label');
      Dom.insertAfter(elem, label);
      Dom.insertAfter(elem, html);
      self.createToggler(elem, '#pop-industries', 'parent');
      elem.parentNode.removeChild(elem);
    });
    return false
  },

  createChildMenus: function (self) {    
    $.each($('select.pop-menu.child'), function (i, elem) {
      var hash  = self.selectToHash(elem);
      $.each( hash, function (key, value) {
        var list  = hash[key];
        var chunk = self.getChunk(elem, list);
        var html  = self.createHtmlMenu((i++ + 1), list, chunk, 'child');
        Dom.insertAfter(elem, html);
      });
      var fragment = document.createDocumentFragment();
      var tokens = document.createElement('div');
      tokens.setAttribute('class', 'pop-tokens');
      fragment.appendChild(tokens);            
      Dom.insertAfter(elem, fragment);
      self.createToggler(elem, ('#pop-' + (i + 1)), 'child');
      elem.parentNode.removeChild(elem);      
    });    
    return false
  },

  createToggler: function (elem, href, type) {
    var fragment = document.createDocumentFragment()
      , link     = document.createElement('a')
      , name     = elem.getAttribute('data-name');
      ;
    link.setAttribute('href', href);
    link.setAttribute('class',('pop-toggler btn btn-go ' + type));
    Dom.addText(link, name);
    fragment.appendChild(link);
    Dom.insertAfter(elem, fragment);
    return false;
  },

  toggleChildSelections: function (self, link, inputDom, selected) {
    var input  = $(inputDom);
    var values = input.val().split(',');
    var newVal = link.attr('title');
    var tokens = input.parent().find('.pop-tokens').first();
    if (selected) {
      values.pop(newVal);
      self.removeHtmlToken(input, newVal);
    } else if ( $.inArray(newVal,values) == -1 ) {
      values.push(newVal);
      tokens.append(self.createHtmlToken(newVal));
    }
    values.clean("");
    input.val(values.clean("").join(','));
    return false;
  },

  createHtmlToken: function(value) {    
    var fragment = document.createDocumentFragment()
    , wrap = document.createElement('span')
    , close = document.createElement('a')
    ;
    wrap.setAttribute('class','pop-token');
    close.setAttribute('class','pop-token-remove');
    close.setAttribute('title',value);
    close.setAttribute('href','#');
    Dom.addText(close,'[x]');
    Dom.addText(wrap,value);
    wrap.appendChild(close);
    return wrap;
  },

  removeHtmlToken: function(input, value) {
    var tokens = input.parent().find('.pop-token');

    $.each( tokens, function (i, token) {
      var source = Dom.cleanText($(token).text())
        , check  = Dom.cleanText(value)
        ;
        console.log('source:'+source);
        console.log('check:'+check);
      if ( source.match(new RegExp(check)) ) {
        token.parentNode.removeChild(token);
      }
    });
  },

  watchTokenRemovers: function(self) {
    $(document).on("click", "a.pop-token-remove", function() {   
      var link  = $(this);
      var input = link.closest('.pop-tokens').parent()
                  .find('input.pop-menu.child').first();
      var links = input.parent().find('div.popup-menu a');
      self.toggleChildSelections(self, link, input.get(0), true);
      
      $.each( links, function(i, a) {
        if (link.attr('title')===a.getAttribute('title')) {
          $(a).removeClass('selected');
        }
      });

      link.parent().remove();
      return false;
    });
  },

  watchChildLinks: function(self) {
    $('.pop.child').find('a').on('click', function(e) {
      var link     = $(this);
      var wrap     = link.closest('.pop.child').parent();
      var input    = wrap.find('input.pop-menu.child');      
      var selected = link.hasClass('selected');
      link.toggleClass('selected');
      self.toggleChildSelections(self,link,input,selected);      
      return false;
    });
    return false
  },

  watchParentLinks: function(self) {
    $('.pop.parent').find('a').on('click', function(e) {
      var link    = $(this);
      var wrap    = link.closest('.pop.parent').parent();
      var href    = link.attr('href')
        , toggler = wrap.find('a.pop-toggler.child')
        , input   = wrap.find('input.pop-menu.parent')
        , child   = wrap.find('input.pop-menu.child')
        , label   = wrap.parent().find('.pop-parent-label').first()
        ;
      link.closest('.parent').find('.child .pop-menu a').removeClass('selected');
      toggler.attr('href', href);
      input.val(link.attr('title'));
      child.val("");
      label.text(link.attr('title'));
      wrap.parent().find('.pop-tokens').first().html('');
      wrap.parent().find('.pop-toggler.child').fadeIn();
      return false;
    });
    return false
  },

  watchTogglers: function() {
    $('a.pop-toggler').on('click', function(e) {
      var div = $($(this).attr('href'));
      $('.pop').fadeOut();
      if (div.is(":hidden")) {
        div.slideDown();
      } else {
        div.slideUp();
      };
      return false;
    });
  },

  selectToHash: function (elem) {
    var hash = {}
      , name = elem.getAttribute('data-name')
      ;
    if (elem.getAttribute('class').match(/parent/)) {
      var opts = [];
      $.each( elem.getElementsByTagName('option'), function (i, option) {
        opts.push(option.value);
      });
      hash["industries"] = opts;
    } else {
      $.each( elem.getElementsByTagName('optgroup'), function (i, group) {
        var opts = []
          , label = group.getAttribute('label')
          ;
        $.each( group.getElementsByTagName('option'), function (i, option) {
          opts.push(option.value);
        });
        hash[label] = opts;
      });
    };
    return hash;
  },

  getChunk: function (elem, list) {
    var chunk = parseInt(elem.getAttribute('data-columns'));
    var result = ~~(list.length / chunk) + 1;
    return result;
  },

  createHtmlMenu: function (id, list, inGroupsOf, relation) {
    var fragment = document.createDocumentFragment()
      , togglee  = document.createElement('div')
      , wrap     = document.createElement('div')
      , popup    = document.createElement('div')
      , uls      = []
      ;    
    togglee.setAttribute('class', ('pop ' + relation));
    togglee.setAttribute('id', ('pop-'+id));
    wrap   .setAttribute('class', 'menu-wrap');
    popup  .setAttribute('class', 'popup-menu');

    $.each( list.chunk(inGroupsOf), function (i, items) {      
      var ul = document.createElement('ul');            
      $.each( items, function (j, item) {        
        var li   = document.createElement('li')
          , link = document.createElement('a')
          ;
        link.setAttribute('href',('#pop-' + (i++ + 1)));
        link.setAttribute('title', item);
        Dom.addText(link, item);
        li.appendChild(link);
        ul.appendChild(li);
      });
      uls.push(ul);
    });

    $.each( uls, function (i, ul) {
      popup.appendChild(ul)
    });

    wrap.appendChild(popup);
    togglee.appendChild(wrap);
    fragment.appendChild(togglee);
    return fragment;
  },

  togglePopups: function() {
    $(".popup-menu").bind( "clickoutside", function(event){
      if ($(this).is(":visible")) {
        $(this).parent().parent().fadeOut();
      }
    });

    $('.popup-menu').find('a').on('click', function(e) {
      self = $(this);
      var div = self.parent().parent().parent();
      var target = $(div.attr('data-target'));
      if ( self.closest('.pop').hasClass('parent') ) {
        div.parent().parent().fadeOut();  
      };
      target.text(self.text());
      return false;
    });
  }
};

var PrintPage = {

  init: function() {
    if ($('a#print-me')) {
      $('a#print-me').click(function() {
        window.print();
        return false;
      });
    }
  }

}


$(function() {
  PrintPage.init();
  MultiLevelSelect.init();
  SlideShow.init();
  AdvancedSearch.init();
  DropDownMenu.init();
  FileNav.init();
  HoverScroll.init();
  ModalWindow.init();
  Selections.init();
  Toggler.init();

});