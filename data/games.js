/* =========================================================================
   LEVEL 0 게임잼 데이터
   -------------------------------------------------------------------------
   새 게임을 올릴 때는 이 파일만 고치면 됩니다. (사이트 코드는 건드릴 필요 없음)

   1) games/<게임잼id>/<게임id>/ 폴더에 웹 빌드(index.html 포함)를 넣고
   2) 아래 해당 게임잼의 games 목록에 항목을 하나 추가하세요.

   항목 설명
   - id          : 영어 소문자/숫자/하이픈만 (주소에 쓰임) 예) "slime-jump"
   - title       : 게임 이름
   - teamNo      : 몇 팀인지 (예: 1 → "1팀"으로 표시). 없으면 생략
   - team        : 팀원 이름 목록
   - engine      : "Unity", "Godot", "HTML5" 등 (표시용 뱃지)
   - genre       : 장르 (표시용)
   - summary     : 카드에 보일 한 줄 소개
   - description : 상세 설명 (줄바꿈은 \n)
   - controls    : 조작법 목록 [ ["키", "설명"], ... ]
   - thumbnail   : 썸네일 이미지 경로 (없으면 자동 생성 이미지 사용)
   - play        : 브라우저 플레이 정보. 웹 빌드가 없으면 null
       path   : 빌드 폴더의 index.html 경로, 또는 itch.io Embed game 의 Direct link 주소
       aspect : 화면 비율 "16:9", "4:3", "960:600" 등 (Unity 기본 템플릿은 960:600)
       width, height : (선택) 게임 화면이 잘릴 때 넣으세요. itch.io Embed game 화면의 Width/Height 값.
                       넣으면 aspect 대신 이 크기로 띄운 뒤 화면에 맞게 줄여서 보여줍니다.
   - links       : 추가 링크 (없으면 생략) { page, download, video, source }
                   page = itch.io 게임 페이지, download = 다운로드, video = 플레이 영상, source = 소스 코드
   ========================================================================= */

