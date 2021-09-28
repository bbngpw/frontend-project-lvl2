import _ from 'lodash';

const statusToSymbol = {
  added: '+',
  removed: '-',
  unchanged: ' ',
  commonParent: ' ',
};

const keyToLine = (key, depth) => {
  const status = statusToSymbol[key.status];
  const indent = ' '.repeat(depth * 4);
  const lineStart = `${indent}  ${status} ${key.name}: `;
  return `${lineStart}${key.value}`;
};

const formatKey = (key, depth) => {
  const indent = ' '.repeat(depth * 4);
  const bracketIndent = ' '.repeat((depth + 1) * 4);
  const { value } = key;
  const status = statusToSymbol[key.status];

  if (!_.isObject(value)) {
    return keyToLine(key, depth);
  }
  const keys = Object.keys(value);
  const subLines = keys.flatMap((subKey) =>
    formatKey(
      {
        name: subKey,
        value: value[subKey],
        status: 'unchanged',
      },
      depth + 1
    )
  );
  return [`${indent}  ${status} ${key.name}: {`, ...subLines, bracketIndent.concat('}')];
};

const formatStylish = (diff) => {
  const formatIter = (nodes, depth = 0) => {
    // console.log('nodes: ', JSON.stringify(nodes, null, 4));
    const newDepth = depth + 1;
    const indent = ' '.repeat(depth * 4);
    const newIndent = ' '.repeat(newDepth * 4);

    const keys = nodes.flatMap((key) => {
      // console.log(key);
      if (key.status === 'updated') {
        const removedKey = { ...key, status: 'removed', value: key.oldValue };
        const addedKey = { ...key, status: 'added', value: key.newValue };
        return [formatKey(removedKey, depth), formatKey(addedKey, depth)].flat();
      }
      const status = statusToSymbol[key.status];
      const lineStart = `${indent}  ${status} ${key.name}: `;

      if (key.status === 'commonParent') {
        const children = formatIter(key.children, newDepth);
        return [lineStart.concat('{'), ...children, newIndent.concat('}')];
      }

      if (_.isObject(key.value)) {
        return formatKey(key, depth);
      }

      return keyToLine(key, depth);
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
