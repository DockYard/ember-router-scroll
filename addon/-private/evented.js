import Notifier from './notifier';

// in lieue of a decorator, lets just use Mixin/composition pattern
export function addEvented(Base) {
  return class extends Base {
    onEvent(eventName, listener) {
      return notifierForEvent(this, eventName).addListener(listener);
    }

    offEvent(eventName, listener) {
      return notifierForEvent(this, eventName).removeListener(listener);
    }

    triggerEvent(eventName, ...args) {
      const notifier = notifierForEvent(this, eventName);
      if (notifier) {
        notifier.trigger.apply(notifier, args);
      }
    }
  }
}

function notifierForEvent(
  object,
  eventName
) {
  if (object._eventedNotifiers === undefined) {
    object._eventedNotifiers = {};
  }

  let notifier = object._eventedNotifiers[eventName];

  if (!notifier) {
    notifier = object._eventedNotifiers[eventName] = new Notifier();
  }

  return notifier;
}
