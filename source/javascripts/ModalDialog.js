

// Simple modal dialog. Requires jQuery. Treats IE 6 as special, and uses an iframe layer for it to inhibit
// bleed-through of things like select elements.
//
// M. A. Sridhar, April 3, 2008

function ModalDialog (boxSpec) {


    // Configuration constants
    var OVERLAY_ELEMENT_ID = "s--modalbox-overlay";
    var OVERLAY_Z_INDEX    = 20;
    var OVERLAY_OPACITY    = 0.9;
    
    var _boxSpec = boxSpec;

    function getViewport() {
        return {
            x: window.pageXOffset || document.documentElement && document.documentElement.scrollLeft || document.body.scrollLeft,
            y: window.pageYOffset || document.documentElement && document.documentElement.scrollTop || document.body.scrollTop,
            w: window.innerWidth  || document.documentElement && document.documentElement.clientWidth || document.body.clientWidth,
            h: window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body.clientHeight
        };
    };

    var styleStr = "top: 0; left: 0; z-index: " + OVERLAY_Z_INDEX + "; display: none;background-color: #fff;";
    var vp = getViewport();
    var overlayHTML = null;
    var sizeSpec = "width: 100%; height: 100%;";
    if (jQuery.browser.msie && (jQuery.browser.version < 7)) {
        sizeSpec = "width:" + (vp.x + vp.w) + "px;height:" +  Math.max(vp.y + vp.h,jQuery(document.body).height()) + "px;";
        styleStr += "filter: alpha(opacity=" + ( (100*OVERLAY_OPACITY)) + ");position: absolute;" + sizeSpec;
        overlayHTML = "<iframe  id='" + OVERLAY_ELEMENT_ID + "' style='" + styleStr + "'></iframe>";
    } else {
        styleStr += "position:fixed; opacity: " + OVERLAY_OPACITY + ";" + sizeSpec;
        overlayHTML = "<div src='javascript:false' id='" + OVERLAY_ELEMENT_ID + "' style='" + styleStr + "'></div>";
    }
    jQuery("body").append (overlayHTML);
    var overlayElt = jQuery("#" + OVERLAY_ELEMENT_ID);
    if (jQuery.browser.msie && (jQuery.browser.version < 7)) {
        var eltDoc = document.getElementById (OVERLAY_ELEMENT_ID).contentWindow.document;
        eltDoc.open();
        eltDoc.write ("<html><body style='background-color: white; filter:alpha(opacity=" + (100*OVERLAY_OPACITY) + ");'></body></html>");
        eltDoc.close();
    }

    /**
     * Public method to show this dialog.
     */
    this.show =  function () {
        var vp = getViewport();
        var box = $(_boxSpec);
        box.css ({zIndex: OVERLAY_Z_INDEX+1, top: (vp.y + (vp.h - box.height())/2) + "px",  left: (vp.x + (vp.w - box.width())/2) + "px"});
        overlayElt.fadeIn(250);
        box.fadeIn(400);
    };

    /**
     * Public method to hide this dialog.
     */
    this.hide = function () {
        overlayElt.fadeOut(400);
        $(_boxSpec).fadeOut(250);
    };
};

