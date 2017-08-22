/**
 * @module labelgun
 */

import rbush from "rbush";

export default class labelgun {

  /**
   * @constructor
   * @summary create a label gun instance with a hide and show label callback
   * @param {function} hideLabel the function responsible for hiding the label on hide event
   * @param {function} showLabel the function responsible for showing the label on show event
   * @param {number} entries Higher value relates to faster insertion and slower search, and vice versa
   */
  constructor(hideLabel, showLabel, entries) {

    const usedEntries = entries || 6;
    this.tree = rbush(usedEntries);
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
   * @summary Return the total number of shown labels
   * @returns {number}
   */
  totalShown() {
    return this._total("show");
  }


  /**
   * @name totalHidden
   * @summary Return the total number of hidden labels
   * @returns {number}
   */
  totalHidden() {
    return this._total("hide");
  }

  /**
   * @name getLabelsByState
   * @summary Provided a state get all labels of that state
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
   * @summary Return an array of all the hidden labels
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

    // Remove the label if it's colliding with itself
    if (self !== undefined) collisions.splice(self, 1);
    return collisions;
  }

  /**
   * @name getLabel
   * @summary Convenience function to return a label by ID
   * @param {string} id the ID of the label to get
   * @returns {object}
   */
  getLabel(id) {
    return this.allLabels[id];
  }

  /**
   * @name destroy
   * @summary Destroy the collision tree and labels
   */
  destroy() {
    this._resetTree();
    this.allLabels = {};
  }

  /**
   * @name callLabelCallbacks
   * @summary Perform the related callback for a label depending on where its state is 'show' or 'hide'
   * @param {string} [forceState] the class of which to change the label to
   * @returns {undefined}
   */
  callLabelCallbacks(forceState) {
    this.tree.all().forEach(label => {
      this._callLabelStateCallback(label, forceState);
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
  _callLabelStateCallback(label, forceState) {
    const state = forceState || label.state;
    if (state === "show") this.showLabel(label);
    if (state === "hide") this.hideLabel(label);
  }

  /**
   * @name setupLabelStates
   * @summary Sets up the labels depending on whether all have changed or some have changed
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
          label.id,
          label.weight,
          label.labelObject,
          label.name,
          label.isDragged
        );

      });

    }

  }

  /**
   * @name update
   * @summary Sets all labels to change and reruns the whole show/hide procedure
   * @returns {undefined}
   */
  update() {

    this.allChanged = true;
    this.setupLabelStates();
    this._handlePreviousCollisions();
    this._hideShownCollisions(); // TODO: why is this necessary ? :(
    this.callLabelCallbacks();

  }

  /**
   * @name _handlePreviousCollisions
   * @summary Checks to see if a previously hidden/collided label is now able to be shown and then changes there state
   * @returns {undefined}
   * @private
   */
  _handlePreviousCollisions() {
    this.getHidden().forEach(hidden => {
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
    });
  }

  /**
   * @name _resetTree
   * @summary Clears current tree containing all inputted labels
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
      name : labelName,
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
  _removeFromTree(label, forceUpdate) {
    const id = label.id || label;
    const removelLabel = this.allLabels[id];
    this.tree.remove(removelLabel);
    delete this.allLabels[id];
    if (forceUpdate) this.callLabelCallbacks(true);
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
   * @summary Weighted collisions resolution for labels in the tree
   * @returns {undefined}
   * @private
   */
  _handleCollisions(collisions, label) {
    let originalWeight;
    if (label.isDragged) label.weight = Infinity;
    let highest = label;

    collisions.forEach(collision => {

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
   * @param {object} boundingBox
   * @param {string} id
   * @param {number} weight
   * @param {object} gmLabel
   * @param {string} labelName
   * @param {boolean} isDragged
   * @summary Creates a label if it does not already exist, then adds it to the tree, and renders it based on whether it can be shown
   * @returns {object}
   */
  ingestLabel(boundingBox, id, weight, labelObject, labelName, isDragged) {

    // If there is already a label in the tree, remove it
    const oldLabel = this.allLabels[id];
    if (oldLabel) this._removeFromTree(oldLabel);

    // Add the new label to the tree
    const label = this._makeLabel(boundingBox, id, weight, labelObject, labelName, isDragged);
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
   * @summary let labelgun know the label has changed
   * @returns {undefined}
   */
  labelHasChanged(id) {
    this.hasChanged.add(id);
  }

}

