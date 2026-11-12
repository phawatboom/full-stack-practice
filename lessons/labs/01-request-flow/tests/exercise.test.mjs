import test from 'node:test';
import assert from 'node:assert/strict';
import { fixture } from './fixture.mjs';

test('filtering to new includes a visible new request',
  { skip: 'Exercise: remove this skip, reproduce the failure, then fix the source' },
  async () => {
    const { a, b } = fixture();
    const owned = await a.create('Own new request');
    await b.create('Other client request');
    assert.deepEqual(await a.list('new'), [owned]);
  });
