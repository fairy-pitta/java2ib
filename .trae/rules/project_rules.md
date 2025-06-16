# Java to IB Pseudocode Converter - 詳細TODOリスト

## 📋 プロジェクト概要
JavaコードをIB Computer Science形式のPseudocodeに変換するライブラリの開発（TypeScript実装）

＊npm testを実行してテストを実行するとウォッチモードに入って終わらなくなるので、単体テストを実行すること
---

## 🎯 Phase 1: 基盤設計・型定義 (優先度: 最高)

### 1.1 IR (Intermediate Representation) 型定義
- [ ] `src/types/ir.ts` - IRインターフェースの定義
  - [ ] 基本IR構造（kind, text, children, meta）
  - [ ] 各構文用のIRサブタイプ定義
  - [ ] メタデータ型定義（メソッド名、パラメータ、戻り値判定等）
- [ ] `src/types/java-ast.ts` - Java AST型定義（必要に応じて）
- [ ] `src/types/config.ts` - 設定型定義（インデント、出力形式等）

### 1.2 基本ユーティリティ
- [ ] `src/utils/indent.ts` - インデント管理ユーティリティ
- [ ] `src/utils/operators.ts` - 演算子変換マッピング
- [ ] `src/utils/keywords.ts` - キーワード変換マッピング

---

## 🔧 Phase 2: Parser実装 (優先度: 高)

### 2.1 Java AST解析基盤
- [ ] `src/parser/index.ts` - メインパーサーエントリーポイント
- [ ] `src/parser/java-ast-parser.ts` - Java ASTパーサー
  - [ ] Javaコード → AST変換（java-parserライブラリ使用）
  - [ ] エラーハンドリング
  - [ ] 行番号情報保持

### 2.2 AST → IR変換 (Visitor Pattern)
- [ ] `src/parser/visitor/base-visitor.ts` - ベースVisitorクラス
- [ ] `src/parser/visitor/statement-visitor.ts` - 文レベルのVisitor
  - [ ] 代入文 (`x = 5` → `x ← 5`)
  - [ ] 出力文 (`System.out.println(x)` → `OUTPUT x`)
  - [ ] 入力文 (`Scanner.nextInt()` → `INPUT x`)
  - [ ] コメント (`// comment` → `// comment`)
- [ ] `src/parser/visitor/control-visitor.ts` - 制御構造Visitor
  - [ ] IF文 (`if/else if/else` → `IF/ELSEIF/ELSE/ENDIF`)
  - [ ] WHILE文 (`while` → `WHILE/ENDWHILE`)
  - [ ] FOR文 (`for(int i=0; i<n; i++)` → `FOR i ← start TO end/NEXT i`)
  - [ ] 拡張FOR文 (`for(Type item : collection)` → `FOR EACH item IN collection/NEXT item`)
- [ ] `src/parser/visitor/method-visitor.ts` - メソッド定義Visitor
  - [ ] メソッド定義解析 (`public/private/static`)
  - [ ] 戻り値有無判定（void vs 戻り値型）
  - [ ] PROCEDURE vs FUNCTION分岐
  - [ ] パラメータ解析
- [ ] `src/parser/visitor/expression-visitor.ts` - 式レベルのVisitor
  - [ ] 算術演算子変換
  - [ ] 比較演算子変換
  - [ ] 論理演算子変換 (`&&` → `AND`, `||` → `OR`)
  - [ ] 複合代入演算子展開 (`+=` → `x ← x + y`)

---

## 📤 Phase 3: Emitter実装 (優先度: 高)

### 3.1 基本Emitter
- [ ] `src/emitter/index.ts` - メインEmitterエントリーポイント
- [ ] `src/emitter/base-emitter.ts` - ベースEmitterクラス
  - [ ] 再帰的IR走査
  - [ ] インデントレベル管理
  - [ ] 出力バッファ管理

### 3.2 出力形式別Emitter
- [ ] `src/emitter/plain-emitter.ts` - プレーンテキスト出力
  - [ ] 固定インデント（4スペース）
  - [ ] END文自動挿入
- [ ] `src/emitter/markdown-emitter.ts` - Markdown出力
  - [ ] コードフェンス付きMarkdown
  - [ ] プレーンと同様の内容をMarkdown形式で

### 3.3 構文別出力ロジック
- [ ] 代入文出力 (`x ← 5`)
- [ ] 制御構造出力（IF/WHILE/FOR + 対応するEND文）
- [ ] 関数定義出力（PROCEDURE/FUNCTION + ENDPROCEDURE/ENDFUNCTION）
- [ ] ネスト構造対応（3階層以上のテスト必須）

---

## 🧪 Phase 4: テスト拡張・検証 (優先度: 中)

### 4.1 既存テスト実装対応
- [ ] `tests/basic-conversion.test.ts` の実装関数接続
- [ ] `tests/method-conversion.test.ts` の実装関数接続
- [ ] `tests/nested-structures.test.ts` の実装関数接続
- [ ] `tests/ib-examples.test.ts` の実装関数接続

### 4.2 追加テストケース
- [ ] エラーケーステスト
  - [ ] 不正なJava構文
  - [ ] サポート外構文（ジェネリクス、ラムダ式等）
  - [ ] 空ファイル・空メソッド
- [ ] エッジケーステスト
  - [ ] 深いネスト構造（5階層以上）
  - [ ] 複雑な式
  - [ ] 長い変数名・メソッド名
