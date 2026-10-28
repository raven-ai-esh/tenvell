import test from 'node:test';
import assert from 'node:assert/strict';
import {idleGlassInput,reduceGlassInput} from '../src/interactions/glass-input-state.js';
const card = {},button = {},bar = {},other = {};

test('release at the same point restores hover without another move, repeatedly', () => {
  let state = idleGlassInput();
  for (let repeat=0;repeat<5;repeat++) {
    state = reduceGlassInput(state,{type:'move',hits:[button,card],buttons:0});
    state = reduceGlassInput(state,{type:'down',id:1,target:button,hits:[button,card]});
    assert.equal(state.pressed,button);assert.deepEqual(state.hover,[button,card]);
    state = reduceGlassInput(state,{type:'up',id:1,hits:[button,card]});
    assert.equal(state.pressed,null);assert.equal(state.pointer,null);assert.deepEqual(state.hover,[button,card]);
  }
});
test('child hover never replaces the parent, and leaving only the child retains the parent', () => {
  let state = reduceGlassInput(idleGlassInput(),{type:'move',hits:[card],buttons:0});
  state = reduceGlassInput(state,{type:'move',hits:[bar,card],buttons:0});
  assert.deepEqual(state.hover,[bar,card]);
  state = reduceGlassInput(state,{type:'move',hits:[card],buttons:0});
  assert.deepEqual(state.hover,[card]);
  state = reduceGlassInput(state,{type:'move',hits:[],buttons:0});
  assert.deepEqual(state.hover,[]);
});
test('outside release, cancelled press and unrelated pointer do not stick', () => {
  let state = reduceGlassInput(idleGlassInput(),{type:'down',id:1,target:button,hits:[button,card]});
  const original = state;
  state = reduceGlassInput(state,{type:'up',id:2,hits:[other]});
  assert.equal(state,original);
  state = reduceGlassInput(state,{type:'move',hits:[other,card],buttons:1});
  assert.equal(state.pressed,null);assert.deepEqual(state.hover,[card]);
  state = reduceGlassInput(state,{type:'up',id:1,hits:[]});
  assert.deepEqual(state,idleGlassInput());
  state = reduceGlassInput(original,{type:'cancel'});
  assert.deepEqual(state,idleGlassInput());
});
test('release resolves current targets after removal or disabled state, not the old press node', () => {
  let state = reduceGlassInput(idleGlassInput(),{type:'down',id:1,target:button,hits:[button,card]});
  state = reduceGlassInput(state,{type:'up',id:1,hits:[card]});
  assert.equal(state.pressed,null);assert.deepEqual(state.hover,[card]);
  state = reduceGlassInput(state,{type:'refresh',hits:[button,card],buttons:0});
  assert.deepEqual(state.hover,[button,card]);
});
test('keyboard press and release preserve pointer ancestors; repeats do not restart a press', () => {
  let state = reduceGlassInput(idleGlassInput(),{type:'move',hits:[card],buttons:0});
  state = reduceGlassInput(state,{type:'keydown',key:' ',target:button});
  assert.equal(state.pressed,button);assert.deepEqual(state.hover,[card]);
  const held = state;
  state = reduceGlassInput(state,{type:'keydown',key:' ',target:other});
  assert.equal(state,held);
  state = reduceGlassInput(state,{type:'keyup',key:' ',hits:[card]});
  assert.equal(state.pressed,null);assert.deepEqual(state.hover,[card]);
});
test('coarse input can press but release never leaves magnetic hover', () => {
  let state = reduceGlassInput(idleGlassInput(),{type:'down',id:1,target:button,hits:[button,card],canHover:false});
  assert.equal(state.pressed,button);assert.deepEqual(state.hover,[]);
  state = reduceGlassInput(state,{type:'up',id:1,hits:[button,card],canHover:false});
  assert.deepEqual(state,idleGlassInput());
});
