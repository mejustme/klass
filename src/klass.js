!function (context) {

  function methods(o) {
    for (var k in o) {
      o.hasOwnProperty(k) && wrapper.call(this, o, k);
    }
    return this;
  }

  function statics(o) {
    for (var k in o) {
      o.hasOwnProperty(k) && (this[k] = o[k]);
    }
    return this;
  }

  function wrapper (o, k) {
    var sup = this.prototype.constructor.sup;
    this.prototype[k] = function () {
      this._name = k;
      this.sup = sup;
      return o[k].apply(this, arguments);
    };
  }

  function klass(fn) {
    fn.methods = methods;
    fn.statics = statics;
    return fn;
  }

  function extend(sup, sub) {

    function fn() {
      sup.apply(this, arguments);
      sub.apply(this, arguments);
    }

    var F = function(){};
    F.prototype = sup.prototype;
    fn.prototype = new F();
    fn.methods = methods;
    fn.statics = statics;
    fn.prototype.constructor = sub;
    fn.prototype.constructor.sup = sup;

    fn.prototype.supr = function () {
      if (this.sup.prototype[this._name]) {
        return this.sup.prototype[this._name].apply(this, arguments);
      }
    };

    return fn;
  }

  function implement(inst, o) {
    inst.sup = inst.constructor.sup;
    for (var k in o) {!function() {
      if (o.hasOwnProperty(k)) {
        inst[k] = function () {
          o[k].apply(inst, arguments);
        };
      }
    }()}
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      klass: klass,
      extend: extend,
      implement: implement
    };
  } else {
    context.klass = klass;
    context.extend = extend;
    context.implement = implement;
  }

}(this);