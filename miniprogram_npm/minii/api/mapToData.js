const{storeMap:storeMap,notifyStack:notifyStack}=require("../constant"),{cloneObj:cloneObj}=require("../utils");module.exports=function(t){return function(n){const{onLoad:o,onUnload:a,attached:c,detached:e}=n;return n.onLoad=n.attached=function(n){const a=t.call(this,storeMap,n),e=cloneObj(a);notifyStack.push([this,t.bind(this),e,n]),this.setData(Object.assign({},this.data,a)),o&&o.call(this,n),c&&c.call(this,n)},n.onUnload=n.detached=function(){notifyStack.pop(),a&&a.call(this),e&&e.call(this)},n}};