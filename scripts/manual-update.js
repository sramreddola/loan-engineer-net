const fs = require('fs');
const path = require('path');

function determineTrend(current, previous) {
  if (!previous || previous === null || previous === '') return 'stable';
  const curr = parseFloat(current);
  const prev = parseFloat(previous);
  if (curr > prev) return 'up';
  if (curr < prev) return 'down';
  return 'stable';
}

function getRateChange(current, previous) {
  if (!previous || previous === null || previous === '') {
    return 0;
  }
  return parseFloat(current) - parseFloat(previous);
}

function updateRates() {
  try {
    // Read current rates.json
    const ratesPath = path.join(__dirname, '..', 'rates.json');
    const currentRates = JSON.parse(fs.readFileSync(ratesPath, 'utf8'));

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });

    // Update timestamps
    currentRates.lastUpdated = dateStr;
    currentRates.lastUpdatedTime = now.toISOString();

    // Update purchase rates
    currentRates.purchase[0] = {
      ...currentRates.purchase[0],
      rate: `${process.env.RATE_30YR}%`,
      apr: `${process.env.APR_30YR}% APR`,
      rateValue: parseFloat(process.env.RATE_30YR),
      prevRateValue: process.env.PREV_RATE_30YR ? parseFloat(process.env.PREV_RATE_30YR) : parseFloat(process.env.RATE_30YR),
      rateChange: getRateChange(process.env.RATE_30YR, process.env.PREV_RATE_30YR),
      trend: determineTrend(process.env.RATE_30YR, process.env.PREV_RATE_30YR)
    };

    currentRates.purchase[1] = {
      ...currentRates.purchase[1],
      rate: `${process.env.RATE_15YR}%`,
      apr: `${process.env.APR_15YR}% APR`,
      rateValue: parseFloat(process.env.RATE_15YR),
      prevRateValue: process.env.PREV_RATE_15YR ? parseFloat(process.env.PREV_RATE_15YR) : parseFloat(process.env.RATE_15YR),
      rateChange: getRateChange(process.env.RATE_15YR, process.env.PREV_RATE_15YR),
      trend: determineTrend(process.env.RATE_15YR, process.env.PREV_RATE_15YR)
    };

    currentRates.purchase[2] = {
      ...currentRates.purchase[2],
      rate: `${process.env.RATE_FHA}%`,
      apr: `${process.env.APR_FHA}% APR`,
      rateValue: parseFloat(process.env.RATE_FHA),
      prevRateValue: process.env.PREV_RATE_FHA ? parseFloat(process.env.PREV_RATE_FHA) : parseFloat(process.env.RATE_FHA),
      rateChange: getRateChange(process.env.RATE_FHA, process.env.PREV_RATE_FHA),
      trend: determineTrend(process.env.RATE_FHA, process.env.PREV_RATE_FHA)
    };

    // Update refi rates
    currentRates.refi[0] = {
      ...currentRates.refi[0],
      rate: `${process.env.RATE_CASHOUT}%`,
      apr: `${process.env.APR_CASHOUT}% APR`,
      rateValue: parseFloat(process.env.RATE_CASHOUT),
      prevRateValue: process.env.PREV_RATE_CASHOUT ? parseFloat(process.env.PREV_RATE_CASHOUT) : parseFloat(process.env.RATE_CASHOUT),
      rateChange: getRateChange(process.env.RATE_CASHOUT, process.env.PREV_RATE_CASHOUT),
      trend: determineTrend(process.env.RATE_CASHOUT, process.env.PREV_RATE_CASHOUT)
    };

    currentRates.refi[1] = {
      ...currentRates.refi[1],
      rate: `${process.env.RATE_NOPOINT}%`,
      apr: `${process.env.APR_NOPOINT}% APR`,
      rateValue: parseFloat(process.env.RATE_NOPOINT),
      prevRateValue: process.env.PREV_RATE_NOPOINT ? parseFloat(process.env.PREV_RATE_NOPOINT) : parseFloat(process.env.RATE_NOPOINT),
      rateChange: getRateChange(process.env.RATE_NOPOINT, process.env.PREV_RATE_NOPOINT),
      trend: determineTrend(process.env.RATE_NOPOINT, process.env.PREV_RATE_NOPOINT)
    };

    // Write updated rates back to file
    fs.writeFileSync(ratesPath, JSON.stringify(currentRates, null, 2));

    console.log('✅ Rates updated successfully!');
    console.log(`📅 Updated: ${dateStr}`);
    console.log('📊 Changes:');
    console.log(`  30-Yr Fixed: ${process.env.RATE_30YR}% (${determineTrend(process.env.RATE_30YR, process.env.PREV_RATE_30YR)})`);
    console.log(`  15-Yr Fixed: ${process.env.RATE_15YR}% (${determineTrend(process.env.RATE_15YR, process.env.PREV_RATE_15YR)})`);
    console.log(`  30-Yr FHA: ${process.env.RATE_FHA}% (${determineTrend(process.env.RATE_FHA, process.env.PREV_RATE_FHA)})`);
    console.log(`  Cash-Out: ${process.env.RATE_CASHOUT}% (${determineTrend(process.env.RATE_CASHOUT, process.env.PREV_RATE_CASHOUT)})`);
    console.log(`  No-Point: ${process.env.RATE_NOPOINT}% (${determineTrend(process.env.RATE_NOPOINT, process.env.PREV_RATE_NOPOINT)})`);

  } catch (error) {
    console.error('❌ Error updating rates:', error.message);
    process.exit(1);
  }
}

updateRates();