import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Java2IB',
      fileName: (format) => `java2ib.${format}.js`,
      formats: ['es', 'umd', 'iife']
    },
    rollupOptions: {
      // ブラウザで使用する場合の外部依存関係を指定
      external: [],
      output: {
        // UMDビルド用のグローバル変数名
        globals: {}
      }
    },
    // ソースマップを生成してデバッグを容易にする
    sourcemap: true,
    // 出力ディレクトリ
    outDir: 'dist/browser'
  },
  // 開発サーバー設定（デモ用）
  server: {
    port: 3000,
    open: true
  },
  // TypeScript設定
  esbuild: {
    target: 'es2020'
  }
});