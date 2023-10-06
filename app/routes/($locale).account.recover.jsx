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

export const action = async ({request, context}) => {
  const formData = await request.formData();
  const email = formData.get('email');

  if (!email || typeof email !== 'string') {
    return badRequest({
      formError: 'Please provide an email.',
    });
  }

  try {
    await context.storefront.mutate(CUSTOMER_RECOVER_MUTATION, {
      variables: {email},
    });

    return json({resetRequested: true});
  } catch (error) {
    return badRequest({
      formError: 'Something went wrong. Please try again later.',
    });
  }
};

export const meta = () => {
  return [{title: 'Recover Password'}];
};

export default function Recover({isChangePasswordPopupOpen}) {
  const actionData = useActionData();
  const [nativeEmailError, setNativeEmailError] = useState(null);
  const [email, setEmail] = useState('');
  const isSubmitted = actionData?.resetRequested;

  return (
    <>
      {isSubmitted ? (
        <>
          <h1 className="text-4xl">Request Sent.</h1>
          <p className="mt-4">
            If that email address is in our system, you will receive an email
            with instructions about how to reset your password in a few minutes.
          </p>
        </>
      ) : (
        <div
          className="cst-chng-password"
          style={{display: isChangePasswordPopupOpen ? 'block' : 'block'}}
        >
          <h4>Change your password</h4>
          <p>We will send you an email to change your password.</p>
          <Form method="post" noValidate>
            {actionData?.formError && (
              <div className="flex items-center justify-center mb-6 bg-zinc-500">
                <p className="m-4 text-s text-contrast">
                  {actionData.formError}
                </p>
              </div>
            )}
            <div className="input-field">
              <label>
                <strong>Email Id</strong>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                id="recover-email"
                placeholder="Enter your email address..."
                autocorrect="off"
                autoCapitalize="off"
                className={`${getInputStyleClasses(nativeEmailError)}`}
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
            <div className="error recover_password_error"></div>
            <div className="input-subtn dfx">
              <Link
                to="/account"
                type="submit"
                className="btn lp-05 m-0"
                value="Submit"
                disabled={!nativeEmailError}
                style={{display: isChangePasswordPopupOpen && isSubmitted ? 'block' : 'none'}}
              >
                submit
              </Link>

              <Link
                to="/account"
                className="change-psw-close lp-05 text-up"
                style={{display: isChangePasswordPopupOpen ? 'block' : 'none'}}
              >
                Cancle
              </Link>
            </div>
          </Form>
        </div>
      )}
    </>
  );
}

const CUSTOMER_RECOVER_MUTATION = `#graphql
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
