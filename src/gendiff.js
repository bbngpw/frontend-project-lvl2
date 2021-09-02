import { readFileSync } from 'fs';
import { extname } from 'path';
import _ from 'lodash';
import { load as loadYaml } from 'js-yaml';

const readFile = (filePath) => {
  const content = readFileSync(filePath);
  return { content, path: filePath };
};

const parseFile = (file) => {
  let parsedContent = {};
  const ext = extname(file.path);
  if (ext.toLowerCase() === '.json') {
    parsedContent = JSON.parse(file.content);
  }
  if (ext.toLowerCase() === '.yaml' || ext.toLowerCase() === '.yml') {
    parsedContent = loadYaml(file.content);
  }
  return parsedContent;
};

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
  const file1 = readFile(filepath1);
  const file2 = readFile(filepath2);

  const object1 = parseFile(file1);
  const object2 = parseFile(file2);

  return compareObjects(object1, object2);
};

export default genDiff;
