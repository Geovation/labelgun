(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("rbush"));
	else if(typeof define === 'function' && define.amd)
		define(["rbush"], factory);
	else if(typeof exports === 'object')
		exports["labelgun"] = factory(require("rbush"));
	else
		root["labelgun"] = factory(root["rbush"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rbush = __webpack_require__(0);

var _rbush2 = _interopRequireDefault(_rbush);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var labelgun = function () {
  function labelgun(hideLabel, showLabel) {
    _classCallCheck(this, labelgun);

    this.tree = (0, _rbush2.default)(6);
    this.allLabels = {};
    this._point = undefined;
    this.hasChanged = new Set();
    this.loaded = false;
    this.allChanged = false;
    this.hideLabel = hideLabel;
    this.showLabel = showLabel;

    var self = this;
  }

  /**
  * @name _total
  * @summary get the total hidden or shown labels in the tree
  * @param {string} state whether to return 'hide' or 'show' state label totals
  * @returns {number} total number of labels of taht state
  */


  _createClass(labelgun, [{
    key: "_total",
    value: function _total(state) {
      var total = 0;
      for (var keys in this.allLabels) {
        if (this.allLabels[keys].state == state) {
          total += 1;
        }
      }
      return total;
    }

    /**
     * @name totalShown
     * @summary return the total number of shown labels
     * @returns {number}
     */

  }, {
    key: "totalShown",
    value: function totalShown() {
      return this._total("show");
    }

    /**
     * @name totalHidden
     * @summary return the total number of hidden labels
     * @returns {number}
     */

  }, {
    key: "totalHidden",
    value: function totalHidden() {
      return this._total("hide");
    }

    /**
    * @name getLabelsByState
    * @summary provided a state get all labels of that state
    * @returns {array}
    * @private
    */

  }, {
    key: "_getLabelsByState",
    value: function _getLabelsByState(state) {
      var labels = [];
      for (var keys in this.allLabels) {
        if (this.allLabels[keys].state == state) {
          labels.push(this.allLabels[keys]);
        }
      }
      return labels;
    }

    /**
    * @name getHidden
    * @summary Return
    * @returns {array}
    */

  }, {
    key: "getHidden",
    value: function getHidden() {
      return this._getLabelsByState("hide");
    }

    /**
     * @name getShown
     * @summary Return an array of all shown labels
     * @returns {array}
     */

  }, {
    key: "getShown",
    value: function getShown() {
      return this._getLabelsByState("show");
    }

    /**
     * @name getCollisions
     * @summary Return a set of collisions (hidden and shown) for a given label
     * @param {string} id the ID of the label to get
     * @returns {array}
     */

  }, {
    key: "getCollisions",
    value: function getCollisions(id) {
      var label = this.allLabels[id];
      var collisions = this.tree.search(label);
      var self = collisions.indexOf(label);
      if (self !== undefined) collisions.splice(self, 1);
      return collisions;
    }

    /**
     * @name getLabel
     * @summary Convience function to return a label by ID
     * @param {string} id the ID of the label to get
     * @returns {object}
     */

  }, {
    key: "getLabel",
    value: function getLabel(id) {
      return this.allLabels[id];
    }

    /**
     * @name destroy
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this._resetTree();
      this.allLabels = {};
    }

    /**
     * @name forceLabelStates
     * @summary Allows you to set a state for all current labels
     * @param {string} forceState the class of which to change the label to
     * @returns {undefined}
     */

  }, {
    key: "forceLabelStates",
    value: function forceLabelStates(forceState) {
      var _this = this;

      this.tree.all().forEach(function (label) {
        _this._labelHasChangedState(label, forceState);
      });
    }

    /**
     * @name _labelHasChangedState
     * @summary Sets the class for a particular label
     * @param {string} label the label to update
     * @param {string} forceState the class of which to change the label to
     * @returns {undefined}
     * @private
     */

  }, {
    key: "_labelHasChangedState",
    value: function _labelHasChangedState(label, forceState) {
      var state = forceState || label.state;
      if (state === "show") this.showLabel(label);
      if (state === "hide") this.hideLabel(label);
    }

    /**
     * @name _setupLabelStates
     * @summary Clears current tree and readds all stations
     * @returns {undefined}
     */

  }, {
    key: "setupLabelStates",
    value: function setupLabelStates() {
      var _this2 = this;

      if (this.allChanged) {
        this.allChanged = false;
        this.hasChanged.clear();
        this._resetTree();

        for (var id in this.allLabels) {

          var label = this.allLabels[id];

          this.ingestLabel({
            bottomLeft: [label.minX, label.minY],
            topRight: [label.maxX, label.maxY]
          }, label.id, label.weight, label.labelObject, label.name, label.isDragged);
        }
      } else if (this.hasChanged.size) {
        var changed = [].concat(_toConsumableArray(this.hasChanged));
        this.hasChanged.clear();
        changed.forEach(function (id) {

          var label = _this2.allLabels[id];

          _this2.ingestLabel({
            bottomLeft: [label.minX, label.minY],
            topRight: [label.maxX, label.maxY]
          }, label._id, label.weight, label.labelObject, label.name, label.isDragged);
        });
      }
    }

    /**
     * @name _resetTree
     * @summary Clears current tree and redraws projection overlay
     * @returns {undefined}
     */

  }, {
    key: "update",
    value: function update() {

      this.allChanged = true;
      this.setupLabelStates();
      this.handleExCollisions();
      this._hideShownCollisions(); // HACK ALERT: why is this necessary ? :(
      this.forceLabelStates();
    }
  }, {
    key: "handleExCollisions",
    value: function handleExCollisions() {
      var _this3 = this;

      this.getHidden().forEach(function (hidden) {
        _this3._handleExCollisions(hidden);
      });
    }

    /**
     * @name _resetTree
     * @summary Clears current tree and redraws projection overlay
     * @returns {undefined}
     * @private
     */

  }, {
    key: "_resetTree",
    value: function _resetTree() {
      this.tree.clear();
    }

    /**
     * @name _makeLabel
     * @param {object} boundingBox
     * @param {string} id
     * @param {number} weight
     * @param {string} labelName
     * @param {boolean} isDragged
     * @summary Creates a standard label object with a default state
     * @returns {object}
     * @private
     */

  }, {
    key: "_makeLabel",
    value: function _makeLabel(boundingBox, id, weight, labelObject, labelName, isDragged) {
      return {
        minX: boundingBox.bottomLeft[0],
        minY: boundingBox.bottomLeft[1],
        maxX: boundingBox.topRight[0],
        maxY: boundingBox.topRight[1],
        state: "hide",
        id: id,
        weight: weight || 1,
        labelObject: labelObject,
        labelName: labelName,
        isDragged: isDragged
      };
    }

    /**
     * @name _removeFromTree
     * @param {object} label
     * @param {boolean} forceUpdate if true, triggers all labels to be updated
     * @summary Removes label from tree
     * @returns {undefined}
     * @private
     */

  }, {
    key: "removeFromTree",
    value: function removeFromTree(label, forceUpdate) {
      var id = label.id || label;
      var removelLabel = this.allLabels[id];
      this.tree.remove(removelLabel);
      delete this.allLabels[id];
      if (forceUpdate) this.forceLabelStates(true);
    }

    /**
     * @name _addToTree
     * @param {object} label
     * @summary inserts label into tree
     * @returns {undefined}
     * @private
     */

  }, {
    key: "_addToTree",
    value: function _addToTree(label) {
      this.allLabels[label.id] = label;
      this.tree.insert(label);
    }
  }, {
    key: "_hideShownCollisions",
    value: function _hideShownCollisions() {
      var _this4 = this;

      // This method shouldn't have to exist...
      this.getShown().forEach(function (label) {
        _this4.getCollisions(label.id).forEach(function (collision) {
          if (collision.state == "show") {
            collision.state = "hide";
          }
        });
      });
    }

    /**
     * @name _handleCollisions
     * @param {array} collisions array of labels that have unresolved collisions
     * @param {object} label label to handle collisions for
     * @param {boolean} isDragged if label is currently being dragged
     * @summary Weighted collisions resolution for labels
     * @returns {undefined}
     * @private
     */

  }, {
    key: "_handleCollisions",
    value: function _handleCollisions(collisions, label, isDragged) {
      var originalWeight = void 0;
      if (label.isDragged) label.weight = Infinity;
      var highest = label;

      collisions.forEach(function (collision) {

        if (collision.isDragged) {
          originalWeight = collision.weight;
          highest = collision;
          highest.weight = Infinity;
        }

        if (collision.weight > highest.weight) {
          highest.state = "hide";
          highest = collision;
        } else {
          collision.state = "hide";
        }
      });

      highest.state = "show";
      if (originalWeight) highest.weight = originalWeight;
    }

    /**
     * @name _handleExCollisions
     * @param {object} hidden hidden label
     * @summary Checks to see if a previously hidden/collided label is now able to be shown and then shows
     * @returns {undefined}
     * @private
     */

  }, {
    key: "_handleExCollisions",
    value: function _handleExCollisions(hidden) {

      if (hidden.state === "hide") {
        var stillCollides = false;
        var hiddenLabels = this.tree.search(hidden);
        for (var i = 0; i < hiddenLabels.length; i++) {
          if (hiddenLabels[i].state !== "hide") {
            stillCollides = true;
            break;
          }
        }
        if (!stillCollides) {
          hidden.state = "show";
        }
      }
    }

    /**
     * @name _ingestLabel
     * @param {object} boundingBox
     * @param {string} id
     * @param {number} weight
     * @param {object} gmLabel
     * @param {string} labelName
     * @param {boolean} isDragged
     * @summary Creates a label if it does not already exsist, then adds it to the tree, and renders it based on whether it can be shown
     * @returns {object}
     */

  }, {
    key: "ingestLabel",
    value: function ingestLabel(boundingBox, id, weight, labelObject, labelName, isDragged) {
      var label = this._makeLabel(boundingBox, id, weight, labelObject, labelName, isDragged);
      var oldLabel = this.allLabels[id];
      if (oldLabel) this.removeFromTree(oldLabel);
      this._addToTree(label);
      var collisions = this.getCollisions(id);
      if (!collisions.length || isDragged) {
        label.state = "show";
        return;
      }

      this._handleCollisions(collisions, label, isDragged);
    }

    /**
     * @name labelHasChanged
     * @summary let labelgun know the label has changed
     * @returns {undefined}
     */

  }, {
    key: "labelHasChanged",
    value: function labelHasChanged(id) {
      this.hasChanged.add(id);
    }
  }]);

  return labelgun;
}();

exports.default = labelgun;

/***/ }
/******/ ]);
});