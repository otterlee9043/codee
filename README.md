# 코드 데코레이션 서비스 codee

![첫페이지](https://github.com/otterlee9043/codee/assets/43086065/5ba2921b-6b7f-4530-8ec0-0eb5fc467ffd)
![편집페이지](https://github.com/otterlee9043/codee/assets/43086065/6c49225a-59fd-4a3c-abae-5c90fdb4b132)

## **개발 노트**[➡️ 📗 ⬅️](https://otterlee99.notion.site/Codee-c82de59e16694e5ea1d444fa87b6a0a8?pvs=4)

**요약 / 서비스 내용**

코드 문서화 및 리뷰를 위한 코드 데코레이션 서비스입니다. 동기화 문제로 소스 코드를 문서화하는 것이 어렵고, 긴 코드를 설명하는 방법이 마땅치 않다는 문제에서 시작하였습니다. 본 서비스는 코드 데코레이션과 주석 기능을 지원하고 Git 동기화와 데코레이션 싱크 기능을 지원하여 이 문제를 해결하고자 하였습니다. 

**주요 기능**

- 코드를 줄이고 하이라이트하는 코드 데코레이션 기능
- 코드에 댓글을 달고 링크를 연결하는 코드 주석 기능
- 데코레이션 파일 commit & push 기능

**역할**

- 2022.02 ~ 2022.6
    - ‘캡스톤디자인’ 수업의 프로젝트
    - 팀 리더로서 팀원 1명과 함께한 팀 프로젝트
    - 서비스 기획 및 Flask로 프로토타입 구현
- 2023.01 ~ 2023.05
    - 서비스 기획 내용을 토대로 Flask를 이용하여 새로 구현

**사용 기술 및 도구**

Flask, Python, Javascript, MariaDB, Docker, Nginx

**개발 내용**

- 세션을 이용한 인증
- Github OAuth2 로그인
- GIT REST API 활용하여 Git 관련 기능(commit & push) 구현
- 데코레이션과 주석 기능을 제공하는 컨텍스트 메뉴 구현

**서비스 화면**

- Github 로그인

    [screen-recording (8).webm](https://github.com/otterlee9043/codee/assets/43086065/ad206efb-76a6-4061-974b-9e806011cbce)

- 소스 코드 읽기

    [screen-recording (9).webm](https://github.com/otterlee9043/codee/assets/43086065/7776bf36-1699-4342-8b0e-343ffee0ea94)

- codee 파일 생성

    [screen-recording (10).webm](https://github.com/otterlee9043/codee/assets/43086065/db2ef689-cafb-4dbd-ae39-26ea6eb20d9d)
   
- 데코레이션 기능 (메모, 하이라이트, 단어 줄이기)

    [screen-recording (13).webm](https://github.com/otterlee9043/codee/assets/43086065/a097f9b6-dc7d-4782-908c-2529f44f9035)

- 데코레이션 및 멀티미디어 주석 기능 (줄 줄이기, 링크 및 유투브 영상 삽입)

    [screen-recording (14).webm](https://github.com/otterlee9043/codee/assets/43086065/faa73009-b940-4237-9a99-8a296456ec2d)
