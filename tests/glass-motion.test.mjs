import test from 'node:test';
import assert from 'node:assert/strict';
import {glassMotion} from '../src/interactions/glass-motion.js';

const rect = {left:100,top:200,width:160,height:48};
test('glass paint follows the pointer, with a shallow bounded lift', () => {
  const left = glassMotion(rect,{x:100,y:224});
  const right = glassMotion(rect,{x:260,y:224});
  assert.ok(left.x < 0 && right.x > 0);
  assert.ok(left.lightX < 50 && right.lightX > 50);
  assert.equal(left.y, -.7);
  const far = glassMotion(rect,{x:10000,y:-10000},{kind:'surface'});
  assert.equal(far.x, 1.7);
  assert.ok(Math.abs(far.y) < 2.6);
  assert.equal(far.lightX,86);
});
test('reduced motion, editing and field frames never attract or tilt', () => {
  for (const options of [{reduced:true},{editing:true},{kind:'field'}]) {
    const motion = glassMotion(rect,{x:260,y:200},options);
    assert.equal(motion.x,0);assert.equal(motion.y,0);assert.equal(motion.tilt,0);
    assert.ok(motion.lightX > 50);
  }
});
test('tiny or temporarily collapsed geometry stays finite and bounded', () => {
  for (const size of [0,.01,1,10000]) {
    const motion = glassMotion({left:0,top:0,width:size,height:size},{x:5,y:5});
    assert.ok(Object.values(motion).every(Number.isFinite));
    assert.ok(Math.abs(motion.x)<=.9 && Math.abs(motion.y)<=1.105);
  }
});
