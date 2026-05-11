# Chapter 6. Next.js 상태 관리와 데이터 페칭

> **미션**: 블로그에 인터랙션을 더한다 — 상태 관리와 데이터 페칭으로 동적 UI를 만든다

### 학습목표

useState로 컴포넌트의 상태를 관리하고 이벤트를 처리할 수 있다

useEffect로 사이드 이펙트를 처리하고 의존성 배열의 역할을 설명할 수 있다

Server Component와 Client Component의 차이를 이해하고 적절히 선택할 수 있다

서버/클라이언트 양쪽의 데이터 페칭 패턴을 구현할 수 있다

Context API로 전역 상태를 관리하고 커스텀 훅으로 로직을 재사용할 수 있다

### 6.1 useState와 이벤트 처리

Ch5에서 블로그의 페이지 구조를 만들었다. 목록, 상세, 작성 페이지가 있지만 아직 "동작"이 없다. 검색을 입력해도 반응이 없고, 글을 써도 저장되지 않는다. 이 장에서 **상태**(State)와 **이벤트**(Event)를 배워 블로그에 생명을 불어넣는다.

#### 6.1.1 상태의 개념과 useState

Ch5에서 배운 Props는 **읽기 전용**이었다. 부모가 전달한 데이터를 표시할 수만 있고, 변경할 수 없었다. **상태**(State)는 컴포넌트가 스스로 **기억하고 변경할 수 있는 데이터**이다.


> **라이브 코딩 시연**: 위 좋아요 버튼을 브라우저에서 클릭하며 숫자가 증가하는 것을 보여준다. "버튼을 클릭할 때마다 React가 화면을 다시 그린다"는 점을 강조한다.

일반 변수(**let count = 0**

)로는 이것이 불가능하다. **let**

을 바꿔도 React는 화면을 다시 그리지 않는다.

**표 6.2** 일반 변수 vs useState

| 항목              | **let count = 0** | **useState(0)** |
| ----------------- | ----------------------- | --------------------- |
| 값 변경           | **count = 1**     | **setCount(1)** |
| 화면 업데이트     | 안 됨                   | 자동으로 다시 렌더링  |
| 값 유지           | 렌더링마다 초기화       | 렌더링 사이에 유지    |
| "use client" 필요 | 아니오                  | **예**          |

**useState**

는 **React Hook**이다. Hook은 **use**

로 시작하는 특별한 함수이며, 컴포넌트에 기능을 "연결"(hook)한다. Hook을 사용하는 컴포넌트는 반드시 **"use client"**

 파일이어야 한다.

#### 6.1.2 이벤트 핸들러 작성

사용자의 동작(클릭, 입력, 폼 제출)에 반응하려면 **이벤트 핸들러**(Event Handler)를 연결한다:


**표 6.3** 주요 이벤트 핸들러

| 이벤트              | 발생 시점         | 주요 용도               |
| ------------------- | ----------------- | ----------------------- |
| **onClick**   | 요소 클릭 시      | 버튼, 카드 클릭         |
| **onChange**  | 입력값 변경 시    | input, select, textarea |
| **onSubmit**  | 폼 제출 시        | 폼 전체 처리            |
| **onKeyDown** | 키보드 키 누를 때 | 단축키, Enter 검색      |

이벤트 핸들러의 명명 규칙: **handle**

+ 이벤트 이름 (예: **handleClick**

, **handleChange**

, **handleSubmit**

). AI가 생성한 코드에서 이 패턴이 보이면 이벤트 처리 코드임을 알 수 있다.

#### 6.1.3 폼 입력 처리

게시글 작성 폼처럼 여러 입력 필드가 있을 때는 **객체 상태**로 관리한다. 이런 방식을 **제어 컴포넌트**(Controlled Component)라 부른다 — 입력값을 React state가 "제어"한다:


**코드 읽기 포인트**:

**setForm({ ...form, [name]: value })**

 — Ch4에서 배운 스프레드 연산자로 **불변성 유지**

**[name]: value**

 — 대괄호 안의 변수가 키 이름이 됨 (Ch4 계산된 프로퍼티)

**e.preventDefault()**

 — 폼 제출 시 페이지 새로고침 방지

**form.title.trim()**

 — 공백만 있는 제목 방지

#### 6.1.4 상태 업데이트와 불변성

React에서 상태를 업데이트할 때는 **기존 상태를 직접 수정하면 안 된다**. 새로운 값을 만들어서 교체해야 한다. 이것을 **불변성**(Immutability)이라 한다:


> [버전 고정] Next.js 16.2.1, React 19.2.4, Tailwind CSS 4, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2 기준으로 작성해줘.
> [규칙] App Router만 사용하고 next/router, pages router, 구버전 API는 사용하지 마.
> [검증] 불확실하면 현재 프로젝트 package.json 기준으로 버전을 먼저 확인하고 답해줘.
> "React에서 posts 배열 state를 불변성을 유지하면서 추가, 수정, 삭제하는 코드를 보여줘. 스프레드 연산자와 map/filter 사용. push, splice 같은 직접 수정은 하지 마."

