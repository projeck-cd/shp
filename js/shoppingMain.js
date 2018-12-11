
var cart = new ShoppingCart();
var cartRoot = document.querySelector('#cartRoot');
// 订单根节点
var cartListNode=document.querySelector('#cartContent');
const dataNameJson = {
    "price": "[data-name='price']",
    "qty": "[data-name='qty']",
    "imgSrc": '[data-name="imgSrc"]',
    "subPrice": '[data-name="subPrice"]',
    "selectedQty": '[data-name="selectedQty"]',
    "selectedAmount": '[data-name="selectedAmount"]',
    "units": '[data-name="units"]'
};

const operatorNameJson = {
    "checkItem": "[data-operator='checkItem']",
    "increase": "[data-operator='increase']",
    "decrease": "[data-operator='decrease']",
    "deleteItem": "[data-operator='deleteItem']"
};


//显示购物车所有订单列表
function displayOrderList() {
    //获取购物车
    let cartData = cart.getDataFromLocalStorage();
    // console.log(cartData);
    //获取购物车的JSON数据中的订单列表
    let orderList = cartData.orderList;
    //挂接到父元素，找到孩子节点
    let cartContent = document.querySelector("#cartContent");
    //获取id
    let exampleNode = document.querySelector('#orderExample');
    for (let i = 0; i < orderList.length; i++) {

        //重新定义一个order,把orderList元素重新赋值给order
        let order = orderList[i];
        //克隆样本节点
        let orderNew = exampleNode.cloneNode(true);
        // 设id
        orderNew.id = order.id;
        // console.log(orderNew); 
        //挂接到父元素，找到孩子节点       
        cartContent.appendChild(orderNew);
        //移除新节点到隐藏属性
        orderNew.classList.remove("d-none");

        // 获取照片的节点
        let imgSrcNew = orderNew.querySelector('[data-name="imgSrc"]');
        imgSrcNew.src = 'images/' + order.imgSRC;

        //获取名字的所有节点
        let nameNew = orderNew.querySelector('[data-name="title"]');
        nameNew.textContent = order.Sname;

        //获取单价的所有节点
        let priceNew = orderNew.querySelector('[data-name="price"]');
        priceNew.textContent = (order.price).toFixed(2);

        // 选中状态
        let selectNew = orderNew.querySelector('[data-operator="checkItem"]');
        selectNew.textContent = order.selectStatus;

        //获取小计的节点
        let subPriceNew = orderNew.querySelector('[data-operator="subPrice"]');
        subPriceNew.textContent = (order.price * order.qty).toFixed(2);

        //获取数量
        let qtyNew = orderNew.querySelector('[ data-operator="qty"]');
        qtyNew.textContent = order.qty;

        // 为删除按钮设计一个data-id属性
    //    element=node.querySelector(operatorNameJson.deleteItem);
    //     element.setAttribute('data-id',order.id);

        // 为加号按钮注册单击事件
        let increaseBtns = document.querySelectorAll('[data-operator="increase"]');
        console.log(increaseBtns);
        for (const key in increaseBtns) {
            increaseBtns[key].onclick = changeQtyEventFun;
        }
    
        // 为减号按钮注册单击事件
        let decreaseBtns = document.querySelectorAll('[data-operator="decrease"]');
        console.log(decreaseBtns);
        for (const key in decreaseBtns) {
            decreaseBtns[key].onclick = changeQtyEventFun;
        }

        
    // 获取所有+号节点
    // element = cartRoot.querySelectorAll(operatorNameJson.increase);
    //  console.log(element);
    // // 为每个+号节点注册单机事件,事件触发函数
    // for (const i in element) {
    //     element[i].onclick = changeQtyEventFun;
    // }
    // // 获取所有-号节点
    // element = cartRoot.querySelectorAll(operatorNameJson.decrease);
    //  console.log(element);
    // // 为每个-号节点注册单机事件,事件触发函数
    // for (const i in element) {
    //     element[i].onclick =  changeQtyEventFun;
    // }


    }
}



