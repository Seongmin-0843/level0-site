# LEVEL 0 웹사이트

대구대학교 게임 개발 동아리 LEVEL 0의 게임잼 결과물을 보여주고, 브라우저에서 바로 플레이할 수 있게 하는 사이트입니다.
HTML/CSS/JavaScript로만 만들어서 서버나 데이터베이스가 필요 없습니다.

## 폴더 구조

```
index.html            ← 사이트 뼈대 (거의 수정할 일 없음)
css/style.css         ← 디자인 (색은 맨 위 :root 변수만 바꾸면 됨)
js/app.js             ← 페이지 동작 (거의 수정할 일 없음)
data/games.js         ← ★ 게임잼 / 게임 정보. 평소에는 이 파일만 고치면 됩니다
assets/               ← 로고 이미지 (흰색/검은색, 심볼만 있는 버전)
games/                ← 게임 웹 빌드를 넣는 곳
  demo/block-drop/    ← 동작 확인용 데모 게임 (실제 게임이 생기면 지워도 됨)
```

## 내 컴퓨터에서 미리 보기

`index.html`을 더블클릭해도 사이트는 열리지만, **Unity 게임은 로컬 서버로 열어야 실행됩니다.**

```bash
# 이 폴더에서 실행한 뒤 브라우저로 http://localhost:8000 접속
python -m http.server 8000
```

VS Code를 쓴다면 확장 프로그램 **Live Server**를 설치하고 `index.html`에서 "Open with Live Server"를 눌러도 됩니다.

## 새 게임 올리기

### 1. Unity에서 WebGL로 빌드하기

1. `File > Build Profiles`(구버전은 `Build Settings`)에서 **Web(WebGL)** 플랫폼으로 전환합니다.
2. `Player Settings > Publishing Settings`에서
   - **Compression Format**: `Gzip` 또는 `Brotli`
   - **Decompression Fallback**: ✅ 체크 ← 무료 호스팅에서 게임이 안 열리는 문제를 막아줍니다
3. `Player Settings > Resolution and Presentation`에서 WebGL Template은 **Default** 또는 **Minimal**을 고릅니다.
4. 빌드하면 `index.html`, `Build/`, `TemplateData/`가 들어 있는 폴더가 나옵니다.

> 파일 하나가 100MB를 넘으면 GitHub에 올라가지 않습니다. 텍스처 압축이나 사용하지 않는 에셋 정리로 용량을 줄여 주세요.

### 2. 빌드 폴더 넣기

빌드 폴더를 통째로 `games/<게임잼id>/<게임id>/`에 넣습니다.

```
games/2026-fall/rewind-knight/index.html
games/2026-fall/rewind-knight/Build/...
```

### 3. `data/games.js`에 정보 추가

해당 게임잼의 `games` 목록에 항목을 추가하고, `play.path`를 위 경로로 지정합니다.

```js
{
  id: "rewind-knight",
  title: "되감기 기사",
  team: ["김OO", "이OO"],
  engine: "Unity",
  genre: "퍼즐 플랫포머",
  summary: "한 줄 소개",
  description: "상세 설명",
  controls: [["← →", "이동"], ["Space", "점프"]],
  thumbnail: "games/2026-fall/rewind-knight/thumb.png",  // 없으면 "" (자동 이미지)
  play: { path: "games/2026-fall/rewind-knight/index.html", aspect: "960:600" },
  links: { video: "https://youtube.com/..." }
}
```

- `aspect`는 게임 화면 비율입니다. Unity Default 템플릿은 `960:600`입니다.
- 웹 빌드가 없는 게임은 `play: null`로 두고 `links.download`만 넣으면 됩니다.
- 썸네일은 16:9(예: 1280×720) 이미지를 권장합니다.
- **게임 `id`는 모든 게임잼을 통틀어 겹치지 않게** 지어 주세요.

### 새 게임잼 추가

`jams` 목록 **맨 위**에 새 회차를 추가하면 메인 화면의 "최신 게임잼"으로 표시됩니다.

## 다른 엔진을 쓸 때

사이트는 엔진과 상관없이 **게임 폴더의 `index.html`을 iframe으로 띄우는** 방식이라, 코드를 고칠 필요가 없습니다.

- **Godot 4**: Web으로 내보내기 할 때 **Thread Support를 끄면** 일반 호스팅에서도 실행됩니다.
- **GameMaker / Construct / HTML5 게임**: HTML5로 내보낸 폴더를 똑같이 넣으면 됩니다.

## 인터넷에 공개하기 (무료)

### GitHub Pages
1. GitHub에 저장소를 만들고 이 폴더 전체를 올립니다.
2. 저장소 `Settings > Pages`에서 Branch를 `main` / `(root)`로 지정합니다.
3. 몇 분 뒤 `https://<계정>.github.io/<저장소>/` 주소로 접속할 수 있습니다.

### Netlify / Cloudflare Pages
GitHub 저장소를 연결하면 올릴 때마다 자동으로 배포됩니다. 서버 설정(헤더)을 직접 지정할 수 있어서, 나중에 특수한 설정이 필요한 엔진을 쓸 때도 유리합니다.
