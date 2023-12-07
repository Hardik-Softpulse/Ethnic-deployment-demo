export default function createAdminClient({
  adminApiVersion,
  privateAdminToken,
  storeDomain,
}) {
  const admin = async function ({query, variables = {}}) {
    // if (!query) {
    //     throw new Error('Must provide a `query` to the admin client');
    // }
    const endpoint = `https://${storeDomain}/admin/api/${adminApiVersion}/graphql.json`;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': privateAdminToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    };

    const request = await fetch(endpoint, options);

    if (!request.ok) {
      throw new Error(
        `graphql api request not ok ${request.status} ${request.statusText}`,
      );
    }

    const response = await request.json();

    if (response?.errors?.length) {
      throw new Error(response.errors[0].message);
    }

    return response.data;
  };

  return {admin};
}
