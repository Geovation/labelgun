import rbush from 'rbush';

export default class labelgun {
  constructor(hideLabel, showLabel) {

    this.tree = rbush(6);
    this.allLabels = {};
    this._point = undefined;
    this.hasChanged = new Set();
    this.loaded = false;
    this.allChanged = false;
    this.hideLabel = hideLabel;
    this.showLabel = showLabel;

    const self = this;

  }

    /**
   * @name _total
   * @summary get the total hidden or shown labels in the tree
   * @param {string} state whether to return 'hide' or 'show' state label totals
   * @returns {number} total number of labels of taht state
   */
  _total(state) {
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
  totalShown() {
    return this._total("show");
  }


  /**
   * @name totalHidden
   * @summary return the total number of hidden labels
   * @returns {number}
   */
  totalHidden() {
    return this._total("hide");
  }

    /**
   * @name getLabelsByState
   * @summary provided a state get all labels of that state
   * @returns {array}
   * @private
   */
  _getLabelsByState(state) {
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
  getHidden() {
    return this._getLabelsByState("hide");
  }

  /**
   * @name getShown
   * @summary Return an array of all shown labels
   * @returns {array}
   */
  getShown() {
    return this._getLabelsByState("show");
  }

  /**
   * @name getCollisions
   * @summary Return a set of collisions (hidden and shown) for a given label
   * @param {string} id the ID of the label to get
   * @returns {array}
   */
  getCollisions(id) {
     var label = this.allLabels[id];
     var collisions =  this.tree.search(label);
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
  getLabel(id) {
    return this.allLabels[id];
  }

  /**
   * @name destroy
   */
  destroy() {
    this._resetTree();
    this.allLabels = {};
  }

  /**
   * @name forceLabelStates
   * @summary Allows you to set a state for all current labels
   * @param {string} forceState the class of which to change the label to
   * @returns {undefined}
   */
  forceLabelStates(forceState) {
     this.tree.all().forEach(label => {
      this._labelHasChangedState(label, forceState);
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
  _labelHasChangedState(label, forceState) {
    const state = forceState || label.state;
    if (state === "show") this.showLabel(label);
    if (state === "hide") this.hideLabel(label);
  }

  /**
   * @name _setupLabelStates
   * @summary Clears current tree and readds all stations
   * @returns {undefined}
   */
  setupLabelStates() {

    if(this.allChanged) {
      this.allChanged = false;
      this.hasChanged.clear();
      this._resetTree();

      for (var id in this.allLabels) {

        const label = this.allLabels[id];

        this.ingestLabel(
          {
            bottomLeft: [label.minX, label.minY],
            topRight: [label.maxX, label.maxY]
          },
          label.id,
          label.weight,
          label.labelObject,
          label.name,
          label.isDragged
        );

      }

    }
    else if(this.hasChanged.size) {
      const changed = [...this.hasChanged];
      this.hasChanged.clear();
      changed.forEach(id => {

        const label = this.allLabels[id];

        this.ingestLabel(
          {
            bottomLeft: [label.minX, label.minY],
            topRight: [label.maxX, label.maxY]
          },
          label._id,
          label.weight,
          label.labelObject,
          label.name,
          label.isDragged
        );

      });

    }

  }

  /**
   * @name _resetTree
   * @summary Clears current tree and redraws projection overlay
   * @returns {undefined}
   */
  update() {

      this.allChanged = true;
      this.setupLabelStates();
      this.handleExCollisions();
      this._hideShownCollisions(); // HACK ALERT: why is this necessary ? :(
      this.forceLabelStates();

  }

  handleExCollisions() {
    this.getHidden().forEach(hidden => {
      this._handleExCollisions(hidden);
    });
  }

  /**
   * @name _resetTree
   * @summary Clears current tree and redraws projection overlay
   * @returns {undefined}
   * @private
   */
  _resetTree() {
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
      weight: weight || 1,
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
    if (forceUpdate) this.forceLabelStates(true);
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

  _hideShownCollisions() {

    // This method shouldn't have to exist...
    this.getShown().forEach((label) => {
     this.getCollisions(label.id).forEach((collision) => {
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
  _handleCollisions(collisions, label, isDragged) {
    let originalWeight;
    if (label.isDragged) label.weight = Infinity;
    let highest = label;

    collisions.forEach(collision => {

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
  ingestLabel(boundingBox, id, weight, labelObject, labelName, isDragged) {
    const label = this._makeLabel(boundingBox, id, weight, labelObject, labelName, isDragged);
    const oldLabel = this.allLabels[id];
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
  labelHasChanged(id) {
    this.hasChanged.add(id);
  }

}
