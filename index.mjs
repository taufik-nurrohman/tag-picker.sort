import {B, D, getElements, getNext, getParent, getPrev, getStyle, hasClass, letElement, letID, letStyle, setChildLast, setNext, setPrev, setStyle, setStyles, setValue} from '@taufik-nurrohman/document';
import {forEachArray, forEachMap, getReference, getValueInMap, letReference, setReference, setValueInMap} from '@taufik-nurrohman/f';
import {getRect} from '@taufik-nurrohman/rect';
import {isFunction} from '@taufik-nurrohman/is';
import {offEvent, offEventDefault, onEvent} from '@taufik-nurrohman/event';
import {toCount} from '@taufik-nurrohman/to';

const name = 'TagPicker.Sort';

const EVENT_DOWN = 'down';
const EVENT_MOVE = 'move';
const EVENT_UP = 'up';

const EVENT_MOUSE = 'mouse';
const EVENT_MOUSE_DOWN = EVENT_MOUSE + EVENT_DOWN;
const EVENT_MOUSE_MOVE = EVENT_MOUSE + EVENT_MOVE;
const EVENT_MOUSE_UP = EVENT_MOUSE + EVENT_UP;
const EVENT_TOUCH = 'touch';
const EVENT_TOUCH_END = EVENT_TOUCH + 'end';
const EVENT_TOUCH_MOVE = EVENT_TOUCH + EVENT_MOVE;
const EVENT_TOUCH_START = EVENT_TOUCH + 'start';

function attach(self, state) {
    let $ = this,
        $$ = $.constructor._,
        {_mask, _tags} = $;
    forEachMap(_tags, v => {
        v = v[2];
        onEvent(EVENT_MOUSE_DOWN, v, onPointerDownTag);
        onEvent(EVENT_TOUCH_START, v, onPointerDownTag);
        setReference(v, $);
    });
    !isFunction($$.reverse) && ($$.reverse = function () {
        let $ = this,
            {state, value} = $,
            {join} = state;
        value = value.split(join).reverse();
        $.value = value.join(join);
        return $.fire('sort.tags', [value]);
    });
    !isFunction($$.sort) && ($$.sort = function (method) {
        method = (method || function (a, b) {
            return a.localeCompare(b, undefined, {
                numeric: true,
                sensitivity: 'base'
            });
        }).bind($);
        let $ = this,
            {state, value} = $,
            {join} = state;
        value = value.split(join).sort(method);
        $.value = value.join(join);
        return $.fire('sort.tags', [value]);
    });
    return $.on('set.tag', onSetTag);
}

function detach() {
    let $ = this,
        $$ = $.constructor._,
        {_tags} = $;
    forEachMap(_tags, v => {
        v = v[2];
        letReference(v, $);
        offEvent(EVENT_MOUSE_DOWN, v, onPointerDownTag);
        offEvent(EVENT_TOUCH_START, v, onPointerDownTag);
    });
    delete $$.reverse;
    delete $$.sort;
    return $.off('set.tag', onSetTag);
}

let clone, left, rect, top,
    x = 0,
    y = 0;

function isBefore(a, b) {
    let c;
    for (c = getPrev(a, 1); c; c = getPrev(c, 1)) {
        if (c === b) {
            return 1;
        }
    }
    return 0;
}

function onPointerDownTag(e) {
    offEventDefault(e);
    let $ = this,
        picker = getReference($),
        {state} = picker,
        {n} = state,
        {target, type} = e;
    if (hasClass(target, n + '__x') || getParent(target, '.' + n + '__x')) {
        return;
    }
    onEvent(EVENT_MOUSE_MOVE, D, onPointerMoveDocument);
    onEvent(EVENT_MOUSE_UP, D, onPointerUpDocument);
    onEvent(EVENT_TOUCH_END, D, onPointerUpDocument);
    onEvent(EVENT_TOUCH_MOVE, D, onPointerMoveDocument);
    if (EVENT_TOUCH_START === type) {
        e = e.touches[0];
    }
    left = e.clientX - x;
    top = e.clientY - y;
    letID(clone = $.cloneNode(true));
    rect = getRect($);
    setReference(clone, $);
    setStyle($, 'visibility', 'hidden');
    setStyles(clone, {
        'height': rect[3] + 'px',
        'left': rect[0] + 'px',
        'pointer-events': 'none',
        'position': 'fixed',
        'top': rect[1] + 'px',
        'width': rect[2] + 'px',
        'z-index': 9999
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
    let cloneOf = getReference(clone),
        picker = getReference(cloneOf),
        {_mask, state} = picker,
        {flex} = _mask,
        {n} = state, current, parent;
    if (EVENT_TOUCH_MOVE === e.type) {
        e = e.touches[0];
    }
    x = e.clientX - left;
    y = e.clientY - top;
    current = D.elementFromPoint(e.clientX, e.clientY);
    if (hasClass(current, n + '__tag')) {} else if (parent = getParent(current, '.' + n + '__tag')) {
        current = parent;
    } else {
        current = 0;
    }
    translate(x, y, clone);
    if (current && current !== cloneOf && flex === getParent(current)) {
        isBefore(cloneOf, current) ? setPrev(current, cloneOf) : setNext(current, cloneOf);
    }
}

function onPointerUpDocument(e) {
    offEvent(EVENT_MOUSE_MOVE, D, onPointerMoveDocument);
    offEvent(EVENT_MOUSE_UP, D, onPointerUpDocument);
    offEvent(EVENT_TOUCH_END, D, onPointerUpDocument);
    offEvent(EVENT_TOUCH_MOVE, D, onPointerMoveDocument);
    if (clone) {
        let current, parent, picker, value;
        letStyle(current = getReference(clone), 'visibility');
        picker = getReference(current);
        value = current.value;
        while (parent = getParent(current)) {
            letStyle(current = parent, 'cursor');
            if (B === current) {
                break;
            }
        }
        letReference(clone), letElement(clone);
        if (picker) {
            let map = new Map,
                {_mask, _tags, self, state} = picker,
                {flex} = _mask,
                {join} = state, key, values = [];
            forEachArray(getElements('data[value]', flex), v => {
                setValueInMap(key = v.value, _tags.at(key), map);
                values.push(key);
            });
            setValue(self, values.join(join));
            _tags.values = map;
            picker.fire('sort.tag', [value]);
        }
    }
    clone = x = y = 0;
}

function onSetTag(name) {
    let $ = this,
        at = $.tags.at(name);
    if (at = at && at[2]) {
        onEvent(EVENT_MOUSE_DOWN, at, onPointerDownTag);
        onEvent(EVENT_TOUCH_START, at, onPointerDownTag);
        setReference(at, $);
    }
}

function translate(x, y, node) {
    setStyle(node, 'transform', 'translate3d(' + x + 'px,' + y + 'px,0)');
}

export default {attach, detach, name};