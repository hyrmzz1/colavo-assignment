# [양혜림] 콜라보그라운드 과제 전형

## 사용 기술

- 언어 및 프레임워크: `TypeScript`, `React`
- 상태 관리: `Zustand`, `@tanstack/react-query`
- 스타일링: `Tailwind CSS`, `shadcn-ui`
- API 통신: `Axios`
- 코드 품질 및 포맷팅: `ESLint`, `Prettier`
- 빌드: `Vite`

## 프로젝트 구조

```bash
src
 ┣ apis
 ┃ ┣ instance.ts       # Axios 인스턴스 설정
 ┃ ┗ itemsApi.ts       # 시술 및 할인 항목 API
 ┣ components          # 재사용 가능한 컴포넌트
 ┃ ┣ ui               # shadcn-ui 기반 UI 컴포넌트
 ┃ ┃ ┣ button.tsx
 ┃ ┃ ┣ checkbox.tsx
 ┃ ┃ ┗ select.tsx
 ┃ ┣ CartItem.tsx      # 장바구니 아이템 컴포넌트
 ┃ ┣ DiscountItem.tsx  # 할인 항목 컴포넌트
 ┃ ┣ Footer.tsx
 ┃ ┣ Header.tsx
 ┃ ┗ ServiceItem.tsx   # 시술 항목 컴포넌트
 ┣ hooks
 ┃ ┗ useGetItems.ts    # react-query 기반 API 데이터 조회 훅
 ┣ layouts             # 페이지 레이아웃
 ┃ ┗ Layout.tsx
 ┣ pages               # 페이지 단위 컴포넌트
 ┃ ┣ CartPage.tsx      # 장바구니 페이지
 ┃ ┣ DiscountPage.tsx  # 할인 선택 페이지
 ┃ ┣ ServicePage.tsx   # 시술메뉴 선택 페이지
 ┃ ┗ Page.tsx          # 기본 페이지 설정
 ┣ stores              # Zustand 상태 관리
 ┃ ┣ useCartStore.ts   # 장바구니 상태 관리
 ┃ ┗ useViewStore.ts   # 현재 뷰 상태 관리 (장바구니, 시술메뉴, 할인)
 ┣ types
 ┃ ┗ itemTypes.ts      # 시술 및 할인 타입 정의
 ┣ utils
 ┃ ┗ formatCurrency.ts # 통화 변환 유틸리티 함수
 ┣ App.tsx
 ┣ index.css
 ┣ main.tsx
 ┗ vite-env.d.ts
```

## 구현 내용

### 레이아웃 및 페이지 설계

- 헤더와 푸터를 두어 일관된 UI 유지
- 헤더와 푸터의 버튼을 통해 페이지 전환 가능
- 현재 페이지 상태를 Zustand를 통해 전역 관리하여 유지

### 시술 및 할인 선택 기능

- 사용자가 원하는 시술 및 할인 항목을 선택 가능
- '완료' 버튼을 눌러야 변경 사항이 장바구니에 반영
- 'X' 버튼을 누르면 변경 사항이 저장되지 않음
- 이미 선택한 항목을 표시하여 중복 선택 방지
  - `Zustand` 상태 관리를 활용하여 선택한 항목을 전역적으로 관리
  - 동일한 아이템을 장바구니로 담을 수 없음

### 장바구니 기능

- 시술 개수 조절 가능 (1~10개)
- 장바구니에 담긴 내용이 변경될 때마다 가격 관련 UI 업데이트
- 개별 항목 삭제 기능 제공 (해당 item의 count를 0으로 업데이트)
- 할인 추가 및 적용 항목 설정 제공

### 할인 적용 및 실시간 총액 계산

- 할인 선택 시 모든 시술 항목에 할인 자동 적용
- 할인 대상 시술 변경 시 적용 대상 및 할인금액 UI와 합계(총 금액) 실시간
  업데이트
- 할인 적용할 시술이 없을 경우 장바구니에서 할인 항목 자동 제거

### API 연동 및 성능 최적화

- `React Query`를 사용해 데이터 조회 및 캐싱 최적화
- `staleTime`, `gcTime` 설정을 통해 불필요한 요청 방지

## 실행 방법

```bash
npm install
npm run dev
```