window.LEVEL0 = {
  club: {
    name: "LEVEL 0",
    school: "대구대학교 게임 개발 동아리",
    tagline: "0에서부터 시작해 무한히 성장하다.",  // (메인 큰 제목은 js/app.js 의 pageHome 에 있음)
    intro:
      "LEVEL 0는 대구대학교 중앙 동아리 소속 게임 개발 동아리입니다.\n" +
      "게임 개발에 대한 열정으로 모여 실제 게임을 기획하고 개발하고 완성해보는 동아리입니다.\n" +
      "기획, 개발, 아트가 한 팀을 이루어 아이디어를 실제 프로젝트로 완성해 갑니다. 함께 스터디하고 성장하며 나만의 게임 포트폴리오를 만들어갈 수 있는 동아리입니다.",
    links: {
        instagram: "https://www.instagram.com/du_level0",   // 예) "https://instagram.com/level0_du"
      github: "",      // 예) "https://github.com/level0-du"
      contact: "tjdals0843@naver.com"      // 예) "level0@example.com"
    }
  },

  /* 역대 임원진: 동아리 소개 화면 아래에 표시됩니다. 최신 기수를 맨 위에 두세요. (비워두면 안 보임)
     예) { label: "2학기", year: "2026", members: [["회장", "홍길동"], ["부회장", "김OO"], ["총무", "이OO"]] },
     "회장"은 크게 강조되고, 나머지 직책은 옆에 나란히 표시됩니다.
     파트장은 ["파트장", { 기획: "OOO", 프로그래밍: "OOO", 아트: "OOO, OOO" }] 처럼 적으면 파트별로 나눠서 보여줍니다.
     한 칸에 여러 명이면 여기 적은 순서대로 표시됩니다. */
  officers: [
    { label: "2학기", year: "2026", members: [["회장", "김성민"], ["부회장", "박형주"], ["총무", "강은빈"], ["홍보부장", "이민희"], ["기획부장", "설예원"], ["파트장", { 기획: "박채준", 프로그래밍: "이현준", 아트: "박형주, 김규린" }]] },
    { label: "1학기", year: "2026", members: [["회장", "강유민"], ["부회장", "최혜인"], ["총무", "김성민"], ["홍보부장", "이민희"], ["파트장", { 기획: "김성윤", 프로그래밍: "김성민", 아트: "박형주" }]] },
    { label: "2학기", year: "2025", members: [["회장", "강유민"], ["부회장", "최혜인"], ["파트장", { 기획: "이아립", 프로그래밍: "김성민", 아트: "최혜인" }]] },
  ],

  /* 임원 학과·학번: 이름을 적고 학과와 학번(입학년도 두 자리)을 넣으면 역대 임원진에서 이름 아래에 표시됩니다.
     예) "홍길동": { dept: "컴퓨터공학과", year: "21" },   → "컴퓨터공학과 · 21학번"
     여기 없는 사람은 이름만 나옵니다. */
  people: {
    "강유민": { dept: "컴퓨터소프트웨어학과", year: "20" },
    "강은빈": { dept: "게임학과", year: "26" },
    "김규린": { dept: "게임학과", year: "26" },
    "김성민": { dept: "컴퓨터공학과", year: "25" },
    "김성윤": { dept: "컴퓨터소프트웨어학과", year: "24" },
    "박채준": { dept: "컴퓨터소프트웨어학과", year: "21" },
    "박형주": { dept: "웹툰영상애니메이션학부", year: "24" },
    "설예원": { dept: "게임학과", year: "26" },
    "이민희": { dept: "게임학과", year: "26" },
    "이아립": { dept: "문화콘텐츠학부", year: "23" },
    "이현준": { dept: "컴퓨터소프트웨어학과", year: "21" },
    "최혜인": { dept: "게임학과", year: "24" },
  },

  /* 게임잼 목록: 최신 회차를 맨 위에 두세요 */
  jams: [
    {
      id: "2026-fall",
      title: "2026-2학기 게임잼",
      date: "2026.11.02 – 11.08",
      hours: 159,
      theme: "단절",
      description:
        "'단절'이라는 주제로 진행한 2026년 2학기 게임잼입니다.",
      games: [
        {
          id: "team3",
          teamNo: 3,
          title: "기억 상담소",
          team: ["김동현", "김예원", "이현준", "정상화", "지예인"],
          engine: "Unity",
          genre: "퍼즐",
          summary: "기억 상담사가 되어 끊어진 기억의 조각을 맞추고, 지워진 진실을 마주하며, 끝내 기억을 잘라내는 퍼즐 게임",
          description: "",
          controls: [],
          thumbnail: "games/2026-fall/team3/thumb.jpg",
          play: { path: "games/2026-fall/team3/index.html", aspect: "960:600" },
          links: {}
        },
        {
          id: "cut-the-wonderland",
          teamNo: 4,
          title: "Cut the Wonderland",
          team: ["강유민", "김규린", "김민후", "박찬영", "정재윤"],
          engine: "Unity",
          genre: "퍼즐 플랫포머",
          summary: "앞을 가로막는 모든 것을 베며 나아가는 액션 퍼즐 플랫포머.",
          description: "",
          controls: [],
          thumbnail: "games/2026-fall/team4/thumb.jpg",
          play: { path: "games/2026-fall/team4/index.html", aspect: "16:9" },
          links: {}
        },
        {
          id: "three-hour",
          teamNo: 1,
          title: "Three hour",
          team: ["강은빈", "공민재", "김범근", "박검무", "이서준"],
          engine: "Unity",
          genre: "추리",
          summary: "독재 국가 '월랜드'의 심문관이 되어 용의자들의 진술 속 단서를 추적하고 밝혀낸 단서를 통해 반동 분자를 색출해내라.",
          description: "",
          controls: [],
          thumbnail: "games/2026-fall/team1/thumb.jpg",
          play: { path: "games/2026-fall/team1/index.html", aspect: "16:9" },
          links: {}
        },
        {
          id: "last-ember",
          teamNo: 2,
          title: "Last Ember",
          team: ["박채준", "송미경", "이민희", "이순재", "정진석"],
          engine: "Unity",
          genre: "2D 플랫포머",
          summary: "마지막 등불지기가 단절된 왕국에 빛을 되찾는 과정을 그린 2D 픽셀 액션 게임.",
          description: "",
          controls: [],
          thumbnail: "games/2026-fall/team2/thumb.jpg",
          play: { path: "games/2026-fall/team2/index.html", aspect: "16:9" },
          links: {}
        }
      ]
    },
    {
      id: "2026-spring",
      title: "2026-1학기 게임잼",
      date: "2026.05.09 – 05.17",
      hours: 207,
      theme: "바구니",
      description:
        "'바구니'라는 주제로 진행한 2026년 1학기 게임잼입니다.",
      games: [
        {
          id: "popo",
          teamNo: 2,
          title: "POPO",
          team: ["김성민", "김호근", "이서준", "정채현", "최혜인"],
          engine: "Unity",
          genre: "2D 플랫포머",
          summary: "주인공의 상상 친구 '포포'가 불안한 주인공의 꿈 속에서 악몽을 바구니에 담아 정화하는 2D 플랫포머 게임",
          description: "게임 소개를 여기에 적어주세요.",
          controls: [],
          thumbnail: "games/2026-spring/popo/thumb.jpg",
          play: { path: "games/2026-spring/popo/index.html", aspect: "16:9" },
          links: { page: "https://tjdals0843.itch.io/popo" }
        },
        {
          id: "yorihwang-cheonjae",
          teamNo: 1,
          title: "요리왕천재",
          team: ["강유민", "김한결", "박윤진", "이민희", "이세민"],
          engine: "Unity",
          genre: "2인용 요리 게임",
          summary: "바구니를 뒤집어 재료를 줍고 1분 안에 손님 취향의 요리를 만들어라! 2인 경쟁 요리 게임.",
          description: "",
          controls: [],
          thumbnail: "games/2026-spring/yorihwang/thumb.jpg",
          play: { path: "https://itch.io/embed-upload/18091357?color=0b0b0c", width: 980, height: 680 },
          links: { page: "https://yuminbeep.itch.io/1" }
        },
        {
          id: "byeolbit-delivery",
          teamNo: 5,
          title: "별빛 배달부",
          team: ["강은빈", "김신유", "이강희", "이순재", "정진석"],
          engine: "Unity",
          genre: "퍼즐 게임",
          summary: "빛을 잃어가는 숲, 사라진 장인의 설계도를 따라 재료를 모으고 바구니를 엮어 별빛을 담아오세요. 아름다운 별빛 축제의 불씨가 꺼지기 전에.",
          description: "",
          controls: [],
          thumbnail: "games/2026-spring/byeolbit/thumb.jpg",
          play: { path: "https://itch.io/embed-upload/17571092?color=0b0b0c", width: 980, height: 680 },
          links: { page: "https://exxising.itch.io/starbearer" }
        },
        {
          id: "redhoods-basdeck",
          teamNo: 6,
          title: "RedHood's Basdeck",
          team: ["김규린", "이준서", "이현준", "차영윤", "홍정우"],
          engine: "Unity",
          genre: "전략 카드 게임",
          summary: "빨간 망토가 되어 카드와 속성을 조합해 숲속의 적들과 잔혹한 늑대를 물리치세요! 고전 동화를 각색하여 제작된 전략 스토리 카드 게임입니다.",
          description: "",
          controls: [],
          thumbnail: "games/2026-spring/redhood/thumb.jpg",
          play: { path: "https://itch.io/embed-upload/17574038?color=0b0b0c", width: 980, height: 680 },
          links: { page: "https://dev-neulbo.itch.io/redhoods-basdeck" }
        },
        {
          id: "what-do-you-want",
          teamNo: 4,
          title: "아니, 그래서 뭐 달라고요?",
          team: ["강민지", "배슬기", "설예원", "안서진", "이찬민"],
          engine: "Unity",
          genre: "퍼즐 시뮬레이션",
          summary: "이상한 배달 요청 사항을 받은 플레이어, 이걸 못하면 별점이 없다! 암호와도 같은 배달 요청 사항을 풀이하여 과일을 배달해야 하는 게임입니다.",
          description: "",
          controls: [],
          thumbnail: "games/2026-spring/delivery/thumb.jpg",
          play: { path: "https://itch.io/embed-upload/17573418?color=0b0b0c", width: 980, height: 680 },
          links: { page: "https://anseojin.itch.io/so-what-do-you-want" }
        },
        {
          id: "basket-survivors",
          teamNo: 3,
          title: "Basket Survivors",
          team: ["김동현", "김민후", "문종훈", "박형주", "설지원"],
          engine: "Unity",
          genre: "2D 횡스크롤 로그라이크",
          summary: "몬스터를 처치하며 성장하고, 레벨업으로 새로운 원소 능력을 획득하세요. 원소 조합 스킬을 활용해 몰려오는 적들을 돌파하는 생존 액션 게임입니다.",
          description: "",
          controls: [],
          thumbnail: "games/2026-spring/basket-survivors/thumb.jpg",
          play: { path: "https://itch.io/embed-upload/17573362?color=0b0b0c", width: 1920, height: 1100 },
          links: { page: "https://bami0701.itch.io/basket-survivors3team" }
        }
      ]
    }
  ]
};
