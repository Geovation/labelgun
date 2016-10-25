import rbush from 'rbush';

export default class labelgun {
  constructor(hideLabel, showLabel) {

    this.tree = rbush(6);
    this.allLabels = {};
    this._point = undefined;
    this.hasChanged = new Set();
    this.loaded = false;
    this.hasZoomed = false;
    this.hideLabel = hideLabel;
    this.showLabel = showLabel;
    const self = this;

  }

  /**
   * @name destroy
   */
  destroy() {
    this.resetTree();
    this.allLabels = {};
  }

  /**
   * @name forceLabelStates
   * @summary Allows you to set a state for all current labels
   * @param {boolean} forceUpdate if true, adds entities to lazy render queue
   * @param {string} forceState the class of which to change the label to
   * @returns {undefined}
   */
  forceLabelStates(forceUpdate, forceState) {
    this._labelHasChangedStates(forceUpdate, forceState);
  }

  /**
   * @name _labelHasChangedStates
   * @summary Calls labelHasChangedState for all entities in the tree
   * @param {boolean} forceUpdate if true, adds entities to lazy render queue
   * @param {string} forceState the class of which to change the label to
   * @returns {undefined}
   * @private
   */
  _labelHasChangedStates(forceUpdate, forceState) {
    this.tree.all().forEach(function(label){
      this._labelHasChangedState(label, forceUpdate, forceState);
    }.bind(this));
  }

  /**
   * @name _labelHasChangedState
   * @summary Sets the class for a particular label
   * @param {string} label the label to update
   * @param {boolean} forceUpdate if true, adds the label to lazy render queue
   * @param {string} forceState the class of which to change the label to
   * @returns {undefined}
   * @private
   */
  _labelHasChangedState(label, forceUpdate, forceState) {

    const state = forceState || label.state;
    if (state === "show") this.showLabel(label);
    if (state === "hide") this.hideLabel(label);

  }

  /**
   * @name _setupLabelStates
   * @summary Clears current tree and readds all stations
   * @returns {undefined}
   * @private
   */
  _setupLabelStates() {
    if(this.hasZoomed) {
      this.hasZoomed = false;
      this.hasChanged.clear();
      this.resetTree();

      for (var id in this.allLabels) {
        const label = this.allLabels[id];
        if (label.boundingBox) {
          this._prioritiseLabel(
            label.boundingBox,
            label._id,
            label.weight,
            label.labelObject,
            label.name,
            label.isDragged
          );
        }
      }


    }
    else if(this.hasChanged.size) {
      const changed = [...this.hasChanged];
      this.hasChanged.clear();
      changed.forEach(function(id) {

        const label = this.allLabels[id];

        if (label.boundingBox) {
          this._prioritiseLabel(
            label.boundingBox,
            label._id,
            label.weight,
            label.labelObject,
            label.name,
            label.isDragged
          );
        }
      }.bind(this));

    }
    this._throttledHandleExCollisions(1000); // Only allow to execute once a second
  }

  /**
   * @name _resetTree
   * @summary Clears current tree and redraws projection overlay
   * @returns {undefined}
   * @private
   */
  resetTree() {
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
  _makeLabel(boundingBox, id, weight, labelObject, labelName, isDragged) {
    return {
      minX: boundingBox.bottomLeft[0],
      minY: boundingBox.bottomLeft[1],
      maxX: boundingBox.topRight[0],
      maxY: boundingBox.topRight[1],
      state: "hide",
      id : id,
      weight: weight,
      labelObject : labelObject,
      labelName : labelName,
      isDragged : isDragged
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
  removeFromTree(label, forceUpdate) {
    const id = label.id || label;
    const removelLabel = this.allLabels[id];
    this.tree.remove(removelLabel);
    delete this.allLabels[id];
    if (forceUpdate) this._labelHasChangedStates(true);
  }

  /**
   * @name _addToTree
   * @param {object} label
   * @summary inserts label into tree
   * @returns {undefined}
   * @private
   */
  _addToTree(label) {
    this.allLabels[label.id] = label;
    this.tree.insert(label);
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
  _handleCollisions(collisions, label, isDragged) {
    let originalWeight;
    if (label.isDragged) label.weight = Infinity;
    let highest = label;

    collisions.forEach(function(collision) {
      const notItself = collision.id !== label.id;

      if (notItself) {

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
      }
    }, this);

    highest.state = "show";

    if (originalWeight) highest.weight = originalWeight;
  }

 _throttle (callback, limit) {
    var wait = false;                 // Initially, we're not waiting
    return function () {              // We return a throttled function
        if (!wait) {                  // If we're not waiting
            callback.call();          // Execute users function
            wait = true;              // Prevent future invocations
            setTimeout(function () {  // After a period of time
                wait = false;         // And allow future invocations
            }, limit);
        }
    };
  }

  /**
   * @name _throttledHandleCollisions
   * @param {array} collisions array of labels that have unresolved collisions
   * @param {object} label label to handle collisions for
   * @param {boolean} isDragged if label is currently being dragged
   * @param {number} throttle interval to throttle calls by
   * @summary Ensures handleCollisions cannot be called more than once per throttle time
   * @returns {undefined}
   * @private
   */
  _throttledHandleCollisions(collisions, label, isDragged, throttle) {
    return this._throttle(function() {
      this._handleCollisions(collisions, label, isDragged);
    }.bind(this), throttle)();
  }


  /**
   * @name _handleExCollisions
   * @param {object} hidden hidden label
   * @summary Checks to see if a previously hidden/collided label is now able to be shown and then shows
   * @returns {undefined}
   * @private
   */
  _handleExCollisions(hidden) {
    if (hidden.state === "hide") {
      let stillCollides = false;
      const hiddenLabels = this.tree.search(hidden);
      for (var i=0; i < hiddenLabels.length; i++){
        if (hiddenLabels[i].state !== "hide") {
          stillCollides = true;
          break;
        }
      }
      if (!stillCollides) {
        //console.log(hidden.id, "SHOW");
        hidden.state = "show";
      }
    }
  }

  /**
   * @name _throttledHandleExCollisions
   * @param {number} throttle interval to throttle calls by
   * @summary Calls handleExCollisions on every tree label, no often than the throttle time
   * @returns {undefined}
   * @private
   */
  _throttledHandleExCollisions(throttle) {
    return this._throttle(function() {
      this.tree.all().forEach(this._handleExCollisions, this);
    }.bind(this), throttle)();
  }

  /**
   * @name _prioritiseLabel
   * @param {object} boundingBox
   * @param {string} id
   * @param {number} weight
   * @param {object} gmLabel
   * @param {string} labelName
   * @param {boolean} isDragged
   * @summary Creates a label if it does not already exsist, then adds it to the tree, and renders it based on whether it can be shown
   * @returns {object}
   * @private
   */
  _prioritiseLabel(boundingBox, id, weight, labelObject, labelName, isDragged) {
    const label = this._makeLabel(boundingBox, id, weight, labelObject, labelName, isDragged);
    const newLabel = !this.allLabels[id];
    if (!newLabel) this.removeFromTree(label);
    this._addToTree(label);
    var collisions = this.tree.search(label);
    if (!collisions.length || isDragged) {
      label.state = "show";
      return;
    }

    this._throttledHandleCollisions(collisions, label, isDragged, 1000);

  }

  labelHasChanged(id) {
    this.hasChanged.add(id);
  }

}
