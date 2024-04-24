import { ImageMenu } from "@/page/image-menu";
import PluginSample from "..";
import { createRoot } from "react-dom/client";

export function addEventBut(self: PluginSample) {
  self.eventBus.on("open-menu-image", ImageMenuEvent);
}

function ImageMenuEvent({ detail }: any) {
  // console.log(detail);
  const newElement = document.createElement("div");
  document.getElementsByClassName("b3-menu__items")[0].appendChild(newElement)
  createRoot(newElement).render(ImageMenu(detail))
  document.getElementsByClassName("b3-menu")[0].className = "b3-menu fn__none";
}