이 패턴은 Ch10에서 Supabase CRUD와 연결할 때 다시 등장한다. 서버에서 데이터를 추가/수정/삭제한 후, 로컬 state도 같은 방식으로 업데이트한다.

### 6.2 useEffect와 사이드 이펙트

#### 6.2.1 useEffect 기본 사용법

**사이드 이펙트**(Side Effect)는 렌더링 이외의 작업이다: API 호출, 타이머 설정, 외부 라이브러리 초기화 등. ****useEffect**

**는 컴포넌트가 화면에 나타난 후 사이드 이펙트를 실행한다:


#### 6.2.2 의존성 배열

**useEffect**

의 두 번째 인자인 **의존성 배열**(Dependency Array)이 실행 시점을 결정한다:

**표 6.4** 의존성 배열에 따른 실행 시점

| 의존성 배열           | 실행 시점                  | 용도                           |
| --------------------- | -------------------------- | ------------------------------ |
| **[]**(빈 배열) | 마운트 시**1회**     | API 초기 호출, 구독 설정       |
| **[query]**     | **query**변경 시마다 | 검색어 변경 시 재검색          |
| 생략                  | **매 렌더링마다**    | 거의 사용하지 않음 (성능 문제) |


#### 6.2.3 클린업 함수

useEffect에서 **return**

하는 함수는 **클린업**(Cleanup) 함수이다. 컴포넌트가 사라지거나 effect가 다시 실행되기 전에 호출된다:


클린업을 하지 않으면 메모리 누수가 발생한다. AI가 **setInterval**

이나 이벤트 리스너를 사용하면서 클린업 함수를 빠뜨리는지 확인해야 한다.

> ![⚠️]() AI 주의사항: Copilot은 useEffect 안에서 setInterval이나 addEventListener를 사용하면서 클린업 함수를 빠뜨리는 경우가 많다. return 문이 있는지 반드시 확인한다.

### 6.3 Server Component vs Client Component

이것은 Next.js App Router에서 **가장 중요한 개념**이다. Ch5에서 **"use client"**

를 몇 번 사용했는데, 이제 정확히 이해할 차례이다.

#### 6.3.1 "use client" 지시어

Next.js App Router에서 모든 컴포넌트는 기본적으로 **서버 컴포넌트**(Server Component)이다. 서버에서 실행되어 HTML을 생성한 후 브라우저에 전송한다. 브라우저에서 인터랙션(클릭, 입력)이 필요하면 파일 맨 위에 **"use client"**

를 추가하여 **클라이언트 컴포넌트**(Client Component)로 전환한다:


#### 6.3.2 언제 서버 컴포넌트를 쓰는가

데이터를 가져오기만 하고 사용자 인터랙션이 없을 때

API 키나 데이터베이스에 직접 접근할 때 (보안)

큰 라이브러리를 사용할 때 (브라우저에 보내는 코드 양 감소)

#### 6.3.3 언제 클라이언트 컴포넌트를 쓰는가

**useState**

, **useEffect**

, **useRouter**

 같은 **Hook**을 사용할 때

**onClick**

, **onChange**

 같은 **이벤트 핸들러**가 필요할 때

브라우저 API(localStorage, window)를 사용할 때

**표 6.5** Server Component vs Client Component

| 항목               | Server Component       | Client Component                |
| ------------------ | ---------------------- | ------------------------------- |
| 선언               | 기본 (아무것도 안 씀)  | **"use client"**파일 맨 위      |
| 실행 위치          | 서버                   | 브라우저 (+ 서버 초기 렌더링)   |
| useState/useEffect | 사용 불가              | 사용 가능                       |
| onClick/onChange   | 사용 불가              | 사용 가능                       |
| async/await        | 컴포넌트 자체에서 가능 | 컴포넌트 자체에서 불가          |
| 데이터베이스 접근  | 가능 (보안)            | 불가 (Supabase 클라이언트 제외) |
| 번들 크기          | 브라우저에 포함 안 됨  | 브라우저에 포함됨               |

**좋은 프롬프트 vs 나쁜 프롬프트**:

> **나쁜 프롬프트**
> "게시글 목록 페이지 만들어줘"

> [버전 고정] Next.js 16.2.1, React 19.2.4, Tailwind CSS 4, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2 기준으로 작성해줘.
> [규칙] App Router만 사용하고 next/router, pages router, 구버전 API는 사용하지 마.
> [검증] 불확실하면 현재 프로젝트 package.json 기준으로 버전을 먼저 확인하고 답해줘.
> "app/posts/page.tsx를 Server Component로 만들어줘. 데이터는 lib/posts.ts에서 가져와. 검색 기능이 필요한 SearchBar는 별도 Client Component(components/SearchBar.tsx)로 분리해줘. 'use client'는 SearchBar에만 적용."

