$(function(){
		
	// handlebars functions for defining template object
	// populate initial list of "all products"
	var catalogTemplate = Handlebars.compile($('#catalogTemplate').html());
	$('.catalogItems').append( catalogTemplate(default_products	) );

	// object definitions
	var categoriesWithDupes = []; 	// pulls categories from default_products
	var categories = []; 			// eliminates redundant categories
	var currentProducts = [];		// selected category
	var	cart = [];					// cart object

	var buildlist = function () {
		// build duplicate list
		for (i in default_products) {
			categoriesWithDupes.push(default_products[i]["category"]);
			};

		// filter out duplicates
		categories = categoriesWithDupes.filter(function(elem,pos) {
			return categoriesWithDupes.indexOf(elem) == pos;
		})		
		// append to DOM as options in select input
		for (i in categories) {
			$('#catalogSelector').append("<option value=\"" + categories[i] + "\">" + categories[i]);
			};
	}

	// displays catalog when filters applied.
	var displayCatalog = function(e) {
		var selectedCategory = this.value;
		var categoryItem = $('#catalogTemplate');

		if (selectedCategory == "all") {
			catalogTemplate = Handlebars.compile($('#catalogTemplate').html());
			$('.catalogItems').append( catalogTemplate(default_products	) );

		} else { 
			$('.catalogItem').remove();
			currentProducts = [];
			
			for (i in default_products) {
				if (default_products[i].category == selectedCategory) {
					currentProducts.push(default_products[i]);
				} 
			}

			catalogTemplate = Handlebars.compile(categoryItem.html());
			$('.catalogItems').append(catalogTemplate(currentProducts));
		}
	}


	var addOrUpdateCart = function(e) {
		var itemToAdd = {
			"sku":"",
			"image":"",
			"name":"",
			"price":"",
			"quantityOrdered":1,
			"subtotal": 0
		};
		itemToAdd.sku = (this.parentElement.className);
		// find object that matches classname
		for (i in default_products) {
			if (itemToAdd.sku == default_products[i]["sku"]) {
				itemToAdd["image"] = default_products[i]["thumbnail"];
				itemToAdd["name"] = default_products[i]["name"];
				itemToAdd["price"] = default_products[i]["price"];

			}
		}																																																																																																																																																																																																																																																																																																																																																																	
	// add object to cart if it is the first one
		var howMany = (cart.length);
		var isUnique = false;
		var validator = -1;
		var pushItemToCart = function(itm) {}
		if (howMany == 0) {
			itemToAdd.subtotal = formatMoney(itemToAdd.price * itemToAdd.quantityOrdered);
			cart.push(itemToAdd);
			renderCart(cart);
		} else {
			for (i in cart) {
				if (cart[i]["sku"] == itemToAdd["sku"]) {
					cart[i]["quantityOrdered"] += 1;
					validator += 1;
					cart[i]["subtotal"] = formatMoney(cart[i]["price"] * cart[i]["quantityOrdered"]);
					renderCart(cart);
				}
			}			
			if (validator == -1) {
				itemToAdd.subtotal = formatMoney(itemToAdd.price * itemToAdd.quantityOrdered);
				cart.push(itemToAdd);
			}
		}

		if (cart.length > 0) {
			$('.checkoutButton').removeClass('disabled');
		}
				renderCart(cart);
	}

	var renderCart = function(cart) {
		$('.cartItem').remove();
		var cartTemplate = Handlebars.compile($('#cartTemplate').html());
		$('.cartItems').append( cartTemplate(cart) );		
	}

	var showNavigator = function() {
		$(".navigator").slideToggle("2000");
	}

	var showImage = function() {
		var previewImage = this.src;
		$(".previewImage img").attr("src", previewImage);
		$(".blur").show();
		$(".preview").show();
		
	}

	var hideImage = function() {
		$(".blur").hide();
		$(".preview").hide();
	}

	var clearCartClick = function() {
		cart = [];
		$('.checkoutButton').addClass('disabled');
		renderCart(cart);
		$('.catalog').show();
		$('.checkout').hide();
	}

	var reduceItemClick = function() {
		var reduceSku = this.parentElement.className;
		for (i in cart) {
			var cartItem = cart[i].sku + " ";
			if (cartItem == reduceSku) {
				if (cart[i].quantityOrdered > 1){
					cart[i].quantityOrdered--;
					cart[i].subtotal = formatMoney(cart[i].price * cart[i].quantityOrdered);
				} else {
					cart.splice(i,1);
				}
			}

			if (cart.length == 0) {
				$('.checkoutButton').addClass('disabled');
			}
			renderCart(cart);
		}
	}

	var removeItemClick = function() {
		var removeSku = this.parentElement.className;
		for (i in cart) {
			var cartItem = cart[i].sku + " ";
			if (cartItem == removeSku) {
				cart.splice(i, 1);	
				renderCart(cart);		
			}
		}
		if (cart.length == 0) {
			$('.checkoutButton').addClass('disabled');
		}
		$('.catalog').show();
	}

	var checkoutButtonClick = function() {
		$('.catalog').hide();
		$('.checkout').show();
		var subtot = 0;
		var tax = .07;
		var total = 0;
		for (i in cart) {
			 subtot += cart[i].subtotal;
		}
		tax *=subtot;
		total = subtot + tax;
		$('.orderSubtotal').val(formatMoney(subtot));
		$('.orderTax').val(formatMoney(tax));
		$('.orderTotal').val(formatMoney(total));
	}

	var continueShoppingClick = function () {
		$('.checkout').hide();
		$('.catalog').show();
	}

function formatMoney(number, places, symbol, thousand, decimal) {
	number = number || 0;
	places = !isNaN(places = Math.abs(places)) ? places : 2;
	symbol = symbol !== undefined ? symbol : "$";
	thousand = thousand || ",";
	decimal = decimal || ".";
	var negative = number < 0 ? "-" : "",
	    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
	    j = (j = i.length) > 3 ? j % 3 : 0;
	return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
}

	buildlist();
	$("#catalogSelector").change(displayCatalog);
	$(".catalogItems").on("click", ".addItem", addOrUpdateCart);
	$("nav").on("click", showNavigator);
	$(".catalogItems").on("click", "img", showImage);
	$(".cartItems").on("click","img",showImage);
	$(".previewButton").on("click", hideImage);
	$(".clearCart").on("click", clearCartClick);
	$(".cartItems").on("click", ".reduceItem", reduceItemClick);
	$(".cartItems").on("click", ".removeItem", removeItemClick);
	$(".checkoutButton").on("click", checkoutButtonClick);
	$(".continueShopping").on("click", continueShoppingClick);
	$(".cancelOrder").on("click", clearCartClick);
});