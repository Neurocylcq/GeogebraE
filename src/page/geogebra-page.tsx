import styles from './geogebra-page.module.scss'
import { RenderingGE, download, InsetBlock, Save } from "@/libs/method";


const menu = [
  {
    "name": "Geogebra",
    "type": "text",
    "data": []
  },
  {
    "name": "Model",
    "type": "dropdown",
    "data": ['Graphing', 'Geometry', '3D', 'Classic', 'Suite', 'Scientific', 'notes']
  },
  {
    "name": "Function",
    "type": "dropdown",
    "data": ['ToImage', 'InsetBlock', 'Refresh']
  },
  {
    "name": "FullScreen",
    "type": "button",
    "data": []
  }
]

function handleClick(model: string, id: string) {
  const actions = {
    ToImage: () => download(false, () => { }),
    InsetBlock: () => InsetBlock(id),
    Save: () => Save(),
    Refresh: () => {
      window.dispatchEvent(new Event('resize'));
    },
    FullScreen: () => {
      const geogebraBox = document.querySelector(".b3-dialog__container") as HTMLElement
      if (document.fullscreenElement === null) {
        geogebraBox.requestFullscreen()
        return
      }
      document.exitFullscreen().then(() => {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 200)
      })
    },
  };

  if (actions[model]) {
    actions[model]();
  } else {
    const geogebraBox = document.querySelector(".b3-dialog__body") as HTMLElement
    // const geogebraBox = document.getElementById('geogebraBox')
    RenderingGE(model, geogebraBox.clientWidth, geogebraBox.clientHeight, () => { });
  }
}

function GeogebraMenuPage(id: string) {
  return <>
    <div className={styles.menuBar} onDoubleClick={() => handleClick("FullScreen", id)}>
      {menu.map((item, _) => {
        if (item.type === 'text') {
          return <div className={styles.menuBarText}>{item.name}</div>
        } else if (item.type === 'dropdown') {
          return <div className={styles.dropdown}>
            <div className={styles.menuBarItem}>{item.name}</div>
            <div className={styles.dropdownContent}>
              {item.data.map((model, _) => <div className={styles.dropdownItem} onClick={() => handleClick(model, id)}>{model}</div>)}
            </div>
          </div>
        } else if (item.type === 'button') {
          return <div className={styles.menuBarItem} onClick={() => handleClick(item.name, id)}>{item.name}</div>
        }
      })}
    </div>
  </>
}

export default GeogebraMenuPage