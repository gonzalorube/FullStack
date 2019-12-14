
// Traigo la variable para ver que listado utilizo
var url = '';

if(opc == "senate"){
    url = "https://api.propublica.org/congress/v1/113/senate/members.json";
   } else {
       url = "https://api.propublica.org/congress/v1/113/house/members.json";
   }
/*
if(opc == "senate"){
    url = "http://localhost:8000/json/pro-congress-113-senate.json";
   } else {
       url = "http://localhost:8000/json/pro-congress-113-house.json";
   }
*/

$(function() {
    fetch(url,{
    method: 'GET',
    headers: new Headers({
    "X-API-Key": "hwFKB37RLFz0ntVG1cIX0pxzq0QYHsbX24hR6swX"
    })
} ).then(function(response){
    return response.json();
  }).then (function(json){
        app.candidates = json.results[0].members;
        calcula(json.results[0].members);
  }).catch(function(){
        if (app.candidates == undefined){
            console.log("Fail");
        } else {
        }
    })
});

// armo la estructura de mi JSON
var estadisticas = {
    "totD":0,
    "totR":0,
    "totI":0,
    "totales":0,
    "totPorcD":0,
    "totPorcR":0,
    "totPorcI":0,
    "totalPorc":0,
    "least_engange":[],
    "most_engange":[],
    "least_loyal":[],
    "most_loyal":[],
    "totalStates":[]
    }

