export function createRequestsClient(transport) {
  async function send(request) {
    const response = await transport(request);
    if (response.status < 200 || response.status >= 300) {
      const error = new Error(response.body.error.code);
      error.status = response.status;
      throw error;
    }
    return response.body;
  }
  return {
    async create(title) {
      return (await send({ method: 'POST', body: { title } })).request;
    },
    async list(status) {
      return (await send({ method: 'GET', query: { status } })).requests;
    },
  };
}
