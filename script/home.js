const {ipcRenderer} = require('electron')

var w
var x
var y
var z

var dateInput
var qInput
var totalP
var aName
var aPrice
var bName

var buyers
var articles

//final values for sale records......
var buyerId
var articleId
var quantity = 0
var saleDate
var finalAmount
var pricePerUnit
var calculated = false

//final values for add new article
var articleName = ""
var articlePrice = ""

//final values for add new article
var buyerName = ""

//modal id
var modal_buyerId = 0

function exitFromApp(){
    ipcRenderer.sendSync('close-app')
}

function dateTime(){
    showDate()
    showTime()
    w = document.getElementById("reports-block")
    x = document.getElementById("inventory-block")
    y = document.getElementById("sales-block")
    z = document.getElementById("buyers-block")

    dateInput = document.getElementById("sale-date")
    qInput = document.getElementById("article-quantity")
    totalP = document.getElementById("totalPrice")

    aName = document.getElementById("article-name")
    aPrice = document.getElementById("article-price")

    bName = document.getElementById("buyer-name")

    w.style.display = "none";
    x.style.display = "none";
    y.style.display = "none";
    z.style.display = "none";
}

// function radioHandler(arg) {
//     priceType = arg
// }

function showDate(){
    var date = new Date()
    var day = date.getDate()
    var month = date.getMonth() + 1;
    var year = date.getFullYear()

    var currDate = '<b>'+day + "-" + month + "-" + year+'</b>'

    document.getElementById("MyDateDisplay").innerHTML = '<b>Date : </b>' + currDate;
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
    document.getElementById("MyClockDisplay").innerHTML = '<b>Time : </b>' + '<b>'+time+'</b>';
    
    setTimeout(showTime, 1000)
}

function hidefunction(arg) {
    switch(arg){
        case 1:
            if (x.style.display === "none") {
                x.style.display = "block";
                y.style.display = "none";
                z.style.display = "none";
                w.style.display = "none";
                fetchinventory(4)
            } else {
                x.style.display = "none";
            }
            break
        case 2:
            if (y.style.display === "none") {
                y.style.display = "block";
                x.style.display = "none";
                z.style.display = "none";
                w.style.display = "none";
                fetchinventory(1)
                fetchbuyers(1)
                fetchCart()
                document.getElementById("sale-date").valueAsDate = new Date();
            } else {
                y.style.display = "none";
            }
            break
        case 3:
            if (z.style.display === "none") {
                z.style.display = "block";
                y.style.display = "none";
                x.style.display = "none";
                w.style.display = "none";
                fetchbuyers(2)
            } else {
                z.style.display = "none";
            }
            break
        case 4:
            if (w.style.display === "none") {
                z.style.display = "none";
                y.style.display = "none";
                x.style.display = "none";
                w.style.display = "block"
                fetchbuyers(3)
                fetchinventory(3)
            } else {
                w.style.display = "none";
            }
            break
        default:
            x=0
            break
    }
    
}

function fetchinventory(arg) {

    articles = ipcRenderer.sendSync('fetch-inventory', 'SELECT * FROM inventory order by itemName asc')

    if(arg == 1){
        var element = '<select id="select-article"><option value="-1">Select Article</option>'
        var i
        for (i=0; i<articles.length; i++) {
            element += '<option value="'+articles[i].itemId+'">' + articles[i].itemName + '</option><br>'
        }
        element += '</select>'
        document.getElementById('article-dropdown').innerHTML = element    
    } else if(arg == 2){
        var element = '<select id="select-article2"><option value="-1">Select Article</option>'
        var i
        for (i=0; i<articles.length; i++) {
            element += '<option value="'+articles[i].itemId+'">' + articles[i].itemName + '</option><br>'
        }
        element += '</select>'
        document.getElementById('article-dropdown-modal').innerHTML = element    
    } else if(arg == 3){
        var element = '<select id="select-article3"><option value="-1">Select Article</option>'
        var i
        for (i=0; i<articles.length; i++) {
            element += '<option value="'+articles[i].itemId+'">' + articles[i].itemName + '</option><br>'
        }
        element += '</select>'
        document.getElementById('article-dropdown2').innerHTML = element    
    } else if(arg == 4){
    var element = '<h3 align="center">Inventory</h3>'
    var i
    if(articles.length != 0){
        element += '<table border=1 style="width:100%;>'+
                    '<tr class="cart-tr">'+
                    '<td class="cart-text"><b>Name</b></td>'+
                    '<td class="cart-text"><b>Price</b></td>'+
                    '<td class="cart-text"></td></tr>'
        for (i = 0; i<articles.length; i++){
            element += '<tr class="cart-tr">'+
                        '<td class="cart-text">'+articles[i].itemName+'</td>'+
                        '<td class="cart-text">'+articles[i].itemPrice+'</td>'+
                        '<td id="inventory-td">'+
                        '<img src="../assets/images/editicon.png" width="30px" height="30px" onclick="showInventoryModal('+articles[i].itemId+')"></td>'+
                        '</tr>'
        }
        element += '</table>'
        console.log(element)
        console.log(articles)
    } else{
        element += '<h2>Inventory is empty!</h2>'
    }

    document.getElementById('inventory-list').innerHTML = element
    }

}

