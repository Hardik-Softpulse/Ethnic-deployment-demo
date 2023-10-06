import {Link} from '~/components';

export function Modal({children, cancelLink, isAddressFormPopupVisible}) {
  return (
    <div
      className={`address-form-popup ${
        isAddressFormPopupVisible ? 'opened' : ''
      }`}
    >
      <div
        className="address-formpop-box"
        role="button"
        onClick={(e) => {
          e.stopPropagation();
        }}
        onKeyPress={(e) => {
          e.stopPropagation();
        }}
        tabIndex={0}
      >
        <Link to={cancelLink} className="address-pop-close address-pop-clink">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            width="20"
            height="20"
          >
            <path d="M19.99 17.55L12.33 9.97L19.91 2.33L17.55 -0.01L9.98 7.64L2.33 0.06L-0.01 2.41L7.64 9.99L0.06 17.65L2.41 19.99L10 12.33L17.65 19.91L19.99 17.55Z" />
          </svg>
        </Link>
        {children}
      </div>
    </div>
  );
}
