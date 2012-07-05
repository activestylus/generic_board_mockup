changeUrl = ->
  document.location.href = document.getElementById("choose_language").value
Array::chunk = (chunkSize) ->
  array = this
  [].concat.apply [], array.map((elem, i) ->
    (if i % chunkSize then [] else [ array.slice(i, i + chunkSize) ])
  )
Array::clean = (deleteValue) ->
  i = 0
  while i < @length
    if this[i] is deleteValue
      @splice i, 1
      i--
    i++
  this
Array::has = (v) ->
  i = 0
  while i < @length
    return i  if this[i] is v
    i++
  false

FileNav = init: ->
  target = $("#file-nav .togglee")
  $("#file-nav").bind "clickoutside", (event) ->
    if target.is(":visible")
      target.hide "slide"
      $("#file-nav .toggler").toggleClass "open"

  $("#head").bind "inview", (event, visible, topOrBottomOrBoth) ->
    if visible is true
      if topOrBottomOrBoth is "top"

      else $("#file-nav").removeClass "light"  unless topOrBottomOrBoth is "bottom"
    else
      $("#file-nav").addClass "light"

SlideShow = init: ->
  logos = $("#slideshow")
  logos.jcarousel wrap: "circular"
  $("#slide-left").click ->
    logos.jcarousel "scroll", "-=3"
    false

  $("#slide-right").click ->
    logos.jcarousel "scroll", "+=3"
    false

  setInterval (->
    logos.jcarousel "scroll", "+=3"
  ), 8000

Selections = init: ->
  $("#select-all").click ->
    select = $(this)
    checks = $("table#select").find("td input[type=checkbox]")
    $.each checks, ->
      if select.is(":checked")
        $(this).attr "checked", true
      else
        $(this).attr "checked", false

Toggler = init: ->
  $(".toggler").click ->
    div = $(this).next(".togglee")
    if div.is(":hidden")
      div.slideDown()
    else
      div.slideUp()
    $(this).toggleClass "open"
    false

AdvancedSearch = init: ->
  $("#advanced_search").hide()
  $("#toggle_advanced_search").click ->
    self = $(this)
    div = $("#advanced_search")
    if div.is(":hidden")
      div.slideDown()
    else
      div.slideUp()
    self.toggleClass "open"
    if self.hasClass("open")
      self.html "Fewer options"
    else
      self.html "Search more options"
    false

DropDownMenu = init: ->
  $(".dropdown").bind "clickoutside", (event) ->
    $(this).find(".dropdown-menu").slideUp()
    $(this).find(".dropdown-toggle").toggleClass "open"

  $(".dropdown-toggle").click ->
    div = $(this).next(".dropdown-menu")
    if div.is(":hidden")
      div.slideDown()
    else
      div.slideUp()

HoverScroll = init: ->
  api = $(".scroll-pane").jScrollPane(showArrows: true).data("jsp")
  $(".hoverscroll.down").bind "mouseover", ->
    scrollInterval = undefined
    link = $(this)
    doScroll = ->
      api.scrollByY 5

    link.bind "mouseout.demo", ->
      clearInterval scrollInterval
      link.unbind "mouseout.demo"

    doScroll()
    scrollInterval = setInterval(doScroll, 50)

  $(".hoverscroll.up").bind "mouseover", ->
    scrollInterval = undefined
    link = $(this)
    doScroll = ->
      api.scrollByY -5

    link.bind "mouseout.demo", ->
      clearInterval scrollInterval
      link.unbind "mouseout.demo"

    doScroll()
    scrollInterval = setInterval(doScroll, 50)

ModalWindow = init: ->
  dialog = new ModalDialog("#modal")
  closers = [ "#s--modalbox-overlay", "#btn-close" ]
  $("#modal-trigger").click ->
    dialog.show()
    false

  $.each closers, (i, id) ->
    $(id).on "click", ->
      dialog.hide()
      false

Dom =
  addText: (node, txt) ->
    node.appendChild document.createTextNode(txt)
    false

  copyAttributes: (elem, copy) ->
    i = 0
    attrs = elem.attributes
    while i < attrs.length
      copy.setAttribute attrs[i].name, attrs[i].value
      i++

  insertAfter: (node, newNode) ->
    node.parentNode.insertBefore newNode, node.nextSibling

  cleanText: (str) ->
    str.replace("&amp;", "").replace("/","").replace("&", "").replace("-", "").replace("–", "").replace "[x]", ""

