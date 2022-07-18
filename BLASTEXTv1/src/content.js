//Establish source
const delimiter = "@"; //swapped to @ as delimiter
const database = "NCBI";
const blastTable = document.getElementById("dscTable");

//Storage
//An array of objects with the relevant properties
sampleList = [];
//see if we have an existing job, this will start und if not
const jobID = document.querySelector("#ajbt > span:nth-child(1)").innerText;
var oldJobID;
console.log("BLASTEXT Loading, this page has jobID: " + jobID);

var Sample;
Sample = Object.create({});
Sample.create = function Sample_create(
  sampleName,
  sampleIndex,
  documentName,
  totalScore,
  queryCover,
  eValue,
  percentIdentity,
  accessionNumber
) {
  var s = Object.create(Sample);
  //these are inherent based on the BLAST query
  s._sampleName = sampleName.split("(")[0].split(" ")[1];
  s._sampleIndex = sampleIndex;
  s._sampleDatabase = database;

  //these are filled in as selected, if user exports before all are completed, just add an empty cell
  //honestly, these lines are probably useless
  s._documentName = null;
  s._totalScore = null;
  s._queryCover = null;
  s._eValue = null;
  s._percentIdentity = null;
  s._accessionNumber = null;

  return s;
};

//Sample getters

Sample.getSampleName = function Sample_getSampleName() {
  return this._sampleName;
};
Sample.getSampleIndex = function Sample_getSampleIndex() {
  return this._sampleIndex;
};
Sample.getDocumentName = function Sample_getDocumentName() {
  return this._documentName;
};
Sample.getTotalScore = function Sample_getTotalScore() {
  return this._totalScore;
};
Sample.getQueryCover = function Sample_getQueryCover() {
  return this._queryCover;
};
Sample.getEValue = function Sample_getEValue() {
  return this._eValue;
};
Sample.getPercentIdentity = function Sample_getPercentIdentity() {
  return this._percentIdentity;
};
Sample.getAccessionNumber = function Sample_getAccessionNumber() {
  return this._accessionNumber;
};

//Populate Fresh Sample array
function initStorage() {
  sampleLength = document.getElementById("queryList").length;
  console.log(" Populating " + sampleLength + " samples");

  for (var i = 0; i < sampleLength; ++i) {
    //note that queryList starts at 1 and sampleList starts at 0
    var dynamicQuery = "#queryList > option:nth-child(" + (i + 1) + ")";
    console.info("    " + document.querySelector(dynamicQuery).innerText);
    sampleList.push(
      Sample.create(document.querySelector(dynamicQuery).innerText, i)
    );
  }
  console.log(" Initalized new sampleList of: " + sampleList.length + " items");
}

function commitStorage() {
  console.log("Begin save: " + jobID);
  chrome.storage.local.set({ storedSampleList: sampleList }, function () {
    console.info(" Saved sampleList");
  });
  chrome.storage.local.set({ storedJobID: jobID }, function () {
    console.log(" Saved jobID: " + jobID);
  });
}

//Recall Old Sample Array
function recallStorage() {
  sampleList;
}

//check if we are still working on the same job ID. If not, start a new save and wipe the old one
function checkStorage() {
  if (oldJobID != jobID) {
    console.log("Descrepency in jobID, initilizing new log...");
    chrome.storage.local.clear();
    initStorage();
  } else {
    console.log("JobID ok");
  }

  //samplelist check looks unstable, find more robust solution
  if (sampleList.length == 0) {
    console.log("No sample list found, initilizing new list...");
    initStorage();
  } else {
    console.log("Sample List ok");
  }

  commitStorage();
  //console.log('Found existing match for jobID, log loaded successfully');
  return;
}

function loadLocalData() {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(
      ["storedJobID", "storedSampleList"],
      function (items) {
        if (items.storedJobID != undefined) {
          console.log(" Found a jobID: " + items.storedJobID);
          oldJobID = items.storedJobID;
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
        checkStorage();
        console.info(sampleList);
        resolve(items.storedJobID);
      }
    );
  });
}
function getOldJobID() {
  console.log("Waiting for access to old jobID...");
  loadLocalData().then(function (value) {
    oldJobID = value;
  });
}

getOldJobID();

//used to input the data from the result chosen
function populateSample(sampleIndex, resultIndex) {
  console.log(
    "Function populateSample called for sample: " +
      sampleIndex +
      "\nInputting data from result: " +
      resultIndex
  );

  sampleList[sampleIndex]._documentName = getDocumentName(resultIndex);
  sampleList[sampleIndex]._totalScore = getTotalScore(resultIndex);
  sampleList[sampleIndex]._eValue = getEValue(resultIndex);
  sampleList[sampleIndex]._queryCover = getQueryCover(resultIndex);
  sampleList[sampleIndex]._percentIdentity = getPercentIdentity(resultIndex);
  sampleList[sampleIndex]._accessionNumber = getAccessionNumber(resultIndex);

  console.log(
    "The following entry was made in array index " + sampleIndex + ":"
  );
  console.info(sampleList[sampleIndex]);
}

//call whenever a result is selected
function commitInfo() {}

