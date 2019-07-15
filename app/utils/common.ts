// @ts-ignore
import * as path from 'path';

/**
 * resolve path
 * @param _path
 */
// @ts-ignore
const resolve = _path => path.resolve(__dirname, '..', _path);

export {
  resolve,
};
