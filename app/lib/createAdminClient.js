export default function createAdminClient({
    adminApiVersion,
    privateAdminToken,
    storeDomain,
}) {

    const admin = async function ({ query, variables = {} }) {

        console.log('variables', variables)
        console.log('query', query)

        // if (!query) {
        //     throw new Error('Must provide a `query` to the admin client');
        // }
        const endpoint = `https://${storeDomain}/admin/api/${adminApiVersion}/graphql.json`;
        console.log('endpoint', endpoint)
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

        console.log('options', options)

        const request = await fetch(endpoint, options);

        if (!request.ok) {
            throw new Error(
                `graphql api request not ok ${request.status} ${request.statusText}`,
            );
        }

        const response = await request.json();

        console.log('response', response)

        if (response?.errors?.length) {
            throw new Error(response.errors[0].message);
        }

        return response.data;
    };

    return { admin };
}