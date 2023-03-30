// not jquery
let scrollCount = 0;
window.onload = () => {
  let imageView = document.getElementById("image-view");
  beginImage();
  /*
  쓰로틀링?
  사용자가 이벤트를 몇 번이나 발생 시키든 일정한 시간 간격으로 한번만 실행하도록 하는 기법
  --------------------------------------------------------------------------------
  clientHeight 는 요소의 내부 높이. 패딩 값은 포함되며, 스크롤바, 테두리, 마진은 제외.
  offsetHeight 는 요소의 높이. 패딩, 스크롤 바, 테두리(Border)가 포함. 마진은 제외.
  scrollHeight  는 요소에 들어있는 컨텐츠의 전체 높이. 패딩과 테두리가 포함. 마진은 제외.
  */
  imageView.onscroll = (e) => {
    let timer = null;
    console.log(
      imageView.clientHeight + imageView.scrollTop,
      imageView.scrollHeight
    );
    //화면에 보이는 높이 + 스크롤 내린 높이 == 실제 높이 :: 스크롤이 끝점에 닿았을 때
    if (
      imageView.clientHeight + imageView.scrollTop >=
      imageView.scrollHeight
    ) {
      console.log("ㅇㅇ");
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        ++scrollCount;
        getImage(scrollCount);
      }, 500);
    }
  };
};

//초기 세팅 이미지
function beginImage() {
  sessionStorage.removeItem("sessionData");
  let tagArea = document.querySelector("#image-view");
  const savedData = JSON.parse(localStorage.getItem("catData"));
  const showData = [];
  showData.push(savedData.slice(0, 8));
  sessionStorage.setItem("sessionData", JSON.stringify(showData));

  for (let i = 0; i < showData[0].length; i++) {
    let htmltag =
      '<div class="image-components">' +
      '<div class="images" id=' +
      showData[0][i].CatId +
      ' style="background-image: url(' +
      showData[0][i].Url +
      ');" onClick = openModal(this.id)></div>' +
      '<div class="images-Like"><i class="fas fa-heart"></i><span>' +
      showData[0][i].Like +
      "</span></div>" +
      '<div class="images-tag">' +
      "<span>" +
      showData[0][i].Tag +
      "</span>" +
      "</div>" +
      "</div>";
    tagArea.insertAdjacentHTML("beforeend", htmltag); // 끝나는 태그 바로 앞에 삽입
  }
}

// 스크롤 시 이미지 가져오는 함수
function getImage(scrollCount) {
  let tagArea = document.querySelector("#image-view");
  const savedData = JSON.parse(localStorage.getItem("catData"));
  const showData = [];
  const sessionData = JSON.parse(sessionStorage.getItem("sessionData"));

  // 데이터를 8length로 나눔
  for (let i = 0; i < savedData.length; i += 8) {
    showData.push(savedData.slice(i, i + 8));
  }

  if (scrollCount == "returnSession") {
    tagArea.innerHTML = "";
    const sessionData = JSON.parse(sessionStorage.getItem("sessionData"));

    for (let i = 0; i < sessionData.length; i++) {
      for (let j = 0; j < sessionData[i].length; j++) {
        let htmltag =
          '<div class="image-components">' +
          '<div class="images" id=' +
          showData[i][j].CatId +
          ' style="background-image: url(' +
          showData[i][j].Url +
          ');" onClick = openModal(this.id)></div>' +
          '<div class="images-Like"><i class="fas fa-heart"></i><span>' +
          showData[i][j].Like +
          "</span></div>" +
          '<div class="images-tag">' +
          "<span>" +
          showData[i][j].Tag +
          "</span>" +
          "</div>" +
          "</div>";

        tagArea.insertAdjacentHTML("beforeend", htmltag); // 끝나는 태그 바로 앞에 삽입
      }
    }
  } else if (scrollCount < showData.length) {
    sessionData.push(showData[scrollCount]);
    sessionStorage.setItem("sessionData", JSON.stringify(sessionData));

    //스크롤 한번 할 때마다 8개씩 나눈 배열의 다음 인덱스에 접근
    for (let i = 0; i < showData[scrollCount].length; i++) {
      let htmltag =
        '<div class="image-components">' +
        '<div class="images" id=' +
        showData[scrollCount][i].CatId +
        ' style="background-image: url(' +
        showData[scrollCount][i].Url +
        ');" onClick = openModal(this.id)></div>' +
        '<div class="images-Like"><i class="fas fa-heart"></i><span>' +
        showData[scrollCount][i].Like +
        "</span></div>" +
        '<div class="images-tag">' +
        "<span>" +
        showData[scrollCount][i].Tag +
        "</span>" +
        "</div>" +
        "</div>";
      tagArea.insertAdjacentHTML("beforeend", htmltag); // 끝나는 태그 바로 앞에 삽입
    }
  } else {
    console.log("자료 끝");
  }
}

// 고양이 검색 함수
function searchImage(keyword) {
  let tagArea = document.querySelector("#image-view");
  //아무것도 입력되지 않으면 전체 이미지 출력
  if (keyword === "") {
    completeSearch();
    getImage("returnSession");
  } else {
    // 텍스트박스가 비어있지 않다면, 검색 수행
    // 전체 데이터(localstorage) 불러온 후 keyword가 포함된 객체만 검색
    const savedData = JSON.parse(localStorage.getItem("catData"));
    let selectedData = savedData.filter((e) => e.Tag.includes(keyword));

    // 없을 시 텍스트 출력
    if (selectedData.length < 1) {
      noSearchResult();
    }
    // 결과가 있으면, 해당 결과를 뷰에 뿌려줌
    else {
      completeSearch();
      for (let i = 0; i < selectedData.length; i++) {
        let htmltag =
          '<div class="image-components">' +
          '<div class="images" id=' +
          selectedData[i].CatId +
          ' style="background-image: url(' +
          selectedData[i].Url +
          ');" onClick = openModal(this.id)></div>' +
          '<div class="images-Like"><i class="fas fa-heart"></i><span>' +
          selectedData[i].Like +
          "</span></div>" +
          '<div class="images-tag">' +
          "<span>" +
          selectedData[i].Tag +
          "</span>" +
          "</div>" +
          "</div>";

        tagArea.insertAdjacentHTML("beforeend", htmltag);
      }
    }
  }
}

