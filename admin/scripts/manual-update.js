const fs = require('fs');
const path = require('path');

// Read environment variables from GitHub Actions
const rates = {
  rate_30yr: parseFloat(process.env.RATE_30YR),
  apr_30yr: parseFloat(process.env.APR_30YR),
  prev_rate_30yr: process.env.PREV_RATE_30YR ? parseFloat(process.env.PREV_RATE_30YR) : parseFloat(process.env.RATE_30YR),
  rate_15yr: parseFloat(process.env.RATE_15YR),
  apr_15yr: parseFloat(process.env.APR_15YR),
  prev_rate_15yr: process.env.PREV_RATE_15YR ? parseFloat(process.env.PREV_RATE_15YR) : parseFloat(process.env.RATE_15YR),
  rate_fha: parseFloat(process.env.RATE_FHA),
  apr_fha: parseFloat(process.env.APR_FHA),
  prev_rate_fha: process.env.PREV_RATE_FHA ? parseFloat(process.env.PREV_RATE_FHA) : parseFloat(process.env.RATE_FHA),
  rate_cashout: parseFloat(process.env.RATE_CASHOUT),
  apr_cashout: parseFloat(process.env.APR_CASHOUT),
  prev_rate_cashout: process.env.PREV_RATE_CASHOUT ? parseFloat(process.env.PREV_RATE_CASHOUT) : parseFloat(process.env.RATE_CASHOUT),
  rate_nopoint: parseFloat(process.env.RATE_NOPOINT),
  apr_nopoint: parseFloat(process.env.APR_NOPOINT),
  prev_rate_nopoint: process.env.PREV_RATE_NOPOINT ? parseFloat(process.env.PREV_RATE_NOPOINT) : parseFloat(process.env.RATE_NOPOINT)
};

// Helper function to determine trend
function determineTrend(current, previous) {
  const diff = parseFloat((current - previous).toFixed(3));
  if (diff > 0) return 'up';
  if (diff < 0) return 'down';
  return 'stable';
}

// Helper function to calculate rate change
function calculateChange(current, previous) {
  return parseFloat((current - previous).toFixed(3));
}

// Generate timestamps
const now = new Date();
const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const isoStr = now.toISOString();

// Read existing rates.json
const ratesFilePath = path.join(__dirname, '..', 'rates.json');
const existingData = JSON.parse(fs.readFileSync(ratesFilePath, 'utf8'));

// Update purchase rates
const updatedData = {
  lastUpdated: dateStr,
  lastUpdatedTime: isoStr,
  updateFrequency: existingData.updateFrequency || 'Updated daily by 9 AM ET',
  purchase: [
    {
      label: '30-Yr Fixed',
      tag: 'Conventional',
      tagClass: 'bg-blue-100 text-blue-700',
      sub: '0 Points',
      rate: `${rates.rate_30yr}%`,
      apr: `${rates.apr_30yr}% APR`,
      rateValue: rates.rate_30yr,
      term: 30,
      prevRateValue: rates.prev_rate_30yr,
      rateChange: calculateChange(rates.rate_30yr, rates.prev_rate_30yr),
      trend: determineTrend(rates.rate_30yr, rates.prev_rate_30yr),
      avg30day: existingData.purchase[0]?.avg30day || rates.rate_30yr,
      marketAvg: existingData.purchase[0]?.marketAvg || rates.rate_30yr
    },
    {
      label: '15-Yr Fixed',
      tag: 'Aggressive',
      tagClass: 'bg-purple-100 text-purple-700',
      sub: 'Pay off faster',
      rate: `${rates.rate_15yr}%`,
      apr: `${rates.apr_15yr}% APR`,
      rateValue: rates.rate_15yr,
      term: 15,
      prevRateValue: rates.prev_rate_15yr,
      rateChange: calculateChange(rates.rate_15yr, rates.prev_rate_15yr),
      trend: determineTrend(rates.rate_15yr, rates.prev_rate_15yr),
      avg30day: existingData.purchase[1]?.avg30day || rates.rate_15yr,
      marketAvg: existingData.purchase[1]?.marketAvg || rates.rate_15yr
    },
    {
      label: '30-Yr FHA',
      tag: 'Govt.',
      tagClass: 'bg-green-100 text-green-700',
      sub: 'Low Down Pmt',
      rate: `${rates.rate_fha}%`,
      apr: `${rates.apr_fha}% APR`,
      rateValue: rates.rate_fha,
      term: 30,
      prevRateValue: rates.prev_rate_fha,
      rateChange: calculateChange(rates.rate_fha, rates.prev_rate_fha),
      trend: determineTrend(rates.rate_fha, rates.prev_rate_fha),
      avg30day: existingData.purchase[2]?.avg30day || rates.rate_fha,
      marketAvg: existingData.purchase[2]?.marketAvg || rates.rate_fha
    }
  ],
  refi: [
    {
      label: 'Cash-Out',
      tag: 'Consolidate',
      tagClass: 'bg-orange-100 text-orange-700',
      sub: 'Max 80% LTV',
      rate: `${rates.rate_cashout}%`,
      apr: `${rates.apr_cashout}% APR`,
      rateValue: rates.rate_cashout,
      term: 30,
      prevRateValue: rates.prev_rate_cashout,
      rateChange: calculateChange(rates.rate_cashout, rates.prev_rate_cashout),
      trend: determineTrend(rates.rate_cashout, rates.prev_rate_cashout),
      avg30day: existingData.refi[0]?.avg30day || rates.rate_cashout,
      marketAvg: existingData.refi[0]?.marketAvg || rates.rate_cashout
    },
    {
      label: 'No-Point Refi',
      tag: 'No Lender Fees',
      tagClass: 'bg-white text-green-700 border border-green-100',
      sub: 'We pay title & lender fees',
      rate: `${rates.rate_nopoint}%`,
      apr: `${rates.apr_nopoint}% APR`,
      featured: true,
      rateValue: rates.rate_nopoint,
      term: 30,
      prevRateValue: rates.prev_rate_nopoint,
      rateChange: calculateChange(rates.rate_nopoint, rates.prev_rate_nopoint),
      trend: determineTrend(rates.rate_nopoint, rates.prev_rate_nopoint),
      avg30day: existingData.refi[1]?.avg30day || rates.rate_nopoint,
      marketAvg: existingData.refi[1]?.marketAvg || rates.rate_nopoint
    }
  ]
};

// Write updated rates to file
fs.writeFileSync(ratesFilePath, JSON.stringify(updatedData, null, 2));

console.log('✅ Rates updated successfully!');
console.log(`\n📊 Updated Rates (${dateStr}):`);
console.log('\nPurchase Rates:');
updatedData.purchase.forEach(p => {
  console.log(`  ${p.label}: ${p.rate} (Change: ${p.rateChange > 0 ? '+' : ''}${p.rateChange}, Trend: ${p.trend})`);
});
console.log('\nRefinance Rates:');
updatedData.refi.forEach(r => {
  console.log(`  ${r.label}: ${r.rate} (Change: ${r.rateChange > 0 ? '+' : ''}${r.rateChange}, Trend: ${r.trend})`);
});