나쁜 프롬프트는 AI가 전체 페이지를 **"use client"**

로 만들어 버릴 수 있다. 서버/클라이언트 구분을 명시하면 올바른 구조가 나온다.

> **라이브 코딩 시연**: 블로그에 상태 관리와 데이터 페칭을 추가하는 과정을 시연한다. 구체적으로 (1) 검색 기능(useState + filter), (2) 서버 컴포넌트에서 데이터 가져오기(async/await fetch), (3) 클라이언트 컴포넌트에서 데이터 가져오기(useEffect + fetch) 3가지를 순서대로 구현한다.

### 6.4 데이터 페칭 패턴

#### 6.4.1 서버 컴포넌트에서 fetch

서버 컴포넌트는 **컴포넌트 함수 자체를 **async**

**로 만들 수 있다. 이것이 Next.js App Router의 가장 큰 장점이다:


서버 컴포넌트에서 fetch하면: (1) API 키가 브라우저에 노출되지 않고, (2) 로딩 상태를 직접 관리할 필요 없이 **loading.tsx**

가 자동으로 처리하고, (3) 브라우저에 보내는 JavaScript 양이 줄어든다.

#### 6.4.2 클라이언트 컴포넌트에서 useEffect + fetch

사용자 인터랙션에 따라 데이터를 가져와야 할 때는 클라이언트 컴포넌트에서 **useState + useEffect + fetch** 패턴을 사용한다:


#### 6.4.3 로딩/에러 상태 처리

클라이언트 컴포넌트에서 데이터를 가져올 때는 **3가지 상태**를 관리해야 한다:

**로딩 중** (**isLoading: true**

) — 스피너 또는 "로딩 중..." 표시

**에러 발생** (**error: "메시지"**

) — 에러 메시지 표시

**데이터 도착** (**posts: [...]**

) — 정상 화면 표시

이 패턴은 Ch8~12에서 Supabase 데이터를 다룰 때 계속 반복된다. 지금 확실히 익혀두자.

### 6.5 Context API와 커스텀 훅

#### 6.5.1 전역 상태와 Context

Props로 데이터를 전달하면 부모->자식->손자로 깊이 내려갈수록 번거로워진다. **Context API**는 컴포넌트 트리 전체에 데이터를 "방송"한다:


사용 방법:



#### 6.5.2 커스텀 훅으로 로직 재사용

**커스텀 훅**(Custom Hook)은 상태 로직을 함수로 추출하여 여러 컴포넌트에서 재사용하는 패턴이다. 이름은 반드시 **use**

로 시작한다:


> [버전 고정] Next.js 16.2.1, React 19.2.4, Tailwind CSS 4, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2 기준으로 작성해줘.
> [규칙] App Router만 사용하고 next/router, pages router, 구버전 API는 사용하지 마.
> [검증] 불확실하면 현재 프로젝트 package.json 기준으로 버전을 먼저 확인하고 답해줘.
> "usePosts 커스텀 훅을 만들어줘. JSONPlaceholder에서 게시글을 가져오고, posts, isLoading, error를 반환해줘. 'use client' 파일로 만들어줘."

### 핵심 정리 + B회차 과제 스펙

#### 이번 시간 핵심 3가지

**useState**로 상태를 관리하고, **이벤트 핸들러**로 사용자 동작에 반응한다. 상태 업데이트 시 **불변성**을 유지한다 (push 대신 스프레드/filter/map)

**Server Component**(기본)는 서버에서 async/await로 데이터를 가져오고, **Client Component**(**"use client"**

)는 브라우저에서 useState/useEffect를 사용한다

**Context API**는 트리 전체에 데이터를 공유하고, **커스텀 훅**(**use**

 접두사)으로 로직을 재사용한다

#### B회차 과제 스펙

**블로그 프론트엔드 완성** (더미 데이터):

게시글 검색 기능 — SearchBar를 Client Component로 분리, useState + filter

게시글 작성 폼 — 제어 컴포넌트 패턴, 유효성 검증 (제목 비어있으면 경고)

게시글 삭제 기능 — confirm 후 filter로 제거, 불변성 유지

서버 데이터 페칭 — JSONPlaceholder API에서 데이터 가져오기

#### Skills 활용 가이드 (B회차 적용)

**nextjs-basic-check**

: Server/Client Component 분리와 **"use client"**

 범위를 점검한다.

**api-safety-check**

: 데이터 페칭의 **try-catch**

와 사용자 에러 메시지 처리를 점검한다.

권장 타이밍: 체크포인트 2 완료 후 1회, 제출 전 1회.

B회차에서는 Ch5에서 만든 블로그 프로젝트를 이어서 사용한다.
