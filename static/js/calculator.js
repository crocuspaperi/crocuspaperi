;(function (w, d) {

  // Don't collide with hugo template delimiters
  Vue.options.delimiters = ['${', '}'];

  var config = calculatorConfig;

  /**
   * Radio picker component. Used for design type and delivery type selections.
   */
  Vue.component('radio-picker', {
    props: {
      label: {
        type: String,
        required: true,
      },
      index: {
        type: [String, Number],
        required: true,
      },
      options: {
        type: Array,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
      totalPrice: {
        type: Number,
        default: 0,
      },
      priceText: String,
      description: String,
    },
    template: '#radio-picker-template'
  });

  /**
   * Products component. Used for selecting products.
   */
  Vue.component('products', {
    props: {
      label: {
        type: String,
        required: true,
      },
      index: {
        type: [String, Number],
        required: true,
      },
      options: {
        type: Array,
        required: true,
      },
      designPriceTotal: {
        type: Number,
        required: true,
      },
      description: String,
    },
    template: '#products-template'
  });

  /**
   * Printing component. Used for selecting variants and their amounts.
   */
  Vue.component('variants', {
    props: {
      label: {
        type: String,
        required: true,
      },
      index: {
        type: [String, Number],
        required: true,
      },
      pickedProducts: {
        type: Array,
        required: true,
      },
      price: {
        type: Function,
        required: true,
      },
      priceTotal: {
        type: Number,
        required: true,
      },
      description: String,
      additional: Boolean,
      priceText: {
        type: String,
        required: true,
      },
    },
    template: '#variants-template',
    methods: {
      /**
       * List all available variants for a given product
       */
      variants: function (product) {
        var products = this.additional
          ? config.additionalProducts
          : config.products;
        if (!products.hasOwnProperty(product)) {
          return [];
        }

        return products[product].variants;
      }
    }
  });

  /**
   * Transcript component. Used to display the order details.
   */
  Vue.component('transcript', {
    props: {
      pickedDesign: String,
      designPriceTotal: Number,
      pickedProducts: Array,
      printingPriceTotal: Number,
      pickedVariants: Array,
      pickedVariantPrice: Function,
      additionalProductsPriceTotal: Number,
      additionalProducts: Array,
      additionalProductPrice: Function,
      pickedDelivery: String,
      deliveryPriceTotal: Number,
      totalPrice: Number,
    },
    template: '#transcript-template',
    methods: {
      selectText: function (e) {
        // In case browser doesn't support this API
        try {
          var range = document.createRange();
          range.selectNode(e.currentTarget);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
        } catch (e) {}
      }
    }
  });

  /**
   * Main application state
   */
  var state = {
    designTypes: {
      picked: config.defaultDesignType,
      options: Object.keys(config.designTypes)
    },
    products: {
      picked: [],
      options: orderProducts(Object.keys(config.products))
    },
    variants: {
      picked: [],
    },
    additionalProducts: {
      picked: [],
      options: Object.keys(config.additionalProducts)
    },
    delivery: {
      picked: config.defaultDelivery,
      options: Object.keys(config.delivery)
    },
  };

  /**
   * Main calculator application
   */
  var app = new Vue({
    el: '#calculator',
    data: state,
    computed: {
      /**
       * Calculate total design price
       */
      designPriceTotal: function () {
        var amount = this.products.picked.length;
        if (amount === 0) {
          return 0;
        }

        var coef = Math.ceil(amount / 2) - 1;

        var basePrice = this.designTypeConf.price;
        var stepPrice = this.designTypeConf.stepPrice;

        return basePrice + stepPrice * coef;
      },

      /**
       * Calculate total printing price
       */
      printingPriceTotal: function () {
        return this.variants.picked.reduce(function (acc, v) {
          return acc + app.printingPrice(v.product, v.variant);
        }, 0);
      },

      /**
       * Calculate total additional products price
       */
      additionalProductsPriceTotal: function () {
        return this.additionalProducts.picked.reduce(function (acc, v) {
          return acc + app.additionalProductsPrice(v.product, v.variant);
        }, 0);
      },

      /**
       * Calculate total delivery price
       */
      deliveryPriceTotal: function () {
        return config.delivery[this.delivery.picked].price;
      },

      /**
       * Calculate total order price
       */
      totalPrice: function () {
        return (
          this.printingPriceTotal
          + this.designPriceTotal
          + this.additionalProductsPriceTotal
          + this.deliveryPriceTotal
        );
      },

      /**
       * Return configuration of selected design type
       */
      designTypeConf: function () {
        return config.designTypes[this.designTypes.picked];
      },
    },
    methods: {
      /**
       * Calculate printing price for a given product and variant
       */
      printingPrice: function (product, variant) {
        return variantPriceGeneric(
          this.variants,
          config.products,
          product,
          variant
        );
      },

      /**
       * Calculate additional product price for a given product and variant
       */
      additionalProductsPrice: function (product, variant) {
        return variantPriceGeneric(
          this.additionalProducts,
          config.additionalProducts,
          product,
          variant
        );
      },

      /**
       * Check/uncheck the product
       */
      toggleProduct: function (product) {
        var index = this.products.picked.indexOf(product);
        if (index === -1) {
          this.products.picked.push(product);
        } else {
          // Remove product
          this.products.picked.splice(index, 1);
          // Remove picked variants from that product
          this.variants.picked = this.variants.picked.filter(function (el) {
            return el.product !== product;
          });
        }
      },

      /**
       * Choose the amount to print for a variant
       */
      chooseVariant: function (d) {
        chooseVariantGeneric(this.variants, d);
      },

      /**
       * Choose the amount of additional product
       */
      chooseAdditionalProduct: function (d) {
        chooseVariantGeneric(this.additionalProducts, d);
      }
    }
  });

  /**
   * Allow choosing product and additional product variants
   */
  function chooseVariantGeneric(variants, d) {
      var existing = variants.picked.filter(function (el) {
        return el.product === d.product && el.variant === d.variant;
      });

      if (existing.length) {
        // If this variant is already picked, remove
        variants.picked.splice(
          variants.picked.indexOf(existing[0]),
          1
        );
      }

      // Pick only variants with valid positive amounts
      d.value = parseInt(d.value, 10);
      if (!isNaN(d.value) && d.value > 0) {
        variants.picked.push(d);
      }
  }

  /**
   * Allow calculating variant price for printing and additional products
   */
  function variantPriceGeneric(variants, productConf, product, variant) {
    var found = variants.picked.filter(function (v) {
      return v.product === product && v.variant === variant;
    });

    var price = found.reduce(function (acc, v) {
      // Find costs for this variant
      var variant = productConf[v.product].variants[v.variant];
      return (
        acc
        + calculateTotalPrice(v.value, variant.price)
      );
    }, 0);

    return Math.ceil(price);
  }

  /**
   * Calculate total printing price
   */
  function calculateTotalPrice(amount, price) {
    if (Array.isArray(price)) {
      return totalPricePerProduct(amount, price);
    }

    return totalPricePerAmount(amount, price);
  }

  /**
   * Calculate total printing price when variant's price type is per product
   */
  function totalPricePerProduct(amount, prices) {
    if (amount <= 10) {
      return prices[0];
    }

    var group = Math.floor(amount / 50);
    if (group >= prices.length - 1) {
      // Always go to the price before the last one
      group = prices.length - 2;
    }
    var nextGroup = group + 1;

    var basePrice = prices[group]; // aka p0
    var nextBasePrice = prices[nextGroup]; // aka p1

    var baseAmount = group === 0 ? 10 : group * 50; // aka x0
    var nextBaseAmount = nextGroup * 50;

    // Price is calculated as:
    //   price = p0 + (amount - x0) * (p1 - p0) / (x1 - x0)
    // Function is derived from a line function where x is amount/horizontal axis
    // and p is price/vertical axis
    // E.g if amount is 20 then
    //   x0 is 10
    //   x1 is 50
    //   p0 is prices[0]
    //   p1 is prices[1]

    var x0 = baseAmount;
    var x1 = nextBaseAmount;
    var p0 = basePrice;
    var p1 = nextBasePrice;

    var price = Math.ceil(p0 + (amount - x0) * (p1 - p0) / (x1 - x0));
    return price;
  }

  /**
   * Calculate total printing price when variant's price type is per amount.
   * Uses linear function.
   */
  function totalPricePerAmount(amount, price) {
    return amount * price;
  }

  /**
   * Order products by weight and by name
   */
  function orderProducts(products) {
    function weight(product) {
      if (config.productOrdering.hasOwnProperty(product)) {
        return config.productOrdering[product].weight;
      }

      return 0;
    }

    return products.sort(function (a, b) {
      var aWeight = weight(a);
      var bWeight = weight(b);

      if (aWeight !== bWeight) {
        return aWeight - bWeight;
      }

      return a.localeCompare(b);
    });
  }

})(window, document);
