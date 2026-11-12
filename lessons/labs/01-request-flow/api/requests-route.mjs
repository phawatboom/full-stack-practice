import { AppError } from '../domain/requests-service.mjs';

// Test seam only: a real route must derive actor from a verified session.
export function createRequestsRoute(service) {
  return async function handle({ method, actor, body, query = {} }) {
    try {
      if (method === 'POST') {
        return { status: 201, body: { request: service.create(actor, body) } };
      }
      if (method === 'GET') {
        return { status: 200, body: { requests: service.list(actor, query.status) } };
      }
      return { status: 405, body: { error: { code: 'METHOD_NOT_ALLOWED' } } };
    } catch (error) {
      if (error instanceof AppError) {
        return { status: error.status, body: { error: { code: error.code } } };
      }
      return { status: 500, body: { error: { code: 'INTERNAL_ERROR' } } };
    }
  };
}
