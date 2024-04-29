const {ipcRenderer} = require('electron')

function backClick(){
    ipcRenderer.send('synchronous-message', 'html/home.html')
}

var bid
var d = new Date();
var month = d.getMonth()+1

function getBuyerId(){
    console.log(month)
    document.getElementById('next-month').style.display='none'
    var query = "select * from passingvalues where purpose='customerId'"
    var result = ipcRenderer.sendSync('next-page-getter', query)
    bid = result[0].id;
    //console.log(bid)
    getSaleDate()
}

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

var mName
var cName

function getSaleDate(){

    mName = getCurrentMonth(d.getMonth())

    document.getElementById('bill-heading').innerHTML = mName + ' ' + d.getFullYear() + ' Sale'

    var d1 = new Date();

    if((d1.getMonth()+1) == (d.getMonth()+1) && (d1.getFullYear() == d.getFullYear())){
        document.getElementById('next-month').style.display='none'
    }

    var date = d.getFullYear()+'-'+("0" + (d.getMonth() + 1)).slice(-2)+'-'+d.getDate()
    getSales(bid,date)
}

function getSales(bid,date){

    document.getElementById('sale-report').innerHTML = ''
    var saleTable = document.getElementById('sale-report').innerHTML
    
    var grandTotal = 0

    var i
    var j

    var articleArray = new Array()
    var dateArray = new Array()
    var sumArray = new Array()
    var unitPriceArray = new Array()
    
    var query = "SELECT DISTINCT s.itemId, i.itemName from sales as s,inventory as i where s.cId = "+bid+" and i.itemId = s.itemId and MONTH(s.saleDate) = MONTH('"+date+"') AND YEAR(s.saleDate) = YEAR('"+date+"') ORDER by i.itemName ASC"
    var datesQuery = "SELECT DISTINCT DATE_FORMAT(saleDate, '%Y-%m-%d') as dates from sales where cId = "+bid+" and MONTH(saleDate) = MONTH('"+date+"') AND YEAR(saleDate) = YEAR('"+date+"') ORDER by saleDate ASC"
    var sumQuery = 'SELECT sales.itemId, sum(sales.totalItems) as totalSum '+
                    'FROM sales, inventory '+
                    'where cId = '+bid+" and MONTH(sales.saleDate) = MONTH('"+date+"') and "+
                    "YEAR(sales.saleDate) = YEAR('"+date+"') and "+
                    'inventory.itemId = sales.itemId '+
                    'GROUP BY itemId '+
                    'ORDER BY inventory.itemName'
    var cNameQuery = 'SELECT cName FROM customers WHERE cId = '+bid

    var modalCName = ipcRenderer.sendSync('fetch-buyer-details', cNameQuery)
    cName = modalCName[0].cName

    var result = ipcRenderer.sendSync('fetch-saleby-buyer', query) 
    console.log(result)
    if(result.length == 0){
        saleTable += '<h2 align="center">'+modalCName[0].cName+'</h2><br><h1 align="center">NO SALES FOUND!</h1>'
    } else{

        saleTable += '<tr><td colspan="'+(result.length+1)+'"><h2 align="center">'+modalCName[0].cName+'</h2></td>'
        saleTable += '<tr><td><b>Dates</b></td>'

        for(i = 0;i<result.length;i++){
            articleArray[i] = result[i].itemId
            saleTable += '<td><b>'+result[i].itemName+'</b></td>'
        }
        saleTable += '</tr>'

        document.getElementById('sale-report').innerHTML = saleTable

        saleTable = document.getElementById('sale-report').innerHTML

        var dateResult = ipcRenderer.sendSync('fetch-sale-dates', datesQuery)
        for(i = 0;i<dateResult.length;i++){
            dateArray[i] = dateResult[i].dates
        }

        for(i = 0; i<dateArray.length; i++){
            saleTable += '<tr><td><b>'+convertDate(dateArray[i])+'</b></td>'
            for(j = 0; j<articleArray.length;j++){
                var qtyQuery = "SELECT totalItems from sales where saleDate = '"+dateArray[i]+"' and cId = "+bid+" and itemId = "+articleArray[j]+""
                var qtyResult = ipcRenderer.sendSync('fetch-sale-qty', qtyQuery)
                if(qtyResult.length != 0){
                    saleTable += '<td><ul class="report-qty-list">'
                    var k
                    for(k = 0;k<qtyResult.length;k++){
                        saleTable += '<li>'+qtyResult[k].totalItems+'</li>'
                    }
                    saleTable += '</ul></td>'
                } else{
                    saleTable += '<td></td>'
                }
            }
            saleTable += '</tr>'
        }

        var returnedSum = ipcRenderer.sendSync('fetch-total-sum', sumQuery)
        console.log(returnedSum)
        saleTable += '<tr><td><b>Total</b></td>'
        var l
        for(l = 0; l<returnedSum.length; l++){
            sumArray[l] = returnedSum[l].totalSum
            saleTable += '<td><b>'+returnedSum[l].totalSum+'</b></td>'
        }
        saleTable += '</tr>'

        saleTable += '<tr><td><b>Unit Price</b></td>'

        var m
        for(m = 0; m<articleArray.length; m++){
            unitPriceArray[m] = getPriceforSales(bid,articleArray[m])
            saleTable += '<td><b>X &#8377;'+unitPriceArray[m]+'</b></td>'
        }

        saleTable += '<tr><td><b>Total Price</b></td>'

        var n
        for(n = 0; n<sumArray.length; n++){
            grandTotal += unitPriceArray[n]*sumArray[n]
            saleTable += '<td><b>&#8377;'+unitPriceArray[n]*sumArray[n]+'</b></td>'
        }

        saleTable += '</tr>'
        saleTable += '<tr><td><b>Grand Total</b></td><td colspan="'+articleArray.length+'" align="center"><b>&#8377;'+grandTotal+'</b></td></tr>'

    }

    document.getElementById('sale-report').innerHTML = saleTable

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

function printReport(){
    window.print()
}

function exportTableToExcel(tableID, filename = ''){
    var downloadLink;
    var dataType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    filename = filename?filename+'.xls':cName+'_'+mName+'.xlsx';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\UTF-8', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
}