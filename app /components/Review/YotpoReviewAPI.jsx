// YotpoReviewAPI.js
export async function fetchYotpoReviewData(
  apiKey,
  productId,
  perPage,
  page,
  direction,
  sorting,
  star,
) {
  const data = {
    per_page: perPage,
    page: page,
    direction: direction,
    sort: sorting,
  };

  if (star !== null) {
    data.star = star;
  }

  const queryParams = new URLSearchParams(data);
  const options = {
    method: 'GET',
    headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
  };
  const response = await fetch(
    `https://api-cdn.yotpo.com/v1/widget/${apiKey}/products/${productId}/reviews.json?${queryParams.toString()}`,
    options,
  );
  const result = await response.json();

  return result.response.reviews;
}

export async function YotpoCreateReview(
  apiKey,
  productId,
  productTitle,
  email,
  reviewContent,
  rating,
  reviewTitle,
  displayName,
) {
  const options = {
    method: 'POST',
    headers: {accept: 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify({
      appkey: apiKey,
      sku: productId,
      product_title: productTitle,
      email: email,
      review_content: reviewContent,
      review_score: rating,
      review_title: reviewTitle,
      display_name: displayName,
    }),
  };

  const response = await fetch(
    `https://api.yotpo.com/v1/widget/reviews`,
    options,
  );
  const result = await response.json();
  console.log('response', result);
  return result;
}