//Page content controllers
//Need to find how to get elements, arranged in <td> HTML
//Relevant entries
//Each row is <tr> HTML,
//Each row has an ID prefix of "dtr_*", each ID seems to be random
//Can keep track of row number with "ind"
//Relevant entry subclasses:
//"ellipsis c2" = documentName
//"c7" = totalScore
//"c8" = queryCover
//"c9" = eValue
//"c10" = percentIdentity
//"c12 1 lim" = accessionNumber

//Data retrival functions

function getSampleName() {
  result = document.querySelector(
    "#ui-ncbipopper-1 > span:nth-child(1)"
  ).innerHTML;

  //debug
  console.log("Function getSampleName returned: " + result);

  return result;
}
function getDocumentName(rowNumber) {
  result = document
    .getElementsByClassName("ellipsis c2")
    [rowNumber].getElementsByTagName("a")[0].innerText;

  //debug
  console.log(
    "Function getDocumentName returned: " +
      result +
      "\nBased on Row Number: " +
      rowNumber
  );

  return result;
}
function getTotalScore(rowNumber) {
  //need to mod index for this column
  rowNumber++;

  result = document.getElementById("dscTable").getElementsByClassName("c7")[
    rowNumber
  ].innerHTML;

  //debug
  console.log(
    "Function getTotalScore returned: " +
      result +
      "\nBased on Row Number: " +
      rowNumber
  );

  return result;
}
function getQueryCover(rowNumber) {
  //need to mod index for this column
  rowNumber++;

  result = document.getElementsByClassName("c8")[rowNumber].innerHTML;

  //debug
  console.log(
    "Function getQueryCover returned: " +
      result +
      "\nBased on Row Number: " +
      rowNumber
  );

  return result;
}
function getEValue(rowNumber) {
  //need to mod index for this column
  rowNumber++;

  result = document.getElementsByClassName("c9")[rowNumber].innerHTML;

  //debug
  console.log(
    "Function getEValue returned: " +
      result +
      "\nBased on Row Number: " +
      rowNumber
  );

  return result;
}
function getPercentIdentity(rowNumber) {
  //need to mod index for this column
  rowNumber++;

  result = document.getElementsByClassName("c10")[rowNumber].innerHTML;

  //debug
  console.log(
    "Function getPercentIdentity returned: " +
      result +
      "\nBased on Row Number: " +
      rowNumber
  );

  return result;
}

function getAccessionNumber(rowNumber) {
  result = blastTable.getElementsByClassName("c12 l lim")[rowNumber].innerText;

  //debug
  console.log(
    "Function getAccessionNumber returned: " +
      result +
      "\nBased on Row Number: " +
      rowNumber
  );

  return result;
}

function getPasteInfo(index) {
  result = [
    getSampleName(),
    database,
    getDocumentName(index),
    getTotalScore(index),
    getEValue(index),
    getQueryCover(index),
    getPercentIdentity(index),
    getAccessionNumber(index),
  ].join(delimiter);
  console.log(
    "Function getPasteInfo returned: " + result + "\nBased on Index: " + index
  );

  return result;
}

function toClipboard(resultIndex) {
  //give the pastehandler the result (probably can have the populate call handle this instead, save on resources)
  navigator.clipboard.writeText(getPasteInfo(resultIndex));

  //get the Index of the selected sample
  var list = document.getElementById("queryList");
  sampleIndex = list[list.selectedIndex].value;

  //call the populator
  populateSample(sampleIndex, resultIndex);
  commitStorage();
}
function toSampleList(resultIndex) {
  var list = document.getElementById("queryList");
  sampleIndex = list[list.selectedIndex].value;
  populateSample(sampleIndex, resultIndex);
  console.info(sampleList);
  commitStorage();
}

function addColumn() {
  const blastTable = document.getElementById("dscTable");

  var th = document.createElement("th");
  th.className = "c13";
  th.innerText = "Copy/Paste";
  blastTable.rows[0].appendChild(th);

  for (var i = 1; i < blastTable.rows.length; ++i) {
    var td = document.createElement("td");

    var btn = document.createElement("input");
    btn.type = "button";
    btn.className = "btn";
    btn.value = "Copy";
    btn.id = i;
    btn.onclick = function () {
      toClipboard(parseInt(this.id) - 1);
    };
    td.appendChild(btn);

    blastTable.rows[i].appendChild(td);
  }

  var th = document.createElement("th");
  th.className = "c14";
  th.innerText = "Save";
  blastTable.rows[0].appendChild(th);

  for (var i = 1; i < blastTable.rows.length; ++i) {
    var td = document.createElement("td");

    var schk = document.createElement("input");
    schk.type = "button";
    schk.id = "schk_" + i;
    schk.value = "Save";
    schk.name = schk.id;
    schk.onclick = function () {
      toSampleList(parseInt(this.id.slice(5)) - 1);
    };
    td.appendChild(schk);

    blastTable.rows[i].appendChild(td);
  }
}

function determineConsensus() {}

if (document.getElementById("dscTable") != undefined) {
  addColumn();
}
//obviousLitmus()
