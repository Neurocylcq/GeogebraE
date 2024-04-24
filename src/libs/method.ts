import { Dialog } from "siyuan";
import { createRoot } from 'react-dom/client';
import GeogebraMenuPage from "@/page/geogebra-page";
import { getWorkspaces, insertBlock } from "@/api";
import { writeLSB } from "./steganography";

let object = { isOffline: "true", model: "GeogebraE", base64: "" };

function loadJSFile(jsUrl: string, callback?: () => void) {
  const script = document.createElement('script');
  script.src = jsUrl;
  if (callback) script.onload = callback;
  document.head.appendChild(script);
}

function openGeogebraDialog(id: string, callback) {
  let dialog = new Dialog({
    title: " ",
    content: `<div id="ggb-element"></div>`,
    width: this.isMobile ? "92vw" : "720px",
    height: this.isMobile ? "92vh" : "500px",
  });

  const menuHeader = dialog.element.querySelector(".b3-dialog__header") as HTMLElement
  menuHeader.style.padding = "0px";
  createRoot(menuHeader).render(GeogebraMenuPage(id))

  const geogebraBox = dialog.element.querySelector(".b3-dialog__body") as HTMLElement
  geogebraBox.style.overflow = "hidden";
  loadJSFile('/plugins/GeogebraE/geogebra/deployggb.js', () => {
    RenderingGE(object.model, 760, 500, (CheckedGgbApplet) => {
      var observer = new ResizeObserver(function () {
        if (CheckedGgbApplet !== null) {
          // console.log(geogebraBox.clientWidth, geogebraBox.clientHeight)
          CheckedGgbApplet.setSize(geogebraBox.clientWidth, geogebraBox.clientHeight);
        }
      });
      observer.observe(geogebraBox);
      callback(CheckedGgbApplet);
    });
  })
}

function RenderingGE(model, width, height, callback) {
  object.model = model;
  var params = {
    appName: model,
    width: width,
    height: height,
    showToolBar: true,
    showAlgebraInput: true,
    showMenuBar: true,
  };
  var applet = new GGBApplet(params, true);
  if (object.isOffline == "true") {
    applet.setHTML5Codebase("/plugins/GeogebraE/geogebra/web3d/");
  }
  setTimeout(() => { applet.inject("ggb-element"); }, 10);

  // --ggb-primary-color: #ee0290; /* used for most UI elements, including the toolbar header and buttons */
  // --ggb-primary-variant-color: #880061; /* used for floating buttons on hover */
  // --ggb-dark-color: #880061; /* used for highlighted text in dialogs */
  // --ggb-light-color: #f186c0; /* used for progress bar */

  let ggbAppletReadyInterval = setInterval(function () {
    //@ts-ignore
    if (typeof ggbApplet !== 'undefined' && typeof ggbApplet.setBase64 === 'function') {
      // console.log("Geogebra Loaded", typeof ggbApplet.setBase64)
      clearInterval(ggbAppletReadyInterval);
      //@ts-ignore
      callback(ggbApplet);
    }
  }, 500);
}

function deleteCharacterBeforeCursor() {
  var sel = window.getSelection();

  if (sel.rangeCount > 0) {
    var range = sel.getRangeAt(0);
    var container = range.startContainer;
    var offset = range.startOffset;

    if (offset >= 0) {
      range.setStart(container, offset);
      range.deleteContents();
    }
  }
}

function download(getImage = false, callback) {
  const imgUrl = `data:image/png;base64,${ggbApplet.getPNGBase64(1, false)}`;
  writeLSB(imgUrl, ggbApplet.getBase64(), (err, outputBase64) => {
    if (err) {
      console.log(err)
      return
    }
    if (getImage) {
      callback(outputBase64);
    } else {
      const image = document.createElement('a');
      image.href = outputBase64;
      image.setAttribute('download', 'Geogebra');
      image.click();
    }
  })
}
function saveFile(base64Data: string, callback) {
  const fs = window.require('fs');
  // 提取 MIME 类型和数据部分
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  const base64Content = matches[2];

  // 将 Base64 数据解码为二进制数据
  const fileData = Buffer.from(base64Content, 'base64');

  // 将二进制数据写入文件
  getCurrentWorkSpace(r => {
    let path = r + '/data/plugins/GeogebraE/geogebra.png'
    fs.writeFile(path, fileData, 'binary', function (err) {
      if (err) {
        console.error('保存文件发生错误:', err);
      } else {
        console.log('文件已保存');
        callback(path)
      }
    });
  })
}
function getCurrentWorkSpace(callback) {
  getWorkspaces().then(r => {
    r.forEach(element => {
      if (element.path.includes(document.getElementsByClassName("toolbar__text")[0].textContent)) {
        callback(element.path)
      }
    })
  })
}
function InsetBlock(id: string) {
  download(true, (imgUrl) => {
    saveFile(imgUrl, (path) => {
      solveGet(request('/api/lute/html2BlockDOM', {
        dom: `<img src="${path}"/>`
      })).then(r => {
        insertBlock('markdown', `![](${r.match(RegExp(`assets/.*?(?=")`))[0]})`, id)
        // setTimeout(() => {
        // insertBlock('markdown', `![](${r.match(RegExp(`assets/.*?(?=")`))[0]})`, id)
        // }, 1000);
      })
    })
  })
}
function Save() {
  // const xmlString = ggbApplet.getXML();
  // self.saveData()
}
function LoadFromBase64(data: string) {
  ggbApplet.setBase64(data)
}
function ImageUrl2Base64(imageUrl: string, callback: (base64: string) => void) {
  var img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = function () {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);
    var base64 = canvas.toDataURL();
    callback(base64);
  };
  img.src = imageUrl;
}

function getCursorPosition() {
  var cursorPos = {
    container: null,
    position: 0
  };

  if (window.getSelection) {
    var sel = window.getSelection();
    if (sel.rangeCount > 0) {
      var range = sel.getRangeAt(0);
      cursorPos.container = range.startContainer;
      cursorPos.position = range.startOffset;
    }
  }

  return cursorPos;
}

async function solveGet(response) {
  let r = await response
  return r && r.code === 0 ? r.data : null
}
async function request(url, data) {
  return fetch(url, {
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      Authorization: `Token ' '`,
    }
  }).then(r => {
    if (r.status === 200)
      return r.json();
    else return null;
  });
}

export {
  RenderingGE, openGeogebraDialog, deleteCharacterBeforeCursor,
  download, InsetBlock, Save, LoadFromBase64, getCursorPosition, ImageUrl2Base64
};