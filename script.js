function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  ev.preventDefault();
  const type = ev.dataTransfer.getData("text");
  const el = document.createElement("div");
  el.className = "item";
  el.innerHTML = type;
  el.style.position = "absolute";
  el.style.left = (ev.offsetX - 15) + "px";
  el.style.top = (ev.offsetY - 15) + "px";
  el.style.cursor = "move";
  makeDraggable(el);
  document.getElementById("canvas").appendChild(el);
}

document.getElementById("toolbar").addEventListener("dragstart", e => {
  if (e.target.classList.contains("item")) {
    e.dataTransfer.setData("text", e.target.textContent);
  }
});

function makeDraggable(el) {
  let isDragging = false;
  let offsetX, offsetY;

  el.onmousedown = function(e) {
    isDragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;

    document.onmousemove = function(ev) {
      if (isDragging) {
        el.style.left = (ev.pageX - canvas.offsetLeft - offsetX) + "px";
        el.style.top = (ev.pageY - canvas.offsetTop - offsetY) + "px";
      }
    };

    document.onmouseup = function() {
      isDragging = false;
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
}

function changeSize() {
  const size = document.getElementById("room-size").value;
  const canvas = document.getElementById("canvas");
  canvas.className = "canvas " + size;
}

function addCustomItem() {
  const emoji = document.getElementById("custom-emoji").value;
  if (!emoji.trim()) return;
  const item = document.createElement("div");
  item.className = "item";
  item.setAttribute("draggable", "true");
  item.dataset.type = "custom";
  item.textContent = emoji;
  item.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text", emoji);
  });
  document.getElementById("toolbar").appendChild(item);
  document.getElementById("custom-emoji").value = "";
}

function addLabel(event) {
  const name = prompt("Nama ruangan:");
  if (!name) return;
  const label = document.createElement("div");
  label.className = "label";
  label.innerText = name;
  label.style.left = event.offsetX + "px";
  label.style.top = event.offsetY + "px";
  makeDraggable(label);
  event.target.appendChild(label);
}

function downloadImage() {
  const canvasEl = document.getElementById("canvas");
  html2canvas(canvasEl).then(canvas => {
    const link = document.createElement("a");
    link.download = "desain-rumah.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

function saveDesign() {
  const canvas = document.getElementById("canvas");
  localStorage.setItem("desainRumah", canvas.innerHTML);
  alert("Desain berhasil disimpan!");
}

function loadDesign() {
  const saved = localStorage.getItem("desainRumah");
  if (saved) {
    document.getElementById("canvas").innerHTML = saved;
    document.querySelectorAll("#canvas .item, .label").forEach(makeDraggable);
    document.getElementById("canvas").appendChild(document.querySelector(".grid"));
    alert("Desain berhasil dimuat!");
  } else {
    alert("Tidak ada desain yang disimpan.");
  }
}
