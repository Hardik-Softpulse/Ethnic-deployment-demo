import {json, redirect} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useOutletContext,
  useParams,
  useNavigation,
  Link,
} from '@remix-run/react';
import {flattenConnection} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';

import {assertApiErrors, getInputStyleClasses} from '~/lib/utils';

const badRequest = (data) => json(data, {status: 400});

export const handle = {
  renderInModal: true,
};

export const action = async ({request, context, params}) => {
  const {storefront, session} = context;
  const formData = await request.formData();

  const customerAccessToken = await session.get('customerAccessToken');
  invariant(customerAccessToken, 'You must be logged in to edit your account.');

  const addressId = formData.get('addressId');
  invariant(typeof addressId === 'string', 'You must provide an address id.');

  if (request.method === 'DELETE') {
    try {
      const data = await storefront.mutate(DELETE_ADDRESS_MUTATION, {
        variables: {customerAccessToken, id: addressId},
      });

      assertApiErrors(data.customerAddressDelete);

      return redirect(params.locale ? `${params.locale}/account` : '/account');
    } catch (error) {
      return badRequest({formError: error.message});
    }
  }

  const address = {};

  const keys = [
    'lastName',
    'firstName',
    'address1',
    'address2',
    'city',
    'province',
    'country',
    'zip',
    'phone',
    'company',
  ];

  for (const key of keys) {
    const value = formData.get(key);
    if (typeof value === 'string') {
      address[key] = value;
    }
  }

  const defaultAddress = formData.get('defaultAddress');

  if (addressId === 'add') {
    try {
      const data = await storefront.mutate(CREATE_ADDRESS_MUTATION, {
        variables: {customerAccessToken, address},
      });

      assertApiErrors(data.customerAddressCreate);

      const newId = data.customerAddressCreate?.customerAddress?.id;
      invariant(newId, 'Expected customer address to be created');

      if (defaultAddress) {
        const data = await storefront.mutate(UPDATE_DEFAULT_ADDRESS_MUTATION, {
          variables: {customerAccessToken, addressId: newId},
        });

        assertApiErrors(data.customerDefaultAddressUpdate);
      }

      return redirect(params.locale ? `${params.locale}/account` : '/account');
    } catch (error) {
      return badRequest({formError: error.message});
    }
  } else {
    try {
      const data = await storefront.mutate(UPDATE_ADDRESS_MUTATION, {
        variables: {
          address,
          customerAccessToken,
          id: decodeURIComponent(addressId),
        },
      });

      assertApiErrors(data.customerAddressUpdate);

      if (defaultAddress) {
        const data = await storefront.mutate(UPDATE_DEFAULT_ADDRESS_MUTATION, {
          variables: {
            customerAccessToken,
            addressId: decodeURIComponent(addressId),
          },
        });

        assertApiErrors(data.customerDefaultAddressUpdate);
      }

      return redirect(params.locale ? `${params.locale}/account` : '/account');
    } catch (error) {
      return badRequest({formError: error.message});
    }
  }
};

