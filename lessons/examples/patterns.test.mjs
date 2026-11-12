import test from 'node:test';
import assert from 'node:assert/strict';
import {
  renameRequest, parseLimit, createLatestRunner, isOverdue, reduceSave, lowerBound,
} from './patterns.mjs';

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

test('rename replaces the affected record without mutating input', () => {
  const first = Object.freeze({ id: 'r1', title: 'Old' });
  const second = Object.freeze({ id: 'r2', title: 'Untouched' });
  const input = Object.freeze([first, second]);
  const result = renameRequest(input, 'r1', 'New');
  assert.notEqual(result, input);
  assert.notEqual(result[0], first);
  assert.equal(result[1], second);
  assert.equal(first.title, 'Old');
  assert.equal(result[0].title, 'New');
});

test('rename defines absent ID and empty input behavior', () => {
  const input = [{ id: 'r1', title: 'Keep' }];
  const result = renameRequest(input, 'missing', 'New');
  assert.deepEqual(result, input);
  assert.notEqual(result, input);
  assert.equal(result[0], input[0]);
  assert.deepEqual(renameRequest([], 'missing', 'New'), []);
});

test('limit defaults only for absence and accepts the boundary values', () => {
  assert.equal(parseLimit(undefined), 20);
  assert.equal(parseLimit('1'), 1);
  assert.equal(parseLimit('100'), 100);
  assert.equal(parseLimit('20'), 20);
});

test('limit rejects malformed, repeated and out-of-range values', () => {
  const invalid = ['', '0', '01', '-1', '+1', '1.5', '1e2', '2abc', ' 2', '2 ',
    '2\n', '2\r\n', '2\u2028', '101',
    '9'.repeat(400), null, 2, ['2', '3']];
  for (const value of invalid) assert.throws(() => parseLimit(value), RangeError);
});

test('latest success wins when requests complete in reverse order', async () => {
  const a = deferred();
  const b = deferred();
  const events = [];
  const runner = createLatestRunner(key => key === 'a' ? a.promise : b.promise,
    state => events.push(state));
  const first = runner.run('a');
  const second = runner.run('b');
  b.resolve('B');
  await second;
  a.resolve('A');
  await first;
  assert.deepEqual(events, [{ kind: 'loading' }, { kind: 'loading' }, { kind: 'ready', data: 'B' }]);
});

test('obsolete errors cannot replace the current success', async () => {
  const a = deferred();
  const b = deferred();
  const events = [];
  const runner = createLatestRunner(key => key === 'a' ? a.promise : b.promise,
    state => events.push(state));
  const first = runner.run('a');
  const second = runner.run('b');
  b.resolve('B');
  await second;
  a.reject(new Error('Old failure'));
  await first;
  assert.deepEqual(events.at(-1), { kind: 'ready', data: 'B' });
  assert.equal(events.some(state => state.kind === 'error'), false);
});

test('invalidation prevents results committing after identity change', async () => {
  const pending = deferred();
  const events = [];
  const runner = createLatestRunner(() => pending.promise, state => events.push(state));
  const work = runner.run('query');
  runner.invalidate();
  pending.resolve('Private old account data');
  await work;
  assert.deepEqual(events, [{ kind: 'loading' }]);
});

test('current errors produce an error state and a later run can recover', async () => {
  const events = [];
  const runner = createLatestRunner(async key => {
    if (key === 'bad') throw new Error('Synthetic failure');
    return 'Recovered';
  }, state => events.push(state));
  await runner.run('bad');
  assert.deepEqual(events.at(-1), { kind: 'error', message: 'Synthetic failure' });
  await runner.run('good');
  assert.deepEqual(events.at(-1), { kind: 'ready', data: 'Recovered' });
});

test('overdue uses strict boundary, null policy and resolved exclusion', () => {
  const request = { dueAtMs: 1000, status: 'new' };
  assert.equal(isOverdue(request, 999), false);
  assert.equal(isOverdue(request, 1000), false);
  assert.equal(isOverdue(request, 1001), true);
  assert.equal(isOverdue({ ...request, status: 'resolved' }, 1001), false);
  assert.equal(isOverdue({ dueAtMs: null, status: 'new' }, 1001), false);
});

test('overdue rejects invalid instants instead of silently comparing NaN', () => {
  assert.throws(() => isOverdue({ dueAtMs: NaN, status: 'new' }, 1001), RangeError);
  assert.throws(() => isOverdue({ dueAtMs: 1000, status: 'new' }, Infinity), RangeError);
});

test('the same instant has the same overdue result regardless of display offset', () => {
  const utc = Date.parse('2026-12-01T00:00:00Z');
  const bangkok = Date.parse('2026-12-01T07:00:00+07:00');
  const offsetMinusEight = Date.parse('2026-11-30T16:00:00-08:00');
  assert.equal(utc, bangkok);
  assert.equal(utc, offsetMinusEight);
  for (const dueAtMs of [utc, bangkok, offsetMinusEight]) {
    assert.equal(isOverdue({ dueAtMs, status: 'new' }, utc + 1), true);
  }
});

test('save has explicit success and retry-after-error transitions', () => {
  const idle = { kind: 'idle' };
  const saving = reduceSave(idle, { type: 'start' });
  assert.deepEqual(saving, { kind: 'saving' });
  assert.deepEqual(reduceSave(saving, { type: 'succeed' }), { kind: 'saved' });
  const failed = reduceSave(saving, { type: 'fail', message: 'Try again' });
  assert.deepEqual(failed, { kind: 'error', message: 'Try again' });
  assert.deepEqual(reduceSave(failed, { type: 'start' }), { kind: 'saving' });
  assert.deepEqual(reduceSave(failed, { type: 'reset' }), idle);
  assert.deepEqual(idle, { kind: 'idle' });
});

test('invalid save transitions are rejected', () => {
  assert.throws(() => reduceSave({ kind: 'idle' }, { type: 'succeed' }), /Invalid/);
  assert.throws(() => reduceSave({ kind: 'saving' }, { type: 'start' }), /Invalid/);
});

test('lowerBound covers empty, duplicate, below and above cases', () => {
  assert.equal(lowerBound([], 3), 0);
  assert.equal(lowerBound([1, 3, 3, 8], 3), 1);
  assert.equal(lowerBound([1, 3, 3, 8], 0), 0);
  assert.equal(lowerBound([1, 3, 3, 8], 9), 4);
});

test('lowerBound agrees with a linear oracle over deterministic sorted cases', () => {
  for (let length = 0; length <= 40; length += 1) {
    const values = Array.from({ length }, (_, index) => Math.floor(index / 3) - 5);
    for (let target = -8; target <= 12; target += 1) {
      const found = values.findIndex(value => value >= target);
      assert.equal(lowerBound(values, target), found === -1 ? values.length : found);
    }
  }
});
