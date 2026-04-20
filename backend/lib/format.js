export function formatINR(amount) {
  const num = Number(amount);
  const intPart = num.toFixed(0);
  const lastThree = intPart.slice(-3);
  const rest = intPart.slice(0, -3);
  const formatted = rest.length > 0
    ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
    : lastThree;
  return 'Rs.' + formatted;
}

export function returnPct(invested, current) {
  if (!invested || invested === 0) return 0;
  return (((current - invested) / invested) * 100).toFixed(2);
}
