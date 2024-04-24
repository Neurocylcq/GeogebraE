import { SettingUtils } from "@/libs/setting-utils";
import PluginSample from "..";

export function setSettingMenu(self: PluginSample) {
    const STORAGE_NAME = "menu-config";
    self.data[STORAGE_NAME] = { readonlyText: "Readonly" };
    self.settingUtils = new SettingUtils(self, STORAGE_NAME);
    try {
        self.settingUtils.load();
        item(self.settingUtils)
    } catch (error) {
        console.error("Error loading settings storage, probably empty config json:", error);
    }
}

function item(settingUtils: SettingUtils) {
    settingUtils.addItem({
        key: "Input",
        value: "",
        type: "textinput",
        title: "Readonly text",
        description: "Input description",
        action: {
            callback: () => {
                this.settingUtils.takeAndSave("Input")
                // let value = this.settingUtils.takeAndSave("Input")
                // console.log(value);
            }
        }
    });
}