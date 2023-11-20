function addLineHide(start, end, id) {
  addDeco(start, { type: "line_hide", start: start, end: end, id: id });
}

function addLink(start, end, line, url, id) {
  addDeco(line, { type: "link", start: start, end: end, url: url, id: id });
}

function addWordComment(start, end, line, comment, id) {
  addDeco(line, { type: "comment", start: start, end: end, comment: comment, id: id });
}

function addWordComment2(start, end, line, comment, id) {
  addDeco(line, { type: "comment-embedded", start: start, end: end, comment: comment, id: id });
}

function addWordHighlight(color, start, end, line, id) {
  addDeco(line, { type: "highlight", color: color, start: start, end: end, id: id });
}

function addWordHide(start, end, line, id) {
  addDeco(line, { type: "word_hide", start: start, end: end, id: id });
}

function addDeco(line, info) {
  (decoration[line] || (decoration[line] = [])).push(info);
}

function deleteDeco(line, id) {
  if (decoration[line]) {
    decoration[line] = decoration[line].filter((info) => info["id"] !== id);

    if (decoration[line].length === 0) {
      delete decoration[line];
    }
  }
}
