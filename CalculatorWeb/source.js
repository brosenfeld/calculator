var r=function(a){function c(b,l){var e;if("undefined"===typeof b)e=c[0];else if("undefined"!==typeof l)if(10===+l)e=m(b);else{e=l;var a=c[0],h=c[1],d=b.length;if(2<=e&&36>=e&&d<=oa/Math.log(e))e=new f(parseInt(b,e));else{e=m(e);var d=[],k,u="-"===b[0];for(k=u?1:0;k<b.length;k++){var g=b[k].toLowerCase(),n=g.charCodeAt(0);if(48<=n&&57>=n)d.push(m(g));else if(97<=n&&122>=n)d.push(m(g.charCodeAt(0)-87));else if("<"===g){g=k;do k++;while(">"!==b[k]);d.push(m(b.slice(g+1,k)))}else throw Error(g+" is not a valid character");
}d.reverse();for(k=0;k<d.length;k++)a=a.add(d[k].s(h)),h=h.s(e);e=u?a.g():a}}else e=m(b);return e}function d(b,l){this.value=b;this.sign=l;this.f=!1}function f(b){this.value=b;this.sign=0>b;this.f=!0}function q(b){return-9007199254740992<b&&9007199254740992>b}function A(b){return 1E7>b?[b]:1E14>b?[b%1E7,Math.floor(b/1E7)]:[b%1E7,Math.floor(b/1E7)%1E7,Math.floor(b/1E14)]}function B(b){H(b);var l=b.length;if(4>l&&0>w(b,ba))switch(l){case 0:return 0;case 1:return b[0];case 2:return b[0]+1E7*b[1];default:return b[0]+
1E7*(b[1]+1E7*b[2])}return b}function H(b){for(var l=b.length;0===b[--l];);b.length=l+1}function L(b){for(var l=Array(b),e=-1;++e<b;)l[e]=0;return l}function E(b){return 0<b?Math.floor(b):Math.ceil(b)}function T(b,l){var e=b.length,a=l.length,h=Array(e),d=0,c,f;for(f=0;f<a;f++)c=b[f]+l[f]+d,d=1E7<=c?1:0,h[f]=c-1E7*d;for(;f<e;)c=b[f]+d,d=1E7===c?1:0,h[f++]=c-1E7*d;0<d&&h.push(d);return h}function I(b,l){return b.length>=l.length?T(b,l):T(l,b)}function M(b,l){var e=b.length,a=Array(e),d,c;for(c=0;c<
e;c++)d=b[c]-1E7+l,l=Math.floor(d/1E7),a[c]=d-1E7*l,l+=1;for(;0<l;)a[c++]=l%1E7,l=Math.floor(l/1E7);return a}function C(b,l){var a=b.length,d=l.length,h=Array(a),c=0,f,g;for(f=0;f<d;f++)g=b[f]-c-l[f],0>g?(g+=1E7,c=1):c=0,h[f]=g;for(f=d;f<a;f++){g=b[f]-c;if(0>g)g+=1E7;else{h[f++]=g;break}h[f]=g}for(;f<a;f++)h[f]=b[f];H(h);return h}function p(b,l,a){var c=b.length,h=Array(c);l=-l;var g,k;for(g=0;g<c;g++)k=b[g]+l,l=Math.floor(k/1E7),k%=1E7,h[g]=0>k?k+1E7:k;h=B(h);return"number"===typeof h?(a&&(h=-h),
new f(h)):new d(h,a)}function S(b,l){var a=b.length,d=l.length,h=L(a+d),c,f,g,n;for(g=0;g<a;++g){n=b[g];for(var m=0;m<d;++m)c=l[m],c=n*c+h[g+m],f=Math.floor(c/1E7),h[g+m]=c-1E7*f,h[g+m+1]+=f}H(h);return h}function J(b,l){var a=b.length,d=Array(a),c=0,f,g;for(g=0;g<a;g++)f=b[g]*l+c,c=Math.floor(f/1E7),d[g]=f-1E7*c;for(;0<c;)d[g++]=c%1E7,c=Math.floor(c/1E7);return d}function N(b,a){for(var e=[];0<a--;)e.push(0);return e.concat(b)}function F(b,a){var e=Math.max(b.length,a.length);if(400>=e)return S(b,
a);var e=Math.ceil(e/2),d=b.slice(e),c=b.slice(0,e),f=a.slice(e),g=a.slice(0,e),n=F(c,g),m=F(d,f),d=F(I(c,d),I(g,f));return I(I(n,N(C(C(d,n),m),e)),N(m,2*e))}function U(b,a,e){return 1E7>b?new d(J(a,b),e):new d(S(a,A(b)),e)}function V(b){var a=b.length,e=L(a+a),d,c,f,g;for(f=0;f<a;f++){g=b[f];for(var n=0;n<a;n++)d=b[n],d=g*d+e[f+n],c=Math.floor(d/1E7),e[f+n]=d-1E7*c,e[f+n+1]+=c}H(e);return e}function O(b,a){var e=b.length,d=L(e),c,f;f=0;for(e=e-1;0<=e;--e)f=1E7*f+b[e],c=E(f/a),f=f-c*a,d[e]=c|0;return[d,
f|0]}function x(b,a){var e,g=m(a),h=b.value;e=g.value;if(0===e)throw Error("Cannot divide by zero");if(b.f)return g.f?[new f(E(h/e)),new f(h%e)]:[c[0],b];if(g.f){if(1===e)return[b,c[0]];if(-1==e)return[b.g(),c[0]];e=Math.abs(e);if(1E7>e)return e=O(h,e),h=B(e[0]),e=e[1],b.sign&&(e=-e),"number"===typeof h?(b.sign!==g.sign&&(h=-h),[new f(h),new f(e)]):[new d(h,b.sign!==g.sign),new f(e)];e=A(e)}var n=w(h,e);if(-1===n)return[c[0],b];if(0===n)return[c[b.sign===g.sign?1:-1],c[0]];if(200>=h.length+e.length){var k=
e,u=h.length;e=k.length;var n=L(k.length),K=k[e-1],q=Math.ceil(1E7/(2*K)),h=J(h,q),k=J(k,q),t,v,p,y,x,z;h.length<=u&&h.push(0);k.push(0);K=k[e-1];for(t=u-e;0<=t;t--){u=Math.floor((1E7*h[t+e]+h[t+e-1])/K);p=v=0;x=k.length;for(y=0;y<x;y++)v+=u*k[y],z=Math.floor(v/1E7),p+=h[t+y]-(v-1E7*z),v=z,0>p?(h[t+y]=p+1E7,p=-1):(h[t+y]=p,p=0);for(;0!==p;){--u;for(y=v=0;y<x;y++)v+=h[t+y]-1E7+k[y],0>v?(h[t+y]=v+1E7,v=0):(h[t+y]=v,v=1);p+=v}n[t]=u}h=O(h,q)[0];h=[B(n),B(h)]}else{n=h.length;K=e.length;q=[];for(k=[];n;)if(k.unshift(h[--n]),
0>w(k,e))q.push(0);else{u=k.length;t=1E7*k[u-1]+k[u-2];v=1E7*e[K-1]+e[K-2];u>K&&(t=1E7*(t+1));u=Math.ceil(t/v);do{t=J(e,u);if(0>=w(t,k))break;u--}while(u);q.push(u);k=C(k,t)}q.reverse();h=[B(q),B(k)]}e=h;h=e[0];g=b.sign!==g.sign;e=e[1];n=b.sign;"number"===typeof h?(g&&(h=-h),h=new f(h)):h=new d(h,g);"number"===typeof e?(n&&(e=-e),e=new f(e)):e=new d(e,n);return[h,e]}function w(b,a){if(b.length!==a.length)return b.length>a.length?1:-1;for(var e=b.length-1;0<=e;e--)if(b[e]!==a[e])return b[e]>a[e]?1:
-1;return 0}function z(b){return("number"===typeof b||"string"===typeof b)&&1E7>=+Math.abs(b)||b instanceof d&&1>=b.value.length}function g(b,a,e){a=m(a);var d=b.i(),c=a.i(),f=d?b.not():b,g=c?a.not():a;a=[];b=[];for(var n=!1,p=!1;!n||!p;)f.m()?(n=!0,a.push(d?1:0)):d?a.push(f.w()?1:0):a.push(f.w()?0:1),g.m()?(p=!0,b.push(c?1:0)):c?b.push(g.w()?1:0):b.push(g.w()?0:1),f=f.Z(2),g=g.Z(2);d=[];for(c=0;c<a.length;c++)d.push(e(a[c],b[c]));for(e=r(d.pop()).g().s(r(2).pow(d.length));d.length;)e=e.add(r(d.pop()).s(r(2).pow(d.length)));
return e}function n(b,a){b=m(b);a=m(a);return b.U(a)?b:a}function ga(b,a){b=m(b);a=m(a);return b.Y(a)?b:a}function P(b,a){b=m(b).abs();a=m(a).abs();return b.M(a)?b:b.m()?a:a.m()?b:b.w()?a.ga()?P(b.j(2),a):P(b.j(2),a.j(2)).multiply(2):a.w()?P(b,a.j(2)):b.U(a)?P(b.G(a).j(2),a):P(a.G(b).j(2),b)}function ha(b){b=b.value;"number"===typeof b&&(b=[b]);return 1===b.length&&36>=b[0]?"0123456789abcdefghijklmnopqrstuvwxyz".charAt(b[0]):"<"+b+">"}function ia(b,a){a=r(a);if(a.m()){if(b.m())return"0";throw Error("Cannot convert nonzero numbers to base 0.");
}if(a.M(-1))return b.m()?"0":b.i()?Array(1-b).join("10"):"1"+Array(+b).join("01");var e="";b.i()&&a.ha()&&(e="-",b=b.abs());if(a.M(1))return b.m()?"0":e+Array(+b+1).join(1);for(var d=[],c=b,f;c.i()||0<=c.fa(a);)f=c.T(a),c=f.aa,f=f.W,f.i()&&(f=a.o(f).abs(),c=c.next()),d.push(ha(f));d.push(ha(c));return e+d.reverse().join("")}function ja(b){if(q(+b)){var a=+b;if(a===E(a))return new f(a);throw"Invalid integer: "+b;}(a="-"===b[0])&&(b=b.slice(1));var e=b.split(/e/i);if(2<e.length)throw Error("Invalid integer: "+
c.join("e"));if(2===e.length){b=e[1];"+"===b[0]&&(b=b.slice(1));b=+b;if(b!==E(b)||!q(b))throw Error("Invalid integer: "+b+" is not a valid exponent.");var c=e[0],e=c.indexOf(".");0<=e&&(b-=c.length-e,c=c.slice(0,e)+c.slice(e+1));if(0>b)throw Error("Cannot include negative exponent part for integers");b=c+=Array(b+1).join("0")}if(!/^([0-9][0-9]*)$/.test(b))throw Error("Invalid integer: "+b);for(var c=[],e=b.length,g=e-7;0<e;)c.push(+b.slice(g,e)),g-=7,0>g&&(g=0),e-=7;H(c);return new d(c,a)}function m(b){return"number"===
typeof b?q(b)?new f(b):ja(b.toString()):"string"===typeof b?ja(b):b}var ba=A(9007199254740992),oa=Math.log(9007199254740992);d.prototype.add=function(b){b=m(b);if(this.sign!==b.sign)return this.G(b.g());var a=this.value,e=b.value;return b.f?new d(M(a,Math.abs(e)),this.sign):new d(I(a,e),this.sign)};d.prototype.K=d.prototype.add;f.prototype.add=function(b){b=m(b);var a=this.value;if(0>a!==b.sign)return this.G(b.g());var e=b.value;if(b.f){if(q(a+e))return new f(a+e);e=A(Math.abs(e))}return new d(M(e,
Math.abs(a)),0>a)};f.prototype.K=f.prototype.add;d.prototype.G=function(b){var a=m(b);if(this.sign!==a.sign)return this.add(a.g());b=this.value;var e=a.value;a.f?b=p(b,Math.abs(e),this.sign):(a=this.sign,0<=w(b,e)?b=C(b,e):(b=C(e,b),a=!a),b=B(b),"number"===typeof b?(a&&(b=-b),b=new f(b)):b=new d(b,a));return b};d.prototype.o=d.prototype.G;f.prototype.G=function(b){b=m(b);var a=this.value;if(0>a!==b.sign)return this.add(b.g());var e=b.value;return b.f?new f(a-e):p(e,Math.abs(a),0<=a)};f.prototype.o=
f.prototype.G;d.prototype.g=function(){return new d(this.value,!this.sign)};f.prototype.g=function(){var b=new f(-this.value);b.sign=!this.sign;return b};d.prototype.abs=function(){return new d(this.value,!1)};f.prototype.abs=function(){return new f(Math.abs(this.value))};d.prototype.multiply=function(b){var a=m(b);b=this.value;var e=a.value,f=this.sign!==a.sign;if(a.f){if(0===e)return c[0];if(1===e)return this;if(-1===e)return this.g();a=Math.abs(e);if(1E7>a)return new d(J(b,a),f);e=A(a)}return 4E3<
b.length+e.length?new d(F(b,e),f):new d(S(b,e),f)};d.prototype.s=d.prototype.multiply;f.prototype._multiplyBySmall=function(b){return q(b.value*this.value)?new f(b.value*this.value):U(Math.abs(b.value),A(Math.abs(this.value)),this.sign!==b.sign)};d.prototype._multiplyBySmall=function(b){return 0===b.value?c[0]:1===b.value?this:-1===b.value?this.g():U(Math.abs(b.value),this.value,this.sign!==b.sign)};f.prototype.multiply=function(b){return m(b)._multiplyBySmall(this)};f.prototype.s=f.prototype.multiply;
d.prototype.ja=function(){return new d(V(this.value),!1)};f.prototype.ja=function(){var b=this.value*this.value;return q(b)?new f(b):new d(V(A(Math.abs(this.value))),!1)};d.prototype.T=function(b){b=x(this,b);return{aa:b[0],W:b[1]}};f.prototype.T=d.prototype.T;d.prototype.j=function(b){return x(this,b)[0]};f.prototype.Z=f.prototype.j=d.prototype.Z=d.prototype.j;d.prototype.O=function(b){return x(this,b)[1]};f.prototype.W=f.prototype.O=d.prototype.W=d.prototype.O;d.prototype.pow=function(b){var a=
m(b),e=this.value;b=a.value;var d;if(0===b)return c[1];if(0===e)return c[0];if(1===e)return c[1];if(-1===e)return a.w()?c[1]:c[-1];if(a.sign)return c[0];if(!a.f)throw Error("The exponent "+a.toString()+" is too large.");if(this.f&&q(d=Math.pow(e,b)))return new f(E(d));d=this;for(a=c[1];;){b&1&&(a=a.s(d),--b);if(0===b)break;b/=2;d=d.ja()}return a};f.prototype.pow=d.prototype.pow;d.prototype.fa=function(b){b=m(b);return b.f?1:w(this.value,b.value)};f.prototype.fa=function(b){b=m(b);var a=Math.abs(this.value),
e=b.value;return b.f?(e=Math.abs(e),a===e?0:a>e?1:-1):-1};d.prototype.compare=function(b){b=m(b);return this.sign!==b.sign?b.sign?1:-1:b.f?this.sign?-1:1:w(this.value,b.value)*(this.sign?-1:1)};f.prototype.compare=function(b){b=m(b);var a=this.value,e=b.value;return b.f?a==e?0:a>e?1:-1:0>a!==b.sign?0>a?-1:1:0>a?1:-1};d.prototype.M=function(b){return 0===this.compare(b)};f.prototype.M=d.prototype.M;d.prototype.U=function(b){return 0<this.compare(b)};f.prototype.U=d.prototype.U;d.prototype.Y=function(b){return 0>
this.compare(b)};f.prototype.Y=d.prototype.Y;d.prototype.w=function(){return 0===(this.value[0]&1)};f.prototype.w=function(){return 0===(this.value&1)};d.prototype.ga=function(){return 1===(this.value[0]&1)};f.prototype.ga=function(){return 1===(this.value&1)};d.prototype.ha=function(){return!this.sign};f.prototype.ha=function(){return 0<this.value};d.prototype.i=function(){return this.sign};f.prototype.i=function(){return 0>this.value};d.prototype.m=function(){return!1};f.prototype.m=function(){return 0===
this.value};d.prototype.next=function(){var b=this.value;return this.sign?p(b,1,this.sign):new d(M(b,1),this.sign)};f.prototype.next=function(){var b=this.value;return 9007199254740992>b+1?new f(b+1):new d(ba,!1)};d.prototype.prev=function(){var b=this.value;return this.sign?new d(M(b,1),!0):p(b,1,this.sign)};f.prototype.prev=function(){var b=this.value;return-9007199254740992<b-1?new f(b-1):new d(ba,!0)};for(var G=[1];1E7>=G[G.length-1];)G.push(2*G[G.length-1]);var W=G.length,ka=G[W-1];d.prototype.shiftLeft=
function(b){if(!z(b))return b.i()?this.L(b.abs()):this.s(c[2].pow(b));b=+b;if(0>b)return this.L(-b);for(var a=this;b>=W;)a=a.multiply(ka),b-=W-1;return a.multiply(G[b])};f.prototype.shiftLeft=d.prototype.shiftLeft;d.prototype.L=function(b){var a;if(!z(b)){if(b.i())return this.shiftLeft(b.abs());a=this.T(c[2].pow(b));return a.W.i()?a.aa.prev():a.aa}b=+b;if(0>b)return this.shiftLeft(-b);for(a=this;b>=W;){if(a.m())return a;a=x(a,ka);a=a[1].i()?a[0].prev():a[0];b-=W-1}a=x(a,G[b]);return a[1].i()?a[0].prev():
a[0]};f.prototype.L=d.prototype.L;d.prototype.not=function(){return this.g().prev()};f.prototype.not=d.prototype.not;d.prototype.u=function(b){return g(this,b,function(b,a){return b&a})};f.prototype.u=d.prototype.u;d.prototype.V=function(b){return g(this,b,function(b,a){return b|a})};f.prototype.V=d.prototype.V;d.prototype.ca=function(b){return g(this,b,function(b,a){return b^a})};f.prototype.ca=d.prototype.ca;d.prototype.toString=function(b){b===a&&(b=10);if(10!==b)return ia(this,b);b=this.value;
for(var d=b.length,e=String(b[--d]),c;0<=--d;)c=String(b[d]),e+="0000000".slice(c.length)+c;return(this.sign?"-":"")+e};f.prototype.toString=function(b){b===a&&(b=10);return 10!=b?ia(this,b):String(this.value)};d.prototype.valueOf=function(){return+this.toString()};f.prototype.valueOf=function(){return this.value};for(var Q=0;1E3>Q;Q++)c[Q]=new f(Q),0<Q&&(c[-Q]=new f(-Q));c.a=c[1];c.S=c[0];c.l=c[-1];c.max=n;c.min=ga;c.b=P;c.h=function(b,a){b=m(b).abs();a=m(a).abs();return b.multiply(a).j(P(b,a))};
c.c=function(b){return b instanceof d||b instanceof f};c.v=function(b,a){b=m(b);a=m(a);var e=ga(b,a),c=n(b,a).G(e);if(c.f)return e.add(Math.round(Math.random()*c));for(var f=[],g=!0,k=c.value.length-1;0<=k;k--){var p=g?c.value[k]:1E7,q=E(Math.random()*p);f.unshift(q);q<p&&(g=!1)}f=B(f);return e.add(new d(f,!1))};return c}();"undefined"!==typeof module&&module.hasOwnProperty("exports")&&(module.ma=r);var D={PLUS:function(a,c){return a.K(c)},MINUS:function(a,c){return a.o(c)},TIMES:function(a,c){return a.s(c)},DIVIDE:function(a,c){return a.j(c)},AND:function(a,c){return a.u(c)},OR:function(a,c){return a.V(c)},XOR:function(a,c){return a.ca(c)},MOD:function(a,c){return a.O(c)},LEFT_SHIFT:function(a,c,d){aa(c,d);return a.shiftLeft(c)},RIGHT_SHIFT:function(a,c,d){aa(c,d);return a.L(c)},LOGICAL_RIGHT_SHIFT:function(a,c,d){aa(c,d);d=r(2).pow(d-c).o(1);return a.L(c).u(d)},ROTATE_LEFT:function(a,c,d){var f=
c.O(d).K(d).O(d).valueOf();c=r(d-f);var q=r(2).pow(d).o(1),f=a.shiftLeft(f).u(q);a=D.LOGICAL_RIGHT_SHIFT(a,c,d);return f.V(a)}};var R={NOT:function(a){return a.not()}};function ca(a){if(a.l in D){var c=D[a.l];try{var d=c(a.b,a.a,a.c);a.b=a.X(d);return!0}catch(f){return a.H=f.message,!1}}}
function da(a,c){if("ALL_CLEAR"==c)a.ba=!0,a.J=!0,a.P=!0,a.H=null;else if("CLEAR"==c)null===a.H&&(a.a=r.S),a.H=null;else{if(null!==a.H)return!1;if("DEL"==c)a.a=(a.N&&0>a.a.compare(0)?X(a.a,a.c):a.a).j(a.v);else if("EQUALS"==c&&null!==a.l){if(a.l in D&&!ca(a))return!1;a.J=!0;a.P=!0}else if("PLUS_MINUS"==c&&a.I)a.h?a.a=a.a.g():null!==a.l?(a.a=r.S.g(),a.h=!0):a.b=a.b.g();else if(c in D){if(a.h)if(null!==a.l&&a.l in D){if(!ca(a))return!1}else a.b=a.a;a.l=c;a.J=!0}else if(c in R)if(null===a.l)a.b=a.X(R[c](a.h?
a.a:a.b)),a.J=!0;else if(a.h)a.a=a.X(R[c](a.a));else{var d=R[c](a.b);a.b=a.X(d);a.P=!0}else return!1}a.ea();return!0};function X(a,c){return 0<=a.compare(0)?a:r(2).pow(c).K(a)}function ea(a,c){return 0>a.compare(0)?a:a.o(r(2).pow(c))}function fa(a,c,d){var f=r(2).pow(d).o(1);a=X(a,c).u(f);return la(a,d)}function la(a,c){var d=r(2).pow(c-1).o(1);return 0<a.compare(d)?ea(a,c):a}function aa(a,c){if(a.i()||0<a.compare(c))throw new RangeError("Shift out of range");};function ma(){$(".bin_row").css("color","#C0C0C0");$(".bits0-7").css("color","#C0C0C0");$(".bin16").css("color","#C0C0C0");$(".bin32").css("color","#C0C0C0")}function Y(){$(this).css("color","black")}
var na={0:"0000",1:"0001",2:"0010",3:"0011",4:"0100",5:"0101",6:"0110",7:"0111",8:"1000",9:"1001",A:"1010",B:"1011",C:"1100",D:"1101",E:"1110",F:"1111"},Z={48:$("#zero"),49:$("#one"),50:$("#two"),51:$("#three"),52:$("#four"),53:$("#five"),54:$("#six"),55:$("#seven"),56:$("#eight"),57:$("#nine"),65:$("#a"),66:$("#b"),67:$("#c"),68:$("#d"),69:$("#e"),70:$("#f"),96:$("#zero"),97:$("#one"),98:$("#two"),99:$("#three"),100:$("#four"),101:$("#five"),102:$("#six"),103:$("#seven"),104:$("#eight"),105:$("#nine"),
8:$("#DEL"),13:$("#EQUALS"),27:$("#ALL_CLEAR"),88:$("#TIMES"),106:$("#TIMES"),107:$("#PLUS"),109:$("#MINUS"),111:$("#DIVIDE"),187:$("#EQUALS"),188:$("#LEFT_SHIFT"),189:$("#MINUS"),190:$("#RIGHT_SHIFT"),191:$("#DIVIDE"),220:$("#OR")},pa={48:$("#double_zero"),49:$("#NOT"),53:$("#MOD"),54:$("#XOR"),55:$("#AND"),56:$("#TIMES"),65:$("#ALL_CLEAR"),67:$("#CLEAR"),70:$("#double_f"),96:$("#double_zero"),187:$("#PLUS"),190:$("#LOGICAL_RIGHT_SHIFT"),192:$("#PLUS_MINUS")};new function(a){function c(c){var d=Math.min(c.length,a.c/4);for(i=0;i<d;i++){var f=c.charAt(d-1-i);$(".hex"+i).text(na[f])}for(i=d;16>i;i++)$(".hex"+i).text(na["0"])}function d(d,f,p){var q=d.m()&&d.sign?"-0":d.toString(10);$("#dec > .values > ."+f).text(q);d=0>d?X(d,a.c).toString(16).toUpperCase():d.toString(16).toUpperCase();$("#hex > .values > ."+f).text(d);p&&c(d)}function f(a){$("#dec > .values > ."+a).text("");$("#hex > .values > ."+a).text("")}function q(){w=!1;$(".num_disabled").each(F);
$(".op_disabled").each(C);$(U).click();$(V).click();S()}function A(){f("error_text");if(null!==a.H){var g=a.H;$(".error_text").text(g);f("acc");f("operand");f("operator");$(".operand").removeClass("text_large");$(".acc").addClass("text_large");c("0");$(".num_enabled").each(N);$(".op_enabled").each(p);$("#ALL_CLEAR").each(C);$("#CLEAR").each(C);w=!0}else null!==a.l&&a.h?(d(a.b,"acc",!1),d(a.a,"operand",!0),$(".operator").text(z.text()),$(".operand").removeClass("text_large"),$(".acc").removeClass("text_large")):
a.h?(f("acc"),f("operator"),d(a.a,"operand",!0),$(".operand").addClass("text_large")):(f("operand"),f("operator"),d(a.b,"acc",!0),$(".acc").addClass("text_large"))}function B(){null!==z&&(z.css("color","white"),z=null)}function H(a){a.preventDefault();$(this).removeClass("num_inactive");$(this).addClass("num_active")}function L(d){d.preventDefault();$(this).removeClass("num_active");$(this).addClass("num_inactive");var c=$(this).text();a.N?(a.h=!0,0>a.a.compare(r.S)||(d=parseInt("0x"+c),d>=Math.pow(a.v,
c.length)||(c=a.a.s(Math.pow(a.v,c.length)),c=c.K(d),0>=c.compare(a.R)&&(a.I&&0<c.compare(a.ka)?a.a=ea(c,a.c):a.a=c)))):(d=parseInt(c),0>d||d>a.v||(a.h=!0,c=a.a.s(a.v),c=a.a.sign?c.o(d):c.K(d),a.I?0<=c.compare(a.la)&&0>=c.compare(a.ka)&&(a.a=c):0>=c.compare(a.R)&&(a.a=c)));A();a.h&&(O||J(),x&&($("#EQUALS").each(C),x=!1))}function E(a){a.preventDefault();$(this).removeClass("op_inactive");$(this).addClass("op_active")}function T(c){c.preventDefault();$(this).removeClass("op_active");$(this).addClass("op_inactive");
c=$(this).attr("id");da(a,c)&&("ALL_CLEAR"==c?(w&&q(),x=!1,$("#EQUALS").each(p),B()):"CLEAR"==c&&w?(q(),z.css("color","#FF8F00"),J()):"EQUALS"==c?($("#EQUALS").each(p),B()):c in D?(B(),z=$(this),z.css("color","#FF8F00"),x=!0):c in R&&(a.h||B()));O&&!a.h&&S();A()}function I(){$(this).off("mouseup").off("mousedown");$(this).off("touchstart").off("touchend");$(this).mousedown(H).mouseup(L);$(this).on("touchstart",H);$(this).on("touchend",L)}function M(){$(this).off("mouseup").off("mousedown");$(this).off("touchstart").off("touchend");
$(this).mousedown(E).mouseup(T);$(this).on("touchstart",E);$(this).on("touchend",T)}function C(){$(this).css("color","");$(this).removeClass("op_disabled");$(this).addClass("op_enabled");$(this).each(M)}function p(){$(this).css("color","");$(this).removeClass("op_enabled");$(this).addClass("op_disabled");$(this).off("mouseup").off("mousedown");$(this).off("touchstart").off("touchend")}function S(){O=!1;$("#CLEAR").each(p);$("#DEL").each(p)}function J(){O=!0;$("#CLEAR").each(C);$("#DEL").each(C)}function N(){$(this).removeClass("num_enabled");
$(this).addClass("num_disabled");$(this).off("mouseup").off("mousedown");$(this).off("touchstart").off("touchend")}function F(){$(this).removeClass("num_disabled");$(this).addClass("num_enabled");$(this).each(I)}var U="#hex",V="#signed",O=!1,x=!1,w=!1,z=null;$(".sign").click(function(){if(!w){V="#"+$(this).attr("id");$(".sign").css("color","white");$(this).css("color","#FF8F00");var c="signed"==$(this).text();c?$(".op_signed").each(C):$(".op_signed").each(p);a.I!=c&&(c?(a.b=la(a.b,a.c),a.a=la(a.a,
a.c)):(a.b=X(a.b,a.c),a.a=X(a.a,a.c)),a.I=c);A()}});$(".bit_length").click(function(){if(!w){$(".bit_length").css("color","white");$(this).css("color","#FF8F00");var c=parseInt($(this).text());switch(c){case 8:ma();$(".bin_label16").each(Y);$(".bits0-7").each(Y);break;case 16:ma();$(".bits0-7").each(Y);$(".bin16").each(Y);break;case 32:ma();$(".bits0-7").each(Y);$(".bin16").each(Y);$(".bin32").each(Y);break;default:$(".bin_row").each(Y),$(".bits0-7").each(Y),$(".bin16").each(Y),$(".bin32").each(Y)}var d=
a.c;a.c=c;a.da();a.I?a.c<d&&(a.b=fa(a.b,d,a.c),a.a=fa(a.a,d,a.c)):(a.b=a.b.u(a.R),a.a=a.a.u(a.R));A()}});$(" .num_inactive ").each(I);$(" .op_inactive  ").each(M);$(".base").click(function(){if(!w)switch($(".base").css("background-color","white"),$(this).css("background-color","#FFD299"),U="#"+$(this).attr("id"),$(this).attr("id")){case "bin":$(".dec").each(N);$(".hex").each(N);a.v=2;a.N=!0;break;case "dec":$(".dec").each(F);$(".hex").each(N);a.v=10;a.N=!1;break;case "hex":$(".dec").each(F),$(".hex").each(F),
a.v=16,a.N=!0}});$(document).keydown(function(a){a.shiftKey&&a.which in pa?(this.ia=!0,pa[a.which].trigger("mousedown")):a.which in Z&&Z[a.which].trigger("mousedown")});$(document).keyup(function(a){(a.shiftKey||this.ia)&&a.which in pa?(pa[a.which].trigger("mouseup"),this.ia=!1):a.which in Z&&Z[a.which].trigger("mouseup")});$("#hex").click();$("#signed").click();$("#bit64").click();$("#EQUALS").each(p);A()}(new function(){this.N=!0;this.v=16;this.c=64;this.P=this.J=this.ba=this.I=!0;this.H=null;this.da=
function(){this.ka=r(2).pow(this.c-1).o(1);this.la=r(2).pow(this.c-1).s(-1);this.R=r(2).pow(this.c).o(1)};this.ea=function(){this.J&&(this.a=r.S,this.h=this.J=!1);this.ba&&(this.b=r.S,this.ba=!1);this.P&&(this.l=null,this.P=!1)};this.X=function(a){return this.I?fa(a,this.c,this.c):a.u(this.R)};this.da();this.ea()});