import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import genDiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);

test('genDiff with nested json files', () => {
  const path1 = getFixturePath('file1.json');
  const path2 = getFixturePath('file2.json');

  expect(genDiff(path1, path2)).toBe(`{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow:
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`);

  expect(genDiff(path2, path1)).toBe(`{
    common: {
      - follow: false
        setting1: Value 1
      + setting2: 200
      - setting3: null
      + setting3: true
      - setting4: blah blah
      - setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: so much
              + wow:
            }
            key: value
          - ops: vops
        }
    }
    group1: {
      - baz: bars
      + baz: bas
        foo: bar
      - nest: str
      + nest: {
            key: value
        }
    }
  + group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  - group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`);

  expect(genDiff(path1, path1)).toBe(`{
    common: {
        setting1: Value 1
        setting2: 200
        setting3: true
        setting6: {
            doge: {
                wow:
            }
            key: value
        }
    }
    group1: {
        baz: bas
        foo: bar
        nest: {
            key: value
        }
    }
    group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
}`);
});

test('genDiff with nested yaml files', () => {
  const path1 = getFixturePath('file1.yml');
  const path2 = getFixturePath('file2.yml');

  expect(genDiff(path1, path2)).toBe(`{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow:
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`);

  expect(genDiff(path2, path1)).toBe(`{
    common: {
      - follow: false
        setting1: Value 1
      + setting2: 200
      - setting3: null
      + setting3: true
      - setting4: blah blah
      - setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: so much
              + wow:
            }
            key: value
          - ops: vops
        }
    }
    group1: {
      - baz: bars
      + baz: bas
        foo: bar
      - nest: str
      + nest: {
            key: value
        }
    }
  + group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  - group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`);

  expect(genDiff(path1, path1)).toBe(`{
    common: {
        setting1: Value 1
        setting2: 200
        setting3: true
        setting6: {
            doge: {
                wow:
            }
            key: value
        }
    }
    group1: {
        baz: bas
        foo: bar
        nest: {
            key: value
        }
    }
    group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
}`);
});