// 모달 열기 함수
function openModal(id) {
  const savedData = JSON.parse(localStorage.getItem("catData"));
  // 클래스를 지워줌(display: none 제거)
  document.querySelector(".modal").classList.remove("closeModal");
  document.querySelector(".contents-modal").classList.remove("closeModal");
  // 객체 배열 검색(클릭한 id값을 가진 객체 추출)
  let selectedData = savedData.find((e) => e.CatId == id);

  document.getElementById("catName-modal").innerHTML = selectedData.CatName;

  let htmltag =
    '<div class="image-components" style="height:100%">' +
    '<div class="images-modal" id=' +
    id +
    ' style="background-image: url(' +
    selectedData.Url +
    ');"></div>' +
    '<div class="images-Like"><i id="heart" class="far fa-heart" onClick=debouncing() style="font-size: 20px; margin-left: 1%; cursor: pointer;"></i><span id="likeCount">' +
    selectedData.Like +
    "</span></div>" +
    '<div class="images-tag">' +
    "<span>" +
    selectedData.Tag +
    "</span>" +
    "</div>" +
    "</div>";

  document
    .querySelector(".body-modal")
    .insertAdjacentHTML("beforeend", htmltag);

  let Modal = document.querySelector(".modal");

  // 클릭한 타겟 감지해서 modal div 면 close, 아니면 false 반환해서 아무이벤트 일어나지 않게함
  window.addEventListener("click", (e) => {
    e.target === Modal ? closeModal() : false;
  });
}

let timer = null;
let cnt = 0; //클릭 횟수
function debouncing() {
  cnt += 1;
  console.log("클릭!", cnt);
  let heart_icon = document.getElementById("heart");
  heart_icon.classList.add("fas"); //꽉찬하트 추가
  heart_icon.classList.remove("far"); //빈하트 제거

  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    const savedData = JSON.parse(localStorage.getItem("catData"));
    let catIdForLike = document.getElementsByClassName("images-modal")[0].id;
    let editIndex = savedData.findIndex((e) => e.CatId == catIdForLike);

    let likeCount = document.getElementById("likeCount").innerText;
    likeCount = parseInt(likeCount) + cnt;
    document.getElementById("likeCount").innerText = likeCount;
    savedData[editIndex].Like = likeCount;
    localStorage.setItem("catData", JSON.stringify(savedData));
    heart_icon.classList.remove("fas"); //꽉찬하트 제거
    heart_icon.classList.add("far"); //빈하트 추가
    cnt = 0;
  }, 300);
}

function likeCount() {
  console.log(document.getElementsByClassName("images-modal")[0].id); //해당하는 클래스의 id값 가져오기
  let heart = document.getElementById("heart");
  heart.classList.add("fas");
  heart.classList.remove("far");
}

// 모달 닫는 함수
function closeModal() {
  // closeModal 클래스 추가(display: none)
  // 모달 바디 비워주기
  document.querySelector(".contents-modal").classList.add("closeModal");
  document.querySelector(".modal").classList.add("closeModal");
  document.querySelector(".body-modal").innerHTML = "";
  getImage("returnSession");
}

// jQuery toolbar

$(() => {
  const loadingBar =
    '<div id="loadingBar" style="display:none">' +
    '<i class="fas fa-spinner fa-spin"></i>' +
    "<span>&nbsp&nbsp검색 중입니다...</span>" +
    "</div>";
  const seachResultIsNone =
    '<div id="seachResultIsNone" style="display:none">' +
    "<span>&nbsp&nbsp검색 결과가 없습니다.</span>" +
    "</div>";
  $("#app-container").append(loadingBar);
  $("#app-container").append(seachResultIsNone);

  $("#searching").dxToolbar({
    items: [
      {
        location: "before",
        widget: "dxButton",
        options: {
          icon: "refresh",
          text: "새로고침",
          onClick() {
            location.reload();
            DevExpress.ui.notify(
              {
                message: "새로고침 완료!",
                width: 300,
                position: {
                  my: "bottom",
                  at: "bottom",
                  of: "#app-container",
                },
              },
              "info",
              1000
            );
          },
        },
      },
      {
        widget: "dxTextBox",
        location: "before",

        options: {
          placeholder: "고양이를 검색하세요. (Tag)",
          showClearButton: true,
          width: 240,
          valueChangeEvent: "keyup",
          onValueChanged(data) {
            isSearching();
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
              //검색 결과 띄우기
              searchImage(data.value);
            }, 300);
          },
        },
      },
    ],
  });
});

function isSearching() {
  document.getElementById("image-view").style.visibility = "hidden";
  document.getElementById("loadingBar").style.display = "";
  document.getElementById("seachResultIsNone").style.display = "none";
}

function completeSearch() {
  document.getElementById("image-view").style.visibility = "visible";
  document.getElementById("image-view").innerHTML = "";
  document.getElementById("loadingBar").style.display = "none";
  document.getElementById("seachResultIsNone").style.display = "none";
}

function noSearchResult() {
  document.getElementById("image-view").style.visibility = "hidden";
  document.getElementById("loadingBar").style.display = "none";
  document.getElementById("seachResultIsNone").style.display = "";
}
