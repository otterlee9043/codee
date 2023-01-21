
function createNewRange(line, start, end) {
  console.log(line) ;
  console.log(start) ;
  console.log(end) ;
  const tdTag = document.querySelector(`#L${line} .hljs-ln-code`);
  const startTag = findOffsetTag(tdTag, start);
  console.log(startTag) ;
  const endTag = findOffsetTag(tdTag, end);
  const new_range = document.createRange();
  new_range.setStart(startTag.tag, startTag.startOffset);
  new_range.setEnd(endTag.tag, endTag.startOffset);
  document.getSelection().removeAllRanges();
  document.getSelection().addRange(new_range);
}


function drawLineHide(deco) {
  const { start, end, id } = deco;
  const number = Math.abs(start - end) + 1;
  selectedInfo.push({ start: start, number: number, id: id });
  let line = document.querySelector(`#L${start}`);
  createEllipsisNode(line);
  for (let i = 0; i < number; i++) {
    line.classList.add("hidden");
    line = line.nextElementSibling;
  }
}

function drawLink(deco) {
  const { start, end, line, url, id } = deco;
  createNewRange(line, start, end);
  const span = createNewSpan(document.getSelection());
  document.getSelection().removeAllRanges();
  span.classList.add("rendering");
  const link = document.createElement("a");
  link.id = id;
  link.url = url;
  span.before(link)
  link.appendChild(span);
  registerCommentEvent(url, link, id, "link");
  const link_url = new URL(url);
  if(link_url.hostname == "www.youtube.com" || link_url.hostname == "youtu.be"){
    console.log("youtube");
    const div = wrapTdtag(span);
    const iframe = document.createElement("iframe");
    iframe.classList.add("youtube");
    let videoKey;
    console.log(url);
    if(link_url.pathname == "/watch"){
      videoKey = link_url.searchParams.get("v");
      console.log(videoKey);
      iframe.src =`https://www.youtube.com/embed/${videoKey}`;
    } else {
      videoKey = link_url.pathname;
      console.log(videoKey);
      iframe.src =`https://www.youtube.com/${videoKey}`;
    }
    
    div.appendChild(iframe);
  }

}

function drawComment(deco) {
  const { start, end, line, comment, id } = deco;
  createNewRange(line, start, end);
  const span = createNewSpan(document.getSelection());
  document.getSelection().removeAllRanges();
  span.classList.add("comment-underline");
  console.log(span);

  registerCommentEvent(comment, span, id, "comment");
}

function drawComment2(deco) {
  const { start, end, line, comment, id } = deco;
  createNewRange(line, start, end);
  const span = createNewSpan(document.getSelection());
  document.getSelection().removeAllRanges();
  span.classList.add("comment-embed");
  console.log(span);
  embedComment(comment, span, id);
}


function drawHighlight(deco) {
  const { start, end, line, color, id } = deco;
  createNewRange(line, start, end);
  const span = createNewSpan(document.getSelection());
  document.getSelection().removeAllRanges();
  span.classList.add(color);
  registerCommentEvent("", span, id, "highlight");
}

function drawWordHide(deco) {
  const { start, end, line, id } = deco;
  createNewRange(line, start, end);
  const span = createNewSpan(document.getSelection());
  document.getSelection().removeAllRanges();
  span.classList.add("hidden");

  const ellipsisBtn = document.createElement("span");
  ellipsisBtn.classList.add("ellipsis");
  ellipsisBtn.innerText = "⋯";
  span.parentElement.insertBefore(ellipsisBtn, span);

  ellipsisBtn.addEventListener("click", () => {
    span.classList.remove("hidden");
    let id = deco.id;
    console.log(`id is ${id}`);
    deleteWordHide(id);
    ellipsisBtn.remove();
    mergeNode(span);
  });
}


let cacheChange = 0;
window.addEventListener("load", async function () {
  // addMenuClass() ;
  
  const pre = document.querySelector("pre");
  const classes = pre.classList;
  if (classes.contains("context-menu-one")) {
    // ref_data = await readCodee();
    console.log(JSON.stringify(ref_data));
    hideLine();
    ref_data.map((deco) => {
      const type = deco.type;
      switch (type) {
        case "line_hide":
          drawLineHide(deco);
          break;
        case "link":
          drawLink(deco);
          break;
        case "comment-embedded":
          drawComment2(deco);
          break;
        case "comment":
          drawComment(deco);
          break;
        case "highlight":
          drawHighlight(deco);
          break;
        case "word_hide":
          console.log(deco) ;
          drawWordHide(deco);
          break;
      }
    });
  }
});

