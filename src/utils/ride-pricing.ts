export const getAgeCategory = (age: number) => {
	if (age < 5) return 0;
	if (age < 13) return 1;
	if (age < 40) return 2;
	if (age < 64) return 3;
	if (age < 88) return 4;
	if (age < 104) return 5;
	if (age < 120) return 6;
	if (age < 128) return 7;
	if (age < 200) return 8;
	return 9;
};

export const getBestPrice = (age: number, maxPrices: number[]) => {
	const ageCategory = getAgeCategory(age || 0);
	return (maxPrices?.[ageCategory] || 0) * 10;
}

export const getLongTermPrice = (age: number, maxPrices: number[]) => {
	const ageCategory = getAgeCategory(age || 0);
	const longTermAgeCategory =
		ageCategory === 7 || ageCategory === 8 ? ageCategory : ageCategory === 0 ? 2 : ageCategory + 1;
	return (maxPrices?.[longTermAgeCategory] || 0) * 10;
}
