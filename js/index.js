$(() => {
  //고양이 추가 팝업 템플릿
  const addContentTemplate = function (contentElement) {
    //contentElement = dx-popup-content
    contentElement.append(
      $("<div />")
        .attr("id", "form")
        .dxForm({
          colCount: 1,
          //formData: employee,
          items: [
            {
              itemType: "group",
              items: [
                {
                  itemType: "group",
                  caption: "Cat Image",
                  items: [
                    {
                      itemType: "button",
                      horizontalAlignment: "left",
                      buttonOptions: {
                        icon: "dragvertical",
                        text: "사진고르기",
                        onClick() {
                          axios({
                            method: "get", //통신 방식
                            url: "https://api.thecatapi.com/v1/images/search", //통신할 페이지
                            data: {}, //인자로 보낼 데이터
                          })
                            .then((response) => {
                              $("#cat-pre").attr("src", response.data[0].url);
                              $("#cat-code").text(response.data[0].id);
                            })
                            .catch((error) => {
                              console.log(error);
                            });
                        },
                      },
                    },
                  ],
                },
                {
                  itemType: "group",
                  items: [
                    {
                      itemType: "group",
                      caption: "Cat Info",
                      items: ["CatName", "Tag"],
                    },
                  ],
                },
              ],
            },
          ],
        }),
      $("<img id='cat-pre' style='width:250px; height:250px; margin:auto' />"),
      $("<p><strong>Cat Code : </strong><span id='cat-code'></span></p>")
    );
  };

  //고양이 수정 팝업 템플릿
  const editContentTemplate = function (contentElement) {
    contentElement.append(
      $("<div />")
        .attr("id", "form")
        .dxForm({
          colCount: 1,
          items: [
            {
              itemType: "group",
              items: [
                {
                  dataField: "CatId",
                  editorOptions: {
                    readOnly: true,
                  },
                  validationRules: [{ type: "required" }],
                },
                {
                  dataField: "CatCode",
                  editorOptions: {
                    readOnly: true,
                  },
                  validationRules: [{ type: "required" }],
                },
                {
                  dataField: "Like",
                  editorOptions: {
                    readOnly: true,
                  },
                  validationRules: [{ type: "required" }],
                },
              ],
            },
            {
              itemType: "group",

              items: [
                { dataField: "CatName" },
                { dataField: "Tag", editorType: "dxTextArea" },
              ],
            },
          ],
        })
    );

    //선택한 catid 에 따른 데이터 팝업에 뿌리기
    let savedData = JSON.parse(localStorage.getItem("catData"));
    let findData = savedData.find((e) => e.CatId == $("#popup").attr("name"));
    console.log(findData);
    $("input[name=CatId]").val(findData.CatId);
    $("input[name=CatCode]").val(findData.CatCode);
    $("input[name=CatName]").val(findData.CatName);
    $("input[name=Like]").val(findData.Like);
    $("textarea[name=Tag]").val(findData.Tag);
  };

  // 데이터그리드
  const grid = $("#dataGrid").dxDataGrid({
    showBorders: true,
    dataSource: JSON.parse(localStorage.getItem("catData")),
    rowAlternationEnabled: true, // 짝수 열 색 구분
    keyExpr: "CatId",

    columnFixing: { enabled: true }, //컬럼 고정

    pager: {
      visible: true,
      showPageSizeSelector: true,
      allowedPageSizes: [5, 10, 20, "all"],
      showInfo: true,
    },
    paging: {
      enabled: true,
      pageSize: 20,
    },
    columns: [
      {
        width: 100,
        alignment: "left",
        caption: "Action",
        //Edit 셀 편집 코드
        cellTemplate: function (container, options) {
          $("<a/>")
            .addClass("dx-link")
            .text("Detail")
            .on("dxclick", function () {
              $("#popup").attr("name", options.data.CatId);
              const popup = $("#popup")
                .dxPopup({
                  onHiding: () => {
                    // 팝업이 숨겨졌을때 이벤트
                    popup.dispose();
                  },
                  contentTemplate: editContentTemplate,
                  width: 700,
                  height: 650,
                  container: ".dx-viewport",
                  showTitle: true,
                  title: "Cat detail",
                  visible: false,
                  dragEnabled: false,
                  hideOnOutsideClick: true,
                  showCloseButton: true,
                  position: {
                    at: "center",
                    my: "center",
                    collision: "fit",
                  },
                  toolbarItems: [
                    {
                      widget: "dxButton",
                      toolbar: "bottom",
                      location: "after",
                      options: {
                        icon: "edit",
                        text: "Edit",
                        onClick() {
                          let editCatData = {
                            CatId: parseInt($("input[name=CatId]").val()),
                            CatCode: $("input[name=CatCode]").val(),
                            CatName: $("input[name=CatName]").val(),
                            Like: parseInt($("input[name=Like]").val()),
                            Tag: $("textarea[name=Tag]").val(),
                            //Url: $("#cat-pre").attr("src"),
                          };

                          popup.hide();
                          editData(editCatData);
                          refreshData();
                          DevExpress.ui.notify(
                            {
                              message: "데이터 수정 완료!",
                              width: 300,
                              position: {
                                my: "bottom",
                                at: "bottom",
                                of: "#dataGrid",
                              },
                            },
                            "success",
                            1000
                          );
                        },
                      },
                    },
                    {
                      widget: "dxButton",
                      toolbar: "bottom",
                      location: "after",
                      options: {
                        icon: "close",
                        text: "Close",
                        onClick() {
                          popup.hide();
                        },
                      },
                    },
                  ],
                })
                .dxPopup("instance");

              popup.show();
            })
            .appendTo(container);
        },
      },
      {
        dataField: "CatId",
        width: 100,
        validationRules: [{ type: "required" }], //추가 할때 필수 컬럼 지정
      },
      {
        dataField: "CatName",
        width: 200,
        validationRules: [{ type: "required" }], //추가 할때 필수 컬럼 지정
      },
      {
        dataField: "CatCode",

        validationRules: [{ type: "required" }],
      },
      {
        dataField: "Like",
        width: 100,
        dataType: "number",
        headerFilter: {
          // 필터 옵션 조정
          dataSource: [
            {
              text: "Less than 10",
              value: ["Like", "<", 10],
            },
            {
              text: "10 - 50",
              value: [
                ["Like", ">=", 10],
                ["Like", "<", 50],
              ],
            },
            {
              text: "50 - 100",
              value: [
                ["Like", ">=", 50],
                ["Like", "<", 100],
              ],
            },
            {
              text: "More than 100",
              value: [["Like", ">", 100]],
            },
          ],
        },
      },
      {
        dataField: "Tag",
        width: 500,
      },
    ],
    allowColumnResizing: true,
    columnResizingMode: "nextColumn",
    columnMinWidth: 50,
    allowColumnReordering: true,
    columnAutoWidth: true, //컬럼 크기 자동
    filterRow: { visible: true }, //컬럼검색여부
    headerFilter: {
      // 헤더 필터
      visible: true,
    },
    columnChooser: {
      enabled: true,
    },
    searchPanel: {
      visible: true,
      placeholder: "Search...",
    },
    selection: {
      mode: "multiple",
      deferred: true,
    },
    editing: {
      mode: "form",
      allowUpdating: false,

      form: {
        items: [
          {
            itemType: "group",
            caption: "Cat detail",
            items: [
              { dataField: "CatName" },
              { dataField: "Tag", editorType: "dxTextArea" },
            ],
          },
          {
            itemType: "group",
            items: [
              {
                dataField: "CatId",
                editorOptions: {
                  readOnly: true,
                },
              },
              {
                dataField: "CatCode",
                editorOptions: {
                  readOnly: true,
                },
              },
              {
                dataField: "Like",
                editorOptions: {
                  readOnly: true,
                },
              },
            ],
          },
        ],
      },
    },
    //Edit 눌렀을때
    onEditingStart(container, options) {
      alert(options.data.CatId);
      console.log("EditingStart");
    },
    //Save 눌렀을때
    onSaved() {
      console.log("Saved");
    },
    summary: {
      totalItems: [
        {
          displayFormat: "Total Count: {0}",
          column: "CatName",
          summaryType: "count",
        },
      ],
    },
    toolbar: {
      items: [
        {
          location: "before",
          widget: "dxButton",
          options: {
            icon: "refresh",
            text: "새로고침",
            onClick() {
              location.reload();
              //refreshData();
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
          name: "searchPanel",
          location: "before",
        },
        {
          name: "columnChooserButton",
          location: "before",
        },
        {
          location: "after",
          widget: "dxButton",
          options: {
            icon: "add",
            text: "추가",
            showClearButton: true,
            onClick() {
              const popup = $("#popup")
                .dxPopup({
                  onHiding: () => {
                    // 팝업이 숨겨졌을때 이벤트
                    popup.dispose();
                  },
                  contentTemplate: addContentTemplate,
                  width: 700,
                  height: 650,
                  container: ".dx-viewport",
                  showTitle: true,
                  title: "Add Cat",
                  visible: false,
                  dragEnabled: false,
                  hideOnOutsideClick: true,
                  showCloseButton: true,
                  position: {
                    at: "center",
                    my: "center",
                    collision: "fit",
                  },
                  toolbarItems: [
                    {
                      widget: "dxButton",
                      toolbar: "bottom",
                      location: "after",
                      options: {
                        icon: "add",
                        text: "Add",
                        onClick() {
                          let addCatData = {
                            CatId: 0,
                            CatCode: $("#cat-code").text(),
                            CatName: $("input[name=CatName]").val(),
                            Like: 0,
                            Tag: $("input[name=Tag]").val(),
                            Url: $("#cat-pre").attr("src"),
                          };

                          popup.hide();
                          saveData(addCatData);
                          refreshData();
                          DevExpress.ui.notify(
                            {
                              message: "새로운 고양이가 등록되었습니다.",
                              width: 300,
                              position: {
                                my: "bottom",
                                at: "bottom",
                                of: "#dataGrid",
                              },
                            },
                            "success",
                            1000
                          );
                        },
                      },
                    },
                    {
                      widget: "dxButton",
                      toolbar: "bottom",
                      location: "after",
                      options: {
                        icon: "close",
                        text: "Close",
                        onClick() {
                          popup.hide();
                        },
                      },
                    },
                  ],
                })
                .dxPopup("instance");
              popup.show();
            },
          },
        },
        {
          location: "after",
          widget: "dxButton",
          options: {
            icon: "trash",
            text: "삭제",
            showClearButton: true,
            onClick() {
              deleteData();
              refreshData();
              DevExpress.ui.notify(
                {
                  message: "데이터가 삭제되었습니다.",
                  width: 300,
                  position: {
                    my: "bottom",
                    at: "bottom",
                    of: "#dataGrid",
                  },
                },
                "success",
                1000
              );
            },
          },
        },
      ],
    },
  });

  document.getElementsByClassName("dx-link-edit").text = "Detail";
});
