/*!
  * Ender: open module JavaScript framework (client-lib)
  * http://enderjs.com
  * License MIT
  */

/**
 * @constructor
 * @param  {*=}      item      selector|node|collection|callback|anything
 * @param  {Object=} root   node(s) from which to base selector queries
 */
function Ender(item, root) {
  var i
  this.length = 0 // Ensure that instance owns length

  if (typeof item == 'string')
    // Start @ strings so the result parlays into the other checks
    // The .selector prop only applies to strings
    item = ender['_select'](this['selector'] = item, root)

  if (null == item) return this // Do not wrap null|undefined

  if (typeof item == 'function') ender['_closure'](item, root)

  // DOM node | scalar | not array-like
  else if (typeof item != 'object' || item.nodeType || (i = item.length) !== +i || item == item.window)
    this[this.length++] = item

  // Array-like - Bitwise ensures integer length:
  else for (this.length = i = i > 0 ? i >> 0 : 0; i--;)
    this[i] = item[i]
}

/**
 * @param  {*=}      item   selector|node|collection|callback|anything
 * @param  {Object=} root   node(s) from which to base selector queries
 * @return {Ender}
 */
function ender(item, root) {
  return new Ender(item, root)
}

// Sync the prototypes for jQuery compatibility
ender['fn'] = ender.prototype = Ender.prototype

/**
 * @enum {number} protects local symbols from being overwritten
 */
ender['reserved'] = {
  reserved: 1,
  ender: 1,
  export: 1,
  noConflict: 1,
  fn: 1
}

Ender.prototype['$'] = ender // handy reference to self

// dev tools secret sauce
Ender.prototype['splice'] = function () { throw new Error('Not implemented') }

/**
 * @param   {function(*, number, Ender)} fn
 * @param   {Object=} opt_scope
 * @return  {Ender}
 */
Ender.prototype['forEach'] = function (fn, opt_scope) {
  var i, l
  // opt out of native forEach so we can intentionally call our own scope
  // defaulting to the current item and be able to return self
  for (i = 0, l = this.length; i < l; ++i) i in this && fn.call(opt_scope || this[i], this[i], i, this)
  // return self for chaining
  return this
}

/**
 * @param {Object|Function} o
 * @param {boolean=}        chain
 */
ender['ender'] = function (o, chain) {
  var o2 = chain ? Ender.prototype : ender
  for (var k in o) !(k in ender['reserved']) && (o2[k] = o[k])
  return o2
}

/**
 * @param {string}  s
 * @param {Node=}   r
 */
ender['_select'] = function (s, r) {
  return s ? (r || document).querySelectorAll(s) : []
}

/**
 * @param {Function} fn
 */
ender['_closure'] = function (fn) {
  fn.call(document, ender)
}

if (typeof module !== 'undefined' && module['exports']) module['exports'] = ender
var $ = ender

