import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'assets': path.resolve(__dirname, './src/assets'),
      'components': path.resolve(__dirname, './src/components'),
      'layouts': path.resolve(__dirname, './src/layouts'),
      'routes': path.resolve(__dirname, './src/routes'),
      'hooks': path.resolve(__dirname, './src/hooks'),
      'providers': path.resolve(__dirname, './src/providers'),
      'theme': path.resolve(__dirname, './src/theme'),
      'utils': path.resolve(__dirname, './src/utils'),
      'lib': path.resolve(__dirname, './src/lib'),
      'config': path.resolve(__dirname, './src/config'),
      'data': path.resolve(__dirname, './src/data'),
      'helpers': path.resolve(__dirname, './src/helpers'),
      'reducers': path.resolve(__dirname, './src/reducers'),
      'pages': path.resolve(__dirname, './src/pages'),
      'types': path.resolve(__dirname, './src/types'),
    },
  },
})
