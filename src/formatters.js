import _ from 'lodash';

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

export default formatDiff;
