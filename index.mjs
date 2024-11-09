import {W, getChildren, getElements, getNext, getParent, letStyle, setChildLast, setClass, setStyle} from '@taufik-nurrohman/document';
import {isFunction} from '@taufik-nurrohman/is';
import {toCount} from '@taufik-nurrohman/to';

const name = 'TagPicker.Sort';
const references = new WeakMap;

function createSortable($, onEnd, onMove, onSort, onStart) {
    let {_mask, state} = $,
        {n} = state,
        {tags} = _mask,
        Sortable = $.constructor.$.Sortable || W.Sortable;
    let n_tag_ = n += '__tag--';
    return new Sortable(tags, {
        animation: 150,
        chosenClass: n_tag_ + 'select',
        dataIdAttr: 'title',
        dragClass: n_tag_ + 'move',
        filter: '.' + n + '__text',
        forceFallback: true,
        ghostClass: n_tag_ + 'ghost',
        onEnd,
        onMove,
        onSort,
        onStart,
        selectedClass: n_tag_ + 'selected'
    });
}

function getReference(key) {
    return references.get(key);
}

function letReference(key) {
    return references.delete(key);
}

function onEnd(e) {
    let {from, to} = e;
    from && letStyle(from, 'cursor');
    to && letStyle(to, 'cursor');
}

function onLetTag() {
    let $ = this,
        sortable = getReference($);
    sortable && sortable.destroy();
    sortable = createSortable($, onEnd, onMove, onSort, onStart);
    sortable._picker = $;
    setReference($, sortable);
}

function onMove(e) {
    let t = this,
        picker = t._picker,
        {_active, _mask} = picker,
        {text} = _mask;
    if (!_active) {
        return;
    }
    return e.related !== text;
}

function onSort(e) {
    let t = this, v,
        picker = t._picker,
        {_active, _mask, self, state} = picker,
        {tags} = _mask,
        {item} = e;
    if (!_active) {
        return;
    }
    let _tags = t.toArray().slice(0, -1); // All but the last item (the `.tag-picker__text` item)
    self.value = _tags.join(state.join);
    picker.fire('sort.tag', [v = item.title]).fire('change', [v]);
    picker.value = picker.value; // Refresh!
    letStyle(tags, 'cursor');
}

function onStart(e) {
    let t = this,
        picker = t._picker,
        {_active} = picker,
        {from, to} = e;
    if (!_active) {
        return;
    }
    from && setStyle(from, 'cursor', 'move');
    to && setStyle(to, 'cursor', 'move');
}

function setReference(key, value) {
    return references.set(key, value);
}

function attach() {
    const $ = this;
    const $constructor = $.constructor;
    const $$ = $constructor.prototype;
    $constructor.$ = $constructor.$ || {};
    !isFunction($$.reverse) && ($$.reverse = function () {
        let $ = this,
            sortable = getReference($),
            {_active, self, state} = $,
            {join} = state;
        if (!_active) {
            return $;
        }
        let tags = sortable.toArray(),
            text = tags.pop();
        tags = tags.reverse();
        self.value = tags.join(join);
        return sortable.sort(tags.concat(text), true), $.fire('sort.tags', [tags]);
    });
    !isFunction($$.sort) && ($$.sort = function (method) {
        let $ = this,
            sortable = getReference($),
            {_active, self, state} = $,
            {join} = state;
        if (!_active) {
            return $;
        }
        method = (method || function (a, b) {
            return a.localeCompare(b, undefined, {
                numeric: true,
                sensitivity: 'base'
            });
        }).bind($);
        let tags = sortable.toArray(),
            text = tags.pop();
        tags = tags.sort(method);
        self.value = tags.join(join);
        return sortable.sort(tags.concat(text), true), $.fire('sort.tags', [tags]);
    });
    let sortable = createSortable($, onEnd, onMove, onSort, onStart);
    sortable._picker = $;
    setReference($, sortable);
    return $.on('let.tag', onLetTag);
}

function detach() {
    let $ = this,
        sortable = getReference($);
    sortable && sortable.destroy();
    letReference($);
    return $.off('let.tag', onLetTag);
}

export default {attach, detach, name};