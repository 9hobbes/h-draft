# H-Draft

<i>개발 초기 단계입니다. 받아서 사용하기에 부적당합니다. 당분간, 이 문서에서
제품 명세를 관리합니다.</i>

## 개요

이 문서는 H-Draft 앱의 기본 개념과 요구사항을 기술하고, 이를 바탕으로
전반적인 아키텍처와 몇 가지 설계 모델을 제공합니다.

## 주요 개념과 용어

### 맞춤법 교정 웹 서비스
(주)다음과 부산대학교 인공지능연구실/(주)나라인포테크에서 각각 제공하는 웹
기반의 맞춤법 교정 서비스를 지칭합니다.

### H-Draft
[일렉트론](https://github.com/electron/electron),
[Draft.js](https://github.com/facebook/draft-js) 및 맞춤법 교정 웹 서비스를 
API로 제공하는 [한스펠](https://github.com/9beach/hanspell)
기반의 크로스 플랫폼 텍스트 편집기입니다.

### 맞춤법 교정
일반적으로 맞춤법 교정은 의심되는 (하나의) 단어가 발견되면, 별도로 관리되는
올바른 단어 중에서 이와 '수학적 거리'가 짧은 단어를 찾아 제시하는 방식을
따릅니다. 영어 등의 굴절어에서는 별문제가 없지만, 교착어인 한국어는 형태소 분석
단계에서 오류가 발생할 가능성이 큽니다. 그래서 H-Draft는 사용자가 교정한
문자열을 맞춤법 인덱스에 저장한 뒤, 이 문자열이 또 발견되면 교정하는 원시적인
방식으로 작동합니다.

이 방법의 장단점은 다음과 같습니다.
* H-Draft는 형태소 분석을 하지 않기 때문에, 처음에는 맞춤법 인덱스를 가지고 있지
않습니다. 사용자가 맞춤법 교정 웹 서비스를 명시적으로 호출하여 교정하면
해당 문자열을 맞춤법 인덱스에 저장합니다. 이렇게 누적된 정보는 형태소 분석이
없어서 오탐 가능성이 희박하므로, 이후 사용 시에 같은 문자열이 또 발견되면
사용자의 명시적인 요청 없이 자동으로 적용됩니다.
* 기존의 맞춤법 교정은 제대로 된 단어만 관리하면서 이를 이용하여 의심되는 단어를
교정하지만, H-Draft는 교정할 때마다 대상 문자열을 맞춤법 인덱스에 추가합니다.
예컨대, 기존의 방식은 '프로세스'라는 단어만 관리합니다. H-Draft는
'프로세스 에서', '플로세스를', '프로서스가' 등을 모두 누적해야 합니다.
* H-Draft는 단어 경계가 맞아야만 교정합니다. 예컨대, '햇다'가 맞춤법 인덱스에
있다고 해서 '햇다면'도 교정하지 않습니다.
* 기존의 맞춤법 교정은 복수 단어, 가령 "산책 햇다"를 "산책했다"로 교정할 수
없으나 H-Draft는 가능합니다.

### 맞춤법 교정 인덱스
사용자가 맞춤법 교정 웹 서비스를 호출하지 않아도 자동으로 맞춤법을 교정할 수
있도록 H-Draft가 관리하는 데이터 베이스입니다. 맞춤법 교정 웹 서비스를 사용할수록
누적됩니다.

## 사용자 시나리오와 내부 동작

1. 앱을 실행하여 문장을 편집합니다. 최초 사용자라면 맞춤법 교정을 제안하는 점선이
생기지 않으나, 과거에 고친 문자열을 또 실수했다면 자동으로 교정되고 회색
점선이 생깁니다.
1. 회색 점선이 그어진 문자열에 마우스 오른쪽 버튼을 누르면 `되돌리기` 메뉴가 뜹니다.
1. `되돌리기` 메뉴를 선택하면 원 문자열로 되돌리고 빨간색 점선이 생깁니다.
1. `맞춤법 교정` 버튼을 누르면 맞춤법 교정 웹 서비스를 이용해서 의심되는
문자열에 빨간색 점선이 생깁니다.
1. 빨간색 점선이 그어진 문자열에 마우스 오른쪽 버튼을 누르면 `추천 문자열` 리스트,
`무시하기` 메뉴, `의심 문자열에서 제외하기` 메뉴와 `교정 정보`를 포함한 팝업이
뜹니다.
1. `무시하기` 메뉴를 선택하면 점선의 색깔이 옅은 노란색으로 변합니다.
1. 옅은 노란색 점선이 그어진 문자열에 마우스 오른쪽 버튼을 누르면 `추천 문자열`
리스트, `의심 문자열에서 제외하기` 메뉴와 `교정 정보`를 포함한 팝업이 뜹니다.
1. `의심 문자열에서 제외하기` 메뉴를 선택하면 원 문자열로 되돌리고 점선도
없어집니다. '무시'된 문자열은 맞춤법 인덱스에서 관리되지 않지만, '제외'된
문자열은 관리되며, 해당 문자열을 입력한 뒤 `직접 교정하기` 메뉴를 이용해서
편집할 수도 있습니다.
1. `추천 문자열 리스트`에서 하나 선택하면 문장이 교정되고 맞춤법 인덱스에
추가됩니다. 해당 문자열뿐 아니라 같은 패턴을 전역적으로 교정하는 옵션이
존재합니다.
1. '편집 상태'와 '교정 상태'의 구분이 따로 없으므로 점선이 그어진 문자열도 편집할
수 있습니다.
1. 'OS 기본 맞춤법 보여주기'가 존재해서 Draft.js의 맞춤법 기본 교정 기능도
활성화해서 보여줍니다. 이 경우, 점선은 그어지지만, 추천 문자열을 제시할 수
없는 때도 있으니 일부 메뉴 아이템은 비활성화됩니다.
1. 제외된 문자열 리스트를 모아서 보여주는 인터페이스가 존재합니다. 추가하거나
삭제할 수 있습니다.

## 기능 명세
텍스트 편집, 파일 관리, 자동 맞춤법 교정, 웹 서비스를 이용한 맞춤법 교정,
메뉴 아이템으로 나누어 명세화합니다. 메뉴 아이템의 명세는 앞선 명세와 중복됩니다.

자동 맞춤법 교정-맞춤법 인덱스의 검색 속도의 성능은 가장 중요한 품질 속성입니다.

### 1. 텍스트 편집
* Draft.js의 리치 텍스트 편집, 찾기, 바꾸기 등을 모두 지원합니다.
* CSS를 변경하는 것을 지원합니다.
* 전체 화면에서 '젠 모드'와 '타이프라이터 스크롤'을 지원했으면 합니다.

<i>문자열에 대한 입력/수정/삭제 시 어떤 기능이 호출되고 어떤 기능이 호출 가능해
지는지 이곳에 정리합시다.</i>

### 2. 파일 관리
* 파일 저장, 열기 등을 지원합니다.
* 버전 관리, 버전 간 차이점 보기 기능은 작가를 위한 편집기라면 지원했으면 합니다.

### 3. 자동 맞춤법 교정
#### 편집기 컨트롤의 맞춤법 API
HTML의 textarea 컴포넌트, Draft.js 등 대부분의 웹 컴포넌트는 OS가
제공하는 맞춤법 교정 기능을 이용해서 맞춤법이 의심되는 단어에 점선을 긋고
대치어로 교체하는 인터페이스를 제공합니다. 우리가 만들 Draft.js 기반의 편집기
컴포넌트는 이와 유사하게, 입력된 문장에서 원하는 패턴의 문자열에 점선을 긋고
원하는 대치어와 정보를 보여주고 교정하는 맞춤법 교정 API를 제공합니다. 단, 직접
맞춤법 교정 웹 서비스를 호출하거나 맞춤법 인덱스를 관리하지 않습니다.
새로운 단어가 입력되면 노드 모듈 작성된 맞춤법 인덱스 모듈을 통해 교정한 다음
편집기 컴포넌트가 제공하는 API를 호출하는 방식을 취합니다.

HTML 기본 컴포넌트와 차이점은 다음과 같습니다.
* 자동으로 작동하지 않습니다. 개발자가 문자열 패턴 등을 파라미터로, 명시적으로
호출해서 작동합니다.
* 맞춤법 인덱스는 API와 무관하게 외부에서 관리됩니다.
* 하나의 단어가 아닌, 원하는 패턴의 문자열을 지정할 수 있습니다.
* 대치어뿐 아니라 관련 정보를 보여주는 인터페이스를 제공합니다. 그래서
VS Code의 lint 플러그인과 비슷합니다.

#### 맞춤법 인덱스 API와 성능
맞춤법 인덱스는 다음을 지원합니다.
* 문자열을 주면 대치어 또는 null을 반환
* 문자열, 대치어 쌍 추가
* 문자열 삭제
* 제외 단어 추가/삭제

가장 큰 문제는 단어 개수의 2배 정도를 검색해야 한다는 점입니다. 다음의
문장을 살펴봅시다.

```
안녕 하세요. 저는 떠돌이 입니다.
날씨가 참좋군요.
```
최소한 다음과 같은 검색을 수행해야 합니다.
1. 안녕
1. 안녕 하세요.
1. 저는
1. 저는 떠돌이
1. 떠돌이
1. 떠돌이 입니다
1. 날씨가
1. ...

위의 예에서 '저는 떠돌이 입니다'는 검색하지 않았는데, 교정 전후로 세 단어가
차이나는 경우는 아직 보지 못했기 때문입니다.

속도가 나오지 않으면 아쉽지만, 명세에서 제외합니다.

#### 교정 문자열 후처리
예컨대, 설령 `저는 떠돌이 입니다.'를 '저는 떠돌이입니다.'로 고치라고 제시했어도,
'떠돌이 입니다'를 '떠돌이입니다'로 고치도록 저장합니다. 필요 없는 단어와 마침표를
제외했습니다. 마침표는 의미는 있지만 넣기로 하면 맞춤법 인덱스가 너무 커질 것
같습니다. 교정만 제안하고 저정하지는 않습니다.

(반례) "많은 사람들이" -> "많은 사람이"와 같은 변환은 '많은'이 붙을 때에만
'사람들이'를 고쳐야 합니다. 후처리를 하지 않아야 할 것 같습니다.

이 명세는 맞춤법 인덱스의 명세가 아니라 이를 호출하는 모듈의 명세로
보는 것이 합당합니다.

### 4. 웹 서비스를 이용한 맞춤법 교정
`맞춤법 교정` 버튼을 누르면 맞춤법 교정 웹 서비스를 이용해서 의심되는
문자열에 빨간색 점선을 생깁니다.

### 5. 메뉴 아이템
_고철, 상단 메뉴 의견 주라._
#### 빨간색 점선이 그어진 (교정 대상) 문자열의 컨텍스트 메뉴
##### 추천 문자열 리스트
##### 교정 정보
##### 직접 교정하기
##### 무시하기
##### 제외하기

#### 회색 점선이 그어진 (교정된) 문자열의 컨텍스트 메뉴
##### 되돌리기

#### 옅은 노란색 점선이 그어진 (무시된) 문자열의 컨텍스트 메뉴
##### 추천 문자열 리스트
##### 교정 정보
##### 직접 교정하기
##### 제외하기

## 주요 개발 단위
### 1. 기초적인 리액트 개발 방법 공부
* https://reactjs.org

### 2. 기초적인 Draft.js 사용법 공부
* https://github.com/nikgraf/awesome-draft-js
* https://codepen.io/Kiwka/pen/YNYvyG
* http://frontendgirl.com/8-playgrounds-for-examples-from-official-draft-js-repository-v-0-10-0/

### 3. 기초적인 일렉트론 개발 방법 공부
* https://electronjs.org

### 4. 편집기 컴포넌트 개발
#### 컨텍스트 메뉴 컴포넌트 개발
#### 교정 정보와 몇 개의 메뉴를 가진 팝업 윈도우 컴포넌트 개발
#### Draft.js 컴포넌트의 텍스트에 밑줄 넣고 메뉴나 윈도우를 뛰우는 기능 개발
### 5. 맞춤법 인덱스 모듈 개발
#### 적합한 데이터베이스 선택
#### 문장으로 맞춤법 인덱스를 검색하는 기능 개발

## 마일스톤

위에서 제시한 다섯 가지 개발 단위를 적당하게 배치하여 마일스톤을 깃헙 이슈
시스템에 정의한 뒤 백로그를 구체화해서 이슈로 등록합시다.

_고철, 마일스톤 의견 주라._

_TBL_

## 설계

다음의 네 가지 컴포넌트로 구성됩니다. 참조 관계는 일렉트론을 공부한 뒤 바로
정리합시다.

### 편집기 컴포넌트

문자열 밑의 점선은, 대상 문자열을 HTML 링크를 변경하고 점선 색깔에 맞는
스타일을 지정하는 방식으로 처리합니다. `링크 왼쪽 마우스 클릭 핸들러`는 추천
문자열과 설명을 보여주며, `추천 문자열 클릭 핸들러`는 문장을 수정하여 링크의
종류(즉 색깔)를 바꾸고 내부 맞춤법 인덱스를 수정합니다.

### 맞춤법 인덱스 모듈
교정하거나 제외된 문자열을 관리하는 데이터베이스입니다. 순수하게 Node.js로
작성하기는 힘들어 보입니다. 바이너리를 포함한 npm 패키지도 있으니 이를 중심으로
찾아봅시다.

### 파일 관리 모듈

파일을 저장하고 불러오는 Node.js 모듈입니다.

### 한스펠 모듈

한스펠 기반으로 맞춤법 검사 웹 서비스를 호출하는 Node.js 모듈입니다.
