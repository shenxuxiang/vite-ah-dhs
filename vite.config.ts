import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite';
import postcssPresetEnv from 'postcss-preset-env';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import process from 'process';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const define = Object.keys(env).reduce((memo, key) => {
    memo[key] = JSON.stringify(env[key]);
    return memo;
  }, {});

  return {
    mode,
    define,
    publicDir: 'public',
    resolve: {
      extensions: [ '.tsx', '.ts', '.jsx', '.js' ],
      alias: {
        '@': path.resolve('src'),
      }
    },
    plugins: [ react(), legacy(), splitVendorChunkPlugin() ],
    build: {
      outDir: 'build',
      cssMinify: true,
      minify: 'terser',
      emptyOutDir: true,
      cssCodeSplit: true,
      copyPublicDir: true,
      sourcemap: 'hidden',
      assetsInlineLimit: 10 * 1024,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        }
      },
      rollupOptions: {
        output: {
          assetFileNames: (chunkInfo) => {
            const { name } = chunkInfo;
            if (/\.(jpg|jpeg|png|webp|bmp|gif|svg)$/.test(name)) {
              return 'image/[name].[hash][extname]';
            } else if (/\.(woff2|woff|ttf|eot)$/.test(name)) {
              return 'font/[name].[hash][extname]';
            } else if (/\.css$/.test(name)) {
              return 'css/[name].[hash].css';
            } else {
              return '[ext]/[name].[hash][extname]';
            }
          },
          entryFileNames: 'js/[name].[hash].js',
          chunkFileNames: 'js/[name].[hash].chunk.js',
          manualChunks: {
            'vendor-react': [ 'react', 'react-dom' ]
          }
        }
      }
    },
    css: {
      postcss: {
        plugins: [ postcssPresetEnv ]
      },
      modules: {
        scopeBehaviour: 'local',
        // localsConvention: 'camelCaseOnly',
        globalModulePaths: [ /(?<!\.module)\.css/, /(?<!\.module)\.less/ ],
      },
      preprocessorOptions: {
        less: {
          modifyVars: {},
          globalVars: {},
          additionalData: '',
          javascriptEnable: true,
        }
      },
      devSourcemap: false,
    },
    server: {
      port: 9999,
      open: true,
      strictPort: true,
      host: 'localhost',
      proxy: {
        '/v1.0': {
          // 朱鹰辉
          // target: 'http://192.168.5.120:2005',
          // 测试
          target: 'http://192.168.5.101:20011',
          changeOrigin: true,
        },
        '/group1': {
          // 朱鹰辉
          // target: 'http://192.168.5.120:2005',
          // 测试
          target: 'http://192.168.5.101:20011',
          changeOrigin: true,
        }
      }
    }
  };
})