function fetchbuyers(arg){

    buyers = ipcRenderer.sendSync('fetch-buyers', 'SELECT * FROM customers order by cName asc')

    if(arg == 1){
        var element = '<select id="select-buyer"><option value="-1">Select Buyer</option>'
        var i
        for (i=0; i<buyers.length; i++) {
            element += '<option value="'+buyers[i].cId+'">' + buyers[i].cName + '</option><br>'
        }
        element += '</select>'
        if(arg == 1){
            document.getElementById('buyer-dropdown').innerHTML = element
        } else if(arg == 3){
            document.getElementById('buyer-dropdown2').innerHTML = element
        }


    } else if(arg == 2){
        var element = '<tr><td><b>S. No.</b></td><td><b>Buyer Name</b></td></tr>'
        var i
        for (i=0; i<buyers.length; i++) {
            element += '<tr class="hover-list" onclick="showModal('+buyers[i].cId+')"><td>'+(i+1)+'</td><td>' + buyers[i].cName + '</td></tr>'
        }
        document.getElementById('buyer-list').innerHTML = element


    } else if(arg == 3){
        var element = '<select id="select-buyer-report"><option value="-1">Select Buyer</option>'
        var i
        for (i=0; i<buyers.length; i++) {
            element += '<option value="'+buyers[i].cId+'">' + buyers[i].cName + '</option><br>'
        }
        element += '</select>'
        if(arg == 1){
            document.getElementById('buyer-dropdown').innerHTML = element
        } else if(arg == 3){
            document.getElementById('buyer-dropdown2').innerHTML = element
        }
    }
}

function fetchSpecialPriceList(cId){
    var query = 'select i.itemName, i.itemPrice as originalPrice,sp.itemPrice as specialPrice, sp.specialId'+
        ' from inventory as i, specialpricetable as sp'+
        ' where sp.cId = '+cId+' and i.itemId = sp.itemId'

    var returnVal = ipcRenderer.sendSync('fetch-special-price', query)
    var element

    if(returnVal.length != 0){
        element = '<tr><td><b>Delete</b></td><td><b>Article Name</b></td>'+
        '<td><b>Original Price</b></td>'+
        '<td><b>Special Price</b></td><td><b>Update</b></td></tr>'
        var i
        for (i=0; i<returnVal.length; i++) {
        element += '<tr class="hover-list">'+
        '<td><input type="button" value="Delete" class="delete-btn" onclick="deleteSpecialPrice('+returnVal[i].specialId+')"></td>'+
        '<td>'+returnVal[i].itemName+'</td><td>'+ returnVal[i].originalPrice +'</td>'+
        '<td><input type="number" step="any" value="'+ returnVal[i].specialPrice +'"></td>'+
        '<td><input type="button" value="Update" class="input-button"></td></tr>'
        }
    } else {
        element = '<p align="center" style="padding:10px;">No Special Prices Found.</p>'
    }
        document.getElementById('special-price-list').innerHTML = element

}

function editSpecialPrice(arg){
    console.log(arg)
}

