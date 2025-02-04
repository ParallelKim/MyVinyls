# MyVinyls 프로젝트 분석

## 1. 프로젝트 개요
MyVinyls는 3D 비주얼을 활용한 인터랙티브 LP 플레이어 웹 애플리케이션입니다. 사용자들에게 실제 LP 플레이어의 경험을 디지털 환경에서 제공하는 것을 목표로 합니다.

## 2. 기술 스택
- **프론트엔드 프레임워크**: React + TypeScript
- **3D 렌더링**: Three.js (@react-three/fiber, @react-three/drei)
- **빌드 도구**: Vite
- **애니메이션**: GSAP
- **미디어 통합**: YouTube API
- **상태 관리**: Zustand (Valtio에서 마이그레이션)

## 3. 프로젝트 구조
```
src/
├── animations/         # 3D 애니메이션 관련 코드
├── components/         # React 컴포넌트
│   ├── element/       # UI 요소 컴포넌트
│   ├── groups/        # 3D 그룹 컴포넌트
│   └── models/        # 3D 모델 컴포넌트
├── constants/         # 상수 정의
├── states/           # Zustand 기반 상태 관리
├── types/            # TypeScript 타입 정의
└── utils/            # 유틸리티 함수
```

## 4. 상태 관리 구조

### 4.1 Zustand 스토어
- **sceneStore**: 씬 관련 상태 및 ref 관리
  - root, lpPlayer, station, currentRecord 등의 3D 객체 참조
  - 씬의 전반적인 상태 관리
- **albumStore**: 앨범 및 플레이어 관리
  - 현재 재생 중인 앨범 정보
  - YouTube 플레이어 상태
  - 재생 상태 및 시간 관리
- **animationStore**: 애니메이션 상태 관리
  - 현재 애니메이션 상태
  - 애니메이션 전환 관리
- **uiStore**: UI 상태 관리
  - 메뉴 상태
  - 사용자 인터페이스 설정

## 5. 주요 기능

### 5.1 3D 시각화
- 실제 LP 플레이어의 3D 모델링
- 인터랙티브한 카메라 컨트롤
- 3D 룸과 테이블 등의 환경 구현
- BVH (Bounding Volume Hierarchy) 최적화 적용

### 5.2 음악 재생
- YouTube 플레이어 통합
- LP 플레이어와 연동된 애니메이션
- 오디오 시각화 요소

### 5.3 사용자 인터페이스
- 직관적인 3D 컨트롤
- 정보 표시를 위한 Billboard 구현
- 반응형 UI 요소

## 6. 성능 최적화

### 6.1 상태 관리 최적화
- Zustand를 통한 효율적인 상태 관리
- 컴포넌트별 상태 분리로 리렌더링 최소화
- cleanup 함수를 통한 메모리 누수 방지

### 6.2 렌더링 최적화
- BVH를 통한 렌더링 최적화
- Suspense를 활용한 비동기 로딩
- 컴포넌트 계층 구조 최적화

### 6.3 애니메이션 최적화
- GSAP 타임라인을 통한 효율적인 애니메이션 관리
- easeOutLerp 함수를 통한 부드러운 전환 효과
- 불필요한 애니메이션 계산 방지

## 7. 주요 컴포넌트

### 7.1 Scene
- 메인 3D 씬 구성
- 조명 및 카메라 설정
- 모든 3D 요소의 컨테이너

### 7.2 모델 컴포넌트
- `LpPlayer`: LP 플레이어 모델 및 동작
  - 스케일 최적화 (0.01)
  - ref 기반 상태 관리
- `CustomLp`: LP 레코드 모델
  - 향상된 애니메이션 로직
  - 효율적인 상태 관리
- `Billboard`: 정보 디스플레이
  - 카메라 추적 로직
  - 동적 콘텐츠 표시

### 7.3 UI 컴포넌트
- `YTController`: YouTube 플레이어 제어
- `YTPlayer`: YouTube 플레이어 통합
- `AlbumInfo`: 앨범 정보 표시

## 8. 최근 업데이트
- Valtio에서 Zustand로 상태 관리 마이그레이션
- 씬 위치 조정 (ROOT_POSITION: [0, 0, 0])
- LP 플레이어 스케일 최적화
- 애니메이션 로직 개선
- ref 관리 방식 개선

## 9. 향후 개선 가능성
- 더 다양한 LP 모델 추가
- 사용자 플레이리스트 기능
- 소셜 기능 통합
- 모바일 최적화
- 오프라인 지원
