module.exports = {
  stories: ['../stories/**/*.stories.mdx', '../stories/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        docs: false,
        measure: false,
        viewport: false,
        outline: false
      }
    }
  ],
  webpackFinal: async (config, { configType }) => {
    config.resolve.alias.uebersicht = require('path').resolve(__dirname, 'uebersicht.js')
    return config
  }
}
