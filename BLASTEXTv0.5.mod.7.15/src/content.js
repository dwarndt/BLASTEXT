//Storage
  //An array of objects with the relevant properties

var Sample
Sample = Object.create({});
Sample.create = function Sample_create (sampleName, sampleIndex, documentName, totalScore, queryCover, eValue, percentIdentity, accessionNumber) {
	
	var s = Object.create(Sample);
	//these are inherent based on the BLAST query
	s._sampleName = sampleName.split('(')[0].split(' ')[1];
	s._sampleIndex = sampleIndex;
	
	//these are filled in as selected, if user exports before all are completed, just add an empty cell
	//honestly, these lines are probably useless
	s._documentName = null;
	s._totalScore = null;
	s._queryCover = null;
	s._eValue = null;
	s._percentIdentity = null;
	s._accessionNumber = null;

	return s
};

//Sample getters

Sample.getSampleName = function Sample_getSampleName () {
	return this._sampleName
};
Sample.getSampleIndex = function Sample_getSampleIndex () {
	return this._sampleIndex
};
Sample.getDocumentName = function Sample_getDocumentName () {
	return this._documentName
};
Sample.getTotalScore = function Sample_getTotalScore () {
	return this._totalScore
};
Sample.getQueryCover = function Sample_getQueryCover () {
	return this._queryCover
};
Sample.getEValue = function Sample_getEValue () {
	return this._eValue
};
Sample.getPercentIdentity = function Sample_getPercentIdentity () {
	return this._percentIdentity
};
Sample.getAccessionNumber = function Sample_getAccessionNumber () {
	return this._accessionNumber
};

//Populate Sample array

function initStorage(){
   sampleList = []
   sampleLength = document.getElementById("queryList").length;
   console.log("Populating " + sampleLength + " samples");
   for(var i = 0; i < sampleLength; ++i){
	  //note that queryList starts at 1 and sampleList starts at 0
	  var dynamicQuery = "#queryList > option:nth-child(" + (i+1) +")"
	  console.info(document.querySelector(dynamicQuery).innerText);
	  sampleList.push(Sample.create(document.querySelector(dynamicQuery).innerText,i));
	  };
   console.info(sampleList);
   return sampleList;
}

initStorage();

function selectResult(){

}

function storeInfo(index){
}

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

//Establish source
const blastTable = document.getElementById('dscTable');
console.info(blastTable)
console.info(blastTable.getElementsByClassName("ellipsis c2")[3].getElementsByTagName('a')[0].title);
console.info(blastTable.getElementsByClassName("c7")[3].innerHTML)

//Seperate version
function getSampleName(){
	 return (document.querySelector("#ui-ncbipopper-1 > span:nth-child(1)").innerHTML);
	 }
function getDocumentName(rowNumber){
         return(document.getElementsByClassName("ellipsis c2")[3].getElementsByTagName('a')[0].title.slice(20));
         }

function getTotalScore(rowNumber){
	 console.info(rowNumber)
	 value = document.getElementById('dscTable').getElementsByClassName("c7")[rowNumber].innerHTML;
	 console.info(value);
	 return(value)
}
function getQueryCover(rowNumber){
	 return(document.getElementsByClassName("c8")[rowNumber].innerHTML)
}
function getEValue(rowNumber){
	 return(document.getElementsByClassName("c9")[rowNumber].innerHTML)
}
function getPercentIdentity(rowNumber){
	 return(document.getElementsByClassName("c10")[rowNumber].innerHTML)
}

//Compound version (remove later)
function getScores(rowNumber){
         return([getTotalScore(rowNumber),getEValue(rowNumber),getQueryCover(rowNumber),getPercentIdentity(rowNumber)].join(delimiter));//changed to reflect actual format
         }

function getAccessionNumber(rowNumber){
         let entry = blastTable.getElementsByClassName("c12 l lim")[rowNumber-1];
         let name = entry.getElementsByTagName('a')[0].title;
         return(name.slice(16));
         } 

function getPasteInfo(index){
  //some reason index has to be offset for everything BUT Name and Acc. Number
  const rowNumber = index+1;
  const delimiter = '@';	//swapped to @ as delimiter
  const database = 'NCBI'
    var output = (getSampleName() + delimiter + database + delimiter + getDocumentName() + delimiter + getScores() + delimiter + getAccessionNumber())
    return(output);
 }

function toClipboard(index){
  navigator.clipboard.writeText(getPasteInfo(index));
  //alert("Copied the text: " + getPasteInfo(index));
}

function addColumn(){
  const blastTable = document.getElementById('dscTable');

  var th = document.createElement("th");
  th.className = "c13";
  th.innerText = "Copy/Paste";
  blastTable.rows[0].appendChild(th);
  
  for (var i = 1; i < blastTable.rows.length; ++i) {                
    var td = document.createElement("td");
    
    var btn = document.createElement('input');
    btn.type = "button";
    btn.className = "btn";
    btn.value = 'Copy';
    btn.id = i;
    btn.onclick = function(){toClipboard(parseInt(this.id)-1)};  
    td.appendChild(btn);
    
    blastTable.rows[i].appendChild(td);    
  }
}

function determineConsensus(){

}

if (document.getElementById('dscTable') != undefined){
 addColumn();
}
 //obviousLitmus()