//window.localStorage.removeItem("catData");

// 새로고침
function refreshData() {
  var ds = $("#dataGrid").dxDataGrid("instance");
  ds.refresh()
    .done(() => {
      ds.option("dataSource", JSON.parse(localStorage.getItem("catData")));
    })
    .fail((err) => {
      console.log(err);
    });
}

// cat 추가
function saveData(addCatData) {
  const savedData = JSON.parse(localStorage.getItem("catData"));

  if (savedData === null || savedData.length === 0) {
    const newData = [addCatData];
    localStorage.setItem("catData", JSON.stringify(newData));
    console.log(JSON.parse(localStorage.getItem("catData")));
  } else {
    console.log(JSON.parse(localStorage.getItem("catData")));
    let id = savedData[savedData.length - 1].CatId;
    console.log(id);
    addCatData.CatId = id + 1;
    savedData.push(addCatData);
    localStorage.setItem("catData", JSON.stringify(savedData));
    console.log(JSON.parse(localStorage.getItem("catData")));
  }
}

//cat 수정
function editData(editCatData) {
  console.log(editCatData);
  const savedData = JSON.parse(localStorage.getItem("catData"));
  let editIndex = savedData.findIndex((e) => e.CatId == editCatData.CatId);
  console.log(editIndex);
  savedData[editIndex].CatName = editCatData.CatName;
  savedData[editIndex].Tag = editCatData.Tag;
  console.log(savedData[editIndex]);
  localStorage.setItem("catData", JSON.stringify(savedData));
}

// cat 삭제
function deleteData() {
  var dg = $("#dataGrid").dxDataGrid("instance");
  dg.getSelectedRowsData().then((rowData) => {
    for (let i = 0; i < rowData.length; i++) {
      let savedData = JSON.parse(localStorage.getItem("catData"));
      let found = savedData.find((e) => e.CatId === rowData[i].CatId);
      let filterData = savedData.filter((e) => e.CatId !== rowData[i].CatId);
      localStorage.setItem("catData", JSON.stringify(filterData));
      console.log(filterData);
      console.log(JSON.parse(localStorage.getItem("catData")));
      console.log(rowData[i].CatId + ", " + found.CatId);
    }
  });
}
