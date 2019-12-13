import { isFunction } from '../../shared/util';

export function initUse(Vue) {
  Vue.use = function (plugin, ...params) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []));

    if (installedPlugins.indexOf(plugin) > -1) {
      return this;
    }

    params.unshift(this);
    if (isFunction(plugin && plugin.install)) {
      plugin.install(...params);
    }
    else if (isFunction(plugin)) {
      plugin(...params);
    }
    installedPlugins.push(plugin);

    return this;
  };
}
