import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import genDiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);

test('genDiff with nested json files and "stylish" format', () => {
  const path1 = getFixturePath('file1.json');
  const path2 = getFixturePath('file2.json');
  const format = 'stylish';

  expect(genDiff(path1, path2, format)).toBe(`{
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
              - wow:${' '}
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
});

test('genDiff with nested yaml files and "stylish" format', () => {
  const path1 = getFixturePath('file1.yml');
  const path2 = getFixturePath('file2.yml');
  const format = 'stylish';

  expect(genDiff(path1, path2, format)).toBe(`{
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
              - wow:${' '}
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
});

test('genDiff with nested json files and "plain" format', () => {
  const path1 = getFixturePath('file1.json');
  const path2 = getFixturePath('file2.json');
  const format = 'plain';

  expect(genDiff(path1, path2, format)).toBe(`Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`);
});

test('genDiff with nested yaml files and "plain" format', () => {
  const path1 = getFixturePath('file1.yml');
  const path2 = getFixturePath('file2.yml');
  const format = 'plain';

  expect(genDiff(path1, path2, format)).toBe(`Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`);
});

test('genDiff with nested json files and "json" format', () => {
  const path1 = getFixturePath('file1.json');
  const path2 = getFixturePath('file2.json');
  const format = 'json';

  expect(genDiff(path1, path2, format)).toBe(
    // eslint-disable-next-line comma-dangle
    '[{"name":"common","status":"unchanged","children":[{"name":"follow","status":"added","value":false},{"name":"setting1","status":"unchanged","value":"Value 1","children":null},{"name":"setting2","status":"removed","value":200},{"name":"setting3","status":"updated","oldValue":true,"newValue":null},{"name":"setting4","status":"added","value":"blah blah"},{"name":"setting5","status":"added","value":{"key5":"value5"}},{"name":"setting6","status":"unchanged","children":[{"name":"doge","status":"unchanged","children":[{"name":"wow","status":"updated","oldValue":"","newValue":"so much"}]},{"name":"key","status":"unchanged","value":"value","children":null},{"name":"ops","status":"added","value":"vops"}]}]},{"name":"group1","status":"unchanged","children":[{"name":"baz","status":"updated","oldValue":"bas","newValue":"bars"},{"name":"foo","status":"unchanged","value":"bar","children":null},{"name":"nest","status":"updated","oldValue":{"key":"value"},"newValue":"str"}]},{"name":"group2","status":"removed","value":{"abc":12345,"deep":{"id":45}}},{"name":"group3","status":"added","value":{"deep":{"id":{"number":45}},"fee":100500}}]'
  );
});

test('genDiff with nested yaml files and "json" format', () => {
  const path1 = getFixturePath('file1.yml');
  const path2 = getFixturePath('file2.yml');
  const format = 'json';

  expect(genDiff(path1, path2, format)).toBe(
    // eslint-disable-next-line comma-dangle
    '[{"name":"common","status":"unchanged","children":[{"name":"follow","status":"added","value":false},{"name":"setting1","status":"unchanged","value":"Value 1","children":null},{"name":"setting2","status":"removed","value":200},{"name":"setting3","status":"updated","oldValue":true,"newValue":null},{"name":"setting4","status":"added","value":"blah blah"},{"name":"setting5","status":"added","value":{"key5":"value5"}},{"name":"setting6","status":"unchanged","children":[{"name":"doge","status":"unchanged","children":[{"name":"wow","status":"updated","oldValue":"","newValue":"so much"}]},{"name":"key","status":"unchanged","value":"value","children":null},{"name":"ops","status":"added","value":"vops"}]}]},{"name":"group1","status":"unchanged","children":[{"name":"baz","status":"updated","oldValue":"bas","newValue":"bars"},{"name":"foo","status":"unchanged","value":"bar","children":null},{"name":"nest","status":"updated","oldValue":{"key":"value"},"newValue":"str"}]},{"name":"group2","status":"removed","value":{"abc":12345,"deep":{"id":45}}},{"name":"group3","status":"added","value":{"deep":{"id":{"number":45}},"fee":100500}}]'
  );
});
