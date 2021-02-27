// ripple effect on buttons
function rippleEffect(e) {
  const boundingBox = e.target.getBoundingClientRect();
  const x = e.clientX - boundingBox.x;
  const y = e.clientY - boundingBox.y;
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  e.target.append(ripple);
  setTimeout(() => {
    ripple.remove();
  }, 500);
}