// Funcion para sacar los totales por partido y porcentajes
function calcula(data){

    // Vuelco el JSON original en la variable members
    var members = data;
    var tempArray = []; // Va a ser mi Array para los valores de Attendance
    var tempArrayLoyal = []; // Va a ser mi Array para los valores de Loyality
    var tempTotalStates = []; // Va a ser mi Array para el listado de estados

    var len = members.length;
    var valParty = '';

    var totD = 0;
    var totPorcD = 0;
    var totR = 0;
    var totPorcR = 0;
    var totI = 0;
    var totPorcI = 0;
    var totales = 0;
    var totPorc = 0;

    // Calculo cantidad de candidatos
    for(var i = 0; i < len; i++){
        valParty = (members[i].party);
        tempArray[i] = members[i].missed_votes_pct;
        tempArrayLoyal[i] = members[i].votes_with_party_pct;
        tempTotalStates[i] = members[i].state;

        if (valParty == 'D') {
                totD ++;
                } else {
                if (valParty == 'R') {
                totR ++;
                    } else {
               totI ++;
                }
            } // Fin IF contadores
    } // Fin FOR

    totales = (totD+totR+totI);
    totPorcD = parseFloat((totD*100/totales).toFixed(2));
    totPorcR = parseFloat((totR*100/totales).toFixed(2));
    totPorcI = parseFloat((totI*100/totales).toFixed(2));
    totalPorc = parseFloat((totPorcD+totPorcR+totPorcI));

    // Graba los valores en el JSON
    estadisticas.totD = totD;
    estadisticas.totR = totR;
    estadisticas.totI = totI;
    estadisticas.totales = totales;
    estadisticas.totPorcD = totPorcD;
    estadisticas.totPorcR = totPorcR;
    estadisticas.totPorcI = totPorcI;
    estadisticas.totalPorc = totalPorc;

    var checkedBoxes = Array.from(document.querySelectorAll('input[name = selParty]:checked')).map(elt => elt.value);

    // Ordeno y filtro el listado de estados
    var tempTotalStatesSorted = tempTotalStates.sort();

    function removeDuplicates(tempArray) {
      var x;
      var len = tempArray.length;
      var out=[];
      var obj={};

      for (x = 0; x < len; x++) {
        obj[tempTotalStatesSorted[x]] = 0;
      }
      for (x in obj) {
        out.push(x);
      }
      return out;
    } // FIN funcion removeDuplicates

    var result = removeDuplicates(tempTotalStatesSorted);
    app.states = result;

    estadisticas.totalStates = result;

    // Calculos para ATTENDANCE
    var tempArraySorted = tempArray.sort(function (a, b){
    return (a - b)
    });

    // Filtra el 10% de los menores
    var len = tempArraySorted.length;
    var len10 = (Math.round(tempArraySorted.length*10/100));

    var valMin = tempArraySorted[0];
    var valMax = tempArraySorted[len10-1];

    var tempMissed = members.filter(obj => obj.missed_votes_pct >= valMin && obj.missed_votes_pct <= valMax);

    // Ordena y guarda MINIMOS en el JSON
    tempMissed.sort(function (a, b){
        return (a.missed_votes_pct - b.missed_votes_pct)
        });
    estadisticas.most_engange = tempMissed;


    // Filtra el 10% de los mayores
    var len = tempArraySorted.length;
    var len10 = (Math.round(tempArraySorted.length*10/100));

    var valMin = tempArraySorted[len-len10];
    var valMax = tempArraySorted[len-1];

    var tempMissed2 = members.filter(obj => obj.missed_votes_pct >= valMin && obj.missed_votes_pct <= valMax);

    // Ordena y guarda MAXIMOS en el JSON
    tempMissed2.sort(function (a, b){
        return (a.missed_votes_pct - b.missed_votes_pct)
        });
    estadisticas.least_engange = tempMissed2;


    // Calculos para LOYALTY
    var tempArrayLoyalSorted = tempArrayLoyal.sort(function (a, b){
    return (a - b)
    });

    // Filtra el 10% de los menores
    var len = tempArrayLoyalSorted.length;
    var len10 = (Math.round(tempArrayLoyalSorted.length*10/100));

    var valMin = tempArrayLoyalSorted[0];
    var valMax = tempArrayLoyalSorted[len10-1];

    var tempLoyal = members.filter(obj => obj.votes_with_party_pct >= valMin && obj.votes_with_party_pct <= valMax);

    // Ordena y guarda MINIMOS en el JSON
    tempLoyal.sort(function (a, b){
        return (a.votes_with_party_pct - b.votes_with_party_pct)
        });
    estadisticas.least_loyal = tempLoyal;

    // Filtra el 10% de los mayores
    var len = tempArrayLoyalSorted.length;
    var len10 = (Math.round(tempArrayLoyalSorted.length*10/100));

    var valMin = tempArrayLoyalSorted[len-len10];
    var valMax = tempArrayLoyalSorted[len-1];

    var tempLoyal2 = members.filter(obj => obj.votes_with_party_pct >= valMin && obj.votes_with_party_pct <= valMax);

    // Ordena y guarda MAXIMOS en el JSON
    tempLoyal2.sort(function (a, b){
        return (a.votes_with_party_pct - b.votes_with_party_pct)
        });
    estadisticas.most_loyal = tempLoyal2;

} // FIN funcion calcula


function updateUI() {
   var checkedBoxes = Array.from(document.querySelectorAll("input[name=selParty]:checked")).map(ele => ele.value);
   var stateVal = $("#states").val();
   var stateArr = stateVal ? [ stateVal ] : [];

   $(".deGaby tr").each(function () {
     var partyVal = $(this).find(".buscaParty").text();
     var stateVal = $(this).find(".buscaState").text();
     var Selected = isIncluded(stateVal, stateArr ,partyVal , checkedBoxes);
     $(this).toggle(Selected);
   });
 } // FIN funcion updateUI
 function isIncluded(x,lst,p,c) {
   return c.indexOf(p)!= -1 && lst.length== 0 || c.indexOf(p)!= -1 && lst.indexOf(x)!= -1 ;
 }


// Declaracion del Vue
var app = new Vue({
  el: '#app',
  data: {
      candidates: [],
      estadTotal: estadisticas, //Cargo mi JSON en el DATA
      states: []
  }
});