MultiLevelSelect =
  init: ->
    @cloneSelects()
    @createParentMenus this
    @createChildMenus this
    @watchTogglers()
    @watchParentLinks this
    @watchChildLinks this
    @watchTokenRemovers this
    @togglePopups()
    false

  cloneSelects: ->
    $.each $("select.pop-menu"), (i, elem) ->
      fragment = document.createDocumentFragment()
      input = document.createElement("input")
      input.setAttribute "type", "hidden"
      Dom.copyAttributes elem, input
      fragment.appendChild input
      Dom.insertAfter elem, fragment

    false

  createParentMenus: (self) ->
    $.each $("select.pop-menu.parent"), (i, elem) ->
      hash = self.selectToHash(elem)
      list = hash["industries"]
      chunk = self.getChunk(elem, list)
      html = self.createHtmlMenu("industries", list, chunk, "parent")
      label = document.createElement("div")
      label.setAttribute "class", "pop-parent-label"
      Dom.insertAfter elem, label
      Dom.insertAfter elem, html
      self.createToggler elem, "#pop-industries", "parent"
      elem.parentNode.removeChild elem

    false

  createChildMenus: (self) ->
    $.each $("select.pop-menu.child"), (i, elem) ->
      hash = self.selectToHash(elem)
      $.each hash, (key, value) ->
        list = hash[key]
        chunk = self.getChunk(elem, list)
        html = self.createHtmlMenu((i++ + 1), list, chunk, "child")
        Dom.insertAfter elem, html

      fragment = document.createDocumentFragment()
      tokens = document.createElement("div")
      tokens.setAttribute "class", "pop-tokens"
      fragment.appendChild tokens
      Dom.insertAfter elem, fragment
      self.createToggler elem, ("#pop-" + (i + 1)), "child"
      elem.parentNode.removeChild elem

    false

  createToggler: (elem, href, type) ->
    fragment = document.createDocumentFragment()
    link = document.createElement("a")
    name = elem.getAttribute("data-name")
    link.setAttribute "href", href
    link.setAttribute "class", ("pop-toggler btn btn-go " + type)
    Dom.addText link, name
    fragment.appendChild link
    Dom.insertAfter elem, fragment
    false

  toggleChildSelections: (self, link, inputDom, selected) ->
    input = $(inputDom)
    values = input.val().split(",")
    newVal = link.attr("title")
    tokens = input.parent().find(".pop-tokens").first()
    if selected
      values.pop newVal
      self.removeHtmlToken input, newVal
    else if $.inArray(newVal, values) is -1
      values.push newVal
      tokens.append self.createHtmlToken(newVal)
    values.clean ""
    input.val values.clean("").join(",")
    false

  createHtmlToken: (value) ->
    fragment = document.createDocumentFragment()
    wrap = document.createElement("span")
    close = document.createElement("a")
    wrap.setAttribute "class", "pop-token"
    close.setAttribute "class", "pop-token-remove"
    close.setAttribute "title", value
    close.setAttribute "href", "#"
    Dom.addText close, "[x]"
    Dom.addText wrap, value
    wrap.appendChild close
    wrap

  removeHtmlToken: (input, value) ->
    for token in input.parent().find(".pop-token")
      source = Dom.cleanText $(token).text()
      target = Dom.cleanText value
      if source is target
        token.parentNode.removeChild(token) 

  watchTokenRemovers: (self) ->
    $(document).on "click", "a.pop-token-remove", ->
      link = $(this)
      input = link.closest(".pop-tokens").parent().find("input.pop-menu.child").first()
      links = input.parent().find("div.popup-menu a")
      self.toggleChildSelections self, link, input.get(0), true
      $.each links, (i, a) ->
        $(a).removeClass "selected"  if link.attr("title") is a.getAttribute("title")
      link.parent().remove()
      unless Validate.presence(input)
        ValidateFormSections.disableStep(2)
      false

  watchChildLinks: (self) ->
    $(".pop.child").find("a").on "click", (e) ->
      link = $(this)
      wrap = link.closest(".pop.child").parent()
      input = wrap.find("input.pop-menu.child")
      selected = link.hasClass("selected")
      link.toggleClass "selected"
      self.toggleChildSelections self, link, input, selected
      if Validate.presence(input)
        ValidateFormSections.enableStep(2)
      else
        ValidateFormSections.disableStep(2)
      false
    false

  watchParentLinks: (self) ->
    $(".pop.parent").find("a").on "click", (e) ->
      link = $(this)
      wrap = link.closest(".pop.parent").parent()
      href = link.attr("href")
      toggler = wrap.find("a.pop-toggler.child")
      input = wrap.find("input.pop-menu.parent")
      child = wrap.find("input.pop-menu.child")
      label = wrap.parent().find(".pop-parent-label").first()
      child.val ""
      toggler.attr "href", href
      input.val link.attr("title")
      self.activateParentToken wrap, label, link
      false

    false

  activateParentToken: (wrap, label, link) ->
    wrap.parent().find(".pop-tokens").first().html ""
    link.closest(".parent").find(".child .pop-menu a").removeClass "selected"
    wrap.parent().find(".pop-toggler.child").fadeIn()
    label.addClass "active"
    label.animate opacity: 1
    label.text link.attr("title")

  watchTogglers: ->
    $("a.pop-toggler").on "click", (e) ->
      div = $($(this).attr("href"))
      $(".pop").fadeOut()
      if div.is(":hidden")
        div.slideDown()
      else
        div.slideUp()
      false

  selectToHash: (elem) ->
    hash = {}
    name = elem.getAttribute("data-name")
    if elem.getAttribute("class").match(/parent/)
      opts = []
      $.each elem.getElementsByTagName("option"), (i, option) ->
        opts.push option.value

      hash["industries"] = opts
    else
      $.each elem.getElementsByTagName("optgroup"), (i, group) ->
        opts = []
        label = group.getAttribute("label")
        $.each group.getElementsByTagName("option"), (i, option) ->
          opts.push option.value

        hash[label] = opts
    hash

  getChunk: (elem, list) ->
    chunk = parseInt(elem.getAttribute("data-columns"))
    result = ~~(list.length / chunk) + 1
    result

  createHtmlMenu: (id, list, inGroupsOf, relation) ->
    fragment = document.createDocumentFragment()
    togglee = document.createElement("div")
    wrap = document.createElement("div")
    popup = document.createElement("div")
    uls = []
    togglee.setAttribute "class", ("pop " + relation)
    togglee.setAttribute "id", ("pop-" + id)
    wrap.setAttribute "class", "menu-wrap"
    popup.setAttribute "class", "popup-menu"
    $.each list.chunk(inGroupsOf), (i, items) ->
      ul = document.createElement("ul")
      $.each items, (j, item) ->
        li = document.createElement("li")
        link = document.createElement("a")
        link.setAttribute "href", ("#pop-" + (i++ + 1))
        link.setAttribute "title", item
        Dom.addText link, item
        li.appendChild link
        ul.appendChild li
      uls.push ul
    $.each uls, (i, ul) ->
      popup.appendChild ul
    wrap.appendChild popup
    togglee.appendChild wrap
    fragment.appendChild togglee
    fragment

  togglePopups: ->
    $(".popup-menu").bind "clickoutside", (event) ->
      $(this).parent().parent().fadeOut()  if $(this).is(":visible")

    $(".popup-menu").find("a").on "click", (e) ->
      self = $(this)
      div = self.parent().parent().parent()
      target = $(div.attr("data-target"))
      div.parent().parent().fadeOut()  if self.closest(".pop").hasClass("parent")
      target.text self.text()
      false