function calculateTotal(){
    var aId = document.getElementById('select-article')
    var bId = document.getElementById('select-buyer')

    articleId =  aId.options[aId.selectedIndex].value
    buyerId =  bId.options[bId.selectedIndex].value
    quantity = qInput.value
    saleDate = dateInput.value

    if(articleId != -1){
        if(quantity != 0){
            if(buyerId != -1){
                if(saleDate != null){
                    saleDate = '"'+saleDate+'"'
                    getFinalAmount(articleId,buyerId,quantity)
                } else{
                alert('Please select a valid date')
            }
            } else{
                alert('Please select a buyer')
            }
        } else{
            alert('Quantity must be atleast equal to 1')
        }
    } else {
        alert('Please select an article')
    }
}

function getFinalAmount(itemId, cId, qtt){
    var returnVal = ipcRenderer.sendSync('fetch-price', 'SELECT `itemPrice` FROM `specialpricetable` WHERE cId = '+ cId +' AND itemId = ' +  itemId)
    
    if(returnVal.length == 0){
        returnVal = ipcRenderer.sendSync('fetch-price', 'SELECT itemPrice FROM inventory WHERE itemId = ' + itemId)
    }

    calculated = true

    for (i=0; i<returnVal.length; i++) {
        pricePerUnit = returnVal[i].itemPrice
    }

    finalAmount = (qtt * pricePerUnit)
    totalP.innerHTML = "<b>&#8377; " + finalAmount + '</b>'
}

//add to cart
function addToCart(){
    if(calculated){
        var query = 'INSERT INTO cart(itemId, cId, amount, totalItems,saleDate) VALUES ('+articleId+','+buyerId+','+finalAmount+','+quantity+','+saleDate+')'
        ipcRenderer.sendSync('add-to-cart', query)
        calculated = false
        fetchCart()
        fetchinventory(1)
        fetchbuyers(1)
        //fetchCart()
        qInput.value = ''
        totalP.innerHTML = ''
        document.getElementById("sale-date").valueAsDate = new Date();
    } else{
        alert('Calculate Total Amount First')
    }
}

function saveSale(){
    if(calculated){
        calculated = false
        var query = 'INSERT INTO sales(itemId, cId, saleDate, saleAmount, totalItems) VALUES ('+articleId+','+buyerId+','+saleDate+','+finalAmount+','+quantity+')'
        ipcRenderer.sendSync('save-sale', query)
        alert('Sale Saved Successfully')
        fetchinventory(1)
        fetchbuyers(1)
        fetchCart()
        qInput.value = ''
        totalP.innerHTML = ''
        document.getElementById("sale-date").valueAsDate = new Date();
    } else{
        alert('Calculate Total Amount First')
    }
}

function fetchCart(){
    var query = "select ca.cartId, i.itemName, c.cName, totalItems, amount, DATE_FORMAT(saleDate, '%d-%b-%Y') as saleDate from inventory as i, customers as c, cart as ca WHERE c.cId = ca.cId and i.itemId = ca.itemId"
    var returnVal = ipcRenderer.sendSync('fetch-cart',query)
    //console.log(returnVal)
    var element = '<h3 align="center">CART</h3>'
    var i
    if(returnVal.length != 0){
        element += '<table class="cart-table">'
        for (i = 0; i<returnVal.length; i++){
            element += '<tr class="cart-tr"><td class="cart-text"><b>'+returnVal[i].cName+'</b></td>'
            element += '<td class="cart-text" onclick="deleteFromCart('+returnVal[i].cartId+')" id="x-cart"><b><font color="red">X</font></b></td></tr>'
            element += '<tr class="cart-tr"><td class="cart-text">'+returnVal[i].itemName+'</td>'
            element += '<td class="cart-text">Qty: '+returnVal[i].totalItems+'</td></tr>'
            element += '<tr class="cart-tr" style="border-bottom:1px solid black"><td class="cart-text">'+returnVal[i].saleDate+'</td>'
            element += '<td class="cart-text">Amount: &#8377;'+returnVal[i].amount+'</td></tr>'
        }
        element += '<tr><td colspan="3" align="center"><input type="button" onclick="saveFromCart()" value="Save Sale" class="input-button"></td></tr></table>'
    } else{
        element += '<h2>Cart is empty!</h2>'
    }

    document.getElementById('sale-cart').innerHTML = element
    
}

function deleteFromCart(cartId){
    var query = 'delete from cart where cartId='+cartId
    ipcRenderer.sendSync('delete-from-cart', query)
    fetchCart()
}

