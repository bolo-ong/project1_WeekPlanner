https://weekplanner.kro.kr/


</br>
</br>


# Week Planner
WeekPlanner는 개인의 주간 루틴을 계획하고 관리하는 데 도움을 주는 사이트 입니다.


https://github.com/bolo-ong/project1_WeekPlanner/assets/111353138/61b075fc-b0d4-4420-bf14-a0cc66c81d51


</br>
</br>


# 기술 스택</br>
- Front-end: React, Tailwind</br>
- Back-end: Node.js, Express.js, MongoDB(+Mongoose)


</br>
</br>


# 주요 기능</br>
- 로그인 및 회원가입 폼</br>
- 주간 계획 추가, 수정, 삭제</br>
- 주간 계획 시각화</br>
- JWT를 이용한 사용자 인증
##


</br>


[https://github.com/bolo-ong/project1_WeekPlanner/assets/111353138/04588894-0c11-4a61-b1df-963b024342f1](https://github.com/bolo-ong/project1_WeekPlanner/assets/111353138/8a029722-e534-4671-b20c-2be7cdaff8d0)


- Formik라이브러리를 이용한 로그인 & 회원가입 폼</br>
  미입력 or 양식에 맞지 않을 시 경고메세지 출력,
  Formik 사용 시 상황에 맞는 에러메세지 출력이 용이함을 보고 사용해 보았습니다.</br>
  프론트엔드에서 유효성 검사와 함께 로그인 시 id가 틀렸는지, pw가 틀렸는지 유저에게 알려주기 위해 백엔드에서의 유효성 검사도 구현했습니다.


</br>
</br>


https://github.com/bolo-ong/project1_WeekPlanner/assets/111353138/e41ec6f8-4e8c-4e8a-9153-460c82d77454

- CRUD
  주간계획 추가, 수정, 삭제 기본적인 CRUD기능을 구현했습니다.


</br>
</br>


https://github.com/bolo-ong/project1_WeekPlanner/assets/111353138/6e1acb2d-f312-4111-974e-6c1ba89dae14
- 요일 체크박스</br>
  각 요일 체크 시, 해당 요일의 루틴만 보입니다.</br>
  해당 페이지에 접속 시, 유저가 저장해둔 루틴 데이터를 서버에서 받아와, 스테이트에 저장해 둔 후 체크된 요일의 데이터만 필터해서 보여주게 했습니다.
  

</br>
</br>


https://github.com/bolo-ong/project1_WeekPlanner/assets/111353138/751fc80d-6acb-46b6-9e4d-e7cf6a864171
- JWT를 이용한 인증구현 </br>
  보안을 위해 accesstoken의 유효기한을 30분으로 지정하고, 대신 3일의 유효기간을 갖는 refreshtoken 같이 사용했습니다. </br>
  토큰을 쿠키에 저장했기 때문에 httpOnly속성을 부여해 클라이언트 쪽에서 JavaScript를 통해 접근할 수 없도록 하였으며, </br>
  refreshtoken이 탈취당했을 때를 대비해, RTR(Refresh Token Rotation)방식을 사용하여, </br>
  refreshtoken을 사용해 accesstoken을 재발급받을 때, refreshtoken도 재발급 시켜, 재사용을 막았습니다.
