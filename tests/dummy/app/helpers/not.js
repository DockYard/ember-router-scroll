import Helper from '@ember/component/helper';

export default Helper.extend({
  compute([value]) {
    return !value;
  }
});
