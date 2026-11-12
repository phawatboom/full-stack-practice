import { createMemoryRepository } from '../data/memory-repository.mjs';
import { createRequestsService } from '../domain/requests-service.mjs';
import { createRequestsRoute } from '../api/requests-route.mjs';
import { createRequestsClient } from '../web/requests-client.mjs';

export function fixture() {
  const repository = createMemoryRepository();
  const route = createRequestsRoute(createRequestsService(repository));
  const clientFor = actor =>
    createRequestsClient(request => route({ ...request, actor }));
  return {
    repository,
    route,
    a: clientFor({ id: 'a', role: 'client' }),
    b: clientFor({ id: 'b', role: 'client' }),
    staff: clientFor({ id: 'staff', role: 'staff' }),
    anonymous: clientFor(undefined),
  };
}
