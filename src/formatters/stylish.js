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
  return lines.map((line) => line);
};

const formatStylish = (diff) => ['{', ...formatIter(diff), '}'].join('\n');

export default formatStylish;
