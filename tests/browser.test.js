// ブラウザ版のE2Eテスト
const { test, expect } = require('@playwright/test');

test.describe('Java to IB Converter - Browser Version', () => {
  test.beforeEach(async ({ page }) => {
    // 開発サーバーに接続
    await page.goto('http://localhost:8080');
  });

  test('ページが正常に読み込まれる', async ({ page }) => {
    // タイトルの確認
    await expect(page).toHaveTitle(/Java to IB Pseudocode Converter/);
    
    // 主要な要素の存在確認
    await expect(page.locator('#javaInput')).toBeVisible();
     await expect(page.locator('#pseudocodeOutput')).toBeVisible();
     await expect(page.locator('button:has-text("Convert to IB Pseudocode")')).toBeVisible();
  });

  test('基本的な変換機能が動作する', async ({ page }) => {
    // Javaコードを入力
    const javaCode = 'int x = 5;\nSystem.out.println(x);';
    await page.fill('#javaInput', javaCode);
    
    // 変換ボタンをクリック
    await page.click('button:has-text("Convert to IB Pseudocode")');
    
    // 結果が表示されることを確認
    const output = await page.locator('#pseudocodeOutput').inputValue();
    expect(output).toBeTruthy();
    expect(output.length).toBeGreaterThan(0);
  });

  test('サンプルコードの読み込みが動作する', async ({ page }) => {
    // 基本サンプルをクリック
    await page.click('button:has-text("基本的な変数")');
    
    // 入力欄にコードが読み込まれることを確認
    const inputValue = await page.locator('#javaInput').inputValue();
    expect(inputValue).toContain('int x = 5');
    expect(inputValue).toContain('System.out.println');
  });

  test('クリア機能が動作する', async ({ page }) => {
    // まずコードを入力
    await page.fill('#javaInput', 'int x = 5;');
    
    // 変換ボタンをクリックして出力を生成
    await page.click('button:has-text("Convert to IB Pseudocode")');
    
    // 出力が生成されるまで少し待つ
    await page.waitForTimeout(500);
    
    // クリアボタンをクリック
    await page.click('button:has-text("Clear All")');
    
    // 両方の欄が空になることを確認
    await expect(page.locator('#javaInput')).toHaveValue('');
    await expect(page.locator('#pseudocodeOutput')).toHaveValue('');
  });

  test('ファイルアップロード機能の要素が存在する', async ({ page }) => {
    // ファイル入力とボタンの存在確認
    await expect(page.locator('#fileInput')).toBeVisible();
    await expect(page.locator('button:has-text("ファイルから読み込み")')).toBeVisible();
    await expect(page.locator('button:has-text("結果をダウンロード")')).toBeVisible();
  });

  test('エラーメッセージが適切に表示される', async ({ page }) => {
    // 空の状態で変換を試行
    await page.click('button:has-text("Convert to IB Pseudocode")');
    
    // エラーメッセージが表示されることを確認
    await expect(page.locator('.error')).toBeVisible();
    await expect(page.locator('.error')).toContainText('Javaコードを入力してください');
  });

  test('レスポンシブデザインが機能する', async ({ page }) => {
    // モバイルサイズに変更
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 主要な要素が表示されることを確認
    await expect(page.locator('#javaInput')).toBeVisible();
    await expect(page.locator('#pseudocodeOutput')).toBeVisible();
    
    // デスクトップサイズに戻す
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // 要素が正常に表示されることを確認
    await expect(page.locator('#javaInput')).toBeVisible();
    await expect(page.locator('#pseudocodeOutput')).toBeVisible();
  });
});