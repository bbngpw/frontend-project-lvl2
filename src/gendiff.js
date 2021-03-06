import { readFileSync } from 'fs';
import _ from 'lodash';
import parseFile from './parsers.js';
import formatDiff from './formatters/index.js';

const compareObjects = (obj1, obj2) => {
  const getKeyDiff = (key) => {
    if (!_.has(obj1, key)) {
      return { name: key, status: 'added', value: obj2[key] };
    }
    if (!_.has(obj2, key)) {
      return { name: key, status: 'removed', value: obj1[key] };
    }
    const value1 = obj1[key];
    const value2 = obj2[key];
    if (_.isObject(value1) && _.isObject(value2)) {
      return {
        name: key,
        status: 'unchanged',
        children: compareObjects(value1, value2),
      };
    }
    if (_.isObject(value1) || _.isObject(value2) || value1 !== value2) {
      return {
        name: key,
        status: 'updated',
        oldValue: value1,
        newValue: value2,
      };
    }
    return {
      name: key,
      status: 'unchanged',
      value: value1,
      children: null,
    };
  };

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = _.sortBy(_.union(keys1, keys2));

  return allKeys.map(getKeyDiff);
};

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const content1 = readFileSync(filepath1);
  const content2 = readFileSync(filepath2);

  const object1 = parseFile(content1, filepath1);
  const object2 = parseFile(content2, filepath2);

  const diff = compareObjects(object1, object2);
  return formatDiff(diff, format);
};

export default genDiff;
