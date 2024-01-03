import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from '@remix-run/react';

export const FILTER_URL_PREFIX = 'filter.';

export function SortFilter({filters, appliedFilters = []}) {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="cllctn-sidebar">
      <h3 className="text-up lp-05">Filter</h3>
      <div className="appliedfilter">
        {appliedFilters.length > 0 ? (
          <AppliedFilters filters={appliedFilters} />
        ) : null}
      </div>
      {filters.map(
        (filter) =>
          filter.values.length > 0 &&
          filter.label !== 'Price' && (
            <div className="filter-option" key={filter.id}>
              <h6 className="filter-title">{filter.label}</h6>
              <div className="filter-list clearfix">
                <form>
                  {filter.values?.map((option) => {
                    const to = getFilterLink(
                      filter,
                      option.input,
                      params,
                      location,
                    );

                    return (
                      <div className="filter-item" key={option.id}>
                        <input
                          type="checkbox"
                          checked={
                            appliedFilters?.some(
                              (obj) => obj.label === option.label,
                            )
                              ? true
                              : false
                          }
                          name={filter.id}
                          id={option.id}
                          onChange={() => navigate(to)}
                        />
                        <label htmlFor={option.id}>{option.label}</label>
                      </div>
                    );
                  })}
                </form>
              </div>
            </div>
          ),
      )}
    </div>
  );
}

function AppliedFilters({filters = []}) {
  const [params] = useSearchParams();
  const location = useLocation();
  return (
    <>
      {filters.map((filter) => {
        return (
          <Link
            to={getAppliedFilterLink(filter, params, location)}
            className="reset-act"
            key={`${filter.label}-${filter.urlParam}`}
          >
            reset {filter.label}
          </Link>
        );
      })}
    </>
  );
}

function getAppliedFilterLink(filter, params, location) {
  const paramsClone = new URLSearchParams(params);
  Object.entries(filter.filter).forEach(([key, value]) => {
    const fullKey = FILTER_URL_PREFIX + key;
    paramsClone.delete(fullKey, JSON.stringify(value));
  });
  return `${location.pathname}?${paramsClone.toString()}`;
}

function getFilterLink(filter, rawInput, params, location) {
  const paramsClone = new URLSearchParams(params);
  const newParams = filterInputToParams(filter.type, rawInput, paramsClone);
  return `${location.pathname}?${newParams.toString()}`;
}

function filterInputToParams(type, rawInput, params) {
  const input = typeof rawInput === 'string' ? JSON.parse(rawInput) : rawInput;

  Object.entries(input).forEach(([key, value]) => {
    if (params.has(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value))) {
      return;
    }
    if (key === 'price') {
      // For price, we want to overwrite
      params.set(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value));
    } else {
      params.append(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value));
    }
  });

  return params;
}
