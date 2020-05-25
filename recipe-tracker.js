(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.P.E === region.U.E)
	{
		return 'on line ' + region.P.E;
	}
	return 'on lines ' + region.P.E + ' through ' + region.U.E;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.aA,
		impl.aH,
		impl.aF,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		r: func(record.r),
		Q: record.Q,
		N: record.N
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.r;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.Q;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.N) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.aA,
		impl.aH,
		impl.aF,
		function(sendToApp, initialModel) {
			var view = impl.aI;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.aA,
		impl.aH,
		impl.aF,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.O && impl.O(sendToApp)
			var view = impl.aI;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.at);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.aG) && (_VirtualDom_doc.title = title = doc.aG);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.aB;
	var onUrlRequest = impl.aC;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		O: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.ag === next.ag
							&& curr.Y === next.Y
							&& curr.ad.a === next.ad.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		aA: function(flags)
		{
			return A3(impl.aA, flags, _Browser_getUrl(), key);
		},
		aI: impl.aI,
		aH: impl.aH,
		aF: impl.aF
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { ay: 'hidden', au: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { ay: 'mozHidden', au: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { ay: 'msHidden', au: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { ay: 'webkitHidden', au: 'webkitvisibilitychange' }
		: { ay: 'hidden', au: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		ak: _Browser_getScene(),
		an: {
			ap: _Browser_window.pageXOffset,
			aq: _Browser_window.pageYOffset,
			ao: _Browser_doc.documentElement.clientWidth,
			X: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		ao: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		X: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			ak: {
				ao: node.scrollWidth,
				X: node.scrollHeight
			},
			an: {
				ap: node.scrollLeft,
				aq: node.scrollTop,
				ao: node.clientWidth,
				X: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			ak: _Browser_getScene(),
			an: {
				ap: x,
				aq: y,
				ao: _Browser_doc.documentElement.clientWidth,
				X: _Browser_doc.documentElement.clientHeight
			},
			aw: {
				ap: x + rect.left,
				aq: y + rect.top,
				ao: rect.width,
				X: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.d) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.f),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.f);
		} else {
			var treeLen = builder.d * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.g) : builder.g;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.d);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.f) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.f);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{g: nodeList, d: (len / $elm$core$Array$branchFactor) | 0, f: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {W: fragment, Y: host, ab: path, ad: port_, ag: protocol, ah: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Main$showPersonality = function (p) {
	switch (p) {
		case 0:
			return 'Cranky';
		case 1:
			return 'Jock';
		case 2:
			return 'Lazy';
		case 3:
			return 'Normal';
		case 4:
			return 'Peppy';
		case 5:
			return 'Sisterly';
		case 6:
			return 'Smug';
		case 7:
			return 'Snooty';
		default:
			return 'any';
	}
};
var $author$project$Main$showSource = function (s) {
	if (!s.$) {
		var p = s.a;
		return 'From ' + ($author$project$Main$showPersonality(p) + ' villager');
	} else {
		var description = s.a;
		return description;
	}
};
var $author$project$Main$addSourceString = function (baseRecipe) {
	return {
		a: baseRecipe.a,
		b: baseRecipe.b,
		c: baseRecipe.c,
		J: A2($elm$core$List$map, $author$project$Main$showSource, baseRecipe.c)
	};
};
var $author$project$Main$Cranky = 0;
var $author$project$Main$Jock = 1;
var $author$project$Main$Lazy = 2;
var $author$project$Main$Normal = 3;
var $author$project$Main$Peppy = 4;
var $author$project$Main$Sisterly = 5;
var $author$project$Main$Smug = 6;
var $author$project$Main$Snooty = 7;
var $author$project$Main$Villager = function (a) {
	return {$: 0, a: a};
};
var $author$project$Main$availableRecipes = _List_fromArray(
	[
		{a: 'acorn-pochette', b: 'Acorn Pochette', c: _List_Nil},
		{
		a: 'acoustic-guitar',
		b: 'Acoustic Guitar',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{
		a: 'angled-signpost',
		b: 'Angled Signpost',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'apple-chair',
		b: 'Apple Chair',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'apple-dress',
		b: 'Apple Dress',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'apple-hat',
		b: 'Apple Hat',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'apple-rug',
		b: 'Apple Rug',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'apple-umbrella',
		b: 'Apple Umbrella',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'apple-wall',
		b: 'Apple Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{a: 'aquarius-urn', b: 'Aquarius Urn', c: _List_Nil},
		{a: 'aries-rocking-chair', b: 'Aries Rocking Chair', c: _List_Nil},
		{
		a: 'armor-shoes',
		b: 'Armor Shoes',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'aroma-pot',
		b: 'Aroma Pot',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{a: 'asteroid', b: 'Asteroid', c: _List_Nil},
		{a: 'astronaut-suit', b: 'Astronaut Suit', c: _List_Nil},
		{a: 'autumn-wall', b: 'Autumn Wall', c: _List_Nil},
		{a: 'axe', b: 'Axe', c: _List_Nil},
		{
		a: 'backyard-lawn',
		b: 'Backyard Lawn',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'bamboo-basket',
		b: 'Bamboo Basket',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{
		a: 'bamboo-bench',
		b: 'Bamboo Bench',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'bamboo-candleholder',
		b: 'Bamboo Candleholder',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{a: 'bamboo-doll', b: 'Bamboo Doll', c: _List_Nil},
		{
		a: 'bamboo-drum',
		b: 'Bamboo Drum',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{
		a: 'bamboo-floor-lamp',
		b: 'Bamboo Floor Lamp',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'bamboo-flooring',
		b: 'Bamboo Flooring',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'bamboo-hat',
		b: 'Bamboo Hat',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{a: 'bamboo-lattice-fence', b: 'Bamboo Lattice Fence', c: _List_Nil},
		{
		a: 'bamboo-lunch-box',
		b: 'Bamboo Lunch Box',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{a: 'bamboo-noodle-slide', b: 'Bamboo Noodle Slide', c: _List_Nil},
		{
		a: 'bamboo-partition',
		b: 'Bamboo Partition',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'bamboo-shelf',
		b: 'Bamboo Shelf',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{
		a: 'bamboo-speaker',
		b: 'Bamboo Speaker',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{
		a: 'bamboo-sphere',
		b: 'Bamboo Sphere',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'bamboo-stool',
		b: 'Bamboo Stool',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{
		a: 'bamboo-stopblock',
		b: 'Bamboo Stopblock',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{
		a: 'bamboo-wall',
		b: 'Bamboo Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'bamboo-wall-decoration',
		b: 'Bamboo Wall Decoration',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{a: 'bamboo-wand', b: 'Bamboo Wand', c: _List_Nil},
		{a: 'bamboo-grove-wall', b: 'Bamboo-grove Wall', c: _List_Nil},
		{a: 'bamboo-shoot-lamp', b: 'Bamboo-shoot Lamp', c: _List_Nil},
		{a: 'barbed-wire-fence', b: 'Barbed-wire Fence', c: _List_Nil},
		{
		a: 'barbell',
		b: 'Barbell',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{
		a: 'barrel',
		b: 'Barrel',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'basement-flooring',
		b: 'Basement Flooring',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{a: 'basket-pack', b: 'Basket Pack', c: _List_Nil},
		{
		a: 'beekeepers-hive',
		b: 'Beekeeper\'s Hive',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{a: 'big-festive-tree', b: 'Big Festive Tree', c: _List_Nil},
		{
		a: 'birdbath',
		b: 'Birdbath',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{
		a: 'birdcage',
		b: 'Birdcage',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'birdhouse',
		b: 'Birdhouse',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{a: 'blossom-viewing-lantern', b: 'Blossom-viewing Lantern', c: _List_Nil},
		{a: 'blue-rose-crown', b: 'Blue Rose Crown', c: _List_Nil},
		{a: 'blue-rose-wreath', b: 'Blue Rose Wreath', c: _List_Nil},
		{
		a: 'bone-doorplate',
		b: 'Bone Doorplate',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'bonfire',
		b: 'Bonfire',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'bonsai-shelf',
		b: 'Bonsai Shelf',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'boomerang',
		b: 'Boomerang',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{a: 'brick-fence', b: 'Brick Fence', c: _List_Nil},
		{a: 'brick-oven', b: 'Brick Oven', c: _List_Nil},
		{a: 'brick-well', b: 'Brick Well', c: _List_Nil},
		{
		a: 'brown-herringbone-wall',
		b: 'Brown Herringbone Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{a: 'bunny-day-arch', b: 'Bunny Day Arch', c: _List_Nil},
		{a: 'bunny-day-bag', b: 'Bunny Day Bag', c: _List_Nil},
		{a: 'bunny-day-bed', b: 'Bunny Day Bed', c: _List_Nil},
		{a: 'bunny-day-crown', b: 'Bunny Day Crown', c: _List_Nil},
		{a: 'bunny-day-fence', b: 'Bunny Day Fence', c: _List_Nil},
		{a: 'bunny-day-festive-balloons', b: 'Bunny Day Festive Balloons', c: _List_Nil},
		{a: 'bunny-day-flooring', b: 'Bunny Day Flooring', c: _List_Nil},
		{a: 'bunny-day-glowy-garland', b: 'Bunny Day Glowy Garland', c: _List_Nil},
		{a: 'bunny-day-lamp', b: 'Bunny Day Lamp', c: _List_Nil},
		{a: 'bunny-day-merry-balloons', b: 'Bunny Day Merry Balloons', c: _List_Nil},
		{a: 'bunny-day-rug', b: 'Bunny Day Rug', c: _List_Nil},
		{a: 'bunny-day-stool', b: 'Bunny Day Stool', c: _List_Nil},
		{a: 'bunny-day-table', b: 'Bunny Day Table', c: _List_Nil},
		{a: 'bunny-day-vanity', b: 'Bunny Day Vanity', c: _List_Nil},
		{a: 'bunny-day-wall', b: 'Bunny Day Wall', c: _List_Nil},
		{a: 'bunny-day-wall-clock', b: 'Bunny Day Wall Clock', c: _List_Nil},
		{a: 'bunny-day-wand', b: 'Bunny Day Wand', c: _List_Nil},
		{a: 'bunny-day-wardrobe', b: 'Bunny Day Wardrobe', c: _List_Nil},
		{a: 'bunny-day-wreath', b: 'Bunny Day Wreath', c: _List_Nil},
		{
		a: 'butter-churn',
		b: 'Butter Churn',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{
		a: 'cabin-wall',
		b: 'Cabin Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{a: 'campfire', b: 'Campfire', c: _List_Nil},
		{a: 'cancer-table', b: 'Cancer Table', c: _List_Nil},
		{a: 'capricorn-ornament', b: 'Capricorn Ornament', c: _List_Nil},
		{
		a: 'cardboard-bed',
		b: 'Cardboard Bed',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'cardboard-chair',
		b: 'Cardboard Chair',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'cardboard-sofa',
		b: 'Cardboard Sofa',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'cardboard-table',
		b: 'Cardboard Table',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'cherry-dress',
		b: 'Cherry Dress',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'cherry-hat',
		b: 'Cherry Hat',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'cherry-lamp',
		b: 'Cherry Lamp',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'cherry-rug',
		b: 'Cherry Rug',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'cherry-speakers',
		b: 'Cherry Speakers',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'cherry-umbrella',
		b: 'Cherry Umbrella',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'cherry-wall',
		b: 'Cherry Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{a: 'cherry-blossom-bonsai', b: 'Cherry-blossom Bonsai', c: _List_Nil},
		{a: 'cherry-blossom-branches', b: 'Cherry-blossom Branches', c: _List_Nil},
		{a: 'cherry-blossom-clock', b: 'Cherry-blossom Clock', c: _List_Nil},
		{a: 'cherry-blossom-flooring', b: 'Cherry-blossom Flooring', c: _List_Nil},
		{a: 'cherry-blossom-pochette', b: 'Cherry-blossom Pochette', c: _List_Nil},
		{a: 'cherry-blossom-pond-stone', b: 'Cherry-blossom Pond Stone', c: _List_Nil},
		{a: 'cherry-blossom-umbrella', b: 'Cherry-blossom Umbrella', c: _List_Nil},
		{a: 'cherry-blossom-wand', b: 'Cherry-blossom Wand', c: _List_Nil},
		{a: 'cherry-blossom-petal-pile', b: 'Cherry-blossom-petal Pile', c: _List_Nil},
		{a: 'cherry-blossom-trees-wall', b: 'Cherry-blossom-trees Wall', c: _List_Nil},
		{a: 'chic-cosmos-wreath', b: 'Chic Cosmos Wreath', c: _List_Nil},
		{a: 'chic-mum-crown', b: 'Chic Mum Crown', c: _List_Nil},
		{a: 'chic-rose-crown', b: 'Chic Rose Crown', c: _List_Nil},
		{a: 'chic-tulip-crown', b: 'Chic Tulip Crown', c: _List_Nil},
		{a: 'chic-windflower-wreath', b: 'Chic Windflower Wreath', c: _List_Nil},
		{
		a: 'chocolate-herringbone-wall',
		b: 'Chocolate Herringbone Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{
		a: 'clackercart',
		b: 'Clackercart',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'classic-pitcher',
		b: 'Classic Pitcher',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{
		a: 'classic-library-wall',
		b: 'Classic-library Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'clothesline',
		b: 'Clothesline',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'coconut-juice',
		b: 'Coconut Juice',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{
		a: 'coconut-wall-planter',
		b: 'Coconut Wall Planter',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{a: 'colored-leaves-flooring', b: 'Colored-leaves Flooring', c: _List_Nil},
		{a: 'cool-hyacinth-crown', b: 'Cool Hyacinth Crown', c: _List_Nil},
		{a: 'cool-hyacinth-wreath', b: 'Cool Hyacinth Wreath', c: _List_Nil},
		{a: 'cool-pansy-crown', b: 'Cool Pansy Crown', c: _List_Nil},
		{a: 'cool-pansy-wreath', b: 'Cool Pansy Wreath', c: _List_Nil},
		{a: 'cool-windflower-crown', b: 'Cool Windflower Crown', c: _List_Nil},
		{a: 'cool-windflower-wreath', b: 'Cool Windflower Wreath', c: _List_Nil},
		{a: 'corral-fence', b: 'Corral Fence', c: _List_Nil},
		{a: 'cosmos-crown', b: 'Cosmos Crown', c: _List_Nil},
		{
		a: 'cosmos-shower',
		b: 'Cosmos Shower',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{a: 'cosmos-wand', b: 'Cosmos Wand', c: _List_Nil},
		{a: 'cosmos-wreath', b: 'Cosmos Wreath', c: _List_Nil},
		{a: 'country-fence', b: 'Country Fence', c: _List_Nil},
		{a: 'crescent-moon-chair', b: 'Crescent-moon Chair', c: _List_Nil},
		{
		a: 'crest-doorplate',
		b: 'Crest Doorplate',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{a: 'crewed-spaceship', b: 'Crewed Spaceship', c: _List_Nil},
		{a: 'cute-lily-crown', b: 'Cute Lily Crown', c: _List_Nil},
		{a: 'cute-rose-crown', b: 'Cute Rose Crown', c: _List_Nil},
		{
		a: 'cutting-board',
		b: 'Cutting Board',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'dark-bamboo-rug',
		b: 'Dark Bamboo Rug',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{a: 'dark-cosmos-crown', b: 'Dark Cosmos Crown', c: _List_Nil},
		{a: 'dark-lily-crown', b: 'Dark Lily Crown', c: _List_Nil},
		{a: 'dark-lily-wreath', b: 'Dark Lily Wreath', c: _List_Nil},
		{a: 'dark-rose-wreath', b: 'Dark Rose Wreath', c: _List_Nil},
		{a: 'dark-tulip-crown', b: 'Dark Tulip Crown', c: _List_Nil},
		{a: 'dark-tulip-wreath', b: 'Dark Tulip Wreath', c: _List_Nil},
		{
		a: 'dark-wooden-mosaic-wall',
		b: 'Dark Wooden-mosaic Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'decoy-duck',
		b: 'Decoy Duck',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{
		a: 'deer-decoration',
		b: 'Deer Decoration',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'deer-scare',
		b: 'Deer Scare',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{a: 'destinations-signpost', b: 'Destinations Signpost', c: _List_Nil},
		{
		a: 'diy-workbench',
		b: 'Diy Workbench',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'document-stack',
		b: 'Document Stack',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{
		a: 'doghouse',
		b: 'Doghouse',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{a: 'drinking-fountain', b: 'Drinking Fountain', c: _List_Nil},
		{a: 'earth-egg-outfit', b: 'Earth-egg Outfit', c: _List_Nil},
		{a: 'earth-egg-shell', b: 'Earth-egg Shell', c: _List_Nil},
		{a: 'earth-egg-shoes', b: 'Earth-egg Shoes', c: _List_Nil},
		{a: 'egg-party-dress', b: 'Egg Party Dress', c: _List_Nil},
		{a: 'egg-party-hat', b: 'Egg Party Hat', c: _List_Nil},
		{a: 'fancy-lily-wreath', b: 'Fancy Lily Wreath', c: _List_Nil},
		{a: 'fancy-mum-wreath', b: 'Fancy Mum Wreath', c: _List_Nil},
		{a: 'fancy-rose-wreath', b: 'Fancy Rose Wreath', c: _List_Nil},
		{a: 'festive-top-set', b: 'Festive Top Set', c: _List_Nil},
		{a: 'festive-tree', b: 'Festive Tree', c: _List_Nil},
		{
		a: 'firewood',
		b: 'Firewood',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{a: 'fish-bait', b: 'Fish Bait', c: _List_Nil},
		{a: 'fishing-rod', b: 'Fishing Rod', c: _List_Nil},
		{
		a: 'flat-garden-rock',
		b: 'Flat Garden Rock',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{a: 'flimsy-axe', b: 'Flimsy Axe', c: _List_Nil},
		{a: 'flimsy-fishing-rod', b: 'Flimsy Fishing Rod', c: _List_Nil},
		{a: 'flimsy-net', b: 'Flimsy Net', c: _List_Nil},
		{a: 'flimsy-shovel', b: 'Flimsy Shovel', c: _List_Nil},
		{a: 'flimsy-watering-can', b: 'Flimsy Watering Can', c: _List_Nil},
		{
		a: 'floral-swag',
		b: 'Floral Swag',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'flower-stand',
		b: 'Flower Stand',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{a: 'flying-saucer', b: 'Flying Saucer', c: _List_Nil},
		{a: 'forest-flooring', b: 'Forest Flooring', c: _List_Nil},
		{a: 'forest-wall', b: 'Forest Wall', c: _List_Nil},
		{
		a: 'fossil-doorplate',
		b: 'Fossil Doorplate',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{a: 'fountain', b: 'Fountain', c: _List_Nil},
		{a: 'frozen-arch', b: 'Frozen Arch', c: _List_Nil},
		{a: 'frozen-bed', b: 'Frozen Bed', c: _List_Nil},
		{a: 'frozen-chair', b: 'Frozen Chair', c: _List_Nil},
		{a: 'frozen-counter', b: 'Frozen Counter', c: _List_Nil},
		{a: 'frozen-partition', b: 'Frozen Partition', c: _List_Nil},
		{a: 'frozen-pillar', b: 'Frozen Pillar', c: _List_Nil},
		{a: 'frozen-sculpture', b: 'Frozen Sculpture', c: _List_Nil},
		{a: 'frozen-table', b: 'Frozen Table', c: _List_Nil},
		{a: 'frozen-tree', b: 'Frozen Tree', c: _List_Nil},
		{a: 'frozen-treat-set', b: 'Frozen-treat Set', c: _List_Nil},
		{
		a: 'fruit-basket',
		b: 'Fruit Basket',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'fruit-wreath',
		b: 'Fruit Wreath',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{a: 'frying-pan', b: 'Frying Pan', c: _List_Nil},
		{a: 'galaxy-flooring', b: 'Galaxy Flooring', c: _List_Nil},
		{a: 'garbage-heap-flooring', b: 'Garbage-heap Flooring', c: _List_Nil},
		{a: 'garbage-heap-wall', b: 'Garbage-heap Wall', c: _List_Nil},
		{
		a: 'garden-bench',
		b: 'Garden Bench',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{
		a: 'garden-rock',
		b: 'Garden Rock',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'garden-wagon',
		b: 'Garden Wagon',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{a: 'gemini-closet', b: 'Gemini Closet', c: _List_Nil},
		{
		a: 'giant-teddy-bear',
		b: 'Giant Teddy Bear',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'gold-armor',
		b: 'Gold Armor',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{
		a: 'gold-bars',
		b: 'Gold Bars',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{
		a: 'gold-helmet',
		b: 'Gold Helmet',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{a: 'gold-rose-crown', b: 'Gold Rose Crown', c: _List_Nil},
		{a: 'gold-rose-wreath', b: 'Gold Rose Wreath', c: _List_Nil},
		{a: 'gold-screen-wall', b: 'Gold Screen Wall', c: _List_Nil},
		{
		a: 'gold-armor-shoes',
		b: 'Gold-armor Shoes',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{
		a: 'golden-arowana-model',
		b: 'Golden Arowana Model',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{a: 'golden-axe', b: 'Golden Axe', c: _List_Nil},
		{
		a: 'golden-candlestick',
		b: 'Golden Candlestick',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{
		a: 'golden-casket',
		b: 'Golden Casket',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{
		a: 'golden-dishes',
		b: 'Golden Dishes',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{
		a: 'golden-dung-beetle',
		b: 'Golden Dung Beetle',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'golden-flooring',
		b: 'Golden Flooring',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{
		a: 'golden-gears',
		b: 'Golden Gears',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{a: 'golden-net', b: 'Golden Net', c: _List_Nil},
		{a: 'golden-rod', b: 'Golden Rod', c: _List_Nil},
		{
		a: 'golden-seat',
		b: 'Golden Seat',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{a: 'golden-shovel', b: 'Golden Shovel', c: _List_Nil},
		{a: 'golden-slingshot', b: 'Golden Slingshot', c: _List_Nil},
		{
		a: 'golden-toilet',
		b: 'Golden Toilet',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{
		a: 'golden-wall',
		b: 'Golden Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{a: 'golden-wand', b: 'Golden Wand', c: _List_Nil},
		{a: 'golden-watering-can', b: 'Golden Watering Can', c: _List_Nil},
		{
		a: 'gong',
		b: 'Gong',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'grass-skirt',
		b: 'Grass Skirt',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'grass-standee',
		b: 'Grass Standee',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'green-grass-skirt',
		b: 'Green Grass Skirt',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{a: 'green-leaf-pile', b: 'Green-leaf Pile', c: _List_Nil},
		{
		a: 'hanging-terrarium',
		b: 'Hanging Terrarium',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{a: 'hay-bed', b: 'Hay Bed', c: _List_Nil},
		{a: 'hearth', b: 'Hearth', c: _List_Nil},
		{a: 'hedge', b: 'Hedge', c: _List_Nil},
		{
		a: 'hedge-standee',
		b: 'Hedge Standee',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{a: 'holiday-candle', b: 'Holiday Candle', c: _List_Nil},
		{
		a: 'honeycomb-flooring',
		b: 'Honeycomb Flooring',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{
		a: 'honeycomb-wall',
		b: 'Honeycomb Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{a: 'hyacinth-crown', b: 'Hyacinth Crown', c: _List_Nil},
		{
		a: 'hyacinth-lamp',
		b: 'Hyacinth Lamp',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{a: 'hyacinth-wand', b: 'Hyacinth Wand', c: _List_Nil},
		{a: 'hyacinth-wreath', b: 'Hyacinth Wreath', c: _List_Nil},
		{a: 'ice-flooring', b: 'Ice Flooring', c: _List_Nil},
		{a: 'ice-wall', b: 'Ice Wall', c: _List_Nil},
		{a: 'ice-wand', b: 'Ice Wand', c: _List_Nil},
		{a: 'iceberg-flooring', b: 'Iceberg Flooring', c: _List_Nil},
		{a: 'iceberg-wall', b: 'Iceberg Wall', c: _List_Nil},
		{a: 'illuminated-present', b: 'Illuminated Present', c: _List_Nil},
		{a: 'illuminated-reindeer', b: 'Illuminated Reindeer', c: _List_Nil},
		{a: 'illuminated-snowflakes', b: 'Illuminated Snowflakes', c: _List_Nil},
		{a: 'illuminated-tree', b: 'Illuminated Tree', c: _List_Nil},
		{a: 'imperial-fence', b: 'Imperial Fence', c: _List_Nil},
		{
		a: 'infused-water-dispenser',
		b: 'Infused-water Dispenser',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'iron-armor',
		b: 'Iron Armor',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'iron-closet',
		b: 'Iron Closet',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'iron-doorplate',
		b: 'Iron Doorplate',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{a: 'iron-fence', b: 'Iron Fence', c: _List_Nil},
		{
		a: 'iron-frame',
		b: 'Iron Frame',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{
		a: 'iron-garden-bench',
		b: 'Iron Garden Bench',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'iron-garden-chair',
		b: 'Iron Garden Chair',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'iron-garden-table',
		b: 'Iron Garden Table',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'iron-hanger-stand',
		b: 'Iron Hanger Stand',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'iron-shelf',
		b: 'Iron Shelf',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{a: 'iron-wall-lamp', b: 'Iron Wall Lamp', c: _List_Nil},
		{
		a: 'iron-wall-rack',
		b: 'Iron Wall Rack',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{a: 'iron-wand', b: 'Iron Wand', c: _List_Nil},
		{
		a: 'iron-worktable',
		b: 'Iron Worktable',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{a: 'iron-and-stone-fence', b: 'Iron-and-stone Fence', c: _List_Nil},
		{
		a: 'ironwood-bed',
		b: 'Ironwood Bed',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{
		a: 'ironwood-cart',
		b: 'Ironwood Cart',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{
		a: 'ironwood-chair',
		b: 'Ironwood Chair',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{
		a: 'ironwood-clock',
		b: 'Ironwood Clock',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{
		a: 'ironwood-cupboard',
		b: 'Ironwood Cupboard',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{
		a: 'ironwood-diy-workbench',
		b: 'Ironwood Diy Workbench',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'ironwood-dresser',
		b: 'Ironwood Dresser',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{a: 'ironwood-kitchenette', b: 'Ironwood Kitchenette', c: _List_Nil},
		{
		a: 'ironwood-low-table',
		b: 'Ironwood Low Table',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{
		a: 'ironwood-table',
		b: 'Ironwood Table',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'jail-bars',
		b: 'Jail Bars',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{a: 'jingle-wall', b: 'Jingle Wall', c: _List_Nil},
		{
		a: 'juicy-apple-tv',
		b: 'Juicy-apple Tv',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'jungle-flooring',
		b: 'Jungle Flooring',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{
		a: 'jungle-wall',
		b: 'Jungle Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{
		a: 'kettle-bathtub',
		b: 'Kettle Bathtub',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'kettlebell',
		b: 'Kettlebell',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{
		a: 'key-holder',
		b: 'Key Holder',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'knights-helmet',
		b: 'Knight\'s Helmet',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'knitted-grass-backpack',
		b: 'Knitted-grass Backpack',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{a: 'ladder', b: 'Ladder', c: _List_Nil},
		{
		a: 'large-cardboard-boxes',
		b: 'Large Cardboard Boxes',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{a: 'lattice-fence', b: 'Lattice Fence', c: _List_Nil},
		{
		a: 'leaf',
		b: 'Leaf',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{a: 'leaf-campfire', b: 'Leaf Campfire', c: _List_Nil},
		{
		a: 'leaf-mask',
		b: 'Leaf Mask',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{a: 'leaf-stool', b: 'Leaf Stool', c: _List_Nil},
		{
		a: 'leaf-umbrella',
		b: 'Leaf Umbrella',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{a: 'leaf-egg-outfit', b: 'Leaf-egg Outfit', c: _List_Nil},
		{a: 'leaf-egg-shell', b: 'Leaf-egg Shell', c: _List_Nil},
		{a: 'leaf-egg-shoes', b: 'Leaf-egg Shoes', c: _List_Nil},
		{a: 'leo-sculpture', b: 'Leo Sculpture', c: _List_Nil},
		{a: 'libra-scale', b: 'Libra Scale', c: _List_Nil},
		{a: 'light-bamboo-rug', b: 'Light Bamboo Rug', c: _List_Nil},
		{a: 'lily-crown', b: 'Lily Crown', c: _List_Nil},
		{
		a: 'lily-record-player',
		b: 'Lily Record Player',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{a: 'lily-wand', b: 'Lily Wand', c: _List_Nil},
		{a: 'lily-wreath', b: 'Lily Wreath', c: _List_Nil},
		{
		a: 'log-bed',
		b: 'Log Bed',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'log-bench',
		b: 'Log Bench',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'log-sofa',
		b: 'Log Chair',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'log-decorative-shelves',
		b: 'Log Decorative Shelves',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'log-dining-table',
		b: 'Log Dining Table',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'log-extra-long-sofa',
		b: 'Log Extra-long Sofa',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'log-garden-lounge',
		b: 'Log Garden Lounge',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'log-pack',
		b: 'Log Pack',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{
		a: 'log-round-table',
		b: 'Log Round Table',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'log-stakes',
		b: 'Log Stakes',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{
		a: 'log-stool',
		b: 'Log Stool',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'log-wall-mounted-clock',
		b: 'Log Wall-mounted Clock',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{a: 'lovely-cosmos-crown', b: 'Lovely Cosmos Crown', c: _List_Nil},
		{
		a: 'lucky-gold-cat',
		b: 'Lucky Gold Cat',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{a: 'lunar-lander', b: 'Lunar Lander', c: _List_Nil},
		{a: 'lunar-rover', b: 'Lunar Rover', c: _List_Nil},
		{a: 'lunar-surface', b: 'Lunar Surface', c: _List_Nil},
		{
		a: 'magazine-rack',
		b: 'Magazine Rack',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'manga-library-wall',
		b: 'Manga-library Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{a: 'manhole-cover', b: 'Manhole Cover', c: _List_Nil},
		{a: 'maple-leaf-pochette', b: 'Maple-leaf Pochette', c: _List_Nil},
		{a: 'maple-leaf-pond-stone', b: 'Maple-leaf Pond Stone', c: _List_Nil},
		{a: 'maple-leaf-umbrella', b: 'Maple-leaf Umbrella', c: _List_Nil},
		{
		a: 'matryoshka',
		b: 'Matryoshka',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{a: 'medicine', b: 'Medicine', c: _List_Nil},
		{
		a: 'medium-cardboard-boxes',
		b: 'Medium Cardboard Boxes',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{a: 'mini-diy-workbench', b: 'Mini DIY Workbench', c: _List_Nil},
		{
		a: 'modeling-clay',
		b: 'Modeling Clay',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'modern-wood-wall',
		b: 'Modern Wood Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{
		a: 'money-flooring',
		b: 'Money Flooring',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{a: 'moon', b: 'Moon', c: _List_Nil},
		{
		a: 'mossy-garden-rock',
		b: 'Mossy Garden Rock',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'mountain-standee',
		b: 'Mountain Standee',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{a: 'mum-crown', b: 'Mum Crown', c: _List_Nil},
		{
		a: 'mum-cushion',
		b: 'Mum Cushion',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{a: 'mum-wreath', b: 'Mum Wreath', c: _List_Nil},
		{a: 'mums-wand', b: 'Mums Wand', c: _List_Nil},
		{a: 'mush-lamp', b: 'Mush Lamp', c: _List_Nil},
		{a: 'mush-log', b: 'Mush Log', c: _List_Nil},
		{a: 'mush-low-stool', b: 'Mush Low Stool', c: _List_Nil},
		{a: 'mush-parasol', b: 'Mush Parasol', c: _List_Nil},
		{a: 'mush-partition', b: 'Mush Partition', c: _List_Nil},
		{a: 'mush-table', b: 'Mush Table', c: _List_Nil},
		{a: 'mush-umbrella', b: 'Mush Umbrella', c: _List_Nil},
		{a: 'mush-wall', b: 'Mush Wall', c: _List_Nil},
		{a: 'mushroom-wand', b: 'Mushroom Wand', c: _List_Nil},
		{a: 'mushroom-wreath', b: 'Mushroom Wreath', c: _List_Nil},
		{
		a: 'music-stand',
		b: 'Music Stand',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'natural-garden-chair',
		b: 'Natural Garden Chair',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'natural-garden-table',
		b: 'Natural Garden Table',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{a: 'natural-mum-wreath', b: 'Natural Mum Wreath', c: _List_Nil},
		{
		a: 'natural-square-table',
		b: 'Natural Square Table',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{a: 'net', b: 'Net', c: _List_Nil},
		{a: 'nova-light', b: 'Nova Light', c: _List_Nil},
		{a: 'ocarina', b: 'Ocarina', c: _List_Nil},
		{a: 'oil-barrel-bathtub', b: 'Oil Barrel Bathtub', c: _List_Nil},
		{a: 'old-fashioned-washtub', b: 'Old-fashioned Washtub', c: _List_Nil},
		{
		a: 'orange-dress',
		b: 'Orange Dress',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'orange-end-table',
		b: 'Orange End Table',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'orange-hat',
		b: 'Orange Hat',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'orange-rug',
		b: 'Orange Rug',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'orange-umbrella',
		b: 'Orange Umbrella',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'orange-wall',
		b: 'Orange Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'orange-wall-mounted-clock',
		b: 'Orange Wall-mounted Clock',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{a: 'ornament-mobile', b: 'Ornament Mobile', c: _List_Nil},
		{a: 'ornament-wreath', b: 'Ornament Wreath', c: _List_Nil},
		{a: 'outdoor-bath', b: 'Outdoor Bath', c: _List_Nil},
		{a: 'outdoor-picnic-set', b: 'Outdoor Picnic Set', c: _List_Nil},
		{
		a: 'palm-tree-lamp',
		b: 'Palm-tree Lamp',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{a: 'pan-flute', b: 'Pan Flute', c: _List_Nil},
		{a: 'pansy-crown', b: 'Pansy Crown', c: _List_Nil},
		{
		a: 'pansy-table',
		b: 'Pansy Table',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{a: 'pansy-wand', b: 'Pansy Wand', c: _List_Nil},
		{a: 'pansy-wreath', b: 'Pansy Wreath', c: _List_Nil},
		{
		a: 'paw-print-doorplate',
		b: 'Paw-print Doorplate',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'peach-chair',
		b: 'Peach Chair',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'peach-dress',
		b: 'Peach Dress',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'peach-hat',
		b: 'Peach Hat',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'peach-rug',
		b: 'Peach Rug',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'peach-surprise-box',
		b: 'Peach Surprise Box',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'peach-umbrella',
		b: 'Peach Umbrella',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'peach-wall',
		b: 'Peach Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'pear-bed',
		b: 'Pear Bed',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{
		a: 'pear-dress',
		b: 'Pear Dress',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{
		a: 'pear-hat',
		b: 'Pear Hat',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{
		a: 'pear-rug',
		b: 'Pear Rug',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{
		a: 'pear-umbrella',
		b: 'Pear Umbrella',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{
		a: 'pear-wall',
		b: 'Pear Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{
		a: 'pear-wardrobe',
		b: 'Pear Wardrobe',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{a: 'pile-of-leaves', b: 'Pile Of Leaves', c: _List_Nil},
		{
		a: 'pile-of-zen-cushions',
		b: 'Pile Of Zen Cushions',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{a: 'pine-bonsai-tree', b: 'Pine Bonsai Tree', c: _List_Nil},
		{a: 'pisces-lamp', b: 'Pisces Lamp', c: _List_Nil},
		{
		a: 'pitfall-seed',
		b: 'Pitfall Seed',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{a: 'plain-sink', b: 'Plain Sink', c: _List_Nil},
		{
		a: 'plain-wooden-shop-sign',
		b: 'Plain Wooden Shop Sign',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{
		a: 'pond-stone',
		b: 'Pond Stone',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{
		a: 'pot',
		b: 'Pot',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{a: 'potted-ivy', b: 'Potted Ivy', c: _List_Nil},
		{a: 'pretty-cosmos-wreath', b: 'Pretty Cosmos Wreath', c: _List_Nil},
		{a: 'pretty-tulip-wreath', b: 'Pretty Tulip Wreath', c: _List_Nil},
		{a: 'purple-hyacinth-crown', b: 'Purple Hyacinth Crown', c: _List_Nil},
		{a: 'purple-hyacinth-wreath', b: 'Purple Hyacinth Wreath', c: _List_Nil},
		{a: 'purple-pansy-crown', b: 'Purple Pansy Crown', c: _List_Nil},
		{a: 'purple-windflower-crown', b: 'Purple Windflower Crown', c: _List_Nil},
		{
		a: 'raccoon-figurine',
		b: 'Raccoon Figurine',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{a: 'recycled-boots', b: 'Recycled Boots', c: _List_Nil},
		{a: 'recycled-can-thumb-piano', b: 'Recycled-can Thumb Piano', c: _List_Nil},
		{a: 'red-leaf-pile', b: 'Red-leaf Pile', c: _List_Nil},
		{a: 'ringtoss', b: 'Ringtoss', c: _List_Nil},
		{a: 'robot-hero', b: 'Robot Hero', c: _List_Nil},
		{a: 'rocket', b: 'Rocket', c: _List_Nil},
		{a: 'rocking-chair', b: 'Rocking Chair', c: _List_Nil},
		{
		a: 'rocking-horse',
		b: 'Rocking Horse',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{a: 'rope-fence', b: 'Rope Fence', c: _List_Nil},
		{
		a: 'rose-bed',
		b: 'Rose Bed',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{a: 'rose-crown', b: 'Rose Crown', c: _List_Nil},
		{a: 'rose-wand', b: 'Rose Wand', c: _List_Nil},
		{a: 'rose-wreath', b: 'Rose Wreath', c: _List_Nil},
		{
		a: 'rustic-stone-wall',
		b: 'Rustic-stone Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{a: 'sagittarius-arrow', b: 'Sagittarius Arrow', c: _List_Nil},
		{a: 'sakura-wood-flooring', b: 'Sakura-wood Flooring', c: _List_Nil},
		{a: 'sakura-wood-wall', b: 'Sakura-wood Wall', c: _List_Nil},
		{
		a: 'sandy-beach-flooring',
		b: 'Sandy-beach Flooring',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{a: 'satellite', b: 'Satellite', c: _List_Nil},
		{
		a: 'sauna-heater',
		b: 'Sauna Heater',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'scarecrow',
		b: 'Scarecrow',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'scattered-papers',
		b: 'Scattered Papers',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{a: 'sci-fi-flooring', b: 'Sci-fi Flooring', c: _List_Nil},
		{a: 'sci-fi-wall', b: 'Sci-fi Wall', c: _List_Nil},
		{a: 'scorpio-lamp', b: 'Scorpio Lamp', c: _List_Nil},
		{
		a: 'shell-arch',
		b: 'Shell Arch',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'shell-bed',
		b: 'Shell Bed',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'shell-fountain',
		b: 'Shell Fountain',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'shell-lamp',
		b: 'Shell Lamp',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'shell-partition',
		b: 'Shell Partition',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'shell-rug',
		b: 'Shell Rug',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'shell-speaker',
		b: 'Shell Speaker',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'shell-stool',
		b: 'Shell Stool',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'shell-table',
		b: 'Shell Table',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{a: 'shell-wand', b: 'Shell Wand', c: _List_Nil},
		{a: 'shell-wreath', b: 'Shell Wreath', c: _List_Nil},
		{a: 'shellfish-pochette', b: 'Shellfish Pochette', c: _List_Nil},
		{a: 'shovel', b: 'Shovel', c: _List_Nil},
		{
		a: 'signpost',
		b: 'Signpost',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{a: 'silo', b: 'Silo', c: _List_Nil},
		{
		a: 'simple-diy-workbench',
		b: 'Simple DIY Workbench',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{a: 'simple-mum-crown', b: 'Simple Mum Crown', c: _List_Nil},
		{a: 'simple-well', b: 'Simple Well', c: _List_Nil},
		{a: 'simple-wooden-fence', b: 'Simple Wooden Fence', c: _List_Nil},
		{a: 'ski-slope-flooring', b: 'Ski-slope Flooring', c: _List_Nil},
		{a: 'ski-slope-wall', b: 'Ski-slope Wall', c: _List_Nil},
		{a: 'sky-egg-outfit', b: 'Sky-egg Outfit', c: _List_Nil},
		{a: 'sky-egg-shell', b: 'Sky-egg Shell', c: _List_Nil},
		{a: 'sky-egg-shoes', b: 'Sky-egg Shoes', c: _List_Nil},
		{
		a: 'sleigh',
		b: 'Sleigh',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{a: 'slingshot', b: 'Slingshot', c: _List_Nil},
		{
		a: 'small-cardboard-boxes',
		b: 'Small Cardboard Boxes',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{a: 'snazzy-pansy-wreath', b: 'Snazzy Pansy Wreath', c: _List_Nil},
		{a: 'snowflake-pochette', b: 'Snowflake Pochette', c: _List_Nil},
		{a: 'snowflake-wall', b: 'Snowflake Wall', c: _List_Nil},
		{a: 'snowflake-wreath', b: 'Snowflake Wreath', c: _List_Nil},
		{a: 'snowperson-head', b: 'Snowperson Head', c: _List_Nil},
		{a: 'space-shuttle', b: 'Space Shuttle', c: _List_Nil},
		{a: 'spiky-fence', b: 'Spiky Fence', c: _List_Nil},
		{
		a: 'stack-of-books',
		b: 'Stack Of Books',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'stacked-magazines',
		b: 'Stacked Magazines',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'stacked-wood-wall',
		b: 'Stacked-wood Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{a: 'stall', b: 'Stall', c: _List_Nil},
		{
		a: 'standard-umbrella-stand',
		b: 'Standard Umbrella Stand',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{a: 'star-clock', b: 'Star Clock', c: _List_Nil},
		{a: 'star-head', b: 'Star Head', c: _List_Nil},
		{a: 'star-pochette', b: 'Star Pochette', c: _List_Nil},
		{a: 'star-wand', b: 'Star Wand', c: _List_Nil},
		{a: 'starry-garland', b: 'Starry Garland', c: _List_Nil},
		{a: 'starry-wall', b: 'Starry Wall', c: _List_Nil},
		{a: 'starry-sands-flooring', b: 'Starry-sands Flooring', c: _List_Nil},
		{a: 'starry-sky-wall', b: 'Starry-sky Wall', c: _List_Nil},
		{a: 'steamer-basket-set', b: 'Steamer-basket Set', c: _List_Nil},
		{
		a: 'steel-flooring',
		b: 'Steel Flooring',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{
		a: 'steel-frame-wall',
		b: 'Steel-frame Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{a: 'stone-arch', b: 'Stone Arch', c: _List_Nil},
		{a: 'stone-axe', b: 'Stone Axe', c: _List_Nil},
		{a: 'stone-fence', b: 'Stone Fence', c: _List_Nil},
		{
		a: 'stone-lion-dog',
		b: 'Stone Lion-dog',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{a: 'stone-stool', b: 'Stone Stool', c: _List_Nil},
		{
		a: 'stone-table',
		b: 'Stone Table',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{a: 'stone-tablet', b: 'Stone Tablet', c: _List_Nil},
		{
		a: 'stone-wall',
		b: 'Stone Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{a: 'stone-egg-outfit', b: 'Stone-egg Outfit', c: _List_Nil},
		{a: 'stone-egg-shell', b: 'Stone-egg Shell', c: _List_Nil},
		{a: 'stone-egg-shoes', b: 'Stone-egg Shoes', c: _List_Nil},
		{a: 'straw-fence', b: 'Straw Fence', c: _List_Nil},
		{
		a: 'straw-umbrella-hat',
		b: 'Straw Umbrella Hat',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{
		a: 'street-piano',
		b: 'Street Piano',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{a: 'succulent-plant', b: 'Succulent Plant', c: _List_Nil},
		{a: 'swinging-bench', b: 'Swinging Bench', c: _List_Nil},
		{a: 'tabletop-festive-tree', b: 'Tabletop Festive Tree', c: _List_Nil},
		{
		a: 'tall-garden-rock',
		b: 'Tall Garden Rock',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{
		a: 'tall-lantern',
		b: 'Tall Lantern',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{a: 'taurus-bathtub', b: 'Taurus Bathtub', c: _List_Nil},
		{
		a: 'tea-table',
		b: 'Tea Table',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'terrarium',
		b: 'Terrarium',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{a: 'three-tiered-snowperson', b: 'Three-tiered Snowperson', c: _List_Nil},
		{
		a: 'tiki-torch',
		b: 'Tiki Torch',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'timber-doorplate',
		b: 'Timber Doorplate',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{
		a: 'tiny-library',
		b: 'Tiny Library',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{a: 'tire-stack', b: 'Tire Stack', c: _List_Nil},
		{a: 'tire-toy', b: 'Tire Toy', c: _List_Nil},
		{a: 'traditional-balancing-toy', b: 'Traditional Balancing Toy', c: _List_Nil},
		{
		a: 'traditional-straw-coat',
		b: 'Traditional Straw Coat',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{a: 'trash-bags', b: 'Trash Bags', c: _List_Nil},
		{
		a: 'tree-branch-wreath',
		b: 'Tree Branch Wreath',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'tree-standee',
		b: 'Tree Standee',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{a: 'tree-branch-wand', b: 'Tree-branch Wand', c: _List_Nil},
		{a: 'trees-bounty-arch', b: 'Tree\'s Bounty Arch', c: _List_Nil},
		{a: 'trees-bounty-big-tree', b: 'Tree\'s Bounty Big Tree', c: _List_Nil},
		{a: 'trees-bounty-lamp', b: 'Tree\'s Bounty Lamp', c: _List_Nil},
		{a: 'trees-bounty-little-tree', b: 'Tree\'s Bounty Little Tree', c: _List_Nil},
		{a: 'trees-bounty-mobile', b: 'Tree\'s Bounty Mobile', c: _List_Nil},
		{
		a: 'trophy-case',
		b: 'Trophy Case',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{a: 'tropical-vista', b: 'Tropical Vista', c: _List_Nil},
		{a: 'tulip-crown', b: 'Tulip Crown', c: _List_Nil},
		{
		a: 'tulip-surprise-box',
		b: 'Tulip Surprise Box',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{a: 'tulip-wand', b: 'Tulip Wand', c: _List_Nil},
		{a: 'tulip-wreath', b: 'Tulip Wreath', c: _List_Nil},
		{
		a: 'ukulele',
		b: 'Ukulele',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{a: 'underwater-flooring', b: 'Underwater Flooring', c: _List_Nil},
		{a: 'underwater-wall', b: 'Underwater Wall', c: _List_Nil},
		{
		a: 'unglazed-dish-set',
		b: 'Unglazed Dish Set',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{a: 'vaulting-pole', b: 'Vaulting Pole', c: _List_Nil},
		{a: 'vertical-board-fence', b: 'Vertical-board Fence', c: _List_Nil},
		{a: 'virgo-harp', b: 'Virgo Harp', c: _List_Nil},
		{a: 'wand', b: 'Wand', c: _List_Nil},
		{a: 'water-flooring', b: 'Water Flooring', c: _List_Nil},
		{
		a: 'water-pump',
		b: 'Water Pump',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{a: 'water-egg-outfit', b: 'Water-egg Outfit', c: _List_Nil},
		{a: 'water-egg-shell', b: 'Water-egg Shell', c: _List_Nil},
		{a: 'water-egg-shoes', b: 'Water-egg Shoes', c: _List_Nil},
		{a: 'watering-can', b: 'Watering Can', c: _List_Nil},
		{a: 'wave-breaker', b: 'Wave Breaker', c: _List_Nil},
		{
		a: 'western-style-stone',
		b: 'Western-style Stone',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'wild-log-bench',
		b: 'Wild Log Bench',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(1)
			])
	},
		{
		a: 'wild-wood-wall',
		b: 'Wild-wood Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{a: 'windflower-crown', b: 'Windflower Crown', c: _List_Nil},
		{
		a: 'windflower-fan',
		b: 'Windflower Fan',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{a: 'windflower-wand', b: 'Windflower Wand', c: _List_Nil},
		{a: 'windflower-wreath', b: 'Windflower Wreath', c: _List_Nil},
		{a: 'wobbling-zipper-toy', b: 'Wobbling Zipper Toy', c: _List_Nil},
		{a: 'wood-egg-outfit', b: 'Wood-egg Outfit', c: _List_Nil},
		{a: 'wood-egg-shell', b: 'Wood-egg Shell', c: _List_Nil},
		{a: 'wood-egg-shoes', b: 'Wood-egg Shoes', c: _List_Nil},
		{
		a: 'wooden-bookshelf',
		b: 'Wooden Bookshelf',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'wooden-bucket',
		b: 'Wooden Bucket',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{
		a: 'wooden-chair',
		b: 'Wooden Chair',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{
		a: 'wooden-chest',
		b: 'Wooden Chest',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'wooden-double-bed',
		b: 'Wooden Double Bed',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{
		a: 'wooden-end-table',
		b: 'Wooden End Table',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(7)
			])
	},
		{a: 'wooden-fish', b: 'Wooden Fish', c: _List_Nil},
		{
		a: 'wooden-full-length-mirror',
		b: 'Wooden Full-length Mirror',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'wooden-low-table',
		b: 'Wooden Low Table',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{
		a: 'wooden-mini-table',
		b: 'Wooden Mini Table',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'wooden-simple-bed',
		b: 'Wooden Simple Bed',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	},
		{
		a: 'wooden-stool',
		b: 'Wooden Stool',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'wooden-table',
		b: 'Wooden Table',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'wooden-table-mirror',
		b: 'Wooden Table Mirror',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'wooden-toolbox',
		b: 'Wooden Toolbox',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{a: 'wooden-wardrobe', b: 'Wooden Wardrobe', c: _List_Nil},
		{
		a: 'wooden-waste-bin',
		b: 'Wooden Waste Bin',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{
		a: 'wooden-block-bed',
		b: 'Wooden-block Bed',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'wooden-block-bench',
		b: 'Wooden-block Bench',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{a: 'wooden-block-bookshelf', b: 'Wooden-block Bookshelf', c: _List_Nil},
		{a: 'wooden-block-chair', b: 'Wooden-block Chair', c: _List_Nil},
		{
		a: 'wooden-block-chest',
		b: 'Wooden-block Chest',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{a: 'wooden-block-stereo', b: 'Wooden-block Stereo', c: _List_Nil},
		{
		a: 'wooden-block-stool',
		b: 'Wooden-block Stool',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'wooden-block-table',
		b: 'Wooden-block Table',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(5)
			])
	},
		{a: 'wooden-block-toy', b: 'Wooden-block Toy', c: _List_Nil},
		{
		a: 'wooden-block-wall-clock',
		b: 'Wooden-block Wall Clock',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(4)
			])
	},
		{
		a: 'wooden-knot-wall',
		b: 'Wooden-knot Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(6)
			])
	},
		{
		a: 'wooden-mosaic-wall',
		b: 'Wooden-mosaic Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{
		a: 'wooden-plank-sign',
		b: 'Wooden-plank Sign',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(0)
			])
	},
		{
		a: 'woodland-wall',
		b: 'Woodland Wall',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(3)
			])
	},
		{a: 'yellow-leaf-pile', b: 'Yellow-leaf Pile', c: _List_Nil},
		{a: 'zen-fence', b: 'Zen Fence', c: _List_Nil},
		{
		a: 'zen-style-stone',
		b: 'Zen-style Stone',
		c: _List_fromArray(
			[
				$author$project$Main$Villager(2)
			])
	}
	]);
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Main$decoder = $elm$json$Json$Decode$list($elm$json$Json$Decode$string);
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$init = function (flags) {
	var obtainedStorage = function () {
		var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$Main$decoder, flags);
		if (!_v0.$) {
			var s = _v0.a;
			return $elm$core$Set$fromList(s);
		} else {
			return $elm$core$Set$empty;
		}
	}();
	return _Utils_Tuple2(
		{
			K: A2($elm$core$List$map, $author$project$Main$addSourceString, $author$project$Main$availableRecipes),
			D: '',
			s: obtainedStorage
		},
		$elm$core$Platform$Cmd$none);
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Set$foldl = F3(
	function (func, initialState, _v0) {
		var dict = _v0;
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (key, _v1, state) {
					return A2(func, key, state);
				}),
			initialState,
			dict);
	});
var $elm$json$Json$Encode$set = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$Set$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Main$encode = function (model) {
	return A2($elm$json$Json$Encode$set, $elm$json$Json$Encode$string, model.s);
};
var $author$project$Main$setStorage = _Platform_outgoingPort('setStorage', $elm$core$Basics$identity);
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Set$remove = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$remove, key, dict);
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var recipe = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							s: A2($elm$core$Set$insert, recipe.a, model.s)
						}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var recipe = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							s: A2($elm$core$Set$remove, recipe.a, model.s)
						}),
					$elm$core$Platform$Cmd$none);
			default:
				var text = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{D: text}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$updateWithStorage = F2(
	function (msg, oldModel) {
		var _v0 = A2($author$project$Main$update, msg, oldModel);
		var newModel = _v0.a;
		var cmds = _v0.b;
		return _Utils_Tuple2(
			newModel,
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						$author$project$Main$setStorage(
						$author$project$Main$encode(newModel)),
						cmds
					])));
	});
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Main$Filter = function (a) {
	return {$: 2, a: a};
};
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$Attributes$for = $elm$html$Html$Attributes$stringProperty('htmlFor');
var $elm$html$Html$form = _VirtualDom_node('form');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm$html$Html$nav = _VirtualDom_node('nav');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _v0) {
				var trues = _v0.a;
				var falses = _v0.b;
				return pred(x) ? _Utils_Tuple2(
					A2($elm$core$List$cons, x, trues),
					falses) : _Utils_Tuple2(
					trues,
					A2($elm$core$List$cons, x, falses));
			});
		return A3(
			$elm$core$List$foldr,
			step,
			_Utils_Tuple2(_List_Nil, _List_Nil),
			list);
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$String$toLower = _String_toLower;
var $author$project$Main$matches = F2(
	function (keywords, recipe) {
		var fields = A2(
			$elm$core$List$map,
			$elm$core$String$toLower,
			A2($elm$core$List$cons, recipe.b, recipe.J));
		if (!keywords.b) {
			return true;
		} else {
			return A2(
				$elm$core$List$any,
				function (k) {
					return A2(
						$elm$core$List$any,
						$elm$core$String$contains(k),
						fields);
				},
				keywords);
		}
	});
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNode;
var $author$project$Main$Obtain = function (a) {
	return {$: 0, a: a};
};
var $author$project$Main$Unobtain = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$html$Html$h5 = _VirtualDom_node('h5');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$html$Html$Events$targetChecked = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'checked']),
	$elm$json$Json$Decode$bool);
var $elm$html$Html$Events$onCheck = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'change',
		A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetChecked));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $author$project$Main$recipeDiv = F2(
	function (obtained, recipe) {
		return _Utils_Tuple2(
			recipe.a,
			A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('col mb-4')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('card h-100')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('card-body')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$h5,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('card-title')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(recipe.b)
											])),
										A2(
										$elm$html$Html$p,
										_List_Nil,
										function () {
											var _v0 = recipe.c;
											if (!_v0.b) {
												return _List_fromArray(
													[
														$elm$html$Html$text('Other')
													]);
											} else {
												return A2($elm$core$List$map, $elm$html$Html$text, recipe.J);
											}
										}())
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('card-footer bg-transparent')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('form-check')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$label,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('form-check-label')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$input,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$type_('checkbox'),
																$elm$html$Html$Attributes$class('form-check-input'),
																$elm$html$Html$Events$onCheck(
																function (val) {
																	return val ? $author$project$Main$Obtain(recipe) : $author$project$Main$Unobtain(recipe);
																}),
																$elm$html$Html$Attributes$checked(obtained)
															]),
														_List_Nil),
														$elm$html$Html$text('Obtained')
													]))
											]))
									]))
							]))
					])));
	});
var $author$project$Main$recipesView = F3(
	function (obtained, recipes, filter) {
		return A3(
			$elm$html$Html$Keyed$node,
			'div',
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('row row-cols-2 row-cols-md-4')
				]),
			A2(
				$elm$core$List$map,
				$author$project$Main$recipeDiv(obtained),
				A2(
					$elm$core$List$filter,
					$author$project$Main$matches(filter),
					recipes)));
	});
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$Main$view = function (model) {
	var keywords = A2(
		$elm$core$String$split,
		' ',
		$elm$core$String$toLower(model.D));
	var section = F3(
		function (title, recipes, checked) {
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$h3,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(title)
						])),
					A3($author$project$Main$recipesView, checked, recipes, keywords)
				]);
		});
	var _v0 = A2(
		$elm$core$List$partition,
		function (r) {
			return A2($elm$core$Set$member, r.a, model.s);
		},
		model.K);
	var have = _v0.a;
	var need = _v0.b;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container')
			]),
		A2(
			$elm$core$List$cons,
			A2(
				$elm$html$Html$nav,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('navbar navbar-light bg-light')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('navbar-brand')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('ACNH DIY Recipe Tracker')
							])),
						A2(
						$elm$html$Html$form,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-inline')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('my-1 mr-2'),
										$elm$html$Html$Attributes$for('searchRecipes')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Search:')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput($author$project$Main$Filter),
										$elm$html$Html$Attributes$class('form-control'),
										$elm$html$Html$Attributes$type_('search'),
										$elm$html$Html$Attributes$id('searchRecipes')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(model.D)
									]))
							]))
					])),
			_Utils_ap(
				A3(section, 'To obtain', need, false),
				A3(section, 'Obtained', have, true))));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{
		aA: $author$project$Main$init,
		aF: $elm$core$Basics$always($elm$core$Platform$Sub$none),
		aH: $author$project$Main$updateWithStorage,
		aI: $author$project$Main$view
	});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$value)(0)}});}(this));