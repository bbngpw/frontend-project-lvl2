import { extname } from 'path';
import { load as loadYaml } from 'js-yaml';

const parseFile = (file) => {
  const ext = extname(file.path).toLowerCase();
  switch (ext) {
    case '.json':
      return JSON.parse(file.content);
    case '.yml':
    case '.yaml':
      return loadYaml(file.content);
    default:
      return {};
  }
};

export default parseFile;
