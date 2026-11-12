import test from 'node:test';
import assert from 'node:assert/strict';
import { fixture } from './fixture.mjs';

test('create trims the title and assigns the authenticated owner', async () => {
  const { a } = fixture();
  const item = await a.create('  Contact form  ');
  assert.equal(item.title, 'Contact form');
  assert.equal(item.ownerId, 'a');
  assert.equal(item.status, 'new');
});

test('blank and oversized titles fail without writes', async () => {
  const { a, repository } = fixture();
  for (const title of ['  ', 'x'.repeat(121)]) {
    await assert.rejects(a.create(title), { status: 400 });
  }
  assert.deepEqual(repository.list(), []);
});

test('anonymous reads and writes are denied', async () => {
  const { anonymous, repository } = fixture();
  await assert.rejects(anonymous.list(), { status: 401 });
  await assert.rejects(anonymous.create('Hello'), { status: 401 });
  assert.deepEqual(repository.list(), []);
});

test('clients only list their own requests', async () => {
  const { a, b } = fixture();
  const owned = await a.create('A request');
  await b.create('B request');
  assert.deepEqual(await a.list(), [owned]);
});

test('staff list all requests', async () => {
  const { a, b, staff } = fixture();
  const first = await a.create('A request');
  const second = await b.create('B request');
  assert.deepEqual(await staff.list(), [first, second]);
});

test('unknown body fields cannot assign ownership', async () => {
  const { route, repository } = fixture();
  const response = await route({ method: 'POST', actor: { id: 'a', role: 'client' },
    body: { title: 'Attempt', ownerId: 'b' } });
  assert.equal(response.status, 400);
  assert.deepEqual(repository.list(), []);
});

test('unknown query status is rejected', async () => {
  const { a } = fixture();
  await assert.rejects(a.list('unexpected'), { status: 400 });
});

test('returned objects cannot mutate stored requests', async () => {
  const { a } = fixture();
  const created = await a.create('Original');
  created.title = 'Mutated';
  const listed = await a.list();
  listed[0].title = 'Changed again';
  assert.equal((await a.list())[0].title, 'Original');
});

test('unrecognized actors do not gain access', async () => {
  const { route } = fixture();
  const response = await route({ method: 'GET', actor: { id: 'a', role: 'admin' } });
  assert.equal(response.status, 403);
});
