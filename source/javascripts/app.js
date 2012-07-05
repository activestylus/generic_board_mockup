(function() {
  var AdvancedSearch, Dom, DropDownMenu, FileNav, HoverScroll, ModalWindow, MultiLevelSelect, PrintPage, Selections, SlideShow, Toggler, Validate, ValidateFormSections, changeUrl;

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
      return str.replace("&amp;", "").replace("/", "").replace("&", "").replace("-", "").replace("–", "").replace("[x]", "");
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
        fragment.appendChild(input);
        return Dom.insertAfter(elem, fragment);
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
      var source, target, token, _i, _len, _ref, _results;
      _ref = input.parent().find(".pop-token");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        token = _ref[_i];
        source = Dom.cleanText($(token).text());
        target = Dom.cleanText(value);
        if (source === target) {
          _results.push(token.parentNode.removeChild(token));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
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
        if (!Validate.presence(input)) ValidateFormSections.disableStep(2);
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
        if (Validate.presence(input)) {
          ValidateFormSections.enableStep(2);
        } else {
          ValidateFormSections.disableStep(2);
        }
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

  Validate = {
    email: function(field) {
      var matches;
      matches = field.val().match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
      return !(matches === null) && matches.length > 0;
    },
    presence: function(field) {
      return !(field.val() === "");
    }
  };

  ValidateFormSections = {
    init: function() {
      this.markValidFields();
      this.addStepButtons();
      this.hideSections(this);
      this.addValidationsFor(this);
      this.watchStepButtons(this);
      this.watchRequiredInputs(this);
      return false;
    },
    markValidFields: function() {
      var errs, f, _i, _len, _ref;
      _ref = $('.validate');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        f = $(f);
        errs = 0;
        if (f.data('validate-presence') && !Validate.presence(f)) errs++;
        if (f.data('validate-email') && !Validate.email(f)) errs++;
        if (errs === 0) f.addClass('valid');
      }
      return false;
    },
    hideSections: function(self) {
      var input, n, prev, step, _i, _len, _ref;
      _ref = [2, 3];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        n = _ref[_i];
        step = $("[data-step=" + n + "]");
        prev = $("[data-step=" + (n - 1) + "]");
        if (!(self.isValid(step) || self.isValid(prev))) step.hide();
      }
      input = $(".pop-menu.child.multi");
      if (!Validate.presence(input)) {
        self.disableStep(2);
      } else {
        self.enableStep(2);
      }
      return false;
    },
    enableStep: function(n) {
      var next, step;
      step = $("#step" + n + "-fields");
      next = step.closest('.section').find('a.next');
      step.removeClass('disabled');
      step.find('input,textarea,select').prop('disabled', false);
      next.removeClass('disabled');
      return false;
    },
    disableStep: function(n) {
      var next, step;
      step = $("#step" + n + "-fields");
      next = step.closest('.section').find('a.next');
      step.addClass('disabled');
      step.find('input,textarea,select').prop('disabled', true);
      next.addClass('disabled');
      return false;
    },
    addStepButtons: function() {
      var step, _i, _len, _ref;
      _ref = $(".steps .section");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        step = _ref[_i];
        if ($(step).data("step") !== 3) {
          $(step).append("<a href='#' class='next cf btn btn-large btn-go'>Continue</a>");
        }
      }
      return false;
    },
    addValidationsFor: function(self) {
      var div, errors, f, field, li, msg, type, ul, _i, _len, _ref;
      _ref = $('.validate');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        field = $(f);
        field.wrap("<div class='validated-field' />");
        ul = $(document.createElement("ul"));
        ul.attr('class', 'errors');
        div = field.closest('validated-field');
        errors = {};
        if (field.data('validate-presence')) {
          errors['presence'] = field.data('validate-presence');
        }
        if (field.data('validate-email')) {
          errors['email'] = field.data('validate-email');
        }
        for (type in errors) {
          msg = errors[type];
          li = $(document.createElement("li"));
          li.html(msg);
          li.addClass(type);
          ul.append(li);
        }
        if (!$.isEmptyObject(errors)) {
          ul.hide();
          ul.insertAfter(field);
        }
      }
      return false;
    },
    watchStepButtons: function(self) {
      $('a.next').click(function() {
        var current, f, field, next, section, _i, _len, _ref;
        if (!$(this).hasClass('disabled')) {
          section = $(this).closest('.section');
          current = self.getIdNum(section);
          next = $("[data-step=" + (current + 1) + "]");
          if (self.isValid(section)) {
            console.log("current:" + current + " next:" + next);
            next.slideDown();
          } else {
            _ref = section.find('.validate');
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              f = _ref[_i];
              field = $(f);
              if (!field.hasClass('valid')) {
                field.next('ul').slideDown();
                field.addClass('invalid');
              }
            }
          }
        }
        return false;
      });
      return false;
    },
    watchRequiredInputs: function(self) {
      var inputs;
      inputs = "input.validate, textarea.validate";
      $("select.validate").on('change', function(e) {
        return self.validate($(this), self);
      });
      $(inputs).on('keyup', function(e) {
        return self.validate($(this), self);
      });
      $(inputs).on('blur', function(e) {
        return self.validate($(this), self);
      });
      return false;
    },
    validate: function(field, self) {
      var errs, ul;
      ul = field.next('ul.errors');
      errs = 0;
      if (field.data('validate-presence')) {
        errs += self.feedback('presence', field, ul);
      }
      if (field.data('validate-email')) errs += self.feedback('email', field, ul);
      if (errs > 0) {
        ul.slideDown();
        field.addClass('invalid');
        field.removeClass('valid');
      } else {
        ul.slideUp();
        field.addClass('valid');
        field.removeClass('invalid');
      }
      return false;
    },
    feedback: function(type, field, ul) {
      var err, li, self;
      self = this;
      li = ul.find("li." + type).first();
      if (Validate[type](field)) {
        li.slideUp();
        err = 0;
      } else {
        li.show();
        err = 1;
      }
      return err;
    },
    isValid: function(section) {
      var r, v;
      r = section.find('.validate').size();
      v = section.find('.valid').size();
      return r === v;
    },
    getIdNum: function(section) {
      return parseInt(section.data('step'));
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
