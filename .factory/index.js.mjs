import {B, D, getElements, getNext, getParent, getPrev, getStyle, hasClass, letElement, letID, letStyle, letStyles, setChildLast, setNext, setPrev, setStyle, setStyles, setValue} from '@taufik-nurrohman/document';
import {delay} from '@taufik-nurrohman/tick';
import {forEachArray, forEachMap, getReference, getValueInMap, letReference, setReference, setValueInMap} from '@taufik-nurrohman/f';
import {getRect} from '@taufik-nurrohman/rect';
import {isFunction} from '@taufik-nurrohman/is';
import {offEvent, offEventDefault, onEvent} from '@taufik-nurrohman/event';
import {toCount} from '@taufik-nurrohman/to';

const animations = {};
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
            {_mask, _tags, state, value} = $,
            {flex} = _mask,
            {join} = state;
        sortAnimationStart(_tags, flex);
        value = value.split(join).reverse();
        $.value = value.join(join);
        sortAnimationEnd(_tags, 150);
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
            {_mask, _tags, state, value} = $,
            {flex} = _mask,
            {join} = state, v;
        v = value;
        value = value.split(join).sort(method);
        if (v !== value.join(join)) {
            sortAnimationStart(_tags, flex);
            $.value = value.join(join);
            sortAnimationEnd(_tags, 150);
            return $.fire('sort.tags', [value]);
        }
        return $;
    });
    return $.on('let.tag', onLetTag).on('set.tag', onSetTag);
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
    return $.off('let.tag', onLetTag).off('set.tag', onSetTag);
}

let copy, left, rect, top,
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
    letID(copy = $.cloneNode(true));
    rect = getRect($);
    setReference(copy, $);
    setStyle($, 'visibility', 'hidden');
    setStyles(copy, {
        'height': rect[3],
        'left': rect[0],
        'pointer-events': 'none',
        'position': 'fixed',
        'top': rect[1],
        'transform': false,
        'transition': false,
        'width': rect[2],
        'z-index': 9999
    });
    setChildLast(B, copy);
    let current = $, parent;
    while (parent = getParent(current)) {
        setStyles(current = parent, {
            'cursor': 'move',
            'overflow': 'hidden'
        });
        if (B === current) {
            break;
        }
    }
}

function onPointerMoveDocument(e) {
    if (!copy) {
        return;
    }
    offEventDefault(e);
    let copyOf = getReference(copy),
        picker = getReference(copyOf),
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
    translate(copy, x, y);
    if (current && current !== copyOf && flex === getParent(current)) {
        rect = getRect(current);
        setStyle(current, 'transition', 'transform 150ms');
        if (isBefore(copyOf, current)) {
            translate(current, rect[2], 0);
            delay((copyOf, current) => {
                letStyles(current, ['transform', 'transition']);
                setPrev(current, copyOf);
            }, 150)(copyOf, current);
        } else {
            translate(current, -rect[2], 0);
            delay((copyOf, current) => {
                letStyles(current, ['transform', 'transition']);
                setNext(current, copyOf);
            }, 150)(copyOf, current);
        }
    }
}

function onPointerUpDocument(e) {
    offEvent(EVENT_MOUSE_MOVE, D, onPointerMoveDocument);
    offEvent(EVENT_MOUSE_UP, D, onPointerUpDocument);
    offEvent(EVENT_TOUCH_END, D, onPointerUpDocument);
    offEvent(EVENT_TOUCH_MOVE, D, onPointerMoveDocument);
    if (copy) {
        let current, parent, picker, value;
        letStyle(current = getReference(copy), 'visibility');
        picker = getReference(current);
        value = current.value;
        while (parent = getParent(current)) {
            letStyles(current = parent, ['cursor', 'overflow']);
            if (B === current) {
                break;
            }
        }
        letReference(copy), letElement(copy);
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
    copy = x = y = 0;
}

function onLetTag(name) {
    let $ = this,
        at = $.tags.at(name);
    if (at = at && at[2]) {
        letReference(at, $);
        offEvent(EVENT_MOUSE_DOWN, at, onPointerDownTag);
        offEvent(EVENT_TOUCH_START, at, onPointerDownTag);
    }
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

function sortAnimationEnd(_tags, duration) {
    forEachMap(_tags, v => {
        let copy = animations[v[2].value],
            r = getRect(v[2]);
        delay((copy, v) => {
            letElement(copy);
            letStyle(v[2], 'visibility');
        }, duration)(copy, v);
        setStyle(v[2], 'visibility', 'hidden');
        setStyle(copy, 'transition-duration', duration + 'ms');
        translate(copy, r[0], r[1]);
    });
}

function sortAnimationStart(_tags, flex) {
    forEachMap(_tags, v => {
        let copy = letID(v[2].cloneNode(true)),
            r = getRect(v[2]);
        animations[v[2].value] = copy;
        setStyles(copy, {
            'height': r[3],
            'left': 0,
            'position': 'fixed',
            'top': 0,
            'transition': 'transform 0s',
            'width': r[2],
            'z-index': 9999,
        }), translate(copy, r[0], r[1]);
        setChildLast(flex, copy);
    });
}

function translate(node, x, y) {
    setStyle(node, 'transform', 'translate(' + x + 'px,' + y + 'px)');
}

export default {attach, detach, name};