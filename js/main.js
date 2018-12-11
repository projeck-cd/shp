localStorage.setItem("key", "value");//存储变量名为key，值为value的变量 
localStorage.getItem("key");//获取存储的变量key的值
localStorage.removeItem("key")//删除变量名为key的存储变量

var btnList = document.querySelectorAll('.btn-group .btn');
var totalQty = document.getElementsByName('totalQty')[0];



for (const key in btnList) {
    if (btnList.hasOwnProperty(key)) {
        const element = btnList[key];
        switch (element.name) {
            case 'increase': element.addEventListener('click', increaseValue); break;
            case 'decrease': element.addEventListener('click', decreaseValue); break;
            case 'addToCart': element.addEventListener('click', addToCart); break;
        }
    }
}
function increaseValue(e) {
    var qtyObj = e.target.nextElementSibling;
    var qty = parseInt(qtyObj.innerText);
    qty++;
    qtyObj.innerText = qty;
    console.log(qty);
}
function decreaseValue(e) {
    var qtyObj = e.target.previousElementSibling;
    var qty = parseInt(qtyObj.innerText);
    if (qty > 1) qty--;
    else qty = 0;
    qtyObj.innerText = qty;
    console.log(qty);
}

function addToCart(e) {
    var qtyObj = e.target.previousElementSibling.previousElementSibling;
    var qty = parseInt(qtyObj.innerText);
    var total = parseInt(totalQty.innerText);
    total += qty;
    totalQty.innerText = total;
}

//商品类
class Product {
    constructor(id, Sname, imgSRC, price) {
        // 商品类成员
        this.id = id;
        this.Sname = Sname;
        this.imgSRC = imgSRC;
        this.price = price;
    }
}

// var product1 = new Product('01', '鼠标', '../image/KTV.png', 5.00);

// 订单类成员
class Order {
    constructor(product, qty, selectStatus) {

        this.id = product.id;
        this.Sname = product.Sname;
        this.price = product.price;
        this.imgSRC = product.imgSRC;
        this.qty = qty;
        this.selectStatus = selectStatus;
    }
}
// var order = new Order(product, 2, true);
// var Sname = order.Sname;

// 购物车数据类---确定格式
class Cartdata {
    // 数据成员 订单列表 总样本 总件数 总金额
    constructor() {
        this.orderList = new Array();
        this.units = 0;//总样本
        this.totalQty = 0;//总件数
        this.totalAmount = 0;//总金额
    }
}
var cartdata = new Cartdata();

//购物车操作类
class ShoppingCart {

    //   将购物车数据写入本地存储中
    setDataToLocalStorage(cartdata) {
        var cartdataString = JSON.stringify(cartdata);
        // 写入本地存储
        localStorage.setItem('test', cartdataString);
    }
    //   从本地存储中获取购物车数据
    getDataFromLocalStorage() {

        let test = localStorage.getItem('test');
        // 判断购物车是否为空
        if (test == null || test == '') {
            return new Cartdata();
        }
        else {
            return JSON.parse(test);
        }
    }


    // 获取选中对象列表的总数量
    // 1、获取购物车数据：解决如何获取，存放变量
    // 2、获取订单列表
    // 3、遍历订单列表（逐一判断每个订单的选中状态）
    // （1）选中的，累加订单数量
    // （2）未选中，就不统计该订单数量
    // 4、返回选中状态的总数量
    getSelectedQty() {
        let selectQty = 0;
        let cartdata = this.getDataFromLocalStorage();
        for (let i = 0; i < cartdata.orderList.length; i++) {
            if (cartdata.orderList[i].selectStatus) {
                selectQty += cartdata.orderList[i].qty;
            }
        }
        return selectQty;
    }

    // 获取选中对象列表的总价格
    // 1、获取购物车数据：解决如何获取，存放变量
    // 2、获取订单列表
    // 3、遍历订单列表（逐一判断每个订单的选中状态）
    // （1）选中的，累加（订单数量*订单价格）
    // （2）未选中，就不统计
    // 4、返回选中状态的总价格
    getSelectedAmount() {
        let selectAmount = 0;
        let cartdata = this.getDataFromLocalStorage();
        let orderList = cartdata.orderList;
        for (let i in orderList) {

            if (orderList[i].selectStatus) {
                selectAmount += cartdata.orderList[i].price * cartdata.orderList[i].qty;
            }
        }
        return selectAmount;
    }
    // 设置购物车订单项选中状态
    // 1、获取购物车数据：解决如何获取，存放变量
    // 2、获取订单列表
    // 3、遍历订单列表，逐一判断每个订单的id是否等于指定id（形式参数）
    // (1) 找到对应id，设置选择状态selectStatus（形式参数） 结束循环
    // (2）没找到，继续遍历直到订单列表遍历完成
    setItemSelectStatus(id, selectStatus) {
        //获取购物车数据
        let cartdata = this.getDataFromLocalStorage();
        let orderList = cartdata.orderList;
        //   查找Id对应的订单
        let order= this.find(id,orderList);
        //   判断位置，位置为空报错提示，如果不为空就设置状态
        if (order == null) {
            //   没有找到id
            console.log('订单ID有误');
            return;
        }
        else {
            //   找到对应id
            order.selectStatus = selectStatus;
        }
        //   写入本地存储
        this.setDataToLocalStorage(cartdata);
    }

