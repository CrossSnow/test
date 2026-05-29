import { defineConfig, type UserConfigExport } from '@tarojs/cli';

export default defineConfig(async (merge, _arg): Promise<UserConfigExport<'webpack5'>> => {
  const baseConfig = await import('./index');
  return merge({}, baseConfig.default, {
    mini: {},
    h5: {},
  });
});