/*
var statistics = {
  "totD":0,
  "totR":0,
  "totI":0,
  "totales":0,
  "totPorcD":0,
  "totPorcR":0,
  "totPorcI":0,
  "totalPorc":0,
  "least_engange":[],
  "most_engange":[],
  "least_loyal":[],
  "most_loyal":[],
  "totalStates":[]
}
var arreglo = data.results[0].members;
var arregloDemo = [];
var arregloRep = [];
var arregloInd = [];
var numDemo = 0;
var numRep = 0;
var numInd = 0;


function listDemocrats(arreglo){
    for(let i=0; i<arreglo.length; i++){
        if(arreglo[i].party == "D"){
            arregloDemo.push(arreglo[i]);
        }
    }
    console.log(arregloDemo);
    return arregloDemo;
}

listDemocrats(arreglo);

function listRepublicans(arreglo){
    for(let i=0; i<arreglo.length; i++){
        if(arreglo[i].party == "R"){
            arregloRep.push(arreglo[i]);
        }
    }
    console.log(arregloRep);
    return arregloRep;
}

listRepublicans(arreglo);

function listIndependents(arreglo){
    for(let i=0; i<arreglo.length; i++){
        if(arreglo[i].party == "I"){
            arregloInd.push(arreglo[i]);
        }
    }
    console.log(arregloInd);
    return arregloInd;
}

listIndependents(arreglo);

function countDemo(arregloDemo){
    numDemo = arregloDemo.length;
    console.log(numDemo);
    return numDemo;
}

countDemo(arregloDemo);

function countRep(arregloRep){
    numRep = arregloRep.length;
    console.log(numRep);
    return numRep;
}

countRep(arregloRep);

function countInd(arregloInd){
    numInd = arregloInd.length;
    console.log(numInd);
    return numInd;
}

countInd(arregloInd);

statistics.totD = countDemo(arregloDemo);
statistics.totR = countRep(arregloRep);
statistics.totI = countInd(arregloInd);
document.getElementById("totD").innerText = statistics.totD;
document.getElementById("totR").innerText = statistics.totR;
document.getElementById("totI").innerText = statistics.totI;

statistics.totales = (statistics.totD+statistics.totR+statistics.totI);
statistics.totPorcD = parseFloat((statistics.totD*100/statistics.totales).toFixed(2));
statistics.totPorcR = parseFloat((statistics.totR*100/statistics.totales).toFixed(2));
statistics.totPorcI = parseFloat((statistics.totI*100/statistics.totales).toFixed(2));
statistics.totalPorc = parseFloat((statistics.totPorcD+statistics.totPorcR+statistics.totPorcI));
document.getElementById("totales").innerText = statistics.totales;
document.getElementById("totPorcD").innerText = statistics.totPorcD;
document.getElementById("totPorcR").innerText = statistics.totPorcR;
document.getElementById("totPorcI").innerText = statistics.totPorcI;
document.getElementById("totalPorc").innerText = statistics.totalPorc;

var tempArray = [];
for(var i=0; i<arreglo.length; i++){
  tempArray[i] = arreglo[i].missed_votes_pct;
  //tempArrayLoyal[i] = arreglo[i].votes_with_party_pct;
}

// Calculos para ATTENDANCE
var tempArraySorted = tempArray.sort(function (a, b){
return (a - b);
});
console.log(tempArraySorted);

// Filtra el 10% de los menores
var len = tempArraySorted.length;
var len10 = (Math.round(tempArraySorted.length/10));
console.log("len10 es " + len10);

var valMin = tempArraySorted[0];
console.log(valMin);
var valMax = tempArraySorted[len10-1];
console.log("valMax es " + valMax);
console.log(tempArraySorted[45]);
console.log(arreglo.length);

console.log(arreglo[5].first_name);
if(arreglo[5].missed_votes_pct == tempArraySorted[7]){
  console.log("Everything fine");
  console.log(arreglo[5].missed_votes_pct + " " + tempArraySorted[7]);
} else {
  console.log("It's a shit");
}

var bestTable = "<thead><tr><th>Full Name</th><th>Missed Votes</th><th>% Missed</th></tr></thead><tbody>";
for(var m=0; m<arreglo.length; m++){
  if(arreglo[m].missed_votes_pct <= valMax){
  //console.log(arreglo[m].missed_votes_pct);
      if(arreglo[m].middle_name != null){
        bestTable += "<tr><td>" + arreglo[m].first_name + " " + arreglo[m].middle_name + " " + arreglo[m].last_name + "</td><td>" + arreglo[m].missed_votes + "</td><td>" + arreglo[m].missed_votes_pct + "</td></tr>";
      } else {
        bestTable += "<tr><td>" + arreglo[m].first_name + " " + arreglo[m].last_name + "</td><td>" + arreglo[m].missed_votes + "</td><td>" + arreglo[m].missed_votes_pct + "</td></tr>";
      }
  }
}

bestTable += "</tbody>";
console.log(bestTable);
document.getElementById("bestTable").innerHTML = bestTable;

var tempArraySorted = tempArray.sort(function (a, b){
return (b - a);
});

var len = tempArraySorted.length;
console.log(len);
var len10 = (Math.round(tempArraySorted.length/10));
console.log("len10 es " + len10);

var valMax = tempArraySorted[0];
console.log(valMax);
var valMin = tempArraySorted[len10-1];
console.log("valMin es " + valMin);

var worstTable = "<thead><tr><th>Full Name</th><th>Missed Votes</th><th>% Missed</th></tr></thead><tbody>";
for(var m=0; m<arreglo.length; m++){
  if(arreglo[m].missed_votes_pct >= valMin){
  console.log(arreglo[m].missed_votes_pct);
      if(arreglo[m].middle_name != null){
        worstTable += "<tr><td>" + arreglo[m].first_name + " " + arreglo[m].middle_name + " " + arreglo[m].last_name + "</td><td>" + arreglo[m].missed_votes + "</td><td>" + arreglo[m].missed_votes_pct + "</td></tr>";
      } else {
        worstTable += "<tr><td>" + arreglo[m].first_name + " " + arreglo[m].last_name + "</td><td>" + arreglo[m].missed_votes + "</td><td>" + arreglo[m].missed_votes_pct + "</td></tr>";
      }
  }
}

worstTable += "</tbody>";
console.log(worstTable);
document.getElementById("worstTable").innerHTML = worstTable;
*/


