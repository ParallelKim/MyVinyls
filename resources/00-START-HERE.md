# MyVinyls 프로젝트

## 시작하기

MyVinyls는 3D 비주얼을 활용한 인터랙티브 LP 플레이어 웹 애플리케이션입니다.

### 1. 기술 스택
- React + TypeScript
- Three.js (@react-three/fiber, @react-three/drei)
- Zustand (상태 관리)
- GSAP (애니메이션)
- YouTube API (음악 재생)

### 2. 주요 기능
- 3D LP 플레이어 시각화
- YouTube 음악 재생 통합
- 인터랙티브 애니메이션
- 실시간 앨범 정보 표시

### 3. 프로젝트 구조
```
src/
├── animations/      # 3D 애니메이션
├── components/      # React 컴포넌트
├── constants/       # 상수 정의
├── states/         # Zustand 스토어
├── types/          # 타입 정의
└── utils/          # 유틸리티
```

### 4. 상태 관리
- **sceneStore**: 3D 씬 상태 관리
- **albumStore**: 앨범/플레이어 상태
- **animationStore**: 애니메이션 상태
- **uiStore**: UI 상태

### 5. 최근 업데이트
- Zustand 기반 상태 관리로 마이그레이션
- 씬 위치 최적화
- 애니메이션 로직 개선
- ref 관리 방식 개선

자세한 내용은 `project-analysis.md`를 참조하세요.