export default function EditAddress() {
  const {id: addressId} = useParams();
  const isNewAddress = addressId === 'add';
  const actionData = useActionData();
  const {state} = useNavigation();
  const {customer} = useOutletContext();
  const addresses = flattenConnection(customer.addresses);
  const defaultAddress = customer.defaultAddress;

  const normalizedAddress = decodeURIComponent(addressId ?? '').split('?')[0];
  const address = addresses.find((address) =>
    address.id.startsWith(normalizedAddress),
  );

  console.log('state', state);
  console.log('addresses', addresses);
  console.log('customer', customer);

  return (
    <>
      <h2>{isNewAddress ? 'Add new address' : 'Edit address'}</h2>

      <Form method="post">
        <input
          type="hidden"
          name="addressId"
          value={address?.id ?? addressId}
        />
        <div className="row m-15">
          {actionData?.formError && (
            <div className="flex items-center justify-center mb-6 bg-red-100 rounded">
              <p className="m-4 text-sm text-red-900">{actionData.formError}</p>
            </div>
          )}
          <div className="input-field col-50">
            <label for="address_first_name_new">
              <strong>First Name</strong>
            </label>
            <input
              id="firstName"
              name="firstName"
              required
              type="text"
              autoComplete="given-name"
              placeholder="First name"
              aria-label="First name"
              className={`txtfname address_form ${getInputStyleClasses()}`}
              defaultValue={address?.firstName ?? ''}
            />
            <div className="form-error err-txtfname"></div>
          </div>
          <div className="input-field col-50">
            <label for="address_last_name_new">
              <strong>Last Name</strong>
            </label>
            <input
              id="lastName"
              name="lastName"
              required
              type="text"
              autoComplete="family-name"
              placeholder="Last name"
              aria-label="Last name"
              className={`txtlname address_form ${getInputStyleClasses()}`}
              autoCapitalize="words"
              defaultValue={address?.lastName ?? ''}
            />
            <div className="form-error err-txtlname"></div>
          </div>
          <div className="input-field col-50">
            <label for="address_company_new">
              <strong>Company</strong>
            </label>
            <input
              className={`txtcompany address_form ${getInputStyleClasses()}`}
              autoCapitalize="words"
              defaultValue={address?.company ?? ''}
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              placeholder="Company"
              aria-label="Company"
            />
            <div className="form-error err-txtcompany"></div>
          </div>
          <div className="input-field col-50">
            <label for="address_address1_new">
              <strong>Address 1</strong>
            </label>
            <input
              type="text"
              id="address1"
              name="address1"
              aria-label="Address line 1"
              className={`txtadd address_form ${getInputStyleClasses()}`}
              autoComplete="address-line1"
              autoCapitalize="words"
              placeholder="Address line 1"
              defaultValue={address?.address1 ?? ''}
            />
            <div className="form-error err-txtadd"></div>
          </div>
          <div className="input-field col-50">
            <label for="address_address2_new">
              <strong>Address 2</strong>
            </label>
            <input
              type="text"
              id="address2"
              name="address2"
              className={`txtadd2 address_form ${getInputStyleClasses()}`}
              autoComplete="address-line2"
              placeholder="Address line 2"
              aria-label="Address line 2"
              autoCapitalize="words"
              defaultValue={address?.address2 ?? ''}
            />
            <div className="form-error err-txtadd2"></div>
          </div>
          <div className="input-field col-50">
            <label for="address_city_new">
              <strong>City</strong>
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              autoComplete="address-level2"
              placeholder="City"
              aria-label="City"
              className={`txtcity address_form ${getInputStyleClasses()}`}
              autoCapitalize="words"
              defaultValue={address?.city ?? ''}
            />
            <div className="form-error err-txtcity"></div>
          </div>
          <div className="input-field col-50">
            <label for="address_country_new">
              <strong>Country</strong>
            </label>
            <div className="select">
              <select
                id="country"
                name="country"
                type="text"
                autoComplete="country-name"
                placeholder="Country"
                required
                aria-label="Country"
                className={`selcountry ${getInputStyleClasses()}`}
                data-default=""
                defaultValue={address?.country ?? ''}
              >
                <option value="---" data-provinces="[]">
                  ---
                </option>
                <option value="Afghanistan" data-provinces="[]">
                  Afghanistan
                </option>
                <option value="Aland Islands" data-provinces="[]">
                  Åland Islands
                </option>
                <option value="Albania" data-provinces="[]">
                  Albania
                </option>
                <option value="Algeria" data-provinces="[]">
                  Algeria
                </option>
                <option value="Andorra" data-provinces="[]">
                  Andorra
                </option>
                <option value="Angola" data-provinces="[]">
                  Angola
                </option>
                <option value="Anguilla" data-provinces="[]">
                  Anguilla
                </option>
              </select>
              <svg
                aria-hidden="true"
                focusable="false"
                className="icon icon-caret"
                viewBox="0 0 10 6"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <div className="form-error err-selcountry"></div>
          </div>
          <div
            id="address_province_container_new"
            className="input-field col-50"
          >
            <label for="address_province_new">
              <strong>Province</strong>
            </label>
            <div className="select">
              <select
                id="province"
                name="province"
                type="text"
                autoComplete="address-level1"
                placeholder="State / Province"
                required
                aria-label="State"
                className={`address_form ${getInputStyleClasses()}`}
                data-default=""
                defaultValue={address?.province ?? ''}
              >
                <option value="---" data-provinces="[]">
                  ---
                </option>
              </select>
              <svg
                aria-hidden="true"
                focusable="false"
                className="icon icon-caret"
                viewBox="0 0 10 6"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </div>
          <div className="input-field col-50">
            <label for="address_zip_new">
              <strong>Postal/Zip Code</strong>
            </label>
            <input
              id="zip"
              name="zip"
              type="text"
              autoComplete="postal-code"
              placeholder="Zip / Postal Code"
              required
              aria-label="Zip"
              className={`zipcode address_form ${getInputStyleClasses()}`}
              autoCapitalize="characters"
              defaultValue={address?.zip ?? ''}
            />
            <div className="form-error err-zipcode"></div>
          </div>
          <div className="input-field col-50">
            <label for="address_phone_new">
              <strong>Phone</strong>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Phone"
              aria-label="Phone"
              className={`txtphone address_form ${getInputStyleClasses()}`}
              defaultValue={address?.phone ?? ''}
            />
            <div className="form-error err-txtphone"></div>
          </div>
        </div>
        <div className="input-chckbox clearfix">
          <input
            type="checkbox"
            id="address_default_address_new"
            name="address[default]"
            value="1"
            defaultChecked={defaultAddress?.id === address?.id}
          />
          <label for="address_default_address_new" className="inline">
            Set as default address?
          </label>
        </div>

        <input
          type="submit"
          className={`btn address_btn lp-05 ${
            state !== 'idle' ? 'disabled' : ''
          }`}
          value={state !== 'idle' ? 'Saving' : 'Save'}
          disabled={state !== 'idle'}
        />
      </Form>
    </>
  );
}

const UPDATE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressUpdate(
    $address: MailingAddressInput!
    $customerAccessToken: String!
    $id: ID!
  ) {
    customerAddressUpdate(
      address: $address
      customerAccessToken: $customerAccessToken
      id: $id
    ) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const DELETE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      customerUserErrors {
        code
        field
        message
      }
      deletedCustomerAddressId
    }
  }
`;

const UPDATE_DEFAULT_ADDRESS_MUTATION = `#graphql
  mutation customerDefaultAddressUpdate(
    $addressId: ID!
    $customerAccessToken: String!
  ) {
    customerDefaultAddressUpdate(
      addressId: $addressId
      customerAccessToken: $customerAccessToken
    ) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CREATE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressCreate(
    $address: MailingAddressInput!
    $customerAccessToken: String!
  ) {
    customerAddressCreate(
      address: $address
      customerAccessToken: $customerAccessToken
    ) {
      customerAddress {
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
