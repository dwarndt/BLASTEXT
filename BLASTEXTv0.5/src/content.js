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


function getPasteInfo(index){
  const blastTable = document.getElementById('dscTable');
  //some reason index has to be offset for everything BUT Name and Acc. Number
  const rowNumber = index+1;
  const delimiter = '@';	//swapped to @ as delimiter
  const database = 'NCBI'

    let getSampleName = () => {
	 let name = document.querySelector("#ui-ncbipopper-1 > span:nth-child(1)").innerHTML;
	 return (name);
	 }
    let getDocumentName = () => {
         let entry = blastTable.getElementsByClassName("ellipsis c2")[rowNumber-1];
         let name = entry.getElementsByTagName('a')[0].title;
         return(name.slice(20));
         }
    let getScores = () => {
         let totalScore = blastTable.getElementsByClassName("c7")[rowNumber].innerHTML;
         let queryCover = blastTable.getElementsByClassName("c8")[rowNumber].innerHTML;
         let eValue = blastTable.getElementsByClassName("c9")[rowNumber].innerHTML;
         let percentIdentity = blastTable.getElementsByClassName("c10")[rowNumber].innerHTML;
         return([totalScore,eValue,queryCover,percentIdentity].join(delimiter));	//changed to reflect actual format
         }
    let getAccessionNumber = () => {
         let entry = blastTable.getElementsByClassName("c12 l lim")[rowNumber-1];
         let name = entry.getElementsByTagName('a')[0].title;
         return(name.slice(16));
         } 
    
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