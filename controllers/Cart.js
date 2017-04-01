module.exports = function Cart(oldcart){


  this.items = oldcart.items || {};
  this.totalqty = 0;
  this.totalPrice = 0;
  this.arr = [];

  this.add = function(item, id){
    var storedItem;
    if(this.items[id]){
      storedItem = this.items[id];
    } else {
      storedItem = {item: item, price : 0, qty : 0};
    }
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.items[id] = storedItem;
    this.processCart();
  };

  this.processCart = function(){

    this.generateArray();
    var arrayItems = this.arr;
    for(i=0;i<arrayItems.length;i++){
      this.totalPrice += arrayItems[i].item.price * arrayItems[i].qty ;
      this.totalqty += arrayItems[i].qty;
    }
  };

  this.generateArray = function() {
    var arr = [];
    for (var id in this.items) {
        arr.push(this.items[id]);
    }
    this.arr = arr;
};

};
