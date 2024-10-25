/*!
 *
 * The MIT License (MIT)
 *
 * Copyright © 2024 Taufik Nurrohman <https://github.com/taufik-nurrohman>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
(function (g, f) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = f() : typeof define === 'function' && define.amd ? define(f) : (g = typeof globalThis !== 'undefined' ? globalThis : g || self, (g.TagPicker = g.TagPicker || {}, g.TagPicker.Sort = f()));
})(this, (function () {
    'use strict';
    var isFunction = function isFunction(x) {
        return 'function' === typeof x;
    };
    var isNumber = function isNumber(x) {
        return 'number' === typeof x;
    };
    var toCount = function toCount(x) {
        return x.length;
    };
    var D = document;
    var W = window;
    var getChildren = function getChildren(parent, index) {
        var children = parent.children;
        return isNumber(index) ? children[index] || null : children || [];
    };
    var getElements = function getElements(query, scope) {
        return (scope || D).querySelectorAll(query);
    };
    var getNext = function getNext(node, anyNode) {
        return node['next' + (anyNode ? "" : 'Element') + 'Sibling'] || null;
    };
    var setClass = function setClass(node, value) {
        return node.classList.add(value), node;
    };
    var name = 'TagPicker.Sort';
    var references = new WeakMap();
    var _Sortable = Sortable,
        utils = _Sortable.utils;
    // Some of the sortable code tweak(s) were taken from <https://github.com/SortableJS/Sortable/issues/347#issuecomment-93726446>
    function getReference(key) {
        return references.get(key);
    }

    function onEnd(e) {
        var t = this,
            selectedClass = t.option('selectedClass'),
            item = e.item,
            items = e.items;
        W.setTimeout(function () {
            if (toCount(items)) {
                items.forEach(function (item) {
                    return setClass(item, selectedClass);
                });
            }
            setClass(item, selectedClass).focus();
        });
    }

    function onMove(e) {
        var t = this,
            _excludes = t._excludes,
            _excludesPositions = t._excludesPositions,
            freeze = false,
            vector;
        W.clearTimeout(t._move);
        t._move = W.setTimeout(function () {
            var list = e.to;
            _excludes.forEach(function (v, k) {
                var i = _excludesPositions[k];
                if (v !== getChildren(list, i)) {
                    var j = utils.index(v);
                    list.insertBefore(v, getChildren(list, i + (j < i)));
                }
            });
        });
        _excludes.forEach(function (v, k) {
            if (v === e.related) {
                freeze = true;
            }
            if (v === getNext(e.related) && e.relatedRect.top < e.draggedRect.top) {
                vector = -1;
            }
        });
        return freeze ? false : vector;
    }

    function onSort(e) {
        var t = this,
            picker = t._picker,
            item = e.item,
            items = e.items,
            tags = t.toArray();
        tags.pop(); // Remove the last item (the `.tag-picker__text` item)
        console.log(tags);
        picker.fire('sort.tag' + (items ? 's' : ""), [toCount(items) ? items.map(function (v) {
            return v.title;
        }) : item.title]).fire('change', toCount(items) ? [] : [item.title]);
    }

    function onStart(e) {
        var t = this,
            excludes = [].slice.call(getElements(t.option('filter'), t.el)),
            excludesPositions = excludes.map(function (v) {
                return utils.index(v);
            });
        t._picker;
        t._excludes = excludes;
        t._excludesPositions = excludesPositions;
        t._move = null;
    }

    function setReference(key, value) {
        return references.set(key, value);
    }

    function attach() {
        var $ = this;
        var $$ = $.constructor.prototype;
        !isFunction($$.reverse) && ($$.reverse = function () {
            var $ = this,
                _active = $._active;
            if (!_active) {
                return $;
            }
            // TODO
            return $;
        });
        !isFunction($$.sort) && ($$.sort = function (method) {
            var $ = this,
                _active = $._active;
            if (!_active) {
                return $;
            }
            // TODO
            return $;
        });
        var _mask = $._mask,
            self = $.self,
            state = $.state,
            tags = _mask.tags,
            n = state.n;
        var n_tag_ = n + '__tag--';
        var sortable = new Sortable(tags, {
            animation: 150,
            avoidImplicitDeselect: false,
            chosenClass: n_tag_ + 'touch',
            dataIdAttr: 'title',
            dragClass: n_tag_ + 'move',
            filter: '.' + n + '__text',
            forceFallback: true,
            ghostClass: n_tag_ + 'ghost',
            multiDrag: true,
            multiDragKey: 'ctrl',
            onEnd: onEnd,
            onMove: onMove,
            onSort: onSort,
            onStart: onStart,
            preventOnFilter: false,
            selectedClass: n_tag_ + 'selected',
            touchStartThreshold: 1
        });
        sortable._picker = $;
        setReference(self, sortable);
        return $;
    }

    function detach() {
        var $ = this,
            sortable = getReference($.self);
        sortable && sortable.destroy();
    }
    var index_js = {
        attach: attach,
        detach: detach,
        name: name
    };
    return index_js;
}));