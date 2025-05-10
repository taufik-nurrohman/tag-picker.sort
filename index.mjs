import {B, D, getNext, getParent, getPrev, getStyle, hasClass, letElement, letID, letStyle, setChildLast, setNext, setPrev, setStyle, setStyles} from '@taufik-nurrohman/document';
import {forEachMap, getReference, letReference, setReference} from '@taufik-nurrohman/f';
import {isFunction} from '@taufik-nurrohman/is';
import {offEvent, offEventDefault, onEvent} from '@taufik-nurrohman/event';
import {toCount} from '@taufik-nurrohman/to';

const name = 'TagPicker.Sort';

function attach(self, state) {
    let $ = this,
        $$ = $.constructor._,
        {_mask, _tags} = $;
    forEachMap(_tags, v => {
        onEvent('mousedown', v[2], onPointerDownTag);
    });
    !isFunction($$.reverse) && ($$.reverse = function () {

    });
    !isFunction($$.sort) && ($$.sort = function () {

    });
}

function detach() {
    let $ = this,
        {_tags} = $;
}

let clone,
    rect,
    startLeft,
    startTop,
    x = 0,
    y = 0;

function isBefore(a, b) {
    let c;
    for (c = a.previousSibling; c; c = c.previousSibling) {
        if (c === b) {
            return 1;
        }
    }
    return 0;
}

function onPointerDownTag(e) {
    onEvent('mousemove', D, onPointerMoveDocument);
    onEvent('mouseup', D, onPointerUpDocument);
    let $ = this;
    if ('touchstart' === e.type) {
        startLeft = e.touches[0].clientX - x;
        startTop = e.touches[0].clientY - y;
    } else {
        startLeft = e.clientX - x;
        startTop = e.clientY - y;
    }
    letID(clone = $.cloneNode(true));
    clone._ref = $;
    rect = $.getBoundingClientRect();
    setStyle($, 'visibility', 'hidden');
    setStyles(clone, {
        'height': rect.height + 'px',
        'left': rect.left + 'px',
        'pointer-events': 'none',
        'position': 'absolute',
        'top': rect.top + 'px',
        'width': rect.width + 'px',
        'z-index': 9999,
    });
    setChildLast(B, clone);
    let current = $, parent;
    while (parent = getParent(current)) {
        setStyle(current = parent, 'cursor', 'move');
        if (B === current) {
            break;
        }
    }
}

function onPointerMoveDocument(e) {
    if (!clone) {
        return;
    }
    offEventDefault(e);
    if (e.type === 'touchmove') {
        x = e.touches[0].clientX - startLeft;
        y = e.touches[0].clientY - startTop;
    } else {
        x = e.clientX - startLeft;
        y = e.clientY - startTop;
        let targetElement = D.elementFromPoint(e.clientX, e.clientY), parent;
        if (hasClass(targetElement, 'tag-picker__tag')) {} else if (parent = getParent(targetElement, '.tag-picker__tag')) {
            targetElement = parent;
        } else {
            targetElement = 0;
        }
        if (targetElement && targetElement !== clone._ref) {
            targetElement.parentNode.insertBefore(clone._ref, isBefore(clone._ref, targetElement) ? targetElement : targetElement.nextSibling);
        }
    }
    setTranslate(x, y, clone);
}

function onPointerUpDocument(e) {
    offEvent('mousemove', D, onPointerMoveDocument);
    offEvent('mouseup', D, onPointerUpDocument);
    if (clone) {
        letElement(clone);
        letStyle(clone._ref, 'visibility');
        let current = clone._ref, parent;
        while (parent = getParent(current)) {
            letStyle(current = parent, 'cursor');
            if (B === current) {
                break;
            }
        }
    }
    clone = x = y = 0;
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

export default {attach, detach, name};