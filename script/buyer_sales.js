
const {ipcRenderer} = require('electron')

function backClick(){
    ipcRenderer.send('synchronous-message', 'html/home.html')
}

function initialLoad(){
    document.getElementById('next-month').style.display='none'
    //console.log(bid)
    getSaleDate()
}

var bid
var d = new Date();
var month = d.getMonth()+1

function getPrevNextDate(arg){
    if(arg==1){
        d.setMonth(d.getMonth() + 1);
        getSaleDate()
    } else if(arg == 2){
        d.setMonth(d.getMonth() - 1);
        document.getElementById('next-month').style.display='inline'
        getSaleDate()
    }
    
}

function getSaleDate(){

    var mName = getCurrentMonth(d.getMonth())

    document.getElementById('bill-heading').innerHTML = mName+" "+d.getFullYear()

    var d1 = new Date();

    if((d1.getMonth()+1) == (d.getMonth()+1) && (d1.getFullYear()) == (d.getFullYear())){
        document.getElementById('next-month').style.display='none'
    }

    var date = d.getFullYear()+'-'+("0" + (d.getMonth() + 1)).slice(-2)+'-'+d.getDate()
    getSales(date)
}

function getSales(date){

    document.getElementById('sale-report').innerHTML = ''
    var buyerTable = document.getElementById('sale-report').innerHTML

    var sum = 0

    var buyersQuery = 'SELECT c.cId, c.cName, sum(s.saleAmount) as total '+
                        'from sales as s, customers as c '+
                        "where month(s.saleDate)=month('"+date+"') and YEAR(s.saleDate) = YEAR('"+date+"') and c.cId=s.cId "+
                        'GROUP by c.cName '+
                        'ORDER BY total DESC'
    var datesQuery = "SELECT DISTINCT DATE_FORMAT(saleDate, '%Y-%m-%d') as dates from sales where MONTH(saleDate) = MONTH('"+date+"') and YEAR(saleDate) = YEAR('"+date+"') ORDER by saleDate ASC"

    var allBuyers = ipcRenderer.sendSync('fetch-buyer-sales', buyersQuery) 

    buyerTable += '<thead id="buyers-table-head">'

    if(allBuyers.length==0){
        buyerTable += '<th><h1>No Sales Found!</h1></th></tr>'
    } else{
        buyerTable += '<th><b>Dates</b></th>'
        var i
        for(i=0; i<allBuyers.length; i++){
            buyerTable += '<th><b>'+allBuyers[i].cName+'</b></th>'
        }
        buyerTable += '<th><b>Total</b></th></thead>'
        var allDates = ipcRenderer.sendSync('fetch-sale-dates', datesQuery)

        var j
        for(j=0; j<allDates.length; j++){
            buyerTable += '<tr><td><b>'+convertDate(allDates[j].dates)+'</b></td>'
            console.log(allDates[j].dates)
            var k
            for(k=0;k<allBuyers.length;k++){
                var amountQuery = "select isnull(sum(saleAmount)) as isnullon, sum(saleAmount) as saleAmount from sales where saleDate='"+allDates[j].dates+"' and cId="+allBuyers[k].cId
                var amountResult = ipcRenderer.sendSync('fetch-onebuyer-amount', amountQuery)
                console.log(amountResult[0].isnullon)
                if(amountResult[0].isnullon == 0){
                    buyerTable += '<td>&#8377;'+amountResult[0].saleAmount+'</td>'
                } else{
                    buyerTable += '<td></td>'   
                }
            }
            var dateTotal = "select sum(saleAmount) as dateTotal from sales where saleDate='"+allDates[j].dates+"'"
            var dT = ipcRenderer.sendSync('fetch-onebuyer-total', dateTotal)
            buyerTable += '<td>&#8377;'+dT[0].dateTotal+'</td>'
        }
        buyerTable += '</tr><tr><td><b>Total</b></td>'
        var l
        for(l=0;l<allBuyers.length; l++){
            var monthTotal = "select SUM(saleAmount) as monthTotal from sales where month(saleDate)=month('"+date+"') and YEAR(saleDate) = YEAR('"+date+"') and cId="+allBuyers[l].cId
            var mt = ipcRenderer.sendSync('fetch-onebuyer-total', monthTotal)
            buyerTable += '<td>&#8377;'+mt[0].monthTotal+'</td>'
            sum += mt[0].monthTotal
        }
        buyerTable += '<td>&#8377;'+sum+'</td></tr>'
    }

    document.getElementById('sale-report').innerHTML = buyerTable

}

function convertDate(inputFormat) {

    var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];

    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), month_names[d.getMonth()], d.getFullYear()].join('-');
  }

function getCurrentMonth(mNumber){

    var month_names =["January","February","March",
                        "April","May","June",
                        "July","August","September",
                        "October","November","December"];

    return month_names[mNumber]
}