export function createMemoryRepository() {
  const items = [];
  let sequence = 0;

  return {
    insert({ title, ownerId }) {
      const item = { id: `r${++sequence}`, title, ownerId, status: 'new' };
      items.push(item);
      return { ...item };
    },
    list() {
      return items.map(item => ({ ...item }));
    },
  };
}
