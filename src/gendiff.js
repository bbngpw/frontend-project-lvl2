import { readFileSync } from 'fs';
import _ from 'lodash';
import parseFile from './parsers.js';

const compareObjects = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = _.sortBy(_.union(keys1, keys2));

  const diffs = allKeys.map((key) => {
    if (!_.has(obj1, key)) {
      return `  + ${key}: ${obj2[key]}`;
    }
    if (!_.has(obj2, key)) {
      return `  - ${key}: ${obj1[key]}`;
    }
    if (obj1[key] === obj2[key]) {
      return `    ${key}: ${obj1[key]}`;
    }
    return `  - ${key}: ${obj1[key]}\n  + ${key}: ${obj2[key]}`;
  });

  return ['{', ...diffs, '}'].join('\n');
};

const genDiff = (filepath1, filepath2) => {
  const content1 = readFileSync(filepath1);
  const content2 = readFileSync(filepath2);

  const object1 = parseFile(content1, filepath1);
  const object2 = parseFile(content2, filepath2);

  return compareObjects(object1, object2);
};

export default genDiff;
