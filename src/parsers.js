import { extname } from 'path';
import { load as loadYaml } from 'js-yaml';

const parseFile = (filecontent, filepath) => {
  const ext = extname(filepath).toLowerCase();
  switch (ext) {
    case '.json':
      return JSON.parse(filecontent);
    case '.yml':
    case '.yaml':
      return loadYaml(filecontent);
    default:
      return {};
  }
};

export default parseFile;
