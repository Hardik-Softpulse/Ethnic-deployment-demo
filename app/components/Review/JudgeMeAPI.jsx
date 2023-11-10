export async function fetchJudgeMeReviewData(apiToken, shopDomain, externalId) {
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://judge.me/api/v1/products/-1?api_token=${apiToken}&shop_domain=${shopDomain}&external_id=${externalId}`,
    {
      method: 'GET',
      redirect: 'follow',
    },
  );
  const result = await response.json();
  return result.product.id;
}

export async function fetchJudgeMeReviews(
  apiToken,
  shopDomain,
  internalId,
  perPage,
  page,
  direction,
  JudgmeSorting,
  star,
) {
  const qurypram = {
    sort_by: JudgmeSorting,
    sort_dir: direction,
  };
  const queryParams = new URLSearchParams(qurypram);
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://judge.me/api/v1/reviews?api_token=${apiToken}&shop_domain=${shopDomain}&per_page=${perPage}&page=${page}&id=${internalId}&${queryParams.toString()}`,
  );
  const data = await response.json();
  return data.reviews;
}
