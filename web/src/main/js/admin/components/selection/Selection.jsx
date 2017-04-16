import React from 'react'
import ReactDOM from 'react-dom'
import keys from "lodash.keys"

class Selection extends React.Component {

  static propTypes = {
    enabled: React.PropTypes.bool,
    onSelectionChange: React.PropTypes.func
  }

  /**
   * Component default props
   */
  static defaultProps = {
    enabled: true,
    onSelectionChange: () => {}
  }

  /**
   * Component initial state
   */
  state = {
    mouseDown: false,
    startPoint: null,
    endPoint: null,
    selectionBox: null,
    selectedItems: {},
    appendMode: false
  }

  /**
   * On componentn mount
   */
  componentWillMount = () => {
    this.selectedChildren = {};
  }

  /**
   * On component props change
   */
  componentWillReceiveProps = (nextProps) => {
    let nextState = {};
    if(!nextProps.enabled) {
      nextState.selectedItems = {};
    }
    this.setState(nextState);
  }

  /**
   * On component update
   */
  componentDidUpdate = () => {
    if(this.state.mouseDown && this.state.selectionBox != null) {
      this._updateCollidingChildren(this.state.selectionBox);
    }
  }

  /**
   * On root element mouse down
   */
  _onMouseDown = (e) => {
    if(!this.props.enabled || e.button === 2 || e.nativeEvent.which === 2) {
      return;
    }
    let nextState = {};
    if(e.ctrlKey || e.altKey || e.shiftKey) {
      nextState.appendMode = true;
    }
    nextState.mouseDown = true;
    nextState.startPoint = {
      x: e.clientX,
      y: e.clientY
    };
    this.setState(nextState);
    window.document.addEventListener('mousemove', this._onMouseMove);
    window.document.addEventListener('mouseup', this._onMouseUp);
  }

  /**
   * On document element mouse up
   */
  _onMouseUp = (e) => {
    window.document.removeEventListener('mousemove', this._onMouseMove);
    window.document.removeEventListener('mouseup', this._onMouseUp);
    this.setState({
      mouseDown: false,
      startPoint: null,
      endPoint: null,
      selectionBox: null,
      appendMode: false
    });
    this._fireSelectionChange()
  }

  _fireSelectionChange = () => {
    let childrenArray = React.Children.toArray(this.props.children);
    let values = keys(this.selectedChildren).map(key => {
      let child = childrenArray.find(child => {
        return child.props.id == key;
      })
      return child.props.value;
    })

    this.props.onSelectionChange(values);
  }

  /**
   * On document element mouse move
   */
  _onMouseMove = (e) => {
    e.preventDefault();
    if(this.state.mouseDown) {
      let endPoint = {
        x: e.clientX,
        y: e.clientY
      };
      this.setState({
        endPoint: endPoint,
        selectionBox: this._calculateSelectionBox(this.state.startPoint, endPoint)
      });
    }
  }

  /**
   * Render
   */
  render = () => {
    return(
      <div className={'selection ' + (this.state.mouseDown ? 'dragging' : '')}
           ref='selectionBox'
           onMouseDown={this._onMouseDown}>
        {this.renderChildren()}
        {this.renderSelectionBox()}
      </div>
    );
  }

  /**
   * Render children
   */
  renderChildren = () => {
    var index = 0;
    return React.Children.map(this.props.children, (child) => {
      let id = child.props.id ? child.props.id : index++;
      let isSelected = this.selectedChildren[id] != null;

      let handleSelect = (e) => {
        if (this.props.enabled) {
          e.preventDefault();
          e.stopPropagation();
          if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
            this.selectedChildren = {};
          }
          this.selectItem(id, this.selectedChildren[id] == null);
        }
      }

      return (
        <span className={'select-box ' + (isSelected ? 'selected' : '')}
              ref={id}
              onClickCapture={handleSelect} >
          { child }
        </span>
      )
    });
  }

  /**
   * Render selection box
   */
  renderSelectionBox = () => {
    if(!this.state.mouseDown || this.state.endPoint == null || this.state.startPoint == null) {
      return null;
    }
    return(
      <div className='selection-border' style={this.state.selectionBox}/>
    );
  }

  /**
   * Manually update the selection status of an item
   * @param {string} key the item's target key value
   * @param {boolean} select the item's target selection status
   */
  selectItem = (key, select) => {
    if(select) {
      this.selectedChildren[key] = select;
    }
    else {
      delete this.selectedChildren[key];
    }
    this._fireSelectionChange()
    this.forceUpdate();
  }

  /**
   * Select all items
   */
  selectAll = () => {
    this.refs.forEach(key => {
      if(key !== 'selectionBox') {
        this.selectedChildren[key] = true;
      }
    })
  }

  /**
   * Manually clear selected items
   */
  clearSelection = () => {
    this.selectedChildren = {};
    this._fireSelectionChange()
    this.forceUpdate();
  }

  /**
   * Detect 2D box intersection
   */
  _boxIntersects = (boxA, boxB) => {
    if(boxA.left <= boxB.left + boxB.width &&
      boxA.left + boxA.width >= boxB.left &&
      boxA.top <= boxB.top + boxB.height &&
      boxA.top + boxA.height >= boxB.top) {
      return true;
    }
    return false;
  }

  /**
   * Updates the selected items based on the
   * collisions with selectionBox
   */
  _updateCollidingChildren = (selectionBox) => {
    for (let key in this.refs) {
      if(key !== 'selectionBox') {
        let node = ReactDOM.findDOMNode(this.refs[key])
        var nodeBox = node.getBoundingClientRect();
        if(this._boxIntersects(selectionBox, nodeBox)) {
          this.selectedChildren[key] = true;
        }
        else {
          if(!this.state.appendMode) {
            delete this.selectedChildren[key];
          }
        }
      }
    }
  }

  /**
   * Calculate selection box dimensions
   */
  _calculateSelectionBox = (startPoint, endPoint) => {
    if(!this.state.mouseDown || endPoint == null || startPoint == null) {
      return null;
    }
    let parentNode = this.refs.selectionBox
    let left = Math.min(startPoint.x, endPoint.x) - parentNode.offsetLeft;
    let top = Math.min(startPoint.y, endPoint.y) - parentNode.offsetTop;
    let width = Math.abs(startPoint.x - endPoint.x);
    let height = Math.abs(startPoint.y - endPoint.y);
    return {
      left: left,
      top: top,
      width: width,
      height: height
    };
  }
}

export default Selection
