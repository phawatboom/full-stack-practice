export function renameRequest(items, id, title) {
  return items.map(item => item.id === id ? { ...item, title } : item);
}

export function parseLimit(raw) {
  if (raw === undefined) return 20;
  if (typeof raw !== 'string') {
    throw new RangeError('Limit must be a decimal integer from 1 to 100');
  }
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 1 || value > 100 || String(value) !== raw) {
    throw new RangeError('Limit must be a decimal integer from 1 to 100');
  }
  return value;
}

export function createLatestRunner(load, commit) {
  let generation = 0;
  return {
    invalidate() {
      generation += 1;
    },
    async run(input) {
      const current = ++generation;
      commit({ kind: 'loading' });
      try {
        const data = await load(input);
        if (current === generation) commit({ kind: 'ready', data });
      } catch (error) {
        if (current === generation) {
          commit({ kind: 'error', message: error instanceof Error ? error.message : 'Unknown error' });
        }
      }
    },
  };
}

export function isOverdue({ dueAtMs, status }, nowMs) {
  if (!Number.isFinite(nowMs)) throw new RangeError('Invalid current instant');
  if (dueAtMs === null) return false;
  if (!Number.isFinite(dueAtMs)) throw new RangeError('Invalid due instant');
  return status !== 'resolved' && nowMs > dueAtMs;
}

export function reduceSave(state, event) {
  if (event.type === 'reset') return { kind: 'idle' };
  if (event.type === 'start' && state.kind !== 'saving') return { kind: 'saving' };
  if (event.type === 'succeed' && state.kind === 'saving') return { kind: 'saved' };
  if (event.type === 'fail' && state.kind === 'saving') {
    return { kind: 'error', message: event.message };
  }
  throw new Error('Invalid save transition');
}

export function lowerBound(values, target) {
  let low = 0;
  let high = values.length;
  while (low < high) {
    const middle = low + Math.floor((high - low) / 2);
    if (values[middle] < target) low = middle + 1;
    else high = middle;
  }
  return low;
}
