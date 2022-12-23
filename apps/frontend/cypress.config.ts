import { defineConfig } from 'cypress'

export default defineConfig({
  video: false,
  videoCompression: 51,
  videoUploadOnPasses: false,
  screenshotOnRunFailure: true,
  trashAssetsBeforeRuns: true,
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-call
      require('@cypress/code-coverage/task')?.(on, config)
      return config
    },
    experimentalSessionAndOrigin: true,
    experimentalInteractiveRunEvents: true,
  },
  component: {
    experimentalInteractiveRunEvents: true,
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
})
