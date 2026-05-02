import {
  OnChange
} from "./chunk-RK4FUDVS.js";
import {
  CommonModule,
  NgClass,
  NgIf
} from "./chunk-2GMDTTPZ.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injectable,
  Input,
  NgModule,
  Output,
  setClassMetadata,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext
} from "./chunk-XSHQ4XDA.js";
import "./chunk-4444AGEO.js";
import "./chunk-QV2ZGKU6.js";
import {
  __decorate,
  __metadata
} from "./chunk-2LR7EQIP.js";
import "./chunk-CPNXOV62.js";

// node_modules/ngx-bootstrap/alert/fesm2022/ngx-bootstrap-alert.mjs
var _c0 = ["*"];
function AlertComponent_ng_template_0_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 2);
    ɵɵlistener("click", function AlertComponent_ng_template_0_ng_template_1_Template_button_click_0_listener() {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.close());
    });
    ɵɵelementStart(1, "span", 3);
    ɵɵtext(2, "×");
    ɵɵelementEnd();
    ɵɵelementStart(3, "span", 4);
    ɵɵtext(4, "Close");
    ɵɵelementEnd()();
  }
}
function AlertComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 1);
    ɵɵtemplate(1, AlertComponent_ng_template_0_ng_template_1_Template, 5, 0, "ng-template", 0);
    ɵɵprojection(2);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵclassMap("alert alert-" + ctx_r1.type);
    ɵɵproperty("ngClass", ctx_r1.classes);
    ɵɵadvance();
    ɵɵproperty("ngIf", ctx_r1.dismissible);
  }
}
var _AlertConfig = class _AlertConfig {
  constructor() {
    this.type = "warning";
    this.dismissible = false;
    this.dismissOnTimeout = void 0;
  }
};
_AlertConfig.ɵfac = function AlertConfig_Factory(t) {
  return new (t || _AlertConfig)();
};
_AlertConfig.ɵprov = ɵɵdefineInjectable({
  token: _AlertConfig,
  factory: _AlertConfig.ɵfac,
  providedIn: "root"
});
var AlertConfig = _AlertConfig;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AlertConfig, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var _AlertComponent = class _AlertComponent {
  constructor(_config, changeDetection) {
    this.changeDetection = changeDetection;
    this.type = "warning";
    this.dismissible = false;
    this.isOpen = true;
    this.onClose = new EventEmitter();
    this.onClosed = new EventEmitter();
    this.classes = "";
    this.dismissibleChange = new EventEmitter();
    Object.assign(this, _config);
    this.dismissibleChange.subscribe(() => {
      this.classes = this.dismissible ? "alert-dismissible" : "";
      this.changeDetection.markForCheck();
    });
  }
  ngOnInit() {
    if (this.dismissOnTimeout) {
      setTimeout(() => this.close(), parseInt(this.dismissOnTimeout, 10));
    }
  }
  // todo: animation ` If the .fade and .in classes are present on the element,
  // the alert will fade out before it is removed`
  /**
   * Closes an alert by removing it from the DOM.
   */
  close() {
    if (!this.isOpen) {
      return;
    }
    this.onClose.emit(this);
    this.isOpen = false;
    this.changeDetection.markForCheck();
    this.onClosed.emit(this);
  }
};
_AlertComponent.ɵfac = function AlertComponent_Factory(t) {
  return new (t || _AlertComponent)(ɵɵdirectiveInject(AlertConfig), ɵɵdirectiveInject(ChangeDetectorRef));
};
_AlertComponent.ɵcmp = ɵɵdefineComponent({
  type: _AlertComponent,
  selectors: [["alert"], ["bs-alert"]],
  inputs: {
    type: "type",
    dismissible: "dismissible",
    dismissOnTimeout: "dismissOnTimeout",
    isOpen: "isOpen"
  },
  outputs: {
    onClose: "onClose",
    onClosed: "onClosed"
  },
  ngContentSelectors: _c0,
  decls: 1,
  vars: 1,
  consts: [[3, "ngIf"], ["role", "alert", 3, "ngClass"], ["type", "button", "aria-label", "Close", 1, "close", "btn-close", 3, "click"], ["aria-hidden", "true", 1, "visually-hidden"], [1, "sr-only", "visually-hidden"]],
  template: function AlertComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵtemplate(0, AlertComponent_ng_template_0_Template, 3, 4, "ng-template", 0);
    }
    if (rf & 2) {
      ɵɵproperty("ngIf", ctx.isOpen);
    }
  },
  dependencies: [NgClass, NgIf],
  encapsulation: 2,
  changeDetection: 0
});
var AlertComponent = _AlertComponent;
__decorate([OnChange(), __metadata("design:type", Object)], AlertComponent.prototype, "dismissible", void 0);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AlertComponent, [{
    type: Component,
    args: [{
      selector: "alert,bs-alert",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<ng-template [ngIf]="isOpen">
  <div [class]="'alert alert-' + type" role="alert" [ngClass]="classes">
    <ng-template [ngIf]="dismissible">
      <button type="button" class="close btn-close" aria-label="Close" (click)="close()">
        <span aria-hidden="true" class="visually-hidden">&times;</span>
        <span class="sr-only visually-hidden">Close</span>
      </button>
    </ng-template>
    <ng-content></ng-content>
  </div>
</ng-template>
`
    }]
  }], () => [{
    type: AlertConfig
  }, {
    type: ChangeDetectorRef
  }], {
    type: [{
      type: Input
    }],
    dismissible: [{
      type: Input
    }],
    dismissOnTimeout: [{
      type: Input
    }],
    isOpen: [{
      type: Input
    }],
    onClose: [{
      type: Output
    }],
    onClosed: [{
      type: Output
    }]
  });
})();
var _AlertModule = class _AlertModule {
  static forRoot() {
    return {
      ngModule: _AlertModule,
      providers: []
    };
  }
};
_AlertModule.ɵfac = function AlertModule_Factory(t) {
  return new (t || _AlertModule)();
};
_AlertModule.ɵmod = ɵɵdefineNgModule({
  type: _AlertModule,
  declarations: [AlertComponent],
  imports: [CommonModule],
  exports: [AlertComponent]
});
_AlertModule.ɵinj = ɵɵdefineInjector({
  imports: [CommonModule]
});
var AlertModule = _AlertModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AlertModule, [{
    type: NgModule,
    args: [{
      imports: [CommonModule],
      declarations: [AlertComponent],
      exports: [AlertComponent]
    }]
  }], null, null);
})();
export {
  AlertComponent,
  AlertConfig,
  AlertModule
};
//# sourceMappingURL=ngx-bootstrap_alert.js.map
