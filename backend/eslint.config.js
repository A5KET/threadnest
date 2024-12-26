import stylistic from '@stylistic/eslint-plugin'

import globalConfig from '../eslint.config.js'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [globalConfig],

    plugins: {
      '@stylistic': stylistic
    },
    rules: {

    },
  },
)
