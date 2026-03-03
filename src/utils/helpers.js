let timeout;
export function debounce(func, wait, immediate) {
  return function () {
    let context = this,
      args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export const toAbsoluteUrl = (pathname) => process.env.PUBLIC_URL + pathname;

export const formatedText = (text) => {
  return text.replace(" ", "-").toLowerCase();
};

export const addPercentTime = (percent, min) => {
  return parseInt(min * 60 * `1.${percent > 9 ? "" : "0"}${percent}`);
};
export const addPercentage = (percent, val) => {
  return parseInt(val * `1.${percent > 9 ? "" : "0"}${percent}`);
};

export const getAuthUser = () => JSON.parse(localStorage.getItem("user")) || {};
