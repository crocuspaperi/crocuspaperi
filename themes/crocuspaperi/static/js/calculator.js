;(function (w, d) {

  // TODO:
  // 2. Add descriptions to each step and every option

  // Don't collide with hugo template delimiters
  Vue.options.delimiters = ['${', '}'];

  var config = calculatorConfig;

  Vue.component('radio-picker', {
    props: ['label', 'index', 'options', 'value', 'checked'],
    template: '#radio-picker-template'
  });

  Vue.component('products', {
    props: ['label', 'index', 'options', 'value'],
    template: '#products-template'
  });

  Vue.component('printing', {
    props: ['label', 'index', 'pickedProducts'],
    template: '#printing-template',
    methods: {
      variants: function (product) {
        if (!config.products.hasOwnProperty(product)) {
          return [];
        }

        return config.products[product].variants;
      }
    }
  });

  var data = {
    pickedDesignType: config.defaultDesignType,
    designTypes: {
      options: Object.keys(config.designTypes)
    },
    pickedProducts: [],
    products: {
      options: Object.keys(config.products)
    },
    pickedVariants: [],
    pickedDelivery: config.defaultDelivery,
    delivery: {
      options: Object.keys(config.delivery)
    },
  };

  var app = new Vue({
    el: '#calculator',
    data: data,
    computed: {
      totalAmount: function () {
        var variantsCost = this.pickedVariants.reduce(function (acc, el) {
          var variant = config.products[el.product].variants[el.variant];
          var total = calculateTotalPrice(el.value, variant.price, variant.priceType);
          return acc + total;
        }, 0);

        var designTotal = 0;
        if (this.pickedDesignType) {
          var designPrice = config.designTypes[this.pickedDesignType].price;
          designTotal = designPrice * this.pickedVariants.length;
        }

        var deliveryTotal = 0;
        if (this.pickedDelivery) {
          deliveryTotal = config.delivery[this.pickedDelivery].price;
        }

        return variantsCost + designTotal + deliveryTotal;
      }
    },
    methods: {
      toggleProduct: function (product) {
        var index = this.pickedProducts.indexOf(product);
        if (index === -1) {
          this.pickedProducts.push(product);
        } else {
          // Remove product
          this.pickedProducts.splice(index, 1);
          // Remove picked variants from that product
          this.pickedVariants = this.pickedVariants.filter(function (el) {
            return el.product !== product;
          });
        }
      },
      toggleVariant: function (d) {
        var existing = this.pickedVariants.filter(function (el) {
          return el.product === d.product && el.variant === d.variant;
        });

        if (existing.length) {
          // If this variant is already picked, remove
          this.pickedVariants.splice(this.pickedVariants.indexOf(existing[0]), 1);
        }

        d.value = parseInt(d.value, 10);
        if (!isNaN(d.value)) {
          this.pickedVariants.push(d);
        }
      }
    }
  });

  function calculateTotalPrice(amount, price, priceType) {
    switch (priceType) {
      case 'perProduct':
        return totalPricePerProduct(amount, price);
      case 'perAmount':
      default:
        return totalPricePerAmount(amount, price);
    }
  }

  function totalPricePerProduct(amount, price) {
    // If amount is less than 20 then use higher price
    if (amount < 20) {
      amount = 20
    }
    // else use price per amount
    return totalPricePerAmount(amount, price);
  }

  function totalPricePerAmount(amount, price) {
    // Just use linear function
    return amount * price;
  }

})(window, document);
