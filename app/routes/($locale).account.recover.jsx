import {json, redirect} from '@shopify/remix-oxygen';
import {Form, useActionData} from '@remix-run/react';
import {useState} from 'react';
import {Link} from '~/components';
import {getInputStyleClasses} from '~/lib/utils';

export async function loader({context, params}) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (customerAccessToken) {
    return redirect(params.locale ? `${params.locale}/account` : '/account');
  }
  return new Response(null);
}

const badRequest = (data) => json(data, {status: 400});

export async function action({request, context}) {
  const {storefront} = context;
  const form = await request.formData();
  const email = form.has('email') ? String(form.get('email')) : null;

  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    if (!email) {
      throw new Error('Please provide an email.');
    }
    await storefront.mutate(CUSTOMER_RECOVER_MUTATION, {
      variables: {email},
    });

    return json({resetRequested: true});
  } catch (error) {
    const resetRequested = false;
    if (error instanceof Error) {
      return json({error: error.message, resetRequested}, {status: 400});
    }
    return json({error, resetRequested}, {status: 400});
  }
}

export const meta = () => {
  return [{title: 'Recover Password'}];
};

export default function Recover() {
  const actionData = useActionData();
  const [nativeEmailError, setNativeEmailError] = useState(null);
  const isSubmitted = actionData?.resetRequested;

  return (
    <div className="cust-sign-page bg-grey clearfix">
      <div className="breadcrumb">
        <div className="container">
          <span>
            <a href="/">Home</a>
          </span>
          <span>Forgot Password</span>
        </div>
      </div>
      <div className="container">
        {isSubmitted ? (
          <>
            <h1 className="text-4xl">Request Sent.</h1>
            <p className="mt-4">
              If that email address is in our system, you will receive an email
              with instructions about how to reset your password in a few
              minutes.
            </p>
          </>
        ) : (
          <>
            <h1 className="page-title text-up text-center">Forgot Password</h1>
            <div className="cust-sign-form">
              <p className="mt-4">
                Enter the email address associated with your account to receive
                a link to reset your password.
              </p>
              <Form
                method="post"
                noValidate
                className="pt-6 pb-8 mt-4 mb-4 space-y-3"
              >
                {actionData?.formError && (
                  <div className="flex items-center justify-center mb-6 bg-zinc-500">
                    <p className="m-4 text-s text-contrast">
                      {actionData.formError}
                    </p>
                  </div>
                )}
                <div>
                  <input
                    className={`mb-1 ${getInputStyleClasses(nativeEmailError)}`}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Email address"
                    aria-label="Email address"
                    // eslint-disable-next-line jsx-a11y/no-autofocus
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
                <button className="btn" type="submit">
                  Request Reset Link
                </button>
                <p>
                  Return to &nbsp;
                  <Link to="/account/login">Login</Link>
                </p>
              </Form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
