import test from 'node:test';
import assert from 'node:assert/strict';
import {placeTask} from '../src/examples/task-order.js';

const initial=[{id:1,status:'todo'},{id:2,status:'todo'},{id:3,status:'doing'},{id:4,status:'doing'},{id:5,status:'done'}];
const ids=(tasks,status)=>tasks.filter(t=>t.status===status).map(t=>t.id);
test('cross-column drop changes only its card and inserts before the target',()=>{
 const result=placeTask(initial,1,'doing',4);
 assert.deepEqual(ids(result,'todo'),[2]);assert.deepEqual(ids(result,'doing'),[3,1,4]);assert.deepEqual(ids(result,'done'),[5]);
 assert.equal(new Set(result.map(t=>t.id)).size,5);assert.equal(initial[0].status,'todo');
});
test('same-column reorder supports both directions without losing hidden items',()=>{
 const down=placeTask(initial,1,'todo',2,true);assert.deepEqual(ids(down,'todo'),[2,1]);
 assert.deepEqual(ids(placeTask(down,1,'todo',2),'todo'),[1,2]);
 assert.deepEqual(ids(placeTask(initial,1,'doing',4,true),'doing'),[3,4,1]);
});
test('empty-column drop and repeated transfers keep every task exactly once',()=>{
 let result=placeTask(initial,5,'todo');assert.deepEqual(ids(result,'done'),[]);
 result=placeTask(result,1,'done');assert.deepEqual(ids(result,'done'),[1]);
 result=placeTask(result,1,'todo',2);assert.deepEqual(ids(result,'todo'),[1,2,5]);assert.equal(result.length,5);
});
test('invalid, self and unchanged drops are safe no-ops; rollback snapshot is untouched',()=>{
 assert.equal(placeTask(initial,1,'todo',1),initial);assert.equal(placeTask(initial,99,'done'),initial);
 assert.equal(placeTask(initial,1,'missing'),initial);assert.equal(placeTask(initial,2,'todo'),initial);
 const snapshot=structuredClone(initial);placeTask(initial,1,'done',5);assert.deepEqual(initial,snapshot);
});
