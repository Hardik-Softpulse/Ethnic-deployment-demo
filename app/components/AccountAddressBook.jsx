import {Form} from '@remix-run/react';
import {Link} from './Link';

export function AccountAddressBook({
  activeTab,
  customer,
  addresses,
  toggleFormVisibility,
}) {
  return (
    <div
      className="cust-side-content"
      id="cst-address"
      style={{display: activeTab === 'cst-address' ? 'block' : 'none'}}
    >
      <h2>Your Addresses</h2>
      <Link
        to="address/add"
        className="btn add-address-btn address-pop-link lp-05 "
        data-id="add-address-form"
        onClick={toggleFormVisibility}
      >
        Add New Address
      </Link>

      {Boolean(addresses?.length) && (
        <div className="row m-15">
          {customer.defaultAddress && (
            <Address
              address={customer.defaultAddress}
              defaultAddress
              toggleFormVisibility={toggleFormVisibility}
            />
          )}
          {addresses
            .filter((address) => address.id !== customer.defaultAddress?.id)
            .map((address) => (
              <Address
                key={address.id}
                address={address}
                toggleFormVisibility={toggleFormVisibility}
              />
            ))}
        </div>
      )}
    </div>
  );
}

function Address({address, defaultAddress, toggleFormVisibility}) {
  return (
    <div className="address-book" key={address.id}>
      <h5>
        {(address.firstName || address.lastName) && (
          <span>
            {'' +
              (address.firstName && address.firstName + ' ') +
              address?.lastName}
          </span>
        )}
        {defaultAddress && <span>(Default)</span>}
      </h5>
      <div className="divider"></div>
      <p>
        {address.company}
        <br /> {address.address1}, {address.address2}
        <br /> {address.city}
        <br /> {address.province}
        <br /> {address.zip}
        <br /> {address.country}
        <br /> {address.phone}
      </p>
      <p className="action-link">
        <Link
          to={`/account/address/${encodeURIComponent(address.id)}`}
          className="address-pop-link "
          data-id={`edit_address_${address.id}`}
          prefetch="intent"
          onClick={toggleFormVisibility}
        >
          <button>Edit</button>
        </Link>

        <Form action="address/delete" method="delete">
          <input type="hidden" name="addressId" value={address.id} />
          <button className="text-left text-primary/50 ml-6 text-sm">
            Remove
          </button>
        </Form>
      </p>
    </div>
  );
}
