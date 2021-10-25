export function initialize(appInstance) {
  // Eagerly initialize service
  appInstance.lookup('service:router-scroll');
}

export default {
  initialize,
};
