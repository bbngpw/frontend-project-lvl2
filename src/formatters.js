import _ from 'lodash';

const statusToSymbol = {
  added: '+',
  removed: '-',
  unchanged: ' ',
};

const formatComplexValue = (key, value, depth) => {
  const indent = ' '.repeat(depth * 4);
  if (!_.isObject(value)) {
    return `${indent}    ${key}: ${value}`;
  }
  const lines = Object.keys(value).flatMap((innerKey) => {
    const innerValue = value[innerKey];
    return formatComplexValue(innerKey, innerValue, depth + 1);
  });
  const bracketIndent = ' '.repeat((depth + 1) * 4);
  return [`${indent}    ${key}: {`, ...lines, bracketIndent.concat('}')];
};

const formatPlainNode = (node, depth) => {
  const status = statusToSymbol[node.status];
  const indent = ' '.repeat(depth * 4);
  const lineStart = `${indent}  ${status} ${node.name}: `;
  return `${lineStart}${node.value}`;
};

const formatNode = (node, depth) => {
  const indent = ' '.repeat(depth * 4);
  const status = statusToSymbol[node.status];
  if (!_.isObject(node.value)) {
    return formatPlainNode(node, depth);
  }
  const complexValue = node.value;
  const innerKeys = Object.keys(complexValue);
  const lines = innerKeys.flatMap((innerKey) => {
    const innerValue = complexValue[innerKey];
    return formatComplexValue(innerKey, innerValue, depth + 1);
  });
  const bracketIndent = ' '.repeat((depth + 1) * 4);
  return [`${indent}  ${status} ${node.name}: {`, ...lines, bracketIndent.concat('}')];
};

const formatIter = (nodes, depth = 0) => {
  // console.log('nodes: ', JSON.stringify(nodes, null, 4));
  const newDepth = depth + 1;
  const indent = ' '.repeat(depth * 4);
  const newIndent = ' '.repeat(newDepth * 4);

  const lines = nodes.flatMap((node) => {
    if (node.status === 'updated') {
      const removedKey = { ...node, status: 'removed', value: node.oldValue };
      const addedKey = { ...node, status: 'added', value: node.newValue };
      return [formatNode(removedKey, depth), formatNode(addedKey, depth)].flat();
    }
    const status = statusToSymbol[node.status];
    const lineStart = `${indent}  ${status} ${node.name}: `;

    if (node.children) {
      const children = formatIter(node.children, newDepth);
      return [lineStart.concat('{'), ...children, newIndent.concat('}')];
    }
    return formatNode(node, depth);
  });
  return lines.map((line) => line.trimEnd());
};

const formatStylish = (diff) => ['{', ...formatIter(diff), '}'].join('\n');

const valueToStr = (value) => {
  if (_.isString(value)) {
    return `'${value}'`;
  }
  if (_.isObject(value)) {
    return '[complex value]';
  }
  return String(value);
};

const formatPlainIter = (nodes, nodesPath) => {
  const lines = nodes
    .filter((node) => !(node.status === 'unchanged' && node.children === null))
    .flatMap((node) => {
      const newPath = nodesPath ? `${nodesPath}.${node.name}` : node.name;
      if (node.status === 'unchanged') {
        return formatPlainIter(node.children, newPath);
      }
      const lineStart = `Property '${newPath}' was ${node.status}`;
      if (node.status === 'removed') {
        return lineStart;
      }
      if (node.status === 'added') {
        return `${lineStart} with value: ${valueToStr(node.value)}`;
      }
      const oldValueStr = valueToStr(node.oldValue);
      const newValueStr = valueToStr(node.newValue);
      return `${lineStart}. From ${oldValueStr} to ${newValueStr}`;
    });
  return lines;
};

const formatPlain = (diff) => formatPlainIter(diff).join('\n');

const formatDiff = (diff, format) => {
  switch (format) {
    case 'stylish':
      return formatStylish(diff);
    case 'plain':
      return formatPlain(diff);
    default:
      return '';
  }
};

export default formatDiff;
