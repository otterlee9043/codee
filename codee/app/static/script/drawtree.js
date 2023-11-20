async function drawTree() {
  const jstreeSetting = {
    plugins: ["wholerow"],
    core: {
      themes: {
        responsive: false,
      },
    },
    types: {
      default: {
        icon: "fa fa-folder",
      },
      file: {
        icon: "fa fa-file",
      },
      codee: {
        icon: "/static/favicon/favicon-16x16.png",
      },
    },
    plugins: ["types"],
    core: {
      data: tree,
    },
  };

  $("#tree").jstree(jstreeSetting);
  $("#modal_tree_1").jstree(jstreeSetting);
  $("#modal_tree_2").jstree(jstreeSetting);

  $("#modal_tree_1").on("changed.jstree", function (e, data) {
    let selectedNode = data.instance.get_node(data.selected[0]);
    if (selectedNode.original.type === "dir") {
      $("#codee_path").val("");
      $("#codee_path").val(selectedNode.id);
    }
  });

  $("#modal_tree_2").on("changed.jstree", function (e, data) {
    let selectedNode = data.instance.get_node(data.selected[0]);
    if (selectedNode.original.type !== "dir") {
      $("#ref_path").val("");
      $("#ref_path").val(selectedNode.id);
    }
  });

  $("#tree").on("select_node.jstree", function (e, data) {
    let node = data.node;
    if (node.type === "file" || node.type === "codee") {
      window.location.href = `/${owner}/${repo}/${ref}/${node["a_attr"]["path"]}`;
    }
  });
}

function spreadTree() {
  $("#tree").on("ready.jstree", function (e, data) {
    setTimeout(function () {
      const escapedSelector = $.escapeSelector(decodeURIComponent(content));
      const selectedItem = $(`#${escapedSelector}`);
      selectedItem.addClass("selected-item");
    }, 0);

    const parents = $("#tree").jstree(true).get_node(decodeURIComponent(content)).parents;
    for (let i = parents.length - 2; i >= 0; i--) {
      $("#tree").jstree("open_node", parents[i], 0);
    }
  });
}
