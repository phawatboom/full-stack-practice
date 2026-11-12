import { createMemoryRepository } from './data/memory-repository.mjs';
import { createRequestsService } from './domain/requests-service.mjs';
import { createRequestsRoute } from './api/requests-route.mjs';
import { createRequestsClient } from './web/requests-client.mjs';

const route = createRequestsRoute(createRequestsService(createMemoryRepository()));
const actor = { id: 'client-a', role: 'client' };
const client = createRequestsClient(request => route({ ...request, actor }));

await client.create('  Fix the contact form  ');
console.log('All visible requests:', await client.list());
console.log('Requests filtered to new:', await client.list('new'));
