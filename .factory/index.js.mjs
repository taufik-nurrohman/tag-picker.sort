import {MultiDrag, Sortable} from 'sortablejs';
import {W, getChildren, getElements, getNext, setClass} from '@taufik-nurrohman/document';
import {isFunction} from '@taufik-nurrohman/is';
import {toCount} from '@taufik-nurrohman/to';

const name = 'TagPicker.Sort';
const references = new WeakMap;

Sortable.mount(new MultiDrag);

const {utils} = Sortable;

// Some of the sortable code tweak(s) were taken from <https://github.com/SortableJS/Sortable/issues/347#issuecomment-93726446>

function getReference(key) {
    return references.get(key);
}

function onDeselect() {

}

function onEnd(e) {
    let t = this,
        selectedClass = t.option('selectedClass'),
        {item, items} = e;
    W.setTimeout(() => {
        if (toCount(items)) {
            items.forEach(item => setClass(item, selectedClass));
        }
        setClass(item, selectedClass).focus();
    }, 0);
}

function onMove(e) {
    let t = this,
        {_excludes, _excludesPositions} = t,
        freeze = false, vector;
    W.clearTimeout(t._move);
    t._move = W.setTimeout(() => {
        let list = e.to;
        _excludes.forEach((v, k) => {
            let i = _excludesPositions[k];
            if (v !== getChildren(list, i)) {
                let j = utils.index(v);
                list.insertBefore(v, getChildren(list, i + (j < i)));
            }
        });
    }, 0);
    _excludes.forEach((v, k) => {
        if (v === e.related) {
            freeze = true;
        }
        if (v === getNext(e.related) && e.relatedRect.top < e.draggedRect.top) {
            vector = -1;
        }
    });
    return freeze ? false : vector;
}

function onSelect() {

}

function onSort(e) {
    let t = this,
        picker = t._picker,
        {item, items} = e;
    picker.fire('sort.tag' + (items ? 's' : ""), [toCount(items) ? items.map(v => v.title) : item.title]).fire('change', toCount(items) ? [] : [item.title]);
}

function onStart(e) {
    let t = this,
        excludes = [].slice.call(getElements(t.option('filter'), t.el)),
        excludesPositions = excludes.map(v => utils.index(v)),
        picker = t._picker;
    t._excludes = excludes;
    t._excludesPositions = excludesPositions;
    t._move = null;
    setClass(e.item, t.option('selectedClass'));
}

function setReference(key, value) {
    return references.set(key, value);
}

function attach() {
    const $ = this;
    const $$ = $.constructor.prototype;
    !isFunction($$.reverse) && ($$.reverse = function () {
        let $ = this,
            {_active} = $;
        if (!_active) {
            return $;
        }
    });
    !isFunction($$.sort) && ($$.sort = function (method) {
        let $ = this,
            {_active} = $;
        if (!_active) {
            return $;
        }
    });
    let {_mask, self, state} = $,
        {tags} = _mask,
        {n} = state;
    const sortable = new Sortable(tags, {
        animation: 150,
        avoidImplicitDeselect: false,
        dataIdAttr: 'title',
        fallbackOnBody: true,
        fallbackTolerance: 3,
        filter: '.' + n + '__text',
        forceFallback: true,
        multiDrag: true,
        multiDragKey: 'ctrl',
        onDeselect,
        onEnd,
        onMove,
        onSelect,
        onSort,
        onStart,
        selectedClass: n + '__tag--selected',
    });
    sortable._picker = $;
    setReference(self, sortable);
    return $;
}

function detach() {
    let $ = this,
        sortable = getReference($.self);
    sortable && sortable.destroy();
}

export default {attach, detach, name};