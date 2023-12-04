import {FeaturedSection} from './FeaturedSection';

export function GenericError({error}) {
  const heading = `Something’s wrong here.`;
  let description = `We found an error while loading this page.`;

  if (error) {
    description += `\n${error.message}`;
    console.error(error);
  }

  return (
    <div className="all-contain-page genericError">
      <div className="error-contain"> 
        <h3>{heading}</h3>
        <p>{description}</p>
        {error?.stack && (
          <pre
            style={{
              padding: '2rem',
              background: 'hsla(10, 50%, 50%, 0.1)',
              color: 'red',
              overflow: 'auto',
              maxWidth: '100%',
            }}
            dangerouslySetInnerHTML={{
              __html: addLinksToStackTrace(error.stack),
            }}
          />
        )}
        <button width="auto" variant="secondary" to={'/'}>
          Take me to the home page
        </button>
      </div>
      <FeaturedSection />
    </div>
  );
}

function addLinksToStackTrace(stackTrace) {
  return stackTrace?.replace(
    /^\s*at\s?.*?[(\s]((\/|\w\:).+)\)\n/gim,
    (all, m1) =>
      all.replace(
        m1,
        `<a href="vscode://file${m1}" className="hover:underline">${m1}</a>`,
      ),
  );
}
