# 수동 동작 시나리오

English: [scenarios.md](scenarios.md)

아래 시나리오는 에이전트 스킬 자체를 평가하기 위한 인수 기준입니다. Node 테스트는 설정 검증기와 구체적인 fixture 파일을 확인하지만 언어 모델을 실행하거나 모든 저장소 이해를 증명하지는 않습니다.

## 기존 구조와 충돌

`fixtures/next-intl-app`과 `en-US` / `ja-JP`를 선언한 TOML을 사용합니다. 라우팅(`en`/`ko`), 요청별 카탈로그와 복수 메시지를 추적합니다. 관찰한 식별자와 원하는 상태에서 지원되지 않는 로케일을 충돌로 보고하고, `en`/`ko`를 보존하며, 외부 로케일 ID와 `ja-JP`의 제품 상태를 질문해야 합니다. 라이브러리나 라우트를 임의로 변경하지 않습니다.

`fixtures/typescript-dictionary`에서 `fr` 추가 요청을 합니다. 저장된 사용자 설정 > 브라우저 언어 > `ko` 순서, TypeScript 사전, 배포 산출물, 사전 동등성 테스트를 확인합니다. 아직 불명확하면 프랑스어를 선택 가능하게 할지와 제품 로케일 ID를 묻습니다. 생성 번들을 직접 편집하거나 사내 사전을 프레임워크로 교체하지 않습니다.

## fallback과 리소스 소유권

`fixtures/custom-json`을 사용합니다. 코드는 `fr-CA`가 `fr`, 그 다음 `en`으로 fallback되고, `fr` 키가 없으면 `en`, 어느 곳에도 키가 없으면 `undefined`가 됨을 보여줍니다. 이를 관찰한 동작으로 보고하고, 작업 요구가 없는 한 새 정책을 제안하지 않습니다.

`fixtures/i18next-app`을 사용합니다. `src` 아래 기능별 카탈로그를 소스로, `dist`를 생성 산출물로 취급합니다. namespace 소유권을 보존하고, migration 전 생성 경로를 조사할 대상으로 보고합니다.

## 구문, 범위와 플랫폼

`fixtures/placeholder-mismatch`와 `fixtures/invalid-icu`를 사용합니다. `{userName}` 불일치와 필수 `other` 분기가 빠진 ICU 메시지를 잘못된 계약으로 보고합니다. 로케일 간 복수 분기 일치를 요구하지 않습니다. 범주는 언어별로 다릅니다. 번역 문구를 임의로 고치지 않습니다.

`fixtures/monorepo`에서는 서로 독립적인 웹 라우트·카탈로그, Android XML 리소스와 API 오류 코드를 보존합니다. 안정적인 코드를 번역하거나 API가 화면 문구를 소유한다고 가정하지 않습니다.

`fixtures/backend-localized-errors`와 `fixtures/native-cli`에서 UI 외 메시지, 기계용 플래그·코드, Fluent 선택자와 언어별 문법을 살펴봅니다. 현지화 오류 메시지가 API/CLI 호환성을 바꾸는데 의도가 문서화되어 있지 않다면 질문합니다.

`fixtures/rtl-web`에서는 RTL 로케일이 설정되고 마크업과 CSS 방향이 노출되어 있습니다. 런타임 로케일 변경 때 방향 메타데이터도 바뀌는지 확인합니다. 구현·시각 동작 근거가 없으면 문자열만으로 RTL 지원을 단정하지 말고 미지 사항으로 보고합니다.

`fixtures/empty-static`은 새 구조가 없는 사례입니다. `lang="en"`과 일부 한국어 콘텐츠만으로 현지화 의도를 확정하지 않습니다. 사용자 의도로 로케일 ID, 현지화할 페이지, URL 정책과 콘텐츠 소유권을 결정하기 전에 프레임워크를 제안하지 않습니다.
