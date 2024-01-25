import "./index.css";
// 创建加载动画和遮罩的容器
const loadingOverlay = document?.createElement("div");
loadingOverlay.id = "loading-overlay";
loadingOverlay.style.position = "fixed";
loadingOverlay.style.top = "0";
loadingOverlay.style.left = "0";
loadingOverlay.style.width = "100%";
loadingOverlay.style.height = "100%";
loadingOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
loadingOverlay.style.display = "flex";
loadingOverlay.style.alignItems = "center";
loadingOverlay.style.justifyContent = "center";
loadingOverlay.style.zIndex = "9999";

// 创建加载动画元素
const loadingSpinner = document?.createElement("div");
loadingSpinner.className = "loading-spinner";
loadingSpinner.style.width = "40px";
loadingSpinner.style.height = "40px";
loadingSpinner.style.border = "4px solid #f3f3f3";
loadingSpinner.style.borderTop = "4px solid #3498db";
loadingSpinner.style.borderRadius = "50%";
loadingSpinner.style.animation = "spin 1s linear infinite";

const rootContainer = document?.body;
/* @__PURE__ */
export function showGlobalLoading() {
  // 将加载动画元素添加到加载动画和遮罩的容器中
  loadingOverlay.appendChild(loadingSpinner);
  // 将加载动画和遮罩的容器添加到根DOM元素的容器下
  rootContainer?.appendChild(loadingOverlay);
}
/* @__PURE__ */
export function closeGlobalLoading() {
  loadingOverlay.remove();
}