/*var tempMissed = members.filter(obj => obj.missed_votes_pct >= valMin && obj.missed_votes_pct <= valMax);

// Ordena y guarda MINIMOS en el JSON
tempMissed.sort(function (a, b){
    return (a.missed_votes_pct - b.missed_votes_pct)
    });
estadisticas.least_engange = tempMissed;


// Filtra el 10% de los mayores
var len = tempArraySorted.length;
var len10 = (Math.round(tempArraySorted.length*10/100));

var valMin = tempArraySorted[len-len10];
var valMax = tempArraySorted[len-1];

var tempMissed2 = members.filter(obj => obj.missed_votes_pct >= valMin && obj.missed_votes_pct <= valMax);

// Ordena y guarda MAXIMOS en el JSON
tempMissed2.sort(function (a, b){
    return (a.missed_votes_pct - b.missed_votes_pct)
    });
estadisticas.most_engange = tempMissed2;
*/
/*console.log(statistics.statistics[0]);
console.log(statistics.numRep);
console.log(statistics.numInd);*/


//var url = '';

/*if(opc == "senate"){
    url = "https://api.propublica.org/congress/v1/113/senate/members.json";
   } else {
       url = "https://api.propublica.org/congress/v1/113/house/members.json";
   }*/
/*
if(opc == "senate"){
    url = "http://localhost:8000/json/pro-congress-113-senate.json";
   } else {
       url = "http://localhost:8000/json/pro-congress-113-house.json";
   }
*/