PrintPage = init: ->
  if $("a#print-me")
    $("a#print-me").click ->
      window.print()
      false

Validate =
  email: (field)->
    matches = field.val().match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)
    !(matches is null) and matches.length > 0
  presence: (field)->
    !(field.val() is "")
  

ValidateFormSections =
  init: ->
    @markValidFields()
    @addStepButtons()
    @hideSections(this)
    @addValidationsFor(this)
    @watchStepButtons(this)
    @watchRequiredInputs(this)
    false
  
  markValidFields: ->
    for f in $('.validate')
      f = $(f)
      errs = 0
      if f.data('validate-presence') and !Validate.presence(f)
        errs++
      if f.data('validate-email') and !Validate.email(f)
        errs++
      if errs is 0
        f.addClass('valid')
    false

  hideSections: (self)->
    for n in [2,3]
      step = $("[data-step=#{n}]")
      prev = $("[data-step=#{n-1}]")
      unless self.isValid(step) or self.isValid(prev)
        step.hide()
    input = $(".pop-menu.child.multi")
    if !Validate.presence(input)
      self.disableStep(2)
    else
      self.enableStep(2)
    false

  enableStep: (n)->
    step = $("#step#{n}-fields")
    next = step.closest('.section').find('a.next')
    step.removeClass('disabled')
    step.find('input,textarea,select').prop('disabled',false)
    next.removeClass('disabled')
    false

  disableStep: (n)->
    step = $("#step#{n}-fields")
    next = step.closest('.section').find('a.next')
    step.addClass('disabled')
    step.find('input,textarea,select').prop('disabled',true)
    next.addClass('disabled')
    false
  
  addStepButtons: ->
    for step in $(".steps .section")
      #$(step).append("<a href='#' class='previous btn btn-large btn-go'>Previous Step</a>")
      unless $(step).data("step") is 3
        $(step).append("<a href='#' class='next cf btn btn-large btn-go'>Continue</a>")
    false

  addValidationsFor: (self)->
    for f in $('.validate')
      field  = $(f)
      field.wrap("<div class='validated-field' />")
      ul = $(document.createElement("ul"))
      ul.attr 'class', 'errors'
      div = field.closest('validated-field')
      errors = {}
      if field.data('validate-presence')
        errors['presence'] = field.data('validate-presence')
      if field.data('validate-email')
        errors['email'] = field.data('validate-email')
      for type, msg of errors
        li = $(document.createElement "li")
        li.html msg
        li.addClass type
        ul.append li
      unless $.isEmptyObject errors
        ul.hide()
        ul.insertAfter field
    false

  watchStepButtons: (self)->
    $('a.next').click ->
      unless $(this).hasClass 'disabled'
        section = $(this).closest '.section'
        current = self.getIdNum section
        next    = $("[data-step=#{current + 1}]")
        #console.log(self.isValid(section))
        if self.isValid section
          console.log "current:#{current} next:#{next}"
          next.slideDown()
        else
          for f in section.find('.validate')
            field = $(f)
            unless field.hasClass 'valid'
              field.next('ul').slideDown()
              field.addClass 'invalid'
      
      #if next is 2 and badFields is not 0        
      #  $("#step-3").slideUp()
      # if invalidFields == 0
      #   $("#step-#{next}").slideDown()
      # else
      #   self.showInvalidFieldsFor(section)
      # else
      #   if next is 2
      #     $("#step-2").slideUp()
      #     $("#step-3").slideUp()
      #   else
      #     $("#step-#{next}").slideUp()
      false
    false

  watchRequiredInputs: (self)->
    inputs = "input.validate, textarea.validate"
    $("select.validate").on 'change', (e)->
      self.validate $(this), self
    $(inputs).on 'keyup', (e)->
      self.validate $(this), self
    $(inputs).on 'blur', (e)->
      self.validate $(this), self
    false
  
  validate: (field, self)->
    ul = field.next('ul.errors')
    errs = 0
    if field.data('validate-presence')
      errs += self.feedback('presence', field, ul)
    if field.data('validate-email')
      errs += self.feedback('email', field, ul)
    if errs > 0
      ul.slideDown()
      field.addClass 'invalid'
      field.removeClass 'valid'
    else
      ul.slideUp()
      field.addClass 'valid'
      field.removeClass 'invalid'
    false

  feedback: (type, field, ul)->
    self = this
    li = ul.find("li.#{type}").first()
    if Validate[type](field)
      li.slideUp()
      err = 0
    else
      li.show()
      err = 1
    return err
  
  isValid: (section)->
    r = section.find('.validate').size()
    v = section.find('.valid').size()
    r is v
    
  getIdNum: (section)->
    parseInt section.data('step')

  # showNext: (self, input)->
  #   section = input.closest('.section')
  #   current = self.getIdNum(section)
  #   next    = current + 1
  #   badFields = 0
  #   for i in section.find("input[data-validate-presence]","select[data-validate-presence]")
  #     badFields++ if $(i).val() is ""
  #   unless next is 4
  #     if next is 2 and badFields is not 0        
  #       $("#step-3").slideUp()
  #     if badFields == 0
  #       $("#step-#{next}").slideDown()
  #     else
  #       if next is 2
  #         $("#step-2").slideUp()
  #         $("#step-3").slideUp()
  #       else
  #         $("#step-#{next}").slideUp()

  #  false

$ ->
  PrintPage.init()
  MultiLevelSelect.init()
  SlideShow.init()
  AdvancedSearch.init()
  DropDownMenu.init()
  FileNav.init()
  HoverScroll.init()
  ModalWindow.init()
  Selections.init()
  Toggler.init()
  ValidateFormSections.init()