function calculateAmount(play, perf) {
  let result = 0;
  switch (play.type) {
    case 'tragedy':
      result = 40000;
      if (perf.audience > 30) {
        result += 1000 * (perf.audience - 30);
      }
      break;
    case 'comedy':
      result = 30000;
      if (perf.audience > 20) {
        result += 10000 + 500 * (perf.audience - 20);
      }
      result += 300 * perf.audience;
      break;
      default:
        throw new Error(`unknown type: ${play.type}`);
  }
  return result;
}

function totalAmount(invoice, plays){
  let totalAmount = 0;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = calculateAmount(play, perf);
    totalAmount += thisAmount;
  }
  return totalAmount;
}

function volumeCredits(invoice, plays){
  let volumeCredits = 0;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    volumeCredits += Math.max(perf.audience - 30, 0);
    if ('comedy' === play.type) volumeCredits += Math.floor(perf.audience / 5);
  }
  return volumeCredits;
}

function formatData(thisAmount){
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(thisAmount / 100);
}

function createData(invoice, plays){
  let data = {};
  data.invoice = invoice;
  data.plays = plays;
  data.customer = invoice.customer;
  data.totalAmount = formatData(totalAmount(invoice, plays));
  data.volumeCredits = volumeCredits(invoice, plays);
  data.performances = []
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = calculateAmount(play, perf);
    data.performances.push({
      name:play.name,
      thisAmount:formatData(thisAmount),
      audience:perf.audience
    })
  }
  return data;
}

function generateTxt(data) {
  let result = `Statement for ${data.customer}\n`;
  for (let perf of data.performances) {
    result += ` ${perf.name}: ${perf.thisAmount} (${perf.audience} seats)\n`;
  }
  result += `Amount owed is ${formatData(totalAmount(data.invoice, data.plays))}\n`;
  result += `You earned ${volumeCredits(data.invoice, data.plays)} credits \n`;
  return result;
}

function generateHTML(data) {
  let result = `<h1>Statement for ${data.customer}</h1>\n`;
  result += '<table>\n';
  result += '<tr><th>play</th><th>seats</th><th>cost</th></tr>';
  for (let perf of data.performances) {
    result += ` <tr><td>${perf.name}</td><td>${perf.audience}</td><td>${perf.thisAmount}</td></tr>\n`;
  }
  result += '</table>\n';
  result += `<p>Amount owed is <em>${formatData(totalAmount(data.invoice, data.plays))}</em></p>\n`;
  result += `<p>You earned <em>${volumeCredits(data.invoice, data.plays)}</em> credits</p> \n`;
  return result;
}

function statement (invoice, plays) {
  return generateTxt(createData(invoice, plays));
}

function HTMLStatement (invoice, plays) {
  return generateHTML(createData(invoice, plays));
}

module.exports = {
  statement,HTMLStatement
};
