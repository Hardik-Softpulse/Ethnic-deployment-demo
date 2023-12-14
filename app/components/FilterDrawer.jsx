import {useEffect, useMemo, useState} from 'react';
import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from '@remix-run/react';

export const FILTER_URL_PREFIX = 'filter.';

export function FilterDrawer({
  filters,
  collection,
  appliedFilters = [],
  filterDrawerOpen,
  setFilterDrawerOpen,
}) {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState([]);

  console.log('selectedOptions', selectedOptions);

  return (
    <div className={`filter-drawer  ${filterDrawerOpen ? 'open' : ''}`}>
      <div className=" filter-container">
        <div className="filter-header">
          <h2 className="page-title text-up">Filter</h2>
          <span
            className="close_icon"
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M2.28167 0.391468C1.7597 -0.130489 0.913438 -0.130489 0.391468 0.391468C-0.130489 0.913438 -0.130489 1.7597 0.391468 2.28167L8.10978 9.99996L0.391548 17.7182C-0.130409 18.2402 -0.130409 19.0865 0.391548 19.6084C0.913518 20.1303 1.75978 20.1303 2.28174 19.6084L9.99996 11.8901L17.7182 19.6084C18.2402 20.1303 19.0865 20.1303 19.6084 19.6084C20.1303 19.0865 20.1303 18.2402 19.6084 17.7182L11.8901 9.99996L19.6086 2.28167C20.1305 1.7597 20.1305 0.913438 19.6086 0.391468C19.0866 -0.130489 18.2403 -0.130489 17.7184 0.391468L9.99996 8.10978L2.28167 0.391468Z"
                fill="black"
              ></path>
            </svg>
          </span>
        </div>
        <div className="filter-content">
          <div className="filter-item-list">
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
                                  // checked={
                                  //   appliedFilters?.some(
                                  //     (obj) => obj.label === option.label,
                                  //   )
                                  //     ? true
                                  //     : false
                                  // }
                                  name={filter.id}
                                  id={option.id}
                                  // onChange={() => navigate(to)}
                                  onChange={() =>
                                    setSelectedOptions(
                                      (prevSelectedOptions) => [
                                        ...prevSelectedOptions,
                                        {
                                          filterId: filter.id,
                                          optionInput: option.input,
                                        },
                                      ],
                                    )
                                  }
                                 
                                />
                                <label htmlFor={option.id}>
                                  {option.label}
                                </label>
                              </div>
                            );
                          })}
                        </form>
                      </div>
                    </div>
                  ),
              )}
            </div>
          </div>
        </div>
        <div className="filter-footer">
          <a
            href={`/collections/${collection.handle}`}
            className="remove_link"
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
          >
            Remove All
          </a>

          <button
            className="btn"
            onClick={() => {
              const navigationPromises = filters.flatMap((filter) =>
                filter.values
                  .filter((option) => option.input)
                  .map((option) => (
                    <>
                      {selectedOptions.map((selectOption) => {
                        const objectInput = selectOption.optionInput;
                        const to = getFilterLink(
                          filter,
                          objectInput,
                          params,
                          location,
                        );
                        navigate(to);
                      })}
                    </>
                  )),
              );
             
                setFilterDrawerOpen(!filterDrawerOpen);
             
            }}
          >
            Apply
          </button>
        </div>
      </div>
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
