ur1='js/cart.json';
var test = new XMLHttpRequest();
test.open('get', ur1);
test.responseType = 'json';
test.onreadystatechange = function () {
    if (test.readyState === 4 && test.status == 200) {
        test=test.response;
        console.log(test);
    }
}

test.send();
