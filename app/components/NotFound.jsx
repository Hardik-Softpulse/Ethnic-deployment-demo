export function NotFound({type = 'page'}) {
  const heading = `We’ve lost this ${type}`;
  const description = `We couldn’t find the ${type} you’re looking for. Try checking the URL or heading back to the home page.`;

  return (
    <div className="all-contain-page genericError">
      <h3>{heading}</h3>
      <p>{description}</p>
      <a href="/">
        <button>Take me to the home page</button>
      </a>
    </div>
  );
}
