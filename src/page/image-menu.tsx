import { openGeogebraDialog } from "@/libs/method";
import { readLSB } from "@/libs/steganography";

function openGeogebra(detail) {
  let scr = detail.element.getElementsByTagName("img")[0].src;
  openGeogebraDialog(detail.element.parentElement.parentElement.dataset.nodeId, (ggbApplet)=>{
    readLSB(scr, (data) => {
    ggbApplet.setBase64(data)
  })
  });
}

export function ImageMenu(detail) {
  return <button className="b3-menu__item" onClick={() => openGeogebra(detail)}>
  <div className="b3-menu__icon">G</div>
  <span className="b3-menu__label">用GeogebraE打开</span>
</button>
}