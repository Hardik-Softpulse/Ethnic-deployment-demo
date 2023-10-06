import {redirect, json} from '@shopify/remix-oxygen';
import {Form, useActionData} from '@remix-run/react';
import {useState} from 'react';

import {getInputStyleClasses} from '~/lib/utils';
import {Link} from '~/components';

import {doLogin} from './($locale).account.login';

export async function loader({context, params}) {
  const customerAccessToken = await context.session.get('customerAccessToken');

  if (customerAccessToken) {
    return redirect(params.locale ? `${params.locale}/account` : '/account');
  }

  return new Response(null);
}

const badRequest = (data) => json(data, {status: 400});

export const action = async ({request, context, params}) => {
  const {session, storefront} = context;
  const formData = await request.formData();

  const email = formData.get('email');
  const password = formData.get('password');

  if (
    !email ||
    !password ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return badRequest({
      formError: 'Please provide both an email and a password.',
    });
  }

  try {
    const data = await storefront.mutate(CUSTOMER_CREATE_MUTATION, {
      variables: {
        input: {email, password},
      },
    });

    if (!data?.customerCreate?.customer?.id) {
      /**
       * Something is wrong with the user's input.
       */
      throw new Error(data?.customerCreate?.customerUserErrors.join(', '));
    }

    const customerAccessToken = await doLogin(context, {email, password});
    session.set('customerAccessToken', customerAccessToken);

    return redirect(params.locale ? `${params.locale}/account` : '/account', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  } catch (error) {
    if (storefront.isApiError(error)) {
      return badRequest({
        formError: 'Something went wrong. Please try again later.',
      });
    }

    /**
     * The user did something wrong, but the raw error from the API is not super friendly.
     * Let's make one up.
     */
    return badRequest({
      formError:
        'Sorry. We could not create an account with this email. User might already exist, try to login instead.',
    });
  }
};

export const meta = () => {
  return [{title: 'Register'}];
};

export default function Ragister() {
  const actionData = useActionData();
  const [nativeEmailError, setNativeEmailError] = useState(null);
  const [nativePasswordError, setNativePasswordError] = useState(null);

  console.log('actionData', actionData)

  return (
    <div className="cust-sign-page clearfix">
      <div className="breadcrumb">
        <div className="container">
          <span>
            <a href="#">Home</a>
          </span>
          <span>register</span>
        </div>
      </div>
      <div className="container">
        <h2 className="page-title text-up text-center">Register</h2>
        <div className="cust-sign-form">
          <Form method="post" noValidate>
            {actionData?.formError && (
              <div className="flex items-center justify-center mb-6 bg-zinc-500">
                <p className="m-4 text-s text-contrast">
                  {actionData.formError}
                </p>
              </div>
            )}
            <div className="mb-30">
              Get access to your Orders, Wishlist and Recommendations
            </div>
            <div className="input-field">
              <label>
                <strong>First Name</strong>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="email"
                placeholder="Enter your First name"
                required
                className={`mb-1 ${getInputStyleClasses(nativeEmailError)}`}
              />
              {nativeEmailError && (
                <p className="text-red-500 text-xs">
                  {nativeEmailError} &nbsp;
                </p>
              )}
            </div>
            <div className="input-field">
              <label>
                <strong>Last Name</strong>
              </label>
              <input
                type="text"
                input
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                required
                className={`mb-1 ${getInputStyleClasses(nativeEmailError)}`}
              />
              {nativeEmailError && (
                <p className="text-red-500 text-xs">
                  {nativeEmailError} &nbsp;
                </p>
              )}
            </div>
            <div className="input-field">
              <label>
                <strong>Email Id</strong>
              </label>
              <input
                type="email"
                name=""
                placeholder="Enter your email address..."
                className={`mb-1 ${getInputStyleClasses(nativeEmailError)}`}
                autoComplete="email"
                required
                autoFocus
                onBlur={(event) => {
                  setNativeEmailError(
                    event.currentTarget.value.length &&
                      !event.currentTarget.validity.valid
                      ? 'Invalid email address'
                      : null,
                  );
                }}
              />
              {nativeEmailError && (
                <p className="text-red-500 text-xs">
                  {nativeEmailError} &nbsp;
                </p>
              )}
            </div>
            <div className="input-field">
              <label>
                <strong>Password</strong>
              </label>
              <input
                type="password"
                name=""
                placeholder="Enter your password"
                className={`mb-1 ${getInputStyleClasses(
                  nativePasswordError,
                )}`}
                minLength={8}
                required
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                onBlur={(event) => {
                  if (
                    event.currentTarget.validity.valid ||
                    !event.currentTarget.value.length
                  ) {
                    setNativePasswordError(null);
                  } else {
                    setNativePasswordError(
                      event.currentTarget.validity.valueMissing
                        ? 'Please enter a password'
                        : 'Passwords must be at least 8 characters',
                    );
                  }
                }}
              />
              {nativePasswordError && (
                <p className="text-red-500 text-xs">
                  {' '}
                  {nativePasswordError} &nbsp;
                </p>
              )}
            </div>

            <button
              className="btn btn-full btn-lg"
              value="Register"
              disabled={!!(nativePasswordError || nativeEmailError)}
            >
              Register
            </button>
            <p>
              Already Have an account ? <Link to="/account/login">Sign in</Link>
              .
            </p>
            <p className="policy-text">
              By logging in, you agree to Our's <a href="#">Privacy Policy</a>{' '}
              and <a href="#">Terms of Use</a>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
}

const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
