const statuses = new Set(['new', 'in_progress', 'resolved']);

export class AppError extends Error {
  constructor(status, code) {
    super(code);
    this.status = status;
    this.code = code;
  }
}

function requireActor(actor) {
  if (!actor) throw new AppError(401, 'UNAUTHENTICATED');
  if (typeof actor.id !== 'string' || actor.id.length === 0 ||
      !['client', 'staff'].includes(actor.role)) {
    throw new AppError(403, 'FORBIDDEN');
  }
}

export function createRequestsService(repository) {
  return {
    create(actor, body) {
      requireActor(actor);
      if (!body || typeof body !== 'object' || Array.isArray(body) ||
          Object.keys(body).some(key => key !== 'title') ||
          typeof body.title !== 'string') {
        throw new AppError(400, 'INVALID_INPUT');
      }
      const title = body.title.trim();
      if (title.length < 1 || title.length > 120) {
        throw new AppError(400, 'INVALID_INPUT');
      }
      return repository.insert({ title, ownerId: actor.id });
    },
    list(actor, status) {
      requireActor(actor);
      if (status !== undefined && !statuses.has(status)) {
        throw new AppError(400, 'INVALID_STATUS');
      }
      let items = repository.list().filter(item =>
        actor.role === 'staff' || item.ownerId === actor.id
      );
      if (status !== undefined) {
        items = items.filter(item => item.status !== status);
      }
      return items;
    },
  };
}
