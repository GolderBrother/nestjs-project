import { readFile } from 'fs/promises';
import * as path from 'path';
import * as yaml from 'js-yaml';

export default async () => {
  // 支持异步逻辑
  const configFilePath = path.join(process.cwd(), 'aaa.yaml');

  const config = await readFile(configFilePath, {
    encoding: 'utf-8',
  });
  return yaml.load(config);
};
