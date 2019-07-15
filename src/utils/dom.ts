import { stamp } from './common';

const docStyle = window.document ? window.document.documentElement.style : null;

const anchorTranslate = {
  center: 'translate(-50%,-50%)',
  top: 'translate(-50%,0)',
  'top-left': 'translate(0,0)',
  'top-right': 'translate(-100%,0)',
  bottom: 'translate(-50%,-100%)',
  'bottom-left': 'translate(0,-100%)',
  'bottom-right': 'translate(-100%,-100%)',
  left: 'translate(0,-50%)',
  right: 'translate(-100%,-50%)',
};

export interface OwnHTML extends HTMLElement {
  attachEvent?: (s: string, handler: any) => void;
  [key: string]: any;
}

/**
 * style相关的回退操作
 * @param props
 * @returns {*}
 */
function testProp(props: any) {
  if (!docStyle) return null;
  for (let i = 0; i < props.length; i++) {
    if (props[i] in docStyle) {
      return props[i];
    }
  }
  return props[0];
}

/**
 * dom 创建
 * @param tagName
 * @param className
 * @param container
 * @returns {HTMLElement}
 */
const create = function (tagName: string, className?: string, container?: HTMLElement) {
  const el = window.document.createElement(tagName);
  if (className) el.className = className;
  if (container) container.appendChild(el);
  return el;
};

/**
 * 移除当前节点
 * @param node
 */
const remove = function (node: HTMLElement) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
};

export const transformProp = testProp([
  'transform', 'WebkitTransform',
  'OTransform', 'MozTransform',
  'msTransform',
]);

export const transformOriginProp = testProp([
  'transformOrigin', 'WebkitTransformOrigin',
  'OTransformOrigin', 'MozTransformOrigin',
  'msTransformOrigin',
]);

export const transitionProps = testProp([
  'transition', 'WebkitTransition',
  'OTransition', 'MozTransition',
  'msTransition',
]);

/**
 * 设置2d平移转换
 * @param el
 * @param value
 */
const setTransform = function (el: HTMLElement, value: string) {
  el.style[transformProp] = value;
};

/**
 * set transform origin
 * @param el
 * @param value
 */
const setTransformOrigin = function (el: HTMLElement, value: string) {
  el.style[transformOriginProp] = value;
};

/**
 * set transition
 * @param el
 * @param value
 */
const setTransition = function (el: HTMLElement, value: string) {
  el.style[transitionProps] = value;
};

/**
 * 获取事件唯一标识
 * @param type
 * @param fn
 * @param context
 * @returns {string}
 */
const getDomEventKey = (type: string, fn: (event: Event) => void, context: any) => `_dom_event_${type}_${stamp(fn)}${context ? `_${stamp(context)}` : ''}`;

/**
 * 对DOM对象添加事件监听
 * @param element
 * @param type
 * @param fn
 * @param context
 * @param isOnce?
 * @returns {*}
 */
const addListener = function (element: OwnHTML, type: string, fn: (event: Event) => void, context: any, isOnce?: boolean) {
  const eventKey = getDomEventKey(type, fn, context);
  let handler = element[eventKey];
  if (handler) {
    if (!isOnce) {
      handler.callOnce = false;
    }
    // @ts-ignore
    return this;
  }
  handler = function (e: any) {
    // @ts-ignore
    return fn.call(context || element, e);
  };
  if ('addEventListener' in element) {
    element.addEventListener(type, handler, false);
  } else if ('attachEvent' in element && element.attachEvent) {
    element.attachEvent(`on${type}`, handler);
  }
  element[eventKey] = handler;
  // @ts-ignore
  return this;
};

const on = addListener;

/**
 * 移除DOM对象监听事件
 * @param element
 * @param type
 * @param fn
 * @param context
 * @returns {removeListener}
 */
const removeListener = function (element: OwnHTML, type: string, fn: (event: Event) => void, context: any) {
  const eventKey = getDomEventKey(type, fn, context);
  const handler = element[eventKey];
  if (!handler) {
    // @ts-ignore
    return this;
  }
  if ('removeEventListener' in element) {
    element.removeEventListener(type, handler, false);
  } else if ('detachEvent' in element && element.dispatchEvent) {
    element.detachEvent(`on${type}`, handler);
  }
  element[eventKey] = null;
  // @ts-ignore
  return this;
};

const off = removeListener;

/**
 * attach events once
 * @param element
 * @param type
 * @param fn
 * @param context
 * @returns {*}
 */
const once = function (element: OwnHTML, type: string, fn: (event: Event) => void, context: any) {
  return addListener(element, type, fn, context, true);
};

/**
 * Prevent default behavior of the browser.
 * @param event
 * @returns {preventDefault}
 */
const preventDefault = function (event: Event) {
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
  // @ts-ignore
  return this;
};

/**
 * Stop browser event propagation
 * @param event
 * @returns {stopPropagation}
 */
const stopPropagation = function (event: Event) {
  if (event.stopPropagation) {
    event.stopPropagation();
  } else {
    event.cancelBubble = true;
  }
  // @ts-ignore
  return this;
};

export {
  on,
  off,
  once,
  create,
  remove,
  setTransform,
  anchorTranslate,
  addListener,
  removeListener,
  preventDefault,
  stopPropagation,
  setTransformOrigin,
  setTransition,
};
