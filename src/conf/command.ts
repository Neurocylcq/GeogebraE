// import { Protyle } from "siyuan";
import PluginSample from "..";
import { deleteCharacterBeforeCursor, openGeogebraDialog } from "@/libs/method";
import _ from "lodash";

export function addSlashMenu(self: PluginSample) {
    self.protyleSlash = [{
        filter: ["geogebra", "dkge", "打开"],
        html: `
    <div class="b3-list-item__first">
        <div class="color__square">G</div>
        <span class="b3-list-item__text">${self.i18n.openGeogebra}</span>
    </div>`,
        id: "openGeogebra",
        callback() {
        // callback(protyle: Protyle) {
            deleteCharacterBeforeCursor()
            const sel = window.getSelection().focusNode.parentNode.parentNode as HTMLElement
            // const id = protyle.protyle.breadcrumb.id
            const id = sel.getAttribute('data-node-id')
            // console.log(id, sel.getAttribute('data-node-id'))
            openGeogebraDialog(id, () => { })
        }
    }];
}