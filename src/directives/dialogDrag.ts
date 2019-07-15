const dialogDrag = {
  bind(el: HTMLElement) {
    const dialogHeaderEl: HTMLElement | null = el.querySelector('.el-dialog__header');
    const dragDom: HTMLElement | null = el.querySelector('.el-dialog');

    if (dialogHeaderEl && dragDom) {
      dialogHeaderEl.style.cssText += ';cursor:move;';
      dragDom.style.cssText += ';top:0;';

      const sty = (function () {
        // @ts-ignore
        if (window.document.currentStyle) {
          return (dom: any, attr: any) => dom.currentStyle[attr];
        }
        return (dom: HTMLElement, attr: any) => getComputedStyle(dom)[attr];
      }());

      dialogHeaderEl.onmousedown = e => {
        const disX = e.clientX - dialogHeaderEl.offsetLeft;
        const disY = e.clientY - dialogHeaderEl.offsetTop;

        const screenWidth = document.documentElement.clientWidth;
        const screenHeight = document.documentElement.clientHeight;

        const dragDomWidth = dragDom.offsetWidth;
        const dragDomHeight = dragDom.offsetHeight;

        const minDragDomLeft = dragDom.offsetLeft;
        const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;

        const minDragDomTop = dragDom.offsetTop;
        const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight;

        let styL = sty(dragDom, 'left');
        let styT = sty(dragDom, 'top');

        if (styL.includes('%')) {
          styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100) /* eslint-disable-line */
          styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100) /* eslint-disable-line */
        } else {
          styL = +styL.replace(/px/g, ''); // eslint-disable-next
          styT = +styT.replace(/px/g, '') // eslint-disable-line
        }

        document.onmousemove = (e) => {
          let left = e.clientX - disX;
          let top = e.clientY - disY;

          if (-(left) > minDragDomLeft) {
            left = -(minDragDomLeft);
          } else if (left > maxDragDomLeft) {
            left = maxDragDomLeft;
          }

          if (-(top) > minDragDomTop) {
            top = -(minDragDomTop);
          } else if (top > maxDragDomTop) {
            top = maxDragDomTop;
          }
          dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
        };
        document.onmouseup = () => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };
    }
  },
};

export default {
  dialogDrag,
  name: 'dialogDrag',
};
