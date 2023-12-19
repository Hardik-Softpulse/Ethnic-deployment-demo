import {CartForm} from '@shopify/hydrogen';

export function AddToCartButton({
  title,
  lines,
  className = '',
  variant = 'primary',
  disabled,
  analytics,
  ...props
}) {

  const handleSubmit = () => {
    window.location.reload();
  };

  return (
    <CartForm
      route="/cart"
      inputs={{
        lines,
      }}
      action={CartForm.ACTIONS.LinesAdd}
      onSubmit={handleSubmit}
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
