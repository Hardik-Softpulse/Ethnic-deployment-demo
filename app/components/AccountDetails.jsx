import {Link} from './Link';

export function AccountDetails({activeTab, customer}) {
  return (
    <div
      className="cust-side-content"
      id="cst-information"
      style={{display: activeTab === 'cst-information' ? 'block' : 'none'}}
    >
      <h2>Account Details</h2>
      <div className="address-info">
        <h5>{customer.firstName + ' ' + customer.lastName}</h5>
        <p>
          {customer.firstName}
          <br />
          {customer.lastName}
          <br />
          surat
          <br />
          GJ
          <br />
          395006
          <br />
          India
          <br />
          {customer.phone}
        </p>
        <Link href="/account" className="btn lp-05">
          View addresses (1)
        </Link>
      </div>
    </div>
  );
}
