import { readFileSync } from 'fs';
import _ from 'lodash';
import parseFile from './parsers.js';

const compareObjects = (obj1, obj2) => {
  const getKeyDiff = (key) => {
    if (!_.has(obj1, key)) {
      return { name: key, status: 'added', value: obj2[key] };
    }
    if (!_.has(obj2, key)) {
      return { name: key, status: 'deleted', value: obj1[key] };
    }
    const value1 = obj1[key];
    const value2 = obj2[key];
    if (_.isObject(value1) && _.isObject(value2)) {
      return {
        name: key,
        status: 'commonParent',
        children: compareObjects(value1, value2),
      };
    }
    if (_.isObject(value1) || _.isObject(value2) || value1 !== value2) {
      return [
        { name: key, status: 'deleted', value: value1 },
        { name: key, status: 'added', value: value2 },
      ];
    }
    return { name: key, status: 'unchanged', value: value1 };
  };

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = _.sortBy(_.union(keys1, keys2));

  return allKeys.flatMap(getKeyDiff);
};

const statusToSymbol = {
  added: '+',
  deleted: '-',
  unchanged: ' ',
  commonParent: ' ',
};

const formatKey = (key, value, depth, status) => {
  const indent = ' '.repeat(depth * 4);
  const bracketIndent = ' '.repeat((depth + 1) * 4);

  if (!_.isObject(value)) {
    return `${indent}    ${key}: ${value}`;
  }
  const keys = Object.keys(value);
  const subLines = keys.flatMap((subKey) => formatKey(subKey, value[subKey], depth + 1, ' '));
  return [`${indent}  ${status} ${key}: {`, ...subLines, bracketIndent.concat('}')];
};

const formatStylish = (diff) => {
  const formatIter = (nodes, depth = 0) => {
    // console.log('nodes: ', JSON.stringify(nodes, null, 4));
    const newDepth = depth + 1;
    const indent = ' '.repeat(depth * 4);
    const newIndent = ' '.repeat(newDepth * 4);

    const keys = nodes.flatMap((key) => {
      // console.log(key);
      const status = statusToSymbol[key.status];
      const lineStart = `${indent}  ${status} ${key.name}: `;

      if (key.status === 'commonParent') {
        const children = formatIter(key.children, newDepth);
        return [lineStart.concat('{'), ...children, newIndent.concat('}')];
      }

      if (_.isObject(key.value)) {
        return formatKey(key.name, key.value, depth, status);
      }

      return `${lineStart}${key.value}`;
    });

    return keys.map((key) => key.trimEnd());
  };
  return ['{', ...formatIter(diff), '}'].join('\n');
};

const formatDiff = (diff, format) => {
  switch (format) {
    case 'stylish':
      return formatStylish(diff);
    default:
      return '';
  }
};

const genDiff = (filepath1, filepath2) => {
  const content1 = readFileSync(filepath1);
  const content2 = readFileSync(filepath2);

  const object1 = parseFile(content1, filepath1);
  const object2 = parseFile(content2, filepath2);

  const diff = compareObjects(object1, object2);
  return formatDiff(diff);
};

export default genDiff;
