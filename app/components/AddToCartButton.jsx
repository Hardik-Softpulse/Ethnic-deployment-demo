import {CartForm} from '@shopify/hydrogen';
import { useEffect } from 'react';

export function AddToCartButton({
  title,
  lines,
  className = '',
  variant = 'primary',
  disabled,
  analytics,
  ...props
}) {

  console.log('lines', lines)
  console.log('analytics', analytics)

  useEffect(() => {},[lines , analytics])
  return (
    <CartForm
      route="/cart"
      inputs={{
        lines,
      }}
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher) => (
        <>
          <input
            type="hidden"
            name="analytics"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            variant={variant}
            className={className}
            disabled={disabled ?? fetcher.state !== 'idle'}
            {...props}
          >
            {title}
          </button>
        </>
      )}
    </CartForm>
  );
}
