import {CartForm} from '@shopify/hydrogen';

export function AddToCartButton({
  lines,
  className = '',
  variant = 'primary',
  disabled,
  analytics,
  ...props
}) {
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
            className="btn btn-full add-cart-btn lp-0"
            disabled={disabled ?? fetcher.state !== 'idle'}
            {...props}
          >
            Add to cart
          </button>
        </>
      )}
    </CartForm>
  );
}
