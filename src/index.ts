import {
    Plugin,
} from "siyuan";
import "@/index.scss";

import { SettingUtils } from "./libs/setting-utils";
import { setSettingMenu } from "./conf/setting-menu";
import { addSlashMenu } from "./conf/command";
import { addEventBut } from "./conf/event-button";

export default class PluginSample extends Plugin {

    settingUtils: SettingUtils;

    async onload() {
        setSettingMenu(this)
        addSlashMenu(this)
        addEventBut(this)
    }

    onLayoutReady() {
    }

    async onunload() {
    }

    uninstall() {
    }
}
