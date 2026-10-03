// Полноэкранный режим и подсказка для iPhone
import { $ } from "./dom.js";
import { t } from "./i18n/index.js";

const fsRoot = document.documentElement;
const isStandalone = matchMedia("(display-mode: fullscreen), (display-mode: standalone)").matches
  || navigator.standalone === true;
const canFs = !isStandalone && !!(fsRoot.requestFullscreen || fsRoot.webkitRequestFullscreen);
const inFs = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
function toggleFs() {
  try {
    if (inFs()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    else (fsRoot.requestFullscreen || fsRoot.webkitRequestFullscreen).call(fsRoot);
  } catch (e) { /* браузер не разрешил */ }
}
export function syncFs() {
  const label = t(inFs() ? "fsExit" : "fsEnter");
  $("fsMenu").textContent = label;
  $("fsGame").textContent = inFs() ? "✕" : "⛶";
}

export function initFullscreen() {
  if (canFs) {
    $("fsMenu").classList.remove("hidden");
    $("fsGame").classList.remove("hidden");
    $("fsMenu").onclick = $("fsGame").onclick = toggleFs;
    document.addEventListener("fullscreenchange", syncFs);
    document.addEventListener("webkitfullscreenchange", syncFs);
  } else if (!isStandalone && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
    // На iPhone полноэкранного API нет — подсказываем установку на главный экран
    $("iosHint").classList.remove("hidden");
  }
}
