(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("rbush"));
	else if(typeof define === 'function' && define.amd)
		define(["rbush"], factory);
	else if(typeof exports === 'object')
		exports["labelgun"] = factory(require("rbush"));
	else
		root["labelgun"] = factory(root["rbush"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
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
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rbush = __webpack_require__(1);

var _rbush2 = _interopRequireDefault(_rbush);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* @summary create a label gun instance with a hide and show label callback
* @param {function} hideLabel the function responsible for hiding the label on hide event
* @param {function} showLabel the function responsible for showing the label on show event
* @param {number} entries Higher value relates to faster insertion and slower search, and vice versa
*/
var labelgun = function () {
  function labelgun(hideLabel, showLabel, entries) {
    _classCallCheck(this, labelgun);

    var usedEntries = entries || 6;
    this.tree = (0, _rbush2.default)(usedEntries);
    this.allLabels = {};
    this._point = undefined;
    this.hasChanged = new Set();
    this.loaded = false;
    this.allChanged = false;
    this.hideLabel = hideLabel;
    this.showLabel = showLabel;
  }

  /**
   * @name _total
   * @summary get the total hidden or shown labels in the tree
   * @param {string} state whether to return 'hide' or 'show' state label totals
   * @returns {number} total number of labels of that state
   * @private
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
     * @memberof labelgun
     * @method
     * @summary Return the total number of shown labels
     * @returns {number} Return total number of labels shown
     * @public
     */

  }, {
    key: "totalShown",
    value: function totalShown() {
      return this._total("show");
    }

    /**
     * @name totalHidden
     * @memberof labelgun
     * @method
     * @summary Return the total number of hidden labels
     * @returns {number} Return total number of labels hidden
     * @public
     */

  }, {
    key: "totalHidden",
    value: function totalHidden() {
      return this._total("hide");
    }

    /**
     * @name getLabelsByState
     * @summary Provided a state get all labels of that state
     * @param {string} state - the state of the labels to get (show or hide)
     * @returns {array} Labels that match the given state (show or hide)
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
     * @memberof labelgun
     * @method
     * @summary Return an array of all the hidden labels
     * @returns {array} An array of hidden labels
     */

  }, {
    key: "getHidden",
    value: function getHidden() {
      return this._getLabelsByState("hide");
    }

    /**
     * @name getShown
     * @memberof labelgun
     * @method
     * @summary Return an array of all shown labels
     * @returns {array} An array of shown label
     */

  }, {
    key: "getShown",
    value: function getShown() {
      return this._getLabelsByState("show");
    }

    /**
     * @name getCollisions
     * @memberof labelgun
     * @method
     * @summary Return a set of collisions (hidden and shown) for a given label
     * @param {string} id - the ID of the label to get
     * @returns {array} The list of collisions
     */

  }, {
    key: "getCollisions",
    value: function getCollisions(id) {
      var label = this.allLabels[id];
      var collisions = this.tree.search(label);
      var self = collisions.indexOf(label);

      // Remove the label if it's colliding with itself
      if (self !== undefined) collisions.splice(self, 1);
      return collisions;
    }

    /**
     * @name getLabel
     * @memberof labelgun
     * @method
     * @summary Convenience function to return a label by ID
     * @param {string} id the ID of the label to get
     * @returns {object} The label object for the id
     */

  }, {
    key: "getLabel",
    value: function getLabel(id) {
      return this.allLabels[id];
    }

    /**
     * @name destroy
     * @memberof labelgun
     * @method
     * @summary Destroy the collision tree and labels
     * @returns {undefined}
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this._resetTree();
      this.allLabels = {};
    }

    /**
     * @name callLabelCallbacks
     * @memberof labelgun
     * @method
     * @summary Perform the related callback for a label depending on where its state is 'show' or 'hide'
     * @param {string} [forceState] - the class of which to change the label to
     * @returns {undefined}
     */

  }, {
    key: "callLabelCallbacks",
    value: function callLabelCallbacks(forceState) {
      var _this = this;

      this.tree.all().forEach(function (label) {
        _this._callLabelStateCallback(label, forceState);
      });
    }

    /**
     * @name _callLabelStateCallback
     * @summary Calls the correct callback for a particular label depending on its state (hidden or shown)
     * @param {string} label the label to update
     * @param {string} forceState the state of which to change the label to ('show' or 'hide')
     * @returns {undefined}
     * @private
     */

  }, {
    key: "_callLabelStateCallback",
    value: function _callLabelStateCallback(label, forceState) {
      var state = forceState || label.state;
      if (state === "show") this.showLabel(label);
      if (state === "hide") this.hideLabel(label);
    }

    /**
     * @name setupLabelStates
     * @memberof labelgun
     * @method
     * @summary Sets up the labels depending on whether all have changed or some have changed
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

        Object.keys(this.allLabels).forEach(function (id) {

          var label = _this2.allLabels[id];

          _this2.ingestLabel({
            bottomLeft: [label.minX, label.minY],
            topRight: [label.maxX, label.maxY]
          }, label.id, label.weight, label.labelObject, label.name, label.isDragged);
        });
      } else if (this.hasChanged.size) {
        var changed = [].concat(_toConsumableArray(this.hasChanged));
        this.hasChanged.clear();
        changed.forEach(function (id) {

          var label = _this2.allLabels[id];

          _this2.ingestLabel({
            bottomLeft: [label.minX, label.minY],
            topRight: [label.maxX, label.maxY]
          }, label.id, label.weight, label.labelObject, label.name, label.isDragged);
        });
      }
    }

    /**
     * @name update
     * @memberof labelgun
     * @method
     * @summary Sets all labels to change and reruns the whole show/hide procedure
     * @returns {undefined}
     */

  }, {
    key: "update",
    value: function update() {

      this.allChanged = true;
      this.setupLabelStates();
      this._handlePreviousCollisions();
      this._hideShownCollisions();
      this.callLabelCallbacks();
    }

    /**
     * @name _handlePreviousCollisions
     * @memberof labelgun
     * @method
     * @summary Checks to see if a previously hidden/collided label is now able to be shown and then changes there state
     * @returns {undefined}
     * @private
     */

  }, {
    key: "_handlePreviousCollisions",
    value: function _handlePreviousCollisions() {
      var _this3 = this;

      this.getHidden().forEach(function (hidden) {
        if (hidden.state === "hide") {

          var stillCollides = false;
          var hiddenLabels = _this3.tree.search(hidden);

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
      });
    }

    /**
     * @name _resetTree
     * @memberof labelgun
     * @method
     * @summary Clears current tree containing all inputted labels
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
     * @memberof labelgun
     * @method
     * @param {object} boundingBox - The bounding box object with bottomLeft and topRight properties
     * @param {string} id - The idea of the label
     * @param {number} weight - The weight to calculate in the collision resolution
     * @param {object} labelObject - The object representing the actual label object from your mapping library
     * @param {string} labelName - A string depicting the name of the label
     * @param {boolean} isDragged - A flag to say whether the lable is being dragged
     * @summary Creates a standard label object with a default state
     * @returns {object} The label object 
     * @private
     */

  }, {
    key: "_makeLabel",
    value: function _makeLabel(boundingBox, id, weight, labelObject, labelName, isDragged) {

      if (weight === undefined || weight === null) {
        weight = 0;
      }

      return {
        minX: boundingBox.bottomLeft[0],
        minY: boundingBox.bottomLeft[1],
        maxX: boundingBox.topRight[0],
        maxY: boundingBox.topRight[1],
        state: "hide",
        id: id,
        weight: weight,
        labelObject: labelObject,
        name: labelName,
        isDragged: isDragged
      };
    }

    /**
     * @name _removeFromTree
     * @memberof labelgun
     * @method
     * @param {object} label - The label to remove from the tree
     * @param {boolean} forceUpdate if true, triggers all labels to be updated
     * @summary Removes label from tree
     * @returns {undefined}
     * @private
     */

  }, {
    key: "_removeFromTree",
    value: function _removeFromTree(label, forceUpdate) {
      var id = label.id || label;
      var removelLabel = this.allLabels[id];
      this.tree.remove(removelLabel);
      delete this.allLabels[id];
      if (forceUpdate) this.callLabelCallbacks(true);
    }

    /**
     * @name _addToTree
     * @memberof labelgun
     * @method
     * @param {object} label - The label to add to the tree
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
     * @memberof labelgun
     * @method
     * @param {array} collisions - array of labels that have unresolved collisions
     * @param {object} label - label to handle collisions for
     * @param {boolean} isDragged - if label is currently being dragged
     * @summary Weighted collisions resolution for labels in the tree
     * @returns {undefined}
     * @private
     */

  }, {
    key: "_handleCollisions",
    value: function _handleCollisions(collisions, label) {
      var originalWeight = void 0;
      if (label.isDragged) label.weight = Infinity;
      var highest = label;

      collisions.forEach(function (collision) {

        if (collision.isDragged) {
          originalWeight = collision.weight;

          // We set the dragged marker to the highest weight
          // and make its weight unbeatable (infinity)
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
     * @name ingestLabel
     * @memberof labelgun
     * @method
     * @param {object} boundingBox - The bounding box object with bottomLeft and topRight properties
     * @param {string} id - The idea of the label
     * @param {number} weight - The weight to calculate in the collision resolution
     * @param {object} labelObject - The object representing the actual label object from your mapping library
     * @param {string} labelName - A string depicting the name of the label
     * @param {boolean} isDragged - A flag to say whether the lable is being dragged
     * @summary Creates a label if it does not already exist, then adds it to the tree, and renders it based on whether it can be shown
     * @returns {undefined} 
     */

  }, {
    key: "ingestLabel",
    value: function ingestLabel(boundingBox, id, weight, labelObject, labelName, isDragged) {

      // If there is already a label in the tree, remove it
      var oldLabel = this.allLabels[id];
      if (oldLabel) this._removeFromTree(oldLabel);

      // Add the new label to the tree
      var label = this._makeLabel(boundingBox, id, weight, labelObject, labelName, isDragged);
      this._addToTree(label);

      // Get all of its collisions
      var collisions = this.getCollisions(id);

      // If the collisions are non existance we can show it
      if (!collisions.length) {
        label.state = "show";
        return;
      }

      // Else we need to handle the collisions and decide which one to show
      this._handleCollisions(collisions, label, isDragged);
    }

    /**
     * @name labelHasChanged
     * @memberof labelgun
     * @param id - The id of the label that has changed in some way
     * @method
     * @summary Let labelgun know the label has changed in some way (i.e. it's state for example, or that it is dragged)
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

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ })
/******/ ]);
});