const code = document.querySelector("code");
let lineSelected = false;
let start = -1;
let end = -1;
let selectedInfo = [];
const tbody = document.querySelector("tbody");

const FRAGMENT = {
  FALSE: -1,
  HEAD: 0,
  CENTER: 1,
  TAIL: 2,
};

const NODE = {
  SPAN: 0,
  TEXT: 1,
};
// Problem 1
// fragment 속성 값은 가장 상위 노드에 설정? 해당 노드에 설정?

var fragment = null;
function saveSelection() {
  if (window.getSelection) {
    const selection = window.getSelection();
    if (selection.getRangeAt && selection.rangeCount) {
      return selection.getRangeAt(0);
    }
  } else if (document.selection && document.selection.createRange) {
    return document.selection.createRange();
  }
  return null;
}

function saveRangeEvent(event) {
  range = saveSelection();
  if (range && !range.collapsed) {
    fragment = range.cloneContents();
  }
}

window.addEventListener("mouseup", saveRangeEvent);
window.addEventListener("keyup", saveRangeEvent);

function isString(inputText) {
  if (typeof inputText === "string" || inputText instanceof String) return true;
  else return false;
}

function compare(a, b) {
  const num1 = parseInt(a.querySelector(".lineNumber span").innerText);
  const num2 = parseInt(b.querySelector(".lineNumber span").innerText);
  return num1 - num2;
}

function expand(lineId, number) {
  let firstLine = document.querySelector(`.hidden#${lineId}`);
  firstLine.previousSibling.remove();
  for (let i = 0; i < number; i++) {
    firstLine.classList.remove("hidden");
    firstLine = firstLine.nextSibling;
  }
}

function createEllipsisNode(line) {
  let ellipsisLine = line.cloneNode(true);
  console.log(ellipsisLine);
  ellipsisLine.firstChild.classList.remove("selecting");
  const lnNumber = ellipsisLine.querySelector(".hljs-ln-numbers div");
  lnNumber.setAttribute("data-line-number", ""); // <span1>
  const ellipsisBtn = document.createElement("span");
  ellipsisBtn.classList.add("ellipsis");
  ellipsisBtn.innerText = "⋯";
  lnNumber.appendChild(ellipsisBtn);
  ellipsisLine.querySelector(".hljs-ln-code").innerText = ""; // <span2>
  ellipsisLine.addEventListener("click", () => {
    const info = selectedInfo.find((item) => `L${item.start}` === ellipsisLine.id);
    const lineId = `L${info.start}`;
    const number = info.number;
    const ID = info.id;
    deleteLineHide(ID);
    expand(lineId, number);
    const lineNumber = parseInt(lineId.replace(/[^0-9]/g, ""));
    selectedInfo = selectedInfo.filter((item) => {
      return lineNumber !== item.start;
    });
  });
  line.before(ellipsisLine);
  return ellipsisLine;
}

function hideLine() {
  const numbers = document.querySelectorAll(".hljs-ln-numbers");
  //console.log(numbers);
  Array.from(numbers).map((item, index) => {
    const number = parseInt(item.getAttribute("data-line-number"));
    item.parentElement.id = `L${number}`;
    item.addEventListener("click", (event) => {
      console.log(number);
      if (!lineSelected) {
        start = number;
        item.classList.add("selecting");
      } else {
        end = number;
        let numberLinesSelected = Math.abs(start - end) + 1;
        start = Math.min(start, end);
        selectedInfo = selectedInfo.filter((item) => {
          // contained = 숨길 lines 중에 이미 숨김된 line이 있는지
          const contained = start < item.start && start + numberLinesSelected - 1 > item.start;
          if (contained) {
            expand(`L${String(item.start)}`, item.number);
          }
          return !contained;
        });
        const ID = randomId();
        selectedInfo.push({ start: start, number: numberLinesSelected, id: ID });
        console.log(selectedInfo);
        let line = document.querySelector(`#L${start}`);
        console.log(line);
        createEllipsisNode(line);

        for (let i = 0; i < numberLinesSelected; i++) {
          line.classList.add("hidden");
          line = line.nextElementSibling;
        }
        Array.from(numbers).map((number) => {
          number.classList.remove("selecting");
        });
        console.log(JSON.stringify(ref_data));
        if (ref_data != null) {
          // ref_data[0]['data'].push({"type" : "line_hide", "start" : start, "end" : end, "id" : ID}) ;
          console.log(start);
          addLineHide(start, end, ID);
          console.log(JSON.stringify(ref_data));
        }
      }
      lineSelected = !lineSelected;
    });
  });
}

