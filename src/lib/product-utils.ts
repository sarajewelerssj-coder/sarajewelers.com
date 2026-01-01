export const calculateDisplayPrice = (basePrice: number, variations: any) => {
  if (basePrice > 0) return basePrice;
  if (!variations) return basePrice;

  let minPrice = Infinity;
  let hasPricedVariations = false;

  Object.values(variations).forEach((varType: any) => {
    if (Array.isArray(varType)) {
      varType.forEach((option: any) => {
        if (typeof option === 'object' && typeof option.price === 'number') {
          if (option.price > 0 && option.price < minPrice) {
            minPrice = option.price;
            hasPricedVariations = true;
          }
        }
      });
    }
  });

  if (hasPricedVariations && minPrice !== Infinity) {
    return minPrice;
  }

  return basePrice;
};
