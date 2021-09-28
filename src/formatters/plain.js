import _ from 'lodash';

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

export default formatPlain;
