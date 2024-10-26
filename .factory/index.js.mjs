import {W, getChildren, getElements, getNext, letStyle, setChildLast, setStyle} from '@taufik-nurrohman/document';
import {debounce} from '@taufik-nurrohman/tick';
import {isFunction} from '@taufik-nurrohman/is';
import {toCount} from '@taufik-nurrohman/to';

const bounce = debounce(picker => {
    let {_mask} = picker,
        {tags, text} = _mask;
    setChildLast(tags, text);
}, 0);

const name = 'TagPicker.Sort';
const references = new WeakMap;

const {utils} = Sortable;

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

function onMove(e) {
    bounce(this._picker);
}

function onSort(e) {
    let t = this, v,
        picker = t._picker,
        {_tags, self, state} = picker,
        {item} = e;
    let tags = t.toArray().slice(0, -1); // All but the last item (the `.tag-picker__text` item)
    self.value = tags.join(state.join);
    picker.fire('sort.tag', [v = item.title]).fire('change', [v]);
    picker.value = picker.value; // Refresh!
}

function onStart(e) {
    let {from, to} = e;
    from && setStyle(from, 'cursor', 'move');
    to && setStyle(to, 'cursor', 'move');
}

function setReference(key, value) {
    return references.set(key, value);
}

function attach() {
    const $ = this;
    const $$ = $.constructor.prototype;
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
    let {_mask, state} = $,
        {tags} = _mask,
        {n} = state;
    let n_tag_ = n + '__tag--';
    const sortable = new Sortable(tags, {
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
    sortable._picker = $;
    setReference($, sortable);
    return $;
}

function detach() {
    let $ = this,
        sortable = getReference($);
    letReference($);
    sortable && sortable.destroy();
}

export default {attach, detach, name};