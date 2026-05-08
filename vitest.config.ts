import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    projects: [
      {
        test: {
          name: 'renderer',
          environment: 'jsdom',
          include: ['src/renderer/**/*.{test,spec}.{ts,tsx}'],
          setupFiles: ['./vitest.setup.ts']
        }
      },
      {
        test: {
          name: 'main',
          environment: 'node',
          include: ['src/main/**/*.{test,spec}.ts']
        }
      }
    ]
  },
  resolve: {
    alias: {
      '@renderer': resolve(__dirname, 'src/renderer/src'),
      '@': resolve(__dirname, 'src/renderer/src')
    }
  }
})
