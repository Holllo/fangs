import test from 'ava';

import Bang, {BangParameters} from '../source/bang/bang';

test('Bang.parseId', (t) => {
  const samples: Array<[string, string | undefined]> = [
    ['test!example', '!example'],
    ['test !example', '!example'],
    ['!example test', '!example'],
    ['!!example!test', '!example'],
    ['test!1', '!1'],
    ['test !1', '!1'],
    ['!1 test', '!1'],
    ['example', undefined],
    ['example!', undefined],
    ['example!_', undefined],
    ['example! ', undefined],
    ['example!%20', undefined],
  ];

  for (const [input, expected] of samples) {
    t.is(Bang.parseId(input), expected);
  }
});

test('Bang.parseParameters', (t) => {
  const example: BangParameters = {
    baseUrl: 'https://example.org',
    id: '!example',
    name: 'Example',
    searchUrl: 'https://example.org/?search={{bang}}',
  };

  const samples: Array<[string, BangParameters, string]> = [
    ['!example', example, example.baseUrl],
    ['test!example', example, 'https://example.org/?search=test'],
    ['test !example', example, 'https://example.org/?search=test'],
    ['!example test', example, 'https://example.org/?search=test'],
    ['  !example  test  ', example, 'https://example.org/?search=test'],
    ['test !!example ', example, 'https://example.org/?search=test !'],
    ['test ! !example ', example, 'https://example.org/?search=test !'],
  ];

  for (const [input, parameters, expected] of samples) {
    const bang = Bang.parseParameters(input, parameters);
    t.is(bang.destination, encodeURI(expected));
  }
});

test('Bang.validate', (t) => {
  const empty: BangParameters = {
    baseUrl: '',
    id: '',
    name: '',
    searchUrl: '',
  };

  const samples: BangParameters[] = [
    {
      ...empty,
    },
    {
      ...empty,
      name: 'Example',
    },
    {
      ...empty,
      name: 'Example',
      id: '!',
    },
    {
      ...empty,
      name: 'Example',
      id: '!example',
    },
    {
      ...empty,
      name: 'Example',
      id: '!example',
      baseUrl: 'https://example.org',
    },
    {
      name: 'Example',
      id: '!example',
      baseUrl: 'https://example.org',
      searchUrl: 'https://example.org/?search=',
    },
  ];

  for (const sample of samples) {
    const error = t.throws(() => Bang.validate(sample));
    t.true(error instanceof Error);
    t.true(error?.message.startsWith('Bang'));
  }

  t.true(
    Bang.validate({
      ...empty,
      name: 'Example',
      id: '!example',
      baseUrl: 'https://example.org',
      searchUrl: 'https://example.org/?search={{bang}}',
    }),
  );
});
