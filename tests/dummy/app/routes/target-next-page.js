import Route from '@ember/routing/route';
import config from 'dummy/config/environment';

export default Route.extend({
  init() {
    this._super(...arguments);

    this.originalConfig = config.routerScroll;
    config['routerScroll'] = {
      targetElement: '#main'
    };
  },

  willDestroy() {
    config['routerScroll'] = this.originalConfig;
  }
});
