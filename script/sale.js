const {ipcRenderer} = require('electron')

function exitFromApp(){
    ipcRenderer.sendSync('close-app')
}

function backClick(){
    ipcRenderer.send('synchronous-message', 'html/home.html')
}

function dateTime(){
    showDate()
    showTime()
    getAllSales()
}

function showDate(){
    var date = new Date()
    var day = date.getDate()
    var month = date.getMonth() + 1
    var year = date.getFullYear()

    var currDate = day + "-" + month + "-" + year

    document.getElementById("MyDateDisplay").innerHTML = '<b>Date : ' + currDate+'</b>';
}

function showTime(){
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    var session = "AM";
    
    if(h == 0){
        h = 12;
    }
    
    if(h > 12){
        h = h - 12;
        session = "PM";
    }
    
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    
    var time = h + ":" + m + ":" + s + " " + session;
    document.getElementById("MyClockDisplay").innerHTML = '<b>Time :'+time+'</b>';
    
    setTimeout(showTime, 1000)
}

function getAllSales(){
    var query = "select i.itemName,c.cName,s.saleAmount,s.totalItems,DATE_FORMAT(s.saleDate,'%d-%b-%Y') as saleDate,sId "+
                'from inventory as i, customers as c, sales as s '+
                'where i.itemId = s.itemId '+
                'and c.cId = s.cId order by s.saleDate desc'

    var returnVal = ipcRenderer.sendSync('fetch-all-sales', query)

    console.log(returnVal)

    var element = '<table id="inner-box" border="1">'
    element+='<tr id="table-heading">'
    element+='<td>Customer Name</td>'
    element+='<td>Article Name</td>'
    element+='<td>Quantity</td>'
    element+='<td>Sale Amount</td>'
    element+='<td>Sale Date</td>'
    element+='<td>Edit</td>'
    element+='</tr>'

    var i
    for(i = 0; i<returnVal.length; i++){
        if(i%2==0){
            element+='<tr style="background-color: gainsboro;">'    
        } else{
            element+='<tr>'
        }
        var d = returnVal[i].saleDate
        element+='<td>'+returnVal[i].cName+'</td>'
        element+='<td>'+returnVal[i].itemName+'</td>'
        element+='<td>'+returnVal[i].totalItems+'</td>'
        element+='<td>&#8377;'+returnVal[i].saleAmount+'</td>'
        element+='<td>'+d+'</td>'
        element+='<td id="edit-sale">'+
                    '<img src="../assets/images/editicon.png" width="30px" height="30px" onclick="showModal('+returnVal[i].sId+')"></td>'
        element+='</tr>'
    }

    element+='</table>'

    document.getElementById('top-box').innerHTML = element

}

// Get the modal
var modal = document.getElementById('sale-modal');

var editAmount
var sp
var newVal
var newQty
var saleId
function showModal(sId) {
    modal.style.display = "block";
    var query = "select s.sId, i.itemName, c.cName, s.saleAmount, s.totalItems, date_Format(s.saleDate,'%d-%b-%Y') as saleDate "+
                'from sales as s, inventory as i, customers as c '+
                'where s.sId = '+sId+' AND '+
                'i.itemId = s.itemId and '+
                'c.cId = s.cId'

    var saleData = ipcRenderer.sendSync('fetch-one-sale', query)
    document.getElementById('sale-edit-qty').value = saleData[0].totalItems
    document.getElementById('sale-edit-amount').innerHTML = '&#8377;'+saleData[0].saleAmount
    document.getElementById('sale-edit-bname').innerHTML = saleData[0].cName
    document.getElementById('sale-edit-aname').innerHTML = saleData[0].itemName
    var date = new Date(saleData[0].saleDate)
    date.setDate(date.getDate()+1)
    document.getElementById('sale-edit-date').valueAsDate = date
    editAmount = saleData[0].saleAmount
    newVal = editAmount
    newQty = saleData[0].totalItems
    sp = editAmount/saleData[0].totalItems
    saleId = sId
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function calculateAmount(){
    var qty = document.getElementById('sale-edit-qty')
    var amt = document.getElementById('sale-edit-amount')

    var q = qty.value
    newQty = q

    q = qty.value

    newVal = q*sp

    amt.innerHTML = '&#8377;' +newVal
    
}

function updateSale(){

    var date = document.getElementById('sale-edit-date').value

    var query = 'update sales '+
                "set saleAmount = "+newVal+", saleDate = '"+date+"', totalItems = "+newQty+
                " where sId = "+saleId

    if(newVal != 0){
        if(date != null){
            console.log(ipcRenderer.sendSync('update-sale', query))
            modal.style.display = "none";
            alert('Record Updated')
            getAllSales()
        } else{
            alert('Please select a date!')
        }
    } else{
        alert('Quantity cannot be zero!')
    }

}

function deleteSale(){
    var query = 'DELETE FROM sales WHERE sId='+saleId
    
    var confirmMessage = confirm('Are you sure?')

    if(confirmMessage == true){
        ipcRenderer.sendSync('delete-sale', query)
        modal.style.display = "none";
        alert('Record Deleted!')
        getAllSales()
    }

}