function saveFromCart(){
    var query = 'insert into sales(itemId,cId,saleAmount,totalItems,saleDate) SELECT cart.itemId,cart.cId,cart.amount,cart.totalItems,cart.saleDate from cart'
    
    var confirmMessage = confirm('Are you sure?')

    if(confirmMessage == true){
        ipcRenderer.sendSync('save-from-cart', query)
        alert('Sale Save Successfully!')
        emptyCart()
    }
}

function emptyCart(){
    var query = 'delete from cart'
    ipcRenderer.sendSync('empty-cart', query)
    fetchCart()
}

function saveArticle(){

    articleName = aName.value
    articlePrice = aPrice.value

    var query = "INSERT INTO inventory(itemName, itemPrice) VALUES ('"+articleName+"','"+articlePrice+"')"

    if(articleName != ""){
        if(articlePrice != ""){
            ipcRenderer.sendSync('save-new-article', query)
            alert('Article added to inventory')
            aName.value = ''
            aPrice.value = ''
            fetchinventory(4)
        } else{
            alert('Please enter the article price')
        }
    } else {
        alert('Please enter the article name')
    }

}

// Get the modal
var inventoryModal = document.getElementById('inventory-modal');

var editItemId
var editAname
var editAprice

function showInventoryModal(iId){
    editItemId = iId
    inventoryModal.style.display = "block";
    var query = 'select * from inventory where itemId = '+iId

    var result = ipcRenderer.sendSync('fetch-one-article', query)
    console.log(result)

    document.getElementById('inv-edit-aname').value = result[0].itemName
    document.getElementById('inv-edit-price').value = result[0].itemPrice

}

function updateArticle(){

    editAname = document.getElementById('inv-edit-aname').value
    editAprice = document.getElementById('inv-edit-price').value

    console.log(editAname+' '+editAprice)

    var query = 'update inventory '+
                "set itemName = '"+editAname+"', itemPrice = '"+editAprice+"' "+
                'where itemId ='+editItemId

    if(editAname.length != 0){
        if(editAprice.length != 0 && editAprice != 0){
            ipcRenderer.sendSync('update-article', query)
            inventoryModal.style.display = "none";
            alert('Article Updated')
            fetchinventory(4)
        } else{
            alert('Price cannot be zero!')
        }
    } else{
        alert('Please enter a valid name!')
    }

}

function deleteArticle(){
    var query = 'DELETE FROM inventory WHERE itemId='+editItemId
    
    var confirmMessage = confirm('Are you sure?')

    if(confirmMessage == true){
        ipcRenderer.sendSync('delete-article', query)
        inventoryModal.style.display = "none";
            alert('Article Deleted!')
            fetchinventory(4)
    }
}

function invOut() {
    inventoryModal.style.display = "none";
}

function saveBuyer(){

    buyerName = bName.value

    var query = "INSERT INTO customers(cName) VALUES ('"+buyerName+"')"

    if(buyerName != ""){
        ipcRenderer.sendSync('save-new-buyer', query)
        alert('Buyer added to the list')
        fetchbuyers(2)
        bName.value = ''
    } else {
        alert('Please enter the buyer name')
    }

}

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
//var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
// btn.onclick = function() {
//     modal.style.display = "block";
// }

function showModal(arg) {
    modal_buyerId = arg
    var query = "select * from customers where cId = "+arg

    var buyerName = ipcRenderer.sendSync('fetch-one-buyer', 'select cName from customers where cId = '+arg)

    console.log(buyerName)

    document.getElementById('buyer-edit-bname').value = buyerName[0].cName

    fetchinventory(2)
    fetchSpecialPriceList(arg)

    var result = ipcRenderer.sendSync('fetch-buyer-details', query)

    document.getElementById('modal-heading').innerHTML = result[0].cName
    modal.style.display = "block";
}

function updateBuyer(){
    var editBuyerName = document.getElementById('buyer-edit-bname').value
    if(editBuyerName.length==0){
        alert('Please enter a valid name!')
    } else{
        var query = "UPDATE customers SET cName='"+editBuyerName+"' WHERE cId="+modal_buyerId
        var result = ipcRenderer.sendSync('update-buyer', query)
        if(result.changedRows==1){
            alert('Buyer Name Updated!')
        } else{
            alert('Error!')
        }
    }
    
}

