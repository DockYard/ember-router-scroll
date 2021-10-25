import Controller from '@ember/controller';

export default class extends Controller {
  queryParams = ['small', 'preserveScrollPosition'];
  small = false;
}
