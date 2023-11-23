import {Rating} from '@mui/material';
import moment from 'moment';
import React, {Suspense, useEffect, useState} from 'react';

export function ReviewCard({product, reviewType}) {
  const [reviewData, setReviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState('date');
  const [direction, setDirection] = useState('desc');
  const [perPage, setPerPage] = useState(5);
  const [star, setStar] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [JudgmeSorting, setJudgmeSorting] = useState('created_at');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [isApiCall, setApiCall] = useState(true);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [createReviews, setCreateReviews] = useState({});
  const productId = product.id.split('/').pop();
  const productTitle = product.title;
  const apiKey = 'uI1PQeR2IIJFLHInkoxAbHxMzE0w2VDXprE5fDXm';
  const apiToken = 'i36-YDTRLrg5P9RWEz7hlSvYfSE';
  const shopDomain = 'sp-teststore-14.myshopify.com';
  const externalId = 6681722781766;

  const sortingData = [
    {
      label: 'Date Ascending',
      value: {
        sort: 'date',
        direction: 'asc',
      },
    },
    {
      label: 'Date Discending',
      value: {
        sort: 'date',
        direction: 'desc',
      },
    },
    {
      label: 'Rating Ascending',
      value: {
        sort: 'rating',
        direction: 'asc',
      },
    },
    {
      label: 'Rating Discending',
      value: {
        sort: 'rating',
        direction: 'desc',
      },
    },
  ];

  const sortingDataJugdme = [
    {
      label: 'Most Recent',
      value: {
        sort_by: 'created_at',
        sort_dir: 'desc',
      },
    },
    {
      label: 'Highest Rating',
      value: {
        sort_by: 'rating',
        sort_dir: 'desc',
      },
    },
    {
      label: 'Lowest Rating',
      value: {
        sort_by: 'rating',
        sort_dir: 'asc',
      },
    },
    {
      label: 'Only Pictures',
      value: {
        sort_by: 'with_pictures',
      },
    },
    {
      label: 'Pictures First',
      value: {
        sort_by: 'pictures_first',
      },
    },
    {
      label: 'Videos First',
      value: {
        sort_by: 'videos_first',
      },
    },
    {
      label: 'Most Helpful',
      value: {
        sort_by: 'most_helpful',
      },
    },
  ];

  const loadReviewData = async (page) => {
    if (reviewType === 'JudgeMe') {
      const {fetchJudgeMeReviewData, fetchJudgeMeReviews} = await import(
        './JudgeMeAPI'
      );
      const internalId = await fetchJudgeMeReviewData(
        apiToken,
        shopDomain,
        externalId,
      );
      const reviews = await fetchJudgeMeReviews(
        apiToken,
        shopDomain,
        internalId,
        // perPage,
        // page,
        // direction,
        // JudgmeSorting,
        // star,
      );
      setReviewData(reviews);
    } else if (reviewType === 'Yotpo') {
      const {fetchYotpoReviewData} = await import('./YotpoReviewAPI');
      const reviews = await fetchYotpoReviewData(
        apiKey,
        productId,
        // perPage,
        // page,
        direction,
        sorting,
        star,
      );
      setReviewData(reviews);
      console.log('reviewData', reviewData)
      console.log('reviews', reviews);
    }
    setIsLoading(false);
  };

  const postReviewData = async (reviewType) => {
    if (reviewType === 'JudgeMe') {
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          title: reviewTitle,
          body: reviewContent,
          rating: rating,
          id: externalId,
          shop_domain: shopDomain,
          email: 'john@example.com',
        }),
      };

      await fetch(
        `https://cors-anywhere.herokuapp.com/https://judge.me/api/v1/reviews/?shop_domain=${shopDomain}&api_token=${apiToken}`,
        options,
      )
        .then((response) => response.json())
        .then((element) => {
          setCreateReviews('JudgeMe success:', element);
        })
        .catch((error) => console.log('JudgeMe error:', error));
    } else if (reviewType === 'Yotpo') {
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
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
      setApiCall(false);
      await fetch(`https://api.yotpo.com/v1/widget/reviews`, options)
        .then((response) => response.json())
        .then((element) => {
          setCreateReviews(element);
        })
        .catch((error) => console.log('moment error:', error));
    }
  };

  useEffect(() => {
    loadReviewData(currentPage);
    postReviewData();
  }, [reviewType, star, currentPage, direction]);

  const handleNextPage = () => {
    if (reviewData.length > 0) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="review">
          <div className="review-title">
            <div className="review-filter">
              <button
                className="btn rew-btn"
                onClick={() => setReviewFormOpen(!reviewFormOpen)}
              >
                Write a Review
              </button>
              {reviewType === 'Yotpo' && (
                <div className="select">
                  <select
                    className="review-select"
                    onChange={(e) => {
                      const selectedOption = sortingData.find(
                        (item) => item.label === e.target.value,
                      );
                      if (selectedOption) {
                        setSorting(selectedOption.value.sort);
                        setDirection(selectedOption.value.direction);
                      }
                    }}
                  >
                    {sortingData.map((option) => (
                      <option key={option.label} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    class="icon icon-caret"
                    viewBox="0 0 10 6"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
              )}
              {reviewType === 'JudgeMe' && (
                <div className="select">
                  <select
                    className="review-select"
                    onChange={(e) => {
                      const selectedOption = sortingDataJugdme.find(
                        (item) => item.label === e.target.value,
                      );
                      if (selectedOption) {
                        setJudgmeSorting(selectedOption.value.sort_by);
                        setDirection(selectedOption.value.sort_dir);
                      }
                    }}
                  >
                    {sortingDataJugdme.map((option) => (
                      <option key={option.label} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    class="icon icon-caret"
                    viewBox="0 0 10 6"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
              )}
              <div className="select">
                <select
                  className="review-select"
                  onChange={(e) => setStar(e.target.value)}
                >
                  <option value={star}>Star Rating</option>
                  <option value={1}>1-star</option>
                  <option value={2}>2-star</option>
                  <option value={3}>3-star</option>
                  <option value={4}>4-star</option>
                  <option value={5}>5-star</option>
                </select>
                <svg
                  aria-hidden="true"
                  focusable="false"
                  class="icon icon-caret"
                  viewBox="0 0 10 6"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          <form
            style={{display: reviewFormOpen ? 'block' : 'none'}}
            className="reviewForm"
            onSubmit={async (e) => {
              e.preventDefault();
              postReviewData(reviewType);
            }}
          >
            <div className="rating">
              <label>Rating :</label>
              <Rating
                name="simple-controlled"
                value={rating}
                sx={{position: 'absolute'}}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
              />
            </div>
            <div>
              <label>Name</label>
              <input
                type="text"
                name=" display_name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label>Review Title</label>
              <input
                name="review_title"
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
              />
            </div>

            <div>
              <label>Review</label>
              <textarea
                name="review_content"
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="Write your review..."
              />
            </div>
            <button
              type="submit"
              onClick={() => {
                console.log('createReview', createReviews);
                if (createReviews.message === 'ok') {
                  setReviewFormOpen(!reviewFormOpen);
                }
              }}
            >
              Submit Review
            </button>
          </form>

          <div className="reviewCard">
            {reviewData.length > 0 ? (
              <>
                {reviewData.map((review, id) => {
                  const date = moment(review.created_at).format('DD/MM/YYYY');
                  return (
                    <div className="ratingGrp" key={id}>
                      <div className="userProfile">
                        <span>
                          {review.user?.display_name
                            ? review.user?.display_name
                            : review.reviewer.name}
                        </span>
                        <div className="rating_wrap">
                          <Rating
                            name="simple-controlled"
                            value={review.score ? review.score : review.rating}
                            readOnly
                          />
                          <span>{review.title}</span>
                        </div>
                        <p className="review-content">
                          {review.content ? review.content : review.body}
                        </p>
                        <span>{date}</span>
                      </div>
                    </div>
                  );
                })}
                {/* <div className="review-pagination">
                  <button onClick={handlePreviousPage}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="16"
                      viewBox="0 0 18 15"
                      className="stroke-icon"
                    >
                      <path
                        d="M18 7.52344L1.6542 7.52344"
                        stroke="#000"
                        strokeWidth="2"
                        fill="none"
                      ></path>
                      <path
                        d="M7.97656 14L1.49988 7.52345L7.97656 1.04691"
                        stroke="#000"
                        strokeWidth="2"
                        fill="none"
                      ></path>
                    </svg>
                  </button>
                  {reviewData.length > 0 && (
                    <button
                      onClick={handleNextPage}
                      disabled={reviewData.length === 0}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="16"
                        viewBox="0 0 18 15"
                        className="stroke-icon"
                      >
                        <path
                          d="M0 7.47656L16.3458 7.47656"
                          stroke="#000"
                          strokeWidth="2"
                          fill="none"
                        ></path>
                        <path
                          d="M10.0234 1L16.5001 7.47655L10.0234 13.9531"
                          stroke="#000"
                          strokeWidth="2"
                          fill="none"
                        ></path>
                      </svg>
                    </button>
                  )}
                </div> */}
              </>
            ) : (
              <p> Write a review....</p>
            )}
          </div>
        </div>
      )}
    </Suspense>
  );
}