    //     var cartdata = this.getDataFromLocalStorage();
    //     let orderList = cartdata.orderList;
    //     let isNewProduct = false;
    //     for (const i in orderList) {
    //         if (id == orderList[i].id) {
    //             orderList[i].selectStatus = selectStatus;
    //             isNewProduct = true;
    //         }
    //     }
    //     if ( isNewProduct) this.setDataToLocalStorage(cartdata);
    // }


    //查找指定id的订单
    find(id,orderList) {
       
        for (const i in orderList) {
            if (id == orderList[i].id) {
               return orderList[i];
            }
        }
        return null;
    }

    //将订单写入购物车(写入LocalStorage)
    addToCart(order) {

        cartdata = this.getDataFromLocalStorage();
        // 订单2进购物车进cartdata
        var isNewProduct = false;//假设isOldProduct是假，代表当前状态是新商品
        //遍历订单列表。判断新加入商品是否在购物车中
        for (const i in cartdata.orderList) {
            if (order.id == cartdata.orderList[i].id) {
                isNewProduct = true;//新近订单的ID与购物车中某个商品的id相等，是购物车中已经存在的商品，修改状态
                // 新增对应qty
                cartdata.orderList[i].qty += order.qty;
                break;
            }
        }
        if (!isNewProduct) {
            //  order是购物车中的新商品，给样本数++
            cartdata.orderList.push(order);
            cartdata.units++;
        }
        // 总计数据
        cartdata.totalQty += order.qty;
        cartdata.totalAmount = order.price * order.qty;
        // 将新购物车数据写入本地存储
        this.setDataToLocalStorage(cartdata);
    }

    //清除购物车（移除本地存储购物车项）
    clearCart() {
        localStorage.removeItem('test');
    }

    //删除指定ID商品
// （1）获取购物车数据
// （2）获取订单列表
// （4）遍历订单列表，逐一判断每个订单的id是否等于指定id（形式参数）
//     a)找到对应id, 则删除所选id，修改总样本数、总价格、总件数 
//     b)没找到，继续遍历直到订单列表遍历完成，提示没有指定id.
// （5）如果删除成功，数据写入本地存储

     deleteItem(id) {
        //  获取购物车数据
        let cartdata = this.getDataFromLocalStorage();
        // 获取订单列表
        let orderList = cartdata.orderList;
        //   查找指定ID的订单（要删除的订单）
        let order= this.find(id,orderList);
        // 定位要删除的订单在数组中的位置
        let index=orderList.indexOf(order,0);

        if (index == -1) {
            //   没有找到id
            console.log('订单ID有误');
          
        }
        else{
            // 删除当前订单
            orderList.splice(index,1);
            // 变更总商品总件数
         cartdata.totalQty-=order.qty;
        //  变更商品总价格
         cartdata.totalAmount-=order.qty*order.price;
        //  变更总商品件数
        cartdata.units--;
        // 数据回写购物车
        this.setDataToLocalStorage(cartdata);
        }
    }
    
      // 减少/增加指定商品的数量（+1或者-1）
      changeQty(id, op) {
        let cartData = this.getDataFromLocalStorage();
        let orderList = cartData.orderList;
        let order = this.find(id,orderList);
        // console.log(index);
        if (order == null) {
            console.log('订单id有误');
            return;
        } else {
            if (op == '+') {
                //改变当前订单数量                                
               order.qty++;
                // 变更总商品总数
                cartData.totalQty++;
                //变更商品总价格
                cartData.totalAmount +=order.price;
            } else if (op == '-') {
                //改变当前订单数量
                order.qty--;
                // 变更总商品总数
                cartData.totalQty--;
                //变更商品总价格
                cartData.totalAmount -=order.price;
            }

            //数据回写购物车
            this.setDataToLocalStorage(cartData);
        }
    }

    getTotalUnits(){
        let cartdata=this.getDataFromLocalStorage();
        return cartdata.units;
    }
     
  

}