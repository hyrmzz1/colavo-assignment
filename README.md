# [양혜림] 콜라보그라운드 과제 전형

## 사용 기술

- 언어 및 프레임워크: `TypeScript`, `React`
- 상태 관리
  - 클라이언트 상태: `Zustand`
  - 서버 상태: `@tanstack/react-query`
- 스타일링: `Tailwind CSS`, `shadcn-ui`
- API 통신: `Axios`
- 코드 품질 및 포맷팅: `ESLint`, `Prettier`
- 빌드: `Vite`

## 프로젝트 구조

```bash
src
 ┣ apis
 ┃ ┣ currencyCodeApi.ts  # 통화 단위 API
 ┃ ┣ instance.ts         # Axios 인스턴스 설정
 ┃ ┗ itemsApi.ts         # 시술 및 할인 항목 API
 ┣ components
 ┃ ┣ ui                  # shadcn-ui 기반 UI 컴포넌트
 ┃ ┃ ┣ button.tsx
 ┃ ┃ ┣ checkbox.tsx
 ┃ ┃ ┗ select.tsx
 ┃ ┣ CartItem.tsx        # 장바구니 항목 컴포넌트
 ┃ ┣ DiscountItem.tsx    # 할인 항목 컴포넌트
 ┃ ┗ ServiceItem.tsx     # 시술 항목 컴포넌트
 ┣ hooks                 # React Query 기반 API 데이터 조회 훅
 ┃ ┣ useGetCurrencyCode.ts # 통화 단위 조회 훅
 ┃ ┗ useGetItems.ts        # 시술 및 할인 항목 조회 훅
 ┣ layouts
 ┃ ┣ Footer.tsx          # 푸터 컴포넌트
 ┃ ┣ Header.tsx          # 헤더 컴포넌트
 ┃ ┗ Layout.tsx          # 기본 페이지 레이아웃
 ┣ lib                   # shadcn-ui 설치로 인해 생성
 ┃ ┗ utils.ts
 ┣ pages
 ┃ ┣ CartPage.tsx        # 장바구니 페이지
 ┃ ┣ DiscountPage.tsx    # 할인 선택 페이지
 ┃ ┣ Page.tsx            # 기본 페이지 설정
 ┃ ┗ ServicePage.tsx     # 시술메뉴 선택 페이지
 ┣ stores                # Zustand 상태 관리
 ┃ ┣ useCartStore.ts        # 장바구니 상태 관리
 ┃ ┣ useCurrencyCodeStore.ts # 통화 단위 상태 관리
 ┃ ┗ useViewStore.ts        # 현재 뷰 상태 관리 (장바구니, 시술메뉴, 할인)
 ┣ types
 ┃ ┗ itemTypes.ts        # 시술 및 할인 타입 정의
 ┣ utils
 ┃ ┣ cartPricing.ts      # 장바구니 내 가격 계산 유틸
 ┃ ┣ formatCurrency.ts   # 통화 변환 유틸
 ┃ ┗ formatRate.ts       # 할인율 변환 유틸 (% 또는 금액)
 ┣ App.tsx
 ┣ index.css             # 테일윈드 설정 및 커스텀 색상 정의
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
- 상태 관리 최적화
  - `selectedServices` / `selectedDiscounts`: 장바구니에 최종 추가된 항목
  - `localSelectedServices` / `localSelectedDiscounts`: 사용자가 선택했지만
    "완료" 버튼을 누르지 않은 임시 항목
  - "완료" 버튼 클릭 시 `localSelectedServices`(또는 `localSelectedDiscounts`)를
    `selectedServices`(또는 `selectedDiscounts`)로 반영해 장바구니 목록에 저장
  - "X" 버튼 클릭 시 `localSelectedServices`(또는 `localSelectedDiscounts`)를
    초기화해 임시 선택 항목을 장바구니에 반영하지 않음
  - `toggleLocalService`, `toggleLocalDiscount`을 사용하여 항목 선택 및 해제
    기능 구현
    - 동일한 항목을 다시 선택하면 해제되는 토글 방식을 적용해 중복 선택 방지

### 장바구니 기능

- 선택된 시술 및 할인 항목을 장바구니에 실시간 반영
- 시술 개수 조절 가능 (1~10개)
- 개별 항목 삭제 기능 제공 ((IoClose 버튼 클릭 시 해당 item의 count를 0으로
  업데이트해 장바구니에서 삭제되도록 구현)
- 할인 추가 및 적용 항목 설정 제공

### 할인 적용 및 실시간 총액 계산

- 할인 선택 시 모든 시술 항목에 할인 자동 적용
- 할인 대상 시술 변경 시 적용 대상 및 할인금액 UI와 합계(총 금액) 실시간
  업데이트
- 할인 적용할 시술이 없을 경우 장바구니에서 할인 항목 자동 제거

### Zustand를 활용한 전역 상태 관리

- useCartStore.ts를 사용해 장바구니 항목을 관리하며, 시술 및 할인 선택 상태를
  유지
- useViewStore.ts를 사용하여 현재 사용자가 보고 있는 페이지(시술, 할인,
  장바구니) 상태를 전역적으로 관리
- currencyCode(KRW, USD)를 zustand를 활용하여 전역 상태로 저장
- useCurrencyCodeStore.ts를 사용해 currencyCode를 관리해 데이터 조회를 하지 않는
  Footer, CartPage에서도 사용 가능하도록 개선

### React Query를 활용한 API 데이터 관리 및 성능 최적화

- React Query를 사용하여 시술 및 할인 항목 데이터 조회
- 초기 데이터 로딩 속도 개선
  - API 최초 호출 시 약 10초 정도 걸리지만, 이후 캐싱된 데이터를 활용하여 로딩
    시간을 단축
  - isPending 상태일 때 로딩 스피너를 추가하여 사용자 경험 개선
- 불필요한 API 호출 방지
  - staleTime: 5분, gcTime: 10분 설정을 적용하여 일정 시간 동안 동일한 데이터를
    반복 요청하지 않도록 최적화
  - CartPage, Footer에서 currencyCode를 필요로 할 때, 매번 API를 호출하는 대신
    Zustand에서 값을 가져오도록 변경하여 API 요청 횟수를 줄임

### 전역 상태를 활용한 금액 및 할인율 포맷팅

- currencyCode(KRW, USD)를 서버에서 받아오고, zustand를 활용하여 currencyCode를
  전역 상태로 관리
  - API 요청 없이 `Footer`, `CartPage`에서도 금액 변환 가능
- formatCurrency.ts 유틸리티 함수로 통화 변환을 처리
  - KRW일 경우 1,000원 형식으로 표기
  - USD일 경우 $10.00 형식으로 표기
- formatRate.ts 유틸리티 함수로 rate 표기
  - rate가 1 이상일 경우 currencyCode에 맞게 금액 단위로 변환
  - rate가 1 미만일 경우 % 단위로 변환하여 표기

## Trouble Shooting

### 문제: 시술 메뉴 목록 페이지, 할인 목록 페이지와 장바구니 화면 간 상태 관리 오류

장바구니에서 **시술 개수를 변경하거나 할인 적용 시술을 수정한 후**, 각 목록
페이지에서 **'완료' 버튼을 클릭해 장바구니로 돌아오면 변경 사항이 초기화되는
문제**가 발생함.

1. **시술 개수 초기화**

   - 장바구니에서 시술 메뉴 수량 변경
   - 시술 메뉴 목록 페이지에서 '완료' 버튼 클릭 후 장바구니로 이동
   - 장바구니에서 모든 시술의 수량이 초기 상태(1)로 되돌아감

2. **할인 적용 시술 초기화**
   - 장바구니에서 할인 항목을 적용할 시술을 변경 (초기 상태: 할인이 추가되기
     전에 있던 모든 시술에 적용)
   - 시술 메뉴 목록 페이지 또는 할인 목록 페이지에서 '완료' 버튼 클릭 후
     장바구니로 이동
   - 장바구니에서 모든 할인 항목이 다시 모든 시술에 다시 적용됨 (변경 사항
     초기화)

### 문제 원인

- 메뉴 리스트 화면과 장바구니 화면 간 상태 동기화 문제로 인해 수량 변경 및 할인
  적용 상태가 유지되지 않고 초기화됨.
- 원인은 `handleComplete()`에서 기존 상태를 덮어씌우는 방식

#### 1. 시술 수량 초기화 문제 원인 및 해결 방법

- **원인**

  - `setServiceCount()`가 `selectedServices`에는 반영되지만,
    `localSelectedServices`에는 반영되지 않음.
  - 이후 시술을 추가하거나 삭제한 후 `handleComplete()`가 실행되면,
    `localSelectedServices`의 값이 `selectedServices`를 덮어씌우면서 수량이 1로
    초기화됨.

- **해결 방법**

  - `setServiceCount()`에서 `localSelectedServices`도 함께 업데이트하여 시술
    수량 변경 사항이 유지되도록 수정.
  - 장바구니와 메뉴 리스트 간 상태 동기화 개선
    - `handleComplete()`가 실행될 때 기존 수량 정보가 유지되도록 처리.

### 2.할인 적용 시술 초기화 문제 원인 및 해결 방법

- **원인**

  - `toggleServiceDiscount()`에서 특정 시술에 대한 할인을 해제했지만,
    `handleComplete()`가 실행되면서 `appliedDiscounts`가 덮어씌워지면서 기존
    할인 해제 상태가 무시됨.
  - 새로운 시술이 추가될 때, 모든 할인 항목이 다시 모든 시술에 자동 적용됨.

- **해결 방법**

  - `handleComplete()`에서 기존 할인 적용 상태를 유지하여 불필요한 할인 재적용이
    발생하지 않도록 수정.
  - 시술이 삭제될 때 해당 시술에 적용된 할인도 함께 제거되도록 처리.

### 결과

- 장바구니에서 시술의 수량을 변경한 후 다른 시술을 추가/삭제해도 기존에 변경한
  수량이 유지됨.
- 할인 항목의 적용 대상 시술을 변경한 후에 시술 및 할인을 추가/삭제해도 기존에
  변경한 할인 적용 상태가 유지됨.

## 실행 방법

```bash
npm install
npm run dev
```