- [ ] 統合テスト
  - [ ] 実際のIBサンプルコード変換
  - [ ] 複数クラス処理

---

## 🚀 Phase 5: API・CLI実装 (優先度: 中)

### 5.1 メインAPI
- [ ] `src/index.ts` - メインエクスポート
- [ ] `src/converter.ts` - 変換メインクラス
  - [ ] `convertJavaToIB(code: string, options?: ConvertOptions): string`
  - [ ] 設定オプション対応（インデント、出力形式等）
  - [ ] エラーハンドリング

### 5.2 CLI実装
- [ ] 基本的なCLI機能のみ（高度なオプションは削除済み）
  - [ ] `--output` (出力ファイル)
  - [ ] `--help` (ヘルプ情報)
  - [ ] `--version` (バージョン情報)

---

## 📚 Phase 6: ドキュメント・配布準備 (優先度: 低)

### 6.1 ドキュメント整備
- [ ] `README.md` 更新
  - [ ] インストール方法
  - [ ] 使用方法・サンプル
  - [ ] サポート構文一覧
  - [ ] 制限事項
- [ ] `docs/api.md` - API仕様書
- [ ] `docs/examples.md` - 変換例集
- [ ] `docs/limitations.md` - 制限事項・既知の問題

### 6.2 配布準備
- [ ] `package.json` 最終調整
- [ ] TypeScript設定最適化
- [ ] ビルド設定（tsc/webpack）
- [ ] npm publish準備

---

## 🔄 Phase 7: 拡張機能 (優先度: 最低)

### 7.1 高度な構文サポート
- [ ] ジェネリクス対応
- [ ] ラムダ式対応
- [ ] インターフェース定義対応
- [ ] switch式対応（Java 14+）
- [ ] レコード対応（Java 14+）

### 7.2 ツール統合
- [ ] VS Code拡張
- [ ] Web UI
- [ ] GitHub Actions統合

---

## 🚨 重要な実装ポイント

### ネスト構造対応
- **必須**: 3階層以上のネスト構造テスト
- IR.childrenを使った再帰構造で実装
- Emitterでインデントレベル+1しながら出力

### メソッド vs プロシージャ判定
- AST解析時にvoid型かreturn文の有無をチェック
- meta.hasReturnフラグで判定
- FUNCTION（戻り値あり）とPROCEDURE（戻り値なし）を適切に分岐
- staticメソッドとインスタンスメソッドの区別

### エラーハンドリング
- サポート外構文は明確なエラーメッセージ
- 部分的な変換も可能にする（可能な部分のみ変換）
- デバッグ情報（行番号等）の保持

### テスト駆動開発
- Vitestを使用したテストケース作成
- 実装前にテストが通ることを確認
- 段階的実装（基本構文 → 制御構造 → メソッド → ネスト）

---

## 📅 推奨実装順序

1. **Phase 1**: 型定義・基盤（1-2日）
2. **Phase 2.1-2.2**: 基本構文Parser（2-3日）
3. **Phase 3.1-3.2**: 基本Emitter（1-2日）
4. **Phase 4.1**: 既存テスト接続・検証（1日）
5. **Phase 2.2**: 制御構造・関数Parser（2-3日）
6. **Phase 3.3**: 高度な出力ロジック（1-2日）
7. **Phase 4**: テスト拡張・検証（1-2日）
8. **Phase 5**: API・CLI（1-2日）
9. **Phase 6-7**: ドキュメント・拡張（必要に応じて）

**総推定期間**: 2-3週間（基本機能完成まで）

---

## 🧪 現在のテスト状況・問題点

### テスト実行環境の問題
- **Vitest認識問題**: `npx vitest run tests/nested-structures.test.ts` 実行時に「no tests found」エラーが発生
- **設定ファイル確認済み**: `vitest.config.ts`の`include: ['tests/**/*.test.ts']`設定は正常
- **テストファイル確認済み**: `tests/nested-structures.test.ts`は正しいVitest形式で記述されている
- **キャッシュ問題**: `npx vitest clear-cache`も「No test files found」で失敗

### 確認済み項目
- ✅ `package.json`: Vitest v1.0.0が正しく設定されている
- ✅ `vitest.config.ts`: テストファイルのincludeパターンが正しい
- ✅ `tests/nested-structures.test.ts`: describe/itブロックが正しく記述されている
- ✅ プロジェクト構造: testsディレクトリとファイルが存在する

### 未解決の問題
- Vitestがテストファイルを認識しない根本原因が不明
- キャッシュクリアコマンドも同様のエラーで失敗
- 他のテストファイルでも同様の問題が発生する可能性

### 対処方針
- 実装を進める前にテスト環境の修復が必要
- 代替案として手動でのテスト実行やNode.jsスクリプトでの検証を検討
- Vitestのバージョンダウングレードまたは設定の見直しが必要な可能性

### テストファイル一覧（実装待ち）
- `tests/basic-conversion.test.ts` - 基本変換テスト
- `tests/control-structures.test.ts` - 制御構造テスト
- `tests/method-conversion.test.ts` - メソッド変換テスト
- `tests/nested-structures.test.ts` - ネスト構造テスト（問題発生中）
- `tests/ib-examples.test.ts` - IBサンプルテスト
- `tests/error-handling.test.ts` - エラーハンドリングテスト
- `tests/integration.test.ts` - 統合テスト
- `tests/index.test.ts` - メインAPIテスト