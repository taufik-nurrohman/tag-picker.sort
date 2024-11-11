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
    var isArray = function isArray(x) {
        return Array.isArray(x);
    };
    var isDefined = function isDefined(x) {
        return 'undefined' !== typeof x;
    };
    var isFunction = function isFunction(x) {
        return 'function' === typeof x;
    };
    var isInstance = function isInstance(x, of) {
        return x && isSet(of) && x instanceof of ;
    };
    var isNull = function isNull(x) {
        return null === x;
    };
    var isNumeric = function isNumeric(x) {
        return /^-?(?:\d*.)?\d+$/.test(x + "");
    };
    var isObject = function isObject(x, isPlain) {
        if (isPlain === void 0) {
            isPlain = true;
        }
        if ('object' !== typeof x) {
            return false;
        }
        return isPlain ? isInstance(x, Object) : true;
    };
    var isSet = function isSet(x) {
        return isDefined(x) && !isNull(x);
    };
    var toCaseCamel = function toCaseCamel(x) {
        return x.replace(/[-_.](\w)/g, function (m0, m1) {
            return toCaseUpper(m1);
        });
    };
    var toCaseUpper = function toCaseUpper(x) {
        return x.toUpperCase();
    };
    var toNumber = function toNumber(x, base) {
        if (base === void 0) {
            base = 10;
        }
        return base ? parseInt(x, base) : parseFloat(x);
    };
    var _toValue = function toValue(x) {
        if (isArray(x)) {
            return x.map(function (v) {
                return _toValue(v);
            });
        }
        if (isNumeric(x)) {
            return toNumber(x);
        }
        if (isObject(x)) {
            for (var k in x) {
                x[k] = _toValue(x[k]);
            }
            return x;
        }
        if ('false' === x) {
            return false;
        }
        if ('null' === x) {
            return null;
        }
        if ('true' === x) {
            return true;
        }
        return x;
    };
    var fromJSON = function fromJSON(x) {
        var value = null;
        try {
            value = JSON.parse(x);
        } catch (e) {}
        return value;
    };
    var _fromValue = function fromValue(x) {
        if (isArray(x)) {
            return x.map(function (v) {
                return _fromValue(x);
            });
        }
        if (isObject(x)) {
            for (var k in x) {
                x[k] = _fromValue(x[k]);
            }
            return x;
        }
        if (false === x) {
            return 'false';
        }
        if (null === x) {
            return 'null';
        }
        if (true === x) {
            return 'true';
        }
        return "" + x;
    };
    var getAttribute = function getAttribute(node, attribute, parseValue) {
        if (parseValue === void 0) {
            parseValue = true;
        }
        if (!hasAttribute(node, attribute)) {
            return null;
        }
        var value = node.getAttribute(attribute);
        return parseValue ? _toValue(value) : value;
    };
    var getDatum = function getDatum(node, datum, parseValue) {
        if (parseValue === void 0) {
            parseValue = true;
        }
        var value = getAttribute(node, 'data-' + datum, parseValue),
            v = (value + "").trim();
        if (parseValue && v && ('[' === v[0] && ']' === v.slice(-1) || '{' === v[0] && '}' === v.slice(-1)) && null !== (v = fromJSON(value))) {
            return v;
        }
        return value;
    };
    var hasAttribute = function hasAttribute(node, attribute) {
        return node.hasAttribute(attribute);
    };
    var letStyle = function letStyle(node, style) {
        return node.style[toCaseCamel(style)] = null, node;
    };
    var setStyle = function setStyle(node, style, value) {
        return node.style[toCaseCamel(style)] = _fromValue(value), node;
    };
    var name = 'TagPicker.Sort';
    var references = new WeakMap();

    function createSortable($, onEnd, onMove, onSort, onStart) {
        var _mask = $._mask,
            state = $.state,
            n = state.n,
            tags = _mask.tags;
        var n_tag_ = n += '__tag--';
        return new Sortable(tags, {
            animation: 150,
            chosenClass: n_tag_ + 'select',
            dataIdAttr: 'data-name',
            dragClass: n_tag_ + 'move',
            filter: '.' + n + '__text',
            forceFallback: true,
            ghostClass: n_tag_ + 'ghost',
            onEnd: onEnd,
            onMove: onMove,
            onSort: onSort,
            onStart: onStart,
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
        var from = e.from,
            to = e.to;
        from && letStyle(from, 'cursor');
        to && letStyle(to, 'cursor');
    }

    function onLetTag() {
        var $ = this,
            sortable = getReference($);
        sortable && sortable.destroy();
        sortable = createSortable($, onEnd, onMove, onSort, onStart);
        sortable._picker = $;
        setReference($, sortable);
    }

    function onMove(e) {
        var t = this,
            picker = t._picker,
            _active = picker._active,
            _mask = picker._mask,
            text = _mask.text;
        if (!_active) {
            return;
        }
        return e.related !== text;
    }

    function onSort(e) {
        var t = this,
            v,
            picker = t._picker,
            _active = picker._active,
            _mask = picker._mask,
            self = picker.self,
            state = picker.state,
            tags = _mask.tags,
            item = e.item;
        if (!_active) {
            return;
        }
        var _tags = t.toArray().slice(0, -1); // All but the last item (the `.tag-picker__text` item)
        self.value = _tags.join(state.join);
        picker.fire('sort.tag', [v = getDatum(item, 'name')]).fire('change', [v]);
        picker.value = picker.value; // Refresh!
        letStyle(tags, 'cursor');
    }

    function onStart(e) {
        var t = this,
            picker = t._picker,
            _active = picker._active,
            from = e.from,
            to = e.to;
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
        var $ = this;
        var $$ = $.constructor.prototype;
        !isFunction($$.reverse) && ($$.reverse = function () {
            var $ = this,
                sortable = getReference($),
                _active = $._active,
                self = $.self,
                state = $.state,
                join = state.join;
            if (!_active) {
                return $;
            }
            var tags = sortable.toArray(),
                text = tags.pop();
            tags = tags.reverse();
            self.value = tags.join(join);
            return sortable.sort(tags.concat(text), true), $.fire('sort.tags', [tags]);
        });
        !isFunction($$.sort) && ($$.sort = function (method) {
            var $ = this,
                sortable = getReference($),
                _active = $._active,
                self = $.self,
                state = $.state,
                join = state.join;
            if (!_active) {
                return $;
            }
            method = (method || function (a, b) {
                return a.localeCompare(b, undefined, {
                    numeric: true,
                    sensitivity: 'base'
                });
            }).bind($);
            var tags = sortable.toArray(),
                text = tags.pop();
            tags = tags.sort(method);
            self.value = tags.join(join);
            return sortable.sort(tags.concat(text), true), $.fire('sort.tags', [tags]);
        });
        var sortable = createSortable($, onEnd, onMove, onSort, onStart);
        sortable._picker = $;
        setReference($, sortable);
        return $.on('let.tag', onLetTag);
    }

    function detach() {
        var $ = this,
            sortable = getReference($);
        sortable && sortable.destroy();
        letReference($);
        return $.off('let.tag', onLetTag);
    }
    var index_js = {
        attach: attach,
        detach: detach,
        name: name
    };
    return index_js;
}));