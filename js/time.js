function ChangeImage( Orange , img ) {
    document.getElementById(Orange).src = img;
 }
 function CountdownTimer(elm, tl, mes) {
    this.initialize.apply(this, arguments);
    }
    CountdownTimer.prototype = {
    initialize: function (elm, tl, mes) {
    this.elem = document.getElementById(elm);
    this.tl = tl;
    this.mes = mes;
    }, countDown: function () {
    var timer = '';
    var today = new Date();
    var day = Math.floor((this.tl - today) / (24 * 60 * 60 * 1000));
    var milli = Math.floor(((this.tl - today) % (24 * 60 * 60 * 1000)) / 10) % 100;

    var me = this;
    
    if ((this.tl - today) > 0) {
    if (day)
    timer += day;
    this.elem.innerHTML = timer;
    tid = setTimeout(function () {
    me.countDown();
    }, 10);
    } else {
    this.elem.innerHTML = this.mes;
    return;
    }
    }, addZero: function (num) {
    return ('0' + num).slice(-2);
    }
    }
    function CDT() {
    var tl = new Date('2027/7/17 00:00:00');// ここで日付を指定
    var timer = new CountdownTimer('CDT', tl, '00:00:00');
    timer.countDown();
    }
    
    
    
    window.onload = function () {
    CDT();
    CDT01();
    }



    