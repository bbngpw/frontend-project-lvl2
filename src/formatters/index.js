import formatStylish from './stylish.js';
import formatPlain from './plain.js';

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
