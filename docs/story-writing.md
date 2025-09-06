# ストーリー記述ルール

data.jsonにストーリーデータを記述する際のルールと形式

## 基本構造

### ストーリーオブジェクト
- `stories`: 配列形式でストーリーオブジェクトを定義
- `id`: ストーリーの一意識別子（文字列）
- `name`: ストーリーのタイトル（文字列）
- `description`: ストーリーの説明（文字列）
- `scenes`: シーンの配列

### シーン構造
- `id`: シーンの一意識別子（文字列）
- `type`: シーンのタイプ（'dialogue', 'choice', 'action'など）
- `content`: シーンの内容（テキストまたはオブジェクト）
- `next`: 次のシーンID（文字列）または選択肢配列
- `conditions`: 表示条件（オプション）

## シーンタイプ

### 選択肢シーン
```json
{
  "type": "choice",
  "content": "選択肢の説明文",
  "choices": [
    {
      "text": "選択肢のテキスト",
      "next": "選択した場合の次のシーンID",
      "condition": "表示条件（オプション）"
    }
  ]
}
```

### 会話シーン
```json
{
  "type": "dialogue",
  "character": "話すキャラクター名",
  "text": "会話内容",
  "next": "次のシーンID"
}
```

## 命名規則

- **ストーリーID**: snake_case形式（例：`main_story`, `side_quest_1`）
- **シーンID**: ストーリーID + シーン番号（例：`main_story_1`, `main_story_2`）
- **選択肢ID**: シーンID + 選択肢番号（例：`main_story_choice_1_a`）

## ベストプラクティス

1. IDは分かりやすく一意になるようにする
2. シーンは小さな単位に分割する
3.選択肢は明確で理解しやすいテキストにする
4. 条件分岐は最小限に抑える
5. テスト用のダミーデータも含める

## 例

### 基本的なストーリー
```json
{
  "id": "tutorial_story",
  "name": "チュートリアル",
  "description": "基本的な操作を学ぶ",
  "scenes": [
    {
      "id": "tutorial_1",
      "type": "dialogue",
      "character": "ガイド",
      "text": "こんにちは！RPGの世界へようこそ。",
      "next": "tutorial_2"
    },
    {
      "id": "tutorial_2",
      "type": "choice",
      "content": "どちらの道を選びますか？",
      "choices": [
        {
          "text": "右の道",
          "next": "tutorial_right"
        },
        {
          "text": "左の道", 
          "next": "tutorial_left"
        }
      ]
    }
  ]
}
```