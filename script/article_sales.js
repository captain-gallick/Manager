
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
    var articleTable = document.getElementById('sale-report').innerHTML

    var articleArray = new Array()
    var dateArray = new Array()
    var sumArrayH = new Array()
    var sumArrayV = new Array()
    
    var articleQuery = "SELECT DISTINCT s.itemId, i.itemName from sales as s,inventory as i where i.itemId = s.itemId and MONTH(s.saleDate) = MONTH('"+date+"') and YEAR(s.saleDate) = YEAR('"+date+"') ORDER by i.itemName ASC"
    var datesQuery = "SELECT DISTINCT DATE_FORMAT(saleDate, '%Y-%m-%d') as dates from sales where MONTH(saleDate) = MONTH('"+date+"') and YEAR(saleDate) = YEAR('"+date+"') ORDER by saleDate ASC"
    var sumQuery = 'SELECT sales.itemId, sum(sales.totalItems) as totalSum '+
                    'FROM sales, inventory '+
                    "where MONTH(sales.saleDate) = MONTH('"+date+"') and "+
                    "YEAR(sales.saleDate) = YEAR('"+date+"') and "+
                    'inventory.itemId = sales.itemId '+
                    'GROUP BY itemId '+
                    'ORDER BY inventory.itemName'

    var returnArticles = ipcRenderer.sendSync('fetch-saleby-buyer', articleQuery)
    console.log(returnArticles)

    if(returnArticles.length == 0){
        articleTable += '<h2 align="center">NO SALES FOUND!</h1>'
    } else{
        articleTable += '<thead><th><b>Dates</b></th>'

        var i
        for(i = 0;i<returnArticles.length;i++){
            articleArray[i] = returnArticles[i].itemId
            articleTable += '<th><b>'+returnArticles[i].itemName+'</b></th>'
        }
        articleTable += '<th><b>Total</b></th></thead>'

        var dateResult = ipcRenderer.sendSync('fetch-sale-dates', datesQuery)
        console.log(dateResult)

        var j
        var dateResult = ipcRenderer.sendSync('fetch-sale-dates', datesQuery)
        for(j = 0;j<dateResult.length;j++){
            dateArray[j] = dateResult[j].dates
        }

        var k
        for(k = 0; k<dateArray.length; k++){
            sumArrayH[0] = 0
            articleTable += '<tr><td><b>'+convertDate(dateArray[k])+'</b></td>'
            var l
            for(l = 0; l<articleArray.length;l++){
                var qtyQuery = "SELECT sum(totalItems) as totalItems from sales where saleDate = '"+dateArray[k]+"' and itemId = "+articleArray[l]+""
                var qtyResult = ipcRenderer.sendSync('fetch-sale-qty', qtyQuery)
                console.log(qtyResult)
                if(qtyResult[0].totalItems!=null){
                    articleTable += '<td id="x-cart" onclick="getbuyersList('+dateArray[k]+','+articleArray[l]+')">'+qtyResult[0].totalItems+'</td>'
                    sumArrayH[0] = sumArrayH[0] + qtyResult[0].totalItems
                } else{
                    articleTable += '<td></td>'
                }
                
            }
            articleTable += '<td><b>'+sumArrayH[0]+'</b></td></tr>'
            sumArrayV[k] = sumArrayH[0]
        }

        var returnedSum = ipcRenderer.sendSync('fetch-total-sum', sumQuery)
        console.log(returnedSum)
        articleTable += '<tr><td><b>Total</b></td>'
        var m
        for(m = 0; m<returnedSum.length; m++){
            articleTable += '<td><b>'+returnedSum[m].totalSum+'</b></td>'
        }

        var n
        var sum = 0
        for(n=0; n<sumArrayV.length; n++){
            sum = sum + sumArrayV[n]
        }

        articleTable += '<td><b>'+sum+'</b></td></tr>'

    }
        
    document.getElementById('sale-report').innerHTML = articleTable

    getSalesTillNow(date)

}

function getbuyersList(sDate, aId){
    // console.log(sDate+' '+aId)
    // var query = "select c.cName, s.totalItems from sales s, customers c WHERE s.saleDate='"+sDate+"' and s.itemId="+aId+" and c.cId=s.cId GROUP BY c.cName order by c.cName ASC"
    // var result = ipcRenderer.sendSync('article-buyer-list', query)
    // console.log(result)
}

function getSalesTillNow(date){

    document.getElementById('sale-till-now').innerHTML=''
    var table = document.getElementById('sale-till-now').innerHTML

    var query="select s.itemId,i.itemName, sum(s.totalItems) as total "+
                "from sales as s, inventory as i "+
                "where month(s.saleDate)<=month('"+date+"') and year(s.saleDate)<=year('"+date+"') and i.itemId=s.itemId "+
                "GROUP by s.itemId"
    
    var result = ipcRenderer.sendSync('sales-till-now', query)
    console.log(result)

    table += '<tr>'

    if(date.length!=0){
        table += '<td><b>Articles -></b></td>'
        var i
        for(i=0; i<result.length; i++){
            table += '<td>'+result[i].itemName+'</td>'
        }
        table += '</tr><tr><td><b>Total -></b></td>'
        var i
        for(i=0; i<result.length; i++){
            table += '<td>'+result[i].total+'</td>'
        }
        table += '</tr>'
    } else{
        table += '<td><h1>No Sales Found!</h1></td></tr>'
    }

    console.log(table)
    document.getElementById('sale-till-now').innerHTML=table

}

function getPriceforSales(cId,itemId){
    var fPrice = ipcRenderer.sendSync('fetch-price', 'SELECT `itemPrice` FROM `specialpricetable` WHERE cId = '+ cId +' AND itemId = ' +  itemId)
    
    if(fPrice.length == 0){
        fPrice = ipcRenderer.sendSync('fetch-price', 'SELECT itemPrice FROM inventory WHERE itemId = ' + itemId)
    }
    return fPrice[0].itemPrice
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