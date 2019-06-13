
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
}

countDemo(arregloDemo);

function countRep(arregloRep){
    numRep = arregloRep.length;
    console.log(numRep);
}

countRep(arregloRep);

function countInd(arregloInd){
    numInd = arregloInd.length;
    console.log(numInd);
}

countInd(arregloInd);

console.log(statistics.statistics[0]);
console.log(statistics.numRep);
console.log(statistics.numInd);