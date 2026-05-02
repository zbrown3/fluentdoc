import {
  HttpClient,
  HttpParams
} from "./chunk-CRA3OS5W.js";
import "./chunk-2GMDTTPZ.js";
import {
  Directive,
  ElementRef,
  EventEmitter,
  Injectable,
  Input,
  NgModule,
  NgZone,
  Output,
  setClassMetadata,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject
} from "./chunk-XSHQ4XDA.js";
import {
  fromEvent
} from "./chunk-4444AGEO.js";
import "./chunk-QV2ZGKU6.js";
import {
  Subject,
  filter,
  takeUntil
} from "./chunk-2LR7EQIP.js";
import {
  __commonJS,
  __toESM
} from "./chunk-CPNXOV62.js";

// node_modules/file-saver/dist/FileSaver.min.js
var require_FileSaver_min = __commonJS({
  "node_modules/file-saver/dist/FileSaver.min.js"(exports, module) {
    (function(a, b) {
      if ("function" == typeof define && define.amd)
        define([], b);
      else if ("undefined" != typeof exports)
        b();
      else {
        b(), a.FileSaver = { exports: {} }.exports;
      }
    })(exports, function() {
      "use strict";
      function b(a2, b2) {
        return "undefined" == typeof b2 ? b2 = { autoBom: false } : "object" != typeof b2 && (console.warn("Deprecated: Expected third argument to be a object"), b2 = { autoBom: !b2 }), b2.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a2.type) ? new Blob(["\uFEFF", a2], { type: a2.type }) : a2;
      }
      function c(a2, b2, c2) {
        var d2 = new XMLHttpRequest();
        d2.open("GET", a2), d2.responseType = "blob", d2.onload = function() {
          g(d2.response, b2, c2);
        }, d2.onerror = function() {
          console.error("could not download file");
        }, d2.send();
      }
      function d(a2) {
        var b2 = new XMLHttpRequest();
        b2.open("HEAD", a2, false);
        try {
          b2.send();
        } catch (a3) {
        }
        return 200 <= b2.status && 299 >= b2.status;
      }
      function e(a2) {
        try {
          a2.dispatchEvent(new MouseEvent("click"));
        } catch (c2) {
          var b2 = document.createEvent("MouseEvents");
          b2.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null), a2.dispatchEvent(b2);
        }
      }
      var f = "object" == typeof window && window.window === window ? window : "object" == typeof self && self.self === self ? self : "object" == typeof global && global.global === global ? global : void 0, a = f.navigator && /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent), g = f.saveAs || ("object" != typeof window || window !== f ? function() {
      } : "download" in HTMLAnchorElement.prototype && !a ? function(b2, g2, h) {
        var i = f.URL || f.webkitURL, j = document.createElement("a");
        g2 = g2 || b2.name || "download", j.download = g2, j.rel = "noopener", "string" == typeof b2 ? (j.href = b2, j.origin === location.origin ? e(j) : d(j.href) ? c(b2, g2, h) : e(j, j.target = "_blank")) : (j.href = i.createObjectURL(b2), setTimeout(function() {
          i.revokeObjectURL(j.href);
        }, 4e4), setTimeout(function() {
          e(j);
        }, 0));
      } : "msSaveOrOpenBlob" in navigator ? function(f2, g2, h) {
        if (g2 = g2 || f2.name || "download", "string" != typeof f2)
          navigator.msSaveOrOpenBlob(b(f2, h), g2);
        else if (d(f2))
          c(f2, g2, h);
        else {
          var i = document.createElement("a");
          i.href = f2, i.target = "_blank", setTimeout(function() {
            e(i);
          });
        }
      } : function(b2, d2, e2, g2) {
        if (g2 = g2 || open("", "_blank"), g2 && (g2.document.title = g2.document.body.innerText = "downloading..."), "string" == typeof b2)
          return c(b2, d2, e2);
        var h = "application/octet-stream" === b2.type, i = /constructor/i.test(f.HTMLElement) || f.safari, j = /CriOS\/[\d]+/.test(navigator.userAgent);
        if ((j || h && i || a) && "undefined" != typeof FileReader) {
          var k = new FileReader();
          k.onloadend = function() {
            var a2 = k.result;
            a2 = j ? a2 : a2.replace(/^data:[^;]*;/, "data:attachment/file;"), g2 ? g2.location.href = a2 : location = a2, g2 = null;
          }, k.readAsDataURL(b2);
        } else {
          var l = f.URL || f.webkitURL, m = l.createObjectURL(b2);
          g2 ? g2.location = m : location.href = m, g2 = null, setTimeout(function() {
            l.revokeObjectURL(m);
          }, 4e4);
        }
      });
      f.saveAs = g.saveAs = g, "undefined" != typeof module && (module.exports = g);
    });
  }
});