function splitText(textNode, index, textLength, start, same = false) {
  const fullText = textNode.nodeValue;
  text = start ? fullText.substring(index, index + textLength) : fullText.substring(0, index);
  const span = document.createElement("span");
  span.innerText = textNode.nodeValue;
  textNode.replaceWith(span);
  return splitSpan(span, index, textLength, start, same);
}

function splitSpan(span, index, textLength, start, same = false) {
  const fullText = span.innerText;
  const span2 = span.cloneNode(false);
  let span3;
  const text = start ? fullText.substring(index, index + textLength) : fullText.substring(0, index);
  if (same) {
    if (fullText === text) {
      return [FRAGMENT.FALSE, span];
    }
    span.after(span2);
    if (index === 0) {
      span.innerText = text;
      span2.innerText = fullText.substring(text.length, fullText.length);
      return [FRAGMENT.HEAD, span];
    } else if (index === fullText.length - text.length) {
      span.innerText = fullText.substring(0, index);
      span2.innerText = text;
      return [FRAGMENT.TAIL, span2];
    } else {
      span3 = span.cloneNode(false);
      span.innerText = fullText.substring(0, index);
      span2.innerText = text;
      span3.innerText = fullText.substring(index + text.length, fullText.length);
      span2.after(span3);
      return [FRAGMENT.CENTER, span2];
    }
  } else {
    if (fullText === text) {
      return [FRAGMENT.FALSE, span];
    }
    span.after(span2);
    if (start) {
      span.innerText = fullText.substring(0, index);
      span2.innerText = text;
    } else {
      span.innerText = text;
      span2.innerText = fullText.substring(text.length, fullText.length);
    }
  }

  return start ? [FRAGMENT.TAIL, span2] : [FRAGMENT.HEAD, span];
}

function bindTags(startNode, endNode) {
  const newSpan = document.createElement("span");
  let node = startNode;
  let prev_node;
  startNode.before(newSpan);
  if (endNode) {
    while (endNode.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_PRECEDING) {
      prev_node = node;
      node = node.nextSibling;
      newSpan.appendChild(prev_node);
    }
    // endNode의 상위노드가 존재한다면 while문에서 이동해버림
    if (endNode.parentElement.tagName !== "SPAN") newSpan.appendChild(endNode);
  } else {
    newSpan.appendChild(startNode);
  }

  return newSpan;
}

function ellipsisSpan(newSpan) {
  const ellipsisButton = document.createElement("span");
  ellipsisButton.innerText = "⋯";
  ellipsisButton.classList.add("ellipsis");
  ellipsisButton.addEventListener("click", () => {
    newSpan.classList.remove("hidden");
    let id = newSpan.getAttribute("id");
    console.log(`id is ${id}`);
    deleteWordHide(id);
    ellipsisButton.remove();
    mergeNode(newSpan);

  });
  newSpan.before(ellipsisButton);
  newSpan.classList.add("hidden");
}

function nodeType(element) {
  if (element.parentElement.tagName == "TD") {
    return NODE.TEXT;
  } else if (element.parentElement.tagName == "SPAN") {
    if (element.parentElement.childNodes.length >= 2) {
      // span 안에 있는 text 노드 (innerText가 아닌)
      return NODE.TEXT;
    } else {
      return NODE.SPAN;
    }
  }
}

