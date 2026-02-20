// ==UserScript==
// @name         Phoenix SOTA Form Recovery
// @namespace    https://github.com/user/phoenix-recovery
// @version      1.0.0
// @author       User
// @description  Experimental State-of-the-Art Form Recovery Userscript
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(" .phoenix-menu.svelte-10hlut0{position:absolute;background:#121212;color:#fff;border:1px solid #333;box-shadow:0 8px 32px #00000080;z-index:2147483647;width:340px;border-radius:16px;padding:12px;font-family:Inter,system-ui,sans-serif}.header.svelte-10hlut0{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:#666}.toggle.svelte-10hlut0{background:#222;color:#aaa;border:1px solid #444;padding:4px 10px;border-radius:20px;cursor:pointer;font-size:10px;transition:all .2s}.toggle.svelte-10hlut0:hover{color:#fff;border-color:#666}ul.svelte-10hlut0{list-style:none;padding:0;margin:0}li.svelte-10hlut0{padding:12px;border-radius:12px;cursor:pointer;margin-bottom:6px;background:#1a1a1a;transition:transform .2s,background .2s}li.svelte-10hlut0:hover{background:#252525;transform:translateY(-1px)}.value.svelte-10hlut0{font-size:13px;line-height:1.5;color:#ddd;display:block}.date.svelte-10hlut0{font-size:10px;color:#555;margin-top:8px;font-variant-numeric:tabular-nums}.time-machine.svelte-10hlut0{padding:4px}.preview.svelte-10hlut0{background:#000;padding:15px;border-radius:10px;min-height:100px;max-height:200px;overflow-y:auto;font-size:13px;color:#0f0;font-family:monospace;margin-bottom:15px;border:1px solid #111}.controls.svelte-10hlut0{display:flex;flex-direction:column;gap:10px}input[type=range].svelte-10hlut0{width:100%;accent-color:#0f0}.timestamp.svelte-10hlut0{font-size:11px;text-align:center;color:#888}.restore-btn.svelte-10hlut0{background:#0f0;color:#000;border:none;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;transition:opacity .2s}.restore-btn.svelte-10hlut0:hover{opacity:.8}.no-entries.svelte-10hlut0{padding:30px;text-align:center;color:#444;font-size:13px}.ghost.svelte-10u4ojw{color:#ccc;pointer-events:none;font-family:sans-serif;font-size:14px;padding-left:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;position:absolute;top:50%;transform:translateY(-50%);left:10px;pointer-events:auto;cursor:pointer} ");

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
  var _commit_callbacks, _discard_callbacks, _pending, _blocking_pending, _deferred, _dirty_effects, _maybe_dirty_effects, _skipped_branches, _decrement_queued, _Batch_instances, traverse_effect_tree_fn, defer_effects_fn, commit_fn, _anchor, _hydrate_open, _props, _children, _effect, _main_effect, _pending_effect, _failed_effect, _offscreen_fragment, _pending_anchor, _local_pending_count, _pending_count, _pending_count_update_queued, _is_creating_fallback, _dirty_effects2, _maybe_dirty_effects2, _effect_pending, _effect_pending_subscriber, _Boundary_instances, get_anchor_fn, run_fn, show_pending_snippet_fn, update_pending_count_fn, _a, _b, _batches, _onscreen, _offscreen, _outroing, _transition, _commit, _discard, _c;
  const DEV = false;
  var is_array = Array.isArray;
  var index_of = Array.prototype.indexOf;
  var includes = Array.prototype.includes;
  var array_from = Array.from;
  var define_property = Object.defineProperty;
  var get_descriptor = Object.getOwnPropertyDescriptor;
  var get_descriptors = Object.getOwnPropertyDescriptors;
  var object_prototype = Object.prototype;
  var array_prototype = Array.prototype;
  var get_prototype_of = Object.getPrototypeOf;
  var is_extensible = Object.isExtensible;
  const noop = () => {
  };
  function run_all(arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i]();
    }
  }
  function deferred() {
    var resolve;
    var reject;
    var promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  }
  const DERIVED = 1 << 1;
  const EFFECT = 1 << 2;
  const RENDER_EFFECT = 1 << 3;
  const MANAGED_EFFECT = 1 << 24;
  const BLOCK_EFFECT = 1 << 4;
  const BRANCH_EFFECT = 1 << 5;
  const ROOT_EFFECT = 1 << 6;
  const BOUNDARY_EFFECT = 1 << 7;
  const CONNECTED = 1 << 9;
  const CLEAN = 1 << 10;
  const DIRTY = 1 << 11;
  const MAYBE_DIRTY = 1 << 12;
  const INERT = 1 << 13;
  const DESTROYED = 1 << 14;
  const REACTION_RAN = 1 << 15;
  const EFFECT_TRANSPARENT = 1 << 16;
  const EAGER_EFFECT = 1 << 17;
  const HEAD_EFFECT = 1 << 18;
  const EFFECT_PRESERVED = 1 << 19;
  const USER_EFFECT = 1 << 20;
  const EFFECT_OFFSCREEN = 1 << 25;
  const WAS_MARKED = 1 << 16;
  const REACTION_IS_UPDATING = 1 << 21;
  const ASYNC = 1 << 22;
  const ERROR_VALUE = 1 << 23;
  const STATE_SYMBOL = Symbol("$state");
  const STALE_REACTION = new class StaleReactionError extends Error {
    constructor() {
      super(...arguments);
      __publicField(this, "name", "StaleReactionError");
      __publicField(this, "message", "The reaction that called `getAbortSignal()` was re-run or destroyed");
    }
  }();
  function async_derived_orphan() {
    {
      throw new Error(`https://svelte.dev/e/async_derived_orphan`);
    }
  }
  function each_key_duplicate(a, b, value) {
    {
      throw new Error(`https://svelte.dev/e/each_key_duplicate`);
    }
  }
  function effect_in_teardown(rune) {
    {
      throw new Error(`https://svelte.dev/e/effect_in_teardown`);
    }
  }
  function effect_in_unowned_derived() {
    {
      throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
    }
  }
  function effect_orphan(rune) {
    {
      throw new Error(`https://svelte.dev/e/effect_orphan`);
    }
  }
  function effect_update_depth_exceeded() {
    {
      throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
    }
  }
  function state_descriptors_fixed() {
    {
      throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
    }
  }
  function state_prototype_fixed() {
    {
      throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
    }
  }
  function state_unsafe_mutation() {
    {
      throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
    }
  }
  function svelte_boundary_reset_onerror() {
    {
      throw new Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
    }
  }
  const EACH_ITEM_REACTIVE = 1;
  const EACH_INDEX_REACTIVE = 1 << 1;
  const EACH_ITEM_IMMUTABLE = 1 << 4;
  const UNINITIALIZED = Symbol();
  const NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";
  function svelte_boundary_reset_noop() {
    {
      console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
    }
  }
  function equals(value) {
    return value === this.v;
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
  }
  function safe_equals(value) {
    return !safe_not_equal(value, this.v);
  }
  let tracing_mode_flag = false;
  let component_context = null;
  function set_component_context(context) {
    component_context = context;
  }
  function push(props, runes = false, fn) {
    component_context = {
      p: component_context,
      i: false,
      c: null,
      e: null,
      s: props,
      x: null,
      l: null
    };
  }
  function pop(component) {
    var context = (
      /** @type {ComponentContext} */
      component_context
    );
    var effects = context.e;
    if (effects !== null) {
      context.e = null;
      for (var fn of effects) {
        create_user_effect(fn);
      }
    }
    context.i = true;
    component_context = context.p;
    return (
      /** @type {T} */
      {}
    );
  }
  function is_runes() {
    return true;
  }
  let micro_tasks = [];
  function run_micro_tasks() {
    var tasks = micro_tasks;
    micro_tasks = [];
    run_all(tasks);
  }
  function queue_micro_task(fn) {
    if (micro_tasks.length === 0 && !is_flushing_sync) {
      var tasks = micro_tasks;
      queueMicrotask(() => {
        if (tasks === micro_tasks) run_micro_tasks();
      });
    }
    micro_tasks.push(fn);
  }
  function flush_tasks() {
    while (micro_tasks.length > 0) {
      run_micro_tasks();
    }
  }
  function handle_error(error) {
    var effect = active_effect;
    if (effect === null) {
      active_reaction.f |= ERROR_VALUE;
      return error;
    }
    if ((effect.f & REACTION_RAN) === 0 && (effect.f & EFFECT) === 0) {
      throw error;
    }
    invoke_error_boundary(error, effect);
  }
  function invoke_error_boundary(error, effect) {
    while (effect !== null) {
      if ((effect.f & BOUNDARY_EFFECT) !== 0) {
        if ((effect.f & REACTION_RAN) === 0) {
          throw error;
        }
        try {
          effect.b.error(error);
          return;
        } catch (e) {
          error = e;
        }
      }
      effect = effect.parent;
    }
    throw error;
  }
  const STATUS_MASK = -7169;
  function set_signal_status(signal, status) {
    signal.f = signal.f & STATUS_MASK | status;
  }
  function update_derived_status(derived2) {
    if ((derived2.f & CONNECTED) !== 0 || derived2.deps === null) {
      set_signal_status(derived2, CLEAN);
    } else {
      set_signal_status(derived2, MAYBE_DIRTY);
    }
  }
  function clear_marked(deps) {
    if (deps === null) return;
    for (const dep of deps) {
      if ((dep.f & DERIVED) === 0 || (dep.f & WAS_MARKED) === 0) {
        continue;
      }
      dep.f ^= WAS_MARKED;
      clear_marked(
        /** @type {Derived} */
        dep.deps
      );
    }
  }
  function defer_effect(effect, dirty_effects, maybe_dirty_effects) {
    if ((effect.f & DIRTY) !== 0) {
      dirty_effects.add(effect);
    } else if ((effect.f & MAYBE_DIRTY) !== 0) {
      maybe_dirty_effects.add(effect);
    }
    clear_marked(effect.deps);
    set_signal_status(effect, CLEAN);
  }
  const batches = /* @__PURE__ */ new Set();
  let current_batch = null;
  let previous_batch = null;
  let batch_values = null;
  let queued_root_effects = [];
  let last_scheduled_effect = null;
  let is_flushing = false;
  let is_flushing_sync = false;
  const _Batch = class _Batch {
    constructor() {
      __privateAdd(this, _Batch_instances);
      __publicField(this, "committed", false);
      /**
       * The current values of any sources that are updated in this batch
       * They keys of this map are identical to `this.#previous`
       * @type {Map<Source, any>}
       */
      __publicField(this, "current", /* @__PURE__ */ new Map());
      /**
       * The values of any sources that are updated in this batch _before_ those updates took place.
       * They keys of this map are identical to `this.#current`
       * @type {Map<Source, any>}
       */
      __publicField(this, "previous", /* @__PURE__ */ new Map());
      /**
       * When the batch is committed (and the DOM is updated), we need to remove old branches
       * and append new ones by calling the functions added inside (if/each/key/etc) blocks
       * @type {Set<() => void>}
       */
      __privateAdd(this, _commit_callbacks, /* @__PURE__ */ new Set());
      /**
       * If a fork is discarded, we need to destroy any effects that are no longer needed
       * @type {Set<(batch: Batch) => void>}
       */
      __privateAdd(this, _discard_callbacks, /* @__PURE__ */ new Set());
      /**
       * The number of async effects that are currently in flight
       */
      __privateAdd(this, _pending, 0);
      /**
       * The number of async effects that are currently in flight, _not_ inside a pending boundary
       */
      __privateAdd(this, _blocking_pending, 0);
      /**
       * A deferred that resolves when the batch is committed, used with `settled()`
       * TODO replace with Promise.withResolvers once supported widely enough
       * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
       */
      __privateAdd(this, _deferred, null);
      /**
       * Deferred effects (which run after async work has completed) that are DIRTY
       * @type {Set<Effect>}
       */
      __privateAdd(this, _dirty_effects, /* @__PURE__ */ new Set());
      /**
       * Deferred effects that are MAYBE_DIRTY
       * @type {Set<Effect>}
       */
      __privateAdd(this, _maybe_dirty_effects, /* @__PURE__ */ new Set());
      /**
       * A map of branches that still exist, but will be destroyed when this batch
       * is committed — we skip over these during `process`.
       * The value contains child effects that were dirty/maybe_dirty before being reset,
       * so they can be rescheduled if the branch survives.
       * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
       */
      __privateAdd(this, _skipped_branches, /* @__PURE__ */ new Map());
      __publicField(this, "is_fork", false);
      __privateAdd(this, _decrement_queued, false);
    }
    is_deferred() {
      return this.is_fork || __privateGet(this, _blocking_pending) > 0;
    }
    /**
     * Add an effect to the #skipped_branches map and reset its children
     * @param {Effect} effect
     */
    skip_effect(effect) {
      if (!__privateGet(this, _skipped_branches).has(effect)) {
        __privateGet(this, _skipped_branches).set(effect, { d: [], m: [] });
      }
    }
    /**
     * Remove an effect from the #skipped_branches map and reschedule
     * any tracked dirty/maybe_dirty child effects
     * @param {Effect} effect
     */
    unskip_effect(effect) {
      var tracked = __privateGet(this, _skipped_branches).get(effect);
      if (tracked) {
        __privateGet(this, _skipped_branches).delete(effect);
        for (var e of tracked.d) {
          set_signal_status(e, DIRTY);
          schedule_effect(e);
        }
        for (e of tracked.m) {
          set_signal_status(e, MAYBE_DIRTY);
          schedule_effect(e);
        }
      }
    }
    /**
     *
     * @param {Effect[]} root_effects
     */
    process(root_effects) {
      var _a2;
      queued_root_effects = [];
      this.apply();
      var effects = [];
      var render_effects = [];
      for (const root2 of root_effects) {
        __privateMethod(this, _Batch_instances, traverse_effect_tree_fn).call(this, root2, effects, render_effects);
      }
      if (this.is_deferred()) {
        __privateMethod(this, _Batch_instances, defer_effects_fn).call(this, render_effects);
        __privateMethod(this, _Batch_instances, defer_effects_fn).call(this, effects);
        for (const [e, t] of __privateGet(this, _skipped_branches)) {
          reset_branch(e, t);
        }
      } else {
        for (const fn of __privateGet(this, _commit_callbacks)) fn();
        __privateGet(this, _commit_callbacks).clear();
        if (__privateGet(this, _pending) === 0) {
          __privateMethod(this, _Batch_instances, commit_fn).call(this);
        }
        previous_batch = this;
        current_batch = null;
        flush_queued_effects(render_effects);
        flush_queued_effects(effects);
        previous_batch = null;
        (_a2 = __privateGet(this, _deferred)) == null ? void 0 : _a2.resolve();
      }
      batch_values = null;
    }
    /**
     * Associate a change to a given source with the current
     * batch, noting its previous and current values
     * @param {Source} source
     * @param {any} value
     */
    capture(source2, value) {
      if (value !== UNINITIALIZED && !this.previous.has(source2)) {
        this.previous.set(source2, value);
      }
      if ((source2.f & ERROR_VALUE) === 0) {
        this.current.set(source2, source2.v);
        batch_values == null ? void 0 : batch_values.set(source2, source2.v);
      }
    }
    activate() {
      current_batch = this;
      this.apply();
    }
    deactivate() {
      if (current_batch !== this) return;
      current_batch = null;
      batch_values = null;
    }
    flush() {
      this.activate();
      if (queued_root_effects.length > 0) {
        flush_effects();
        if (current_batch !== null && current_batch !== this) {
          return;
        }
      } else if (__privateGet(this, _pending) === 0) {
        this.process([]);
      }
      this.deactivate();
    }
    discard() {
      for (const fn of __privateGet(this, _discard_callbacks)) fn(this);
      __privateGet(this, _discard_callbacks).clear();
    }
    /**
     *
     * @param {boolean} blocking
     */
    increment(blocking) {
      __privateSet(this, _pending, __privateGet(this, _pending) + 1);
      if (blocking) __privateSet(this, _blocking_pending, __privateGet(this, _blocking_pending) + 1);
    }
    /**
     *
     * @param {boolean} blocking
     */
    decrement(blocking) {
      __privateSet(this, _pending, __privateGet(this, _pending) - 1);
      if (blocking) __privateSet(this, _blocking_pending, __privateGet(this, _blocking_pending) - 1);
      if (__privateGet(this, _decrement_queued)) return;
      __privateSet(this, _decrement_queued, true);
      queue_micro_task(() => {
        __privateSet(this, _decrement_queued, false);
        if (!this.is_deferred()) {
          this.revive();
        } else if (queued_root_effects.length > 0) {
          this.flush();
        }
      });
    }
    revive() {
      for (const e of __privateGet(this, _dirty_effects)) {
        __privateGet(this, _maybe_dirty_effects).delete(e);
        set_signal_status(e, DIRTY);
        schedule_effect(e);
      }
      for (const e of __privateGet(this, _maybe_dirty_effects)) {
        set_signal_status(e, MAYBE_DIRTY);
        schedule_effect(e);
      }
      this.flush();
    }
    /** @param {() => void} fn */
    oncommit(fn) {
      __privateGet(this, _commit_callbacks).add(fn);
    }
    /** @param {(batch: Batch) => void} fn */
    ondiscard(fn) {
      __privateGet(this, _discard_callbacks).add(fn);
    }
    settled() {
      return (__privateGet(this, _deferred) ?? __privateSet(this, _deferred, deferred())).promise;
    }
    static ensure() {
      if (current_batch === null) {
        const batch = current_batch = new _Batch();
        batches.add(current_batch);
        if (!is_flushing_sync) {
          queue_micro_task(() => {
            if (current_batch !== batch) {
              return;
            }
            batch.flush();
          });
        }
      }
      return current_batch;
    }
    apply() {
      return;
    }
  };
  _commit_callbacks = new WeakMap();
  _discard_callbacks = new WeakMap();
  _pending = new WeakMap();
  _blocking_pending = new WeakMap();
  _deferred = new WeakMap();
  _dirty_effects = new WeakMap();
  _maybe_dirty_effects = new WeakMap();
  _skipped_branches = new WeakMap();
  _decrement_queued = new WeakMap();
  _Batch_instances = new WeakSet();
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   * @param {Effect[]} effects
   * @param {Effect[]} render_effects
   */
  traverse_effect_tree_fn = function(root2, effects, render_effects) {
    root2.f ^= CLEAN;
    var effect = root2.first;
    var pending_boundary = null;
    while (effect !== null) {
      var flags2 = effect.f;
      var is_branch = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
      var is_skippable_branch = is_branch && (flags2 & CLEAN) !== 0;
      var skip = is_skippable_branch || (flags2 & INERT) !== 0 || __privateGet(this, _skipped_branches).has(effect);
      if (!skip && effect.fn !== null) {
        if (is_branch) {
          effect.f ^= CLEAN;
        } else if (pending_boundary !== null && (flags2 & (EFFECT | RENDER_EFFECT | MANAGED_EFFECT)) !== 0) {
          pending_boundary.b.defer_effect(effect);
        } else if ((flags2 & EFFECT) !== 0) {
          effects.push(effect);
        } else if (is_dirty(effect)) {
          if ((flags2 & BLOCK_EFFECT) !== 0) __privateGet(this, _maybe_dirty_effects).add(effect);
          update_effect(effect);
        }
        var child2 = effect.first;
        if (child2 !== null) {
          effect = child2;
          continue;
        }
      }
      var parent = effect.parent;
      effect = effect.next;
      while (effect === null && parent !== null) {
        if (parent === pending_boundary) {
          pending_boundary = null;
        }
        effect = parent.next;
        parent = parent.parent;
      }
    }
  };
  /**
   * @param {Effect[]} effects
   */
  defer_effects_fn = function(effects) {
    for (var i = 0; i < effects.length; i += 1) {
      defer_effect(effects[i], __privateGet(this, _dirty_effects), __privateGet(this, _maybe_dirty_effects));
    }
  };
  commit_fn = function() {
    var _a2;
    if (batches.size > 1) {
      this.previous.clear();
      var previous_batch_values = batch_values;
      var is_earlier = true;
      for (const batch of batches) {
        if (batch === this) {
          is_earlier = false;
          continue;
        }
        const sources = [];
        for (const [source2, value] of this.current) {
          if (batch.current.has(source2)) {
            if (is_earlier && value !== batch.current.get(source2)) {
              batch.current.set(source2, value);
            } else {
              continue;
            }
          }
          sources.push(source2);
        }
        if (sources.length === 0) {
          continue;
        }
        const others = [...batch.current.keys()].filter((s) => !this.current.has(s));
        if (others.length > 0) {
          var prev_queued_root_effects = queued_root_effects;
          queued_root_effects = [];
          const marked = /* @__PURE__ */ new Set();
          const checked = /* @__PURE__ */ new Map();
          for (const source2 of sources) {
            mark_effects(source2, others, marked, checked);
          }
          if (queued_root_effects.length > 0) {
            current_batch = batch;
            batch.apply();
            for (const root2 of queued_root_effects) {
              __privateMethod(_a2 = batch, _Batch_instances, traverse_effect_tree_fn).call(_a2, root2, [], []);
            }
            batch.deactivate();
          }
          queued_root_effects = prev_queued_root_effects;
        }
      }
      current_batch = null;
      batch_values = previous_batch_values;
    }
    this.committed = true;
    batches.delete(this);
  };
  let Batch = _Batch;
  function flushSync(fn) {
    var was_flushing_sync = is_flushing_sync;
    is_flushing_sync = true;
    try {
      var result;
      if (fn) ;
      while (true) {
        flush_tasks();
        if (queued_root_effects.length === 0) {
          current_batch == null ? void 0 : current_batch.flush();
          if (queued_root_effects.length === 0) {
            last_scheduled_effect = null;
            return (
              /** @type {T} */
              result
            );
          }
        }
        flush_effects();
      }
    } finally {
      is_flushing_sync = was_flushing_sync;
    }
  }
  function flush_effects() {
    is_flushing = true;
    try {
      var flush_count = 0;
      while (queued_root_effects.length > 0) {
        var batch = Batch.ensure();
        if (flush_count++ > 1e3) {
          var updates, entry;
          if (DEV) ;
          infinite_loop_guard();
        }
        batch.process(queued_root_effects);
        old_values.clear();
        if (DEV) ;
      }
    } finally {
      queued_root_effects = [];
      is_flushing = false;
      last_scheduled_effect = null;
    }
  }
  function infinite_loop_guard() {
    try {
      effect_update_depth_exceeded();
    } catch (error) {
      invoke_error_boundary(error, last_scheduled_effect);
    }
  }
  let eager_block_effects = null;
  function flush_queued_effects(effects) {
    var length = effects.length;
    if (length === 0) return;
    var i = 0;
    while (i < length) {
      var effect = effects[i++];
      if ((effect.f & (DESTROYED | INERT)) === 0 && is_dirty(effect)) {
        eager_block_effects = /* @__PURE__ */ new Set();
        update_effect(effect);
        if (effect.deps === null && effect.first === null && effect.nodes === null && effect.teardown === null && effect.ac === null) {
          unlink_effect(effect);
        }
        if ((eager_block_effects == null ? void 0 : eager_block_effects.size) > 0) {
          old_values.clear();
          for (const e of eager_block_effects) {
            if ((e.f & (DESTROYED | INERT)) !== 0) continue;
            const ordered_effects = [e];
            let ancestor = e.parent;
            while (ancestor !== null) {
              if (eager_block_effects.has(ancestor)) {
                eager_block_effects.delete(ancestor);
                ordered_effects.push(ancestor);
              }
              ancestor = ancestor.parent;
            }
            for (let j = ordered_effects.length - 1; j >= 0; j--) {
              const e2 = ordered_effects[j];
              if ((e2.f & (DESTROYED | INERT)) !== 0) continue;
              update_effect(e2);
            }
          }
          eager_block_effects.clear();
        }
      }
    }
    eager_block_effects = null;
  }
  function mark_effects(value, sources, marked, checked) {
    if (marked.has(value)) return;
    marked.add(value);
    if (value.reactions !== null) {
      for (const reaction of value.reactions) {
        const flags2 = reaction.f;
        if ((flags2 & DERIVED) !== 0) {
          mark_effects(
            /** @type {Derived} */
            reaction,
            sources,
            marked,
            checked
          );
        } else if ((flags2 & (ASYNC | BLOCK_EFFECT)) !== 0 && (flags2 & DIRTY) === 0 && depends_on(reaction, sources, checked)) {
          set_signal_status(reaction, DIRTY);
          schedule_effect(
            /** @type {Effect} */
            reaction
          );
        }
      }
    }
  }
  function depends_on(reaction, sources, checked) {
    const depends = checked.get(reaction);
    if (depends !== void 0) return depends;
    if (reaction.deps !== null) {
      for (const dep of reaction.deps) {
        if (includes.call(sources, dep)) {
          return true;
        }
        if ((dep.f & DERIVED) !== 0 && depends_on(
          /** @type {Derived} */
          dep,
          sources,
          checked
        )) {
          checked.set(
            /** @type {Derived} */
            dep,
            true
          );
          return true;
        }
      }
    }
    checked.set(reaction, false);
    return false;
  }
  function schedule_effect(signal) {
    var effect = last_scheduled_effect = signal;
    while (effect.parent !== null) {
      effect = effect.parent;
      var flags2 = effect.f;
      if (is_flushing && effect === active_effect && (flags2 & BLOCK_EFFECT) !== 0 && (flags2 & HEAD_EFFECT) === 0) {
        return;
      }
      if ((flags2 & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
        if ((flags2 & CLEAN) === 0) return;
        effect.f ^= CLEAN;
      }
    }
    queued_root_effects.push(effect);
  }
  function reset_branch(effect, tracked) {
    if ((effect.f & BRANCH_EFFECT) !== 0 && (effect.f & CLEAN) !== 0) {
      return;
    }
    if ((effect.f & DIRTY) !== 0) {
      tracked.d.push(effect);
    } else if ((effect.f & MAYBE_DIRTY) !== 0) {
      tracked.m.push(effect);
    }
    set_signal_status(effect, CLEAN);
    var e = effect.first;
    while (e !== null) {
      reset_branch(e, tracked);
      e = e.next;
    }
  }
  function createSubscriber(start) {
    let subscribers = 0;
    let version = source(0);
    let stop;
    return () => {
      if (effect_tracking()) {
        get(version);
        render_effect(() => {
          if (subscribers === 0) {
            stop = untrack(() => start(() => increment(version)));
          }
          subscribers += 1;
          return () => {
            queue_micro_task(() => {
              subscribers -= 1;
              if (subscribers === 0) {
                stop == null ? void 0 : stop();
                stop = void 0;
                increment(version);
              }
            });
          };
        });
      }
    };
  }
  var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED | BOUNDARY_EFFECT;
  function boundary(node, props, children) {
    new Boundary(node, props, children);
  }
  class Boundary {
    /**
     * @param {TemplateNode} node
     * @param {BoundaryProps} props
     * @param {((anchor: Node) => void)} children
     */
    constructor(node, props, children) {
      __privateAdd(this, _Boundary_instances);
      /** @type {Boundary | null} */
      __publicField(this, "parent");
      __publicField(this, "is_pending", false);
      /** @type {TemplateNode} */
      __privateAdd(this, _anchor);
      /** @type {TemplateNode | null} */
      __privateAdd(this, _hydrate_open, null);
      /** @type {BoundaryProps} */
      __privateAdd(this, _props);
      /** @type {((anchor: Node) => void)} */
      __privateAdd(this, _children);
      /** @type {Effect} */
      __privateAdd(this, _effect);
      /** @type {Effect | null} */
      __privateAdd(this, _main_effect, null);
      /** @type {Effect | null} */
      __privateAdd(this, _pending_effect, null);
      /** @type {Effect | null} */
      __privateAdd(this, _failed_effect, null);
      /** @type {DocumentFragment | null} */
      __privateAdd(this, _offscreen_fragment, null);
      /** @type {TemplateNode | null} */
      __privateAdd(this, _pending_anchor, null);
      __privateAdd(this, _local_pending_count, 0);
      __privateAdd(this, _pending_count, 0);
      __privateAdd(this, _pending_count_update_queued, false);
      __privateAdd(this, _is_creating_fallback, false);
      /** @type {Set<Effect>} */
      __privateAdd(this, _dirty_effects2, /* @__PURE__ */ new Set());
      /** @type {Set<Effect>} */
      __privateAdd(this, _maybe_dirty_effects2, /* @__PURE__ */ new Set());
      /**
       * A source containing the number of pending async deriveds/expressions.
       * Only created if `$effect.pending()` is used inside the boundary,
       * otherwise updating the source results in needless `Batch.ensure()`
       * calls followed by no-op flushes
       * @type {Source<number> | null}
       */
      __privateAdd(this, _effect_pending, null);
      __privateAdd(this, _effect_pending_subscriber, createSubscriber(() => {
        __privateSet(this, _effect_pending, source(__privateGet(this, _local_pending_count)));
        return () => {
          __privateSet(this, _effect_pending, null);
        };
      }));
      __privateSet(this, _anchor, node);
      __privateSet(this, _props, props);
      __privateSet(this, _children, children);
      this.parent = /** @type {Effect} */
      active_effect.b;
      this.is_pending = !!__privateGet(this, _props).pending;
      __privateSet(this, _effect, block(() => {
        active_effect.b = this;
        {
          var anchor = __privateMethod(this, _Boundary_instances, get_anchor_fn).call(this);
          try {
            __privateSet(this, _main_effect, branch(() => children(anchor)));
          } catch (error) {
            this.error(error);
          }
          if (__privateGet(this, _pending_count) > 0) {
            __privateMethod(this, _Boundary_instances, show_pending_snippet_fn).call(this);
          } else {
            this.is_pending = false;
          }
        }
        return () => {
          var _a2;
          (_a2 = __privateGet(this, _pending_anchor)) == null ? void 0 : _a2.remove();
        };
      }, flags));
    }
    /**
     * Defer an effect inside a pending boundary until the boundary resolves
     * @param {Effect} effect
     */
    defer_effect(effect) {
      defer_effect(effect, __privateGet(this, _dirty_effects2), __privateGet(this, _maybe_dirty_effects2));
    }
    /**
     * Returns `false` if the effect exists inside a boundary whose pending snippet is shown
     * @returns {boolean}
     */
    is_rendered() {
      return !this.is_pending && (!this.parent || this.parent.is_rendered());
    }
    has_pending_snippet() {
      return !!__privateGet(this, _props).pending;
    }
    /**
     * Update the source that powers `$effect.pending()` inside this boundary,
     * and controls when the current `pending` snippet (if any) is removed.
     * Do not call from inside the class
     * @param {1 | -1} d
     */
    update_pending_count(d) {
      __privateMethod(this, _Boundary_instances, update_pending_count_fn).call(this, d);
      __privateSet(this, _local_pending_count, __privateGet(this, _local_pending_count) + d);
      if (!__privateGet(this, _effect_pending) || __privateGet(this, _pending_count_update_queued)) return;
      __privateSet(this, _pending_count_update_queued, true);
      queue_micro_task(() => {
        __privateSet(this, _pending_count_update_queued, false);
        if (__privateGet(this, _effect_pending)) {
          internal_set(__privateGet(this, _effect_pending), __privateGet(this, _local_pending_count));
        }
      });
    }
    get_effect_pending() {
      __privateGet(this, _effect_pending_subscriber).call(this);
      return get(
        /** @type {Source<number>} */
        __privateGet(this, _effect_pending)
      );
    }
    /** @param {unknown} error */
    error(error) {
      var onerror = __privateGet(this, _props).onerror;
      let failed = __privateGet(this, _props).failed;
      if (__privateGet(this, _is_creating_fallback) || !onerror && !failed) {
        throw error;
      }
      if (__privateGet(this, _main_effect)) {
        destroy_effect(__privateGet(this, _main_effect));
        __privateSet(this, _main_effect, null);
      }
      if (__privateGet(this, _pending_effect)) {
        destroy_effect(__privateGet(this, _pending_effect));
        __privateSet(this, _pending_effect, null);
      }
      if (__privateGet(this, _failed_effect)) {
        destroy_effect(__privateGet(this, _failed_effect));
        __privateSet(this, _failed_effect, null);
      }
      var did_reset = false;
      var calling_on_error = false;
      const reset = () => {
        if (did_reset) {
          svelte_boundary_reset_noop();
          return;
        }
        did_reset = true;
        if (calling_on_error) {
          svelte_boundary_reset_onerror();
        }
        Batch.ensure();
        __privateSet(this, _local_pending_count, 0);
        if (__privateGet(this, _failed_effect) !== null) {
          pause_effect(__privateGet(this, _failed_effect), () => {
            __privateSet(this, _failed_effect, null);
          });
        }
        this.is_pending = this.has_pending_snippet();
        __privateSet(this, _main_effect, __privateMethod(this, _Boundary_instances, run_fn).call(this, () => {
          __privateSet(this, _is_creating_fallback, false);
          return branch(() => __privateGet(this, _children).call(this, __privateGet(this, _anchor)));
        }));
        if (__privateGet(this, _pending_count) > 0) {
          __privateMethod(this, _Boundary_instances, show_pending_snippet_fn).call(this);
        } else {
          this.is_pending = false;
        }
      };
      queue_micro_task(() => {
        try {
          calling_on_error = true;
          onerror == null ? void 0 : onerror(error, reset);
          calling_on_error = false;
        } catch (error2) {
          invoke_error_boundary(error2, __privateGet(this, _effect) && __privateGet(this, _effect).parent);
        }
        if (failed) {
          __privateSet(this, _failed_effect, __privateMethod(this, _Boundary_instances, run_fn).call(this, () => {
            Batch.ensure();
            __privateSet(this, _is_creating_fallback, true);
            try {
              return branch(() => {
                failed(
                  __privateGet(this, _anchor),
                  () => error,
                  () => reset
                );
              });
            } catch (error2) {
              invoke_error_boundary(
                error2,
                /** @type {Effect} */
                __privateGet(this, _effect).parent
              );
              return null;
            } finally {
              __privateSet(this, _is_creating_fallback, false);
            }
          }));
        }
      });
    }
  }
  _anchor = new WeakMap();
  _hydrate_open = new WeakMap();
  _props = new WeakMap();
  _children = new WeakMap();
  _effect = new WeakMap();
  _main_effect = new WeakMap();
  _pending_effect = new WeakMap();
  _failed_effect = new WeakMap();
  _offscreen_fragment = new WeakMap();
  _pending_anchor = new WeakMap();
  _local_pending_count = new WeakMap();
  _pending_count = new WeakMap();
  _pending_count_update_queued = new WeakMap();
  _is_creating_fallback = new WeakMap();
  _dirty_effects2 = new WeakMap();
  _maybe_dirty_effects2 = new WeakMap();
  _effect_pending = new WeakMap();
  _effect_pending_subscriber = new WeakMap();
  _Boundary_instances = new WeakSet();
  get_anchor_fn = function() {
    var anchor = __privateGet(this, _anchor);
    if (this.is_pending) {
      __privateSet(this, _pending_anchor, create_text());
      __privateGet(this, _anchor).before(__privateGet(this, _pending_anchor));
      anchor = __privateGet(this, _pending_anchor);
    }
    return anchor;
  };
  /**
   * @param {() => Effect | null} fn
   */
  run_fn = function(fn) {
    var previous_effect = active_effect;
    var previous_reaction = active_reaction;
    var previous_ctx = component_context;
    set_active_effect(__privateGet(this, _effect));
    set_active_reaction(__privateGet(this, _effect));
    set_component_context(__privateGet(this, _effect).ctx);
    try {
      return fn();
    } catch (e) {
      handle_error(e);
      return null;
    } finally {
      set_active_effect(previous_effect);
      set_active_reaction(previous_reaction);
      set_component_context(previous_ctx);
    }
  };
  show_pending_snippet_fn = function() {
    const pending = (
      /** @type {(anchor: Node) => void} */
      __privateGet(this, _props).pending
    );
    if (__privateGet(this, _main_effect) !== null) {
      __privateSet(this, _offscreen_fragment, document.createDocumentFragment());
      __privateGet(this, _offscreen_fragment).append(
        /** @type {TemplateNode} */
        __privateGet(this, _pending_anchor)
      );
      move_effect(__privateGet(this, _main_effect), __privateGet(this, _offscreen_fragment));
    }
    if (__privateGet(this, _pending_effect) === null) {
      __privateSet(this, _pending_effect, branch(() => pending(__privateGet(this, _anchor))));
    }
  };
  /**
   * Updates the pending count associated with the currently visible pending snippet,
   * if any, such that we can replace the snippet with content once work is done
   * @param {1 | -1} d
   */
  update_pending_count_fn = function(d) {
    var _a2;
    if (!this.has_pending_snippet()) {
      if (this.parent) {
        __privateMethod(_a2 = this.parent, _Boundary_instances, update_pending_count_fn).call(_a2, d);
      }
      return;
    }
    __privateSet(this, _pending_count, __privateGet(this, _pending_count) + d);
    if (__privateGet(this, _pending_count) === 0) {
      this.is_pending = false;
      for (const e of __privateGet(this, _dirty_effects2)) {
        set_signal_status(e, DIRTY);
        schedule_effect(e);
      }
      for (const e of __privateGet(this, _maybe_dirty_effects2)) {
        set_signal_status(e, MAYBE_DIRTY);
        schedule_effect(e);
      }
      __privateGet(this, _dirty_effects2).clear();
      __privateGet(this, _maybe_dirty_effects2).clear();
      if (__privateGet(this, _pending_effect)) {
        pause_effect(__privateGet(this, _pending_effect), () => {
          __privateSet(this, _pending_effect, null);
        });
      }
      if (__privateGet(this, _offscreen_fragment)) {
        __privateGet(this, _anchor).before(__privateGet(this, _offscreen_fragment));
        __privateSet(this, _offscreen_fragment, null);
      }
    }
  };
  function flatten(blockers, sync, async, fn) {
    const d = derived;
    var pending = blockers.filter((b) => !b.settled);
    if (async.length === 0 && pending.length === 0) {
      fn(sync.map(d));
      return;
    }
    var batch = current_batch;
    var parent = (
      /** @type {Effect} */
      active_effect
    );
    var restore = capture();
    var blocker_promise = pending.length === 1 ? pending[0].promise : pending.length > 1 ? Promise.all(pending.map((b) => b.promise)) : null;
    function finish(values) {
      restore();
      try {
        fn(values);
      } catch (error) {
        if ((parent.f & DESTROYED) === 0) {
          invoke_error_boundary(error, parent);
        }
      }
      batch == null ? void 0 : batch.deactivate();
      unset_context();
    }
    if (async.length === 0) {
      blocker_promise.then(() => finish(sync.map(d)));
      return;
    }
    function run() {
      restore();
      Promise.all(async.map((expression) => /* @__PURE__ */ async_derived(expression))).then((result) => finish([...sync.map(d), ...result])).catch((error) => invoke_error_boundary(error, parent));
    }
    if (blocker_promise) {
      blocker_promise.then(run);
    } else {
      run();
    }
  }
  function capture() {
    var previous_effect = active_effect;
    var previous_reaction = active_reaction;
    var previous_component_context = component_context;
    var previous_batch2 = current_batch;
    return function restore(activate_batch = true) {
      set_active_effect(previous_effect);
      set_active_reaction(previous_reaction);
      set_component_context(previous_component_context);
      if (activate_batch) previous_batch2 == null ? void 0 : previous_batch2.activate();
    };
  }
  function unset_context() {
    set_active_effect(null);
    set_active_reaction(null);
    set_component_context(null);
  }
  // @__NO_SIDE_EFFECTS__
  function derived(fn) {
    var flags2 = DERIVED | DIRTY;
    var parent_derived = active_reaction !== null && (active_reaction.f & DERIVED) !== 0 ? (
      /** @type {Derived} */
      active_reaction
    ) : null;
    if (active_effect !== null) {
      active_effect.f |= EFFECT_PRESERVED;
    }
    const signal = {
      ctx: component_context,
      deps: null,
      effects: null,
      equals,
      f: flags2,
      fn,
      reactions: null,
      rv: 0,
      v: (
        /** @type {V} */
        UNINITIALIZED
      ),
      wv: 0,
      parent: parent_derived ?? active_effect,
      ac: null
    };
    return signal;
  }
  // @__NO_SIDE_EFFECTS__
  function async_derived(fn, label, location2) {
    let parent = (
      /** @type {Effect | null} */
      active_effect
    );
    if (parent === null) {
      async_derived_orphan();
    }
    var boundary2 = (
      /** @type {Boundary} */
      parent.b
    );
    var promise = (
      /** @type {Promise<V>} */
      /** @type {unknown} */
      void 0
    );
    var signal = source(
      /** @type {V} */
      UNINITIALIZED
    );
    var should_suspend = !active_reaction;
    var deferreds = /* @__PURE__ */ new Map();
    async_effect(() => {
      var _a2;
      var d = deferred();
      promise = d.promise;
      try {
        Promise.resolve(fn()).then(d.resolve, d.reject).then(() => {
          if (batch === current_batch && batch.committed) {
            batch.deactivate();
          }
          unset_context();
        });
      } catch (error) {
        d.reject(error);
        unset_context();
      }
      var batch = (
        /** @type {Batch} */
        current_batch
      );
      if (should_suspend) {
        var blocking = boundary2.is_rendered();
        boundary2.update_pending_count(1);
        batch.increment(blocking);
        (_a2 = deferreds.get(batch)) == null ? void 0 : _a2.reject(STALE_REACTION);
        deferreds.delete(batch);
        deferreds.set(batch, d);
      }
      const handler = (value, error = void 0) => {
        batch.activate();
        if (error) {
          if (error !== STALE_REACTION) {
            signal.f |= ERROR_VALUE;
            internal_set(signal, error);
          }
        } else {
          if ((signal.f & ERROR_VALUE) !== 0) {
            signal.f ^= ERROR_VALUE;
          }
          internal_set(signal, value);
          for (const [b, d2] of deferreds) {
            deferreds.delete(b);
            if (b === batch) break;
            d2.reject(STALE_REACTION);
          }
        }
        if (should_suspend) {
          boundary2.update_pending_count(-1);
          batch.decrement(blocking);
        }
      };
      d.promise.then(handler, (e) => handler(null, e || "unknown"));
    });
    teardown(() => {
      for (const d of deferreds.values()) {
        d.reject(STALE_REACTION);
      }
    });
    return new Promise((fulfil) => {
      function next(p) {
        function go() {
          if (p === promise) {
            fulfil(signal);
          } else {
            next(promise);
          }
        }
        p.then(go, go);
      }
      next(promise);
    });
  }
  // @__NO_SIDE_EFFECTS__
  function user_derived(fn) {
    const d = /* @__PURE__ */ derived(fn);
    push_reaction_value(d);
    return d;
  }
  // @__NO_SIDE_EFFECTS__
  function derived_safe_equal(fn) {
    const signal = /* @__PURE__ */ derived(fn);
    signal.equals = safe_equals;
    return signal;
  }
  function destroy_derived_effects(derived2) {
    var effects = derived2.effects;
    if (effects !== null) {
      derived2.effects = null;
      for (var i = 0; i < effects.length; i += 1) {
        destroy_effect(
          /** @type {Effect} */
          effects[i]
        );
      }
    }
  }
  function get_derived_parent_effect(derived2) {
    var parent = derived2.parent;
    while (parent !== null) {
      if ((parent.f & DERIVED) === 0) {
        return (parent.f & DESTROYED) === 0 ? (
          /** @type {Effect} */
          parent
        ) : null;
      }
      parent = parent.parent;
    }
    return null;
  }
  function execute_derived(derived2) {
    var value;
    var prev_active_effect = active_effect;
    set_active_effect(get_derived_parent_effect(derived2));
    {
      try {
        derived2.f &= ~WAS_MARKED;
        destroy_derived_effects(derived2);
        value = update_reaction(derived2);
      } finally {
        set_active_effect(prev_active_effect);
      }
    }
    return value;
  }
  function update_derived(derived2) {
    var value = execute_derived(derived2);
    if (!derived2.equals(value)) {
      derived2.wv = increment_write_version();
      if (!(current_batch == null ? void 0 : current_batch.is_fork) || derived2.deps === null) {
        derived2.v = value;
        if (derived2.deps === null) {
          set_signal_status(derived2, CLEAN);
          return;
        }
      }
    }
    if (is_destroying_effect) {
      return;
    }
    if (batch_values !== null) {
      if (effect_tracking() || (current_batch == null ? void 0 : current_batch.is_fork)) {
        batch_values.set(derived2, value);
      }
    } else {
      update_derived_status(derived2);
    }
  }
  function freeze_derived_effects(derived2) {
    var _a2, _b2;
    if (derived2.effects === null) return;
    for (const e of derived2.effects) {
      if (e.teardown || e.ac) {
        (_a2 = e.teardown) == null ? void 0 : _a2.call(e);
        (_b2 = e.ac) == null ? void 0 : _b2.abort(STALE_REACTION);
        e.teardown = noop;
        e.ac = null;
        remove_reactions(e, 0);
        destroy_effect_children(e);
      }
    }
  }
  function unfreeze_derived_effects(derived2) {
    if (derived2.effects === null) return;
    for (const e of derived2.effects) {
      if (e.teardown) {
        update_effect(e);
      }
    }
  }
  let eager_effects = /* @__PURE__ */ new Set();
  const old_values = /* @__PURE__ */ new Map();
  let eager_effects_deferred = false;
  function source(v, stack) {
    var signal = {
      f: 0,
      // TODO ideally we could skip this altogether, but it causes type errors
      v,
      reactions: null,
      equals,
      rv: 0,
      wv: 0
    };
    return signal;
  }
  // @__NO_SIDE_EFFECTS__
  function state(v, stack) {
    const s = source(v);
    push_reaction_value(s);
    return s;
  }
  // @__NO_SIDE_EFFECTS__
  function mutable_source(initial_value, immutable = false, trackable = true) {
    const s = source(initial_value);
    if (!immutable) {
      s.equals = safe_equals;
    }
    return s;
  }
  function set(source2, value, should_proxy = false) {
    if (active_reaction !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
    // to ensure we error if state is set inside an inspect effect
    (!untracking || (active_reaction.f & EAGER_EFFECT) !== 0) && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | EAGER_EFFECT)) !== 0 && (current_sources === null || !includes.call(current_sources, source2))) {
      state_unsafe_mutation();
    }
    let new_value = should_proxy ? proxy(value) : value;
    return internal_set(source2, new_value);
  }
  function internal_set(source2, value) {
    if (!source2.equals(value)) {
      var old_value = source2.v;
      if (is_destroying_effect) {
        old_values.set(source2, value);
      } else {
        old_values.set(source2, old_value);
      }
      source2.v = value;
      var batch = Batch.ensure();
      batch.capture(source2, old_value);
      if ((source2.f & DERIVED) !== 0) {
        const derived2 = (
          /** @type {Derived} */
          source2
        );
        if ((source2.f & DIRTY) !== 0) {
          execute_derived(derived2);
        }
        update_derived_status(derived2);
      }
      source2.wv = increment_write_version();
      mark_reactions(source2, DIRTY);
      if (active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
        if (untracked_writes === null) {
          set_untracked_writes([source2]);
        } else {
          untracked_writes.push(source2);
        }
      }
      if (!batch.is_fork && eager_effects.size > 0 && !eager_effects_deferred) {
        flush_eager_effects();
      }
    }
    return value;
  }
  function flush_eager_effects() {
    eager_effects_deferred = false;
    for (const effect of eager_effects) {
      if ((effect.f & CLEAN) !== 0) {
        set_signal_status(effect, MAYBE_DIRTY);
      }
      if (is_dirty(effect)) {
        update_effect(effect);
      }
    }
    eager_effects.clear();
  }
  function increment(source2) {
    set(source2, source2.v + 1);
  }
  function mark_reactions(signal, status) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    var length = reactions.length;
    for (var i = 0; i < length; i++) {
      var reaction = reactions[i];
      var flags2 = reaction.f;
      var not_dirty = (flags2 & DIRTY) === 0;
      if (not_dirty) {
        set_signal_status(reaction, status);
      }
      if ((flags2 & DERIVED) !== 0) {
        var derived2 = (
          /** @type {Derived} */
          reaction
        );
        batch_values == null ? void 0 : batch_values.delete(derived2);
        if ((flags2 & WAS_MARKED) === 0) {
          if (flags2 & CONNECTED) {
            reaction.f |= WAS_MARKED;
          }
          mark_reactions(derived2, MAYBE_DIRTY);
        }
      } else if (not_dirty) {
        if ((flags2 & BLOCK_EFFECT) !== 0 && eager_block_effects !== null) {
          eager_block_effects.add(
            /** @type {Effect} */
            reaction
          );
        }
        schedule_effect(
          /** @type {Effect} */
          reaction
        );
      }
    }
  }
  function proxy(value) {
    if (typeof value !== "object" || value === null || STATE_SYMBOL in value) {
      return value;
    }
    const prototype = get_prototype_of(value);
    if (prototype !== object_prototype && prototype !== array_prototype) {
      return value;
    }
    var sources = /* @__PURE__ */ new Map();
    var is_proxied_array = is_array(value);
    var version = /* @__PURE__ */ state(0);
    var parent_version = update_version;
    var with_parent = (fn) => {
      if (update_version === parent_version) {
        return fn();
      }
      var reaction = active_reaction;
      var version2 = update_version;
      set_active_reaction(null);
      set_update_version(parent_version);
      var result = fn();
      set_active_reaction(reaction);
      set_update_version(version2);
      return result;
    };
    if (is_proxied_array) {
      sources.set("length", /* @__PURE__ */ state(
        /** @type {any[]} */
        value.length
      ));
    }
    return new Proxy(
      /** @type {any} */
      value,
      {
        defineProperty(_, prop2, descriptor) {
          if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
            state_descriptors_fixed();
          }
          var s = sources.get(prop2);
          if (s === void 0) {
            with_parent(() => {
              var s2 = /* @__PURE__ */ state(descriptor.value);
              sources.set(prop2, s2);
              return s2;
            });
          } else {
            set(s, descriptor.value, true);
          }
          return true;
        },
        deleteProperty(target, prop2) {
          var s = sources.get(prop2);
          if (s === void 0) {
            if (prop2 in target) {
              const s2 = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED));
              sources.set(prop2, s2);
              increment(version);
            }
          } else {
            set(s, UNINITIALIZED);
            increment(version);
          }
          return true;
        },
        get(target, prop2, receiver) {
          var _a2;
          if (prop2 === STATE_SYMBOL) {
            return value;
          }
          var s = sources.get(prop2);
          var exists = prop2 in target;
          if (s === void 0 && (!exists || ((_a2 = get_descriptor(target, prop2)) == null ? void 0 : _a2.writable))) {
            s = with_parent(() => {
              var p = proxy(exists ? target[prop2] : UNINITIALIZED);
              var s2 = /* @__PURE__ */ state(p);
              return s2;
            });
            sources.set(prop2, s);
          }
          if (s !== void 0) {
            var v = get(s);
            return v === UNINITIALIZED ? void 0 : v;
          }
          return Reflect.get(target, prop2, receiver);
        },
        getOwnPropertyDescriptor(target, prop2) {
          var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
          if (descriptor && "value" in descriptor) {
            var s = sources.get(prop2);
            if (s) descriptor.value = get(s);
          } else if (descriptor === void 0) {
            var source2 = sources.get(prop2);
            var value2 = source2 == null ? void 0 : source2.v;
            if (source2 !== void 0 && value2 !== UNINITIALIZED) {
              return {
                enumerable: true,
                configurable: true,
                value: value2,
                writable: true
              };
            }
          }
          return descriptor;
        },
        has(target, prop2) {
          var _a2;
          if (prop2 === STATE_SYMBOL) {
            return true;
          }
          var s = sources.get(prop2);
          var has = s !== void 0 && s.v !== UNINITIALIZED || Reflect.has(target, prop2);
          if (s !== void 0 || active_effect !== null && (!has || ((_a2 = get_descriptor(target, prop2)) == null ? void 0 : _a2.writable))) {
            if (s === void 0) {
              s = with_parent(() => {
                var p = has ? proxy(target[prop2]) : UNINITIALIZED;
                var s2 = /* @__PURE__ */ state(p);
                return s2;
              });
              sources.set(prop2, s);
            }
            var value2 = get(s);
            if (value2 === UNINITIALIZED) {
              return false;
            }
          }
          return has;
        },
        set(target, prop2, value2, receiver) {
          var _a2;
          var s = sources.get(prop2);
          var has = prop2 in target;
          if (is_proxied_array && prop2 === "length") {
            for (var i = value2; i < /** @type {Source<number>} */
            s.v; i += 1) {
              var other_s = sources.get(i + "");
              if (other_s !== void 0) {
                set(other_s, UNINITIALIZED);
              } else if (i in target) {
                other_s = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED));
                sources.set(i + "", other_s);
              }
            }
          }
          if (s === void 0) {
            if (!has || ((_a2 = get_descriptor(target, prop2)) == null ? void 0 : _a2.writable)) {
              s = with_parent(() => /* @__PURE__ */ state(void 0));
              set(s, proxy(value2));
              sources.set(prop2, s);
            }
          } else {
            has = s.v !== UNINITIALIZED;
            var p = with_parent(() => proxy(value2));
            set(s, p);
          }
          var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
          if (descriptor == null ? void 0 : descriptor.set) {
            descriptor.set.call(receiver, value2);
          }
          if (!has) {
            if (is_proxied_array && typeof prop2 === "string") {
              var ls = (
                /** @type {Source<number>} */
                sources.get("length")
              );
              var n = Number(prop2);
              if (Number.isInteger(n) && n >= ls.v) {
                set(ls, n + 1);
              }
            }
            increment(version);
          }
          return true;
        },
        ownKeys(target) {
          get(version);
          var own_keys = Reflect.ownKeys(target).filter((key2) => {
            var source3 = sources.get(key2);
            return source3 === void 0 || source3.v !== UNINITIALIZED;
          });
          for (var [key, source2] of sources) {
            if (source2.v !== UNINITIALIZED && !(key in target)) {
              own_keys.push(key);
            }
          }
          return own_keys;
        },
        setPrototypeOf() {
          state_prototype_fixed();
        }
      }
    );
  }
  var $window;
  var is_firefox;
  var first_child_getter;
  var next_sibling_getter;
  function init_operations() {
    if ($window !== void 0) {
      return;
    }
    $window = window;
    is_firefox = /Firefox/.test(navigator.userAgent);
    var element_prototype = Element.prototype;
    var node_prototype = Node.prototype;
    var text_prototype = Text.prototype;
    first_child_getter = get_descriptor(node_prototype, "firstChild").get;
    next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
    if (is_extensible(element_prototype)) {
      element_prototype.__click = void 0;
      element_prototype.__className = void 0;
      element_prototype.__attributes = null;
      element_prototype.__style = void 0;
      element_prototype.__e = void 0;
    }
    if (is_extensible(text_prototype)) {
      text_prototype.__t = void 0;
    }
  }
  function create_text(value = "") {
    return document.createTextNode(value);
  }
  // @__NO_SIDE_EFFECTS__
  function get_first_child(node) {
    return (
      /** @type {TemplateNode | null} */
      first_child_getter.call(node)
    );
  }
  // @__NO_SIDE_EFFECTS__
  function get_next_sibling(node) {
    return (
      /** @type {TemplateNode | null} */
      next_sibling_getter.call(node)
    );
  }
  function child(node, is_text) {
    {
      return /* @__PURE__ */ get_first_child(node);
    }
  }
  function first_child(node, is_text = false) {
    {
      var first = /* @__PURE__ */ get_first_child(node);
      if (first instanceof Comment && first.data === "") return /* @__PURE__ */ get_next_sibling(first);
      return first;
    }
  }
  function sibling(node, count = 1, is_text = false) {
    let next_sibling = node;
    while (count--) {
      next_sibling = /** @type {TemplateNode} */
      /* @__PURE__ */ get_next_sibling(next_sibling);
    }
    {
      return next_sibling;
    }
  }
  function clear_text_content(node) {
    node.textContent = "";
  }
  function create_element(tag, namespace, is) {
    let options = void 0;
    return (
      /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
      document.createElementNS(NAMESPACE_HTML, tag, options)
    );
  }
  let listening_to_form_reset = false;
  function add_form_reset_listener() {
    if (!listening_to_form_reset) {
      listening_to_form_reset = true;
      document.addEventListener(
        "reset",
        (evt) => {
          Promise.resolve().then(() => {
            var _a2;
            if (!evt.defaultPrevented) {
              for (
                const e of
                /**@type {HTMLFormElement} */
                evt.target.elements
              ) {
                (_a2 = e.__on_r) == null ? void 0 : _a2.call(e);
              }
            }
          });
        },
        // In the capture phase to guarantee we get noticed of it (no possibility of stopPropagation)
        { capture: true }
      );
    }
  }
  function without_reactive_context(fn) {
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      return fn();
    } finally {
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
  }
  function listen_to_event_and_reset_event(element, event, handler, on_reset = handler) {
    element.addEventListener(event, () => without_reactive_context(handler));
    const prev = element.__on_r;
    if (prev) {
      element.__on_r = () => {
        prev();
        on_reset(true);
      };
    } else {
      element.__on_r = () => on_reset(true);
    }
    add_form_reset_listener();
  }
  function validate_effect(rune) {
    if (active_effect === null) {
      if (active_reaction === null) {
        effect_orphan();
      }
      effect_in_unowned_derived();
    }
    if (is_destroying_effect) {
      effect_in_teardown();
    }
  }
  function push_effect(effect, parent_effect) {
    var parent_last = parent_effect.last;
    if (parent_last === null) {
      parent_effect.last = parent_effect.first = effect;
    } else {
      parent_last.next = effect;
      effect.prev = parent_last;
      parent_effect.last = effect;
    }
  }
  function create_effect(type, fn, sync) {
    var parent = active_effect;
    if (parent !== null && (parent.f & INERT) !== 0) {
      type |= INERT;
    }
    var effect = {
      ctx: component_context,
      deps: null,
      nodes: null,
      f: type | DIRTY | CONNECTED,
      first: null,
      fn,
      last: null,
      next: null,
      parent,
      b: parent && parent.b,
      prev: null,
      teardown: null,
      wv: 0,
      ac: null
    };
    if (sync) {
      try {
        update_effect(effect);
      } catch (e2) {
        destroy_effect(effect);
        throw e2;
      }
    } else if (fn !== null) {
      schedule_effect(effect);
    }
    var e = effect;
    if (sync && e.deps === null && e.teardown === null && e.nodes === null && e.first === e.last && // either `null`, or a singular child
    (e.f & EFFECT_PRESERVED) === 0) {
      e = e.first;
      if ((type & BLOCK_EFFECT) !== 0 && (type & EFFECT_TRANSPARENT) !== 0 && e !== null) {
        e.f |= EFFECT_TRANSPARENT;
      }
    }
    if (e !== null) {
      e.parent = parent;
      if (parent !== null) {
        push_effect(e, parent);
      }
      if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0 && (type & ROOT_EFFECT) === 0) {
        var derived2 = (
          /** @type {Derived} */
          active_reaction
        );
        (derived2.effects ?? (derived2.effects = [])).push(e);
      }
    }
    return effect;
  }
  function effect_tracking() {
    return active_reaction !== null && !untracking;
  }
  function teardown(fn) {
    const effect = create_effect(RENDER_EFFECT, null, false);
    set_signal_status(effect, CLEAN);
    effect.teardown = fn;
    return effect;
  }
  function user_effect(fn) {
    validate_effect();
    var flags2 = (
      /** @type {Effect} */
      active_effect.f
    );
    var defer = !active_reaction && (flags2 & BRANCH_EFFECT) !== 0 && (flags2 & REACTION_RAN) === 0;
    if (defer) {
      var context = (
        /** @type {ComponentContext} */
        component_context
      );
      (context.e ?? (context.e = [])).push(fn);
    } else {
      return create_user_effect(fn);
    }
  }
  function create_user_effect(fn) {
    return create_effect(EFFECT | USER_EFFECT, fn, false);
  }
  function component_root(fn) {
    Batch.ensure();
    const effect = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn, true);
    return (options = {}) => {
      return new Promise((fulfil) => {
        if (options.outro) {
          pause_effect(effect, () => {
            destroy_effect(effect);
            fulfil(void 0);
          });
        } else {
          destroy_effect(effect);
          fulfil(void 0);
        }
      });
    };
  }
  function async_effect(fn) {
    return create_effect(ASYNC | EFFECT_PRESERVED, fn, true);
  }
  function render_effect(fn, flags2 = 0) {
    return create_effect(RENDER_EFFECT | flags2, fn, true);
  }
  function template_effect(fn, sync = [], async = [], blockers = []) {
    flatten(blockers, sync, async, (values) => {
      create_effect(RENDER_EFFECT, () => fn(...values.map(get)), true);
    });
  }
  function block(fn, flags2 = 0) {
    var effect = create_effect(BLOCK_EFFECT | flags2, fn, true);
    return effect;
  }
  function branch(fn) {
    return create_effect(BRANCH_EFFECT | EFFECT_PRESERVED, fn, true);
  }
  function execute_effect_teardown(effect) {
    var teardown2 = effect.teardown;
    if (teardown2 !== null) {
      const previously_destroying_effect = is_destroying_effect;
      const previous_reaction = active_reaction;
      set_is_destroying_effect(true);
      set_active_reaction(null);
      try {
        teardown2.call(null);
      } finally {
        set_is_destroying_effect(previously_destroying_effect);
        set_active_reaction(previous_reaction);
      }
    }
  }
  function destroy_effect_children(signal, remove_dom = false) {
    var effect = signal.first;
    signal.first = signal.last = null;
    while (effect !== null) {
      const controller = effect.ac;
      if (controller !== null) {
        without_reactive_context(() => {
          controller.abort(STALE_REACTION);
        });
      }
      var next = effect.next;
      if ((effect.f & ROOT_EFFECT) !== 0) {
        effect.parent = null;
      } else {
        destroy_effect(effect, remove_dom);
      }
      effect = next;
    }
  }
  function destroy_block_effect_children(signal) {
    var effect = signal.first;
    while (effect !== null) {
      var next = effect.next;
      if ((effect.f & BRANCH_EFFECT) === 0) {
        destroy_effect(effect);
      }
      effect = next;
    }
  }
  function destroy_effect(effect, remove_dom = true) {
    var removed = false;
    if ((remove_dom || (effect.f & HEAD_EFFECT) !== 0) && effect.nodes !== null && effect.nodes.end !== null) {
      remove_effect_dom(
        effect.nodes.start,
        /** @type {TemplateNode} */
        effect.nodes.end
      );
      removed = true;
    }
    destroy_effect_children(effect, remove_dom && !removed);
    remove_reactions(effect, 0);
    set_signal_status(effect, DESTROYED);
    var transitions = effect.nodes && effect.nodes.t;
    if (transitions !== null) {
      for (const transition of transitions) {
        transition.stop();
      }
    }
    execute_effect_teardown(effect);
    var parent = effect.parent;
    if (parent !== null && parent.first !== null) {
      unlink_effect(effect);
    }
    effect.next = effect.prev = effect.teardown = effect.ctx = effect.deps = effect.fn = effect.nodes = effect.ac = null;
  }
  function remove_effect_dom(node, end) {
    while (node !== null) {
      var next = node === end ? null : /* @__PURE__ */ get_next_sibling(node);
      node.remove();
      node = next;
    }
  }
  function unlink_effect(effect) {
    var parent = effect.parent;
    var prev = effect.prev;
    var next = effect.next;
    if (prev !== null) prev.next = next;
    if (next !== null) next.prev = prev;
    if (parent !== null) {
      if (parent.first === effect) parent.first = next;
      if (parent.last === effect) parent.last = prev;
    }
  }
  function pause_effect(effect, callback, destroy = true) {
    var transitions = [];
    pause_children(effect, transitions, true);
    var fn = () => {
      if (destroy) destroy_effect(effect);
      if (callback) callback();
    };
    var remaining = transitions.length;
    if (remaining > 0) {
      var check = () => --remaining || fn();
      for (var transition of transitions) {
        transition.out(check);
      }
    } else {
      fn();
    }
  }
  function pause_children(effect, transitions, local) {
    if ((effect.f & INERT) !== 0) return;
    effect.f ^= INERT;
    var t = effect.nodes && effect.nodes.t;
    if (t !== null) {
      for (const transition of t) {
        if (transition.is_global || local) {
          transitions.push(transition);
        }
      }
    }
    var child2 = effect.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || // If this is a branch effect without a block effect parent,
      // it means the parent block effect was pruned. In that case,
      // transparency information was transferred to the branch effect.
      (child2.f & BRANCH_EFFECT) !== 0 && (effect.f & BLOCK_EFFECT) !== 0;
      pause_children(child2, transitions, transparent ? local : false);
      child2 = sibling2;
    }
  }
  function resume_effect(effect) {
    resume_children(effect, true);
  }
  function resume_children(effect, local) {
    if ((effect.f & INERT) === 0) return;
    effect.f ^= INERT;
    if ((effect.f & CLEAN) === 0) {
      set_signal_status(effect, DIRTY);
      schedule_effect(effect);
    }
    var child2 = effect.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
      resume_children(child2, transparent ? local : false);
      child2 = sibling2;
    }
    var t = effect.nodes && effect.nodes.t;
    if (t !== null) {
      for (const transition of t) {
        if (transition.is_global || local) {
          transition.in();
        }
      }
    }
  }
  function move_effect(effect, fragment) {
    if (!effect.nodes) return;
    var node = effect.nodes.start;
    var end = effect.nodes.end;
    while (node !== null) {
      var next = node === end ? null : /* @__PURE__ */ get_next_sibling(node);
      fragment.append(node);
      node = next;
    }
  }
  let is_updating_effect = false;
  let is_destroying_effect = false;
  function set_is_destroying_effect(value) {
    is_destroying_effect = value;
  }
  let active_reaction = null;
  let untracking = false;
  function set_active_reaction(reaction) {
    active_reaction = reaction;
  }
  let active_effect = null;
  function set_active_effect(effect) {
    active_effect = effect;
  }
  let current_sources = null;
  function push_reaction_value(value) {
    if (active_reaction !== null && true) {
      if (current_sources === null) {
        current_sources = [value];
      } else {
        current_sources.push(value);
      }
    }
  }
  let new_deps = null;
  let skipped_deps = 0;
  let untracked_writes = null;
  function set_untracked_writes(value) {
    untracked_writes = value;
  }
  let write_version = 1;
  let read_version = 0;
  let update_version = read_version;
  function set_update_version(value) {
    update_version = value;
  }
  function increment_write_version() {
    return ++write_version;
  }
  function is_dirty(reaction) {
    var flags2 = reaction.f;
    if ((flags2 & DIRTY) !== 0) {
      return true;
    }
    if (flags2 & DERIVED) {
      reaction.f &= ~WAS_MARKED;
    }
    if ((flags2 & MAYBE_DIRTY) !== 0) {
      var dependencies = (
        /** @type {Value[]} */
        reaction.deps
      );
      var length = dependencies.length;
      for (var i = 0; i < length; i++) {
        var dependency = dependencies[i];
        if (is_dirty(
          /** @type {Derived} */
          dependency
        )) {
          update_derived(
            /** @type {Derived} */
            dependency
          );
        }
        if (dependency.wv > reaction.wv) {
          return true;
        }
      }
      if ((flags2 & CONNECTED) !== 0 && // During time traveling we don't want to reset the status so that
      // traversal of the graph in the other batches still happens
      batch_values === null) {
        set_signal_status(reaction, CLEAN);
      }
    }
    return false;
  }
  function schedule_possible_effect_self_invalidation(signal, effect, root2 = true) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    if (current_sources !== null && includes.call(current_sources, signal)) {
      return;
    }
    for (var i = 0; i < reactions.length; i++) {
      var reaction = reactions[i];
      if ((reaction.f & DERIVED) !== 0) {
        schedule_possible_effect_self_invalidation(
          /** @type {Derived} */
          reaction,
          effect,
          false
        );
      } else if (effect === reaction) {
        if (root2) {
          set_signal_status(reaction, DIRTY);
        } else if ((reaction.f & CLEAN) !== 0) {
          set_signal_status(reaction, MAYBE_DIRTY);
        }
        schedule_effect(
          /** @type {Effect} */
          reaction
        );
      }
    }
  }
  function update_reaction(reaction) {
    var _a2;
    var previous_deps = new_deps;
    var previous_skipped_deps = skipped_deps;
    var previous_untracked_writes = untracked_writes;
    var previous_reaction = active_reaction;
    var previous_sources = current_sources;
    var previous_component_context = component_context;
    var previous_untracking = untracking;
    var previous_update_version = update_version;
    var flags2 = reaction.f;
    new_deps = /** @type {null | Value[]} */
    null;
    skipped_deps = 0;
    untracked_writes = null;
    active_reaction = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
    current_sources = null;
    set_component_context(reaction.ctx);
    untracking = false;
    update_version = ++read_version;
    if (reaction.ac !== null) {
      without_reactive_context(() => {
        reaction.ac.abort(STALE_REACTION);
      });
      reaction.ac = null;
    }
    try {
      reaction.f |= REACTION_IS_UPDATING;
      var fn = (
        /** @type {Function} */
        reaction.fn
      );
      var result = fn();
      reaction.f |= REACTION_RAN;
      var deps = reaction.deps;
      var is_fork = current_batch == null ? void 0 : current_batch.is_fork;
      if (new_deps !== null) {
        var i;
        if (!is_fork) {
          remove_reactions(reaction, skipped_deps);
        }
        if (deps !== null && skipped_deps > 0) {
          deps.length = skipped_deps + new_deps.length;
          for (i = 0; i < new_deps.length; i++) {
            deps[skipped_deps + i] = new_deps[i];
          }
        } else {
          reaction.deps = deps = new_deps;
        }
        if (effect_tracking() && (reaction.f & CONNECTED) !== 0) {
          for (i = skipped_deps; i < deps.length; i++) {
            ((_a2 = deps[i]).reactions ?? (_a2.reactions = [])).push(reaction);
          }
        }
      } else if (!is_fork && deps !== null && skipped_deps < deps.length) {
        remove_reactions(reaction, skipped_deps);
        deps.length = skipped_deps;
      }
      if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
        for (i = 0; i < /** @type {Source[]} */
        untracked_writes.length; i++) {
          schedule_possible_effect_self_invalidation(
            untracked_writes[i],
            /** @type {Effect} */
            reaction
          );
        }
      }
      if (previous_reaction !== null && previous_reaction !== reaction) {
        read_version++;
        if (previous_reaction.deps !== null) {
          for (let i2 = 0; i2 < previous_skipped_deps; i2 += 1) {
            previous_reaction.deps[i2].rv = read_version;
          }
        }
        if (previous_deps !== null) {
          for (const dep of previous_deps) {
            dep.rv = read_version;
          }
        }
        if (untracked_writes !== null) {
          if (previous_untracked_writes === null) {
            previous_untracked_writes = untracked_writes;
          } else {
            previous_untracked_writes.push(.../** @type {Source[]} */
            untracked_writes);
          }
        }
      }
      if ((reaction.f & ERROR_VALUE) !== 0) {
        reaction.f ^= ERROR_VALUE;
      }
      return result;
    } catch (error) {
      return handle_error(error);
    } finally {
      reaction.f ^= REACTION_IS_UPDATING;
      new_deps = previous_deps;
      skipped_deps = previous_skipped_deps;
      untracked_writes = previous_untracked_writes;
      active_reaction = previous_reaction;
      current_sources = previous_sources;
      set_component_context(previous_component_context);
      untracking = previous_untracking;
      update_version = previous_update_version;
    }
  }
  function remove_reaction(signal, dependency) {
    let reactions = dependency.reactions;
    if (reactions !== null) {
      var index2 = index_of.call(reactions, signal);
      if (index2 !== -1) {
        var new_length = reactions.length - 1;
        if (new_length === 0) {
          reactions = dependency.reactions = null;
        } else {
          reactions[index2] = reactions[new_length];
          reactions.pop();
        }
      }
    }
    if (reactions === null && (dependency.f & DERIVED) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
    // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
    // allows us to skip the expensive work of disconnecting and immediately reconnecting it
    (new_deps === null || !includes.call(new_deps, dependency))) {
      var derived2 = (
        /** @type {Derived} */
        dependency
      );
      if ((derived2.f & CONNECTED) !== 0) {
        derived2.f ^= CONNECTED;
        derived2.f &= ~WAS_MARKED;
      }
      update_derived_status(derived2);
      freeze_derived_effects(derived2);
      remove_reactions(derived2, 0);
    }
  }
  function remove_reactions(signal, start_index) {
    var dependencies = signal.deps;
    if (dependencies === null) return;
    for (var i = start_index; i < dependencies.length; i++) {
      remove_reaction(signal, dependencies[i]);
    }
  }
  function update_effect(effect) {
    var flags2 = effect.f;
    if ((flags2 & DESTROYED) !== 0) {
      return;
    }
    set_signal_status(effect, CLEAN);
    var previous_effect = active_effect;
    var was_updating_effect = is_updating_effect;
    active_effect = effect;
    is_updating_effect = true;
    try {
      if ((flags2 & (BLOCK_EFFECT | MANAGED_EFFECT)) !== 0) {
        destroy_block_effect_children(effect);
      } else {
        destroy_effect_children(effect);
      }
      execute_effect_teardown(effect);
      var teardown2 = update_reaction(effect);
      effect.teardown = typeof teardown2 === "function" ? teardown2 : null;
      effect.wv = write_version;
      var dep;
      if (DEV && tracing_mode_flag && (effect.f & DIRTY) !== 0 && effect.deps !== null) ;
    } finally {
      is_updating_effect = was_updating_effect;
      active_effect = previous_effect;
    }
  }
  async function tick() {
    await Promise.resolve();
    flushSync();
  }
  function get(signal) {
    var flags2 = signal.f;
    var is_derived = (flags2 & DERIVED) !== 0;
    if (active_reaction !== null && !untracking) {
      var destroyed = active_effect !== null && (active_effect.f & DESTROYED) !== 0;
      if (!destroyed && (current_sources === null || !includes.call(current_sources, signal))) {
        var deps = active_reaction.deps;
        if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
          if (signal.rv < read_version) {
            signal.rv = read_version;
            if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
              skipped_deps++;
            } else if (new_deps === null) {
              new_deps = [signal];
            } else {
              new_deps.push(signal);
            }
          }
        } else {
          (active_reaction.deps ?? (active_reaction.deps = [])).push(signal);
          var reactions = signal.reactions;
          if (reactions === null) {
            signal.reactions = [active_reaction];
          } else if (!includes.call(reactions, active_reaction)) {
            reactions.push(active_reaction);
          }
        }
      }
    }
    if (is_destroying_effect && old_values.has(signal)) {
      return old_values.get(signal);
    }
    if (is_derived) {
      var derived2 = (
        /** @type {Derived} */
        signal
      );
      if (is_destroying_effect) {
        var value = derived2.v;
        if ((derived2.f & CLEAN) === 0 && derived2.reactions !== null || depends_on_old_values(derived2)) {
          value = execute_derived(derived2);
        }
        old_values.set(derived2, value);
        return value;
      }
      var should_connect = (derived2.f & CONNECTED) === 0 && !untracking && active_reaction !== null && (is_updating_effect || (active_reaction.f & CONNECTED) !== 0);
      var is_new = (derived2.f & REACTION_RAN) === 0;
      if (is_dirty(derived2)) {
        if (should_connect) {
          derived2.f |= CONNECTED;
        }
        update_derived(derived2);
      }
      if (should_connect && !is_new) {
        unfreeze_derived_effects(derived2);
        reconnect(derived2);
      }
    }
    if (batch_values == null ? void 0 : batch_values.has(signal)) {
      return batch_values.get(signal);
    }
    if ((signal.f & ERROR_VALUE) !== 0) {
      throw signal.v;
    }
    return signal.v;
  }
  function reconnect(derived2) {
    derived2.f |= CONNECTED;
    if (derived2.deps === null) return;
    for (const dep of derived2.deps) {
      (dep.reactions ?? (dep.reactions = [])).push(derived2);
      if ((dep.f & DERIVED) !== 0 && (dep.f & CONNECTED) === 0) {
        unfreeze_derived_effects(
          /** @type {Derived} */
          dep
        );
        reconnect(
          /** @type {Derived} */
          dep
        );
      }
    }
  }
  function depends_on_old_values(derived2) {
    if (derived2.v === UNINITIALIZED) return true;
    if (derived2.deps === null) return false;
    for (const dep of derived2.deps) {
      if (old_values.has(dep)) {
        return true;
      }
      if ((dep.f & DERIVED) !== 0 && depends_on_old_values(
        /** @type {Derived} */
        dep
      )) {
        return true;
      }
    }
    return false;
  }
  function untrack(fn) {
    var previous_untracking = untracking;
    try {
      untracking = true;
      return fn();
    } finally {
      untracking = previous_untracking;
    }
  }
  const PASSIVE_EVENTS = ["touchstart", "touchmove"];
  function is_passive_event(name) {
    return PASSIVE_EVENTS.includes(name);
  }
  const event_symbol = Symbol("events");
  const all_registered_events = /* @__PURE__ */ new Set();
  const root_event_handles = /* @__PURE__ */ new Set();
  function delegated(event_name, element, handler) {
    (element[event_symbol] ?? (element[event_symbol] = {}))[event_name] = handler;
  }
  function delegate(events) {
    for (var i = 0; i < events.length; i++) {
      all_registered_events.add(events[i]);
    }
    for (var fn of root_event_handles) {
      fn(events);
    }
  }
  let last_propagated_event = null;
  function handle_event_propagation(event) {
    var _a2, _b2;
    var handler_element = this;
    var owner_document = (
      /** @type {Node} */
      handler_element.ownerDocument
    );
    var event_name = event.type;
    var path = ((_a2 = event.composedPath) == null ? void 0 : _a2.call(event)) || [];
    var current_target = (
      /** @type {null | Element} */
      path[0] || event.target
    );
    last_propagated_event = event;
    var path_idx = 0;
    var handled_at = last_propagated_event === event && event.__root;
    if (handled_at) {
      var at_idx = path.indexOf(handled_at);
      if (at_idx !== -1 && (handler_element === document || handler_element === /** @type {any} */
      window)) {
        event.__root = handler_element;
        return;
      }
      var handler_idx = path.indexOf(handler_element);
      if (handler_idx === -1) {
        return;
      }
      if (at_idx <= handler_idx) {
        path_idx = at_idx;
      }
    }
    current_target = /** @type {Element} */
    path[path_idx] || event.target;
    if (current_target === handler_element) return;
    define_property(event, "currentTarget", {
      configurable: true,
      get() {
        return current_target || owner_document;
      }
    });
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      var throw_error;
      var other_errors = [];
      while (current_target !== null) {
        var parent_element = current_target.assignedSlot || current_target.parentNode || /** @type {any} */
        current_target.host || null;
        try {
          var delegated2 = (_b2 = current_target[event_symbol]) == null ? void 0 : _b2[event_name];
          if (delegated2 != null && (!/** @type {any} */
          current_target.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          event.target === current_target)) {
            delegated2.call(current_target, event);
          }
        } catch (error) {
          if (throw_error) {
            other_errors.push(error);
          } else {
            throw_error = error;
          }
        }
        if (event.cancelBubble || parent_element === handler_element || parent_element === null) {
          break;
        }
        current_target = parent_element;
      }
      if (throw_error) {
        for (let error of other_errors) {
          queueMicrotask(() => {
            throw error;
          });
        }
        throw throw_error;
      }
    } finally {
      event.__root = handler_element;
      delete event.currentTarget;
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
  }
  const policy = (_b = (_a = globalThis == null ? void 0 : globalThis.window) == null ? void 0 : _a.trustedTypes) == null ? void 0 : /* @__PURE__ */ _b.createPolicy(
    "svelte-trusted-html",
    {
      /** @param {string} html */
      createHTML: (html) => {
        return html;
      }
    }
  );
  function create_trusted_html(html) {
    return (
      /** @type {string} */
      (policy == null ? void 0 : policy.createHTML(html)) ?? html
    );
  }
  function create_fragment_from_html(html, trusted = false) {
    var elem = create_element("template");
    html = html.replaceAll("<!>", "<!---->");
    elem.innerHTML = trusted ? create_trusted_html(html) : html;
    return elem.content;
  }
  function assign_nodes(start, end) {
    var effect = (
      /** @type {Effect} */
      active_effect
    );
    if (effect.nodes === null) {
      effect.nodes = { start, end, a: null, t: null };
    }
  }
  // @__NO_SIDE_EFFECTS__
  function from_html(content, flags2) {
    var node;
    var has_start = !content.startsWith("<!>");
    return () => {
      if (node === void 0) {
        node = create_fragment_from_html(has_start ? content : "<!>" + content, true);
        node = /** @type {TemplateNode} */
        /* @__PURE__ */ get_first_child(node);
      }
      var clone = (
        /** @type {TemplateNode} */
        is_firefox ? document.importNode(node, true) : node.cloneNode(true)
      );
      {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
  function comment() {
    var frag = document.createDocumentFragment();
    var start = document.createComment("");
    var anchor = create_text();
    frag.append(start, anchor);
    assign_nodes(start, anchor);
    return frag;
  }
  function append(anchor, dom) {
    if (anchor === null) {
      return;
    }
    anchor.before(
      /** @type {Node} */
      dom
    );
  }
  function set_text(text, value) {
    var str = value == null ? "" : typeof value === "object" ? value + "" : value;
    if (str !== (text.__t ?? (text.__t = text.nodeValue))) {
      text.__t = str;
      text.nodeValue = str + "";
    }
  }
  function mount(component, options) {
    return _mount(component, options);
  }
  const listeners = /* @__PURE__ */ new Map();
  function _mount(Component, { target, anchor, props = {}, events, context, intro = true }) {
    init_operations();
    var registered_events = /* @__PURE__ */ new Set();
    var event_handle = (events2) => {
      for (var i = 0; i < events2.length; i++) {
        var event_name = events2[i];
        if (registered_events.has(event_name)) continue;
        registered_events.add(event_name);
        var passive = is_passive_event(event_name);
        for (const node of [target, document]) {
          var counts = listeners.get(node);
          if (counts === void 0) {
            counts = /* @__PURE__ */ new Map();
            listeners.set(node, counts);
          }
          var count = counts.get(event_name);
          if (count === void 0) {
            node.addEventListener(event_name, handle_event_propagation, { passive });
            counts.set(event_name, 1);
          } else {
            counts.set(event_name, count + 1);
          }
        }
      }
    };
    event_handle(array_from(all_registered_events));
    root_event_handles.add(event_handle);
    var component = void 0;
    var unmount = component_root(() => {
      var anchor_node = anchor ?? target.appendChild(create_text());
      boundary(
        /** @type {TemplateNode} */
        anchor_node,
        {
          pending: () => {
          }
        },
        (anchor_node2) => {
          push({});
          var ctx = (
            /** @type {ComponentContext} */
            component_context
          );
          if (context) ctx.c = context;
          if (events) {
            props.$$events = events;
          }
          component = Component(anchor_node2, props) || {};
          pop();
        }
      );
      return () => {
        var _a2;
        for (var event_name of registered_events) {
          for (const node of [target, document]) {
            var counts = (
              /** @type {Map<string, number>} */
              listeners.get(node)
            );
            var count = (
              /** @type {number} */
              counts.get(event_name)
            );
            if (--count == 0) {
              node.removeEventListener(event_name, handle_event_propagation);
              counts.delete(event_name);
              if (counts.size === 0) {
                listeners.delete(node);
              }
            } else {
              counts.set(event_name, count);
            }
          }
        }
        root_event_handles.delete(event_handle);
        if (anchor_node !== anchor) {
          (_a2 = anchor_node.parentNode) == null ? void 0 : _a2.removeChild(anchor_node);
        }
      };
    });
    mounted_components.set(component, unmount);
    return component;
  }
  let mounted_components = /* @__PURE__ */ new WeakMap();
  class BranchManager {
    /**
     * @param {TemplateNode} anchor
     * @param {boolean} transition
     */
    constructor(anchor, transition = true) {
      /** @type {TemplateNode} */
      __publicField(this, "anchor");
      /** @type {Map<Batch, Key>} */
      __privateAdd(this, _batches, /* @__PURE__ */ new Map());
      /**
       * Map of keys to effects that are currently rendered in the DOM.
       * These effects are visible and actively part of the document tree.
       * Example:
       * ```
       * {#if condition}
       * 	foo
       * {:else}
       * 	bar
       * {/if}
       * ```
       * Can result in the entries `true->Effect` and `false->Effect`
       * @type {Map<Key, Effect>}
       */
      __privateAdd(this, _onscreen, /* @__PURE__ */ new Map());
      /**
       * Similar to #onscreen with respect to the keys, but contains branches that are not yet
       * in the DOM, because their insertion is deferred.
       * @type {Map<Key, Branch>}
       */
      __privateAdd(this, _offscreen, /* @__PURE__ */ new Map());
      /**
       * Keys of effects that are currently outroing
       * @type {Set<Key>}
       */
      __privateAdd(this, _outroing, /* @__PURE__ */ new Set());
      /**
       * Whether to pause (i.e. outro) on change, or destroy immediately.
       * This is necessary for `<svelte:element>`
       */
      __privateAdd(this, _transition, true);
      __privateAdd(this, _commit, () => {
        var batch = (
          /** @type {Batch} */
          current_batch
        );
        if (!__privateGet(this, _batches).has(batch)) return;
        var key = (
          /** @type {Key} */
          __privateGet(this, _batches).get(batch)
        );
        var onscreen = __privateGet(this, _onscreen).get(key);
        if (onscreen) {
          resume_effect(onscreen);
          __privateGet(this, _outroing).delete(key);
        } else {
          var offscreen = __privateGet(this, _offscreen).get(key);
          if (offscreen) {
            __privateGet(this, _onscreen).set(key, offscreen.effect);
            __privateGet(this, _offscreen).delete(key);
            offscreen.fragment.lastChild.remove();
            this.anchor.before(offscreen.fragment);
            onscreen = offscreen.effect;
          }
        }
        for (const [b, k] of __privateGet(this, _batches)) {
          __privateGet(this, _batches).delete(b);
          if (b === batch) {
            break;
          }
          const offscreen2 = __privateGet(this, _offscreen).get(k);
          if (offscreen2) {
            destroy_effect(offscreen2.effect);
            __privateGet(this, _offscreen).delete(k);
          }
        }
        for (const [k, effect] of __privateGet(this, _onscreen)) {
          if (k === key || __privateGet(this, _outroing).has(k)) continue;
          const on_destroy = () => {
            const keys = Array.from(__privateGet(this, _batches).values());
            if (keys.includes(k)) {
              var fragment = document.createDocumentFragment();
              move_effect(effect, fragment);
              fragment.append(create_text());
              __privateGet(this, _offscreen).set(k, { effect, fragment });
            } else {
              destroy_effect(effect);
            }
            __privateGet(this, _outroing).delete(k);
            __privateGet(this, _onscreen).delete(k);
          };
          if (__privateGet(this, _transition) || !onscreen) {
            __privateGet(this, _outroing).add(k);
            pause_effect(effect, on_destroy, false);
          } else {
            on_destroy();
          }
        }
      });
      /**
       * @param {Batch} batch
       */
      __privateAdd(this, _discard, (batch) => {
        __privateGet(this, _batches).delete(batch);
        const keys = Array.from(__privateGet(this, _batches).values());
        for (const [k, branch2] of __privateGet(this, _offscreen)) {
          if (!keys.includes(k)) {
            destroy_effect(branch2.effect);
            __privateGet(this, _offscreen).delete(k);
          }
        }
      });
      this.anchor = anchor;
      __privateSet(this, _transition, transition);
    }
    /**
     *
     * @param {any} key
     * @param {null | ((target: TemplateNode) => void)} fn
     */
    ensure(key, fn) {
      var batch = (
        /** @type {Batch} */
        current_batch
      );
      if (fn && !__privateGet(this, _onscreen).has(key) && !__privateGet(this, _offscreen).has(key)) {
        {
          __privateGet(this, _onscreen).set(
            key,
            branch(() => fn(this.anchor))
          );
        }
      }
      __privateGet(this, _batches).set(batch, key);
      {
        __privateGet(this, _commit).call(this);
      }
    }
  }
  _batches = new WeakMap();
  _onscreen = new WeakMap();
  _offscreen = new WeakMap();
  _outroing = new WeakMap();
  _transition = new WeakMap();
  _commit = new WeakMap();
  _discard = new WeakMap();
  function if_block(node, fn, elseif = false) {
    var branches = new BranchManager(node);
    var flags2 = elseif ? EFFECT_TRANSPARENT : 0;
    function update_branch(key, fn2) {
      branches.ensure(key, fn2);
    }
    block(() => {
      var has_branch = false;
      fn((fn2, key = 0) => {
        has_branch = true;
        update_branch(key, fn2);
      });
      if (!has_branch) {
        update_branch(false, null);
      }
    }, flags2);
  }
  function index(_, i) {
    return i;
  }
  function pause_effects(state2, to_destroy, controlled_anchor) {
    var transitions = [];
    var length = to_destroy.length;
    var group;
    var remaining = to_destroy.length;
    for (var i = 0; i < length; i++) {
      let effect = to_destroy[i];
      pause_effect(
        effect,
        () => {
          if (group) {
            group.pending.delete(effect);
            group.done.add(effect);
            if (group.pending.size === 0) {
              var groups = (
                /** @type {Set<EachOutroGroup>} */
                state2.outrogroups
              );
              destroy_effects(array_from(group.done));
              groups.delete(group);
              if (groups.size === 0) {
                state2.outrogroups = null;
              }
            }
          } else {
            remaining -= 1;
          }
        },
        false
      );
    }
    if (remaining === 0) {
      var fast_path = transitions.length === 0 && controlled_anchor !== null;
      if (fast_path) {
        var anchor = (
          /** @type {Element} */
          controlled_anchor
        );
        var parent_node = (
          /** @type {Element} */
          anchor.parentNode
        );
        clear_text_content(parent_node);
        parent_node.append(anchor);
        state2.items.clear();
      }
      destroy_effects(to_destroy, !fast_path);
    } else {
      group = {
        pending: new Set(to_destroy),
        done: /* @__PURE__ */ new Set()
      };
      (state2.outrogroups ?? (state2.outrogroups = /* @__PURE__ */ new Set())).add(group);
    }
  }
  function destroy_effects(to_destroy, remove_dom = true) {
    for (var i = 0; i < to_destroy.length; i++) {
      destroy_effect(to_destroy[i], remove_dom);
    }
  }
  var offscreen_anchor;
  function each(node, flags2, get_collection, get_key, render_fn, fallback_fn = null) {
    var anchor = node;
    var items = /* @__PURE__ */ new Map();
    {
      var parent_node = (
        /** @type {Element} */
        node
      );
      anchor = parent_node.appendChild(create_text());
    }
    var fallback = null;
    var each_array = /* @__PURE__ */ derived_safe_equal(() => {
      var collection = get_collection();
      return is_array(collection) ? collection : collection == null ? [] : array_from(collection);
    });
    var array;
    var first_run = true;
    function commit() {
      state2.fallback = fallback;
      reconcile(state2, array, anchor, flags2, get_key);
      if (fallback !== null) {
        if (array.length === 0) {
          if ((fallback.f & EFFECT_OFFSCREEN) === 0) {
            resume_effect(fallback);
          } else {
            fallback.f ^= EFFECT_OFFSCREEN;
            move(fallback, null, anchor);
          }
        } else {
          pause_effect(fallback, () => {
            fallback = null;
          });
        }
      }
    }
    var effect = block(() => {
      array = /** @type {V[]} */
      get(each_array);
      var length = array.length;
      var keys = /* @__PURE__ */ new Set();
      for (var index2 = 0; index2 < length; index2 += 1) {
        var value = array[index2];
        var key = get_key(value, index2);
        var item = first_run ? null : items.get(key);
        if (item) {
          if (item.v) internal_set(item.v, value);
          if (item.i) internal_set(item.i, index2);
        } else {
          item = create_item(
            items,
            first_run ? anchor : offscreen_anchor ?? (offscreen_anchor = create_text()),
            value,
            key,
            index2,
            render_fn,
            flags2,
            get_collection
          );
          if (!first_run) {
            item.e.f |= EFFECT_OFFSCREEN;
          }
          items.set(key, item);
        }
        keys.add(key);
      }
      if (length === 0 && fallback_fn && !fallback) {
        if (first_run) {
          fallback = branch(() => fallback_fn(anchor));
        } else {
          fallback = branch(() => fallback_fn(offscreen_anchor ?? (offscreen_anchor = create_text())));
          fallback.f |= EFFECT_OFFSCREEN;
        }
      }
      if (length > keys.size) {
        {
          each_key_duplicate();
        }
      }
      if (!first_run) {
        {
          commit();
        }
      }
      get(each_array);
    });
    var state2 = { effect, items, outrogroups: null, fallback };
    first_run = false;
  }
  function skip_to_branch(effect) {
    while (effect !== null && (effect.f & BRANCH_EFFECT) === 0) {
      effect = effect.next;
    }
    return effect;
  }
  function reconcile(state2, array, anchor, flags2, get_key) {
    var _a2;
    var length = array.length;
    var items = state2.items;
    var current = skip_to_branch(state2.effect.first);
    var seen;
    var prev = null;
    var matched = [];
    var stashed = [];
    var value;
    var key;
    var effect;
    var i;
    for (i = 0; i < length; i += 1) {
      value = array[i];
      key = get_key(value, i);
      effect = /** @type {EachItem} */
      items.get(key).e;
      if (state2.outrogroups !== null) {
        for (const group of state2.outrogroups) {
          group.pending.delete(effect);
          group.done.delete(effect);
        }
      }
      if ((effect.f & EFFECT_OFFSCREEN) !== 0) {
        effect.f ^= EFFECT_OFFSCREEN;
        if (effect === current) {
          move(effect, null, anchor);
        } else {
          var next = prev ? prev.next : current;
          if (effect === state2.effect.last) {
            state2.effect.last = effect.prev;
          }
          if (effect.prev) effect.prev.next = effect.next;
          if (effect.next) effect.next.prev = effect.prev;
          link(state2, prev, effect);
          link(state2, effect, next);
          move(effect, next, anchor);
          prev = effect;
          matched = [];
          stashed = [];
          current = skip_to_branch(prev.next);
          continue;
        }
      }
      if ((effect.f & INERT) !== 0) {
        resume_effect(effect);
      }
      if (effect !== current) {
        if (seen !== void 0 && seen.has(effect)) {
          if (matched.length < stashed.length) {
            var start = stashed[0];
            var j;
            prev = start.prev;
            var a = matched[0];
            var b = matched[matched.length - 1];
            for (j = 0; j < matched.length; j += 1) {
              move(matched[j], start, anchor);
            }
            for (j = 0; j < stashed.length; j += 1) {
              seen.delete(stashed[j]);
            }
            link(state2, a.prev, b.next);
            link(state2, prev, a);
            link(state2, b, start);
            current = start;
            prev = b;
            i -= 1;
            matched = [];
            stashed = [];
          } else {
            seen.delete(effect);
            move(effect, current, anchor);
            link(state2, effect.prev, effect.next);
            link(state2, effect, prev === null ? state2.effect.first : prev.next);
            link(state2, prev, effect);
            prev = effect;
          }
          continue;
        }
        matched = [];
        stashed = [];
        while (current !== null && current !== effect) {
          (seen ?? (seen = /* @__PURE__ */ new Set())).add(current);
          stashed.push(current);
          current = skip_to_branch(current.next);
        }
        if (current === null) {
          continue;
        }
      }
      if ((effect.f & EFFECT_OFFSCREEN) === 0) {
        matched.push(effect);
      }
      prev = effect;
      current = skip_to_branch(effect.next);
    }
    if (state2.outrogroups !== null) {
      for (const group of state2.outrogroups) {
        if (group.pending.size === 0) {
          destroy_effects(array_from(group.done));
          (_a2 = state2.outrogroups) == null ? void 0 : _a2.delete(group);
        }
      }
      if (state2.outrogroups.size === 0) {
        state2.outrogroups = null;
      }
    }
    if (current !== null || seen !== void 0) {
      var to_destroy = [];
      if (seen !== void 0) {
        for (effect of seen) {
          if ((effect.f & INERT) === 0) {
            to_destroy.push(effect);
          }
        }
      }
      while (current !== null) {
        if ((current.f & INERT) === 0 && current !== state2.fallback) {
          to_destroy.push(current);
        }
        current = skip_to_branch(current.next);
      }
      var destroy_length = to_destroy.length;
      if (destroy_length > 0) {
        var controlled_anchor = length === 0 ? anchor : null;
        pause_effects(state2, to_destroy, controlled_anchor);
      }
    }
  }
  function create_item(items, anchor, value, key, index2, render_fn, flags2, get_collection) {
    var v = (flags2 & EACH_ITEM_REACTIVE) !== 0 ? (flags2 & EACH_ITEM_IMMUTABLE) === 0 ? /* @__PURE__ */ mutable_source(value, false, false) : source(value) : null;
    var i = (flags2 & EACH_INDEX_REACTIVE) !== 0 ? source(index2) : null;
    return {
      v,
      i,
      e: branch(() => {
        render_fn(anchor, v ?? value, i ?? index2, get_collection);
        return () => {
          items.delete(key);
        };
      })
    };
  }
  function move(effect, next, anchor) {
    if (!effect.nodes) return;
    var node = effect.nodes.start;
    var end = effect.nodes.end;
    var dest = next && (next.f & EFFECT_OFFSCREEN) === 0 ? (
      /** @type {EffectNodes} */
      next.nodes.start
    ) : anchor;
    while (node !== null) {
      var next_node = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_next_sibling(node)
      );
      dest.before(node);
      if (node === end) {
        return;
      }
      node = next_node;
    }
  }
  function link(state2, prev, next) {
    if (prev === null) {
      state2.effect.first = next;
    } else {
      prev.next = next;
    }
    if (next === null) {
      state2.effect.last = prev;
    } else {
      next.prev = prev;
    }
  }
  const IS_CUSTOM_ELEMENT = Symbol("is custom element");
  const IS_HTML = Symbol("is html");
  function set_attribute(element, attribute, value, skip_warning) {
    var attributes = get_attributes(element);
    if (attributes[attribute] === (attributes[attribute] = value)) return;
    if (value == null) {
      element.removeAttribute(attribute);
    } else if (typeof value !== "string" && get_setters(element).includes(attribute)) {
      element[attribute] = value;
    } else {
      element.setAttribute(attribute, value);
    }
  }
  function get_attributes(element) {
    return (
      /** @type {Record<string | symbol, unknown>} **/
      // @ts-expect-error
      element.__attributes ?? (element.__attributes = {
        [IS_CUSTOM_ELEMENT]: element.nodeName.includes("-"),
        [IS_HTML]: element.namespaceURI === NAMESPACE_HTML
      })
    );
  }
  var setters_cache = /* @__PURE__ */ new Map();
  function get_setters(element) {
    var cache_key = element.getAttribute("is") || element.nodeName;
    var setters = setters_cache.get(cache_key);
    if (setters) return setters;
    setters_cache.set(cache_key, setters = []);
    var descriptors;
    var proto = element;
    var element_proto = Element.prototype;
    while (element_proto !== proto) {
      descriptors = get_descriptors(proto);
      for (var key in descriptors) {
        if (descriptors[key].set) {
          setters.push(key);
        }
      }
      proto = get_prototype_of(proto);
    }
    return setters;
  }
  function bind_value(input, get2, set2 = get2) {
    var batches2 = /* @__PURE__ */ new WeakSet();
    listen_to_event_and_reset_event(input, "input", async (is_reset) => {
      var value = is_reset ? input.defaultValue : input.value;
      value = is_numberlike_input(input) ? to_number(value) : value;
      set2(value);
      if (current_batch !== null) {
        batches2.add(current_batch);
      }
      await tick();
      if (value !== (value = get2())) {
        var start = input.selectionStart;
        var end = input.selectionEnd;
        var length = input.value.length;
        input.value = value ?? "";
        if (end !== null) {
          var new_length = input.value.length;
          if (start === end && end === length && new_length > length) {
            input.selectionStart = new_length;
            input.selectionEnd = new_length;
          } else {
            input.selectionStart = start;
            input.selectionEnd = Math.min(end, new_length);
          }
        }
      }
    });
    if (
      // If we are hydrating and the value has since changed,
      // then use the updated value from the input instead.
      // If defaultValue is set, then value == defaultValue
      // TODO Svelte 6: remove input.value check and set to empty string?
      untrack(get2) == null && input.value
    ) {
      set2(is_numberlike_input(input) ? to_number(input.value) : input.value);
      if (current_batch !== null) {
        batches2.add(current_batch);
      }
    }
    render_effect(() => {
      var value = get2();
      if (input === document.activeElement) {
        var batch = (
          /** @type {Batch} */
          previous_batch ?? current_batch
        );
        if (batches2.has(batch)) {
          return;
        }
      }
      if (is_numberlike_input(input) && value === to_number(input.value)) {
        return;
      }
      if (input.type === "date" && !value && !input.value) {
        return;
      }
      if (value !== input.value) {
        input.value = value ?? "";
      }
    });
  }
  function is_numberlike_input(input) {
    var type = input.type;
    return type === "number" || type === "range";
  }
  function to_number(value) {
    return value === "" ? null : +value;
  }
  function prop(props, key, flags2, fallback) {
    var fallback_value = (
      /** @type {V} */
      fallback
    );
    var fallback_dirty = true;
    var get_fallback = () => {
      if (fallback_dirty) {
        fallback_dirty = false;
        fallback_value = /** @type {V} */
        fallback;
      }
      return fallback_value;
    };
    {
      props[key];
    }
    var getter;
    {
      getter = () => {
        var value = (
          /** @type {V} */
          props[key]
        );
        if (value === void 0) return get_fallback();
        fallback_dirty = true;
        return value;
      };
    }
    var overridden = false;
    var d = /* @__PURE__ */ derived(() => {
      overridden = false;
      return getter();
    });
    var parent_effect = (
      /** @type {Effect} */
      active_effect
    );
    return (
      /** @type {() => V} */
      function(value, mutation) {
        if (arguments.length > 0) {
          const new_value = mutation ? get(d) : value;
          set(d, new_value);
          overridden = true;
          if (fallback_value !== void 0) {
            fallback_value = new_value;
          }
          return value;
        }
        if (is_destroying_effect && overridden || (parent_effect.f & DESTROYED) !== 0) {
          return d.v;
        }
        return get(d);
      }
    );
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var dexie_min = { exports: {} };
  (function(module, exports$1) {
    ((e, t) => {
      module.exports = t();
    })(commonjsGlobal, function() {
      var B = function(e2, t2) {
        return (B = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? function(e3, t3) {
          e3.__proto__ = t3;
        } : function(e3, t3) {
          for (var n2 in t3) Object.prototype.hasOwnProperty.call(t3, n2) && (e3[n2] = t3[n2]);
        }))(e2, t2);
      };
      var _ = function() {
        return (_ = Object.assign || function(e2) {
          for (var t2, n2 = 1, r2 = arguments.length; n2 < r2; n2++) for (var o2 in t2 = arguments[n2]) Object.prototype.hasOwnProperty.call(t2, o2) && (e2[o2] = t2[o2]);
          return e2;
        }).apply(this, arguments);
      };
      function R(e2, t2, n2) {
        for (var r2, o2 = 0, i2 = t2.length; o2 < i2; o2++) !r2 && o2 in t2 || ((r2 = r2 || Array.prototype.slice.call(t2, 0, o2))[o2] = t2[o2]);
        return e2.concat(r2 || Array.prototype.slice.call(t2));
      }
      var f = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof window ? window : commonjsGlobal, O = Object.keys, x = Array.isArray;
      function a(t2, n2) {
        return "object" == typeof n2 && O(n2).forEach(function(e2) {
          t2[e2] = n2[e2];
        }), t2;
      }
      "undefined" == typeof Promise || f.Promise || (f.Promise = Promise);
      var F = Object.getPrototypeOf, M = {}.hasOwnProperty;
      function m(e2, t2) {
        return M.call(e2, t2);
      }
      function N(t2, n2) {
        "function" == typeof n2 && (n2 = n2(F(t2))), ("undefined" == typeof Reflect ? O : Reflect.ownKeys)(n2).forEach(function(e2) {
          u(t2, e2, n2[e2]);
        });
      }
      var L = Object.defineProperty;
      function u(e2, t2, n2, r2) {
        L(e2, t2, a(n2 && m(n2, "get") && "function" == typeof n2.get ? { get: n2.get, set: n2.set, configurable: true } : { value: n2, configurable: true, writable: true }, r2));
      }
      function U(t2) {
        return { from: function(e2) {
          return t2.prototype = Object.create(e2.prototype), u(t2.prototype, "constructor", t2), { extend: N.bind(null, t2.prototype) };
        } };
      }
      var V = Object.getOwnPropertyDescriptor;
      var z = [].slice;
      function W(e2, t2, n2) {
        return z.call(e2, t2, n2);
      }
      function Y(e2, t2) {
        return t2(e2);
      }
      function $(e2) {
        if (!e2) throw new Error("Assertion Failed");
      }
      function Q(e2) {
        f.setImmediate ? setImmediate(e2) : setTimeout(e2, 0);
      }
      function c(e2, t2) {
        if ("string" == typeof t2 && m(e2, t2)) return e2[t2];
        if (!t2) return e2;
        if ("string" != typeof t2) {
          for (var n2 = [], r2 = 0, o2 = t2.length; r2 < o2; ++r2) {
            var i2 = c(e2, t2[r2]);
            n2.push(i2);
          }
          return n2;
        }
        var a2, u2 = t2.indexOf(".");
        return -1 === u2 || null == (a2 = e2[t2.substr(0, u2)]) ? void 0 : c(a2, t2.substr(u2 + 1));
      }
      function b(e2, t2, n2) {
        if (e2 && void 0 !== t2 && !("isFrozen" in Object && Object.isFrozen(e2))) if ("string" != typeof t2 && "length" in t2) {
          $("string" != typeof n2 && "length" in n2);
          for (var r2 = 0, o2 = t2.length; r2 < o2; ++r2) b(e2, t2[r2], n2[r2]);
        } else {
          var i2, a2, u2 = t2.indexOf(".");
          -1 !== u2 ? (i2 = t2.substr(0, u2), "" === (u2 = t2.substr(u2 + 1)) ? void 0 === n2 ? x(e2) && !isNaN(parseInt(i2)) ? e2.splice(i2, 1) : delete e2[i2] : e2[i2] = n2 : b(a2 = (a2 = e2[i2]) && m(e2, i2) ? a2 : e2[i2] = {}, u2, n2)) : void 0 === n2 ? x(e2) && !isNaN(parseInt(t2)) ? e2.splice(t2, 1) : delete e2[t2] : e2[t2] = n2;
        }
      }
      function G(e2) {
        var t2, n2 = {};
        for (t2 in e2) m(e2, t2) && (n2[t2] = e2[t2]);
        return n2;
      }
      var X = [].concat;
      function H(e2) {
        return X.apply([], e2);
      }
      var e = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(H([8, 16, 32, 64].map(function(t2) {
        return ["Int", "Uint", "Float"].map(function(e2) {
          return e2 + t2 + "Array";
        });
      }))).filter(function(e2) {
        return f[e2];
      }), J = new Set(e.map(function(e2) {
        return f[e2];
      }));
      var Z = null;
      function ee(e2) {
        Z = /* @__PURE__ */ new WeakMap();
        e2 = function e3(t2) {
          if (!t2 || "object" != typeof t2) return t2;
          var n2 = Z.get(t2);
          if (n2) return n2;
          if (x(t2)) {
            n2 = [], Z.set(t2, n2);
            for (var r2 = 0, o2 = t2.length; r2 < o2; ++r2) n2.push(e3(t2[r2]));
          } else if (J.has(t2.constructor)) n2 = t2;
          else {
            var i2, a2 = F(t2);
            for (i2 in n2 = a2 === Object.prototype ? {} : Object.create(a2), Z.set(t2, n2), t2) m(t2, i2) && (n2[i2] = e3(t2[i2]));
          }
          return n2;
        }(e2);
        return Z = null, e2;
      }
      var te = {}.toString;
      function ne(e2) {
        return te.call(e2).slice(8, -1);
      }
      var re = "undefined" != typeof Symbol ? Symbol.iterator : "@@iterator", oe = "symbol" == typeof re ? function(e2) {
        var t2;
        return null != e2 && (t2 = e2[re]) && t2.apply(e2);
      } : function() {
        return null;
      };
      function ie(e2, t2) {
        t2 = e2.indexOf(t2);
        0 <= t2 && e2.splice(t2, 1);
      }
      var ae = {};
      function n(e2) {
        var t2, n2, r2, o2;
        if (1 === arguments.length) {
          if (x(e2)) return e2.slice();
          if (this === ae && "string" == typeof e2) return [e2];
          if (o2 = oe(e2)) for (n2 = []; !(r2 = o2.next()).done; ) n2.push(r2.value);
          else {
            if (null == e2) return [e2];
            if ("number" != typeof (t2 = e2.length)) return [e2];
            for (n2 = new Array(t2); t2--; ) n2[t2] = e2[t2];
          }
        } else for (t2 = arguments.length, n2 = new Array(t2); t2--; ) n2[t2] = arguments[t2];
        return n2;
      }
      var ue = "undefined" != typeof Symbol ? function(e2) {
        return "AsyncFunction" === e2[Symbol.toStringTag];
      } : function() {
        return false;
      }, e = ["Unknown", "Constraint", "Data", "TransactionInactive", "ReadOnly", "Version", "NotFound", "InvalidState", "InvalidAccess", "Abort", "Timeout", "QuotaExceeded", "Syntax", "DataClone"], t = ["Modify", "Bulk", "OpenFailed", "VersionChange", "Schema", "Upgrade", "InvalidTable", "MissingAPI", "NoSuchDatabase", "InvalidArgument", "SubTransaction", "Unsupported", "Internal", "DatabaseClosed", "PrematureCommit", "ForeignAwait"].concat(e), se = { VersionChanged: "Database version changed by other database connection", DatabaseClosed: "Database has been closed", Abort: "Transaction aborted", TransactionInactive: "Transaction has already completed or failed", MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb" };
      function ce(e2, t2) {
        this.name = e2, this.message = t2;
      }
      function le(e2, t2) {
        return e2 + ". Errors: " + Object.keys(t2).map(function(e3) {
          return t2[e3].toString();
        }).filter(function(e3, t3, n2) {
          return n2.indexOf(e3) === t3;
        }).join("\n");
      }
      function fe(e2, t2, n2, r2) {
        this.failures = t2, this.failedKeys = r2, this.successCount = n2, this.message = le(e2, t2);
      }
      function he(e2, t2) {
        this.name = "BulkError", this.failures = Object.keys(t2).map(function(e3) {
          return t2[e3];
        }), this.failuresByPos = t2, this.message = le(e2, this.failures);
      }
      U(ce).from(Error).extend({ toString: function() {
        return this.name + ": " + this.message;
      } }), U(fe).from(ce), U(he).from(ce);
      var de = t.reduce(function(e2, t2) {
        return e2[t2] = t2 + "Error", e2;
      }, {}), pe = ce, k = t.reduce(function(e2, n2) {
        var r2 = n2 + "Error";
        function t2(e3, t3) {
          this.name = r2, e3 ? "string" == typeof e3 ? (this.message = "".concat(e3).concat(t3 ? "\n " + t3 : ""), this.inner = t3 || null) : "object" == typeof e3 && (this.message = "".concat(e3.name, " ").concat(e3.message), this.inner = e3) : (this.message = se[n2] || r2, this.inner = null);
        }
        return U(t2).from(pe), e2[n2] = t2, e2;
      }, {}), ye = (k.Syntax = SyntaxError, k.Type = TypeError, k.Range = RangeError, e.reduce(function(e2, t2) {
        return e2[t2 + "Error"] = k[t2], e2;
      }, {}));
      e = t.reduce(function(e2, t2) {
        return -1 === ["Syntax", "Type", "Range"].indexOf(t2) && (e2[t2 + "Error"] = k[t2]), e2;
      }, {});
      function g() {
      }
      function ve(e2) {
        return e2;
      }
      function me(t2, n2) {
        return null == t2 || t2 === ve ? n2 : function(e2) {
          return n2(t2(e2));
        };
      }
      function be(e2, t2) {
        return function() {
          e2.apply(this, arguments), t2.apply(this, arguments);
        };
      }
      function ge(o2, i2) {
        return o2 === g ? i2 : function() {
          var e2 = o2.apply(this, arguments), t2 = (void 0 !== e2 && (arguments[0] = e2), this.onsuccess), n2 = this.onerror, r2 = (this.onsuccess = null, this.onerror = null, i2.apply(this, arguments));
          return t2 && (this.onsuccess = this.onsuccess ? be(t2, this.onsuccess) : t2), n2 && (this.onerror = this.onerror ? be(n2, this.onerror) : n2), void 0 !== r2 ? r2 : e2;
        };
      }
      function we(n2, r2) {
        return n2 === g ? r2 : function() {
          n2.apply(this, arguments);
          var e2 = this.onsuccess, t2 = this.onerror;
          this.onsuccess = this.onerror = null, r2.apply(this, arguments), e2 && (this.onsuccess = this.onsuccess ? be(e2, this.onsuccess) : e2), t2 && (this.onerror = this.onerror ? be(t2, this.onerror) : t2);
        };
      }
      function _e(o2, i2) {
        return o2 === g ? i2 : function(e2) {
          var t2 = o2.apply(this, arguments), e2 = (a(e2, t2), this.onsuccess), n2 = this.onerror, r2 = (this.onsuccess = null, this.onerror = null, i2.apply(this, arguments));
          return e2 && (this.onsuccess = this.onsuccess ? be(e2, this.onsuccess) : e2), n2 && (this.onerror = this.onerror ? be(n2, this.onerror) : n2), void 0 === t2 ? void 0 === r2 ? void 0 : r2 : a(t2, r2);
        };
      }
      function xe(e2, t2) {
        return e2 === g ? t2 : function() {
          return false !== t2.apply(this, arguments) && e2.apply(this, arguments);
        };
      }
      function ke(o2, i2) {
        return o2 === g ? i2 : function() {
          var e2 = o2.apply(this, arguments);
          if (e2 && "function" == typeof e2.then) {
            for (var t2 = this, n2 = arguments.length, r2 = new Array(n2); n2--; ) r2[n2] = arguments[n2];
            return e2.then(function() {
              return i2.apply(t2, r2);
            });
          }
          return i2.apply(this, arguments);
        };
      }
      e.ModifyError = fe, e.DexieError = ce, e.BulkError = he;
      var l = "undefined" != typeof location && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
      function Oe(e2) {
        l = e2;
      }
      var Pe = {}, Ke = 100, Ee = "undefined" == typeof Promise ? [] : (t = Promise.resolve(), "undefined" != typeof crypto && crypto.subtle ? [Ee = crypto.subtle.digest("SHA-512", new Uint8Array([0])), F(Ee), t] : [t, F(t), t]), t = Ee[0], Se = Ee[1], Se = Se && Se.then, je = t && t.constructor, Ae = !!Ee[2];
      var Ce = function(e2, t2) {
        Re.push([e2, t2]), Ie && (queueMicrotask(Ye), Ie = false);
      }, Te = true, Ie = true, qe = [], De = [], Be = ve, s = { id: "global", global: true, ref: 0, unhandleds: [], onunhandled: g, pgp: false, env: {}, finalize: g }, P = s, Re = [], Fe = 0, Me = [];
      function K(e2) {
        if ("object" != typeof this) throw new TypeError("Promises must be constructed via new");
        this._listeners = [], this._lib = false;
        var t2 = this._PSD = P;
        if ("function" != typeof e2) {
          if (e2 !== Pe) throw new TypeError("Not a function");
          this._state = arguments[1], this._value = arguments[2], false === this._state && Ue(this, this._value);
        } else this._state = null, this._value = null, ++t2.ref, function t3(r2, e3) {
          try {
            e3(function(n2) {
              if (null === r2._state) {
                if (n2 === r2) throw new TypeError("A promise cannot be resolved with itself.");
                var e4 = r2._lib && $e();
                n2 && "function" == typeof n2.then ? t3(r2, function(e5, t4) {
                  n2 instanceof K ? n2._then(e5, t4) : n2.then(e5, t4);
                }) : (r2._state = true, r2._value = n2, Ve(r2)), e4 && Qe();
              }
            }, Ue.bind(null, r2));
          } catch (e4) {
            Ue(r2, e4);
          }
        }(this, e2);
      }
      var Ne = { get: function() {
        var u2 = P, t2 = et;
        function e2(n2, r2) {
          var o2 = this, i2 = !u2.global && (u2 !== P || t2 !== et), a2 = i2 && !v(), e3 = new K(function(e4, t3) {
            ze(o2, new Le(ut(n2, u2, i2, a2), ut(r2, u2, i2, a2), e4, t3, u2));
          });
          return this._consoleTask && (e3._consoleTask = this._consoleTask), e3;
        }
        return e2.prototype = Pe, e2;
      }, set: function(e2) {
        u(this, "then", e2 && e2.prototype === Pe ? Ne : { get: function() {
          return e2;
        }, set: Ne.set });
      } };
      function Le(e2, t2, n2, r2, o2) {
        this.onFulfilled = "function" == typeof e2 ? e2 : null, this.onRejected = "function" == typeof t2 ? t2 : null, this.resolve = n2, this.reject = r2, this.psd = o2;
      }
      function Ue(e2, t2) {
        var n2, r2;
        De.push(t2), null === e2._state && (n2 = e2._lib && $e(), t2 = Be(t2), e2._state = false, e2._value = t2, r2 = e2, qe.some(function(e3) {
          return e3._value === r2._value;
        }) || qe.push(r2), Ve(e2), n2) && Qe();
      }
      function Ve(e2) {
        var t2 = e2._listeners;
        e2._listeners = [];
        for (var n2 = 0, r2 = t2.length; n2 < r2; ++n2) ze(e2, t2[n2]);
        var o2 = e2._PSD;
        --o2.ref || o2.finalize(), 0 === Fe && (++Fe, Ce(function() {
          0 == --Fe && Ge();
        }, []));
      }
      function ze(e2, t2) {
        if (null === e2._state) e2._listeners.push(t2);
        else {
          var n2 = e2._state ? t2.onFulfilled : t2.onRejected;
          if (null === n2) return (e2._state ? t2.resolve : t2.reject)(e2._value);
          ++t2.psd.ref, ++Fe, Ce(We, [n2, e2, t2]);
        }
      }
      function We(e2, t2, n2) {
        try {
          var r2, o2 = t2._value;
          !t2._state && De.length && (De = []), r2 = l && t2._consoleTask ? t2._consoleTask.run(function() {
            return e2(o2);
          }) : e2(o2), t2._state || -1 !== De.indexOf(o2) || ((e3) => {
            for (var t3 = qe.length; t3; ) if (qe[--t3]._value === e3._value) return qe.splice(t3, 1);
          })(t2), n2.resolve(r2);
        } catch (e3) {
          n2.reject(e3);
        } finally {
          0 == --Fe && Ge(), --n2.psd.ref || n2.psd.finalize();
        }
      }
      function Ye() {
        at(s, function() {
          $e() && Qe();
        });
      }
      function $e() {
        var e2 = Te;
        return Ie = Te = false, e2;
      }
      function Qe() {
        var e2, t2, n2;
        do {
          for (; 0 < Re.length; ) for (e2 = Re, Re = [], n2 = e2.length, t2 = 0; t2 < n2; ++t2) {
            var r2 = e2[t2];
            r2[0].apply(null, r2[1]);
          }
        } while (0 < Re.length);
        Ie = Te = true;
      }
      function Ge() {
        for (var e2 = qe, t2 = (qe = [], e2.forEach(function(e3) {
          e3._PSD.onunhandled.call(null, e3._value, e3);
        }), Me.slice(0)), n2 = t2.length; n2; ) t2[--n2]();
      }
      function Xe(e2) {
        return new K(Pe, false, e2);
      }
      function E(n2, r2) {
        var o2 = P;
        return function() {
          var e2 = $e(), t2 = P;
          try {
            return h(o2, true), n2.apply(this, arguments);
          } catch (e3) {
            r2 && r2(e3);
          } finally {
            h(t2, false), e2 && Qe();
          }
        };
      }
      N(K.prototype, { then: Ne, _then: function(e2, t2) {
        ze(this, new Le(null, null, e2, t2, P));
      }, catch: function(e2) {
        var t2, n2;
        return 1 === arguments.length ? this.then(null, e2) : (t2 = e2, n2 = arguments[1], "function" == typeof t2 ? this.then(null, function(e3) {
          return (e3 instanceof t2 ? n2 : Xe)(e3);
        }) : this.then(null, function(e3) {
          return (e3 && e3.name === t2 ? n2 : Xe)(e3);
        }));
      }, finally: function(t2) {
        return this.then(function(e2) {
          return K.resolve(t2()).then(function() {
            return e2;
          });
        }, function(e2) {
          return K.resolve(t2()).then(function() {
            return Xe(e2);
          });
        });
      }, timeout: function(r2, o2) {
        var i2 = this;
        return r2 < 1 / 0 ? new K(function(e2, t2) {
          var n2 = setTimeout(function() {
            return t2(new k.Timeout(o2));
          }, r2);
          i2.then(e2, t2).finally(clearTimeout.bind(null, n2));
        }) : this;
      } }), "undefined" != typeof Symbol && Symbol.toStringTag && u(K.prototype, Symbol.toStringTag, "Dexie.Promise"), s.env = it(), N(K, { all: function() {
        var i2 = n.apply(null, arguments).map(rt);
        return new K(function(n2, r2) {
          0 === i2.length && n2([]);
          var o2 = i2.length;
          i2.forEach(function(e2, t2) {
            return K.resolve(e2).then(function(e3) {
              i2[t2] = e3, --o2 || n2(i2);
            }, r2);
          });
        });
      }, resolve: function(n2) {
        return n2 instanceof K ? n2 : n2 && "function" == typeof n2.then ? new K(function(e2, t2) {
          n2.then(e2, t2);
        }) : new K(Pe, true, n2);
      }, reject: Xe, race: function() {
        var e2 = n.apply(null, arguments).map(rt);
        return new K(function(t2, n2) {
          e2.map(function(e3) {
            return K.resolve(e3).then(t2, n2);
          });
        });
      }, PSD: { get: function() {
        return P;
      }, set: function(e2) {
        return P = e2;
      } }, totalEchoes: { get: function() {
        return et;
      } }, newPSD: y, usePSD: at, scheduler: { get: function() {
        return Ce;
      }, set: function(e2) {
        Ce = e2;
      } }, rejectionMapper: { get: function() {
        return Be;
      }, set: function(e2) {
        Be = e2;
      } }, follow: function(o2, n2) {
        return new K(function(e2, t2) {
          return y(function(n3, r2) {
            var e3 = P;
            e3.unhandleds = [], e3.onunhandled = r2, e3.finalize = be(function() {
              var t3, e4 = this;
              t3 = function() {
                0 === e4.unhandleds.length ? n3() : r2(e4.unhandleds[0]);
              }, Me.push(function e5() {
                t3(), Me.splice(Me.indexOf(e5), 1);
              }), ++Fe, Ce(function() {
                0 == --Fe && Ge();
              }, []);
            }, e3.finalize), o2();
          }, n2, e2, t2);
        });
      } }), je && (je.allSettled && u(K, "allSettled", function() {
        var e2 = n.apply(null, arguments).map(rt);
        return new K(function(n2) {
          0 === e2.length && n2([]);
          var r2 = e2.length, o2 = new Array(r2);
          e2.forEach(function(e3, t2) {
            return K.resolve(e3).then(function(e4) {
              return o2[t2] = { status: "fulfilled", value: e4 };
            }, function(e4) {
              return o2[t2] = { status: "rejected", reason: e4 };
            }).then(function() {
              return --r2 || n2(o2);
            });
          });
        });
      }), je.any && "undefined" != typeof AggregateError && u(K, "any", function() {
        var e2 = n.apply(null, arguments).map(rt);
        return new K(function(n2, r2) {
          0 === e2.length && r2(new AggregateError([]));
          var o2 = e2.length, i2 = new Array(o2);
          e2.forEach(function(e3, t2) {
            return K.resolve(e3).then(function(e4) {
              return n2(e4);
            }, function(e4) {
              i2[t2] = e4, --o2 || r2(new AggregateError(i2));
            });
          });
        });
      }), je.withResolvers) && (K.withResolvers = je.withResolvers);
      var i = { awaits: 0, echoes: 0, id: 0 }, He = 0, Je = [], Ze = 0, et = 0, tt = 0;
      function y(e2, t2, n2, r2) {
        var o2 = P, i2 = Object.create(o2), t2 = (i2.parent = o2, i2.ref = 0, i2.global = false, i2.id = ++tt, s.env, i2.env = Ae ? { Promise: K, PromiseProp: { value: K, configurable: true, writable: true }, all: K.all, race: K.race, allSettled: K.allSettled, any: K.any, resolve: K.resolve, reject: K.reject } : {}, t2 && a(i2, t2), ++o2.ref, i2.finalize = function() {
          --this.parent.ref || this.parent.finalize();
        }, at(i2, e2, n2, r2));
        return 0 === i2.ref && i2.finalize(), t2;
      }
      function nt() {
        return i.id || (i.id = ++He), ++i.awaits, i.echoes += Ke, i.id;
      }
      function v() {
        return !!i.awaits && (0 == --i.awaits && (i.id = 0), i.echoes = i.awaits * Ke, true);
      }
      function rt(e2) {
        return i.echoes && e2 && e2.constructor === je ? (nt(), e2.then(function(e3) {
          return v(), e3;
        }, function(e3) {
          return v(), w(e3);
        })) : e2;
      }
      function ot() {
        var e2 = Je[Je.length - 1];
        Je.pop(), h(e2, false);
      }
      function h(e2, t2) {
        var n2, r2, o2 = P;
        (t2 ? !i.echoes || Ze++ && e2 === P : !Ze || --Ze && e2 === P) || queueMicrotask(t2 ? (function(e3) {
          ++et, i.echoes && 0 != --i.echoes || (i.echoes = i.awaits = i.id = 0), Je.push(P), h(e3, true);
        }).bind(null, e2) : ot), e2 !== P && (P = e2, o2 === s && (s.env = it()), Ae) && (n2 = s.env.Promise, r2 = e2.env, o2.global || e2.global) && (Object.defineProperty(f, "Promise", r2.PromiseProp), n2.all = r2.all, n2.race = r2.race, n2.resolve = r2.resolve, n2.reject = r2.reject, r2.allSettled && (n2.allSettled = r2.allSettled), r2.any) && (n2.any = r2.any);
      }
      function it() {
        var e2 = f.Promise;
        return Ae ? { Promise: e2, PromiseProp: Object.getOwnPropertyDescriptor(f, "Promise"), all: e2.all, race: e2.race, allSettled: e2.allSettled, any: e2.any, resolve: e2.resolve, reject: e2.reject } : {};
      }
      function at(e2, t2, n2, r2, o2) {
        var i2 = P;
        try {
          return h(e2, true), t2(n2, r2, o2);
        } finally {
          h(i2, false);
        }
      }
      function ut(t2, n2, r2, o2) {
        return "function" != typeof t2 ? t2 : function() {
          var e2 = P;
          r2 && nt(), h(n2, true);
          try {
            return t2.apply(this, arguments);
          } finally {
            h(e2, false), o2 && queueMicrotask(v);
          }
        };
      }
      function st(e2) {
        Promise === je && 0 === i.echoes ? 0 === Ze ? e2() : enqueueNativeMicroTask(e2) : setTimeout(e2, 0);
      }
      -1 === ("" + Se).indexOf("[native code]") && (nt = v = g);
      var w = K.reject;
      var ct = String.fromCharCode(65535), S = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", lt = "String expected.", ft = [], ht = "__dbnames", dt = "readonly", pt = "readwrite";
      function yt(e2, t2) {
        return e2 ? t2 ? function() {
          return e2.apply(this, arguments) && t2.apply(this, arguments);
        } : e2 : t2;
      }
      var vt = { type: 3, lower: -1 / 0, lowerOpen: false, upper: [[]], upperOpen: false };
      function mt(t2) {
        return "string" != typeof t2 || /\./.test(t2) ? function(e2) {
          return e2;
        } : function(e2) {
          return void 0 === e2[t2] && t2 in e2 && delete (e2 = ee(e2))[t2], e2;
        };
      }
      function bt() {
        throw k.Type("Entity instances must never be new:ed. Instances are generated by the framework bypassing the constructor.");
      }
      function j(e2, t2) {
        try {
          var n2 = gt(e2), r2 = gt(t2);
          if (n2 !== r2) return "Array" === n2 ? 1 : "Array" === r2 ? -1 : "binary" === n2 ? 1 : "binary" === r2 ? -1 : "string" === n2 ? 1 : "string" === r2 ? -1 : "Date" === n2 ? 1 : "Date" !== r2 ? NaN : -1;
          switch (n2) {
            case "number":
            case "Date":
            case "string":
              return t2 < e2 ? 1 : e2 < t2 ? -1 : 0;
            case "binary":
              for (var o2 = wt(e2), i2 = wt(t2), a2 = o2.length, u2 = i2.length, s2 = a2 < u2 ? a2 : u2, c2 = 0; c2 < s2; ++c2) if (o2[c2] !== i2[c2]) return o2[c2] < i2[c2] ? -1 : 1;
              return a2 === u2 ? 0 : a2 < u2 ? -1 : 1;
            case "Array":
              for (var l2 = e2, f2 = t2, h2 = l2.length, d2 = f2.length, p2 = h2 < d2 ? h2 : d2, y2 = 0; y2 < p2; ++y2) {
                var v2 = j(l2[y2], f2[y2]);
                if (0 !== v2) return v2;
              }
              return h2 === d2 ? 0 : h2 < d2 ? -1 : 1;
          }
        } catch (e3) {
        }
        return NaN;
      }
      function gt(e2) {
        var t2 = typeof e2;
        return "object" == t2 && (ArrayBuffer.isView(e2) || "ArrayBuffer" === (t2 = ne(e2))) ? "binary" : t2;
      }
      function wt(e2) {
        return e2 instanceof Uint8Array ? e2 : ArrayBuffer.isView(e2) ? new Uint8Array(e2.buffer, e2.byteOffset, e2.byteLength) : new Uint8Array(e2);
      }
      function _t(t2, n2, r2) {
        var e2 = t2.schema.yProps;
        return e2 ? (n2 && 0 < r2.numFailures && (n2 = n2.filter(function(e3, t3) {
          return !r2.failures[t3];
        })), Promise.all(e2.map(function(e3) {
          e3 = e3.updatesTable;
          return n2 ? t2.db.table(e3).where("k").anyOf(n2).delete() : t2.db.table(e3).clear();
        })).then(function() {
          return r2;
        })) : r2;
      }
      kt.prototype.execute = function(e2) {
        var t2 = this["@@propmod"];
        if (void 0 !== t2.add) {
          var n2 = t2.add;
          if (x(n2)) return R(R([], x(e2) ? e2 : [], true), n2).sort();
          if ("number" == typeof n2) return (Number(e2) || 0) + n2;
          if ("bigint" == typeof n2) try {
            return BigInt(e2) + n2;
          } catch (e3) {
            return BigInt(0) + n2;
          }
          throw new TypeError("Invalid term ".concat(n2));
        }
        if (void 0 !== t2.remove) {
          var r2 = t2.remove;
          if (x(r2)) return x(e2) ? e2.filter(function(e3) {
            return !r2.includes(e3);
          }).sort() : [];
          if ("number" == typeof r2) return Number(e2) - r2;
          if ("bigint" == typeof r2) try {
            return BigInt(e2) - r2;
          } catch (e3) {
            return BigInt(0) - r2;
          }
          throw new TypeError("Invalid subtrahend ".concat(r2));
        }
        n2 = null == (n2 = t2.replacePrefix) ? void 0 : n2[0];
        return n2 && "string" == typeof e2 && e2.startsWith(n2) ? t2.replacePrefix[1] + e2.substring(n2.length) : e2;
      };
      var xt = kt;
      function kt(e2) {
        this["@@propmod"] = e2;
      }
      function Ot(e2, t2) {
        for (var n2 = O(t2), r2 = n2.length, o2 = false, i2 = 0; i2 < r2; ++i2) {
          var a2 = n2[i2], u2 = t2[a2], s2 = c(e2, a2);
          u2 instanceof xt ? (b(e2, a2, u2.execute(s2)), o2 = true) : s2 !== u2 && (b(e2, a2, u2), o2 = true);
        }
        return o2;
      }
      r.prototype._trans = function(e2, r2, t2) {
        var n2 = this._tx || P.trans, o2 = this.name, i2 = l && "undefined" != typeof console && console.createTask && console.createTask("Dexie: ".concat("readonly" === e2 ? "read" : "write", " ").concat(this.name));
        function a2(e3, t3, n3) {
          if (n3.schema[o2]) return r2(n3.idbtrans, n3);
          throw new k.NotFound("Table " + o2 + " not part of transaction");
        }
        var u2 = $e();
        try {
          var s2 = n2 && n2.db._novip === this.db._novip ? n2 === P.trans ? n2._promise(e2, a2, t2) : y(function() {
            return n2._promise(e2, a2, t2);
          }, { trans: n2, transless: P.transless || P }) : function t3(n3, r3, o3, i3) {
            if (n3.idbdb && (n3._state.openComplete || P.letThrough || n3._vip)) {
              var a3 = n3._createTransaction(r3, o3, n3._dbSchema);
              try {
                a3.create(), n3._state.PR1398_maxLoop = 3;
              } catch (e3) {
                return e3.name === de.InvalidState && n3.isOpen() && 0 < --n3._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), n3.close({ disableAutoOpen: false }), n3.open().then(function() {
                  return t3(n3, r3, o3, i3);
                })) : w(e3);
              }
              return a3._promise(r3, function(e3, t4) {
                return y(function() {
                  return P.trans = a3, i3(e3, t4, a3);
                });
              }).then(function(e3) {
                if ("readwrite" === r3) try {
                  a3.idbtrans.commit();
                } catch (e4) {
                }
                return "readonly" === r3 ? e3 : a3._completion.then(function() {
                  return e3;
                });
              });
            }
            if (n3._state.openComplete) return w(new k.DatabaseClosed(n3._state.dbOpenError));
            if (!n3._state.isBeingOpened) {
              if (!n3._state.autoOpen) return w(new k.DatabaseClosed());
              n3.open().catch(g);
            }
            return n3._state.dbReadyPromise.then(function() {
              return t3(n3, r3, o3, i3);
            });
          }(this.db, e2, [this.name], a2);
          return i2 && (s2._consoleTask = i2, s2 = s2.catch(function(e3) {
            return console.trace(e3), w(e3);
          })), s2;
        } finally {
          u2 && Qe();
        }
      }, r.prototype.get = function(t2, e2) {
        var n2 = this;
        return t2 && t2.constructor === Object ? this.where(t2).first(e2) : null == t2 ? w(new k.Type("Invalid argument to Table.get()")) : this._trans("readonly", function(e3) {
          return n2.core.get({ trans: e3, key: t2 }).then(function(e4) {
            return n2.hook.reading.fire(e4);
          });
        }).then(e2);
      }, r.prototype.where = function(i2) {
        if ("string" == typeof i2) return new this.db.WhereClause(this, i2);
        if (x(i2)) return new this.db.WhereClause(this, "[".concat(i2.join("+"), "]"));
        var n2 = O(i2);
        if (1 === n2.length) return this.where(n2[0]).equals(i2[n2[0]]);
        var e2 = this.schema.indexes.concat(this.schema.primKey).filter(function(t3) {
          if (t3.compound && n2.every(function(e4) {
            return 0 <= t3.keyPath.indexOf(e4);
          })) {
            for (var e3 = 0; e3 < n2.length; ++e3) if (-1 === n2.indexOf(t3.keyPath[e3])) return false;
            return true;
          }
          return false;
        }).sort(function(e3, t3) {
          return e3.keyPath.length - t3.keyPath.length;
        })[0];
        if (e2 && this.db._maxKey !== ct) return t2 = e2.keyPath.slice(0, n2.length), this.where(t2).equals(t2.map(function(e3) {
          return i2[e3];
        }));
        !e2 && l && console.warn("The query ".concat(JSON.stringify(i2), " on ").concat(this.name, " would benefit from a ") + "compound index [".concat(n2.join("+"), "]"));
        var a2 = this.schema.idxByName;
        function u2(e3, t3) {
          return 0 === j(e3, t3);
        }
        var t2 = n2.reduce(function(e3, t3) {
          var n3 = e3[0], e3 = e3[1], r3 = a2[t3], o2 = i2[t3];
          return [n3 || r3, n3 || !r3 ? yt(e3, r3 && r3.multi ? function(e4) {
            e4 = c(e4, t3);
            return x(e4) && e4.some(function(e5) {
              return u2(o2, e5);
            });
          } : function(e4) {
            return u2(o2, c(e4, t3));
          }) : e3];
        }, [null, null]), r2 = t2[0], t2 = t2[1];
        return r2 ? this.where(r2.name).equals(i2[r2.keyPath]).filter(t2) : e2 ? this.filter(t2) : this.where(n2).equals("");
      }, r.prototype.filter = function(e2) {
        return this.toCollection().and(e2);
      }, r.prototype.count = function(e2) {
        return this.toCollection().count(e2);
      }, r.prototype.offset = function(e2) {
        return this.toCollection().offset(e2);
      }, r.prototype.limit = function(e2) {
        return this.toCollection().limit(e2);
      }, r.prototype.each = function(e2) {
        return this.toCollection().each(e2);
      }, r.prototype.toArray = function(e2) {
        return this.toCollection().toArray(e2);
      }, r.prototype.toCollection = function() {
        return new this.db.Collection(new this.db.WhereClause(this));
      }, r.prototype.orderBy = function(e2) {
        return new this.db.Collection(new this.db.WhereClause(this, x(e2) ? "[".concat(e2.join("+"), "]") : e2));
      }, r.prototype.reverse = function() {
        return this.toCollection().reverse();
      }, r.prototype.mapToClass = function(r2) {
        for (var i2 = this.db, a2 = this.name, o2 = ((this.schema.mappedClass = r2).prototype instanceof bt && (r2 = ((e3) => {
          var t3 = o3, n2 = e3;
          if ("function" != typeof n2 && null !== n2) throw new TypeError("Class extends value " + String(n2) + " is not a constructor or null");
          function r3() {
            this.constructor = t3;
          }
          function o3() {
            return null !== e3 && e3.apply(this, arguments) || this;
          }
          return B(t3, n2), t3.prototype = null === n2 ? Object.create(n2) : (r3.prototype = n2.prototype, new r3()), Object.defineProperty(o3.prototype, "db", { get: function() {
            return i2;
          }, enumerable: false, configurable: true }), o3.prototype.table = function() {
            return a2;
          }, o3;
        })(r2)), /* @__PURE__ */ new Set()), e2 = r2.prototype; e2; e2 = F(e2)) Object.getOwnPropertyNames(e2).forEach(function(e3) {
          return o2.add(e3);
        });
        function t2(e3) {
          if (!e3) return e3;
          var t3, n2 = Object.create(r2.prototype);
          for (t3 in e3) if (!o2.has(t3)) try {
            n2[t3] = e3[t3];
          } catch (e4) {
          }
          return n2;
        }
        return this.schema.readHook && this.hook.reading.unsubscribe(this.schema.readHook), this.schema.readHook = t2, this.hook("reading", t2), r2;
      }, r.prototype.defineClass = function() {
        return this.mapToClass(function(e2) {
          a(this, e2);
        });
      }, r.prototype.add = function(t2, n2) {
        var r2 = this, e2 = this.schema.primKey, o2 = e2.auto, i2 = e2.keyPath, a2 = t2;
        return i2 && o2 && (a2 = mt(i2)(t2)), this._trans("readwrite", function(e3) {
          return r2.core.mutate({ trans: e3, type: "add", keys: null != n2 ? [n2] : null, values: [a2] });
        }).then(function(e3) {
          return e3.numFailures ? K.reject(e3.failures[0]) : e3.lastResult;
        }).then(function(e3) {
          if (i2) try {
            b(t2, i2, e3);
          } catch (e4) {
          }
          return e3;
        });
      }, r.prototype.upsert = function(r2, o2) {
        var i2 = this, a2 = this.schema.primKey.keyPath;
        return this._trans("readwrite", function(n2) {
          return i2.core.get({ trans: n2, key: r2 }).then(function(t2) {
            var e2 = null != t2 ? t2 : {};
            return Ot(e2, o2), a2 && b(e2, a2, r2), i2.core.mutate({ trans: n2, type: "put", values: [e2], keys: [r2], upsert: true, updates: { keys: [r2], changeSpecs: [o2] } }).then(function(e3) {
              return e3.numFailures ? K.reject(e3.failures[0]) : !!t2;
            });
          });
        });
      }, r.prototype.update = function(e2, t2) {
        return "object" != typeof e2 || x(e2) ? this.where(":id").equals(e2).modify(t2) : void 0 === (e2 = c(e2, this.schema.primKey.keyPath)) ? w(new k.InvalidArgument("Given object does not contain its primary key")) : this.where(":id").equals(e2).modify(t2);
      }, r.prototype.put = function(t2, n2) {
        var r2 = this, e2 = this.schema.primKey, o2 = e2.auto, i2 = e2.keyPath, a2 = t2;
        return i2 && o2 && (a2 = mt(i2)(t2)), this._trans("readwrite", function(e3) {
          return r2.core.mutate({ trans: e3, type: "put", values: [a2], keys: null != n2 ? [n2] : null });
        }).then(function(e3) {
          return e3.numFailures ? K.reject(e3.failures[0]) : e3.lastResult;
        }).then(function(e3) {
          if (i2) try {
            b(t2, i2, e3);
          } catch (e4) {
          }
          return e3;
        });
      }, r.prototype.delete = function(t2) {
        var n2 = this;
        return this._trans("readwrite", function(e2) {
          return n2.core.mutate({ trans: e2, type: "delete", keys: [t2] }).then(function(e3) {
            return _t(n2, [t2], e3);
          }).then(function(e3) {
            return e3.numFailures ? K.reject(e3.failures[0]) : void 0;
          });
        });
      }, r.prototype.clear = function() {
        var t2 = this;
        return this._trans("readwrite", function(e2) {
          return t2.core.mutate({ trans: e2, type: "deleteRange", range: vt }).then(function(e3) {
            return _t(t2, null, e3);
          });
        }).then(function(e2) {
          return e2.numFailures ? K.reject(e2.failures[0]) : void 0;
        });
      }, r.prototype.bulkGet = function(t2) {
        var n2 = this;
        return this._trans("readonly", function(e2) {
          return n2.core.getMany({ keys: t2, trans: e2 }).then(function(e3) {
            return e3.map(function(e4) {
              return n2.hook.reading.fire(e4);
            });
          });
        });
      }, r.prototype.bulkAdd = function(o2, e2, t2) {
        var i2 = this, a2 = Array.isArray(e2) ? e2 : void 0, u2 = (t2 = t2 || (a2 ? void 0 : e2)) ? t2.allKeys : void 0;
        return this._trans("readwrite", function(e3) {
          var t3 = i2.schema.primKey, n2 = t3.auto, t3 = t3.keyPath;
          if (t3 && a2) throw new k.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
          if (a2 && a2.length !== o2.length) throw new k.InvalidArgument("Arguments objects and keys must have the same length");
          var r2 = o2.length, n2 = t3 && n2 ? o2.map(mt(t3)) : o2;
          return i2.core.mutate({ trans: e3, type: "add", keys: a2, values: n2, wantResults: u2 }).then(function(e4) {
            var t4 = e4.numFailures, n3 = e4.failures;
            if (0 === t4) return u2 ? e4.results : e4.lastResult;
            throw new he("".concat(i2.name, ".bulkAdd(): ").concat(t4, " of ").concat(r2, " operations failed"), n3);
          });
        });
      }, r.prototype.bulkPut = function(o2, e2, t2) {
        var i2 = this, a2 = Array.isArray(e2) ? e2 : void 0, u2 = (t2 = t2 || (a2 ? void 0 : e2)) ? t2.allKeys : void 0;
        return this._trans("readwrite", function(e3) {
          var t3 = i2.schema.primKey, n2 = t3.auto, t3 = t3.keyPath;
          if (t3 && a2) throw new k.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
          if (a2 && a2.length !== o2.length) throw new k.InvalidArgument("Arguments objects and keys must have the same length");
          var r2 = o2.length, n2 = t3 && n2 ? o2.map(mt(t3)) : o2;
          return i2.core.mutate({ trans: e3, type: "put", keys: a2, values: n2, wantResults: u2 }).then(function(e4) {
            var t4 = e4.numFailures, n3 = e4.failures;
            if (0 === t4) return u2 ? e4.results : e4.lastResult;
            throw new he("".concat(i2.name, ".bulkPut(): ").concat(t4, " of ").concat(r2, " operations failed"), n3);
          });
        });
      }, r.prototype.bulkUpdate = function(t2) {
        var h2 = this, n2 = this.core, r2 = t2.map(function(e2) {
          return e2.key;
        }), o2 = t2.map(function(e2) {
          return e2.changes;
        }), d2 = [];
        return this._trans("readwrite", function(e2) {
          return n2.getMany({ trans: e2, keys: r2, cache: "clone" }).then(function(c2) {
            var l2 = [], f2 = [], s2 = (t2.forEach(function(e3, t3) {
              var n3 = e3.key, r3 = e3.changes, o3 = c2[t3];
              if (o3) {
                for (var i2 = 0, a2 = Object.keys(r3); i2 < a2.length; i2++) {
                  var u2 = a2[i2], s3 = r3[u2];
                  if (u2 === h2.schema.primKey.keyPath) {
                    if (0 !== j(s3, n3)) throw new k.Constraint("Cannot update primary key in bulkUpdate()");
                  } else b(o3, u2, s3);
                }
                d2.push(t3), l2.push(n3), f2.push(o3);
              }
            }), l2.length);
            return n2.mutate({ trans: e2, type: "put", keys: l2, values: f2, updates: { keys: r2, changeSpecs: o2 } }).then(function(e3) {
              var t3 = e3.numFailures, n3 = e3.failures;
              if (0 === t3) return s2;
              for (var r3 = 0, o3 = Object.keys(n3); r3 < o3.length; r3++) {
                var i2, a2 = o3[r3], u2 = d2[Number(a2)];
                null != u2 && (i2 = n3[a2], delete n3[a2], n3[u2] = i2);
              }
              throw new he("".concat(h2.name, ".bulkUpdate(): ").concat(t3, " of ").concat(s2, " operations failed"), n3);
            });
          });
        });
      }, r.prototype.bulkDelete = function(t2) {
        var r2 = this, o2 = t2.length;
        return this._trans("readwrite", function(e2) {
          return r2.core.mutate({ trans: e2, type: "delete", keys: t2 }).then(function(e3) {
            return _t(r2, t2, e3);
          });
        }).then(function(e2) {
          var t3 = e2.numFailures, n2 = e2.failures;
          if (0 === t3) return e2.lastResult;
          throw new he("".concat(r2.name, ".bulkDelete(): ").concat(t3, " of ").concat(o2, " operations failed"), n2);
        });
      };
      var Pt = r;
      function r() {
      }
      function Kt(o2) {
        function t2(e3, t3) {
          if (t3) {
            for (var n3 = arguments.length, r2 = new Array(n3 - 1); --n3; ) r2[n3 - 1] = arguments[n3];
            return a2[e3].subscribe.apply(null, r2), o2;
          }
          if ("string" == typeof e3) return a2[e3];
        }
        var a2 = {};
        t2.addEventType = u2;
        for (var e2 = 1, n2 = arguments.length; e2 < n2; ++e2) u2(arguments[e2]);
        return t2;
        function u2(e3, n3, r2) {
          var o3, i2;
          if ("object" != typeof e3) return n3 = n3 || xe, i2 = { subscribers: [], fire: r2 = r2 || g, subscribe: function(e4) {
            -1 === i2.subscribers.indexOf(e4) && (i2.subscribers.push(e4), i2.fire = n3(i2.fire, e4));
          }, unsubscribe: function(t3) {
            i2.subscribers = i2.subscribers.filter(function(e4) {
              return e4 !== t3;
            }), i2.fire = i2.subscribers.reduce(n3, r2);
          } }, a2[e3] = t2[e3] = i2;
          O(o3 = e3).forEach(function(e4) {
            var t3 = o3[e4];
            if (x(t3)) u2(e4, o3[e4][0], o3[e4][1]);
            else {
              if ("asap" !== t3) throw new k.InvalidArgument("Invalid event config");
              var n4 = u2(e4, ve, function() {
                for (var e5 = arguments.length, t4 = new Array(e5); e5--; ) t4[e5] = arguments[e5];
                n4.subscribers.forEach(function(e6) {
                  Q(function() {
                    e6.apply(null, t4);
                  });
                });
              });
            }
          });
        }
      }
      function Et(e2, t2) {
        return U(t2).from({ prototype: e2 }), t2;
      }
      function St(e2, t2) {
        return !(e2.filter || e2.algorithm || e2.or) && (t2 ? e2.justLimit : !e2.replayFilter);
      }
      function jt(e2, t2) {
        e2.filter = yt(e2.filter, t2);
      }
      function At(e2, t2, n2) {
        var r2 = e2.replayFilter;
        e2.replayFilter = r2 ? function() {
          return yt(r2(), t2());
        } : t2, e2.justLimit = n2 && !r2;
      }
      function Ct(e2, t2) {
        if (e2.isPrimKey) return t2.primaryKey;
        var n2 = t2.getIndexByKeyPath(e2.index);
        if (n2) return n2;
        throw new k.Schema("KeyPath " + e2.index + " on object store " + t2.name + " is not indexed");
      }
      function Tt(e2, t2, n2) {
        var r2 = Ct(e2, t2.schema);
        return t2.openCursor({ trans: n2, values: !e2.keysOnly, reverse: "prev" === e2.dir, unique: !!e2.unique, query: { index: r2, range: e2.range } });
      }
      function It(e2, i2, t2, n2) {
        var a2, r2, u2 = e2.replayFilter ? yt(e2.filter, e2.replayFilter()) : e2.filter;
        return e2.or ? (a2 = {}, r2 = function(e3, t3, n3) {
          var r3, o2;
          u2 && !u2(t3, n3, function(e4) {
            return t3.stop(e4);
          }, function(e4) {
            return t3.fail(e4);
          }) || ("[object ArrayBuffer]" === (o2 = "" + (r3 = t3.primaryKey)) && (o2 = "" + new Uint8Array(r3)), m(a2, o2)) || (a2[o2] = true, i2(e3, t3, n3));
        }, Promise.all([e2.or._iterate(r2, t2), qt(Tt(e2, n2, t2), e2.algorithm, r2, !e2.keysOnly && e2.valueMapper)])) : qt(Tt(e2, n2, t2), yt(e2.algorithm, u2), i2, !e2.keysOnly && e2.valueMapper);
      }
      function qt(e2, r2, o2, i2) {
        var a2 = E(i2 ? function(e3, t2, n2) {
          return o2(i2(e3), t2, n2);
        } : o2);
        return e2.then(function(n2) {
          if (n2) return n2.start(function() {
            var t2 = function() {
              return n2.continue();
            };
            r2 && !r2(n2, function(e3) {
              return t2 = e3;
            }, function(e3) {
              n2.stop(e3), t2 = g;
            }, function(e3) {
              n2.fail(e3), t2 = g;
            }) || a2(n2.value, n2, function(e3) {
              return t2 = e3;
            }), t2();
          });
        });
      }
      o.prototype._read = function(e2, t2) {
        var n2 = this._ctx;
        return n2.error ? n2.table._trans(null, w.bind(null, n2.error)) : n2.table._trans("readonly", e2).then(t2);
      }, o.prototype._write = function(e2) {
        var t2 = this._ctx;
        return t2.error ? t2.table._trans(null, w.bind(null, t2.error)) : t2.table._trans("readwrite", e2, "locked");
      }, o.prototype._addAlgorithm = function(e2) {
        var t2 = this._ctx;
        t2.algorithm = yt(t2.algorithm, e2);
      }, o.prototype._iterate = function(e2, t2) {
        return It(this._ctx, e2, t2, this._ctx.table.core);
      }, o.prototype.clone = function(e2) {
        var t2 = Object.create(this.constructor.prototype), n2 = Object.create(this._ctx);
        return e2 && a(n2, e2), t2._ctx = n2, t2;
      }, o.prototype.raw = function() {
        return this._ctx.valueMapper = null, this;
      }, o.prototype.each = function(t2) {
        var n2 = this._ctx;
        return this._read(function(e2) {
          return It(n2, t2, e2, n2.table.core);
        });
      }, o.prototype.count = function(e2) {
        var o2 = this;
        return this._read(function(e3) {
          var t2, n2 = o2._ctx, r2 = n2.table.core;
          return St(n2, true) ? r2.count({ trans: e3, query: { index: Ct(n2, r2.schema), range: n2.range } }).then(function(e4) {
            return Math.min(e4, n2.limit);
          }) : (t2 = 0, It(n2, function() {
            return ++t2, false;
          }, e3, r2).then(function() {
            return t2;
          }));
        }).then(e2);
      }, o.prototype.sortBy = function(e2, t2) {
        var n2 = e2.split(".").reverse(), r2 = n2[0], o2 = n2.length - 1;
        function i2(e3, t3) {
          return t3 ? i2(e3[n2[t3]], t3 - 1) : e3[r2];
        }
        var a2 = "next" === this._ctx.dir ? 1 : -1;
        function u2(e3, t3) {
          return j(i2(e3, o2), i2(t3, o2)) * a2;
        }
        return this.toArray(function(e3) {
          return e3.sort(u2);
        }).then(t2);
      }, o.prototype.toArray = function(e2) {
        var i2 = this;
        return this._read(function(e3) {
          var t2, n2, r2, o2 = i2._ctx;
          return "next" === o2.dir && St(o2, true) && 0 < o2.limit ? (t2 = o2.valueMapper, n2 = Ct(o2, o2.table.core.schema), o2.table.core.query({ trans: e3, limit: o2.limit, values: true, query: { index: n2, range: o2.range } }).then(function(e4) {
            e4 = e4.result;
            return t2 ? e4.map(t2) : e4;
          })) : (r2 = [], It(o2, function(e4) {
            return r2.push(e4);
          }, e3, o2.table.core).then(function() {
            return r2;
          }));
        }, e2);
      }, o.prototype.offset = function(t2) {
        var e2 = this._ctx;
        return t2 <= 0 || (e2.offset += t2, St(e2) ? At(e2, function() {
          var n2 = t2;
          return function(e3, t3) {
            return 0 === n2 || (1 === n2 ? --n2 : t3(function() {
              e3.advance(n2), n2 = 0;
            }), false);
          };
        }) : At(e2, function() {
          var e3 = t2;
          return function() {
            return --e3 < 0;
          };
        })), this;
      }, o.prototype.limit = function(e2) {
        return this._ctx.limit = Math.min(this._ctx.limit, e2), At(this._ctx, function() {
          var r2 = e2;
          return function(e3, t2, n2) {
            return --r2 <= 0 && t2(n2), 0 <= r2;
          };
        }, true), this;
      }, o.prototype.until = function(r2, o2) {
        return jt(this._ctx, function(e2, t2, n2) {
          return !r2(e2.value) || (t2(n2), o2);
        }), this;
      }, o.prototype.first = function(e2) {
        return this.limit(1).toArray(function(e3) {
          return e3[0];
        }).then(e2);
      }, o.prototype.last = function(e2) {
        return this.reverse().first(e2);
      }, o.prototype.filter = function(t2) {
        var e2;
        return jt(this._ctx, function(e3) {
          return t2(e3.value);
        }), (e2 = this._ctx).isMatch = yt(e2.isMatch, t2), this;
      }, o.prototype.and = function(e2) {
        return this.filter(e2);
      }, o.prototype.or = function(e2) {
        return new this.db.WhereClause(this._ctx.table, e2, this);
      }, o.prototype.reverse = function() {
        return this._ctx.dir = "prev" === this._ctx.dir ? "next" : "prev", this._ondirectionchange && this._ondirectionchange(this._ctx.dir), this;
      }, o.prototype.desc = function() {
        return this.reverse();
      }, o.prototype.eachKey = function(n2) {
        var e2 = this._ctx;
        return e2.keysOnly = !e2.isMatch, this.each(function(e3, t2) {
          n2(t2.key, t2);
        });
      }, o.prototype.eachUniqueKey = function(e2) {
        return this._ctx.unique = "unique", this.eachKey(e2);
      }, o.prototype.eachPrimaryKey = function(n2) {
        var e2 = this._ctx;
        return e2.keysOnly = !e2.isMatch, this.each(function(e3, t2) {
          n2(t2.primaryKey, t2);
        });
      }, o.prototype.keys = function(e2) {
        var t2 = this._ctx, n2 = (t2.keysOnly = !t2.isMatch, []);
        return this.each(function(e3, t3) {
          n2.push(t3.key);
        }).then(function() {
          return n2;
        }).then(e2);
      }, o.prototype.primaryKeys = function(e2) {
        var n2 = this._ctx;
        if ("next" === n2.dir && St(n2, true) && 0 < n2.limit) return this._read(function(e3) {
          var t2 = Ct(n2, n2.table.core.schema);
          return n2.table.core.query({ trans: e3, values: false, limit: n2.limit, query: { index: t2, range: n2.range } });
        }).then(function(e3) {
          return e3.result;
        }).then(e2);
        n2.keysOnly = !n2.isMatch;
        var r2 = [];
        return this.each(function(e3, t2) {
          r2.push(t2.primaryKey);
        }).then(function() {
          return r2;
        }).then(e2);
      }, o.prototype.uniqueKeys = function(e2) {
        return this._ctx.unique = "unique", this.keys(e2);
      }, o.prototype.firstKey = function(e2) {
        return this.limit(1).keys(function(e3) {
          return e3[0];
        }).then(e2);
      }, o.prototype.lastKey = function(e2) {
        return this.reverse().firstKey(e2);
      }, o.prototype.distinct = function() {
        var n2, e2 = this._ctx, e2 = e2.index && e2.table.schema.idxByName[e2.index];
        return e2 && e2.multi && (n2 = {}, jt(this._ctx, function(e3) {
          var e3 = e3.primaryKey.toString(), t2 = m(n2, e3);
          return n2[e3] = true, !t2;
        })), this;
      }, o.prototype.modify = function(x2) {
        var n2 = this, k2 = this._ctx;
        return this._write(function(p2) {
          function y2(e3, t3) {
            var n3 = t3.failures;
            u2 += e3 - t3.numFailures;
            for (var r2 = 0, o2 = O(n3); r2 < o2.length; r2++) {
              var i2 = o2[r2];
              a2.push(n3[i2]);
            }
          }
          var v2 = "function" == typeof x2 ? x2 : function(e3) {
            return Ot(e3, x2);
          }, m2 = k2.table.core, e2 = m2.schema.primaryKey, b2 = e2.outbound, g2 = e2.extractKey, w2 = 200, e2 = n2.db._options.modifyChunkSize, a2 = (e2 && (w2 = "object" == typeof e2 ? e2[m2.name] || e2["*"] || 200 : e2), []), u2 = 0, t2 = [], _2 = x2 === Bt;
          return n2.clone().primaryKeys().then(function(f2) {
            function h2(s2) {
              var c2 = Math.min(w2, f2.length - s2), l2 = f2.slice(s2, s2 + c2);
              return (_2 ? Promise.resolve([]) : m2.getMany({ trans: p2, keys: l2, cache: "immutable" })).then(function(e3) {
                var n3 = [], t3 = [], r2 = b2 ? [] : null, o2 = _2 ? l2 : [];
                if (!_2) for (var i2 = 0; i2 < c2; ++i2) {
                  var a3 = e3[i2], u3 = { value: ee(a3), primKey: f2[s2 + i2] };
                  false !== v2.call(u3, u3.value, u3) && (null == u3.value ? o2.push(f2[s2 + i2]) : b2 || 0 === j(g2(a3), g2(u3.value)) ? (t3.push(u3.value), b2 && r2.push(f2[s2 + i2])) : (o2.push(f2[s2 + i2]), n3.push(u3.value)));
                }
                return Promise.resolve(0 < n3.length && m2.mutate({ trans: p2, type: "add", values: n3 }).then(function(e4) {
                  for (var t4 in e4.failures) o2.splice(parseInt(t4), 1);
                  y2(n3.length, e4);
                })).then(function() {
                  return (0 < t3.length || d2 && "object" == typeof x2) && m2.mutate({ trans: p2, type: "put", keys: r2, values: t3, criteria: d2, changeSpec: "function" != typeof x2 && x2, isAdditionalChunk: 0 < s2 }).then(function(e4) {
                    return y2(t3.length, e4);
                  });
                }).then(function() {
                  return (0 < o2.length || d2 && _2) && m2.mutate({ trans: p2, type: "delete", keys: o2, criteria: d2, isAdditionalChunk: 0 < s2 }).then(function(e4) {
                    return _t(k2.table, o2, e4);
                  }).then(function(e4) {
                    return y2(o2.length, e4);
                  });
                }).then(function() {
                  return f2.length > s2 + c2 && h2(s2 + w2);
                });
              });
            }
            var d2 = St(k2) && k2.limit === 1 / 0 && ("function" != typeof x2 || _2) && { index: k2.index, range: k2.range };
            return h2(0).then(function() {
              if (0 < a2.length) throw new fe("Error modifying one or more objects", a2, u2, t2);
              return f2.length;
            });
          });
        });
      }, o.prototype.delete = function() {
        var o2 = this._ctx, n2 = o2.range;
        return !St(o2) || o2.table.schema.yProps || !o2.isPrimKey && 3 !== n2.type ? this.modify(Bt) : this._write(function(e2) {
          var t2 = o2.table.core.schema.primaryKey, r2 = n2;
          return o2.table.core.count({ trans: e2, query: { index: t2, range: r2 } }).then(function(n3) {
            return o2.table.core.mutate({ trans: e2, type: "deleteRange", range: r2 }).then(function(e3) {
              var t3 = e3.failures, e3 = e3.numFailures;
              if (e3) throw new fe("Could not delete some values", Object.keys(t3).map(function(e4) {
                return t3[e4];
              }), n3 - e3);
              return n3 - e3;
            });
          });
        });
      };
      var Dt = o;
      function o() {
      }
      var Bt = function(e2, t2) {
        return t2.value = null;
      };
      function Rt(e2, t2) {
        return e2 < t2 ? -1 : e2 === t2 ? 0 : 1;
      }
      function Ft(e2, t2) {
        return t2 < e2 ? -1 : e2 === t2 ? 0 : 1;
      }
      function A(e2, t2, n2) {
        e2 = e2 instanceof Ut ? new e2.Collection(e2) : e2;
        return e2._ctx.error = new (n2 || TypeError)(t2), e2;
      }
      function Mt(e2) {
        return new e2.Collection(e2, function() {
          return Lt("");
        }).limit(0);
      }
      function Nt(e2, s2, n2, r2) {
        var o2, c2, l2, f2, h2, d2, p2, y2 = n2.length;
        if (!n2.every(function(e3) {
          return "string" == typeof e3;
        })) return A(e2, lt);
        function t2(e3) {
          o2 = "next" === e3 ? function(e4) {
            return e4.toUpperCase();
          } : function(e4) {
            return e4.toLowerCase();
          }, c2 = "next" === e3 ? function(e4) {
            return e4.toLowerCase();
          } : function(e4) {
            return e4.toUpperCase();
          }, l2 = "next" === e3 ? Rt : Ft;
          var t3 = n2.map(function(e4) {
            return { lower: c2(e4), upper: o2(e4) };
          }).sort(function(e4, t4) {
            return l2(e4.lower, t4.lower);
          });
          f2 = t3.map(function(e4) {
            return e4.upper;
          }), h2 = t3.map(function(e4) {
            return e4.lower;
          }), p2 = "next" === (d2 = e3) ? "" : r2;
        }
        t2("next");
        var e2 = new e2.Collection(e2, function() {
          return C(f2[0], h2[y2 - 1] + r2);
        }), v2 = (e2._ondirectionchange = function(e3) {
          t2(e3);
        }, 0);
        return e2._addAlgorithm(function(e3, t3, n3) {
          var r3 = e3.key;
          if ("string" == typeof r3) {
            var o3 = c2(r3);
            if (s2(o3, h2, v2)) return true;
            for (var i2 = null, a2 = v2; a2 < y2; ++a2) {
              var u2 = ((e4, t4, n4, r4, o4, i3) => {
                for (var a3 = Math.min(e4.length, r4.length), u3 = -1, s3 = 0; s3 < a3; ++s3) {
                  var c3 = t4[s3];
                  if (c3 !== r4[s3]) return o4(e4[s3], n4[s3]) < 0 ? e4.substr(0, s3) + n4[s3] + n4.substr(s3 + 1) : o4(e4[s3], r4[s3]) < 0 ? e4.substr(0, s3) + r4[s3] + n4.substr(s3 + 1) : 0 <= u3 ? e4.substr(0, u3) + t4[u3] + n4.substr(u3 + 1) : null;
                  o4(e4[s3], c3) < 0 && (u3 = s3);
                }
                return a3 < r4.length && "next" === i3 ? e4 + n4.substr(e4.length) : a3 < e4.length && "prev" === i3 ? e4.substr(0, n4.length) : u3 < 0 ? null : e4.substr(0, u3) + r4[u3] + n4.substr(u3 + 1);
              })(r3, o3, f2[a2], h2[a2], l2, d2);
              null === u2 && null === i2 ? v2 = a2 + 1 : (null === i2 || 0 < l2(i2, u2)) && (i2 = u2);
            }
            t3(null !== i2 ? function() {
              e3.continue(i2 + p2);
            } : n3);
          }
          return false;
        }), e2;
      }
      function C(e2, t2, n2, r2) {
        return { type: 2, lower: e2, upper: t2, lowerOpen: n2, upperOpen: r2 };
      }
      function Lt(e2) {
        return { type: 1, lower: e2, upper: e2 };
      }
      Object.defineProperty(d.prototype, "Collection", { get: function() {
        return this._ctx.table.db.Collection;
      }, enumerable: false, configurable: true }), d.prototype.between = function(e2, t2, n2, r2) {
        n2 = false !== n2, r2 = true === r2;
        try {
          return 0 < this._cmp(e2, t2) || 0 === this._cmp(e2, t2) && (n2 || r2) && (!n2 || !r2) ? Mt(this) : new this.Collection(this, function() {
            return C(e2, t2, !n2, !r2);
          });
        } catch (e3) {
          return A(this, S);
        }
      }, d.prototype.equals = function(e2) {
        return null == e2 ? A(this, S) : new this.Collection(this, function() {
          return Lt(e2);
        });
      }, d.prototype.above = function(e2) {
        return null == e2 ? A(this, S) : new this.Collection(this, function() {
          return C(e2, void 0, true);
        });
      }, d.prototype.aboveOrEqual = function(e2) {
        return null == e2 ? A(this, S) : new this.Collection(this, function() {
          return C(e2, void 0, false);
        });
      }, d.prototype.below = function(e2) {
        return null == e2 ? A(this, S) : new this.Collection(this, function() {
          return C(void 0, e2, false, true);
        });
      }, d.prototype.belowOrEqual = function(e2) {
        return null == e2 ? A(this, S) : new this.Collection(this, function() {
          return C(void 0, e2);
        });
      }, d.prototype.startsWith = function(e2) {
        return "string" != typeof e2 ? A(this, lt) : this.between(e2, e2 + ct, true, true);
      }, d.prototype.startsWithIgnoreCase = function(e2) {
        return "" === e2 ? this.startsWith(e2) : Nt(this, function(e3, t2) {
          return 0 === e3.indexOf(t2[0]);
        }, [e2], ct);
      }, d.prototype.equalsIgnoreCase = function(e2) {
        return Nt(this, function(e3, t2) {
          return e3 === t2[0];
        }, [e2], "");
      }, d.prototype.anyOfIgnoreCase = function() {
        var e2 = n.apply(ae, arguments);
        return 0 === e2.length ? Mt(this) : Nt(this, function(e3, t2) {
          return -1 !== t2.indexOf(e3);
        }, e2, "");
      }, d.prototype.startsWithAnyOfIgnoreCase = function() {
        var e2 = n.apply(ae, arguments);
        return 0 === e2.length ? Mt(this) : Nt(this, function(t2, e3) {
          return e3.some(function(e4) {
            return 0 === t2.indexOf(e4);
          });
        }, e2, ct);
      }, d.prototype.anyOf = function() {
        var e2, o2, t2 = this, i2 = n.apply(ae, arguments), a2 = this._cmp;
        try {
          i2.sort(a2);
        } catch (e3) {
          return A(this, S);
        }
        return 0 === i2.length ? Mt(this) : ((e2 = new this.Collection(this, function() {
          return C(i2[0], i2[i2.length - 1]);
        }))._ondirectionchange = function(e3) {
          a2 = "next" === e3 ? t2._ascending : t2._descending, i2.sort(a2);
        }, o2 = 0, e2._addAlgorithm(function(e3, t3, n2) {
          for (var r2 = e3.key; 0 < a2(r2, i2[o2]); ) if (++o2 === i2.length) return t3(n2), false;
          return 0 === a2(r2, i2[o2]) || (t3(function() {
            e3.continue(i2[o2]);
          }), false);
        }), e2);
      }, d.prototype.notEqual = function(e2) {
        return this.inAnyRange([[-1 / 0, e2], [e2, this.db._maxKey]], { includeLowers: false, includeUppers: false });
      }, d.prototype.noneOf = function() {
        var e2 = n.apply(ae, arguments);
        if (0 === e2.length) return new this.Collection(this);
        try {
          e2.sort(this._ascending);
        } catch (e3) {
          return A(this, S);
        }
        var t2 = e2.reduce(function(e3, t3) {
          return e3 ? e3.concat([[e3[e3.length - 1][1], t3]]) : [[-1 / 0, t3]];
        }, null);
        return t2.push([e2[e2.length - 1], this.db._maxKey]), this.inAnyRange(t2, { includeLowers: false, includeUppers: false });
      }, d.prototype.inAnyRange = function(e2, t2) {
        var i2 = this, a2 = this._cmp, u2 = this._ascending, n2 = this._descending, s2 = this._min, c2 = this._max;
        if (0 === e2.length) return Mt(this);
        if (!e2.every(function(e3) {
          return void 0 !== e3[0] && void 0 !== e3[1] && u2(e3[0], e3[1]) <= 0;
        })) return A(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", k.InvalidArgument);
        var r2 = !t2 || false !== t2.includeLowers, o2 = t2 && true === t2.includeUppers;
        var l2, f2 = u2;
        function h2(e3, t3) {
          return f2(e3[0], t3[0]);
        }
        try {
          (l2 = e2.reduce(function(e3, t3) {
            for (var n3 = 0, r3 = e3.length; n3 < r3; ++n3) {
              var o3 = e3[n3];
              if (a2(t3[0], o3[1]) < 0 && 0 < a2(t3[1], o3[0])) {
                o3[0] = s2(o3[0], t3[0]), o3[1] = c2(o3[1], t3[1]);
                break;
              }
            }
            return n3 === r3 && e3.push(t3), e3;
          }, [])).sort(h2);
        } catch (e3) {
          return A(this, S);
        }
        var d2 = 0, p2 = o2 ? function(e3) {
          return 0 < u2(e3, l2[d2][1]);
        } : function(e3) {
          return 0 <= u2(e3, l2[d2][1]);
        }, y2 = r2 ? function(e3) {
          return 0 < n2(e3, l2[d2][0]);
        } : function(e3) {
          return 0 <= n2(e3, l2[d2][0]);
        };
        var v2 = p2, t2 = new this.Collection(this, function() {
          return C(l2[0][0], l2[l2.length - 1][1], !r2, !o2);
        });
        return t2._ondirectionchange = function(e3) {
          f2 = "next" === e3 ? (v2 = p2, u2) : (v2 = y2, n2), l2.sort(h2);
        }, t2._addAlgorithm(function(e3, t3, n3) {
          for (var r3, o3 = e3.key; v2(o3); ) if (++d2 === l2.length) return t3(n3), false;
          return !p2(r3 = o3) && !y2(r3) || (0 === i2._cmp(o3, l2[d2][1]) || 0 === i2._cmp(o3, l2[d2][0]) || t3(function() {
            f2 === u2 ? e3.continue(l2[d2][0]) : e3.continue(l2[d2][1]);
          }), false);
        }), t2;
      }, d.prototype.startsWithAnyOf = function() {
        var e2 = n.apply(ae, arguments);
        return e2.every(function(e3) {
          return "string" == typeof e3;
        }) ? 0 === e2.length ? Mt(this) : this.inAnyRange(e2.map(function(e3) {
          return [e3, e3 + ct];
        })) : A(this, "startsWithAnyOf() only works with strings");
      };
      var Ut = d;
      function d() {
      }
      function T(t2) {
        return E(function(e2) {
          return Vt(e2), t2(e2.target.error), false;
        });
      }
      function Vt(e2) {
        e2.stopPropagation && e2.stopPropagation(), e2.preventDefault && e2.preventDefault();
      }
      var zt = "storagemutated", Wt = "x-storagemutated-1", Yt = Kt(null, zt), $t = (p.prototype._lock = function() {
        return $(!P.global), ++this._reculock, 1 !== this._reculock || P.global || (P.lockOwnerFor = this), this;
      }, p.prototype._unlock = function() {
        if ($(!P.global), 0 == --this._reculock) for (P.global || (P.lockOwnerFor = null); 0 < this._blockedFuncs.length && !this._locked(); ) {
          var e2 = this._blockedFuncs.shift();
          try {
            at(e2[1], e2[0]);
          } catch (e3) {
          }
        }
        return this;
      }, p.prototype._locked = function() {
        return this._reculock && P.lockOwnerFor !== this;
      }, p.prototype.create = function(t2) {
        var n2 = this;
        if (this.mode) {
          var e2 = this.db.idbdb, r2 = this.db._state.dbOpenError;
          if ($(!this.idbtrans), !t2 && !e2) switch (r2 && r2.name) {
            case "DatabaseClosedError":
              throw new k.DatabaseClosed(r2);
            case "MissingAPIError":
              throw new k.MissingAPI(r2.message, r2);
            default:
              throw new k.OpenFailed(r2);
          }
          if (!this.active) throw new k.TransactionInactive();
          $(null === this._completion._state), (t2 = this.idbtrans = t2 || (this.db.core || e2).transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })).onerror = E(function(e3) {
            Vt(e3), n2._reject(t2.error);
          }), t2.onabort = E(function(e3) {
            Vt(e3), n2.active && n2._reject(new k.Abort(t2.error)), n2.active = false, n2.on("abort").fire(e3);
          }), t2.oncomplete = E(function() {
            n2.active = false, n2._resolve(), "mutatedParts" in t2 && Yt.storagemutated.fire(t2.mutatedParts);
          });
        }
        return this;
      }, p.prototype._promise = function(n2, r2, o2) {
        var e2, i2 = this;
        return "readwrite" === n2 && "readwrite" !== this.mode ? w(new k.ReadOnly("Transaction is readonly")) : this.active ? this._locked() ? new K(function(e3, t2) {
          i2._blockedFuncs.push([function() {
            i2._promise(n2, r2, o2).then(e3, t2);
          }, P]);
        }) : o2 ? y(function() {
          var e3 = new K(function(e4, t2) {
            i2._lock();
            var n3 = r2(e4, t2, i2);
            n3 && n3.then && n3.then(e4, t2);
          });
          return e3.finally(function() {
            return i2._unlock();
          }), e3._lib = true, e3;
        }) : ((e2 = new K(function(e3, t2) {
          var n3 = r2(e3, t2, i2);
          n3 && n3.then && n3.then(e3, t2);
        }))._lib = true, e2) : w(new k.TransactionInactive());
      }, p.prototype._root = function() {
        return this.parent ? this.parent._root() : this;
      }, p.prototype.waitFor = function(e2) {
        var t2, r2 = this._root(), o2 = K.resolve(e2), i2 = (r2._waitingFor ? r2._waitingFor = r2._waitingFor.then(function() {
          return o2;
        }) : (r2._waitingFor = o2, r2._waitingQueue = [], t2 = r2.idbtrans.objectStore(r2.storeNames[0]), function e3() {
          for (++r2._spinCount; r2._waitingQueue.length; ) r2._waitingQueue.shift()();
          r2._waitingFor && (t2.get(-1 / 0).onsuccess = e3);
        }()), r2._waitingFor);
        return new K(function(t3, n2) {
          o2.then(function(e3) {
            return r2._waitingQueue.push(E(t3.bind(null, e3)));
          }, function(e3) {
            return r2._waitingQueue.push(E(n2.bind(null, e3)));
          }).finally(function() {
            r2._waitingFor === i2 && (r2._waitingFor = null);
          });
        });
      }, p.prototype.abort = function() {
        this.active && (this.active = false, this.idbtrans && this.idbtrans.abort(), this._reject(new k.Abort()));
      }, p.prototype.table = function(e2) {
        var t2 = this._memoizedTables || (this._memoizedTables = {});
        if (m(t2, e2)) return t2[e2];
        var n2 = this.schema[e2];
        if (n2) return (n2 = new this.db.Table(e2, n2, this)).core = this.db.core.table(e2), t2[e2] = n2;
        throw new k.NotFound("Table " + e2 + " not part of transaction");
      }, p);
      function p() {
      }
      function Qt(e2, t2, n2, r2, o2, i2, a2, u2) {
        return { name: e2, keyPath: t2, unique: n2, multi: r2, auto: o2, compound: i2, src: (n2 && !a2 ? "&" : "") + (r2 ? "*" : "") + (o2 ? "++" : "") + Gt(t2), type: u2 };
      }
      function Gt(e2) {
        return "string" == typeof e2 ? e2 : e2 ? "[" + [].join.call(e2, "+") + "]" : "";
      }
      function Xt(e2, t2, n2) {
        return { name: e2, primKey: t2, indexes: n2, mappedClass: null, idxByName: (r2 = function(e3) {
          return [e3.name, e3];
        }, n2.reduce(function(e3, t3, n3) {
          t3 = r2(t3, n3);
          return t3 && (e3[t3[0]] = t3[1]), e3;
        }, {})) };
        var r2;
      }
      var Ht = function(e2) {
        try {
          return e2.only([[]]), Ht = function() {
            return [[]];
          }, [[]];
        } catch (e3) {
          return Ht = function() {
            return ct;
          }, ct;
        }
      };
      function Jt(t2) {
        return null == t2 ? function() {
        } : "string" == typeof t2 ? 1 === (n2 = t2).split(".").length ? function(e2) {
          return e2[n2];
        } : function(e2) {
          return c(e2, n2);
        } : function(e2) {
          return c(e2, t2);
        };
        var n2;
      }
      function Zt(e2) {
        return [].slice.call(e2);
      }
      var en = 0;
      function tn(e2) {
        return null == e2 ? ":id" : "string" == typeof e2 ? e2 : "[".concat(e2.join("+"), "]");
      }
      function nn(e2, o2, t2) {
        function _2(e3) {
          if (3 === e3.type) return null;
          if (4 === e3.type) throw new Error("Cannot convert never type to IDBKeyRange");
          var t3 = e3.lower, n3 = e3.upper, r3 = e3.lowerOpen, e3 = e3.upperOpen;
          return void 0 === t3 ? void 0 === n3 ? null : o2.upperBound(n3, !!e3) : void 0 === n3 ? o2.lowerBound(t3, !!r3) : o2.bound(t3, n3, !!r3, !!e3);
        }
        function n2(e3) {
          var h2, w2 = e3.name;
          return { name: w2, schema: e3, mutate: function(e4) {
            var y2 = e4.trans, v2 = e4.type, m2 = e4.keys, b2 = e4.values, g2 = e4.range;
            return new Promise(function(t3, e5) {
              t3 = E(t3);
              var n3 = y2.objectStore(w2), r3 = null == n3.keyPath, o3 = "put" === v2 || "add" === v2;
              if (!o3 && "delete" !== v2 && "deleteRange" !== v2) throw new Error("Invalid operation type: " + v2);
              var i3, a3 = (m2 || b2 || { length: 1 }).length;
              if (m2 && b2 && m2.length !== b2.length) throw new Error("Given keys array must have same length as given values array.");
              if (0 === a3) return t3({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
              function u3(e6) {
                ++l2, Vt(e6);
              }
              var s2 = [], c2 = [], l2 = 0;
              if ("deleteRange" === v2) {
                if (4 === g2.type) return t3({ numFailures: l2, failures: c2, results: [], lastResult: void 0 });
                3 === g2.type ? s2.push(i3 = n3.clear()) : s2.push(i3 = n3.delete(_2(g2)));
              } else {
                var r3 = o3 ? r3 ? [b2, m2] : [b2, null] : [m2, null], f2 = r3[0], h3 = r3[1];
                if (o3) for (var d2 = 0; d2 < a3; ++d2) s2.push(i3 = h3 && void 0 !== h3[d2] ? n3[v2](f2[d2], h3[d2]) : n3[v2](f2[d2])), i3.onerror = u3;
                else for (d2 = 0; d2 < a3; ++d2) s2.push(i3 = n3[v2](f2[d2])), i3.onerror = u3;
              }
              function p2(e6) {
                e6 = e6.target.result, s2.forEach(function(e7, t4) {
                  return null != e7.error && (c2[t4] = e7.error);
                }), t3({ numFailures: l2, failures: c2, results: "delete" === v2 ? m2 : s2.map(function(e7) {
                  return e7.result;
                }), lastResult: e6 });
              }
              i3.onerror = function(e6) {
                u3(e6), p2(e6);
              }, i3.onsuccess = p2;
            });
          }, getMany: function(e4) {
            var f2 = e4.trans, h3 = e4.keys;
            return new Promise(function(t3, e5) {
              t3 = E(t3);
              for (var n3, r3 = f2.objectStore(w2), o3 = h3.length, i3 = new Array(o3), a3 = 0, u3 = 0, s2 = function(e6) {
                e6 = e6.target;
                i3[e6._pos] = e6.result, ++u3 === a3 && t3(i3);
              }, c2 = T(e5), l2 = 0; l2 < o3; ++l2) null != h3[l2] && ((n3 = r3.get(h3[l2]))._pos = l2, n3.onsuccess = s2, n3.onerror = c2, ++a3);
              0 === a3 && t3(i3);
            });
          }, get: function(e4) {
            var r3 = e4.trans, o3 = e4.key;
            return new Promise(function(t3, e5) {
              t3 = E(t3);
              var n3 = r3.objectStore(w2).get(o3);
              n3.onsuccess = function(e6) {
                return t3(e6.target.result);
              }, n3.onerror = T(e5);
            });
          }, query: (h2 = a2, function(f2) {
            return new Promise(function(n3, e4) {
              n3 = E(n3);
              var r3, o3, i3, t3 = f2.trans, a3 = f2.values, u3 = f2.limit, s2 = f2.query, c2 = u3 === 1 / 0 ? void 0 : u3, l2 = s2.index, s2 = s2.range, t3 = t3.objectStore(w2), t3 = l2.isPrimaryKey ? t3 : t3.index(l2.name), l2 = _2(s2);
              if (0 === u3) return n3({ result: [] });
              h2 ? ((s2 = a3 ? t3.getAll(l2, c2) : t3.getAllKeys(l2, c2)).onsuccess = function(e5) {
                return n3({ result: e5.target.result });
              }, s2.onerror = T(e4)) : (r3 = 0, o3 = !a3 && "openKeyCursor" in t3 ? t3.openKeyCursor(l2) : t3.openCursor(l2), i3 = [], o3.onsuccess = function(e5) {
                var t4 = o3.result;
                return !t4 || (i3.push(a3 ? t4.value : t4.primaryKey), ++r3 === u3) ? n3({ result: i3 }) : void t4.continue();
              }, o3.onerror = T(e4));
            });
          }), openCursor: function(e4) {
            var c2 = e4.trans, i3 = e4.values, a3 = e4.query, u3 = e4.reverse, l2 = e4.unique;
            return new Promise(function(t3, n3) {
              t3 = E(t3);
              var e5 = a3.index, r3 = a3.range, o3 = c2.objectStore(w2), o3 = e5.isPrimaryKey ? o3 : o3.index(e5.name), e5 = u3 ? l2 ? "prevunique" : "prev" : l2 ? "nextunique" : "next", s2 = !i3 && "openKeyCursor" in o3 ? o3.openKeyCursor(_2(r3), e5) : o3.openCursor(_2(r3), e5);
              s2.onerror = T(n3), s2.onsuccess = E(function(e6) {
                var r4, o4, i4, a4, u4 = s2.result;
                u4 ? (u4.___id = ++en, u4.done = false, r4 = u4.continue.bind(u4), o4 = (o4 = u4.continuePrimaryKey) && o4.bind(u4), i4 = u4.advance.bind(u4), a4 = function() {
                  throw new Error("Cursor not stopped");
                }, u4.trans = c2, u4.stop = u4.continue = u4.continuePrimaryKey = u4.advance = function() {
                  throw new Error("Cursor not started");
                }, u4.fail = E(n3), u4.next = function() {
                  var e7 = this, t4 = 1;
                  return this.start(function() {
                    return t4-- ? e7.continue() : e7.stop();
                  }).then(function() {
                    return e7;
                  });
                }, u4.start = function(e7) {
                  function t4() {
                    if (s2.result) try {
                      e7();
                    } catch (e8) {
                      u4.fail(e8);
                    }
                    else u4.done = true, u4.start = function() {
                      throw new Error("Cursor behind last entry");
                    }, u4.stop();
                  }
                  var n4 = new Promise(function(t5, e8) {
                    t5 = E(t5), s2.onerror = T(e8), u4.fail = e8, u4.stop = function(e9) {
                      u4.stop = u4.continue = u4.continuePrimaryKey = u4.advance = a4, t5(e9);
                    };
                  });
                  return s2.onsuccess = E(function(e8) {
                    s2.onsuccess = t4, t4();
                  }), u4.continue = r4, u4.continuePrimaryKey = o4, u4.advance = i4, t4(), n4;
                }, t3(u4)) : t3(null);
              }, n3);
            });
          }, count: function(e4) {
            var t3 = e4.query, o3 = e4.trans, i3 = t3.index, a3 = t3.range;
            return new Promise(function(t4, e5) {
              var n3 = o3.objectStore(w2), n3 = i3.isPrimaryKey ? n3 : n3.index(i3.name), r3 = _2(a3), r3 = r3 ? n3.count(r3) : n3.count();
              r3.onsuccess = E(function(e6) {
                return t4(e6.target.result);
              }), r3.onerror = T(e5);
            });
          } };
        }
        r2 = t2, i2 = Zt((t2 = e2).objectStoreNames);
        var r2, t2 = { schema: { name: t2.name, tables: i2.map(function(e3) {
          return r2.objectStore(e3);
        }).map(function(t3) {
          var e3 = t3.keyPath, n3 = t3.autoIncrement, r3 = x(e3), o3 = {}, r3 = { name: t3.name, primaryKey: { name: null, isPrimaryKey: true, outbound: null == e3, compound: r3, keyPath: e3, autoIncrement: n3, unique: true, extractKey: Jt(e3) }, indexes: Zt(t3.indexNames).map(function(e4) {
            return t3.index(e4);
          }).map(function(e4) {
            var t4 = e4.name, n4 = e4.unique, r4 = e4.multiEntry, e4 = e4.keyPath, t4 = { name: t4, compound: x(e4), keyPath: e4, unique: n4, multiEntry: r4, extractKey: Jt(e4) };
            return o3[tn(e4)] = t4;
          }), getIndexByKeyPath: function(e4) {
            return o3[tn(e4)];
          } };
          return o3[":id"] = r3.primaryKey, null != e3 && (o3[tn(e3)] = r3.primaryKey), r3;
        }) }, hasGetAll: 0 < i2.length && "getAll" in r2.objectStore(i2[0]) && !("undefined" != typeof navigator && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) }, i2 = t2.schema, a2 = t2.hasGetAll, t2 = i2.tables.map(n2), u2 = {};
        return t2.forEach(function(e3) {
          return u2[e3.name] = e3;
        }), { stack: "dbcore", transaction: e2.transaction.bind(e2), table: function(e3) {
          if (u2[e3]) return u2[e3];
          throw new Error("Table '".concat(e3, "' not found"));
        }, MIN_KEY: -1 / 0, MAX_KEY: Ht(o2), schema: i2 };
      }
      function rn(e2, t2, n2, r2) {
        n2 = n2.IDBKeyRange;
        return t2 = nn(t2, n2, r2), { dbcore: e2.dbcore.reduce(function(e3, t3) {
          t3 = t3.create;
          return _(_({}, e3), t3(e3));
        }, t2) };
      }
      function on(n2, e2) {
        var t2 = e2.db, t2 = rn(n2._middlewares, t2, n2._deps, e2);
        n2.core = t2.dbcore, n2.tables.forEach(function(e3) {
          var t3 = e3.name;
          n2.core.schema.tables.some(function(e4) {
            return e4.name === t3;
          }) && (e3.core = n2.core.table(t3), n2[t3] instanceof n2.Table) && (n2[t3].core = e3.core);
        });
      }
      function an(o2, e2, t2, i2) {
        t2.forEach(function(n2) {
          var r2 = i2[n2];
          e2.forEach(function(e3) {
            var t3 = function e4(t4, n3) {
              return V(t4, n3) || (t4 = F(t4)) && e4(t4, n3);
            }(e3, n2);
            (!t3 || "value" in t3 && void 0 === t3.value) && (e3 === o2.Transaction.prototype || e3 instanceof o2.Transaction ? u(e3, n2, { get: function() {
              return this.table(n2);
            }, set: function(e4) {
              L(this, n2, { value: e4, writable: true, configurable: true, enumerable: true });
            } }) : e3[n2] = new o2.Table(n2, r2));
          });
        });
      }
      function un(n2, e2) {
        e2.forEach(function(e3) {
          for (var t2 in e3) e3[t2] instanceof n2.Table && delete e3[t2];
        });
      }
      function sn(e2, t2) {
        return e2._cfg.version - t2._cfg.version;
      }
      function cn(n2, r2, o2, e2) {
        var i2 = n2._dbSchema, a2 = (o2.objectStoreNames.contains("$meta") && !i2.$meta && (i2.$meta = Xt("$meta", mn("")[0], []), n2._storeNames.push("$meta")), n2._createTransaction("readwrite", n2._storeNames, i2)), u2 = (a2.create(o2), a2._completion.catch(e2), a2._reject.bind(a2)), s2 = P.transless || P;
        y(function() {
          if (P.trans = a2, P.transless = s2, 0 !== r2) return on(n2, o2), t2 = r2, ((e3 = a2).storeNames.includes("$meta") ? e3.table("$meta").get("version").then(function(e4) {
            return null != e4 ? e4 : t2;
          }) : K.resolve(t2)).then(function(e4) {
            var s3 = n2, c2 = e4, l2 = a2, f2 = o2, t3 = [], e4 = s3._versions, h2 = s3._dbSchema = yn(0, s3.idbdb, f2);
            return 0 === (e4 = e4.filter(function(e5) {
              return e5._cfg.version >= c2;
            })).length ? K.resolve() : (e4.forEach(function(u3) {
              t3.push(function() {
                var t4, n3, r3, o3 = h2, e5 = u3._cfg.dbschema, i3 = (vn(s3, o3, f2), vn(s3, e5, f2), h2 = s3._dbSchema = e5, fn(o3, e5)), a3 = (i3.add.forEach(function(e6) {
                  hn(f2, e6[0], e6[1].primKey, e6[1].indexes);
                }), i3.change.forEach(function(e6) {
                  if (e6.recreate) throw new k.Upgrade("Not yet support for changing primary key");
                  var t5 = f2.objectStore(e6.name);
                  e6.add.forEach(function(e7) {
                    return pn(t5, e7);
                  }), e6.change.forEach(function(e7) {
                    t5.deleteIndex(e7.name), pn(t5, e7);
                  }), e6.del.forEach(function(e7) {
                    return t5.deleteIndex(e7);
                  });
                }), u3._cfg.contentUpgrade);
                if (a3 && u3._cfg.version > c2) return on(s3, f2), l2._memoizedTables = {}, t4 = G(e5), i3.del.forEach(function(e6) {
                  t4[e6] = o3[e6];
                }), un(s3, [s3.Transaction.prototype]), an(s3, [s3.Transaction.prototype], O(t4), t4), l2.schema = t4, (n3 = ue(a3)) && nt(), e5 = K.follow(function() {
                  var e6;
                  (r3 = a3(l2)) && n3 && (e6 = v.bind(null, null), r3.then(e6, e6));
                }), r3 && "function" == typeof r3.then ? K.resolve(r3) : e5.then(function() {
                  return r3;
                });
              }), t3.push(function(e5) {
                var t4, n3, r3 = u3._cfg.dbschema;
                t4 = r3, n3 = e5, [].slice.call(n3.db.objectStoreNames).forEach(function(e6) {
                  return null == t4[e6] && n3.db.deleteObjectStore(e6);
                }), un(s3, [s3.Transaction.prototype]), an(s3, [s3.Transaction.prototype], s3._storeNames, s3._dbSchema), l2.schema = s3._dbSchema;
              }), t3.push(function(e5) {
                s3.idbdb.objectStoreNames.contains("$meta") && (Math.ceil(s3.idbdb.version / 10) === u3._cfg.version ? (s3.idbdb.deleteObjectStore("$meta"), delete s3._dbSchema.$meta, s3._storeNames = s3._storeNames.filter(function(e6) {
                  return "$meta" !== e6;
                })) : e5.objectStore("$meta").put(u3._cfg.version, "version"));
              });
            }), function e5() {
              return t3.length ? K.resolve(t3.shift()(l2.idbtrans)).then(e5) : K.resolve();
            }().then(function() {
              dn(h2, f2);
            }));
          }).catch(u2);
          var e3, t2;
          O(i2).forEach(function(e4) {
            hn(o2, e4, i2[e4].primKey, i2[e4].indexes);
          }), on(n2, o2), K.follow(function() {
            return n2.on.populate.fire(a2);
          }).catch(u2);
        });
      }
      function ln(e2, r2) {
        dn(e2._dbSchema, r2), r2.db.version % 10 != 0 || r2.objectStoreNames.contains("$meta") || r2.db.createObjectStore("$meta").add(Math.ceil(r2.db.version / 10 - 1), "version");
        var t2 = yn(0, e2.idbdb, r2);
        vn(e2, e2._dbSchema, r2);
        for (var n2 = 0, o2 = fn(t2, e2._dbSchema).change; n2 < o2.length; n2++) {
          var i2 = ((t3) => {
            if (t3.change.length || t3.recreate) return console.warn("Unable to patch indexes of table ".concat(t3.name, " because it has changes on the type of index or primary key.")), { value: void 0 };
            var n3 = r2.objectStore(t3.name);
            t3.add.forEach(function(e3) {
              l && console.debug("Dexie upgrade patch: Creating missing index ".concat(t3.name, ".").concat(e3.src)), pn(n3, e3);
            });
          })(o2[n2]);
          if ("object" == typeof i2) return i2.value;
        }
      }
      function fn(e2, t2) {
        var n2, r2 = { del: [], add: [], change: [] };
        for (n2 in e2) t2[n2] || r2.del.push(n2);
        for (n2 in t2) {
          var o2 = e2[n2], i2 = t2[n2];
          if (o2) {
            var a2 = { name: n2, def: i2, recreate: false, del: [], add: [], change: [] };
            if ("" + (o2.primKey.keyPath || "") != "" + (i2.primKey.keyPath || "") || o2.primKey.auto !== i2.primKey.auto) a2.recreate = true, r2.change.push(a2);
            else {
              var u2 = o2.idxByName, s2 = i2.idxByName, c2 = void 0;
              for (c2 in u2) s2[c2] || a2.del.push(c2);
              for (c2 in s2) {
                var l2 = u2[c2], f2 = s2[c2];
                l2 ? l2.src !== f2.src && a2.change.push(f2) : a2.add.push(f2);
              }
              (0 < a2.del.length || 0 < a2.add.length || 0 < a2.change.length) && r2.change.push(a2);
            }
          } else r2.add.push([n2, i2]);
        }
        return r2;
      }
      function hn(e2, t2, n2, r2) {
        var o2 = e2.db.createObjectStore(t2, n2.keyPath ? { keyPath: n2.keyPath, autoIncrement: n2.auto } : { autoIncrement: n2.auto });
        r2.forEach(function(e3) {
          return pn(o2, e3);
        });
      }
      function dn(t2, n2) {
        O(t2).forEach(function(e2) {
          n2.db.objectStoreNames.contains(e2) || (l && console.debug("Dexie: Creating missing table", e2), hn(n2, e2, t2[e2].primKey, t2[e2].indexes));
        });
      }
      function pn(e2, t2) {
        e2.createIndex(t2.name, t2.keyPath, { unique: t2.unique, multiEntry: t2.multi });
      }
      function yn(e2, t2, u2) {
        var s2 = {};
        return W(t2.objectStoreNames, 0).forEach(function(e3) {
          for (var t3 = u2.objectStore(e3), n2 = Qt(Gt(a2 = t3.keyPath), a2 || "", true, false, !!t3.autoIncrement, a2 && "string" != typeof a2, true), r2 = [], o2 = 0; o2 < t3.indexNames.length; ++o2) {
            var i2 = t3.index(t3.indexNames[o2]), a2 = i2.keyPath, i2 = Qt(i2.name, a2, !!i2.unique, !!i2.multiEntry, false, a2 && "string" != typeof a2, false);
            r2.push(i2);
          }
          s2[e3] = Xt(e3, n2, r2);
        }), s2;
      }
      function vn(e2, t2, n2) {
        for (var r2 = n2.db.objectStoreNames, o2 = 0; o2 < r2.length; ++o2) {
          var i2 = r2[o2], a2 = n2.objectStore(i2);
          e2._hasGetAll = "getAll" in a2;
          for (var u2 = 0; u2 < a2.indexNames.length; ++u2) {
            var s2, c2 = a2.indexNames[u2], l2 = a2.index(c2).keyPath, l2 = "string" == typeof l2 ? l2 : "[" + W(l2).join("+") + "]";
            t2[i2] && (s2 = t2[i2].idxByName[l2]) && (s2.name = c2, delete t2[i2].idxByName[l2], t2[i2].idxByName[c2] = s2);
          }
        }
        "undefined" != typeof navigator && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && f.WorkerGlobalScope && f instanceof f.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (e2._hasGetAll = false);
      }
      function mn(e2) {
        return e2.split(",").map(function(e3, t2) {
          var n2 = e3.split(":"), r2 = null == (r2 = n2[1]) ? void 0 : r2.trim(), n2 = (e3 = n2[0].trim()).replace(/([&*]|\+\+)/g, ""), o2 = /^\[/.test(n2) ? n2.match(/^\[(.*)\]$/)[1].split("+") : n2;
          return Qt(n2, o2 || null, /\&/.test(e3), /\*/.test(e3), /\+\+/.test(e3), x(o2), 0 === t2, r2);
        });
      }
      gn.prototype._createTableSchema = Xt, gn.prototype._parseIndexSyntax = mn, gn.prototype._parseStoresSpec = function(r2, o2) {
        var i2 = this;
        O(r2).forEach(function(e2) {
          if (null !== r2[e2]) {
            var t2 = i2._parseIndexSyntax(r2[e2]), n2 = t2.shift();
            if (!n2) throw new k.Schema("Invalid schema for table " + e2 + ": " + r2[e2]);
            if (n2.unique = true, n2.multi) throw new k.Schema("Primary key cannot be multiEntry*");
            t2.forEach(function(e3) {
              if (e3.auto) throw new k.Schema("Only primary key can be marked as autoIncrement (++)");
              if (!e3.keyPath) throw new k.Schema("Index must have a name and cannot be an empty string");
            });
            n2 = i2._createTableSchema(e2, n2, t2);
            o2[e2] = n2;
          }
        });
      }, gn.prototype.stores = function(e2) {
        var t2 = this.db, e2 = (this._cfg.storesSource = this._cfg.storesSource ? a(this._cfg.storesSource, e2) : e2, t2._versions), n2 = {}, r2 = {};
        return e2.forEach(function(e3) {
          a(n2, e3._cfg.storesSource), r2 = e3._cfg.dbschema = {}, e3._parseStoresSpec(n2, r2);
        }), t2._dbSchema = r2, un(t2, [t2._allTables, t2, t2.Transaction.prototype]), an(t2, [t2._allTables, t2, t2.Transaction.prototype, this._cfg.tables], O(r2), r2), t2._storeNames = O(r2), this;
      }, gn.prototype.upgrade = function(e2) {
        return this._cfg.contentUpgrade = ke(this._cfg.contentUpgrade || g, e2), this;
      };
      var bn = gn;
      function gn() {
      }
      function wn(e2, t2) {
        var n2 = e2._dbNamesDB;
        return n2 || (n2 = e2._dbNamesDB = new q(ht, { addons: [], indexedDB: e2, IDBKeyRange: t2 })).version(1).stores({ dbnames: "name" }), n2.table("dbnames");
      }
      function _n(e2) {
        return e2 && "function" == typeof e2.databases;
      }
      function xn(e2) {
        return y(function() {
          return P.letThrough = true, e2();
        });
      }
      function kn(e2) {
        return !("from" in e2);
      }
      var I = function(e2, t2) {
        var n2;
        if (!this) return n2 = new I(), e2 && "d" in e2 && a(n2, e2), n2;
        a(this, arguments.length ? { d: 1, from: e2, to: 1 < arguments.length ? t2 : e2 } : { d: 0 });
      };
      function On(e2, t2, n2) {
        var r2 = j(t2, n2);
        if (!isNaN(r2)) {
          if (0 < r2) throw RangeError();
          if (kn(e2)) return a(e2, { from: t2, to: n2, d: 1 });
          var r2 = e2.l, o2 = e2.r;
          if (j(n2, e2.from) < 0) return r2 ? On(r2, t2, n2) : e2.l = { from: t2, to: n2, d: 1, l: null, r: null }, Sn(e2);
          if (0 < j(t2, e2.to)) return o2 ? On(o2, t2, n2) : e2.r = { from: t2, to: n2, d: 1, l: null, r: null }, Sn(e2);
          j(t2, e2.from) < 0 && (e2.from = t2, e2.l = null, e2.d = o2 ? o2.d + 1 : 1), 0 < j(n2, e2.to) && (e2.to = n2, e2.r = null, e2.d = e2.l ? e2.l.d + 1 : 1);
          t2 = !e2.r;
          r2 && !e2.l && Pn(e2, r2), o2 && t2 && Pn(e2, o2);
        }
      }
      function Pn(e2, t2) {
        kn(t2) || function e3(t3, n2) {
          var r2 = n2.from, o2 = n2.l, i2 = n2.r;
          On(t3, r2, n2.to), o2 && e3(t3, o2), i2 && e3(t3, i2);
        }(e2, t2);
      }
      function Kn(e2, t2) {
        var n2 = En(t2), r2 = n2.next();
        if (!r2.done) for (var o2 = r2.value, i2 = En(e2), a2 = i2.next(o2.from), u2 = a2.value; !r2.done && !a2.done; ) {
          if (j(u2.from, o2.to) <= 0 && 0 <= j(u2.to, o2.from)) return true;
          j(o2.from, u2.from) < 0 ? o2 = (r2 = n2.next(u2.from)).value : u2 = (a2 = i2.next(o2.from)).value;
        }
        return false;
      }
      function En(e2) {
        var n2 = kn(e2) ? null : { s: 0, n: e2 };
        return { next: function(e3) {
          for (var t2 = 0 < arguments.length; n2; ) switch (n2.s) {
            case 0:
              if (n2.s = 1, t2) for (; n2.n.l && j(e3, n2.n.from) < 0; ) n2 = { up: n2, n: n2.n.l, s: 1 };
              else for (; n2.n.l; ) n2 = { up: n2, n: n2.n.l, s: 1 };
            case 1:
              if (n2.s = 2, !t2 || j(e3, n2.n.to) <= 0) return { value: n2.n, done: false };
            case 2:
              if (n2.n.r) {
                n2.s = 3, n2 = { up: n2, n: n2.n.r, s: 0 };
                continue;
              }
            case 3:
              n2 = n2.up;
          }
          return { done: true };
        } };
      }
      function Sn(e2) {
        var t2, n2, r2, o2 = ((null == (o2 = e2.r) ? void 0 : o2.d) || 0) - ((null == (o2 = e2.l) ? void 0 : o2.d) || 0), o2 = 1 < o2 ? "r" : o2 < -1 ? "l" : "";
        o2 && (t2 = "r" == o2 ? "l" : "r", n2 = _({}, e2), r2 = e2[o2], e2.from = r2.from, e2.to = r2.to, e2[o2] = r2[o2], n2[o2] = r2[t2], (e2[t2] = n2).d = jn(n2)), e2.d = jn(e2);
      }
      function jn(e2) {
        var t2 = e2.r, e2 = e2.l;
        return (t2 ? e2 ? Math.max(t2.d, e2.d) : t2.d : e2 ? e2.d : 0) + 1;
      }
      function An(t2, n2) {
        return O(n2).forEach(function(e2) {
          t2[e2] ? Pn(t2[e2], n2[e2]) : t2[e2] = function e3(t3) {
            var n3, r2, o2 = {};
            for (n3 in t3) m(t3, n3) && (r2 = t3[n3], o2[n3] = !r2 || "object" != typeof r2 || J.has(r2.constructor) ? r2 : e3(r2));
            return o2;
          }(n2[e2]);
        }), t2;
      }
      function Cn(t2, n2) {
        return t2.all || n2.all || Object.keys(t2).some(function(e2) {
          return n2[e2] && Kn(n2[e2], t2[e2]);
        });
      }
      N(I.prototype, ((t = { add: function(e2) {
        return Pn(this, e2), this;
      }, addKey: function(e2) {
        return On(this, e2, e2), this;
      }, addKeys: function(e2) {
        var t2 = this;
        return e2.forEach(function(e3) {
          return On(t2, e3, e3);
        }), this;
      }, hasKey: function(e2) {
        var t2 = En(this).next(e2).value;
        return t2 && j(t2.from, e2) <= 0 && 0 <= j(t2.to, e2);
      } })[re] = function() {
        return En(this);
      }, t));
      var Tn = {}, In = {}, qn = false;
      function Dn(e2) {
        An(In, e2), qn || (qn = true, setTimeout(function() {
          qn = false, Bn(In, !(In = {}));
        }, 0));
      }
      function Bn(e2, t2) {
        void 0 === t2 && (t2 = false);
        var n2 = /* @__PURE__ */ new Set();
        if (e2.all) for (var r2 = 0, o2 = Object.values(Tn); r2 < o2.length; r2++) Rn(u2 = o2[r2], e2, n2, t2);
        else for (var i2 in e2) {
          var a2, u2, i2 = /^idb\:\/\/(.*)\/(.*)\//.exec(i2);
          i2 && (a2 = i2[1], i2 = i2[2], u2 = Tn["idb://".concat(a2, "/").concat(i2)]) && Rn(u2, e2, n2, t2);
        }
        n2.forEach(function(e3) {
          return e3();
        });
      }
      function Rn(e2, t2, n2, r2) {
        for (var o2 = [], i2 = 0, a2 = Object.entries(e2.queries.query); i2 < a2.length; i2++) {
          for (var u2 = a2[i2], s2 = u2[0], c2 = [], l2 = 0, f2 = u2[1]; l2 < f2.length; l2++) {
            var h2 = f2[l2];
            Cn(t2, h2.obsSet) ? h2.subscribers.forEach(function(e3) {
              return n2.add(e3);
            }) : r2 && c2.push(h2);
          }
          r2 && o2.push([s2, c2]);
        }
        if (r2) for (var d2 = 0, p2 = o2; d2 < p2.length; d2++) {
          var y2 = p2[d2], s2 = y2[0], c2 = y2[1];
          e2.queries.query[s2] = c2;
        }
      }
      function Fn(h2) {
        var d2 = h2._state, r2 = h2._deps.indexedDB;
        if (d2.isBeingOpened || h2.idbdb) return d2.dbReadyPromise.then(function() {
          return d2.dbOpenError ? w(d2.dbOpenError) : h2;
        });
        d2.isBeingOpened = true, d2.dbOpenError = null, d2.openComplete = false;
        var t2 = d2.openCanceller, p2 = Math.round(10 * h2.verno), y2 = false;
        function e2() {
          if (d2.openCanceller !== t2) throw new k.DatabaseClosed("db.open() was cancelled");
        }
        function v2() {
          return new K(function(c2, n3) {
            if (e2(), !r2) throw new k.MissingAPI();
            var l2 = h2.name, f2 = d2.autoSchema || !p2 ? r2.open(l2) : r2.open(l2, p2);
            if (!f2) throw new k.MissingAPI();
            f2.onerror = T(n3), f2.onblocked = E(h2._fireOnBlocked), f2.onupgradeneeded = E(function(e3) {
              var t3;
              m2 = f2.transaction, d2.autoSchema && !h2._options.allowEmptyDB ? (f2.onerror = Vt, m2.abort(), f2.result.close(), (t3 = r2.deleteDatabase(l2)).onsuccess = t3.onerror = E(function() {
                n3(new k.NoSuchDatabase("Database ".concat(l2, " doesnt exist")));
              })) : (m2.onerror = T(n3), t3 = e3.oldVersion > Math.pow(2, 62) ? 0 : e3.oldVersion, b2 = t3 < 1, h2.idbdb = f2.result, y2 && ln(h2, m2), cn(h2, t3 / 10, m2, n3));
            }, n3), f2.onsuccess = E(function() {
              m2 = null;
              var e3, t3, n4, r3, o3, i2, a2 = h2.idbdb = f2.result, u2 = W(a2.objectStoreNames);
              if (0 < u2.length) try {
                var s2 = a2.transaction(1 === (o3 = u2).length ? o3[0] : o3, "readonly");
                if (d2.autoSchema) i2 = a2, r3 = s2, (n4 = h2).verno = i2.version / 10, r3 = n4._dbSchema = yn(0, i2, r3), n4._storeNames = W(i2.objectStoreNames, 0), an(n4, [n4._allTables], O(r3), r3);
                else if (vn(h2, h2._dbSchema, s2), t3 = s2, ((t3 = fn(yn(0, (e3 = h2).idbdb, t3), e3._dbSchema)).add.length || t3.change.some(function(e4) {
                  return e4.add.length || e4.change.length;
                })) && !y2) return console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this."), a2.close(), p2 = a2.version + 1, y2 = true, c2(v2());
                on(h2, s2);
              } catch (e4) {
              }
              ft.push(h2), a2.onversionchange = E(function(e4) {
                d2.vcFired = true, h2.on("versionchange").fire(e4);
              }), a2.onclose = E(function() {
                h2.close({ disableAutoOpen: false });
              }), b2 && (u2 = h2._deps, o3 = l2, _n(i2 = u2.indexedDB) || o3 === ht || wn(i2, u2.IDBKeyRange).put({ name: o3 }).catch(g)), c2();
            }, n3);
          }).catch(function(e3) {
            switch (null == e3 ? void 0 : e3.name) {
              case "UnknownError":
                if (0 < d2.PR1398_maxLoop) return d2.PR1398_maxLoop--, console.warn("Dexie: Workaround for Chrome UnknownError on open()"), v2();
                break;
              case "VersionError":
                if (0 < p2) return p2 = 0, v2();
            }
            return K.reject(e3);
          });
        }
        var n2, o2 = d2.dbReadyResolve, m2 = null, b2 = false;
        return K.race([t2, ("undefined" == typeof navigator ? K.resolve() : !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise(function(e3) {
          function t3() {
            return indexedDB.databases().finally(e3);
          }
          n2 = setInterval(t3, 100), t3();
        }).finally(function() {
          return clearInterval(n2);
        }) : Promise.resolve()).then(v2)]).then(function() {
          return e2(), d2.onReadyBeingFired = [], K.resolve(xn(function() {
            return h2.on.ready.fire(h2.vip);
          })).then(function e3() {
            var t3;
            if (0 < d2.onReadyBeingFired.length) return t3 = d2.onReadyBeingFired.reduce(ke, g), d2.onReadyBeingFired = [], K.resolve(xn(function() {
              return t3(h2.vip);
            })).then(e3);
          });
        }).finally(function() {
          d2.openCanceller === t2 && (d2.onReadyBeingFired = null, d2.isBeingOpened = false);
        }).catch(function(e3) {
          d2.dbOpenError = e3;
          try {
            m2 && m2.abort();
          } catch (e4) {
          }
          return t2 === d2.openCanceller && h2._close(), w(e3);
        }).finally(function() {
          d2.openComplete = true, o2();
        }).then(function() {
          var n3;
          return b2 && (n3 = {}, h2.tables.forEach(function(t3) {
            t3.schema.indexes.forEach(function(e3) {
              e3.name && (n3["idb://".concat(h2.name, "/").concat(t3.name, "/").concat(e3.name)] = new I(-1 / 0, [[[]]]));
            }), n3["idb://".concat(h2.name, "/").concat(t3.name, "/")] = n3["idb://".concat(h2.name, "/").concat(t3.name, "/:dels")] = new I(-1 / 0, [[[]]]);
          }), Yt(zt).fire(n3), Bn(n3, true)), h2;
        });
      }
      function Mn(t2) {
        function e2(e3) {
          return t2.next(e3);
        }
        var r2 = n2(e2), o2 = n2(function(e3) {
          return t2.throw(e3);
        });
        function n2(n3) {
          return function(e3) {
            var e3 = n3(e3), t3 = e3.value;
            return e3.done ? t3 : t3 && "function" == typeof t3.then ? t3.then(r2, o2) : x(t3) ? Promise.all(t3).then(r2, o2) : r2(t3);
          };
        }
        return n2(e2)();
      }
      function Nn(e2, t2, n2) {
        for (var r2 = x(e2) ? e2.slice() : [e2], o2 = 0; o2 < n2; ++o2) r2.push(t2);
        return r2;
      }
      var Ln = { stack: "dbcore", name: "VirtualIndexMiddleware", level: 1, create: function(l2) {
        return _(_({}, l2), { table: function(e2) {
          var i2 = l2.table(e2), e2 = i2.schema, u2 = {}, s2 = [];
          function c2(e3, t3, n3) {
            var r3 = tn(e3), o3 = u2[r3] = u2[r3] || [], i3 = null == e3 ? 0 : "string" == typeof e3 ? 1 : e3.length, a3 = 0 < t3, r3 = _(_({}, n3), { name: a3 ? "".concat(r3, "(virtual-from:").concat(n3.name, ")") : n3.name, lowLevelIndex: n3, isVirtual: a3, keyTail: t3, keyLength: i3, extractKey: Jt(e3), unique: !a3 && n3.unique });
            return o3.push(r3), r3.isPrimaryKey || s2.push(r3), 1 < i3 && c2(2 === i3 ? e3[0] : e3.slice(0, i3 - 1), t3 + 1, n3), o3.sort(function(e4, t4) {
              return e4.keyTail - t4.keyTail;
            }), r3;
          }
          var t2 = c2(e2.primaryKey.keyPath, 0, e2.primaryKey);
          u2[":id"] = [t2];
          for (var n2 = 0, r2 = e2.indexes; n2 < r2.length; n2++) {
            var o2 = r2[n2];
            c2(o2.keyPath, 0, o2);
          }
          function a2(e3) {
            var t3, n3 = e3.query.index;
            return n3.isVirtual ? _(_({}, e3), { query: { index: n3.lowLevelIndex, range: (t3 = e3.query.range, n3 = n3.keyTail, { type: 1 === t3.type ? 2 : t3.type, lower: Nn(t3.lower, t3.lowerOpen ? l2.MAX_KEY : l2.MIN_KEY, n3), lowerOpen: true, upper: Nn(t3.upper, t3.upperOpen ? l2.MIN_KEY : l2.MAX_KEY, n3), upperOpen: true }) } }) : e3;
          }
          return _(_({}, i2), { schema: _(_({}, e2), { primaryKey: t2, indexes: s2, getIndexByKeyPath: function(e3) {
            return (e3 = u2[tn(e3)]) && e3[0];
          } }), count: function(e3) {
            return i2.count(a2(e3));
          }, query: function(e3) {
            return i2.query(a2(e3));
          }, openCursor: function(t3) {
            var e3 = t3.query.index, r3 = e3.keyTail, o3 = e3.keyLength;
            return e3.isVirtual ? i2.openCursor(a2(t3)).then(function(e4) {
              return e4 && n3(e4);
            }) : i2.openCursor(t3);
            function n3(n4) {
              return Object.create(n4, { continue: { value: function(e4) {
                null != e4 ? n4.continue(Nn(e4, t3.reverse ? l2.MAX_KEY : l2.MIN_KEY, r3)) : t3.unique ? n4.continue(n4.key.slice(0, o3).concat(t3.reverse ? l2.MIN_KEY : l2.MAX_KEY, r3)) : n4.continue();
              } }, continuePrimaryKey: { value: function(e4, t4) {
                n4.continuePrimaryKey(Nn(e4, l2.MAX_KEY, r3), t4);
              } }, primaryKey: { get: function() {
                return n4.primaryKey;
              } }, key: { get: function() {
                var e4 = n4.key;
                return 1 === o3 ? e4[0] : e4.slice(0, o3);
              } }, value: { get: function() {
                return n4.value;
              } } });
            }
          } });
        } });
      } };
      function Un(o2, i2, a2, u2) {
        return a2 = a2 || {}, u2 = u2 || "", O(o2).forEach(function(e2) {
          var t2, n2, r2;
          m(i2, e2) ? (t2 = o2[e2], n2 = i2[e2], "object" == typeof t2 && "object" == typeof n2 && t2 && n2 ? (r2 = ne(t2)) !== ne(n2) ? a2[u2 + e2] = i2[e2] : "Object" === r2 ? Un(t2, n2, a2, u2 + e2 + ".") : t2 !== n2 && (a2[u2 + e2] = i2[e2]) : t2 !== n2 && (a2[u2 + e2] = i2[e2])) : a2[u2 + e2] = void 0;
        }), O(i2).forEach(function(e2) {
          m(o2, e2) || (a2[u2 + e2] = i2[e2]);
        }), a2;
      }
      function Vn(e2, t2) {
        return "delete" === t2.type ? t2.keys : t2.keys || t2.values.map(e2.extractKey);
      }
      var zn = { stack: "dbcore", name: "HooksMiddleware", level: 2, create: function(e2) {
        return _(_({}, e2), { table: function(r2) {
          var y2 = e2.table(r2), v2 = y2.schema.primaryKey;
          return _(_({}, y2), { mutate: function(e3) {
            var t2 = P.trans, n2 = t2.table(r2).hook, h2 = n2.deleting, d2 = n2.creating, p2 = n2.updating;
            switch (e3.type) {
              case "add":
                if (d2.fire === g) break;
                return t2._promise("readwrite", function() {
                  return a2(e3);
                }, true);
              case "put":
                if (d2.fire === g && p2.fire === g) break;
                return t2._promise("readwrite", function() {
                  return a2(e3);
                }, true);
              case "delete":
                if (h2.fire === g) break;
                return t2._promise("readwrite", function() {
                  return a2(e3);
                }, true);
              case "deleteRange":
                if (h2.fire === g) break;
                return t2._promise("readwrite", function() {
                  return function n3(r3, o2, i2) {
                    return y2.query({ trans: r3, values: false, query: { index: v2, range: o2 }, limit: i2 }).then(function(e4) {
                      var t3 = e4.result;
                      return a2({ type: "delete", keys: t3, trans: r3 }).then(function(e5) {
                        return 0 < e5.numFailures ? Promise.reject(e5.failures[0]) : t3.length < i2 ? { failures: [], numFailures: 0, lastResult: void 0 } : n3(r3, _(_({}, o2), { lower: t3[t3.length - 1], lowerOpen: true }), i2);
                      });
                    });
                  }(e3.trans, e3.range, 1e4);
                }, true);
            }
            return y2.mutate(e3);
            function a2(c2) {
              var e4, t3, n3, l2 = P.trans, f2 = c2.keys || Vn(v2, c2);
              if (f2) return "delete" !== (c2 = "add" === c2.type || "put" === c2.type ? _(_({}, c2), { keys: f2 }) : _({}, c2)).type && (c2.values = R([], c2.values)), c2.keys && (c2.keys = R([], c2.keys)), e4 = y2, n3 = f2, ("add" === (t3 = c2).type ? Promise.resolve([]) : e4.getMany({ trans: t3.trans, keys: n3, cache: "immutable" })).then(function(u2) {
                var s2 = f2.map(function(e5, t4) {
                  var n4, r3, o2, i2 = u2[t4], a3 = { onerror: null, onsuccess: null };
                  return "delete" === c2.type ? h2.fire.call(a3, e5, i2, l2) : "add" === c2.type || void 0 === i2 ? (n4 = d2.fire.call(a3, e5, c2.values[t4], l2), null == e5 && null != n4 && (c2.keys[t4] = e5 = n4, v2.outbound || b(c2.values[t4], v2.keyPath, e5))) : (n4 = Un(i2, c2.values[t4]), (r3 = p2.fire.call(a3, n4, e5, i2, l2)) && (o2 = c2.values[t4], Object.keys(r3).forEach(function(e6) {
                    m(o2, e6) ? o2[e6] = r3[e6] : b(o2, e6, r3[e6]);
                  }))), a3;
                });
                return y2.mutate(c2).then(function(e5) {
                  for (var t4 = e5.failures, n4 = e5.results, r3 = e5.numFailures, e5 = e5.lastResult, o2 = 0; o2 < f2.length; ++o2) {
                    var i2 = (n4 || f2)[o2], a3 = s2[o2];
                    null == i2 ? a3.onerror && a3.onerror(t4[o2]) : a3.onsuccess && a3.onsuccess("put" === c2.type && u2[o2] ? c2.values[o2] : i2);
                  }
                  return { failures: t4, results: n4, numFailures: r3, lastResult: e5 };
                }).catch(function(t4) {
                  return s2.forEach(function(e5) {
                    return e5.onerror && e5.onerror(t4);
                  }), Promise.reject(t4);
                });
              });
              throw new Error("Keys missing");
            }
          } });
        } });
      } };
      function Wn(e2, t2, n2) {
        try {
          if (!t2) return null;
          if (t2.keys.length < e2.length) return null;
          for (var r2 = [], o2 = 0, i2 = 0; o2 < t2.keys.length && i2 < e2.length; ++o2) 0 === j(t2.keys[o2], e2[i2]) && (r2.push(n2 ? ee(t2.values[o2]) : t2.values[o2]), ++i2);
          return r2.length === e2.length ? r2 : null;
        } catch (e3) {
          return null;
        }
      }
      var Yn = { stack: "dbcore", level: -1, create: function(t2) {
        return { table: function(e2) {
          var n2 = t2.table(e2);
          return _(_({}, n2), { getMany: function(t3) {
            var e3;
            return t3.cache ? (e3 = Wn(t3.keys, t3.trans._cache, "clone" === t3.cache)) ? K.resolve(e3) : n2.getMany(t3).then(function(e4) {
              return t3.trans._cache = { keys: t3.keys, values: "clone" === t3.cache ? ee(e4) : e4 }, e4;
            }) : n2.getMany(t3);
          }, mutate: function(e3) {
            return "add" !== e3.type && (e3.trans._cache = null), n2.mutate(e3);
          } });
        } };
      } };
      function $n(e2, t2) {
        return "readonly" === e2.trans.mode && !!e2.subscr && !e2.trans.explicit && "disabled" !== e2.trans.db._options.cache && !t2.schema.primaryKey.outbound;
      }
      function Qn(e2, t2) {
        switch (e2) {
          case "query":
            return t2.values && !t2.unique;
          case "get":
          case "getMany":
          case "count":
          case "openCursor":
            return false;
        }
      }
      var Gn = { stack: "dbcore", level: 0, name: "Observability", create: function(b2) {
        var g2 = b2.schema.name, w2 = new I(b2.MIN_KEY, b2.MAX_KEY);
        return _(_({}, b2), { transaction: function(e2, t2, n2) {
          if (P.subscr && "readonly" !== t2) throw new k.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(P.querier));
          return b2.transaction(e2, t2, n2);
        }, table: function(d2) {
          function e2(e3) {
            var t3, e3 = e3.query;
            return [t3 = e3.index, new I(null != (t3 = (e3 = e3.range).lower) ? t3 : b2.MIN_KEY, null != (t3 = e3.upper) ? t3 : b2.MAX_KEY)];
          }
          var p2 = b2.table(d2), y2 = p2.schema, v2 = y2.primaryKey, t2 = y2.indexes, c2 = v2.extractKey, l2 = v2.outbound, m2 = v2.autoIncrement && t2.filter(function(e3) {
            return e3.compound && e3.keyPath.includes(v2.keyPath);
          }), n2 = _(_({}, p2), { mutate: function(a2) {
            function u2(e4) {
              return e4 = "idb://".concat(g2, "/").concat(d2, "/").concat(e4), n3[e4] || (n3[e4] = new I());
            }
            var e3, i2, s2, t3 = a2.trans, n3 = a2.mutatedParts || (a2.mutatedParts = {}), r2 = u2(""), o2 = u2(":dels"), c3 = a2.type, l3 = "deleteRange" === a2.type ? [a2.range] : "delete" === a2.type ? [a2.keys] : a2.values.length < 50 ? [Vn(v2, a2).filter(function(e4) {
              return e4;
            }), a2.values] : [], f3 = l3[0], l3 = l3[1], h2 = a2.trans._cache;
            return x(f3) ? (r2.addKeys(f3), (c3 = "delete" === c3 || f3.length === l3.length ? Wn(f3, h2) : null) || o2.addKeys(f3), (c3 || l3) && (e3 = u2, i2 = c3, s2 = l3, y2.indexes.forEach(function(t4) {
              var n4 = e3(t4.name || "");
              function r3(e4) {
                return null != e4 ? t4.extractKey(e4) : null;
              }
              function o3(e4) {
                t4.multiEntry && x(e4) ? e4.forEach(function(e5) {
                  return n4.addKey(e5);
                }) : n4.addKey(e4);
              }
              (i2 || s2).forEach(function(e4, t5) {
                var n5 = i2 && r3(i2[t5]), t5 = s2 && r3(s2[t5]);
                0 !== j(n5, t5) && (null != n5 && o3(n5), null != t5) && o3(t5);
              });
            }))) : f3 ? (l3 = { from: null != (h2 = f3.lower) ? h2 : b2.MIN_KEY, to: null != (c3 = f3.upper) ? c3 : b2.MAX_KEY }, o2.add(l3), r2.add(l3)) : (r2.add(w2), o2.add(w2), y2.indexes.forEach(function(e4) {
              return u2(e4.name).add(w2);
            })), p2.mutate(a2).then(function(i3) {
              return !f3 || "add" !== a2.type && "put" !== a2.type || (r2.addKeys(i3.results), m2 && m2.forEach(function(t4) {
                for (var e4 = a2.values.map(function(e5) {
                  return t4.extractKey(e5);
                }), n4 = t4.keyPath.findIndex(function(e5) {
                  return e5 === v2.keyPath;
                }), r3 = 0, o3 = i3.results.length; r3 < o3; ++r3) e4[r3][n4] = i3.results[r3];
                u2(t4.name).addKeys(e4);
              })), t3.mutatedParts = An(t3.mutatedParts || {}, n3), i3;
            });
          } }), f2 = { get: function(e3) {
            return [v2, new I(e3.key)];
          }, getMany: function(e3) {
            return [v2, new I().addKeys(e3.keys)];
          }, count: e2, query: e2, openCursor: e2 };
          return O(f2).forEach(function(s2) {
            n2[s2] = function(o2) {
              var e3 = P.subscr, t3 = !!e3, n3 = $n(P, p2) && Qn(s2, o2) ? o2.obsSet = {} : e3;
              if (t3) {
                var i2, e3 = function(e4) {
                  e4 = "idb://".concat(g2, "/").concat(d2, "/").concat(e4);
                  return n3[e4] || (n3[e4] = new I());
                }, a2 = e3(""), u2 = e3(":dels"), t3 = f2[s2](o2), r2 = t3[0], t3 = t3[1];
                if (("query" === s2 && r2.isPrimaryKey && !o2.values ? u2 : e3(r2.name || "")).add(t3), !r2.isPrimaryKey) {
                  if ("count" !== s2) return i2 = "query" === s2 && l2 && o2.values && p2.query(_(_({}, o2), { values: false })), p2[s2].apply(this, arguments).then(function(t4) {
                    if ("query" === s2) {
                      if (l2 && o2.values) return i2.then(function(e5) {
                        e5 = e5.result;
                        return a2.addKeys(e5), t4;
                      });
                      var e4 = o2.values ? t4.result.map(c2) : t4.result;
                      (o2.values ? a2 : u2).addKeys(e4);
                    } else {
                      var n4, r3;
                      if ("openCursor" === s2) return r3 = o2.values, (n4 = t4) && Object.create(n4, { key: { get: function() {
                        return u2.addKey(n4.primaryKey), n4.key;
                      } }, primaryKey: { get: function() {
                        var e5 = n4.primaryKey;
                        return u2.addKey(e5), e5;
                      } }, value: { get: function() {
                        return r3 && a2.addKey(n4.primaryKey), n4.value;
                      } } });
                    }
                    return t4;
                  });
                  u2.add(w2);
                }
              }
              return p2[s2].apply(this, arguments);
            };
          }), n2;
        } });
      } };
      function Xn(e2, t2, n2) {
        var r2;
        return 0 === n2.numFailures ? t2 : "deleteRange" === t2.type || (r2 = t2.keys ? t2.keys.length : "values" in t2 && t2.values ? t2.values.length : 1, n2.numFailures === r2) ? null : (r2 = _({}, t2), x(r2.keys) && (r2.keys = r2.keys.filter(function(e3, t3) {
          return !(t3 in n2.failures);
        })), "values" in r2 && x(r2.values) && (r2.values = r2.values.filter(function(e3, t3) {
          return !(t3 in n2.failures);
        })), r2);
      }
      function Hn(e2, t2) {
        return n2 = e2, (void 0 === (r2 = t2).lower || (r2.lowerOpen ? 0 < j(n2, r2.lower) : 0 <= j(n2, r2.lower))) && (n2 = e2, void 0 === (r2 = t2).upper || (r2.upperOpen ? j(n2, r2.upper) < 0 : j(n2, r2.upper) <= 0));
        var n2, r2;
      }
      function Jn(e2, d2, t2, n2, r2, o2) {
        var i2, p2, y2, v2, m2, a2;
        return !t2 || 0 === t2.length || (i2 = d2.query.index, p2 = i2.multiEntry, y2 = d2.query.range, v2 = n2.schema.primaryKey.extractKey, m2 = i2.extractKey, a2 = (i2.lowLevelIndex || i2).extractKey, (n2 = t2.reduce(function(e3, t3) {
          var n3 = e3, r3 = [];
          if ("add" === t3.type || "put" === t3.type) for (var o3 = new I(), i3 = t3.values.length - 1; 0 <= i3; --i3) {
            var a3, u2 = t3.values[i3], s2 = v2(u2);
            !o3.hasKey(s2) && (a3 = m2(u2), p2 && x(a3) ? a3.some(function(e4) {
              return Hn(e4, y2);
            }) : Hn(a3, y2)) && (o3.addKey(s2), r3.push(u2));
          }
          switch (t3.type) {
            case "add":
              var c2 = new I().addKeys(d2.values ? e3.map(function(e4) {
                return v2(e4);
              }) : e3), n3 = e3.concat(d2.values ? r3.filter(function(e4) {
                e4 = v2(e4);
                return !c2.hasKey(e4) && (c2.addKey(e4), true);
              }) : r3.map(function(e4) {
                return v2(e4);
              }).filter(function(e4) {
                return !c2.hasKey(e4) && (c2.addKey(e4), true);
              }));
              break;
            case "put":
              var l2 = new I().addKeys(t3.values.map(function(e4) {
                return v2(e4);
              }));
              n3 = e3.filter(function(e4) {
                return !l2.hasKey(d2.values ? v2(e4) : e4);
              }).concat(d2.values ? r3 : r3.map(function(e4) {
                return v2(e4);
              }));
              break;
            case "delete":
              var f2 = new I().addKeys(t3.keys);
              n3 = e3.filter(function(e4) {
                return !f2.hasKey(d2.values ? v2(e4) : e4);
              });
              break;
            case "deleteRange":
              var h2 = t3.range;
              n3 = e3.filter(function(e4) {
                return !Hn(v2(e4), h2);
              });
          }
          return n3;
        }, e2)) === e2) ? e2 : (n2.sort(function(e3, t3) {
          return j(a2(e3), a2(t3)) || j(v2(e3), v2(t3));
        }), d2.limit && d2.limit < 1 / 0 && (n2.length > d2.limit ? n2.length = d2.limit : e2.length === d2.limit && n2.length < d2.limit && (r2.dirty = true)), o2 ? Object.freeze(n2) : n2);
      }
      function Zn(e2, t2) {
        return 0 === j(e2.lower, t2.lower) && 0 === j(e2.upper, t2.upper) && !!e2.lowerOpen == !!t2.lowerOpen && !!e2.upperOpen == !!t2.upperOpen;
      }
      function er(e2, t2) {
        return ((e3, t3, n2, r2) => {
          if (void 0 === e3) return void 0 !== t3 ? -1 : 0;
          if (void 0 === t3) return 1;
          if (0 === (e3 = j(e3, t3))) {
            if (n2 && r2) return 0;
            if (n2) return 1;
            if (r2) return -1;
          }
          return e3;
        })(e2.lower, t2.lower, e2.lowerOpen, t2.lowerOpen) <= 0 && 0 <= ((e3, t3, n2, r2) => {
          if (void 0 === e3) return void 0 !== t3 ? 1 : 0;
          if (void 0 === t3) return -1;
          if (0 === (e3 = j(e3, t3))) {
            if (n2 && r2) return 0;
            if (n2) return -1;
            if (r2) return 1;
          }
          return e3;
        })(e2.upper, t2.upper, e2.upperOpen, t2.upperOpen);
      }
      function tr(n2, r2, o2, e2) {
        n2.subscribers.add(o2), e2.addEventListener("abort", function() {
          var e3, t2;
          n2.subscribers.delete(o2), 0 === n2.subscribers.size && (e3 = n2, t2 = r2, setTimeout(function() {
            0 === e3.subscribers.size && ie(t2, e3);
          }, 3e3));
        });
      }
      var nr = { stack: "dbcore", level: 0, name: "Cache", create: function(k2) {
        var O2 = k2.schema.name;
        return _(_({}, k2), { transaction: function(g2, w2, e2) {
          var _2, t2, x2 = k2.transaction(g2, w2, e2);
          return "readwrite" === w2 && (e2 = (_2 = new AbortController()).signal, x2.addEventListener("abort", (t2 = function(b2) {
            return function() {
              if (_2.abort(), "readwrite" === w2) {
                for (var t3 = /* @__PURE__ */ new Set(), e3 = 0, n2 = g2; e3 < n2.length; e3++) {
                  var r2 = n2[e3], o2 = Tn["idb://".concat(O2, "/").concat(r2)];
                  if (o2) {
                    var i2 = k2.table(r2), a2 = o2.optimisticOps.filter(function(e4) {
                      return e4.trans === x2;
                    });
                    if (x2._explicit && b2 && x2.mutatedParts) for (var u2 = 0, s2 = Object.values(o2.queries.query); u2 < s2.length; u2++) for (var c2 = 0, l2 = (d2 = s2[u2]).slice(); c2 < l2.length; c2++) Cn((p2 = l2[c2]).obsSet, x2.mutatedParts) && (ie(d2, p2), p2.subscribers.forEach(function(e4) {
                      return t3.add(e4);
                    }));
                    else if (0 < a2.length) {
                      o2.optimisticOps = o2.optimisticOps.filter(function(e4) {
                        return e4.trans !== x2;
                      });
                      for (var f2 = 0, h2 = Object.values(o2.queries.query); f2 < h2.length; f2++) for (var d2, p2, y2, v2 = 0, m2 = (d2 = h2[f2]).slice(); v2 < m2.length; v2++) null != (p2 = m2[v2]).res && x2.mutatedParts && (b2 && !p2.dirty ? (y2 = Object.isFrozen(p2.res), y2 = Jn(p2.res, p2.req, a2, i2, p2, y2), p2.dirty ? (ie(d2, p2), p2.subscribers.forEach(function(e4) {
                        return t3.add(e4);
                      })) : y2 !== p2.res && (p2.res = y2, p2.promise = K.resolve({ result: y2 }))) : (p2.dirty && ie(d2, p2), p2.subscribers.forEach(function(e4) {
                        return t3.add(e4);
                      })));
                    }
                  }
                }
                t3.forEach(function(e4) {
                  return e4();
                });
              }
            };
          })(false), { signal: e2 }), x2.addEventListener("error", t2(false), { signal: e2 }), x2.addEventListener("complete", t2(true), { signal: e2 })), x2;
        }, table: function(s2) {
          var c2 = k2.table(s2), o2 = c2.schema.primaryKey;
          return _(_({}, c2), { mutate: function(t2) {
            var n2, e2 = P.trans;
            return !o2.outbound && "disabled" !== e2.db._options.cache && !e2.explicit && "readwrite" === e2.idbtrans.mode && (n2 = Tn["idb://".concat(O2, "/").concat(s2)]) ? (e2 = c2.mutate(t2), "add" !== t2.type && "put" !== t2.type || !(50 <= t2.values.length || Vn(o2, t2).some(function(e3) {
              return null == e3;
            })) ? (n2.optimisticOps.push(t2), t2.mutatedParts && Dn(t2.mutatedParts), e2.then(function(e3) {
              0 < e3.numFailures && (ie(n2.optimisticOps, t2), (e3 = Xn(0, t2, e3)) && n2.optimisticOps.push(e3), t2.mutatedParts) && Dn(t2.mutatedParts);
            }), e2.catch(function() {
              ie(n2.optimisticOps, t2), t2.mutatedParts && Dn(t2.mutatedParts);
            })) : e2.then(function(r2) {
              var e3 = Xn(0, _(_({}, t2), { values: t2.values.map(function(e4, t3) {
                var n3;
                return r2.failures[t3] ? e4 : (b(n3 = null != (n3 = o2.keyPath) && n3.includes(".") ? ee(e4) : _({}, e4), o2.keyPath, r2.results[t3]), n3);
              }) }), r2);
              n2.optimisticOps.push(e3), queueMicrotask(function() {
                return t2.mutatedParts && Dn(t2.mutatedParts);
              });
            }), e2) : c2.mutate(t2);
          }, query: function(t2) {
            var o3, e2, n2, r2, i2, a2, u2;
            return $n(P, c2) && Qn("query", t2) ? (o3 = "immutable" === (null == (n2 = P.trans) ? void 0 : n2.db._options.cache), e2 = (n2 = P).requery, n2 = n2.signal, a2 = ((e3, t3, n3, r3) => {
              var o4 = Tn["idb://".concat(e3, "/").concat(t3)];
              if (!o4) return [];
              if (!(e3 = o4.queries[n3])) return [null, false, o4, null];
              var i3 = e3[(r3.query ? r3.query.index.name : null) || ""];
              if (!i3) return [null, false, o4, null];
              switch (n3) {
                case "query":
                  var a3 = i3.find(function(e4) {
                    return e4.req.limit === r3.limit && e4.req.values === r3.values && Zn(e4.req.query.range, r3.query.range);
                  });
                  return a3 ? [a3, true, o4, i3] : [i3.find(function(e4) {
                    return ("limit" in e4.req ? e4.req.limit : 1 / 0) >= r3.limit && (!r3.values || e4.req.values) && er(e4.req.query.range, r3.query.range);
                  }), false, o4, i3];
                case "count":
                  a3 = i3.find(function(e4) {
                    return Zn(e4.req.query.range, r3.query.range);
                  });
                  return [a3, !!a3, o4, i3];
              }
            })(O2, s2, "query", t2), u2 = a2[0], r2 = a2[2], i2 = a2[3], u2 && a2[1] ? u2.obsSet = t2.obsSet : (a2 = c2.query(t2).then(function(e3) {
              var t3 = e3.result;
              if (u2 && (u2.res = t3), o3) {
                for (var n3 = 0, r3 = t3.length; n3 < r3; ++n3) Object.freeze(t3[n3]);
                Object.freeze(t3);
              } else e3.result = ee(t3);
              return e3;
            }).catch(function(e3) {
              return i2 && u2 && ie(i2, u2), Promise.reject(e3);
            }), u2 = { obsSet: t2.obsSet, promise: a2, subscribers: /* @__PURE__ */ new Set(), type: "query", req: t2, dirty: false }, i2 ? i2.push(u2) : (i2 = [u2], (r2 = r2 || (Tn["idb://".concat(O2, "/").concat(s2)] = { queries: { query: {}, count: {} }, objs: /* @__PURE__ */ new Map(), optimisticOps: [], unsignaledParts: {} })).queries.query[t2.query.index.name || ""] = i2)), tr(u2, i2, e2, n2), u2.promise.then(function(e3) {
              return { result: Jn(e3.result, t2, null == r2 ? void 0 : r2.optimisticOps, c2, u2, o3) };
            })) : c2.query(t2);
          } });
        } });
      } };
      function rr(e2, r2) {
        return new Proxy(e2, { get: function(e3, t2, n2) {
          return "db" === t2 ? r2 : Reflect.get(e3, t2, n2);
        } });
      }
      D.prototype.version = function(t2) {
        if (isNaN(t2) || t2 < 0.1) throw new k.Type("Given version is not a positive number");
        if (t2 = Math.round(10 * t2) / 10, this.idbdb || this._state.isBeingOpened) throw new k.Schema("Cannot add version when database is open");
        this.verno = Math.max(this.verno, t2);
        var e2 = this._versions, n2 = e2.filter(function(e3) {
          return e3._cfg.version === t2;
        })[0];
        return n2 || (n2 = new this.Version(t2), e2.push(n2), e2.sort(sn), n2.stores({}), this._state.autoSchema = false), n2;
      }, D.prototype._whenReady = function(e2) {
        var n2 = this;
        return this.idbdb && (this._state.openComplete || P.letThrough || this._vip) ? e2() : new K(function(e3, t2) {
          if (n2._state.openComplete) return t2(new k.DatabaseClosed(n2._state.dbOpenError));
          if (!n2._state.isBeingOpened) {
            if (!n2._state.autoOpen) return void t2(new k.DatabaseClosed());
            n2.open().catch(g);
          }
          n2._state.dbReadyPromise.then(e3, t2);
        }).then(e2);
      }, D.prototype.use = function(e2) {
        var t2 = e2.stack, n2 = e2.create, r2 = e2.level, e2 = e2.name, o2 = (e2 && this.unuse({ stack: t2, name: e2 }), this._middlewares[t2] || (this._middlewares[t2] = []));
        return o2.push({ stack: t2, create: n2, level: null == r2 ? 10 : r2, name: e2 }), o2.sort(function(e3, t3) {
          return e3.level - t3.level;
        }), this;
      }, D.prototype.unuse = function(e2) {
        var t2 = e2.stack, n2 = e2.name, r2 = e2.create;
        return t2 && this._middlewares[t2] && (this._middlewares[t2] = this._middlewares[t2].filter(function(e3) {
          return r2 ? e3.create !== r2 : !!n2 && e3.name !== n2;
        })), this;
      }, D.prototype.open = function() {
        var e2 = this;
        return at(s, function() {
          return Fn(e2);
        });
      }, D.prototype._close = function() {
        this.on.close.fire(new CustomEvent("close"));
        var n2 = this._state, e2 = ft.indexOf(this);
        if (0 <= e2 && ft.splice(e2, 1), this.idbdb) {
          try {
            this.idbdb.close();
          } catch (e3) {
          }
          this.idbdb = null;
        }
        n2.isBeingOpened || (n2.dbReadyPromise = new K(function(e3) {
          n2.dbReadyResolve = e3;
        }), n2.openCanceller = new K(function(e3, t2) {
          n2.cancelOpen = t2;
        }));
      }, D.prototype.close = function(e2) {
        var e2 = (void 0 === e2 ? { disableAutoOpen: true } : e2).disableAutoOpen, t2 = this._state;
        e2 ? (t2.isBeingOpened && t2.cancelOpen(new k.DatabaseClosed()), this._close(), t2.autoOpen = false, t2.dbOpenError = new k.DatabaseClosed()) : (this._close(), t2.autoOpen = this._options.autoOpen || t2.isBeingOpened, t2.openComplete = false, t2.dbOpenError = null);
      }, D.prototype.delete = function(n2) {
        var o2 = this, i2 = (void 0 === n2 && (n2 = { disableAutoOpen: true }), 0 < arguments.length && "object" != typeof arguments[0]), a2 = this._state;
        return new K(function(r2, t2) {
          function e2() {
            o2.close(n2);
            var e3 = o2._deps.indexedDB.deleteDatabase(o2.name);
            e3.onsuccess = E(function() {
              var e4, t3, n3;
              e4 = o2._deps, t3 = o2.name, _n(n3 = e4.indexedDB) || t3 === ht || wn(n3, e4.IDBKeyRange).delete(t3).catch(g), r2();
            }), e3.onerror = T(t2), e3.onblocked = o2._fireOnBlocked;
          }
          if (i2) throw new k.InvalidArgument("Invalid closeOptions argument to db.delete()");
          a2.isBeingOpened ? a2.dbReadyPromise.then(e2) : e2();
        });
      }, D.prototype.backendDB = function() {
        return this.idbdb;
      }, D.prototype.isOpen = function() {
        return null !== this.idbdb;
      }, D.prototype.hasBeenClosed = function() {
        var e2 = this._state.dbOpenError;
        return e2 && "DatabaseClosed" === e2.name;
      }, D.prototype.hasFailed = function() {
        return null !== this._state.dbOpenError;
      }, D.prototype.dynamicallyOpened = function() {
        return this._state.autoSchema;
      }, Object.defineProperty(D.prototype, "tables", { get: function() {
        var t2 = this;
        return O(this._allTables).map(function(e2) {
          return t2._allTables[e2];
        });
      }, enumerable: false, configurable: true }), D.prototype.transaction = function() {
        var e2 = (function(e3, t2, n2) {
          var r2 = arguments.length;
          if (r2 < 2) throw new k.InvalidArgument("Too few arguments");
          for (var o2 = new Array(r2 - 1); --r2; ) o2[r2 - 1] = arguments[r2];
          return n2 = o2.pop(), [e3, H(o2), n2];
        }).apply(this, arguments);
        return this._transaction.apply(this, e2);
      }, D.prototype._transaction = function(e2, t2, n2) {
        var r2, o2, i2 = this, a2 = P.trans, u2 = (a2 && a2.db === this && -1 === e2.indexOf("!") || (a2 = null), -1 !== e2.indexOf("?"));
        e2 = e2.replace("!", "").replace("?", "");
        try {
          if (o2 = t2.map(function(e3) {
            e3 = e3 instanceof i2.Table ? e3.name : e3;
            if ("string" != typeof e3) throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
            return e3;
          }), "r" == e2 || e2 === dt) r2 = dt;
          else {
            if ("rw" != e2 && e2 != pt) throw new k.InvalidArgument("Invalid transaction mode: " + e2);
            r2 = pt;
          }
          if (a2) {
            if (a2.mode === dt && r2 === pt) {
              if (!u2) throw new k.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
              a2 = null;
            }
            a2 && o2.forEach(function(e3) {
              if (a2 && -1 === a2.storeNames.indexOf(e3)) {
                if (!u2) throw new k.SubTransaction("Table " + e3 + " not included in parent transaction.");
                a2 = null;
              }
            }), u2 && a2 && !a2.active && (a2 = null);
          }
        } catch (n3) {
          return a2 ? a2._promise(null, function(e3, t3) {
            t3(n3);
          }) : w(n3);
        }
        var s2 = (function o3(i3, a3, u3, s3, c2) {
          return K.resolve().then(function() {
            var e3 = P.transless || P, t3 = i3._createTransaction(a3, u3, i3._dbSchema, s3), e3 = (t3.explicit = true, { trans: t3, transless: e3 });
            if (s3) t3.idbtrans = s3.idbtrans;
            else try {
              t3.create(), t3.idbtrans._explicit = true, i3._state.PR1398_maxLoop = 3;
            } catch (e4) {
              return e4.name === de.InvalidState && i3.isOpen() && 0 < --i3._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), i3.close({ disableAutoOpen: false }), i3.open().then(function() {
                return o3(i3, a3, u3, null, c2);
              })) : w(e4);
            }
            var n3, r3 = ue(c2), e3 = (r3 && nt(), K.follow(function() {
              var e4;
              (n3 = c2.call(t3, t3)) && (r3 ? (e4 = v.bind(null, null), n3.then(e4, e4)) : "function" == typeof n3.next && "function" == typeof n3.throw && (n3 = Mn(n3)));
            }, e3));
            return (n3 && "function" == typeof n3.then ? K.resolve(n3).then(function(e4) {
              return t3.active ? e4 : w(new k.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
            }) : e3.then(function() {
              return n3;
            })).then(function(e4) {
              return s3 && t3._resolve(), t3._completion.then(function() {
                return e4;
              });
            }).catch(function(e4) {
              return t3._reject(e4), w(e4);
            });
          });
        }).bind(null, this, r2, o2, a2, n2);
        return a2 ? a2._promise(r2, s2, "lock") : P.trans ? at(P.transless, function() {
          return i2._whenReady(s2);
        }) : this._whenReady(s2);
      }, D.prototype.table = function(e2) {
        if (m(this._allTables, e2)) return this._allTables[e2];
        throw new k.InvalidTable("Table ".concat(e2, " does not exist"));
      };
      var q = D;
      function D(e2, t2) {
        var i2, r2, a2, n2, o2, u2 = this, s2 = (this._middlewares = {}, this.verno = 0, D.dependencies), s2 = (this._options = t2 = _({ addons: D.addons, autoOpen: true, indexedDB: s2.indexedDB, IDBKeyRange: s2.IDBKeyRange, cache: "cloned" }, t2), this._deps = { indexedDB: t2.indexedDB, IDBKeyRange: t2.IDBKeyRange }, t2.addons), c2 = (this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this, { dbOpenError: null, isBeingOpened: false, onReadyBeingFired: null, openComplete: false, dbReadyResolve: g, dbReadyPromise: null, cancelOpen: g, openCanceller: null, autoSchema: true, PR1398_maxLoop: 3, autoOpen: t2.autoOpen }), l2 = (c2.dbReadyPromise = new K(function(e3) {
          c2.dbReadyResolve = e3;
        }), c2.openCanceller = new K(function(e3, t3) {
          c2.cancelOpen = t3;
        }), this._state = c2, this.name = e2, this.on = Kt(this, "populate", "blocked", "versionchange", "close", { ready: [ke, g] }), this.once = function(n3, r3) {
          var o3 = function() {
            for (var e3 = [], t3 = 0; t3 < arguments.length; t3++) e3[t3] = arguments[t3];
            u2.on(n3).unsubscribe(o3), r3.apply(u2, e3);
          };
          return u2.on(n3, o3);
        }, this.on.ready.subscribe = Y(this.on.ready.subscribe, function(o3) {
          return function(n3, r3) {
            D.vip(function() {
              var t3, e3 = u2._state;
              e3.openComplete ? (e3.dbOpenError || K.resolve().then(n3), r3 && o3(n3)) : e3.onReadyBeingFired ? (e3.onReadyBeingFired.push(n3), r3 && o3(n3)) : (o3(n3), t3 = u2, r3 || o3(function e4() {
                t3.on.ready.unsubscribe(n3), t3.on.ready.unsubscribe(e4);
              }));
            });
          };
        }), this.Collection = (i2 = this, Et(Dt.prototype, function(e3, t3) {
          this.db = i2;
          var n3 = vt, r3 = null;
          if (t3) try {
            n3 = t3();
          } catch (e4) {
            r3 = e4;
          }
          var t3 = e3._ctx, e3 = t3.table, o3 = e3.hook.reading.fire;
          this._ctx = { table: e3, index: t3.index, isPrimKey: !t3.index || e3.schema.primKey.keyPath && t3.index === e3.schema.primKey.name, range: n3, keysOnly: false, dir: "next", unique: "", algorithm: null, filter: null, replayFilter: null, justLimit: true, isMatch: null, offset: 0, limit: 1 / 0, error: r3, or: t3.or, valueMapper: o3 !== ve ? o3 : null };
        })), this.Table = (r2 = this, Et(Pt.prototype, function(e3, t3, n3) {
          this.db = r2, this._tx = n3, this.name = e3, this.schema = t3, this.hook = r2._allTables[e3] ? r2._allTables[e3].hook : Kt(null, { creating: [ge, g], reading: [me, ve], updating: [_e, g], deleting: [we, g] });
        })), this.Transaction = (a2 = this, Et($t.prototype, function(e3, t3, n3, r3, o3) {
          var i3 = this;
          "readonly" !== e3 && t3.forEach(function(e4) {
            e4 = null == (e4 = n3[e4]) ? void 0 : e4.yProps;
            e4 && (t3 = t3.concat(e4.map(function(e5) {
              return e5.updatesTable;
            })));
          }), this.db = a2, this.mode = e3, this.storeNames = t3, this.schema = n3, this.chromeTransactionDurability = r3, this.idbtrans = null, this.on = Kt(this, "complete", "error", "abort"), this.parent = o3 || null, this.active = true, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new K(function(e4, t4) {
            i3._resolve = e4, i3._reject = t4;
          }), this._completion.then(function() {
            i3.active = false, i3.on.complete.fire();
          }, function(e4) {
            var t4 = i3.active;
            return i3.active = false, i3.on.error.fire(e4), i3.parent ? i3.parent._reject(e4) : t4 && i3.idbtrans && i3.idbtrans.abort(), w(e4);
          });
        })), this.Version = (n2 = this, Et(bn.prototype, function(e3) {
          this.db = n2, this._cfg = { version: e3, storesSource: null, dbschema: {}, tables: {}, contentUpgrade: null };
        })), this.WhereClause = (o2 = this, Et(Ut.prototype, function(e3, t3, n3) {
          if (this.db = o2, this._ctx = { table: e3, index: ":id" === t3 ? null : t3, or: n3 }, this._cmp = this._ascending = j, this._descending = function(e4, t4) {
            return j(t4, e4);
          }, this._max = function(e4, t4) {
            return 0 < j(e4, t4) ? e4 : t4;
          }, this._min = function(e4, t4) {
            return j(e4, t4) < 0 ? e4 : t4;
          }, this._IDBKeyRange = o2._deps.IDBKeyRange, !this._IDBKeyRange) throw new k.MissingAPI();
        })), this.on("versionchange", function(e3) {
          0 < e3.newVersion ? console.warn("Another connection wants to upgrade database '".concat(u2.name, "'. Closing db now to resume the upgrade.")) : console.warn("Another connection wants to delete database '".concat(u2.name, "'. Closing db now to resume the delete request.")), u2.close({ disableAutoOpen: false });
        }), this.on("blocked", function(e3) {
          !e3.newVersion || e3.newVersion < e3.oldVersion ? console.warn("Dexie.delete('".concat(u2.name, "') was blocked")) : console.warn("Upgrade '".concat(u2.name, "' blocked by other connection holding version ").concat(e3.oldVersion / 10));
        }), this._maxKey = Ht(t2.IDBKeyRange), this._createTransaction = function(e3, t3, n3, r3) {
          return new u2.Transaction(e3, t3, n3, u2._options.chromeTransactionDurability, r3);
        }, this._fireOnBlocked = function(t3) {
          u2.on("blocked").fire(t3), ft.filter(function(e3) {
            return e3.name === u2.name && e3 !== u2 && !e3._state.vcFired;
          }).map(function(e3) {
            return e3.on("versionchange").fire(t3);
          });
        }, this.use(Yn), this.use(nr), this.use(Gn), this.use(Ln), this.use(zn), new Proxy(this, { get: function(e3, t3, n3) {
          var r3;
          return "_vip" === t3 || ("table" === t3 ? function(e4) {
            return rr(u2.table(e4), l2);
          } : (r3 = Reflect.get(e3, t3, n3)) instanceof Pt ? rr(r3, l2) : "tables" === t3 ? r3.map(function(e4) {
            return rr(e4, l2);
          }) : "_createTransaction" === t3 ? function() {
            return rr(r3.apply(this, arguments), l2);
          } : r3);
        } }));
        this.vip = l2, s2.forEach(function(e3) {
          return e3(u2);
        });
      }
      var or, Se = "undefined" != typeof Symbol && "observable" in Symbol ? Symbol.observable : "@@observable", ir = (ar.prototype.subscribe = function(e2, t2, n2) {
        return this._subscribe(e2 && "function" != typeof e2 ? e2 : { next: e2, error: t2, complete: n2 });
      }, ar.prototype[Se] = function() {
        return this;
      }, ar);
      function ar(e2) {
        this._subscribe = e2;
      }
      try {
        or = { indexedDB: f.indexedDB || f.mozIndexedDB || f.webkitIndexedDB || f.msIndexedDB, IDBKeyRange: f.IDBKeyRange || f.webkitIDBKeyRange };
      } catch (e2) {
        or = { indexedDB: null, IDBKeyRange: null };
      }
      function ur(h2) {
        var d2, p2 = false, e2 = new ir(function(r2) {
          var o2 = ue(h2);
          var i2, a2 = false, u2 = {}, s2 = {}, e3 = { get closed() {
            return a2;
          }, unsubscribe: function() {
            a2 || (a2 = true, i2 && i2.abort(), c2 && Yt.storagemutated.unsubscribe(f2));
          } }, c2 = (r2.start && r2.start(e3), false), l2 = function() {
            return st(t2);
          };
          var f2 = function(e4) {
            An(u2, e4), Cn(s2, u2) && l2();
          }, t2 = function() {
            var t3, n2, e4;
            !a2 && or.indexedDB && (u2 = {}, t3 = {}, i2 && i2.abort(), i2 = new AbortController(), e4 = ((e5) => {
              var t4 = $e();
              try {
                o2 && nt();
                var n3 = y(h2, e5);
                return n3 = o2 ? n3.finally(v) : n3;
              } finally {
                t4 && Qe();
              }
            })(n2 = { subscr: t3, signal: i2.signal, requery: l2, querier: h2, trans: null }), Promise.resolve(e4).then(function(e5) {
              p2 = true, d2 = e5, a2 || n2.signal.aborted || (u2 = {}, ((e6) => {
                for (var t4 in e6) if (m(e6, t4)) return;
                return 1;
              })(s2 = t3) || c2 || (Yt(zt, f2), c2 = true), st(function() {
                return !a2 && r2.next && r2.next(e5);
              }));
            }, function(e5) {
              p2 = false, ["DatabaseClosedError", "AbortError"].includes(null == e5 ? void 0 : e5.name) || a2 || st(function() {
                a2 || r2.error && r2.error(e5);
              });
            }));
          };
          return setTimeout(l2, 0), e3;
        });
        return e2.hasValue = function() {
          return p2;
        }, e2.getValue = function() {
          return d2;
        }, e2;
      }
      var sr = q;
      function cr(e2) {
        var t2 = fr;
        try {
          fr = true, Yt.storagemutated.fire(e2), Bn(e2, true);
        } finally {
          fr = t2;
        }
      }
      N(sr, _(_({}, e), { delete: function(e2) {
        return new sr(e2, { addons: [] }).delete();
      }, exists: function(e2) {
        return new sr(e2, { addons: [] }).open().then(function(e3) {
          return e3.close(), true;
        }).catch("NoSuchDatabaseError", function() {
          return false;
        });
      }, getDatabaseNames: function(e2) {
        try {
          return t2 = sr.dependencies, n2 = t2.indexedDB, t2 = t2.IDBKeyRange, (_n(n2) ? Promise.resolve(n2.databases()).then(function(e3) {
            return e3.map(function(e4) {
              return e4.name;
            }).filter(function(e4) {
              return e4 !== ht;
            });
          }) : wn(n2, t2).toCollection().primaryKeys()).then(e2);
        } catch (e3) {
          return w(new k.MissingAPI());
        }
        var t2, n2;
      }, defineClass: function() {
        return function(e2) {
          a(this, e2);
        };
      }, ignoreTransaction: function(e2) {
        return P.trans ? at(P.transless, e2) : e2();
      }, vip: xn, async: function(t2) {
        return function() {
          try {
            var e2 = Mn(t2.apply(this, arguments));
            return e2 && "function" == typeof e2.then ? e2 : K.resolve(e2);
          } catch (e3) {
            return w(e3);
          }
        };
      }, spawn: function(e2, t2, n2) {
        try {
          var r2 = Mn(e2.apply(n2, t2 || []));
          return r2 && "function" == typeof r2.then ? r2 : K.resolve(r2);
        } catch (e3) {
          return w(e3);
        }
      }, currentTransaction: { get: function() {
        return P.trans || null;
      } }, waitFor: function(e2, t2) {
        e2 = K.resolve("function" == typeof e2 ? sr.ignoreTransaction(e2) : e2).timeout(t2 || 6e4);
        return P.trans ? P.trans.waitFor(e2) : e2;
      }, Promise: K, debug: { get: function() {
        return l;
      }, set: function(e2) {
        Oe(e2);
      } }, derive: U, extend: a, props: N, override: Y, Events: Kt, on: Yt, liveQuery: ur, extendObservabilitySet: An, getByKeyPath: c, setByKeyPath: b, delByKeyPath: function(t2, e2) {
        "string" == typeof e2 ? b(t2, e2, void 0) : "length" in e2 && [].map.call(e2, function(e3) {
          b(t2, e3, void 0);
        });
      }, shallowClone: G, deepClone: ee, getObjectDiff: Un, cmp: j, asap: Q, minKey: -1 / 0, addons: [], connections: ft, errnames: de, dependencies: or, cache: Tn, semVer: "4.3.0", version: "4.3.0".split(".").map(function(e2) {
        return parseInt(e2);
      }).reduce(function(e2, t2, n2) {
        return e2 + t2 / Math.pow(10, 2 * n2);
      }) })), sr.maxKey = Ht(sr.dependencies.IDBKeyRange), "undefined" != typeof dispatchEvent && "undefined" != typeof addEventListener && (Yt(zt, function(e2) {
        fr || (e2 = new CustomEvent(Wt, { detail: e2 }), fr = true, dispatchEvent(e2), fr = false);
      }), addEventListener(Wt, function(e2) {
        e2 = e2.detail;
        fr || cr(e2);
      }));
      var lr, fr = false, hr = function() {
      };
      return "undefined" != typeof BroadcastChannel && ((hr = function() {
        (lr = new BroadcastChannel(Wt)).onmessage = function(e2) {
          return e2.data && cr(e2.data);
        };
      })(), "function" == typeof lr.unref && lr.unref(), Yt(zt, function(e2) {
        fr || lr.postMessage(e2);
      })), "undefined" != typeof addEventListener && (addEventListener("pagehide", function(e2) {
        if (!q.disableBfCache && e2.persisted) {
          l && console.debug("Dexie: handling persisted pagehide"), null != lr && lr.close();
          for (var t2 = 0, n2 = ft; t2 < n2.length; t2++) n2[t2].close({ disableAutoOpen: false });
        }
      }), addEventListener("pageshow", function(e2) {
        !q.disableBfCache && e2.persisted && (l && console.debug("Dexie: handling persisted pageshow"), hr(), cr({ all: new I(-1 / 0, [[]]) }));
      })), K.rejectionMapper = function(e2, t2) {
        return !e2 || e2 instanceof ce || e2 instanceof TypeError || e2 instanceof SyntaxError || !e2.name || !ye[e2.name] ? e2 : (t2 = new ye[e2.name](t2 || e2.message, e2), "stack" in e2 && u(t2, "stack", { get: function() {
          return this.inner.stack;
        } }), t2);
      }, Oe(l), _(q, Object.freeze({ __proto__: null, Dexie: q, Entity: bt, PropModification: xt, RangeSet: I, add: function(e2) {
        return new xt({ add: e2 });
      }, cmp: j, default: q, liveQuery: ur, mergeRanges: Pn, rangesOverlap: Kn, remove: function(e2) {
        return new xt({ remove: e2 });
      }, replacePrefix: function(e2, t2) {
        return new xt({ replacePrefix: [e2, t2] });
      } }), { default: q }), q;
    });
  })(dexie_min);
  var dexie_minExports = dexie_min.exports;
  const _Dexie = /* @__PURE__ */ getDefaultExportFromCjs(dexie_minExports);
  const DexieSymbol = Symbol.for("Dexie");
  const Dexie = globalThis[DexieSymbol] || (globalThis[DexieSymbol] = _Dexie);
  if (_Dexie.semVer !== Dexie.semVer) {
    throw new Error(`Two different versions of Dexie loaded in the same app: ${_Dexie.semVer} and ${Dexie.semVer}`);
  }
  const {
    liveQuery,
    mergeRanges,
    rangesOverlap,
    RangeSet,
    cmp,
    Entity,
    PropModification,
    replacePrefix,
    add,
    remove,
    DexieYProvider
  } = Dexie;
  class PhoenixDB extends Dexie {
    constructor() {
      super("PhoenixSotaDB");
      __publicField(this, "entries");
      this.version(1).stores({
        entries: "++id, domain, [domain+fieldId], timestamp, isSubmitted"
      });
    }
    async save(entry) {
      return await this.entries.put(entry);
    }
    async getHistory(domain, fieldId) {
      return await this.entries.where({ domain, fieldId }).reverse().sortBy("timestamp");
    }
  }
  const db = new PhoenixDB();
  function generateHeuristicId(el) {
    var _a2, _b2, _c2, _d;
    const parts = [];
    if (el.id && !el.id.match(/\d{5,}/)) parts.push(`id:${el.id}`);
    const name = el.getAttribute("name");
    if (name) parts.push(`name:${name}`);
    const label = el.getAttribute("aria-label") || el.getAttribute("placeholder") || "";
    if (label) parts.push(`label:${label.slice(0, 20)}`);
    if (el instanceof HTMLInputElement && ((_a2 = el.labels) == null ? void 0 : _a2[0])) {
      parts.push(`text:${(_b2 = el.labels[0].textContent) == null ? void 0 : _b2.trim().slice(0, 20)}`);
    }
    const parent = el.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children);
      const tagSequence = siblings.map((s) => s.tagName.toLowerCase()).join(",");
      parts.push(`struct:${tagSequence.slice(0, 50)}`);
      const surroundingText = (_c2 = parent.textContent) == null ? void 0 : _c2.replace(/\s+/g, " ").trim().slice(0, 30);
      if (surroundingText) parts.push(`context:${surroundingText}`);
    }
    const root2 = el.getRootNode();
    if (root2 instanceof ShadowRoot && ((_d = root2.host) == null ? void 0 : _d.id)) {
      parts.push(`shadow-host:${root2.host.id}`);
    }
    const form = el.closest("form");
    if (form) {
      const inputs = Array.from(form.querySelectorAll("input, textarea, [contenteditable]"));
      parts.push(`form-idx:${inputs.indexOf(el)}`);
    }
    return btoa(unescape(encodeURIComponent(parts.join("|") || "fallback"))).replace(/=/g, "");
  }
  function getFieldName(el) {
    var _a2, _b2, _c2;
    const raw = el.getAttribute("aria-label") || el.getAttribute("placeholder") || el instanceof HTMLInputElement && ((_c2 = (_b2 = (_a2 = el.labels) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.textContent) == null ? void 0 : _c2.trim()) || el.getAttribute("name") || "Unnamed Field";
    return raw.length > 30 ? raw.slice(0, 27) + "..." : raw;
  }
  function initInterceptor(onSubmission) {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [resource, config] = args;
      if ((config == null ? void 0 : config.body) && typeof config.body === "string") {
        onSubmission(config.body);
      }
      return originalFetch(...args);
    };
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
      if (body && typeof body === "string") {
        onSubmission(body);
      }
      return originalSend.apply(this, [body]);
    };
  }
  const PUBLIC_VERSION = "5";
  if (typeof window !== "undefined") {
    ((_c = window.__svelte ?? (window.__svelte = {})).v ?? (_c.v = /* @__PURE__ */ new Set())).add(PUBLIC_VERSION);
  }
  function maskPII(text) {
    if (!text) return "";
    return text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "***@***.***").replace(/(?:[0-9]{4}-){3}[0-9]{4}/g, "****-****-****-****").replace(/(?:\b[a-fA-F0-9]{32,}\b)/g, (match) => match.slice(0, 4) + "..." + match.slice(-4));
  }
  var root_1$1 = /* @__PURE__ */ from_html(`<div class="no-entries svelte-10hlut0">No history found</div>`);
  var root_2 = /* @__PURE__ */ from_html(`<div class="time-machine svelte-10hlut0"><div class="preview svelte-10hlut0"> </div> <div class="controls svelte-10hlut0"><input type="range" min="0" class="svelte-10hlut0"/> <div class="timestamp svelte-10hlut0"> </div> <button class="restore-btn svelte-10hlut0">Restore this point</button></div></div>`);
  var root_4 = /* @__PURE__ */ from_html(`<li class="svelte-10hlut0"><span class="value svelte-10hlut0"> </span> <span class="date svelte-10hlut0"> </span></li>`);
  var root_3 = /* @__PURE__ */ from_html(`<ul class="svelte-10hlut0"></ul>`);
  var root = /* @__PURE__ */ from_html(`<div class="phoenix-menu svelte-10hlut0"><div class="header svelte-10hlut0"><span>Phoenix SOTA Recovery</span> <button class="toggle svelte-10hlut0"> </button></div> <!></div>`);
  function RecoveryMenu($$anchor, $$props) {
    push($$props, true);
    let entries = /* @__PURE__ */ state(proxy([]));
    let historyIndex = /* @__PURE__ */ state(0);
    let showTimeMachine = /* @__PURE__ */ state(false);
    user_effect(() => {
      db.entries.where({ domain: window.location.hostname, fieldId: $$props.fieldId }).reverse().sortBy("timestamp").then((res) => {
        set(entries, res, true);
      });
    });
    const currentEntry = /* @__PURE__ */ user_derived(() => get(entries)[get(historyIndex)]);
    var div = root();
    var div_1 = child(div);
    var button = sibling(child(div_1), 2);
    var text = child(button);
    var node = sibling(div_1, 2);
    {
      var consequent = ($$anchor2) => {
        var div_2 = root_1$1();
        append($$anchor2, div_2);
      };
      var consequent_1 = ($$anchor2) => {
        var div_3 = root_2();
        var div_4 = child(div_3);
        var text_1 = child(div_4);
        var div_5 = sibling(div_4, 2);
        var input = child(div_5);
        var div_6 = sibling(input, 2);
        var text_2 = child(div_6);
        var button_1 = sibling(div_6, 2);
        template_effect(
          ($0, $1) => {
            set_text(text_1, $0);
            set_attribute(input, "max", get(entries).length - 1);
            set_text(text_2, $1);
          },
          [
            () => {
              var _a2;
              return maskPII(((_a2 = get(currentEntry)) == null ? void 0 : _a2.value) || "");
            },
            () => {
              var _a2;
              return new Date(((_a2 = get(currentEntry)) == null ? void 0 : _a2.timestamp) || 0).toLocaleString();
            }
          ]
        );
        bind_value(input, () => get(historyIndex), ($$value) => set(historyIndex, $$value));
        delegated("click", button_1, () => $$props.onRestore(get(currentEntry).value));
        append($$anchor2, div_3);
      };
      var alternate = ($$anchor2) => {
        var ul = root_3();
        each(ul, 21, () => get(entries).slice(0, 10), index, ($$anchor3, entry) => {
          var li = root_4();
          var span = child(li);
          var text_3 = child(span);
          var span_1 = sibling(span, 2);
          var text_4 = child(span_1);
          template_effect(
            ($0, $1) => {
              set_text(text_3, $0);
              set_text(text_4, $1);
            },
            [
              () => maskPII(get(entry).value.slice(0, 80)),
              () => new Date(get(entry).timestamp).toLocaleTimeString()
            ]
          );
          delegated("click", li, () => $$props.onRestore(get(entry).value));
          append($$anchor3, li);
        });
        append($$anchor2, ul);
      };
      if_block(node, ($$render) => {
        if (get(entries).length === 0) $$render(consequent);
        else if (get(showTimeMachine)) $$render(consequent_1, 1);
        else $$render(alternate, false);
      });
    }
    template_effect(() => set_text(text, get(showTimeMachine) ? "List" : "Time Machine"));
    delegated("click", button, () => set(showTimeMachine, !get(showTimeMachine)));
    append($$anchor, div);
    pop();
  }
  delegate(["click"]);
  var root_1 = /* @__PURE__ */ from_html(`<div class="ghost svelte-10u4ojw"> </div>`);
  function SmartGhost($$anchor, $$props) {
    push($$props, true);
    let targetEl = prop($$props, "targetEl");
    let ghostText = /* @__PURE__ */ state("");
    let visible = /* @__PURE__ */ state(false);
    user_effect(() => {
      if (targetEl().value === "") {
        db.entries.where({ domain: window.location.hostname, fieldId: $$props.fieldId }).reverse().first().then((res) => {
          if (res) {
            set(ghostText, res.value, true);
            set(visible, true);
          }
        });
      } else {
        set(visible, false);
      }
    });
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var div = root_1();
        var text = child(div);
        template_effect(($0) => set_text(text, `${$0 ?? ""} (Tab to restore)`), [() => get(ghostText).slice(0, 100)]);
        delegated("click", div, () => {
          targetEl().value = get(ghostText);
          set(visible, false);
          targetEl().dispatchEvent(new Event("input", { bubbles: true }));
        });
        append($$anchor2, div);
      };
      if_block(node, ($$render) => {
        if (get(visible) && get(ghostText)) $$render(consequent);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  delegate(["click"]);
  console.log("Phoenix SOTA Form Recovery: Robust Engine Active");
  const fieldStates = /* @__PURE__ */ new Map();
  function restoreField(el, value) {
    var _a2;
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      el.value = value;
    } else if (el.isContentEditable) {
      if (!((_a2 = el.textContent) == null ? void 0 : _a2.trim())) {
        el.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
      }
      el.focus();
      document.execCommand("selectAll", false);
      document.execCommand("insertHTML", false, value);
    }
    ["input", "change"].forEach((t) => el.dispatchEvent(new Event(t, { bubbles: true })));
  }
  async function handleFieldInput(el) {
    const value = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement ? el.value : el.innerHTML;
    const state2 = fieldStates.get(el) || { lastSavedValue: "", lastWriteTime: 0 };
    const now = Date.now();
    const timeSinceLastWrite = now - state2.lastWriteTime;
    const valueChangedSignificantly = Math.abs(value.length - state2.lastSavedValue.length) > 20;
    if (value.length > 2 && (valueChangedSignificantly || timeSinceLastWrite > 3e4)) {
      const fieldId = generateHeuristicId(el);
      await db.save({
        domain: window.location.hostname,
        url: window.location.href,
        fieldId,
        fieldName: getFieldName(el),
        value,
        timestamp: now,
        isSubmitted: false
      });
      fieldStates.set(el, { lastSavedValue: value, lastWriteTime: now });
    }
  }
  function attachToField(el) {
    if (el.dataset.phoenixAttached) return;
    el.dataset.phoenixAttached = "true";
    const fieldId = generateHeuristicId(el);
    el.addEventListener("focus", () => {
      const rect = el.getBoundingClientRect();
      const menuHost = document.createElement("div");
      Object.assign(menuHost.style, {
        position: "absolute",
        left: `${rect.right - 35}px`,
        top: `${rect.top}px`,
        zIndex: "2147483647"
      });
      const menuShadow = menuHost.attachShadow({ mode: "open" });
      document.body.appendChild(menuHost);
      mount(RecoveryMenu, {
        target: menuShadow,
        props: {
          fieldId,
          onRestore: (val) => {
            restoreField(el, val);
            menuHost.remove();
          }
        }
      });
      const ghostHost = document.createElement("div");
      Object.assign(ghostHost.style, {
        position: "absolute",
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        pointerEvents: "none",
        zIndex: "2147483646"
      });
      const ghostShadow = ghostHost.attachShadow({ mode: "open" });
      document.body.appendChild(ghostHost);
      mount(SmartGhost, {
        target: ghostShadow,
        props: { fieldId, targetEl: el }
      });
      const cleanup = (e) => {
        if (!menuHost.contains(e.target) && e.target !== el) {
          menuHost.remove();
          ghostHost.remove();
          document.removeEventListener("mousedown", cleanup);
        }
      };
      document.addEventListener("mousedown", cleanup);
    });
    ["input", "change", "keyup"].forEach((evt) => {
      el.addEventListener(evt, () => handleFieldInput(el));
    });
  }
  const globalObserver = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          node.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]').forEach((f) => attachToField(f));
          if (node.matches('input[type="text"], textarea, [contenteditable="true"]')) attachToField(node);
        }
      });
      const target = m.target;
      if (target.isContentEditable) handleFieldInput(target);
    });
  });
  globalObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
  document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]').forEach((el) => attachToField(el));
  initInterceptor((body) => {
    console.log("[Phoenix] Network submission detected.");
  });
  window.addEventListener("beforeunload", () => {
    document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]').forEach((el) => {
      handleFieldInput(el);
    });
  });
  ["visibilitychange", "pagehide", "freeze"].forEach((evt) => {
    window.addEventListener(evt, () => {
      document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]').forEach((el) => {
        handleFieldInput(el);
      });
    });
  });

})();