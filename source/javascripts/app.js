(function() {
  var AdvancedSearch, Dom, DropDownMenu, FileNav, HoverScroll, ModalWindow, MultiLevelSelect, PrintPage, Selections, SlideShow, Toggler, ValidateFormSections, changeUrl;

  changeUrl = function() {
    return document.location.href = document.getElementById("choose_language").value;
  };

  Array.prototype.chunk = function(chunkSize) {
    var array;
    array = this;
    return [].concat.apply([], array.map(function(elem, i) {
      if (i % chunkSize) {
        return [];
      } else {
        return [array.slice(i, i + chunkSize)];
      }
    }));
  };

  Array.prototype.clean = function(deleteValue) {
    var i;
    i = 0;
    while (i < this.length) {
      if (this[i] === deleteValue) {
        this.splice(i, 1);
        i--;
      }
      i++;
    }
    return this;
  };

  Array.prototype.has = function(v) {
    var i;
    i = 0;
    while (i < this.length) {
      if (this[i] === v) return i;
      i++;
    }
    return false;
  };

  FileNav = {
    init: function() {
      var target;
      target = $("#file-nav .togglee");
      $("#file-nav").bind("clickoutside", function(event) {
        if (target.is(":visible")) {
          target.hide("slide");
          return $("#file-nav .toggler").toggleClass("open");
        }
      });
      return $("#head").bind("inview", function(event, visible, topOrBottomOrBoth) {
        if (visible === true) {
          if (topOrBottomOrBoth === "top") {} else {
            if (topOrBottomOrBoth !== "bottom") {
              return $("#file-nav").removeClass("light");
            }
          }
        } else {
          return $("#file-nav").addClass("light");
        }
      });
    }
  };

  SlideShow = {
    init: function() {
      var logos;
      logos = $("#slideshow");
      logos.jcarousel({
        wrap: "circular"
      });
      $("#slide-left").click(function() {
        logos.jcarousel("scroll", "-=3");
        return false;
      });
      $("#slide-right").click(function() {
        logos.jcarousel("scroll", "+=3");
        return false;
      });
      return setInterval((function() {
        return logos.jcarousel("scroll", "+=3");
      }), 8000);
    }
  };

  Selections = {
    init: function() {
      return $("#select-all").click(function() {
        var checks, select;
        select = $(this);
        checks = $("table#select").find("td input[type=checkbox]");
        return $.each(checks, function() {
          if (select.is(":checked")) {
            return $(this).attr("checked", true);
          } else {
            return $(this).attr("checked", false);
          }
        });
      });
    }
  };

  Toggler = {
    init: function() {
      return $(".toggler").click(function() {
        var div;
        div = $(this).next(".togglee");
        if (div.is(":hidden")) {
          div.slideDown();
        } else {
          div.slideUp();
        }
        $(this).toggleClass("open");
        return false;
      });
    }
  };

  AdvancedSearch = {
    init: function() {
      $("#advanced_search").hide();
      return $("#toggle_advanced_search").click(function() {
        var div, self;
        self = $(this);
        div = $("#advanced_search");
        if (div.is(":hidden")) {
          div.slideDown();
        } else {
          div.slideUp();
        }
        self.toggleClass("open");
        if (self.hasClass("open")) {
          self.html("Fewer options");
        } else {
          self.html("Search more options");
        }
        return false;
      });
    }
  };

  DropDownMenu = {
    init: function() {
      $(".dropdown").bind("clickoutside", function(event) {
        $(this).find(".dropdown-menu").slideUp();
        return $(this).find(".dropdown-toggle").toggleClass("open");
      });
      return $(".dropdown-toggle").click(function() {
        var div;
        div = $(this).next(".dropdown-menu");
        if (div.is(":hidden")) {
          return div.slideDown();
        } else {
          return div.slideUp();
        }
      });
    }
  };

  HoverScroll = {
    init: function() {
      var api;
      api = $(".scroll-pane").jScrollPane({
        showArrows: true
      }).data("jsp");
      $(".hoverscroll.down").bind("mouseover", function() {
        var doScroll, link, scrollInterval;
        scrollInterval = void 0;
        link = $(this);
        doScroll = function() {
          return api.scrollByY(5);
        };
        link.bind("mouseout.demo", function() {
          clearInterval(scrollInterval);
          return link.unbind("mouseout.demo");
        });
        doScroll();
        return scrollInterval = setInterval(doScroll, 50);
      });
      return $(".hoverscroll.up").bind("mouseover", function() {
        var doScroll, link, scrollInterval;
        scrollInterval = void 0;
        link = $(this);
        doScroll = function() {
          return api.scrollByY(-5);
        };
        link.bind("mouseout.demo", function() {
          clearInterval(scrollInterval);
          return link.unbind("mouseout.demo");
        });
        doScroll();
        return scrollInterval = setInterval(doScroll, 50);
      });
    }
  };

  ModalWindow = {
    init: function() {
      var closers, dialog;
      dialog = new ModalDialog("#modal");
      closers = ["#s--modalbox-overlay", "#btn-close"];
      $("#modal-trigger").click(function() {
        dialog.show();
        return false;
      });
      return $.each(closers, function(i, id) {
        return $(id).on("click", function() {
          dialog.hide();
          return false;
        });
      });
    }
  };

  Dom = {
    addText: function(node, txt) {
      node.appendChild(document.createTextNode(txt));
      return false;
    },
    copyAttributes: function(elem, copy) {
      var attrs, i, _results;
      i = 0;
      attrs = elem.attributes;
      _results = [];
      while (i < attrs.length) {
        copy.setAttribute(attrs[i].name, attrs[i].value);
        _results.push(i++);
      }
      return _results;
    },
    insertAfter: function(node, newNode) {
      return node.parentNode.insertBefore(newNode, node.nextSibling);
    },
    cleanText: function(str) {
      return str.replace("&amp;", "").replace("/", "").replace("&", "").replace("-", "").replace("[x]", "");
    }
  };

  MultiLevelSelect = {
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
      $.each($("select.pop-menu"), function(i, elem) {
        var fragment, input;
        fragment = document.createDocumentFragment();
        input = document.createElement("input");
        input.setAttribute("type", "hidden");
        Dom.copyAttributes(elem, input);
        return Dom.insertAfter(elem, fragment.appendChild(input));
      });
      return false;
    },
    createParentMenus: function(self) {
      $.each($("select.pop-menu.parent"), function(i, elem) {
        var chunk, hash, html, label, list;
        hash = self.selectToHash(elem);
        list = hash["industries"];
        chunk = self.getChunk(elem, list);
        html = self.createHtmlMenu("industries", list, chunk, "parent");
        label = document.createElement("div");
        label.setAttribute("class", "pop-parent-label");
        Dom.insertAfter(elem, label);
        Dom.insertAfter(elem, html);
        self.createToggler(elem, "#pop-industries", "parent");
        return elem.parentNode.removeChild(elem);
      });
      return false;
    },
    createChildMenus: function(self) {
      $.each($("select.pop-menu.child"), function(i, elem) {
        var fragment, hash, tokens;
        hash = self.selectToHash(elem);
        $.each(hash, function(key, value) {
          var chunk, html, list;
          list = hash[key];
          chunk = self.getChunk(elem, list);
          html = self.createHtmlMenu(i++ + 1, list, chunk, "child");
          return Dom.insertAfter(elem, html);
        });
        fragment = document.createDocumentFragment();
        tokens = document.createElement("div");
        tokens.setAttribute("class", "pop-tokens");
        fragment.appendChild(tokens);
        Dom.insertAfter(elem, fragment);
        self.createToggler(elem, "#pop-" + (i + 1), "child");
        return elem.parentNode.removeChild(elem);
      });
      return false;
    },
    createToggler: function(elem, href, type) {
      var fragment, link, name;
      fragment = document.createDocumentFragment();
      link = document.createElement("a");
      name = elem.getAttribute("data-name");
      link.setAttribute("href", href);
      link.setAttribute("class", "pop-toggler btn btn-go " + type);
      Dom.addText(link, name);
      fragment.appendChild(link);
      Dom.insertAfter(elem, fragment);
      return false;
    },
    toggleChildSelections: function(self, link, inputDom, selected) {
      var input, newVal, tokens, values;
      input = $(inputDom);
      values = input.val().split(",");
      newVal = link.attr("title");
      tokens = input.parent().find(".pop-tokens").first();
      if (selected) {
        values.pop(newVal);
        self.removeHtmlToken(input, newVal);
      } else if ($.inArray(newVal, values) === -1) {
        values.push(newVal);
        tokens.append(self.createHtmlToken(newVal));
      }
      values.clean("");
      input.val(values.clean("").join(","));
      return false;
    },
    createHtmlToken: function(value) {
      var close, fragment, wrap;
      fragment = document.createDocumentFragment();
      wrap = document.createElement("span");
      close = document.createElement("a");
      wrap.setAttribute("class", "pop-token");
      close.setAttribute("class", "pop-token-remove");
      close.setAttribute("title", value);
      close.setAttribute("href", "#");
      Dom.addText(close, "[x]");
      Dom.addText(wrap, value);
      wrap.appendChild(close);
      return wrap;
    },
    removeHtmlToken: function(input, value) {
      var tokens;
      tokens = input.parent().find(".pop-token");
      return $.each(tokens, function(i, token) {
        if (source.match(new RegExp(check))) {
          return token.parentNode.removeChild(token);
        }
      });
    },
    watchTokenRemovers: function(self) {
      return $(document).on("click", "a.pop-token-remove", function() {
        var input, link, links;
        link = $(this);
        input = link.closest(".pop-tokens").parent().find("input.pop-menu.child").first();
        links = input.parent().find("div.popup-menu a");
        self.toggleChildSelections(self, link, input.get(0), true);
        $.each(links, function(i, a) {
          if (link.attr("title") === a.getAttribute("title")) {
            return $(a).removeClass("selected");
          }
        });
        link.parent().remove();
        return false;
      });
    },
    watchChildLinks: function(self) {
      $(".pop.child").find("a").on("click", function(e) {
        var input, link, selected, wrap;
        link = $(this);
        wrap = link.closest(".pop.child").parent();
        input = wrap.find("input.pop-menu.child");
        selected = link.hasClass("selected");
        link.toggleClass("selected");
        self.toggleChildSelections(self, link, input, selected);
        return false;
      });
      return false;
    },
    watchParentLinks: function(self) {
      $(".pop.parent").find("a").on("click", function(e) {
        var child, href, input, label, link, toggler, wrap;
        link = $(this);
        wrap = link.closest(".pop.parent").parent();
        href = link.attr("href");
        toggler = wrap.find("a.pop-toggler.child");
        input = wrap.find("input.pop-menu.parent");
        child = wrap.find("input.pop-menu.child");
        label = wrap.parent().find(".pop-parent-label").first();
        child.val("");
        toggler.attr("href", href);
        input.val(link.attr("title"));
        self.activateParentToken(wrap, label, link);
        return false;
      });
      return false;
    },
    activateParentToken: function(wrap, label, link) {
      wrap.parent().find(".pop-tokens").first().html("");
      link.closest(".parent").find(".child .pop-menu a").removeClass("selected");
      wrap.parent().find(".pop-toggler.child").fadeIn();
      label.addClass("active");
      label.animate({
        opacity: 1
      });
      return label.text(link.attr("title"));
    },
    watchTogglers: function() {
      return $("a.pop-toggler").on("click", function(e) {
        var div;
        div = $($(this).attr("href"));
        $(".pop").fadeOut();
        if (div.is(":hidden")) {
          div.slideDown();
        } else {
          div.slideUp();
        }
        return false;
      });
    },
    selectToHash: function(elem) {
      var hash, name, opts;
      hash = {};
      name = elem.getAttribute("data-name");
      if (elem.getAttribute("class").match(/parent/)) {
        opts = [];
        $.each(elem.getElementsByTagName("option"), function(i, option) {
          return opts.push(option.value);
        });
        hash["industries"] = opts;
      } else {
        $.each(elem.getElementsByTagName("optgroup"), function(i, group) {
          var label;
          opts = [];
          label = group.getAttribute("label");
          $.each(group.getElementsByTagName("option"), function(i, option) {
            return opts.push(option.value);
          });
          return hash[label] = opts;
        });
      }
      return hash;
    },
    getChunk: function(elem, list) {
      var chunk, result;
      chunk = parseInt(elem.getAttribute("data-columns"));
      result = ~~(list.length / chunk) + 1;
      return result;
    },
    createHtmlMenu: function(id, list, inGroupsOf, relation) {
      var fragment, popup, togglee, uls, wrap;
      fragment = document.createDocumentFragment();
      togglee = document.createElement("div");
      wrap = document.createElement("div");
      popup = document.createElement("div");
      uls = [];
      togglee.setAttribute("class", "pop " + relation);
      togglee.setAttribute("id", "pop-" + id);
      wrap.setAttribute("class", "menu-wrap");
      popup.setAttribute("class", "popup-menu");
      $.each(list.chunk(inGroupsOf), function(i, items) {
        var ul;
        ul = document.createElement("ul");
        $.each(items, function(j, item) {
          var li, link;
          li = document.createElement("li");
          link = document.createElement("a");
          link.setAttribute("href", "#pop-" + (i++ + 1));
          link.setAttribute("title", item);
          Dom.addText(link, item);
          li.appendChild(link);
          return ul.appendChild(li);
        });
        return uls.push(ul);
      });
      $.each(uls, function(i, ul) {
        return popup.appendChild(ul);
      });
      wrap.appendChild(popup);
      togglee.appendChild(wrap);
      fragment.appendChild(togglee);
      return fragment;
    },
    togglePopups: function() {
      $(".popup-menu").bind("clickoutside", function(event) {
        if ($(this).is(":visible")) return $(this).parent().parent().fadeOut();
      });
      return $(".popup-menu").find("a").on("click", function(e) {
        var div, self, target;
        self = $(this);
        div = self.parent().parent().parent();
        target = $(div.attr("data-target"));
        if (self.closest(".pop").hasClass("parent")) {
          div.parent().parent().fadeOut();
        }
        target.text(self.text());
        return false;
      });
    }
  };

  PrintPage = {
    init: function() {
      if ($("a#print-me")) {
        return $("a#print-me").click(function() {
          window.print();
          return false;
        });
      }
    }
  };

  ValidateFormSections = {
    init: function() {
      this.hideSections(this);
      this.watchRequiredInputs(this);
      return false;
    },
    hideSections: function(self) {
      var n, step, _i, _j, _len, _len2, _ref, _ref2, _results;
      _ref = [2, 3];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        n = _ref[_i];
        _ref2 = $("#step-2,#step-3");
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          step = _ref2[_j];
          if (!self.isValid(self, $(step))) $(step).hide();
        }
        _results.push(false);
      }
      return _results;
    },
    watchRequiredInputs: function(self) {
      var input, _i, _j, _len, _len2, _ref, _ref2;
      _ref = $("input[data-validate-presence]");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        input = _ref[_i];
        if (input.tagName === "INPUT") {
          $(input).keyup(function() {
            return self.showNext(self, $(this));
          });
        }
      }
      _ref2 = $("select[data-validate-presence]");
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        input = _ref2[_j];
        if (input.tagName === "SELECT") {
          $(input).change(function() {
            return self.showNext(self, $(this));
          });
        }
      }
      return false;
    },
    isValid: function(self, section) {
      var badFields, current, i, prev, type, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref, _ref2, _ref3, _ref4;
      current = self.getIdNum(section);
      badFields = 0;
      prev = $("step-" + (current - 1));
      _ref = ['input', 'select'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        type = _ref[_i];
        _ref2 = section.find("" + type + "[data-validate-presence]");
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          i = _ref2[_j];
          if ($(i).val() === "") badFields++;
        }
      }
      console.log(badFields);
      _ref3 = ['input', 'select'];
      for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
        type = _ref3[_k];
        _ref4 = prev.find("" + type + "[data-validate-presence]");
        for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
          i = _ref4[_l];
          console.log($(i).val());
          if ($(i).val() === "") badFields++;
        }
      }
      console.log(badFields);
      return badFields === 0;
    },
    scanFields: function(section, badFields) {
      var i, type, _i, _len, _ref, _results;
      _ref = ['input', 'select'];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        type = _ref[_i];
        _results.push((function() {
          var _j, _len2, _ref2, _results2;
          _ref2 = section.find("" + type + "[data-validate-presence]");
          _results2 = [];
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            i = _ref2[_j];
            if ($(i).val() === "") {
              _results2.push(badFields++);
            } else {
              _results2.push(void 0);
            }
          }
          return _results2;
        })());
      }
      return _results;
    },
    getIdNum: function(section) {
      return parseInt(section.attr('id').replace('step-', ''));
    },
    showNext: function(self, input) {
      var badFields, current, i, next, section, _i, _len, _ref;
      section = input.closest('.section');
      current = self.getIdNum(section);
      next = current + 1;
      badFields = 0;
      _ref = section.find("input[data-validate-presence]", "select[data-validate-presence]");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        if ($(i).val() === "") badFields++;
      }
      console.log(badFields);
      if (next !== 4) {
        if (next === 2 && badFields === !0) $("#step-3").slideUp();
        if (badFields === 0) {
          $("#step-" + next).slideDown();
        } else {
          if (next === 2) {
            $("#step-2").slideUp();
            $("#step-3").slideUp();
          } else {
            $("#step-" + next).slideUp();
          }
        }
      }
      return false;
    }
  };

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
    return ValidateFormSections.init();
  });

}).call(this);
