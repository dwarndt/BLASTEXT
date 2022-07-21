let activeItem = null;
const dragItems = document.querySelectorAll(".dragItem");

// attach the dragstart event handler
dragItems.forEach((dragItem) => {
  dragItem.addEventListener("dragstart", dragStart);
  dragItem.addEventListener("dragend", dragEnd);
});

// handle the dragstart

function dragStart(e) {
  console.log("clear");
  activeItem = this;
  setTimeout(() => {
    e.target.classList.add("hide");
  }, 0);
}
function dragEnd(e) {
  this.className = "dragItem";
  dragItem = null;
}
function dragDrop() {
  console.log(activeItem);
  console.log("drag dropped");
  if (activeItem == null) {
    return;
  }
  this.append(activeItem);
  if (document.getElementById("inputField").children.length != 1) {
    console.log("hiding...");
    nullItem1.style.display = "none";
  } else if (document.getElementById("inputField").children.length == 1) {
    console.log("hiding...");
    nullItem1.style.display = "block";
  }
}

const fields = document.querySelectorAll(".field");

fields.forEach((field) => {
  field.addEventListener("dragenter", dragEnter);
  field.addEventListener("dragover", dragOver);
  field.addEventListener("dragleave", dragLeave);
  field.addEventListener("drop", dragDrop);
});

function dragEnter(e) {
  e.preventDefault();
}

function dragOver(e) {
  e.preventDefault();
  console.log("drag over registered");
}

function dragLeave(e) {}

let handleClick = (e) => {
  Array.from(document.querySelectorAll(".active"), (e) =>
    e.classList.remove("active")
  ); // remove `active` class from every elements which contains him.
  //Start with output tab active
  e.target.classList.add("active");
  document
    .querySelector(`div.tabcontent[data-id*="${e.target.dataset.id}"]`)
    .classList.add("active");
};

Array.from(document.getElementsByClassName("tablinks"), (btn) =>
  btn.addEventListener("click", handleClick, false)
);
t1.classList.add("active"); //start with one active

var copyButton = document.querySelector("#copyButton");
copyButton.addEventListener(
  "click",
  function () {
    var urlField = document.querySelector("#outputTable");

    // create a Range object
    var range = document.createRange();
    // set the Node to select the "range"
    range.selectNode(urlField);
    // add the Range to the set of window selections
    window.getSelection().addRange(range);

    // execute 'copy', can't 'cut' in this case
    document.execCommand("copy");
  },
  false
);

delButton.addEventListener("click", clearLocalData);

var JobId;
var sampleList = [];
function loadLocalData() {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(
      ["storedJobID", "storedSampleList"],
      function (items) {
        if (items.storedJobID != undefined) {
          console.log(" Found a jobID: " + items.storedJobID);
          JobID = items.storedJobID;
        } else {
          console.log(" No jobID found");
        }

        if (items.storedSampleList != undefined) {
          console.log(" Found a sampleList: " + items.storedSampleList);
          for (var i of items.storedSampleList) {
            sampleList.push(i);
          }
        } else {
          console.log(" No sampleList found");
        }
        console.info(sampleList);

        resolve(items.storedJobID);
        toggleError()
        populateTable();
      }
    );
  });
}
function clearLocalData() {
  console.log("Clearing local data");
  chrome.storage.local.clear();
  sampleList = [];
  toggleError(true);
}

loadLocalData();

var desiredOutput = [
  "_sampleName",
  "_sampleDatabase",
  "_documentName",
  "_totalScore",
  "_eValue",
  "_queryCover",
  "_percentIdentity",
  "_accessionNumber",
];

function populateTable() {
  //for each column
  //for each row

  for (var i = 0; i < sampleList.length; ++i) {
    var tr = document.createElement("tr");
    tr.className = "row" + i;
    tr.id = i;

    for (var j = 0; j < desiredOutput.length; j++) {
      var td = tr.appendChild(document.createElement("td"));
      td.className = "o" + j;

      console.log(sampleList[i]);
      console.log(desiredOutput[j]);

      contents = sampleList[i][desiredOutput[j]];
      if (contents == null) {
        contents = "[null]"; //if nothing has been recorded, put a placeholder
      }
      td.innerHTML = contents;
    }

    toggleError()

    console.info(outputTable);
    outputTableBody.appendChild(tr);
  }
}

function toggleError(clearVar){
  if(clearVar == true){
  clearError.style.display = "block"
  dataError.style.display = "none"
  outputTable.style.display = "none";
  }
  else if(sampleList.length == 0 | sampleList === null){
  clearError.style.display = "none"
  dataError.style.display = "block"
  outputTable.style.display = "none";
  }
  else{
  clearError.style.display = "none"
  dataError.style.display = "none"
  outputTable.style.display = "block";
  }
}