// node_modules/ngx-filesaver/fesm2022/ngx-filesaver.mjs
var import_file_saver = __toESM(require_FileSaver_min(), 1);
var isFileSaverSupported;
try {
  isFileSaverSupported = !!new Blob();
} catch {
  isFileSaverSupported = false;
}
var _FileSaverService = class _FileSaverService {
  get isFileSaverSupported() {
    return isFileSaverSupported;
  }
  genType(fileName) {
    if (!fileName || fileName.lastIndexOf(".") === -1) {
      return "text/plain";
    }
    const type = fileName.substring(fileName.lastIndexOf(".") + 1);
    switch (type) {
      case "txt":
        return "text/plain";
      case "xml":
      case "html":
        return `text/${type}`;
      case "json":
        return "octet/stream";
      default:
        return `application/${type}`;
    }
  }
  save(blob, fileName, filtType, option) {
    if (!blob) {
      throw new Error("Data argument should be a blob instance");
    }
    const file = new Blob([blob], {
      type: filtType || blob.type || this.genType(fileName)
    });
    (0, import_file_saver.saveAs)(file, decodeURI(fileName || "download"), option);
  }
  saveText(txt, fileName, option) {
    const blob = new Blob([txt]);
    this.save(blob, fileName, void 0, option);
  }
};
_FileSaverService.ɵfac = function FileSaverService_Factory(t) {
  return new (t || _FileSaverService)();
};
_FileSaverService.ɵprov = ɵɵdefineInjectable({
  token: _FileSaverService,
  factory: _FileSaverService.ɵfac,
  providedIn: "root"
});
var FileSaverService = _FileSaverService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FileSaverService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var _FileSaverDirective = class _FileSaverDirective {
  constructor(ngZone, el, fss, httpClient) {
    this.ngZone = ngZone;
    this.el = el;
    this.fss = fss;
    this.httpClient = httpClient;
    this.method = "GET";
    this.success = new EventEmitter();
    this.error = new EventEmitter();
    this.destroy$ = new Subject();
    if (!fss.isFileSaverSupported) {
      el.nativeElement.classList.add(`filesaver__not-support`);
    }
  }
  ngOnInit() {
    this.ngZone.runOutsideAngular(() => this.setupClickListener());
  }
  ngOnDestroy() {
    this.destroy$.next();
  }
  getName(res) {
    return decodeURI(this.fileName || res.headers.get("filename") || res.headers.get("x-filename") || "");
  }
  setDisabled(status) {
    const el = this.el.nativeElement;
    el.disabled = status;
    el.classList[status ? "add" : "remove"](`filesaver__disabled`);
  }
  setupClickListener() {
    fromEvent(this.el.nativeElement, "click").pipe(filter(() => this.fss.isFileSaverSupported), takeUntil(this.destroy$)).subscribe(() => {
      let req = this.http;
      if (!req) {
        let params = new HttpParams();
        const query = this.query || {};
        for (const item in query) {
          params = params.set(item, query[item]);
        }
        req = this.httpClient.request(this.method, this.url, {
          observe: "response",
          responseType: "blob",
          headers: this.header,
          params
        });
      }
      this.setDisabled(true);
      req.pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          if (response.status !== 200 || response.body.size <= 0) {
            this.emitIfHasObservers(this.error, response);
            return;
          }
          this.fss.save(response.body, this.getName(response), void 0, this.fsOptions);
          this.emitIfHasObservers(this.success, response);
        },
        error: (error) => this.emitIfHasObservers(this.error, error),
        complete: () => this.setDisabled(false)
      });
    });
  }
  emitIfHasObservers(emitter, value) {
    if (hasObservers(emitter)) {
      this.ngZone.run(() => emitter.emit(value));
    }
  }
};
_FileSaverDirective.ɵfac = function FileSaverDirective_Factory(t) {
  return new (t || _FileSaverDirective)(ɵɵdirectiveInject(NgZone), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(FileSaverService), ɵɵdirectiveInject(HttpClient));
};
_FileSaverDirective.ɵdir = ɵɵdefineDirective({
  type: _FileSaverDirective,
  selectors: [["", "fileSaver", ""]],
  inputs: {
    method: "method",
    http: "http",
    query: "query",
    header: "header",
    url: "url",
    fileName: "fileName",
    fsOptions: "fsOptions"
  },
  outputs: {
    success: "success",
    error: "error"
  },
  exportAs: ["fileSaver"],
  standalone: true
});
var FileSaverDirective = _FileSaverDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FileSaverDirective, [{
    type: Directive,
    args: [{
      selector: "[fileSaver]",
      exportAs: "fileSaver",
      standalone: true
    }]
  }], () => [{
    type: NgZone
  }, {
    type: ElementRef
  }, {
    type: FileSaverService
  }, {
    type: HttpClient
  }], {
    method: [{
      type: Input
    }],
    http: [{
      type: Input
    }],
    query: [{
      type: Input
    }],
    header: [{
      type: Input
    }],
    url: [{
      type: Input,
      args: [{
        required: true
      }]
    }],
    fileName: [{
      type: Input
    }],
    fsOptions: [{
      type: Input
    }],
    success: [{
      type: Output
    }],
    error: [{
      type: Output
    }]
  });
})();
function hasObservers(subject) {
  return subject.observed ?? subject.observers.length > 0;
}
var _FileSaverModule = class _FileSaverModule {
};
_FileSaverModule.ɵfac = function FileSaverModule_Factory(t) {
  return new (t || _FileSaverModule)();
};
_FileSaverModule.ɵmod = ɵɵdefineNgModule({
  type: _FileSaverModule,
  imports: [FileSaverDirective],
  exports: [FileSaverDirective]
});
_FileSaverModule.ɵinj = ɵɵdefineInjector({});
var FileSaverModule = _FileSaverModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FileSaverModule, [{
    type: NgModule,
    args: [{
      imports: [FileSaverDirective],
      exports: [FileSaverDirective]
    }]
  }], null, null);
})();
export {
  FileSaverDirective,
  FileSaverModule,
  FileSaverService
};
//# sourceMappingURL=ngx-filesaver.js.map
