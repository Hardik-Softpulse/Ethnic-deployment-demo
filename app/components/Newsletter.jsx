import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {useState} from 'react';
import {useFetcher} from 'react-router-dom';

export async function loader({context}) {
  const {session} = context;
  const emailMarketingConsent =
    (await session.get('emailMarketingConsent')) || null;
  const subscribedToNewsletter = emailMarketingConsent === 'SUBSCRIBED';
  return json({
    subscribedToNewsletter,
  });
}

export const Newsletter = () => {
  // const {subscribedToNewsletter} = useLoaderData();
  const {Form, ...fetcher} = useFetcher();
  const {data} = fetcher;
  const subscribeSuccess = data?.subscriber;
  const subscribeError = data?.error;

  console.log('Form', Form)
  console.log('data', data)

  return (
    <div>
      {subscribeSuccess ? (
        <p>Thank you for subscribing!</p>
      ) : (
        <Form method="post" noValidate action="/newsletter">
          <h6 className="stft-cl-title text-up ">Newsletter</h6>
          <div className="footer-newsletter">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email address"
              className="input-ele iwhite"
              required
            />
            <button type="submit" className="btn submit-btn">
              Submit
            </button>
          </div>
        </Form>
      )}
      {subscribeError && <p style={{color: 'red'}}>{data.error.message}</p>}
    </div>
  );
};
