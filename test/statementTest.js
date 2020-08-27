const test = require('ava');
const {statement} = require('../src/statement');

const plays = {
  'hamlet': {
    'name': 'Hamlet',
    'type': 'tragedy',
  },
  'as-like': {
    'name': 'As You Like It',
    'type': 'comedy',
  },
  'othello': {
    'name': 'Othello',
    'type': 'tragedy',
  },
};

test('Customer BigCo without performances', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [],
  };

  const result = statement(invoice, plays);

  const expectResult = 'Statement for BigCo\n' +
      'Amount owed is $0.00\n' +
      'You earned 0 credits \n';

  t.is(result,expectResult);
});

test('Sample test2', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 30,
      },
    ],
  };

  const result = statement(invoice, plays);

  const expectResult = 'Statement for BigCo\n' +
      ' Hamlet: $400.00 (30 seats)\n' +
      'Amount owed is $400.00\n' +
      'You earned 0 credits \n';

  t.is(result,expectResult);
});

test('Sample test3', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 31,
      },
    ],
  };

  const result = statement(invoice, plays);

  const expectResult = 'Statement for BigCo\n' +
      ' Hamlet: $410.00 (31 seats)\n' +
      'Amount owed is $410.00\n' +
      'You earned 1 credits \n';

  t.is(result,expectResult);
});

test('Sample test4', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'as-like',
        'audience': 20,
      },
    ],
  };

  const result = statement(invoice, plays);

  const expectResult = 'Statement for BigCo\n' +
      ' As You Like It: $360.00 (20 seats)\n' +
      'Amount owed is $360.00\n' +
      'You earned 4 credits \n';

  t.is(result,expectResult);
});

test('Sample test5', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'as-like',
        'audience': 21,
      },
    ],
  };

  const result = statement(invoice, plays);

  const expectResult = 'Statement for BigCo\n' +
      ' As You Like It: $468.00 (21 seats)\n' +
      'Amount owed is $468.00\n' +
      'You earned 4 credits \n';

  t.is(result,expectResult);
});

test('Sample test6', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 55,
      },
      {
        'playID': 'as-like',
        'audience': 35,
      },
      {
        'playID': 'othello',
        'audience': 40,
      },
    ],
  };

  const result = statement(invoice, plays);

  const expectResult = 'Statement for BigCo\n' +
      ' Hamlet: $650.00 (55 seats)\n' +
      ' As You Like It: $580.00 (35 seats)\n' +
      ' Othello: $500.00 (40 seats)\n' +
      'Amount owed is $1,730.00\n' +
      'You earned 47 credits \n';

  t.is(result,expectResult);
});

test('Sample test7', t => {
  //given
  const plays = {
    'othello': {
      'name': 'Othello',
      'type': 'tragedy1',
    },
  };

  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'othello',
        'audience': 40,
      },
    ],
  };

  const expectResult = 'unknown type: tragedy1';

  try{
    statement(invoice, plays);
    t.fail();
  }
  catch (e){
    t.is(e.message,expectResult);
  }
});