/*$(function() {
    fetch(url,{
    method: 'GET',
    headers: new Headers({
    "X-API-Key": "hwFKB37RLFz0ntVG1cIX0pxzq0QYHsbX24hR6swX"
    })
} ).then(function(response){
    return response.json();
  }).then (function(json){
        app.candidates = json.results[0].members;
        calcula(json.results[0].members);
  }).catch(function(){
        if (app.candidates == undefined){
            console.log("Fail");
        } else {
        }
    })
});*/
/*
// armo la estructura de mi JSON
var estadisticas = {
    "totD":0,
    "totR":0,
    "totI":0,
    "totales":0,
    "totPorcD":0,
    "totPorcR":0,
    "totPorcI":0,
    "totalPorc":0,
    "least_engange":[],
    "most_engange":[],
    "least_loyal":[],
    "most_loyal":[],
    "totalStates":[]
    }

// Funcion para sacar los totales por partido y porcentajes
function calcula(data){

    // Vuelco el JSON original en la variable members

    var members = data;
    console.log(members);
    var tempArray = []; // Va a ser mi Array para los valores de Attendance
    var tempArrayLoyal = []; // Va a ser mi Array para los valores de Loyality
    var tempTotalStates = []; // Va a ser mi Array para el listado de estados

    var len = members.results[0].length;
    var valParty = '';

    var totD = 0;
    var totPorcD = 0;
    var totR = 0;
    var totPorcR = 0;
    var totI = 0;
    var totPorcI = 0;
    var totales = 0;
    var totPorc = 0;

    // Calculo cantidad de candidatos
    for(var i = 0; i < len; i++){
        valParty = (members[i].results[0].party);
        tempArray[i] = members[i].results[0].missed_votes_pct;
        tempArrayLoyal[i] = members[i].results[0].votes_with_party_pct;
        tempTotalStates[i] = members[i].results[0].state;

        if (valParty == 'D') {
                totD ++;
                } else {
                if (valParty == 'R') {
                totR ++;
                    } else {
               totI ++;
                }
            } // Fin IF contadores
    } // Fin FOR

    totales = (totD+totR+totI);
    totPorcD = parseFloat((totD*100/totales).toFixed(2));
    totPorcR = parseFloat((totR*100/totales).toFixed(2));
    totPorcI = parseFloat((totI*100/totales).toFixed(2));
    totalPorc = parseFloat((totPorcD+totPorcR+totPorcI));

    // Graba los valores en el JSON
    estadisticas.totD = totD;
    estadisticas.totR = totR;
    estadisticas.totI = totI;
    estadisticas.totales = totales;
    estadisticas.totPorcD = totPorcD;
    estadisticas.totPorcR = totPorcR;
    estadisticas.totPorcI = totPorcI;
    estadisticas.totalPorc = totalPorc;

    var checkedBoxes = Array.from(document.querySelectorAll('input[name = selParty]:checked')).map(elt => elt.value);

    // Ordeno y filtro el listado de estados
    var tempTotalStatesSorted = tempTotalStates.sort();

    function removeDuplicates(tempArray) {
      var x;
      var len = tempArray.length;
      var out=[];
      var obj={};

      for (x = 0; x < len; x++) {
        obj[tempTotalStatesSorted[x]] = 0;
      }
      for (x in obj) {
        out.push(x);
      }
      return out;
    } // FIN funcion removeDuplicates

    var result = removeDuplicates(tempTotalStatesSorted);
    app.states = result;

    estadisticas.totalStates = result;

    // Calculos para ATTENDANCE
    var tempArraySorted = tempArray.sort(function (a, b){
    return (a - b)
    });

    // Filtra el 10% de los menores
    var len = tempArraySorted.length;
    var len10 = (Math.round(tempArraySorted.length*10/100));

    var valMin = tempArraySorted[0];
    var valMax = tempArraySorted[len10-1];

    var tempMissed = members.filter(obj => obj.missed_votes_pct >= valMin && obj.missed_votes_pct <= valMax);

    // Ordena y guarda MINIMOS en el JSON
    tempMissed.sort(function (a, b){
        return (a.missed_votes_pct - b.missed_votes_pct)
        });
    estadisticas.least_engange = tempMissed;


    // Filtra el 10% de los mayores
    var len = tempArraySorted.length;
    var len10 = (Math.round(tempArraySorted.length*10/100));

    var valMin = tempArraySorted[len-len10];
    var valMax = tempArraySorted[len-1];

    var tempMissed2 = members.filter(obj => obj.missed_votes_pct >= valMin && obj.missed_votes_pct <= valMax);

    // Ordena y guarda MAXIMOS en el JSON
    tempMissed2.sort(function (a, b){
        return (a.missed_votes_pct - b.missed_votes_pct)
        });
    estadisticas.most_engange = tempMissed2;


    // Calculos para LOYALTY
    var tempArrayLoyalSorted = tempArrayLoyal.sort(function (a, b){
    return (a - b)
    });

    // Filtra el 10% de los menores
    var len = tempArrayLoyalSorted.length;
    var len10 = (Math.round(tempArrayLoyalSorted.length*10/100));

    var valMin = tempArrayLoyalSorted[0];
    var valMax = tempArrayLoyalSorted[len10-1];

    var tempLoyal = members.filter(obj => obj.votes_with_party_pct >= valMin && obj.votes_with_party_pct <= valMax);

    // Ordena y guarda MINIMOS en el JSON
    tempLoyal.sort(function (a, b){
        return (a.votes_with_party_pct - b.votes_with_party_pct)
        });
    estadisticas.least_loyal = tempLoyal;

    // Filtra el 10% de los mayores
    var len = tempArrayLoyalSorted.length;
    var len10 = (Math.round(tempArrayLoyalSorted.length*10/100));

    var valMin = tempArrayLoyalSorted[len-len10];
    var valMax = tempArrayLoyalSorted[len-1];

    var tempLoyal2 = members.filter(obj => obj.votes_with_party_pct >= valMin && obj.votes_with_party_pct <= valMax);

    // Ordena y guarda MAXIMOS en el JSON
    tempLoyal2.sort(function (a, b){
        return (a.votes_with_party_pct - b.votes_with_party_pct)
        });
    estadisticas.most_loyal = tempLoyal2;


document.getElementById("totD").innerText = estadisticas.totD;
document.getElementById("totR").innerText = estadisticas.totR;
document.getElementById("totI").innerText = estadisticas.totI;
document.getElementById("totales").innerText = estadisticas.totales;
document.getElementById("totPorcD").innerText = estadisticas.totPorcD;
document.getElementById("totPorcR").innerText = estadisticas.totPorcR;
document.getElementById("totPorcI").innerText = estadisticas.totPorcI;
document.getElementById("totalesPorc").innerText = estadisticas.totalPorc;
} // FIN funcion calcula


function updateUI() {
   var checkedBoxes = Array.from(document.querySelectorAll("input[name=selParty]:checked")).map(ele => ele.value);
   var stateVal = $("#states").val();
   var stateArr = stateVal ? [ stateVal ] : [];

   $(".deGaby tr").each(function () {
     var partyVal = $(this).find(".buscaParty").text();
     var stateVal = $(this).find(".buscaState").text();
     var Selected = isIncluded(stateVal, stateArr ,partyVal , checkedBoxes);
     $(this).toggle(Selected);
   });
 } // FIN funcion updateUI
 function isIncluded(x,lst,p,c) {
   return c.indexOf(p)!= -1 && lst.length== 0 || c.indexOf(p)!= -1 && lst.indexOf(x)!= -1 ;
 }
*/
// Declaracion del Vue
/*var app = new Vue({
  el: '#app',
  data: {
      candidates: [],
      estadTotal: estadisticas, //Cargo mi JSON en el DATA
      states: []
  }
});*/
//calcula(data);