function createNewSpan(selectionText) {
  if (selectionText.toString() === "") {
    return;
  }

  let {
    anchorNode: selectedFirst,
    focusNode: selectedLast,
    anchorOffset: firstOffset,
    focusOffset: lastOffset,
  } = selectionText;
  
  let { tagName: anchorTagType } = selectedFirst.parentElement;
  let { tagName: focusTagType } = selectedLast.parentElement;
  let startNode, endNode;

  
  const cutSpan = document.createElement("span");
  let fragmented;
  cutSpan.textContent = "✂️";

  if (selectedFirst.compareDocumentPosition(selectedLast) & Node.DOCUMENT_POSITION_PRECEDING) {
    // 드래그가 뒤에서 앞으로 되는 경우
    [selectedFirst, selectedLast] = [selectedLast, selectedFirst];
    [firstOffset, lastOffset] = [lastOffset, firstOffset];
    [anchorTagType, focusTagType] = [focusTagType, anchorTagType];
  } else if (selectedFirst === selectedLast) {
    // 아예 같은 노드
    if (lastOffset < firstOffset) [firstOffset, lastOffset] = [lastOffset, firstOffset];

    const textLength = selectedFirst.nodeValue.substring(firstOffset, lastOffset).length;
    let start, end;
    if (nodeType(selectedFirst) == NODE.TEXT) {
      [fragmented, startNode] = splitText(selectedFirst, firstOffset, textLength, true, true);
    } else {
      [fragmented, startNode] = splitSpan(selectedFirst.parentElement, firstOffset, textLength, true, true);
    }
    startNode.parentElement.insertBefore(cutSpan, startNode);
    start = splitTree(cutSpan, Position.START, fragmented === FRAGMENT.FALSE ? false : true);
    startNode.parentElement.insertBefore(cutSpan, startNode.nextSibling);
    end = splitTree(cutSpan, Position.END, fragmented === FRAGMENT.FALSE ? false : true);
    const newSpan = bindTags(end, null);
    return newSpan;
  }

  /**
   * start node 쪼개기
   */
  const textLength = selectedFirst.nodeValue.substring(firstOffset, selectedFirst.nodeValue.length).length;
  if (nodeType(selectedFirst) == NODE.TEXT) {
    [fragmented, startNode] = splitText(selectedFirst, firstOffset, textLength, true);
  } else if (nodeType(selectedFirst) == NODE.SPAN) {
    [fragmented, startNode] = splitSpan(selectedFirst.parentElement, firstOffset, textLength, true);
  }
  startNode.parentElement.insertBefore(cutSpan, startNode);
  const start = splitTree(cutSpan, Position.START, fragmented === FRAGMENT.FALSE ? false : true);

  /**
   * end node 쪼개기
   */
  const textLength2 = selectedLast.nodeValue.substring(lastOffset, selectedLast.nodeValue.length).length;
  if (nodeType(selectedLast) == NODE.TEXT) {
    [fragmented, endNode] = splitText(selectedLast, lastOffset, textLength2, false);
  } else if (nodeType(selectedLast) == NODE.SPAN) {
    [fragmented, endNode] = splitSpan(selectedLast.parentElement, lastOffset, textLength2, false);
  }
  endNode.parentElement.insertBefore(cutSpan, endNode.nextSibling);
  const end = splitTree(cutSpan, Position.END, fragmented === FRAGMENT.FALSE ? false : true);

  const newSpan = bindTags(start, end);
  return newSpan;
}

function hideText() {
  var selectionText;
  if (document.getSelection) {
    selectionText = document.getSelection();
    console.log(selectionText);
    if (!isString(selectionText.anchorNode.nodeValue) || !isString(selectionText.focusNode.nodeValue)) {
      console.log("NOT STRING!!");
      return;
    }
    const collection = createNewSpan(selectionText);
    // collection.id = randomId();
    //if (selectionText.anchorNode === selectionText.focusNode) ellipsisSpan(collection);

    ellipsisSpan(collection);
  } else if (document.selection) {
    console.log("2");
    selectionText = document.selection.createRange().text;
  }
  selectionText.removeAllRanges();
}

const Position = {
  START: 0,
  END: 1,
};

