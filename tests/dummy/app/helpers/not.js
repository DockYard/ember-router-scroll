import Helper from '@ember/component/helper';

export default class extends Helper {
  compute([value]) {
    return !value;
  }
}