function displaySelectedTotal() {

    //获取总数相关节点,并设置对应值

    let totalNode = document.querySelector(dataNameJson.units);

    totalNode.textContent = cart.getTotalUnits();


    totalNode = document.querySelector(dataNameJson.selectedQty);
    // console.log(dataNameJson.selectedQty);
    totalNode.textContent = cart.getSelectedQty();

    totalNode = document.querySelector(dataNameJson.selectedAmount);
    totalNode.textContent = (cart.getSelectedAmount()).toFixed(2);

}

function regEvent() {
    // 获取清空购物车节点
    let clearAll = document.querySelector('[data-operator="clearAll"]');
    // console.log(clearAll);
    // 注册单击事件触发函数
    clearAll.onclick = clearAllEventFun;

    // 注册删除操作的单击事件
  clearAll=document.querySelectorAll('[data-operator="deleteltem"]');
//   console.log(clearAll);

for(const i in clearAll){
    clearAll[i].onclick=deleteItemEventFun;
}
    }

// 清空事件触发函数
function clearAllEventFun() {
    cart.clearCart();
    // 获取订单根节点
    // let cartListNode = document.querySelector('#cartContent');
    //保留样本节点
    let exampleNode = (document.querySelector('#orderExample')).cloneNode(true);
    //清除订单根节点的所有元素
    cartListNode.innerHTML = "";
    //将样本节点挂接回列表根节点
    cartListNode.appendChild(exampleNode);
    // 更新商品总数据
    displaySelectedTotal();
}

//删除事件触发函数
function deleteItemEventFun(e) {
    // console.log(e);

  
    //获取获取当前被单击的删除按钮
    let currentBtn=e.target;
    //获取单击按钮的父节点的父节点
    let node=currentBtn.parentNode.parentNode;
    //删除父节点的id 
    cart.deleteItem(node.id);
    //移除订单根节点的父节点
    cartListNode.removeChild(node);
    displaySelectedTotal();
    
 
}

// 增加减少按钮触发函数
function changeQtyEventFun(e) {

    //   //获取获取当前订单节点
    //    let node = this.parentNode.parentNode;
    //    console.log(node);
    // //获取购物车订单列表根元素
    // let cartListNode = document.querySelector('#cartList');
    // // 获取当前订单行元素
    // let currItemNode = cartListNode.querySelector('[data-id="' + id + '"]');
 

      // 获取当前订单数量节点
      let qtyNode = node.querySelector(dataNameJson.qty);
    //  console.log(qtyNode);
  
    // 获取当前订单数量
    let qty = parseInt(qtyNode.textContent);
     console.log(qty);

    // 获取当前操作是+号还是-号
    let AddOrMinus = this.textContent;
   console.log(AddOrMinus);

    // 获取当前订单的id
    let id = node.id;
     console.log(id);

    // 获取当前订单的小计
    let subPrice = node.querySelector(dataNameJson.subPrice);
    // console.log(subPrice);
    // 获取当前订单的单价
    let PriceNode = node.querySelector(dataNameJson.price);
    console.log(PriceNode);

    // 订单数量加或减
    if (AddOrMinus == '+') {
        qty++;
    } else {
        qty--;
        if (qty <= 0) { qty = 1; return; }
    }
    // 修改页面订单数量
    qtyNode.textContent = qty;
    // 调用指定某个订单数量加1/减1的方法
    cart.changeQty(id, AddOrMinus);
    // 修改小计
    subPrice.textContent = (qtyNode.textContent *PriceNode.textContent).toFixed(2);
    // 修改商品的总数和总价格
    displaySelectedTotal();

}





// 初始化函数
function init() {
    // 显示订单列表
    displayOrderList();
    // 显示总数据
    displaySelectedTotal();
    // 为所有操作节点注册事件
    regEvent();
}

// 调用初始化函数
init();