function splitTree(cutElement, position, split) {
  console.log(cutElement);
  const bound = cutElement.parentElement.closest("td");
  let parent, right, grandparent;
  let node = position === Position.START ? cutElement.nextSibling : cutElement.previousSibling;
  if (parseInt(node.getAttribute("fragmented")) === FRAGMENT.TAIL) {
    // TAIL이었으면 CENTER
    node.setAttribute("fragmented", FRAGMENT.CENTER);
  } else {
    if (split) node.setAttribute("fragmented", position === Position.START ? FRAGMENT.TAIL : FRAGMENT.HEAD);
    else node.setAttribute("fragmented", FRAGMENT.FALSE);
  }

  for (parent = cutElement.parentNode; parent != bound; parent = grandparent) {
    right = parent.cloneNode(false); // parent node를 right로 복사
    while (cutElement.nextSibling) right.appendChild(cutElement.nextSibling); // cut 뒤에 오는 element들을 right에 append
    grandparent = parent.parentNode;
    grandparent.insertBefore(right, parent.nextSibling); // parent 뒤에 right를 삽입
    grandparent.insertBefore(cutElement, right); // right 앞에 cutElement 삽입
    node = position === Position.START ? right : parent;
    if (parseInt(node.getAttribute("fragmented")) === FRAGMENT.TAIL)
      node.setAttribute("fragmented", FRAGMENT.CENTER);
    else node.setAttribute("fragmented", position === Position.START ? FRAGMENT.TAIL : FRAGMENT.HEAD);
  }
  if (parent === bound) {
    right = cutElement.nextSibling;
    parent = cutElement.previousSibling;
  }
  cutElement.remove();
  if (position === Position.START) {
    if (nodeType(parent) === NODE.SPAN && parent.hasAttribute("fragmented"))
      parent.removeAttribute("fragmented");
    return right;
  } else {
    if (nodeType(right) === NODE.SPAN && right.hasAttribute("fragmented"))
      right.removeAttribute("fragmented");
    return parent;
  }
}

function merge(wrapper) {
  if (wrapper.nodeType === Node.TEXT_NODE) return;
  if (!wrapper.hasAttribute("fragmented")) return;

  // console.log(listToMerge);
  const type = parseInt(wrapper.getAttribute("fragmented"));

  if (wrapper.childNodes.length == 1 && !wrapper.firstChild.firstChild) {
    let node, prevNode, nextNode;
    switch (type) {
      case FRAGMENT.FALSE:
        if (wrapper.nodeType === Node.ELEMENT_NODE) {
          wrapper.removeAttribute("fragmented");
        } else {
          const textNode = document.createTextNode(wrapper.innerText);
          wrapper.parent.insertBefore(textNode, wrapper);
          wrapper.remove();
        }
        break;
      case FRAGMENT.HEAD: //endNode, nextSibling과 이어야
        node = wrapper;
        nextNode = wrapper.nextSibling;
        if (node.className === "") {
          node.innerText = node.innerText + nextNode.innerText;
          const text = document.createTextNode(node.innerText);
          node.replaceWith(text);
        } else {
          node.innerText = node.innerText + nextNode.innerText;
          node.removeAttribute("fragmented");
        }
        nextNode.remove();

        break;
      case FRAGMENT.CENTER:
        node = wrapper;
        prevNode = node.previousSibling;
        nextNode = node.nextSibling;

        if (node.className === "") {
          node.innerText = prevNode.innerText + node.innerText + nextNode.innerText;
          const text = document.createTextNode(node.innerText);
          node.replaceWith(text);
        } else {
          node.innerText = prevNode.innerText + node.innerText + nextNode.innerText;
        }
        // nextSibling에 firstChild 뒤에 다른 node들이 있는 경우는 처리가 안됨.

        nextNode.remove();
        prevNode.remove();
        node.removeAttribute("fragmented");
        break;
      case FRAGMENT.TAIL: //startNode, previousSibling과 이어야 함
        node = wrapper;
        prevNode = wrapper.previousSibling;
        if (node.className === "") {
          // split하느라 span에 감싸진 text node
          node.innerText = prevNode.innerText + node.innerText;
          const text = document.createTextNode(node.innerText);
          node.replaceWith(text);
        } else {
          node.innerText = prevNode.innerText + node.innerText;
        }
        node.removeAttribute("fragmented");
        prevNode.remove();
        break;
    }
  } else {
    let node, prevNode, nextNode;
    let nodes = [];
    switch (type) {
      case FRAGMENT.FALSE:
        if (wrapper.nodeType === Node.ELEMENT_NODE) {
          wrapper.removeAttribute("fragmented");
        } else {
          const textNode = document.createTextNode(wrapper.innerText);
          wrapper.parent.insertBefore(textNode, wrapper);
          wrapper.remove();
        }
        break;
      case FRAGMENT.HEAD: //endNode, nextSibling과 이어야
        node = wrapper;
        nextNode = wrapper.nextSibling;
        /// ********** merge Call
        while (nextNode.firstChild) {
          // nodes.push(nextNode.firstChild);
          node.appendChild(nextNode.firstChild);
        }
        Array.from(node.children).map((node) => {
          merge(node);
        });
        nextNode.remove();
        node.removeAttribute("fragmented");
        break;
      case FRAGMENT.CENTER:
        node = wrapper;
        prevNode = node.previousSibling;
        nextNode = node.nextSibling;

        while (node.firstChild) {
          nodes.push(node.firstChild);
          prevNode.appendChild(node.firstChild);
        }

        while (nextNode.firstChild) {
          prevNode.appendChild(nextNode.firstChild);
        }
        nextNode.remove();
        node.remove();
        // node.removeAttribute("fragmented");
        Array.from(nodes).map((node) => {
          merge(node);
        });
        break;
      case FRAGMENT.TAIL: //startNode, previousSibling과 이어야 함
        node = wrapper;
        prevNode = wrapper.previousSibling;
        while (node.firstChild) {
          nodes.push(node.firstChild);
          prevNode.appendChild(node.firstChild);
        }

        Array.from(nodes).map((node) => {
          merge(node);
        });

        // node.removeAttribute("fragmented");
        // prevNode.remove();
        node.remove();
        break;
    }
  }
}

