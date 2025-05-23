import qs from 'query-string';
interface UrlQueryParams {
	params: string;
	key: string;
	value: string | string[];
	isResetPage?: boolean;
}

interface RemoveUrlQueryParams {
	params: string;
	keysToRemove: string[];
}
export const formUrlQuery = ({
	params,
	key,
	value,
	isResetPage,
}: UrlQueryParams) => {
	const queryString = qs.parse(params);

	if (Array.isArray(value)) {
		queryString[key] = value;
	} else {
		queryString[key] = [value];
	}

	if (isResetPage) {
		queryString['page'] = '1';
	}
	return qs.stringifyUrl({
		url: window.location.pathname,
		query: queryString,
	});
};

export const removeKeysFormUrlQuery = ({
	params,
	keysToRemove,
}: RemoveUrlQueryParams) => {
	const queryString = qs.parse(params);

	keysToRemove.forEach((key) => delete queryString[key]);

	return qs.stringifyUrl(
		{
			url: window.location.pathname,
			query: queryString,
		},
		{
			skipNull: true,
		}
	);
};