function deleteBuyer(){
    var confirmMessage = confirm('Are you sure?')

    if(confirmMessage == true){
        var query = "DELETE FROM customers WHERE cId="+modal_buyerId
        var result = ipcRenderer.sendSync('delete-buyer', query)
        if(result.affectedRows==1){
            alert('Buyer Deleted!')
            modal.style.display = "none";
            fetchbuyers(2)
        } else{
            alert('Error!')
        }
    }
    
    
}

function updateSpecialPrice(){
    
}

function deleteSpecialPrice(){
    
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }

var sp

//save special price
function saveSpecialPrice(){
    ad = document.getElementById('select-article2')
    sp = document.getElementById('article-price-modal')

    var maid = ad.options[ad.selectedIndex].value
    var sPrice = 0
    sPrice = sp.value

    if(maid != -1){
        if(sPrice != 0){
            save_Special(modal_buyerId,maid,sPrice)
        } else{
            alert('Please enter a valid price.')
        }
    } else {
        alert('Please select an article.')
    }

}

function save_Special(c,a,p){

    var look = 'select 1 as result from specialpricetable where cId = '+c+' and itemId = '+a
                
    var update = 'update specialpricetable set itemPrice = '+p+' where cId = '+c+' and itemId = '+a+''

    var insert = 'INSERT INTO specialpricetable(cId, itemId, itemPrice) VALUES ('+c+','+a+','+p+')'

    var result = ipcRenderer.sendSync('check-special-price', look)

    if(result.length == 1){
        ipcRenderer.sendSync('update-special-price', update)
        alert('Special price updated!')
        fetchinventory(2)
        sp.value = ''
        fetchSpecialPriceList(c)
    } else if(result.length == 0){
        ipcRenderer.sendSync('insert-special-price', insert)
        alert('Special price inserted!')
        fetchSpecialPriceList(c)
    }
}

var report_modal = document.getElementById('report-modal')

function fireReportModal(arg){
    if(arg == 1){

    } else if(arg == 2){

    } else if(arg == 3){
        
    } else if(arg == 4){
        var b = document.getElementById('select-buyer-report')
        var bid = b.options[b.selectedIndex].value
        if(bid != -1){
            ipcRenderer.sendSync('next-page-setter', "update passingvalues set id = "+bid+" where purpose='customerId'")
            gotoList(2)
            // report_modal.style.display = "block"
            // getSales(bid)
        } else {
            alert('Please select a buyer.')
        }
    }
}

function gotoList(arg){
    if(arg == 1){
        ipcRenderer.send('synchronous-message', 'html/sale_list.html')
    } else if(arg == 2){
        ipcRenderer.send('synchronous-message', 'html/bill_page.html')
    } else if(arg == 3){
        ipcRenderer.send('synchronous-message', 'html/sale_by_buyers.html')
    } else if(arg == 4){
        ipcRenderer.send('synchronous-message', 'html/sales_by_article.html')
    }
}

function getSales(bid){
    document.getElementById('sale-report').innerHTML = ''
    var saleTable = document.getElementById('sale-report').innerHTML
    
    var grandTotal = 0

    var i
    var j

    var articleArray = new Array()
    var dateArray = new Array()
    var sumArray = new Array()
    var unitPriceArray = new Array()
    
    var query = 'SELECT DISTINCT s.itemId, i.itemName from sales as s,inventory as i where s.cId = '+bid+' and i.itemId = s.itemId ORDER by i.itemName ASC'
    var datesQuery = "SELECT DISTINCT DATE_FORMAT(saleDate, '%Y-%m-%d') as dates from sales where cId = "+bid+" ORDER by saleDate ASC"
    var sumQuery = 'SELECT sales.itemId, sum(sales.totalItems) as totalSum '+
                    'FROM sales, inventory '+
                    'where cId = '+bid+' and '+
                    'inventory.itemId = sales.itemId '+
                    'GROUP BY itemId '+
                    'ORDER BY inventory.itemName'
    var cNameQuery = 'SELECT cName FROM customers WHERE cId = '+bid

    var modalCName = ipcRenderer.sendSync('fetch-buyer-details', cNameQuery)

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

function printReport(){
    window.print()
}

window.onclick = function() {
    if (event.target == report_modal) {
        report_modal.style.display = "none";
    } else if (event.target == modal) {
        modal.style.display = "none";
        fetchbuyers(2)
    } else if (event.target == inventoryModal) {
        inventoryModal.style.display = "none";
    }
}