function mergeNode(node, commentSpan = null){
  const children = [];
  while (node.firstChild) {
    const child = node.firstChild;
    children.push(child);
    node.parentNode.insertBefore(child, node);
  }
  console.log();
  node.remove();
  if(commentSpan) commentSpan.remove();
  Array.from(children).map((node) => {
    merge(node);
  });
}

function registerCommentEvent(comment, node, id, type) {
  const commentSpan = document.createElement("span");
  commentSpan.innerText = comment;
  commentSpan.classList.add("comment");
  commentSpan.id = id;

  const closeBtn = document.createElement("span");
  closeBtn.innerText = "X";
  closeBtn.classList.add("right");

  commentSpan.appendChild(closeBtn);

  closeBtn.addEventListener("click", () => {
    console.log(commentSpan.id);
    if (type == "comment") {
      deleteComment(commentSpan.id);
    } else if (type == "link") {
      deleteLink(id);
    } else if (type == "highlight") {
      deleteHighlight(id);
    }
    addContextMenu();

    mergeNode(node, commentSpan);
  });

  console.log(type);
  if (type == "link") {
    commentSpan.classList.add("linkComment");
    commentSpan.addEventListener("mouseenter", () => {
      node.onclick = null;
    });
    commentSpan.addEventListener("mouseleave", () => {
      node.onclick = "openLink(this)";
    });
  }
  node.addEventListener("mouseenter", () => {
    removeContextMenu();
    showCommentDetail(node, commentSpan);
  });
}

function showDecoDetail(span) {
  const type = span.classList[0];
  console.log(type);
  switch (type) {
    case "comment-underline":
  }
}

function showCommentDetail(span, commentSpan) {
  if (span.parentElement.tagName === "TD") {
    span.appendChild(commentSpan);
    span.addEventListener("mouseleave", () => {
      addContextMenu();
      hideCommentDetail(commentSpan);
    });
  }
}

function hideCommentDetail(span) {
  span.remove();
}

const diff = [
  {
    filepath: "/app/main/views.py",
    changes: [
      { start: 268, offset: 4, type: "add", col: 58, content: "b" },
      { start: 268, offset: 5, type: "add", col: 23, content: ".encode('utf8')" },
    ],
  },
  {
    filepath: "/app/static/script/component/menubar.js",
    changes: [{ start: 1, offset: 1, type: "delete", col: 9, content: " " }],
  },
];
