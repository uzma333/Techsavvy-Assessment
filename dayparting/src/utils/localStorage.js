export const getAuthHeader = () => {
	const user = JSON.parse(localStorage.getItem('user') ?? '{}');
	const token = user.token;
	if (!token) return '';
	return `Bearer ${token}`;
};

export const getUserIdentity = () => {
	const user = JSON.parse(localStorage.getItem('user') ?? '{}');
	const identity = user.identity;
	if (!identity) return '';
	return identity;
};

export const getUserFullName = () => {
	const user = JSON.parse(localStorage.getItem('user') ?? '{}');
	const fullName = user.fullName;
	if (!fullName) return '';
	return fullName;
};
