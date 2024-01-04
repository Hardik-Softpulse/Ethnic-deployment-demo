import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from '@remix-run/react';


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
  if (filter.urlParam.key === 'variantOption') {
    const variantOptions = paramsClone.getAll('variantOption');
    const filteredVariantOptions = variantOptions.filter(
      (options) => !options.includes(filter.urlParam.value),
    );
    paramsClone.delete(filter.urlParam.key);
    for (const filteredVariantOption of filteredVariantOptions) {
      paramsClone.append(filter.urlParam.key, filteredVariantOption);
    }
  } else {
    paramsClone.delete(filter.urlParam.key);
  }
  return `${location.pathname}?${paramsClone.toString()}`;
}


function getFilterLink(filter, rawInput, params, location) {
  const paramsClone = new URLSearchParams(params);
  const newParams = filterInputToParams(filter.type, rawInput, paramsClone);
  return `${location.pathname}?${newParams.toString()}`;
}

function filterInputToParams(type, rawInput, params) {
  const input = typeof rawInput === 'string' ? JSON.parse(rawInput) : rawInput;
  switch (type) {
    case 'PRICE_RANGE':
      if (input.price.min) params.set('minPrice', input.price.min);
      if (input.price.max) params.set('maxPrice', input.price.max);
      break;
    case 'LIST':
      Object.entries(input).forEach(([key, value]) => {
        if (typeof value === 'string') {
          params.set(key, value);
        } else if (typeof value === 'boolean') {
          params.set(key, value.toString());
        } else {
          const {name, value: val} = value;
          const allVariants = params.getAll(`variantOption`);
          const newVariant = `${name}:${val}`;
          if (!allVariants.includes(newVariant)) {
            params.append('variantOption', newVariant);
          }
        }
      });
      break;
  }

  return params;
}